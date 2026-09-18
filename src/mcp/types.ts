import { z } from "zod";

// ─── Normalized Response Schemas for Token Efficiency ────────────────────────

export interface NormalizedMediaItem {
  id: string;
  mediaType: "movie" | "tv" | "anime" | "manga";
  title: string;
  year?: string | number;
  rating?: number;
  overview?: string;
  posterUrl?: string | null;
  genres?: string[];
}

export interface NormalizedMediaDetail extends NormalizedMediaItem {
  status?: string;
  episodesOrSeasons?: string | number;
  cast?: Array<{ name: string; character?: string }>;
  streamingUrl?: string | null;
  tagline?: string;
}

export interface NormalizedLibraryItem {
  id: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath?: string | null;
  timestamp: string;
  rating?: number;
}

// ─── Zod Schemas for Tool Inputs ──────────────────────────────────────────────

export const SearchMediaSchema = {
  query: z.string().min(1).describe("Search query (e.g. 'Interstellar', 'Attack on Titan', 'Breaking Bad')"),
  mediaType: z
    .enum(["all", "movie", "tv", "anime"])
    .default("all")
    .describe("Category of media to search across"),
  limit: z.number().int().min(1).max(20).default(10).describe("Maximum number of results to return"),
};

export const GetMediaDetailsSchema = {
  id: z.string().describe("The ID of the media item (TMDB ID for movie/tv, MAL/AniList ID for anime)"),
  mediaType: z.enum(["movie", "tv", "anime"]).describe("The type of media"),
};

export const GetTrendingSchema = {
  category: z
    .enum(["all", "movie", "tv", "anime"])
    .default("all")
    .describe("Trending category to inspect"),
  limit: z.number().int().min(1).max(20).default(10).describe("Number of items to retrieve"),
};

export const GetMyLibrarySchema = {
  section: z
    .enum(["all", "watchlist", "watched", "ratings", "favorites"])
    .default("all")
    .describe("Library section to fetch"),
};

export const UpdateWatchlistSchema = {
  action: z.enum(["add", "remove"]).describe("Whether to add or remove from watchlist"),
  mediaId: z.string().describe("The media item ID"),
  mediaType: z.enum(["movie", "tv", "anime"]).describe("The media type"),
  title: z.string().describe("Title of the movie, TV show, or anime"),
  posterPath: z.string().optional().describe("Optional poster URL or path"),
};

export const MarkWatchedSchema = {
  action: z.enum(["mark", "unmark"]).describe("Whether to mark as watched or remove from history"),
  mediaId: z.string().describe("The media item ID"),
  mediaType: z.enum(["movie", "tv", "anime"]).describe("The media type"),
  title: z.string().describe("Title of the movie, TV show, or anime"),
  posterPath: z.string().optional().describe("Optional poster URL or path"),
};

export const RateTitleSchema = {
  mediaId: z.string().describe("The media item ID"),
  mediaType: z.enum(["movie", "tv", "anime"]).describe("The media type"),
  rating: z.number().min(1).max(10).describe("User rating between 1 and 10"),
  title: z.string().optional().describe("Title of the movie, TV show, or anime"),
  posterPath: z.string().optional().describe("Optional poster URL or path"),
};
