import { TMDBMovie } from "@/types";

// Official TMDB API domain is often throttled/reset by some Indian ISPs (like Airtel/Jio).
// An alternate proxy/mirror or custom TMDB_BASE_URL can be configured in .env.local:
// e.g. TMDB_BASE_URL=https://api.themoviedb.org/3 (default)
// e.g. TMDB_BASE_URL=https://tmdb-proxy.vercel.app/3 or Cloudflare Workers proxy
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;

export async function fetchTMDB<T = any>(
  endpoint: string,
  params: Record<string, string | number> = {},
  init?: RequestInit
): Promise<T | null> {
  const query = new URLSearchParams({
    api_key: API_KEY || "",
    language: "en-US",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${TMDB_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}?${query.toString()}`;

  // Try fetching with retry & timeout protection
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "CinePulse/1.0",
          ...(init?.headers || {}),
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`TMDB API Error [${res.status}] on ${endpoint}`);
        return null;
      }

      return (await res.json()) as T;
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      if (isLastAttempt) {
        console.error(
          `TMDB fetch failed for ${endpoint} (ISP/network issue or ECONNRESET):`,
          error?.message || error
        );
      }
    }
  }

  return null;
}

// Fallback curated mock data in case TMDB is completely blocked by ISP
export const FALLBACK_MOVIES: TMDBMovie[] = [
  {
    id: 939243,
    title: "Sonic the Hedgehog 3",
    overview: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before.",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-12-20",
    vote_average: 7.8,
    vote_count: 1420,
    media_type: "movie",
  },
  {
    id: 539972,
    title: "Kraven the Hunter",
    overview: "Kraven Kravinoff's complex relationship with his ruthless gangster father starts him down a path of vengeance with brutal consequences.",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-12-13",
    vote_average: 6.6,
    vote_count: 980,
    media_type: "movie",
  },
  {
    id: 1084199,
    title: "Companion",
    overview: "A weekend in the woods turns deadly when a robotic companion develops an obsession with her creator.",
    poster_path: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80",
    release_date: "2025-01-10",
    vote_average: 7.2,
    vote_count: 650,
    media_type: "movie",
  },
  {
    id: 402431,
    title: "Wicked",
    overview: "In the Land of Oz, an ostracized, green-skinned young woman named Elphaba forms an unlikely friendship with Glinda.",
    poster_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-11-22",
    vote_average: 7.6,
    vote_count: 1540,
    media_type: "movie",
  },
  {
    id: 1241982,
    title: "Moana 2",
    overview: "After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania into dangerous, long-lost waters.",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-11-27",
    vote_average: 7.1,
    vote_count: 1830,
    media_type: "movie",
  },
];
