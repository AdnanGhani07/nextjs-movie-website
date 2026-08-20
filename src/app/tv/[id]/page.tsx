import Image from "next/image";
import SimilarShows from "@/components/SimilarShows";
import CastOverlay from "@/components/CastOverlay";
import dynamic from "next/dynamic";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import RatingWidget from "@/components/RatingWidget";
import { TMDBMovie, CastMember } from "@/types";
import { fetchTMDB } from "@/lib/tmdb";
import { fetchOMDBByTitle } from "@/lib/omdb";
import { fetchTVmazeShow, convertTVmazeToTMDB } from "@/lib/tvmaze";
import { FiStar, FiCalendar, FiTv, FiGlobe, FiAward } from "react-icons/fi";
import BackButton from "@/components/BackButton";

const TVModal = dynamic(() => import('@/components/MovieModal'));

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TVPage({ params }: PageProps) {
  const { id } = await params;

  try {
    // 1. Primary TMDB Query
    const [tmdbShow, videos, castData, similar] = await Promise.all([
      fetchTMDB<any>(`/tv/${id}`),
      fetchTMDB<{ results: any[] }>(`/tv/${id}/videos`),
      fetchTMDB<{ cast: CastMember[] }>(`/tv/${id}/aggregate_credits`),
      fetchTMDB<{ results: TMDBMovie[] }>(`/tv/${id}/recommendations`, { page: 1 })
    ]);

    let show = tmdbShow;
    let cast: CastMember[] = castData?.cast ? castData.cast.slice(0, 12) : [];

    // 2. TVmaze Fallback
    if (!show) {
      const tvmazeData = await fetchTVmazeShow(id);
      if (tvmazeData) {
        const converted = convertTVmazeToTMDB(tvmazeData);
        show = converted.movie;
        cast = converted.cast.slice(0, 12);
      }
    }

    if (!show) {
      return (
        <div className="space-y-4">
          <BackButton label="Back to TV Shows" fallbackHref="/movie/top/tv-shows" />
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5 my-8">
            <p className="text-zinc-400 text-sm">TV show details could not be loaded.</p>
          </div>
        </div>
      );
    }

    const omdbData = show.name
      ? await fetchOMDBByTitle(show.name, show.first_air_date?.slice(0, 4))
      : null;

    const trailer = videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
    const similarResults: TMDBMovie[] = similar?.results ? similar.results.slice(0, 10) : [];

    const rawBackdrop = show.backdrop_path;
    const cleanBackdrop = rawBackdrop?.startsWith('/') ? rawBackdrop.slice(1) : rawBackdrop;
    const backdropUrl = cleanBackdrop
      ? `https://image.tmdb.org/t/p/original/${cleanBackdrop}`
      : undefined;

    const rawPoster = show.poster_path;
    const cleanPoster = rawPoster?.startsWith('/') ? rawPoster.slice(1) : rawPoster;
    const posterUrl = cleanPoster
      ? `https://image.tmdb.org/t/p/w500/${cleanPoster}`
      : "/fallback.jpg";

    return (
      <div className="space-y-6">
        <BackButton label="Back to TV Shows" fallbackHref="/movie/top/tv-shows" />

        {/* Header Container */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 md:p-10">
          {backdropUrl && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backdropUrl}
                alt="backdrop"
                fill
                className="object-cover opacity-20 filter blur-xl scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-56 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-zinc-900">
              <Image
                src={posterUrl}
                alt={show.name || "Show Poster"}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {show.genres?.map((g: any) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 border border-white/10 text-[11px] font-medium text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {show.name}
              </h1>

              {/* Quick Stats Pill */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-300">
                {show.vote_average && (
                  <span className="flex items-center gap-1 text-yellow-400 font-bold px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <FiStar className="fill-yellow-400" /> TMDB {show.vote_average.toFixed(1)}
                  </span>
                )}
                {omdbData?.imdbRating && omdbData.imdbRating !== "N/A" && (
                  <span className="flex items-center gap-1 text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    IMDb {omdbData.imdbRating}
                  </span>
                )}
                {omdbData?.Ratings?.find((r) => r.Source === "Rotten Tomatoes") && (
                  <span className="flex items-center gap-1 text-red-400 font-bold px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                    🍅 {omdbData.Ratings.find((r) => r.Source === "Rotten Tomatoes")?.Value}
                  </span>
                )}
                {show.first_air_date && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/5">
                    <FiCalendar /> {show.first_air_date}
                  </span>
                )}
                {show.number_of_seasons && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/5">
                    <FiTv /> {show.number_of_seasons} Seasons
                  </span>
                )}
                {show.original_language && (
                  <span className="flex items-center gap-1 uppercase px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/5">
                    <FiGlobe /> {show.original_language}
                  </span>
                )}
              </div>

              {omdbData?.Awards && omdbData.Awards !== "N/A" && (
                <div className="flex items-center gap-2 text-xs text-yellow-400/90 font-medium">
                  <FiAward className="text-yellow-400 flex-shrink-0" />
                  <span>{omdbData.Awards}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl pt-2">
                {show.overview || "No overview available."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {trailer && <TVModal trailerKey={trailer.key} title={show.name || "Trailer"} />}
                {cast.length > 0 && <CastOverlay cast={cast} />}
                <WatchlistButton
                  mediaId={String(show.id)}
                  mediaType="tv"
                  title={show.name || ""}
                  posterPath={posterUrl}
                />
                <WatchedButton
                  mediaId={String(show.id)}
                  mediaType="tv"
                  title={show.name || ""}
                  posterPath={posterUrl}
                />
                <RatingWidget
                  mediaId={String(show.id)}
                  mediaType="tv"
                  title={show.name || ""}
                  posterPath={posterUrl}
                />
              </div>
            </div>
          </div>
        </div>




        {/* Recommended */}
        {similarResults.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Recommended Shows</h2>
            <SimilarShows results={similarResults} />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to load TV show details:", error);
    return (
      <div className="text-center py-20 glass-panel rounded-3xl my-8">
        <p className="text-red-400 text-sm">Error loading TV show details.</p>
      </div>
    );
  }
}
