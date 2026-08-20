import { JikanAnimeItem, CharacterItem } from "@/types";

// Centralized resilient fetcher for Jikan API with exponential backoff & rate-limit retries
export async function fetchJikan<T = any>(
  url: string,
  retries = 3,
  backoffMs = 600
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "CinePulse/1.0",
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      });

      if (res.status === 429) {
        // Rate-limited by Jikan: wait with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
        continue;
      }

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      return json as T;
    } catch (err) {
      if (attempt === retries) {
        console.error(`Jikan fetch failed after ${retries} attempts on: ${url}`);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
    }
  }
  return null;
}
