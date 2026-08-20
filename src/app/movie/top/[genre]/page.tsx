import Results from "@/components/Results";
import { TMDBMovie } from "@/types";
import { fetchTMDB, FALLBACK_MOVIES } from "@/lib/tmdb";
import { fetchTVmazeShowsCatalog } from "@/lib/tvmaze";
import BackButton from "@/components/BackButton";

interface PageProps {
  params: Promise<{ genre?: string }>;
}

export default async function MovieGenrePage({ params }: PageProps) {
  const p = await params;
  const genre = p?.genre || "trending";

  let endpoint = "/movie/popular";
  const isTV = genre === "tv-shows";

  if (isTV) {
    endpoint = "/tv/top_rated";
  } else if (genre === "upcoming") {
    endpoint = "/movie/upcoming";
  }

  const data = await fetchTMDB<{ results: TMDBMovie[] }>(endpoint, { page: 1 });
  let results: TMDBMovie[] = data?.results && data.results.length > 0 ? data.results : [];

  // Fallback to TVmaze for TV Shows if TMDB fails/blocked
  if (results.length === 0 && isTV) {
    results = await fetchTVmazeShowsCatalog(1);
  }

  if (results.length === 0) {
    results = FALLBACK_MOVIES;
  }

  const title = isTV
    ? "Top TV Shows"
    : genre === "upcoming"
    ? "Upcoming Premieres"
    : "Trending Movies";

  return (
    <div className="space-y-6">
      <BackButton label="Back to Home" fallbackHref="/" />

      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white capitalize">
          {title}
        </h1>
      </div>

      <Results results={results} genre={genre} />
    </div>
  );
}
