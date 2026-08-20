"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CastMember } from "@/types";
import { FiUsers, FiArrowLeft, FiX } from "react-icons/fi";

interface CastOverlayProps {
  cast: CastMember[];
}

export default function CastOverlay({ cast }: CastOverlayProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl border border-white/10 transition active:scale-95"
      >
        <FiUsers className="text-yellow-400" /> View Full Cast ({cast.length})
      </button>

      {open && (
        <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 md:p-8">
          {/* Top Bar */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 flex-shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black transition active:scale-95 shadow-2xl hover:scale-105"
            >
              <FiArrowLeft className="text-base" />
              <span>Back to Details</span>
            </button>

            <h2 className="hidden sm:flex text-sm sm:text-base font-bold text-white items-center gap-2">
              <FiUsers className="text-yellow-400" /> Cast Members ({cast.length})
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold border border-white/20 transition active:scale-95 shadow-2xl hover:scale-105"
            >
              <FiX className="text-sm" />
              <span>Close (Esc)</span>
            </button>
          </div>

          {/* Scrollable Grid */}
          <div
            className="w-full max-w-6xl mx-auto flex-1 min-h-0 bg-[#0e0f14] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {cast.map((member) => (
                <div
                  key={member.id}
                  className="bg-zinc-900/90 rounded-2xl overflow-hidden border border-white/5 p-2.5 flex flex-col items-center text-center group hover:border-yellow-500/40 transition"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 mb-2">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 truncate w-full group-hover:text-yellow-400 transition">
                    {member.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 truncate w-full">
                    {member.roles?.[0]?.character
                      ? `as ${member.roles[0].character}`
                      : member.character
                      ? `as ${member.character}`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full text-center text-[11px] text-zinc-500 pt-2 flex-shrink-0">
            Press ESC or click Close to return
          </div>
        </div>
      )}
    </>
  );
}
