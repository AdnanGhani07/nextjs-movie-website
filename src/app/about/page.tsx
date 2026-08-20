import Link from "next/link";
import { FiTv, FiShield, FiZap, FiGithub } from "react-icons/fi";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold">
          About CinePulse
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          The Ultimate Entertainment Hub
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Designed for cinema purists, anime enthusiasts, and TV fans who crave
          speed, luxury aesthetics, and uninterrupted streaming discoveries.
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-lg mx-auto sm:mx-0">
            <FiZap />
          </div>
          <h3 className="font-bold text-white text-base">
            Next.js 15 & TypeScript
          </h3>
          <p className="text-xs text-zinc-400">
            Ultra-fast server rendering, edge caching, and complete end-to-end
            type safety.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-lg mx-auto sm:mx-0">
            <FiShield />
          </div>
          <h3 className="font-bold text-white text-base">Supabase Backend</h3>
          <p className="text-xs text-zinc-400">
            PostgreSQL database, instant authentication, and secure row-level
            security policies.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-lg mx-auto sm:mx-0">
            <FiTv />
          </div>
          <h3 className="font-bold text-white text-base">
            Unified Multi-API Hub
          </h3>
          <p className="text-xs text-zinc-400">
            Automated resilient fallback across TMDB, TVmaze, AniList, OMDb, and
            Jikan APIs.
          </p>
        </div>
      </div>

      {/* Developer CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Built by Adnan Ghani</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Crafted with modern web technologies, AI-assisted development, and
          high-performance full-stack architecture.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com/adnanghani07"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition active:scale-95"
          >
            <FiGithub /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
