import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SearchMediaSchema,
  GetMediaDetailsSchema,
  GetTrendingSchema,
  GetMyLibrarySchema,
  UpdateWatchlistSchema,
  MarkWatchedSchema,
  RateTitleSchema,
} from "./types";
import { searchMedia, getMediaDetails, getTrending } from "./tools/discovery";
import { getMyLibrary, updateWatchlist, markWatched, rateTitle } from "./tools/library";
import { getSpotlightContent } from "./resources/spotlight";
import { PlanWatchNightArgsSchema, getPlanWatchNightPrompt } from "./prompts/watchNight";
import { createMcpSupabaseClient } from "./auth";

/**
 * Factory to create and configure the CinePulse MCP server.
 * When bearerToken is supplied, authenticated tools use a scoped Supabase client
 * that respects PostgreSQL Row-Level Security (RLS) under the caller's auth.uid().
 */
export function createCinePulseMcpServer(bearerToken?: string): McpServer {
  const server = new McpServer({
    name: "cinepulse-mcp",
    version: "1.0.0",
  });

  const supabase = createMcpSupabaseClient(bearerToken);

  // ─── 1. Public Discovery Tools ──────────────────────────────────────────────

  server.registerTool(
    "search_media",
    {
      title: "Search Media",
      description:
        "Search across movies, TV shows, and anime. Returns normalized, token-efficient metadata.",
      inputSchema: SearchMediaSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (args) => {
      const results = await searchMedia(args);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_media_details",
    {
      title: "Get Media Details",
      description:
        "Retrieve detailed information (synopsis, cast credits, rating, genres) for a movie, TV show, or anime.",
      inputSchema: GetMediaDetailsSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (args) => {
      const details = await getMediaDetails(args);
      if (!details) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `No media details found for ID "${args.id}" and type "${args.mediaType}".`,
            },
          ],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_trending",
    {
      title: "Get Trending Media",
      description: "Retrieve popular and trending movies, TV shows, or currently airing anime.",
      inputSchema: GetTrendingSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (args) => {
      const items = await getTrending(args);
      return {
        content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      };
    }
  );

  // ─── 2. Personal Library Tools (RLS Enforced) ───────────────────────────────

  server.registerTool(
    "get_my_library",
    {
      title: "Get User Library",
      description:
        "Inspect the authenticated user's personal CinePulse library: watchlist, watched history, ratings, and favorites. Requires Bearer auth.",
      inputSchema: GetMyLibrarySchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (args) => {
      const result = await getMyLibrary(supabase, args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "update_watchlist",
    {
      title: "Update Watchlist",
      description:
        "Add or remove a movie, TV show, or anime from the user's personal CinePulse watchlist. Requires Bearer auth.",
      inputSchema: UpdateWatchlistSchema,
    },
    async (args) => {
      const result = await updateWatchlist(supabase, args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "mark_watched",
    {
      title: "Mark as Watched",
      description:
        "Mark or unmark a title from the user's watched history. Requires Bearer auth.",
      inputSchema: MarkWatchedSchema,
    },
    async (args) => {
      const result = await markWatched(supabase, args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "rate_title",
    {
      title: "Rate Title",
      description:
        "Submit or update a 1 to 10 rating for a media item in CinePulse. Requires Bearer auth.",
      inputSchema: RateTitleSchema,
    },
    async (args) => {
      const result = await rateTitle(supabase, args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ─── 3. Resources ───────────────────────────────────────────────────────────

  server.registerResource(
    "spotlight",
    "cinepulse://spotlight",
    {
      title: "Weekly CinePulse Spotlight",
      description: "AI-curated weekly featured entertainment and recommendations from CinePulse.",
      mimeType: "application/json",
    },
    async () => {
      const spotlight = await getSpotlightContent();
      return {
        contents: [
          {
            uri: "cinepulse://spotlight",
            mimeType: "application/json",
            text: JSON.stringify(spotlight, null, 2),
          },
        ],
      };
    }
  );

  // ─── 4. Prompts ─────────────────────────────────────────────────────────────

  server.registerPrompt(
    "plan_watch_night",
    {
      title: "Plan Watch Night",
      description:
        "Interactive workflow: reviews personal ratings and history, discovers unwatched matches, and prepares recommendations.",
      argsSchema: PlanWatchNightArgsSchema,
    },
    (args) => {
      const messages = getPlanWatchNightPrompt(args);
      return {
        messages,
      };
    }
  );

  return server;
}
