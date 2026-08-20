import Results from "@/components/Results";
import AnimeResults from "@/components/AnimeResults";
import MangaResults from "@/components/MangaResults";
import Hero from "@/components/Hero";
import parse from "html-react-parser";
import { createClient } from "@/lib/supabase/server";
import { TMDBMovie } from "@/types";
import { fetchTMDB, FALLBACK_MOVIES } from "@/lib/tmdb";
import Link from "next/link";
import { FiTrendingUp, FiTv, FiBookOpen } from "react-icons/fi";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface HomePageContentData {
  id?: string;
  title: string;
  description: string;
}

export default async function Home({ searchParams }: PageProps) {
  const search = await searchParams;
  const page = parseInt(typeof search?.page === "string" ? search.page : "1", 10);

  let results: TMDBMovie[] = [];
  let totalPages = 1;

  const data = await fetchTMDB<{ results: TMDBMovie[]; total_pages: number }>(
    "/movie/popular",
    { page }
  );

  if (data?.results && data.results.length > 0) {
    results = data.results;
    totalPages = data.total_pages || 1;
  } else {
    results = FALLBACK_MOVIES;
  }

  let homePageContent: HomePageContentData | null = null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data } = await supabase
        .from("home_page_content")
        .select("id, title, description")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      homePageContent = data;
    }
  } catch (error) {
    console.error("Error fetching homepage content from Supabase:", error);
  }

  return (
    <div className="space-y-12">
      {/* Dynamic Featured Hero Carousel */}
      <Hero movie={results[0]} />

      {/* AI Spotlight / Highlights */}
      {homePageContent && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              AI CinePulse Weekly Spotlight
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 text-zinc-100">
              {homePageContent.title}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed prose prose-invert max-w-none">
              {parse(homePageContent.description || "")}
            </div>
          </div>
        </section>
      )}

      {/* 🎬 Trending Movies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-yellow-400 text-lg" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Trending Movies
            </h2>
          </div>
          <Link
            href="/movie/top/trending"
            className="text-xs font-semibold text-zinc-400 hover:text-yellow-400 transition"
          >
            See All →
          </Link>
        </div>
        <Results
          results={results.slice(0, 10)}
          currentPage={page}
          totalPages={totalPages}
          genre="top_rated"
        />
      </section>

      {/* 🍥 Popular Anime */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiTv className="text-yellow-400 text-lg" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Popular Anime
            </h2>
          </div>
          <Link
            href="/anime/top/top"
            className="text-xs font-semibold text-zinc-400 hover:text-yellow-400 transition"
          >
            See All →
          </Link>
        </div>
        <AnimeResults />
      </section>

      {/* 📚 Trending Manga */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiBookOpen className="text-yellow-400 text-lg" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Top Ranked Manga
            </h2>
          </div>
          <Link
            href="/manga/top/top"
            className="text-xs font-semibold text-zinc-400 hover:text-yellow-400 transition"
          >
            See All →
          </Link>
        </div>
        <MangaResults />
      </section>
    </div>
  );
}
