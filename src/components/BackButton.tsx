"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export default function BackButton({ fallbackHref = "/", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-yellow-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition shadow duration-150 active:scale-95 group mb-4"
      aria-label="Go back"
    >
      <FiArrowLeft className="text-sm text-yellow-400 group-hover:-translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </button>
  );
}
