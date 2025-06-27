"use client";
import Image from "next/image";
import { useState } from "react";

export default function CastOverlay({ cast }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Show Cast
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 max-w-5xl w-full p-6 rounded-lg overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-red-500 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
              Cast Members
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map(member => (
                <div key={member.id} className="text-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    width={100}
                    height={140}
                    className="rounded-md object-cover mx-auto"
                  />
                  <p className="mt-1 font-semibold">{member.name}</p>
                  <p className="text-xs text-gray-500">as {member.roles?.[0]?.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
