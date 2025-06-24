import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";

export default async function Home({ params, searchParams }) {
  const p = await params;
  const s = await searchParams;
  const type = p?.type || "anime"; // "anime" or "manga"
  const category = p?.category || "top"; // "top", "popular", etc.
  const page = parseInt(s?.page || "1", 10);

  let uri = "";

  // Jikan API endpoints based on type and category
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

  try {
    const res = await fetch(uri, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const data = await res.json();
    let results = data.data;

    if (type === "anime") {
      results = results.filter((item) => item.type !== "Music");
    }

    if (type === "anime") {
        results = results.filter((item) => item.type !== "Movie");
      }
    
    const hasNextPage = data.pagination?.has_next_page;
    const uniqueResults = Array.from(new Map(results.map(item => [item.mal_id, item])).values());

    return (
      <div className="bg-neutral-100 dark:bg-[#121212] min-h-screen p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {uniqueResults.map((item) => (
            <AnimeCard key={item.mal_id} item={item} type={type} />
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/${type}/top/${category}?page=${page - 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              ⬅ Prev
            </Link>
          )}
          {hasNextPage && (
            <Link
              href={`/${type}/top/${category}?page=${page + 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Next ➡
            </Link>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Fetch failed:", error);
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading {type} data. Please try again later.
      </div>
    );
  }
}
