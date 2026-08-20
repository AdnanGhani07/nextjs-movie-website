import { JikanAnimeItem, CharacterItem } from "@/types";

export interface StreamingEpisode {
  title: string;
  thumbnail: string;
  url: string;
  site: string;
}

export interface AniListMedia {
  id: number;
  idMal?: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  description?: string;
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  averageScore?: number;
  episodes?: number;
  chapters?: number;
  status?: string;
  genres?: string[];
  source?: string;
  trailer?: {
    id?: string;
    site?: string;
  };
  characters?: {
    edges?: Array<{
      role?: string;
      node?: {
        id: number;
        name?: { full?: string };
        image?: { large?: string; medium?: string };
      };
    }>;
  };
  streamingEpisodes: StreamingEpisode[];
}

// Fetch single Anime or Manga media by MAL ID or AniList ID
export async function fetchAniListData(
  id: string | number,
  type: "ANIME" | "MANGA" = "ANIME"
): Promise<AniListMedia | null> {
  const isMalId = !isNaN(Number(id));
  const numericId = parseInt(String(id), 10);

  const query = `
    query ($id: Int, $type: MediaType) {
      Media(idMal: $id, type: $type) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        averageScore
        episodes
        chapters
        status
        genres
        source
        trailer {
          id
          site
        }
        characters(page: 1, perPage: 12) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
                medium
              }
            }
          }
        }
        streamingEpisodes {
          title
          thumbnail
          url
          site
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id: numericId, type } }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.data?.Media || null;
  } catch (error) {
    console.error("Error fetching AniList data:", error);
    return null;
  }
}

// Fetch Top/Popular catalog for Anime or Manga directly from AniList
export async function fetchAniListCatalog(
  type: "ANIME" | "MANGA",
  sort: "SCORE_DESC" | "POPULARITY_DESC" | "TRENDING_DESC" = "SCORE_DESC",
  page = 1,
  perPage = 10
): Promise<JikanAnimeItem[]> {
  const query = `
    query ($type: MediaType, $sort: [MediaSort], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: $type, sort: $sort, isAdult: false) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          description(asHtml: false)
          coverImage {
            large
            extraLarge
          }
          averageScore
          episodes
          chapters
          status
          genres
          source
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { type, sort: [sort], page, perPage } }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const json = await response.json();
    const mediaList: any[] = json.data?.Page?.media || [];

    // Map AniList schema to unified JikanAnimeItem interface
    return mediaList.map((m) => ({
      mal_id: m.idMal || m.id,
      title: m.title?.english || m.title?.romaji || "Untitled",
      title_english: m.title?.english,
      synopsis: m.description?.replace(/<[^>]*>?/gm, "") || "",
      score: m.averageScore ? m.averageScore / 10 : undefined,
      episodes: m.episodes,
      chapters: m.chapters,
      status: m.status,
      source: m.source,
      genres: m.genres?.map((g: string, i: number) => ({ mal_id: i, name: g })),
      images: {
        webp: {
          large_image_url: m.coverImage?.extraLarge || m.coverImage?.large,
          image_url: m.coverImage?.large,
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching AniList catalog:", error);
    return [];
  }
}
