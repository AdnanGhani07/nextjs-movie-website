import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 1. Get My Library Tool
 * Retrieves the user's watchlist, watched history, ratings, or favorites.
 * Strictly enforces Supabase Row-Level Security (RLS) via the user's JWT.
 */
export async function getMyLibrary(
  supabase: SupabaseClient,
  params: { section?: "all" | "watchlist" | "watched" | "ratings" | "favorites" }
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    return {
      error: "Authentication required. Provide an Authorization: Bearer <token> header to access your personal library.",
    };
  }

  const { section = "all" } = params;
  const libraryData: Record<string, any> = {};

  if (section === "all" || section === "watchlist") {
    const { data } = await supabase
      .from("watchlist")
      .select("media_id, media_type, title, poster_path, added_at")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });
    libraryData.watchlist = data || [];
  }

  if (section === "all" || section === "watched") {
    const { data } = await supabase
      .from("watched_history")
      .select("media_id, media_type, title, poster_path, watched_at")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false });
    libraryData.watchedHistory = data || [];
  }

  if (section === "all" || section === "ratings") {
    const { data } = await supabase
      .from("ratings")
      .select("media_id, media_type, rating, title, poster_path, rated_at")
      .eq("user_id", user.id)
      .order("rated_at", { ascending: false });
    libraryData.ratings = data || [];
  }

  if (section === "all" || section === "favorites") {
    const { data } = await supabase
      .from("favorites")
      .select("movie_id, title, description, date_released, rating, image, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    libraryData.favorites = data || [];
  }

  return {
    userId: user.id,
    library: libraryData,
  };
}

/**
 * 2. Update Watchlist Tool
 * Adds or removes a title from the user's personal watchlist.
 */
export async function updateWatchlist(
  supabase: SupabaseClient,
  params: {
    action: "add" | "remove";
    mediaId: string;
    mediaType: "movie" | "tv" | "anime";
    title: string;
    posterPath?: string;
  }
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { error: "Authentication required. Provide an Authorization: Bearer <token> header." };
  }

  const { action, mediaId, mediaType, title, posterPath = "" } = params;

  if (action === "add") {
    const { error } = await supabase.from("watchlist").upsert(
      {
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        title,
        poster_path: posterPath,
      },
      { onConflict: "user_id,media_id,media_type" }
    );

    if (error) return { error: error.message };
    return { success: true, message: `Added "${title}" to your watchlist.` };
  } else {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("media_id", mediaId)
      .eq("media_type", mediaType);

    if (error) return { error: error.message };
    return { success: true, message: `Removed "${title}" from your watchlist.` };
  }
}

/**
 * 3. Mark Watched Tool
 * Adds or removes a title from the user's watched history.
 */
export async function markWatched(
  supabase: SupabaseClient,
  params: {
    action: "mark" | "unmark";
    mediaId: string;
    mediaType: "movie" | "tv" | "anime";
    title: string;
    posterPath?: string;
  }
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { error: "Authentication required. Provide an Authorization: Bearer <token> header." };
  }

  const { action, mediaId, mediaType, title, posterPath = "" } = params;

  if (action === "mark") {
    const { error } = await supabase.from("watched_history").upsert(
      {
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        title,
        poster_path: posterPath,
      },
      { onConflict: "user_id,media_id,media_type" }
    );

    if (error) return { error: error.message };
    return { success: true, message: `Marked "${title}" as watched.` };
  } else {
    const { error } = await supabase
      .from("watched_history")
      .delete()
      .eq("user_id", user.id)
      .eq("media_id", mediaId)
      .eq("media_type", mediaType);

    if (error) return { error: error.message };
    return { success: true, message: `Unmarked "${title}" from watched history.` };
  }
}

/**
 * 4. Rate Title Tool
 * Submits or updates a rating (1-10) for a title.
 */
export async function rateTitle(
  supabase: SupabaseClient,
  params: {
    mediaId: string;
    mediaType: "movie" | "tv" | "anime";
    rating: number;
    title?: string;
    posterPath?: string;
  }
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { error: "Authentication required. Provide an Authorization: Bearer <token> header." };
  }

  const { mediaId, mediaType, rating, title = "", posterPath = "" } = params;

  const { error } = await supabase.from("ratings").upsert(
    {
      user_id: user.id,
      media_id: mediaId,
      media_type: mediaType,
      rating,
      title,
      poster_path: posterPath,
    },
    { onConflict: "user_id,media_id,media_type" }
  );

  if (error) return { error: error.message };
  return { success: true, message: `Rated "${title || mediaId}" as ${rating}/10.` };
}
