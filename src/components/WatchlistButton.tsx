"use client";

import { useState, useEffect } from "react";
import { FiBookmark } from "react-icons/fi";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlistStatus,
} from "@/lib/userActions";
import { createClient } from "@/lib/supabase/client";

interface WatchlistButtonProps {
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
}

export default function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
}: WatchlistButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        const status = await getWatchlistStatus(mediaId, mediaType);
        setSaved(status);
      }
      setLoading(false);
    };
    init();
  }, [mediaId, mediaType]);

  const toggle = async () => {
    if (!isLoggedIn) {
      window.location.href = "/sign-in";
      return;
    }
    setLoading(true);
    if (saved) {
      await removeFromWatchlist(mediaId, mediaType);
      setSaved(false);
    } else {
      await addToWatchlist({ mediaId, mediaType, title, posterPath });
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 disabled:opacity-50 ${
        saved
          ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-500/20"
          : "bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-yellow-400/50 hover:text-yellow-400"
      }`}
    >
      <FiBookmark className={saved ? "fill-black" : ""} />
      <span>{saved ? "Saved" : "Watchlist"}</span>
    </button>
  );
}
