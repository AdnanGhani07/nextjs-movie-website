'use client';

import { useState, useEffect } from "react";
import TrailerModal from "./TrailerModal";
import { FiPlay } from "react-icons/fi";

interface TrailerButtonProps {
  trailerUrl: string;
}

export default function TrailerButton({ trailerUrl }: TrailerButtonProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition active:scale-95"
      >
        <FiPlay className="fill-black" /> Watch Trailer
      </button>

      {showModal && (
        <TrailerModal trailerUrl={trailerUrl} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
