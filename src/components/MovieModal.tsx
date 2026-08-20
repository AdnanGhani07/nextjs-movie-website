"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FiPlay, FiArrowLeft } from "react-icons/fi";

interface MovieModalProps {
  trailerKey?: string;
  title: string;
}

export default function MovieModal({ trailerKey, title }: MovieModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!trailerKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition active:scale-95"
      >
        <FiPlay className="fill-black" /> Watch Trailer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6">
          {/* Top Bar - Fixed at top with highest z-index */}
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-50 flex-shrink-0 mb-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black transition active:scale-95 shadow-2xl hover:scale-105"
            >
              <FiArrowLeft className="text-base" />
              <span>Back to Details</span>
            </button>

            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-300 truncate max-w-sm">
              {title}
            </span>

            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold border border-white/20 transition active:scale-95 shadow-2xl hover:scale-105"
            >
              <FaTimes className="text-xs" />
              <span>Close (Esc)</span>
            </button>
          </div>

          {/* Centered Video - strictly sized to viewport */}
          <div
            className="w-full max-w-5xl mx-auto flex-1 flex items-center justify-center min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full max-h-[75vh] aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="w-full text-center text-[11px] text-zinc-500 py-1 flex-shrink-0">
            Click outside the video or press ESC to return to movie details
          </div>
        </div>
      )}
    </>
  );
}
