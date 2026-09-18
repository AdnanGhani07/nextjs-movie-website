"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getWatchlist,
  getWatchedHistory,
  getUserRatings,
} from "@/lib/userActions";
import {
  FiUser,
  FiCamera,
  FiSave,
  FiBookmark,
  FiCheckCircle,
  FiStar,
  FiLogOut,
  FiEdit2,
  FiCopy,
  FiCheck,
  FiCpu,
  FiKey,
} from "react-icons/fi";
import { User } from "@supabase/supabase-js";

interface MediaEntry {
  id: string;
  media_id: string;
  media_type: string;
  title: string;
  poster_path: string;
  added_at?: string;
  watched_at?: string;
  rated_at?: string;
  rating?: number;
}

function MediaCard({ entry }: { entry: MediaEntry }) {
  const href =
    entry.media_type === "movie"
      ? `/movie/${entry.media_id}`
      : entry.media_type === "tv"
      ? `/tv/${entry.media_id}`
      : `/${entry.media_type}/${entry.media_id}`;

  const isExternal =
    entry.poster_path?.startsWith("http") || entry.poster_path?.startsWith("//");

  return (
    <Link
      href={href}
      className="group block bg-zinc-900/80 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/30 transition shadow"
    >
      <div className="relative aspect-[2/3] bg-zinc-800">
        {entry.poster_path ? (
          isExternal ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.poster_path}
              alt={entry.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <Image
              src={`https://image.tmdb.org/t/p/w300${entry.poster_path}`}
              alt={entry.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
            No Image
          </div>
        )}
        {entry.rating !== undefined && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
            ★ {entry.rating}/10
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-[11px] font-semibold text-zinc-200 truncate group-hover:text-yellow-400 transition">
          {entry.title || "Untitled"}
        </p>
        <p className="text-[10px] text-zinc-500 capitalize">{entry.media_type}</p>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [watchlist, setWatchlist] = useState<MediaEntry[]>([]);
  const [history, setHistory] = useState<MediaEntry[]>([]);
  const [ratings, setRatings] = useState<MediaEntry[]>([]);

  const [accessToken, setAccessToken] = useState<string>("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCursor, setCopiedCursor] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);

  const [activeTab, setActiveTab] = useState<"watchlist" | "history" | "ratings">("watchlist");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
      }

      const [profile, wl, hist, rats] = await Promise.all([
        getProfile(),
        getWatchlist(),
        getWatchedHistory(),
        getUserRatings(),
      ]);

      setFirstName(profile?.first_name || user.user_metadata?.first_name || "");
      setLastName(profile?.last_name || user.user_metadata?.last_name || "");
      setAvatarUrl(profile?.avatar_url || null);
      setWatchlist(wl);
      setHistory(hist);
      setRatings(rats);
      setLoading(false);
    };
    init();
  }, [supabase, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const result = await updateProfile({ firstName, lastName, avatarUrl: avatarUrl || undefined });
    if (result && 'error' in result && result.error) {
      const err = result.error as { message?: string };
      setSaveError(err?.message || "Failed to save. Make sure the profiles table exists in Supabase.");
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadAvatar(file);
    if (url) {
      setAvatarUrl(url);
      await updateProfile({ firstName, lastName, avatarUrl: url });
    }
    setUploading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleCopyToken = () => {
    if (!accessToken) return;
    navigator.clipboard.writeText(accessToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleCopyCursorConfig = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_URL || "");
    const config = {
      name: "CinePulse",
      type: "sse",
      url: `${origin}/api/mcp`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedCursor(true);
    setTimeout(() => setCopiedCursor(false), 2500);
  };

  const handleCopyClaudeConfig = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_URL || "");
    const config = {
      mcpServers: {
        cinepulse: {
          command: "npx",
          args: [
            "-y",
            "mcp-remote-client",
            `${origin}/api/mcp`,
            "--header",
            `Authorization: Bearer ${accessToken}`,
          ],
        },
      },
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedClaude(true);
    setTimeout(() => setCopiedClaude(false), 2500);
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const tabData = {
    watchlist: watchlist,
    history: history,
    ratings: ratings.map((r) => ({ ...r, rating: r.rating })),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Card */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 shadow-xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-yellow-400">
                  {initials}
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg hover:bg-yellow-300 transition active:scale-95 disabled:opacity-50"
              title="Upload avatar"
            >
              <FiCamera className="text-sm" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              aria-hidden="true"
              tabIndex={-1}
              style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Name & Email */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : "My Profile"}
              </h1>
              <p className="text-xs text-zinc-400">{user?.email}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1 block">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                    placeholder="First name"
                  />
                  <FiEdit2 className="absolute left-2.5 top-2.5 text-zinc-500 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1 block">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                    placeholder="Last name"
                  />
                  <FiEdit2 className="absolute left-2.5 top-2.5 text-zinc-500 text-xs" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black transition active:scale-95 disabled:opacity-50 shadow-lg shadow-yellow-500/20"
              >
                <FiSave /> {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold border border-white/10 hover:border-red-500/30 transition active:scale-95"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>

            {saveError && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                ⚠️ {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-xl">
                ✓ Profile saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI & MCP Integration Card */}
      <div className="glass-panel rounded-3xl border border-yellow-500/20 p-6 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-yellow-500/5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                <FiCpu className="text-sm" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                AI & Model Context Protocol (MCP)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-black">
                  API Connected
                </span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              Connect <span className="text-zinc-300 font-semibold">Claude Desktop</span>, <span className="text-zinc-300 font-semibold">Cursor</span>, or custom AI agents to query your personal watchlist, mark watched titles, and fetch media recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyToken}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black transition active:scale-95 shadow-md shadow-yellow-500/20"
              title="Copy your personal Bearer token"
            >
              {copiedToken ? <FiCheck className="text-green-950 font-bold" /> : <FiKey />}
              {copiedToken ? "Token Copied!" : "Copy Token"}
            </button>
            <button
              onClick={handleCopyCursorConfig}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-white/10 hover:border-white/20 transition active:scale-95"
              title="Copy JSON configuration for Cursor IDE"
            >
              {copiedCursor ? <FiCheck className="text-green-400" /> : <FiCopy />}
              {copiedCursor ? "Copied!" : "Cursor Config"}
            </button>
            <button
              onClick={handleCopyClaudeConfig}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-white/10 hover:border-white/20 transition active:scale-95"
              title="Copy JSON configuration for Claude Desktop"
            >
              {copiedClaude ? <FiCheck className="text-green-400" /> : <FiCopy />}
              {copiedClaude ? "Copied!" : "Claude Config"}
            </button>
          </div>
        </div>

        {accessToken && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono">
            <span className="truncate max-w-[280px] sm:max-w-md">
              Bearer {accessToken.slice(0, 16)}••••••••••••••••••••••••••••••••{accessToken.slice(-8)}
            </span>
            <span className="text-[10px] text-zinc-400 shrink-0 font-sans">
              Scoped with Row-Level Security (RLS)
            </span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <FiBookmark />, label: "Watchlist", count: watchlist.length, tab: "watchlist" as const },
          { icon: <FiCheckCircle />, label: "Watched", count: history.length, tab: "history" as const },
          { icon: <FiStar />, label: "Rated", count: ratings.length, tab: "ratings" as const },
        ].map(({ icon, label, count, tab }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`glass-panel rounded-2xl p-4 border text-center transition ${
              activeTab === tab ? "border-yellow-400/40 bg-yellow-500/5" : "border-white/5 hover:border-white/10"
            }`}
          >
            <div className={`text-xl mb-1 flex justify-center ${activeTab === tab ? "text-yellow-400" : "text-zinc-400"}`}>
              {icon}
            </div>
            <p className="text-lg font-black text-white">{count}</p>
            <p className="text-[11px] text-zinc-400">{label}</p>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white capitalize flex items-center gap-2">
            {activeTab === "watchlist" && <><FiBookmark className="text-yellow-400" /> My Watchlist</>}
            {activeTab === "history" && <><FiCheckCircle className="text-green-400" /> Watch History</>}
            {activeTab === "ratings" && <><FiStar className="text-yellow-400 fill-yellow-400" /> My Ratings</>}
          </h2>
          <span className="text-xs text-zinc-500">{tabData[activeTab].length} items</span>
        </div>

        {tabData[activeTab].length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-500 text-sm">Nothing here yet.</p>
            <p className="text-zinc-600 text-xs mt-1">Browse movies, TV, anime, and manga to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {tabData[activeTab].map((entry) => (
              <MediaCard key={`${entry.media_type}-${entry.media_id}`} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
