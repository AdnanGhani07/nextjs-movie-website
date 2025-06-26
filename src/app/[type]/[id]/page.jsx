// app/[type]/[id]/page.jsx
import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy-load the client component for trailer modal (No SSR)
const TrailerButton = dynamic(() => import("@/components/TrailerButton"));

export default async function ContentPage({ params }) {
  const { id, type } = await params;
  const isAnime = type === "anime";

  const baseUrl = isAnime
    ? `https://api.jikan.moe/v4/anime/${id}/full`
    : `https://api.jikan.moe/v4/manga/${id}/full`;

  const res = await fetch(baseUrl, { cache: "no-store" });

  if (!res.ok) throw new Error(`Failed to fetch ${type} details`);

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

      {/* Details Card */}
      <div className="flex flex-col md:flex-row shadow-xl border border-blue-500/50 rounded-xl overflow-hidden">
        {/* Image */}
        <div className="relative w-full md:w-1/3 h-[450px] bg-white dark:bg-gray-900">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain rounded-xl"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-6 space-y-3 dark:text-white text-gray-800">
          <ul className="space-y-1 text-sm">
            <li><strong>Score:</strong> {score} ({item.scored_by || "N/A"} votes)</li>
            <li><strong>{isAnime ? "Episodes" : "Chapters"}:</strong> {chapters}</li>
            <li><strong>Status:</strong> {status}</li>
            <li><strong>Type:</strong> {item.type}</li>
            <li><strong>Source:</strong> {source}</li>
            <li><strong>Genres:</strong> {genres}</li>
          </ul>

          {/* Trailer Button */}
          {isAnime && trailer && (
            <Suspense fallback={null}>
              <TrailerButton trailerUrl={trailer} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Synopsis Section */}
      <div className="mt-10 rounded-xl shadow-md p-6 border border-blue-500/40 bg-white dark:bg-gray-900">
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
