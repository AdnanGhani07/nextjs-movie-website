import { fetchTMDB, FALLBACK_MOVIES } from "@/lib/tmdb";
import { fetchAniListData } from "@/lib/fetchAnilist";
import { fetchTVmazeShow, convertTVmazeToTMDB } from "@/lib/tvmaze";
import { fetchJikan } from "@/lib/jikan";
import { fetchOMDBByTitle } from "@/lib/omdb";
import { TMDBMovie } from "@/types";
import { NormalizedMediaItem, NormalizedMediaDetail } from "../types";

/**
 * 1. Search Media Tool
 * Searches across Movies, TV Shows, and Anime, returning token-optimized normalized results.
 */
export async function searchMedia(params: {
  query: string;
  mediaType?: "all" | "movie" | "tv" | "anime";
  limit?: number;
}): Promise<NormalizedMediaItem[]> {
  const { query, mediaType = "all", limit = 10 } = params;
  const results: NormalizedMediaItem[] = [];

  const shouldFetchTmdb = mediaType === "all" || mediaType === "movie" || mediaType === "tv";
  const shouldFetchAnime = mediaType === "all" || mediaType === "anime";

  const promises: Promise<any>[] = [];

  if (shouldFetchTmdb) {
    const tmdbEndpoint =
      mediaType === "movie"
        ? "/search/movie"
        : mediaType === "tv"
        ? "/search/tv"
        : "/search/multi";

    promises.push(
      fetchTMDB<{ results: any[] }>(tmdbEndpoint, { query, page: 1 })
        .then((res) => {
          if (!res?.results) return;
          for (const item of res.results) {
            const itemType = item.media_type || (mediaType === "all" ? "movie" : mediaType);
            if (itemType !== "movie" && itemType !== "tv") continue;

            const title = item.title || item.name || "Untitled";
            const date = item.release_date || item.first_air_date || "";
            const year = date ? date.slice(0, 4) : undefined;
            const poster = item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null;

            results.push({
              id: String(item.id),
              mediaType: itemType,
              title,
              year,
              rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : undefined,
              overview: item.overview ? item.overview.slice(0, 200) + (item.overview.length > 200 ? "..." : "") : undefined,
              posterUrl: poster,
            });
          }
        })
        .catch((err) => console.error("TMDB search failed:", err))
    );
  }

  // Fallback to FALLBACK_MOVIES if TMDB returned empty or is unconfigured
  if (shouldFetchTmdb) {
    promises.push(
      Promise.resolve().then(() => {
        const lowerQ = query.toLowerCase();
        const matches = FALLBACK_MOVIES.filter((m) =>
          m.title.toLowerCase().includes(lowerQ)
        );
        for (const m of matches) {
          if (!results.some((r) => r.id === String(m.id))) {
            results.push({
              id: String(m.id),
              mediaType: "movie",
              title: m.title,
              year: m.release_date?.slice(0, 4),
              rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : undefined,
              overview: m.overview?.slice(0, 200),
              posterUrl: m.poster_path,
            });
          }
        }
      })
    );
  }

  if (shouldFetchAnime) {
    promises.push(
      fetchJikan<{ data: any[] }>(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${limit}`)
        .then((res) => {
          if (!res?.data) return;
          for (const item of res.data) {
            results.push({
              id: String(item.mal_id),
              mediaType: "anime",
              title: item.title_english || item.title || "Untitled",
              year: item.aired?.from ? item.aired.from.slice(0, 4) : undefined,
              rating: item.score || undefined,
              overview: item.synopsis ? item.synopsis.slice(0, 200) + (item.synopsis.length > 200 ? "..." : "") : undefined,
              posterUrl: item.images?.webp?.image_url || item.images?.jpg?.image_url || null,
            });
          }
        })
        .catch((err) => console.error("Jikan search failed:", err))
    );
  }

  await Promise.allSettled(promises);
  return results.slice(0, limit);
}

/**
 * 2. Get Media Details Tool
 * Inspects a specific movie, TV show, or anime title with cast credits and synopses.
 */
export async function getMediaDetails(params: {
  id: string;
  mediaType: "movie" | "tv" | "anime";
}): Promise<NormalizedMediaDetail | null> {
  const { id, mediaType } = params;

  if (mediaType === "movie") {
    const [movie, credits] = await Promise.all([
      fetchTMDB<TMDBMovie>(`/movie/${id}`),
      fetchTMDB<{ cast: any[] }>(`/movie/${id}/credits`),
    ]);

    if (!movie) return null;

    const omdbData = movie.title
      ? await fetchOMDBByTitle(movie.title, movie.release_date?.slice(0, 4))
      : null;

    return {
      id: String(movie.id),
      mediaType: "movie",
      title: movie.title || "Untitled",
      year: movie.release_date ? movie.release_date.slice(0, 4) : undefined,
      rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : undefined,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      genres: movie.genres?.map((g) => g.name) || [],
      cast: (credits?.cast || []).slice(0, 6).map((c) => ({
        name: c.name,
        character: c.character,
      })),
      tagline: (movie as any).tagline || undefined,
    };
  }

  if (mediaType === "tv") {
    let show = await fetchTMDB<any>(`/tv/${id}`);
    let cast: Array<{ name: string; character?: string }> = [];

    if (show) {
      const castData = await fetchTMDB<{ cast: any[] }>(`/tv/${id}/aggregate_credits`);
      cast = (castData?.cast || []).slice(0, 6).map((c) => ({
        name: c.name,
        character: c.roles?.[0]?.character || c.character,
      }));
    } else {
      // Fallback to TVmaze
      const tvmaze = await fetchTVmazeShow(id);
      if (tvmaze) {
        const converted = convertTVmazeToTMDB(tvmaze);
        show = converted.movie;
        cast = converted.cast.slice(0, 6).map((c) => ({
          name: c.name,
          character: c.character,
        }));
      }
    }

    if (!show) return null;

    return {
      id: String(show.id),
      mediaType: "tv",
      title: show.name || show.title || "Untitled",
      year: show.first_air_date ? show.first_air_date.slice(0, 4) : undefined,
      rating: show.vote_average ? Number(show.vote_average.toFixed(1)) : undefined,
      overview: show.overview,
      posterUrl: show.poster_path
        ? show.poster_path.startsWith("http")
          ? show.poster_path
          : `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : null,
      genres: show.genres?.map((g: any) => g.name) || [],
      episodesOrSeasons: show.number_of_seasons ? `${show.number_of_seasons} seasons` : undefined,
      cast,
    };
  }

  if (mediaType === "anime") {
    const [jikanData, jikanChars, anilistData] = await Promise.all([
      fetchJikan<{ data: any }>(`https://api.jikan.moe/v4/anime/${id}/full`),
      fetchJikan<{ data: any[] }>(`https://api.jikan.moe/v4/anime/${id}/characters`),
      fetchAniListData(id, "ANIME"),
    ]);

    const item = jikanData?.data;
    if (!item && !anilistData) return null;

    const title = item?.title_english || item?.title || anilistData?.title?.english || anilistData?.title?.romaji || "Untitled";
    const score = item?.score || (anilistData?.averageScore ? anilistData.averageScore / 10 : undefined);
    const overview = item?.synopsis || anilistData?.description?.replace(/<[^>]*>?/gm, "");
    const posterUrl = item?.images?.webp?.image_url || item?.images?.jpg?.image_url || anilistData?.coverImage?.large || null;

    const cast = (jikanChars?.data || []).slice(0, 6).map((c: any) => ({
      name: c.character?.name || "Unknown",
      character: c.role,
    }));

    return {
      id: String(item?.mal_id || anilistData?.id || id),
      mediaType: "anime",
      title,
      year: item?.aired?.from ? item.aired.from.slice(0, 4) : undefined,
      rating: score ? Number(score.toFixed(1)) : undefined,
      overview,
      posterUrl,
      genres: item?.genres?.map((g: any) => g.name) || anilistData?.genres || [],
      status: item?.status || anilistData?.status,
      episodesOrSeasons: item?.episodes ? `${item.episodes} episodes` : undefined,
      cast,
    };
  }

  return null;
}

/**
 * 3. Get Trending Media Tool
 * Returns top trending movies, TV shows, or anime.
 */
export async function getTrending(params: {
  category?: "all" | "movie" | "tv" | "anime";
  limit?: number;
}): Promise<NormalizedMediaItem[]> {
  const { category = "all", limit = 10 } = params;
  const items: NormalizedMediaItem[] = [];

  const promises: Promise<any>[] = [];

  if (category === "all" || category === "movie") {
    promises.push(
      fetchTMDB<{ results: TMDBMovie[] }>("/trending/movie/week", { page: 1 })
        .then((res) => {
          const movies = res?.results?.length ? res.results : FALLBACK_MOVIES;
          for (const m of movies.slice(0, limit)) {
            items.push({
              id: String(m.id),
              mediaType: "movie",
              title: m.title,
              year: m.release_date?.slice(0, 4),
              rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : undefined,
              overview: m.overview?.slice(0, 160),
              posterUrl: m.poster_path ? (m.poster_path.startsWith("http") ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`) : null,
            });
          }
        })
        .catch(() => {})
    );
  }

  if (category === "all" || category === "tv") {
    promises.push(
      fetchTMDB<{ results: any[] }>("/trending/tv/week", { page: 1 })
        .then((res) => {
          if (!res?.results) return;
          for (const s of res.results.slice(0, limit)) {
            items.push({
              id: String(s.id),
              mediaType: "tv",
              title: s.name || s.title || "Untitled",
              year: s.first_air_date?.slice(0, 4),
              rating: s.vote_average ? Number(s.vote_average.toFixed(1)) : undefined,
              overview: s.overview?.slice(0, 160),
              posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : null,
            });
          }
        })
        .catch(() => {})
    );
  }

  if (category === "all" || category === "anime") {
    promises.push(
      fetchJikan<{ data: any[] }>("https://api.jikan.moe/v4/top/anime?filter=airing&limit=10")
        .then((res) => {
          if (!res?.data) return;
          for (const a of res.data.slice(0, limit)) {
            items.push({
              id: String(a.mal_id),
              mediaType: "anime",
              title: a.title_english || a.title,
              year: a.aired?.from ? a.aired.from.slice(0, 4) : undefined,
              rating: a.score || undefined,
              overview: a.synopsis?.slice(0, 160),
              posterUrl: a.images?.webp?.image_url || null,
            });
          }
        })
        .catch(() => {})
    );
  }

  await Promise.allSettled(promises);
  return items.slice(0, limit);
}
