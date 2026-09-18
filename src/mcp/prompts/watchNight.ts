import { z } from "zod";

export const PlanWatchNightArgsSchema = {
  vibe: z.string().optional().describe("The desired vibe or mood (e.g., 'cyberpunk action', 'wholesome comedy', 'mind-bending thriller')"),
  preferredType: z.enum(["all", "movie", "tv", "anime"]).default("all").describe("Preferred media format"),
};

/**
 * Returns prompt messages guiding the agent through inspecting the user's library,
 * finding unwatched recommendations, and proposing watchlist updates.
 */
export function getPlanWatchNightPrompt(args: {
  vibe?: string;
  preferredType?: "all" | "movie" | "tv" | "anime";
}) {
  const { vibe = "exciting and captivating", preferredType = "all" } = args;

  return [
    {
      role: "user" as const,
      content: {
        type: "text" as const,
        text: `I want to plan a movie/show watch night! My desired vibe is "${vibe}" and I prefer ${preferredType === "all" ? "any media format" : preferredType}.
        
Please follow this plan:
1. Call \`get_my_library\` to check what I have already watched, rated, or saved in my watchlist so you don't suggest things I've already seen.
2. Use \`search_media\` or \`get_trending\` to discover 3 highly rated recommendations matching my vibe that are NOT in my watched history.
3. For the best match, explain why I'll love it based on its cast, storyline, and score, and ask if I would like you to call \`update_watchlist\` to save it for tonight.`,
      },
    },
  ];
}
