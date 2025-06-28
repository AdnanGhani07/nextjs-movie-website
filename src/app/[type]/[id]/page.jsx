// app/[type]/[id]/page.jsx
import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { fetchAniListData } from "../../../lib/fetchAnilist";

// Lazy-load the client component for trailer modal (No SSR)
const TrailerButton = dynamic(() => import("@/components/TrailerButton"));
const CharacterModal = dynamic(() => import("@/components/CharacterModal"));

export default async function ContentPage({ params }) {
  const { id, type } = await params;
  const isAnime = type === "anime";

  const baseUrl = isAnime
    ? `https://api.jikan.moe/v4/anime/${id}/full`
    : `https://api.jikan.moe/v4/manga/${id}/full`;

  const res = await fetch(baseUrl, { cache: "no-store" });

  const characterUrl = `https://api.jikan.moe/v4/${type}/${id}/characters`;
  const characterRes = await fetch(characterUrl, { cache: "no-store" });
  const characterData = characterRes.ok
    ? await characterRes.json()
    : { data: [] };
  const characters = characterData.data;

  const anilist = isAnime ? await fetchAniListData(id) : null;

  if (!res.ok) throw new Error(`Failed to fetch ${type} details`);

  const data = await res.json();
  const item = data.data;

  const title = item.title_english || item.title;
  const imageUrl =
    item.images?.webp?.large_image_url || item.images?.webp?.image_url;
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
      <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-500 to-blue-700 dark:bg-gradient-to-r dark:from-pink-500 dark:to-pink-700 bg-clip-text text-transparent">
        {title}
      </h1>

      {/* Details Card */}
      <div className="flex flex-col md:flex-row shadow-xl border border-blue-500/50 dark:border dark:border-pink-500/50 rounded-xl overflow-hidden">
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
            <li>
              <strong>Score:</strong> {score} ({item.scored_by || "N/A"} votes)
            </li>
            <li>
              <strong>{isAnime ? "Episodes" : "Chapters"}:</strong> {chapters}
            </li>
            <li>
              <strong>Status:</strong> {status}
            </li>
            <li>
              <strong>Type:</strong> {item.type}
            </li>
            <li>
              <strong>Source:</strong> {source}
            </li>
            <li>
              <strong>Genres:</strong> {genres}
            </li>
          </ul>

          {/* Trailer Button */}
          {isAnime && trailer && (
            <Suspense fallback={null}>
              <TrailerButton trailerUrl={trailer} />
            </Suspense>
          )}

          <span className="gap-2">
            <br />
          </span>

          {/* Character Modal */}
          {characters.length > 0 && (
            <Suspense fallback={null}>
              <CharacterModal characters={characters} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Synopsis Section */}
      <div className="mt-10 rounded-xl shadow-md p-6 border border-blue-500/40 dark:border dark:border-pink-500/40 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Synopsis
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {synopsis}
        </p>
      </div>

      {anilist?.streamingEpisodes?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-pink-600">
            Watch Episodes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
            {anilist.streamingEpisodes.map((ep, i) => (
              <a
                key={i}
                href={ep.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-md dark:border dark:border-pink-500/40 border border-blue-500/40"
              >
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="w-full rounded"
                />
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-white">
                  {ep.title}
                </p>
                <span className="text-xs text-gray-500">{ep.site}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
