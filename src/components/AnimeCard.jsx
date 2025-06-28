"use client";
import Image from "next/image";
import Link from "next/link";
import { FiThumbsUp } from "react-icons/fi";

export default function AnimeCard({ item, type = "anime" }) {
  const title = item.title_english || item.title || "Untitled";
  const imageUrl = item.images?.webp?.large_image_url || item.images?.webp?.image_url;
  const synopsis = item.synopsis || "No description available.";
  const score = item.score || "N/A";
  const startDate = item.aired?.from || item.published?.from || "Unknown";
  const voteCount = item.scored_by || 0;

  return (
    <div className="group cursor-pointer sm:hover:shadow-blue-500 dark:hover:shadow-pink-500 sm:shadow-md rounded-lg sm:border sm:border-blue-500 dark:border-pink-500 sm:m-2 transition-shadow duration-200 w-full max-w-xs">
      <Link href={`/${type}/${item.mal_id}`}>
        {/* Image Section */}
        <div className="relative w-full h-36">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="sm:rounded-t-lg object-cover group-hover:opacity-75 transition-opacity duration-300"
            sizes="100%"
            priority
          />
        </div>

        {/* Info Section */}
        <div className="p-2">
          <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">{synopsis}</p>
          <h2 className="font-bold truncate my-2 text-md text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            {startDate?.slice(0, 10)}
            <FiThumbsUp className="h-5 mr-1 ml-3" />
            {voteCount}
          </p>
        </div>
      </Link>
    </div>
  );
}
