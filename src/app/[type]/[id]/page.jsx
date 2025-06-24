import Image from "next/image";
import Link from "next/link";

export default async function ContentPage({ params }) {
  const { id, type } = await params;

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
  const imageUrl = item.images?.webp?.large_image_url || item.images?.webp?.image_url;
  const score = item.score || "N/A";
  const genres = item.genres.map((g) => g.name).join(", ");
  const synopsis = item.synopsis || "No synopsis available.";
  const chapters = item.chapters || item.episodes || "N/A";
  const status = item.status;
  const source = item.source || "Unknown";
  const trailer = item.trailer?.url;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        {title}
      </h1>

      {/* Card */}
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden border-2 border-blue-500">
        {/* Image */}
        <div className="relative w-full md:w-1/3 h-[450px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain rounded-xl"
            priority
          />
        </div>

        {/* Info Section */}
        <div className="p-6 flex-1 space-y-4 rounded-xl">
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <span className="font-medium text-gray-900 dark:text-white">Score:</span>{" "}
              {score} ({item.scored_by || "N/A"} votes)
            </li>
            <li>
              <span className="font-medium text-gray-900 dark:text-white">
                {isAnime ? "Episodes" : "Chapters"}:
              </span>{" "}
              {chapters}
            </li>
            <li>
              <span className="font-medium text-gray-900 dark:text-white">Status:</span> {status}
            </li>
            <li>
              <span className="font-medium text-gray-900 dark:text-white">Type:</span> {item.type}
            </li>
            <li>
              <span className="font-medium text-gray-900 dark:text-white">Source:</span> {source}
            </li>
            <li>
              <span className="font-medium text-gray-900 dark:text-white">Genres:</span> {genres}
            </li>
          </ul>

          {/* Trailer Button */}
          {isAnime && trailer && (
            <Link
              href={trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
            >
              ▶ Watch Trailer
            </Link>
          )}
        </div>
      </div>

      {/* Synopsis */}
      <div className="mt-10 rounded-xl shadow-md p-6 border-2 border-blue-500">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Synopsis
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {synopsis}
        </p>
      </div>
    </div>
  );
}
