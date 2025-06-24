"use client";
import Image from "next/image";
import Link from "next/link";

export default function AnimeCard({ item, type = "anime" }) {
  const title =
    type === "anime" ? item.title : item.title_english || item.title;
  const imageUrl = item.images?.webp?.image_url || "";
  const score = item.score || "N/A";
  const startDate = item.aired?.from || item.published?.from || "Unknown";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs">
      <Link href={`/${type}/${item.mal_id}`}>
        <div className="relative w-full h-64 bg-white dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-t-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>

        <div className="p-3">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Score:</strong> {score}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Start:</strong> {startDate?.slice(0, 10)}
          </p>
        </div>
      </Link>
    </div>
  );
}
