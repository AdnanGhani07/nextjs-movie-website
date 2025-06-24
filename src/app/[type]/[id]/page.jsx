import Image from "next/image";
import Link from "next/link";

export default async function ContentPage({ params }) {
  const p = await params;
  const { id, type } = p;

  const isAnime = type === "anime";
  const baseUrl = isAnime
    ? `https://api.jikan.moe/v4/anime/${id}/full`
    : `https://api.jikan.moe/v4/manga/${id}/full`;

  const res = await fetch(baseUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} details`);
  }

  const data = await res.json();
  const item = data.data;

  const title = item.title_english || item.title;
  const imageUrl = item.images?.webp?.image_url;
  const score = item.score || "N/A";
  const genres = item.genres.map((g) => g.name).join(", ");
  const synopsis = item.synopsis || "No synopsis available.";
  const chapters = item.chapters || item.episodes || "N/A";
  const status = item.status;
  const source = item.source || "Unknown";
  const trailer = item.trailer?.url;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
        {title}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-1/3 h-[450px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-lg object-contain"
            priority
          />
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Score:</strong> {score} ({item.scored_by || "N/A"} votes)
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>{isAnime ? "Episodes" : "Chapters"}:</strong> {chapters}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Type:</strong> {item.type}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Source:</strong> {source}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Genres:</strong> {genres}
          </p>

          {isAnime && trailer && (
            <div>
              <Link
                href={trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                ▶️ Watch Trailer
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Synopsis
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {synopsis}
        </p>
      </div>
    </div>
  );
}
