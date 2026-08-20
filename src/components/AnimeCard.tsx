"use client";

import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { JikanAnimeItem } from "@/types";

interface AnimeCardProps {
  item: JikanAnimeItem;
  type?: "anime" | "manga" | string;
}

export default function AnimeCard({ item, type = "anime" }: AnimeCardProps) {
  const title = item.title_english || item.title || "Untitled";
  const imageUrl =
    item.images?.webp?.large_image_url ||
    item.images?.webp?.image_url ||
    item.images?.jpg?.large_image_url ||
    item.images?.jpg?.image_url ||
    "/fallback.jpg";
  const synopsis = item.synopsis || "No description available.";
  const score = item.score ? item.score.toFixed(1) : null;
  const year = item.aired?.from ? item.aired.from.slice(0, 4) : item.published?.from ? item.published.from.slice(0, 4) : null;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel hover:border-yellow-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1">
      <Link href={`/${type}/${item.mal_id}`} className="flex flex-col h-full">
        {/* Poster Section */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Rating Badge */}
          {score && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-yellow-400 text-xs font-bold shadow">
              <FiStar className="fill-yellow-400 text-[10px]" />
              <span>{score}</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-[10px] uppercase font-semibold text-zinc-300">
            {type}
          </div>
        </div>

        {/* Info Block */}
        <div className="p-3.5 flex flex-col flex-1 justify-between bg-zinc-950/40">
          <div>
            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-yellow-400 truncate transition-colors">
              {title}
            </h3>
            <p className="line-clamp-2 text-xs text-zinc-400 mt-1 leading-relaxed">
              {synopsis}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-400">
            <span>{year || "Ongoing"}</span>
            <span className="group-hover:text-zinc-200 transition font-medium">Explore →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
