'use client';
import { useState, useEffect } from "react";
import TrailerModal from "./TrailerModal";

export default function TrailerButton({ trailerUrl }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
      >
        ▶ Watch Trailer
      </button>

      {showModal && (
        <TrailerModal trailerUrl={trailerUrl} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
