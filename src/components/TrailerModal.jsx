'use client';
import { useEffect } from 'react';

export default function TrailerModal({ trailerUrl, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative w-full max-w-3xl aspect-video">
        <iframe
          src={trailerUrl.replace('watch?v=', 'embed/')}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
