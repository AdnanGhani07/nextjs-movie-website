"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import {
  markWatched,
  unmarkWatched,
  getWatchedStatus,
} from "@/lib/userActions";
import { createClient } from "@/lib/supabase/client";

interface WatchedButtonProps {
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
}

export default function WatchedButton({
  mediaId,
  mediaType,
  title,
  posterPath,
}: WatchedButtonProps) {
  const [watched, setWatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        const status = await getWatchedStatus(mediaId, mediaType);
        setWatched(status);
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
    if (watched) {
      await unmarkWatched(mediaId, mediaType);
      setWatched(false);
    } else {
      await markWatched({ mediaId, mediaType, title, posterPath });
      setWatched(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={watched ? "Mark as Unwatched" : "Mark as Watched"}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 disabled:opacity-50 ${
        watched
          ? "bg-green-500/20 text-green-400 border-green-500/40 shadow-md"
          : "bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-green-500/40 hover:text-green-400"
      }`}
    >
      {watched ? <FiCheckCircle className="text-green-400" /> : <FiCircle />}
      <span>{watched ? "Watched" : "Mark Watched"}</span>
    </button>
  );
}
