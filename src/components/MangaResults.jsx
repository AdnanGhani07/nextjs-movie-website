import AnimeCard from "@/components/AnimeCard";

export default async function MangaPage() {
  const res = await fetch("https://api.jikan.moe/v4/top/manga");
  const { data } = await res.json();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
      {data.map((item) => (
        <AnimeCard key={item.mal_id} item={item} type="manga" />
      ))}
    </div>
  );
}
