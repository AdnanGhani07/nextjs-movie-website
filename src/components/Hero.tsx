import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import { TMDBMovie } from '@/types';

interface HeroProps {
  movie?: TMDBMovie;
}

export default function Hero({ movie }: HeroProps) {
  const featured = movie || {
    id: 939243,
    title: "Sonic the Hedgehog 3",
    overview: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek an unlikely alliance.",
    backdrop_path: "/zOpeNs0YeFsue92W0FaHtpdduG9.jpg",
    poster_path: "/d8duY2VPh16u0v4FuqJ0KpHk7wJ.jpg",
    vote_average: 7.8,
    release_date: "2024-12-20",
  };

  const rawBackdrop = featured.backdrop_path || featured.poster_path;
  const imageSrc = rawBackdrop?.startsWith('http')
    ? rawBackdrop
    : rawBackdrop
    ? `https://image.tmdb.org/t/p/original/${rawBackdrop.startsWith('/') ? rawBackdrop.slice(1) : rawBackdrop}`
    : "/fallback.jpg";

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-4 bg-zinc-950">
      <div className="relative w-full h-[420px] md:h-[500px]">
        {/* Backdrop Image */}
        <Image
          src={imageSrc}
          alt={featured.title || "Featured Media"}
          fill
          priority
          className="object-cover object-top opacity-60 filter brightness-90"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/40 to-transparent" />

        {/* Content Box */}
        <div className="absolute bottom-8 left-6 md:left-12 max-w-2xl z-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              FEATURED PREMIERE
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-zinc-300 backdrop-blur-sm">
              4K ULTRA HD
            </span>
            {featured.vote_average && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900/80 text-yellow-400 border border-white/5">
                <FiStar className="fill-yellow-400 text-xs" /> {featured.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {featured.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-sm max-w-xl">
            {featured.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/movie/${featured.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              <FiPlay className="fill-black text-sm" /> Watch Details
            </Link>
            <Link
              href={`/movie/${featured.id}`}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-zinc-200 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition active:scale-95"
            >
              <FiInfo /> More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
