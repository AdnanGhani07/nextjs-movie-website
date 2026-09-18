import { createMcpSupabaseClient } from "../auth";

/**
 * Reads the latest curated spotlight / homepage content generated for CinePulse.
 * Exposes this via the `cinepulse://spotlight` MCP resource.
 */
export async function getSpotlightContent() {
  const supabase = createMcpSupabaseClient();
  const { data, error } = await supabase
    .from("home_page_content")
    .select("title, description, updated_by, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      title: "Welcome to CinePulse",
      description:
        "Discover trending movies, popular anime, top mangas, and hit TV shows all in one modern entertainment hub.",
      updated_by: "system",
      updated_at: new Date().toISOString(),
    };
  }

  return data;
}
