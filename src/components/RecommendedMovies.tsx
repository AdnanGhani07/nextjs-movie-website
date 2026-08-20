import Link from "next/link";
import Image from "next/image";
import { TMDBMovie } from "@/types";
import { FiStar } from "react-icons/fi";

interface RecommendedMoviesProps {
  movies: TMDBMovie[];
}

export default function RecommendedMovies({ movies }: RecommendedMoviesProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          href={`/movie/${movie.id}`}
          key={movie.id}
          className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel hover:border-yellow-500/40 transition hover:-translate-y-1"
        >
          <div className="relative aspect-[2/3] w-full bg-zinc-900 overflow-hidden">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "/fallback.jpg"
              }
              alt={movie.title || "Movie poster"}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
            {movie.vote_average && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                <FiStar className="fill-yellow-400" /> {movie.vote_average.toFixed(1)}
              </div>
            )}
          </div>
          <div className="p-2.5">
            <h3 className="text-xs font-semibold truncate text-zinc-200 group-hover:text-yellow-400 transition">
              {movie.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
