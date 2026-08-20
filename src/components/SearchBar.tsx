"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiFilm, FiTv, FiBookOpen, FiX } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface SearchResultItem {
  id: string | number;
  title: string;
  type: "movie" | "tv" | "anime" | "manga";
  image?: string;
  year?: string;
  rating?: number | string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=4`);
        const json = await res.json();
        const animeItems: SearchResultItem[] = (json.data || []).map((item: any) => ({
          id: item.mal_id,
          title: item.title_english || item.title,
          type: "anime",
          image: item.images?.webp?.image_url || item.images?.jpg?.image_url,
          year: item.aired?.from ? item.aired.from.slice(0, 4) : undefined,
          rating: item.score || undefined,
        }));

        setResults(animeItems);
        setOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-xs md:max-w-sm" ref={dropdownRef}>
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3.5 text-zinc-400 text-sm pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, anime, shows..."
          className="w-full pl-9 pr-8 py-2 bg-zinc-900/80 hover:bg-zinc-900 focus:bg-zinc-900 border border-white/10 focus:border-yellow-500/50 rounded-full text-xs md:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 shadow-inner"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 text-zinc-400 hover:text-zinc-200"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 overflow-hidden border border-white/10">
          {loading ? (
            <div className="py-4 text-center text-xs text-zinc-400">Searching catalog...</div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Search Results
              </div>
              {results.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={`/${item.type}/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition group"
                >
                  <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <FiFilm />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-yellow-400 truncate transition">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <span className="capitalize px-1.5 py-0.2 bg-zinc-800 rounded text-[10px] text-zinc-300 font-medium">
                        {item.type}
                      </span>
                      {item.year && <span>{item.year}</span>}
                      {item.rating && <span className="text-yellow-400 font-medium">★ {item.rating}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
