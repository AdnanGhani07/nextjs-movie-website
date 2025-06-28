// app/page.js
import Results from "@/components/Results";
import AnimeResults from "@/components/AnimeResults";
import MangaResults from "@/components/MangaResults";

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

    return (
      <div className="bg-neutral-100 dark:bg-[#121212] pt-6 px-4 sm:px-8 lg:px-16">
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
