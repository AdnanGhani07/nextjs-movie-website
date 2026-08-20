"use client";

import { useState } from "react";
import Image from "next/image";
import { CastMember } from "@/types";
import { FiUsers, FiX } from "react-icons/fi";

interface MovieCastOverlayProps {
  cast: CastMember[];
}

export default function MovieCastOverlay({ cast }: MovieCastOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!cast || cast.length === 0) return null;

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {cast.slice(0, 10).map((actor) => (
          <div key={actor.id} className="flex-shrink-0 w-24 text-center">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border border-white/10 bg-zinc-900 shadow">
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                  <FiUsers />
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-semibold text-zinc-200 truncate">{actor.name}</p>
            <p className="text-[10px] text-zinc-400 truncate">
              {actor.character || actor.roles?.[0]?.character || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
