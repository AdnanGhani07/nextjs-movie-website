"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut, FiBookmark, FiChevronDown, FiCompass, FiUser } from "react-icons/fi";
import SearchBar from "./SearchBar";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, first_name, last_name")
      .eq("id", userId)
      .maybeSingle();
    if (data?.avatar_url) setAvatarUrl(data.avatar_url);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchProfile(user.id);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setAvatarUrl(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.refresh();
  };

  const navLinks = [
    { label: "Trending", href: "/" },
    { label: "Movies", href: "/movie/top/trending" },
    { label: "TV Shows", href: "/movie/top/tv-shows" },
    { label: "Anime", href: "/anime/top/top" },
    { label: "Manga", href: "/manga/top/top" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-black font-black text-base tracking-tighter">CP</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-yellow-400 transition">
            Cine<span className="text-yellow-400">Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-white/5 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-400 text-black font-semibold shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & User Auth Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-white/20 transition group"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-600 text-black font-bold text-xs flex items-center justify-center shadow flex-shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.email?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-zinc-200 max-w-[100px] truncate">
                  {user.user_metadata?.first_name || user.email?.split("@")[0]}
                </span>
                <FiChevronDown className="text-zinc-400 text-xs group-hover:text-white transition" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 'Account'}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/5 rounded-xl transition"
                  >
                    <FiUser className="text-sm" /> My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <FiLogOut className="text-sm" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="px-5 py-2 text-xs font-bold bg-yellow-400 text-black rounded-full hover:bg-yellow-300 shadow-lg shadow-yellow-500/10 transition active:scale-95"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Category Scroll Bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-white/5 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition ${
                isActive
                  ? "bg-yellow-400 text-black font-semibold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
