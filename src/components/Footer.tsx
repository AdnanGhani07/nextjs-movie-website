import Link from "next/link";
import { FiHeart, FiGithub, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#08080a] py-8 mt-16 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-yellow-500 flex items-center justify-center text-black font-black text-[10px]">
            CP
          </div>
          <span className="font-semibold text-zinc-300">CinePulse</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <Link href="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link
            href="/movie/top/trending"
            className="hover:text-yellow-400 transition"
          >
            Movies
          </Link>
          <Link
            href="/anime/top/top"
            className="hover:text-yellow-400 transition"
          >
            Anime
          </Link>
          <a
            href="https://github.com/adnanghani07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
          >
            <FiGithub className="text-sm" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
