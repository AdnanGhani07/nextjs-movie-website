import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max execution for serverless

const API_KEY = process.env.API_KEY;

export async function GET(request: Request) {
  try {
    // 1. Validate Cron Secret Authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Allow Vercel Cron header or Bearer token
    const isVercelCron = request.headers.get("x-vercel-cron") === "1";
    const isAuthorized =
      isVercelCron ||
      (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
      process.env.NODE_ENV === "development";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Trending Movies from TMDB
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1&language=en-US`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch movies from TMDB: ${res.status}`);
    }

    const data = await res.json();
    const trendingMovies = data.results || [];

    // 3. Generate AI summary using Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze these movies: ${JSON.stringify(
      trendingMovies.slice(0, 10)
    )} and provide a title and description in only the following JSON format

    (and add a link for each movie with this address 'movie/{movie.id}' with html format like this:
     <a class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="movie/{movie.id}">Movie Title</a>
    ):
    {
      "title": "Exciting Movie Title with 50 characters",
      "description": "Exciting Movie Description with at least 200 characters"
    }
      IMPORTANT POINTS TO FOLLOW: Return ONLY the JSON. No additional text, notes.
      Include at least 150 characters for description.
      Include at least 50 characters for title.
      Make absolutely sure to use the template I provided to showcase the names of the top 4-5 movies with interesting information about them along with specified html anchor tag above
    `;

    const geminiResult = await model.generateContent(prompt);
    const text =
      geminiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const parsedContent = JSON.parse(cleanedText);

    // 4. Save to Supabase using Admin Client
    const supabase = createAdminClient();

    // Check if an existing row exists to update or insert
    const { data: existingRows } = await supabase
      .from("home_page_content")
      .select("id")
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      const { error: updateError } = await supabase
        .from("home_page_content")
        .update({
          title: parsedContent.title,
          description: parsedContent.description,
          updated_by: "cron",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRows[0].id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("home_page_content")
        .insert({
          title: parsedContent.title,
          description: parsedContent.description,
          updated_by: "cron",
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Home page content generated and saved to Supabase",
      data: parsedContent,
    });
  } catch (error: any) {
    console.error("Cron execution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
