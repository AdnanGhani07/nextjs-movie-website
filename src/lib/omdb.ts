export interface OMDBMovie {
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID: string;
  Type?: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function fetchOMDBByTitle(title: string, year?: string): Promise<OMDBMovie | null> {
  if (!OMDB_API_KEY) return null;

  const query = new URLSearchParams({
    apikey: OMDB_API_KEY,
    t: title,
    ...(year ? { y: year } : {}),
    plot: "full",
  });

  try {
    const res = await fetch(`https://www.omdbapi.com/?${query.toString()}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) return null;
    const data: OMDBMovie = await res.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("OMDb fetch failed:", error);
    return null;
  }
}

export async function fetchOMDBById(imdbId: string): Promise<OMDBMovie | null> {
  if (!OMDB_API_KEY) return null;

  const query = new URLSearchParams({
    apikey: OMDB_API_KEY,
    i: imdbId,
    plot: "full",
  });

  try {
    const res = await fetch(`https://www.omdbapi.com/?${query.toString()}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    const data: OMDBMovie = await res.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("OMDb fetch failed:", error);
    return null;
  }
}
