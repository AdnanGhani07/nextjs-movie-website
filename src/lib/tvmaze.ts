import { TMDBMovie, CastMember } from "@/types";

export interface TVmazeShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime?: number;
  premiered?: string;
  officialSite?: string;
  schedule?: {
    time: string;
    days: string[];
  };
  rating?: {
    average?: number;
  };
  network?: {
    name: string;
  };
  image?: {
    medium?: string;
    original?: string;
  };
  summary?: string;
  _embedded?: {
    cast?: Array<{
      person: {
        id: number;
        name: string;
        image?: { medium?: string; original?: string };
      };
      character: {
        id: number;
        name: string;
      };
    }>;
    episodes?: Array<{
      id: number;
      name: string;
      season: number;
      number: number;
      summary?: string;
      image?: { medium?: string; original?: string };
    }>;
  };
}

// Fetch single show by name or ID from TVmaze with embedded cast
export async function fetchTVmazeShow(queryOrId: string | number): Promise<TVmazeShow | null> {
  try {
    const isId = !isNaN(Number(queryOrId));
    const url = isId
      ? `https://api.tvmaze.com/shows/${queryOrId}?embed[]=cast&embed[]=episodes`
      : `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(String(queryOrId))}&embed[]=cast&embed[]=episodes`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data: TVmazeShow = await res.json();
    return data;
  } catch (error) {
    console.error("TVmaze show fetch failed:", error);
    return null;
  }
}

// Fetch popular/scheduled TV Shows from TVmaze
export async function fetchTVmazeShowsCatalog(page = 1): Promise<TMDBMovie[]> {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data: TVmazeShow[] = await res.json();

    return data.slice(0, 20).map((show) => ({
      id: show.id,
      name: show.name,
      title: show.name,
      overview: show.summary?.replace(/<[^>]*>?/gm, "") || "",
      poster_path: show.image?.original || show.image?.medium || "",
      backdrop_path: show.image?.original || "",
      first_air_date: show.premiered,
      vote_average: show.rating?.average,
      media_type: "tv",
    }));
  } catch (error) {
    console.error("TVmaze catalog fetch failed:", error);
    return [];
  }
}

// Convert TVmaze show to unified TMDB and Cast format
export function convertTVmazeToTMDB(show: TVmazeShow): {
  movie: TMDBMovie;
  cast: CastMember[];
} {
  const movie: TMDBMovie = {
    id: show.id,
    name: show.name,
    title: show.name,
    overview: show.summary?.replace(/<[^>]*>?/gm, "") || "",
    poster_path: show.image?.original || show.image?.medium || "",
    backdrop_path: show.image?.original || "",
    first_air_date: show.premiered,
    vote_average: show.rating?.average,
    original_language: show.language,
    genres: show.genres?.map((g, i) => ({ id: i, name: g })),
    media_type: "tv",
  };

  const cast: CastMember[] =
    show._embedded?.cast?.map((c) => ({
      id: c.person.id,
      name: c.person.name,
      character: c.character.name,
      profile_path: c.person.image?.medium?.replace("https://static.tvmaze.com/uploads/images/medium_portrait/", "") || "",
    })) || [];

  return { movie, cast };
}
