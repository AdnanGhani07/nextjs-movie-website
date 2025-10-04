// app/page.js
import Results from "@/components/Results";
import AnimeResults from "@/components/AnimeResults";
import MangaResults from "@/components/MangaResults";
import parse from "html-react-parser";

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }) {
  const search = await searchParams;
  const page = parseInt(search?.page || "1", 10);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}&api_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    const results = data.results;
    const totalPages = data.total_pages;

    let homePageContent = null;

    try {
      const homePageContentResults = await fetch(
        "http://localhost:3000/api/homepagecontent/get",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!homePageContentResults.ok) {
        throw new Error(`Failed to fetch data`);
      }

      const text = await homePageContentResults.text();
      if (text) {
        homePageContent = JSON.parse(text)[0] || null;
      } else {
        console.log("Empty Response");
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
    return (
      <div className="bg-neutral-100 dark:bg-[#121212] pt-6 px-4 sm:px-8 lg:px-16">
        {homePageContent && (
          <div className="text-center mb-10 max-w-6xl mx-auto py-10">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              {homePageContent.title}
            </h1>
            <div className="sm:text-large p-4 font-semibold text-justify">
              {parse(homePageContent.description)}
            </div>
          </div>
        )}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-pink-400 mb-6 tracking-tight">
            🎬 Top Rated Movies
          </h1>
          <Results
            results={results}
            currentPage={page}
            totalPages={totalPages}
            genre="top_rated"
          />
        </section>

        <section className="mb-12 border-t border-blue-500 dark:border-pink-500 pt-10">
          <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-pink-400 mb-6">
            🍥 Popular Anime
          </h1>
          <AnimeResults />
        </section>

        <section className="mb-12 border-t border-blue-500 dark:border-pink-500 pt-10">
          <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-pink-400 mb-6">
            📚 Trending Manga
          </h1>
          <MangaResults />
        </section>
      </div>
    );
  } catch (error) {
    console.error("Fetch failed:", error);
    return (
      <div className="text-red-500 text-center mt-10 bg-neutral-100 dark:bg-[#121212]">
        Error loading data. Please try again later.
      </div>
    );
  }
}
