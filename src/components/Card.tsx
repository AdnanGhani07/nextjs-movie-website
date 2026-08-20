import Link from 'next/link';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import { TMDBMovie } from '@/types';

interface CardProps {
  result: TMDBMovie;
}

export default function Card({ result }: CardProps) {
  const mediaType = result.media_type || (result.first_air_date ? 'tv' : 'movie');
  const routePath = `/${mediaType}/${result.id}`;
  const rawPath = result.poster_path || result.backdrop_path;
  const imageSrc = rawPath?.startsWith('http')
    ? rawPath
    : rawPath
    ? `https://image.tmdb.org/t/p/w500/${rawPath.startsWith('/') ? rawPath.slice(1) : rawPath}`
    : '/fallback.jpg';

  const title = result.title || result.name || 'Untitled';
  const releaseYear = (result.release_date || result.first_air_date)?.slice(0, 4);
  const rating = result.vote_average ? result.vote_average.toFixed(1) : null;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel hover:border-yellow-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1">
      <Link href={routePath} className="flex flex-col h-full">
        {/* Poster Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-yellow-400 text-xs font-bold shadow">
              <FiStar className="fill-yellow-400 text-[10px]" />
              <span>{rating}</span>
            </div>
          )}

          {/* Type Pill */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-[10px] uppercase font-semibold text-zinc-300">
            {mediaType}
          </div>
        </div>

        {/* Info Block */}
        <div className="p-3.5 flex flex-col flex-1 justify-between bg-zinc-950/40">
          <div>
            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-yellow-400 truncate transition-colors">
              {title}
            </h3>
            <p className="line-clamp-2 text-xs text-zinc-400 mt-1 leading-relaxed">
              {result.overview || "No overview available."}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-400">
            <span>{releaseYear || "N/A"}</span>
            <span className="group-hover:text-zinc-200 transition font-medium">View details →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
