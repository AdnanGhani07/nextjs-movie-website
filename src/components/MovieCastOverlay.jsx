"use client";
import { useState } from "react";
import Image from "next/image";

export default function MovieCastOverlay({ cast }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-10">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        🎭 Show Cast
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg max-w-5xl w-full h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-white bg-red-500 hover:bg-red-600 p-1 px-3 rounded"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    width={140}
                    height={210}
                    className="rounded-lg object-cover mx-auto"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {actor.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">as {actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
