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
import { HiSparkles } from "react-icons/hi2";

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
      <Hero movies={results.slice(0, 6)} />

      {/* AI Spotlight / Highlights */}
      {homePageContent && (
        <section className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12131a]/95 via-[#0e0f14]/90 to-[#08080a]/95 border border-yellow-500/30 shadow-2xl shadow-yellow-500/5 overflow-hidden group">
          {/* Ambient Warm Gold Glows */}
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-yellow-500/15 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-700" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 shadow-inner">
              <HiSparkles className="text-yellow-400 text-xs animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-widest text-yellow-400">
                AI CinePulse Weekly Spotlight
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {homePageContent.title}
            </h2>

            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-none [&_a]:!text-yellow-400 [&_a]:font-bold [&_a]:!bg-none [&_a]:!bg-clip-border [&_a]:!text-fill-current [&_a]:underline [&_a]:decoration-yellow-500/50 [&_a]:underline-offset-4 hover:[&_a]:!text-yellow-300 transition">
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
