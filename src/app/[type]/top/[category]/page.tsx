import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { JikanAnimeItem } from "@/types";
import { fetchJikan } from "@/lib/jikan";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PageProps {
  params: Promise<{ type?: string; category?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnimeMangaCategoryPage({ params, searchParams }: PageProps) {
  const p = await params;
  const s = await searchParams;
  const type = p?.type || "anime";
  const category = p?.category || "top";
  const page = parseInt(typeof s?.page === "string" ? s.page : "1", 10);

  let uri = "";

  if (type === "anime") {
    if (category === "top") {
      uri = `https://api.jikan.moe/v4/top/anime?page=${page}`;
    } else if (category === "popular") {
      uri = `https://api.jikan.moe/v4/anime?order_by=popularity&sort=desc&page=${page}`;
    } else if (category === "upcoming") {
      uri = `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`;
    }
  } else if (type === "manga") {
    if (category === "top") {
      uri = `https://api.jikan.moe/v4/top/manga?page=${page}`;
    } else if (category === "popular") {
      uri = `https://api.jikan.moe/v4/manga?order_by=popularity&sort=desc&page=${page}`;
    } else if (category === "new") {
      uri = `https://api.jikan.moe/v4/manga?order_by=start_date&sort=desc&page=${page}`;
    }
  }

  if (!uri) {
    uri = `https://api.jikan.moe/v4/top/${type}?page=${page}`;
  }

  const data = await fetchJikan<{ data: JikanAnimeItem[]; pagination: any }>(uri);
  let results: JikanAnimeItem[] = Array.isArray(data?.data) ? data.data : [];

  if (type === "anime") {
    results = results.filter((item) => item.type !== "Music" && item.type !== "Movie");
  }

  const hasNextPage = !!data?.pagination?.has_next_page;
  const uniqueResults = Array.from(
    new Map(results.map((item) => [item.mal_id, item])).values()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white capitalize">
          {category} {type} Catalog
        </h1>
        <span className="text-xs text-zinc-400">Page {page}</span>
      </div>

      {uniqueResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {uniqueResults.map((item) => (
            <AnimeCard key={item.mal_id} item={item} type={type} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl my-8">
          <p className="text-zinc-400 text-sm">
            Catalog is temporarily unavailable due to rate limits. Please try again shortly.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-12 flex justify-center items-center gap-3 pt-6 border-t border-white/5">
        {page > 1 && (
          <Link
            href={`/${type}/top/${category}?page=${page - 1}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 rounded-xl transition shadow"
          >
            <FiChevronLeft /> Previous
          </Link>
        )}
        {hasNextPage && (
          <Link
            href={`/${type}/top/${category}?page=${page + 1}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-xs font-bold text-black rounded-xl transition shadow shadow-yellow-500/10"
          >
            Next Page <FiChevronRight />
          </Link>
        )}
      </div>
    </div>
  );
}
