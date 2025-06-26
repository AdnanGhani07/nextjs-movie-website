// components/VideoModal.jsx
"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function MovieModal({ trailerKey, title }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trailerKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        ▶ Watch Trailer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-full max-w-4xl px-4">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={title}
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
