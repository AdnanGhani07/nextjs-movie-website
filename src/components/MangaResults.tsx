import AnimeCard from "@/components/AnimeCard";
import { JikanAnimeItem } from "@/types";
import { fetchJikan } from "@/lib/jikan";
import { fetchAniListCatalog } from "@/lib/fetchAnilist";

export default async function MangaResults() {
  let data: JikanAnimeItem[] = [];

  // Primary: Jikan API
  const jikanRes = await fetchJikan<{ data: JikanAnimeItem[] }>(
    "https://api.jikan.moe/v4/top/manga?limit=10"
  );

  if (jikanRes && Array.isArray(jikanRes.data) && jikanRes.data.length > 0) {
    data = jikanRes.data.slice(0, 10);
  }

  // Secondary Fallback: AniList GraphQL (90 req/min limit)
  if (data.length === 0) {
    data = await fetchAniListCatalog("MANGA", "SCORE_DESC", 1, 10);
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 glass-panel rounded-2xl">
        <p className="text-zinc-500 text-xs">Manga feed is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {data.map((item) => (
        <AnimeCard key={item.mal_id} item={item} type="manga" />
      ))}
    </div>
  );
}
