"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiInfo, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TMDBMovie } from "@/types";

interface HeroProps {
  movies?: TMDBMovie[];
  movie?: TMDBMovie;
}

export default function Hero({ movies, movie }: HeroProps) {
  // Normalize items array (supporting both movies array and single movie prop)
  const items: TMDBMovie[] =
    movies && movies.length > 0
      ? movies.slice(0, 6)
      : movie
      ? [movie]
      : [
          {
            id: 939243,
            title: "Sonic the Hedgehog 3",
            overview:
              "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before.",
            backdrop_path: "/zOpeNs0YeFsue92W0FaHtpdduG9.jpg",
            poster_path: "/d8duY2VPh16u0v4FuqJ0KpHk7wJ.jpg",
            vote_average: 7.8,
            release_date: "2024-12-20",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play timer (6 seconds)
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [items.length, isPaused, nextSlide]);

  const current = items[currentIndex];

  const getBackdropUrl = (item: TMDBMovie) => {
    const raw = item.backdrop_path || item.poster_path;
    if (!raw) return "/fallback.jpg";
    if (raw.startsWith("http")) return raw;
    const clean = raw.startsWith("/") ? raw.slice(1) : raw;
    return `https://image.tmdb.org/t/p/original/${clean}`;
  };

  return (
    <section
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-4 bg-zinc-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full h-[450px] sm:h-[500px] md:h-[540px]">
        {/* Render Backgrounds for smooth cross-fading */}
        {items.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={item.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={getBackdropUrl(item)}
                alt={item.title || "Featured Media"}
                fill
                priority={idx === 0}
                className="object-cover object-top filter brightness-[0.8] scale-105 transition-transform duration-[7000ms] ease-out"
              />
            </div>
          );
        })}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#08080a] via-[#08080a]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#08080a] via-[#08080a]/50 to-transparent" />

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 active:scale-95 shadow-xl hover:border-yellow-400/50 hover:text-yellow-400"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 active:scale-95 shadow-xl hover:border-yellow-400/50 hover:text-yellow-400"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </>
        )}

        {/* Content Box */}
        <div className="absolute bottom-8 left-6 md:left-12 max-w-2xl z-20 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 tracking-wide uppercase font-bold text-[10px]">
              FEATURED #{currentIndex + 1}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-zinc-300 backdrop-blur-sm text-[10px]">
              4K ULTRA HD
            </span>
            {current.vote_average && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900/80 text-yellow-400 border border-white/10 text-[11px]">
                <FiStar className="fill-yellow-400 text-xs" /> {current.vote_average.toFixed(1)}
              </span>
            )}
            {current.release_date && (
              <span className="px-2 py-1 rounded-md bg-zinc-900/60 text-zinc-400 text-[10px]">
                {current.release_date.slice(0, 4)}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg line-clamp-2">
            {current.title || current.name}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-sm max-w-xl">
            {current.overview || "No overview available for this title."}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/movie/${current.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              <FiPlay className="fill-black text-sm" /> Watch Details
            </Link>
            <Link
              href={`/movie/${current.id}`}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-zinc-200 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition active:scale-95"
            >
              <FiInfo /> More Info
            </Link>
          </div>
        </div>

        {/* Slide Indicators / Dots */}
        {items.length > 1 && (
          <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-8 h-2 bg-yellow-400 shadow-lg shadow-yellow-500/50"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
