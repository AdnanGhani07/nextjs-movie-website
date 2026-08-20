"use client";

import { useState, useEffect } from "react";
import { FiStar, FiX } from "react-icons/fi";
import { setRating, removeRating, getUserRating } from "@/lib/userActions";
import { createClient } from "@/lib/supabase/client";

interface RatingWidgetProps {
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
}

export default function RatingWidget({ mediaId, mediaType, title, posterPath }: RatingWidgetProps) {
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        const rating = await getUserRating(mediaId, mediaType);
        setCurrentRating(rating);
      }
      setLoading(false);
    };
    init();
  }, [mediaId, mediaType]);

  const handleRate = async (score: number) => {
    if (!isLoggedIn) {
      window.location.href = "/sign-in";
      return;
    }
    setLoading(true);
    if (currentRating === score) {
      await removeRating(mediaId, mediaType);
      setCurrentRating(null);
    } else {
      await setRating({ mediaId, mediaType, rating: score, title, posterPath });
      setCurrentRating(score);
    }
    setShowPicker(false);
    setLoading(false);
  };

  const display = hovered ?? currentRating;

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (!isLoggedIn) { window.location.href = "/sign-in"; return; }
          setShowPicker(!showPicker);
        }}
        disabled={loading}
        title="Rate this"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 disabled:opacity-50 ${
          currentRating !== null
            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
            : "bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-yellow-400/40 hover:text-yellow-400"
        }`}
      >
        <FiStar className={currentRating !== null ? "fill-yellow-400 text-yellow-400" : ""} />
        <span>{currentRating !== null ? `${currentRating}/10` : "Rate"}</span>
      </button>

      {showPicker && (
        <div className="absolute bottom-full mb-2 left-0 z-50 glass-dropdown rounded-2xl p-3 border border-white/10 shadow-2xl min-w-[200px]">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-zinc-400 font-semibold">
              {display !== null ? `${display}/10` : "Select a score"}
            </span>
            <button
              onClick={() => setShowPicker(false)}
              className="text-zinc-500 hover:text-white transition"
            >
              <FiX className="text-xs" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => handleRate(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                className={`h-8 w-full rounded-lg text-xs font-bold transition active:scale-90 ${
                  (display !== null && n <= display)
                    ? "bg-yellow-400 text-black"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {currentRating !== null && (
            <button
              onClick={() => handleRate(currentRating)}
              className="w-full mt-2 text-[11px] text-red-400 hover:text-red-300 transition py-1"
            >
              Remove rating
            </button>
          )}
        </div>
      )}
    </div>
  );
}
