'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function CharacterModal({ characters = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-pink-600 dark:hover:bg-pink-700 transition"
      >
        👥 View Characters
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Characters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-xl font-bold"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {characters.map((char) => (
                <div
                  key={char.character.mal_id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500 dark:border-2 dark:border-pink-500/50"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={char.character.images.webp.image_url}
                      alt={char.character.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {char.character.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
