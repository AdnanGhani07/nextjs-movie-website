import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import { connect } from "@/lib/mongodb/mongoose";
import HomePageContent from "@/lib/models/homePageContent.model";

const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const generateHomePageContent = inngest.createFunction(
  { name: "Generate Home Page Content" },
  { cron: "0 0 * * 0" }, // Run every sunday at midnight
  async ({ event, step }) => {
    const trendingMoviesResult = await step.run(
      "fetch-trending-movies",
      async () => {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1&language=en-US`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        return data.results;
      }
    );

    const prompt = `Analyze these movies: ${JSON.stringify(
      trendingMoviesResult
    )} and provide a title and description in only the following JSON format

    (and add a link for each movie with this address 'movie/{
      movie.id
    }' with html format like this
     <a class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent
      hover:underline" href="movie/{movie.id}">Movie Title</a>
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

    const googleGeminiResults = await step.ai.wrap(
      "gemini",
      async (p) => {
        return await model.generateContent(p);
      },
      prompt
    );

    const text = googleGeminiResults.response.candidates[0].content.parts[0].text || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const homePageContentFromGoogleGemini = JSON.parse(cleanedText);

    // Save the generated content to the database which is MongoDB

    const createOrUpdateHomePageContent = async (title, description) => {
      try {
        await connect();
        const HomePageContentUpdate = await HomePageContent.findOneAndUpdate(
          { updatedBy: "inngest" },
          {
            $set: {
              title,
              description,
              updatedBy: "inngest",
            },
          },
          { new: true, upsert: true }
        );
        return HomePageContentUpdate;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create or update home page content");
      }
    };

    await step.run("Create or Update Home Page Content", async () => {
      await createOrUpdateHomePageContent(
        homePageContentFromGoogleGemini.title,
        homePageContentFromGoogleGemini.description
      );
    });
  }
);
