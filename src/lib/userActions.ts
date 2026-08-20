import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ─── Watchlist ──────────────────────────────────────────────────────────────

export async function addToWatchlist(params: {
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase.from("watchlist").upsert({
    user_id: user.id,
    media_id: params.mediaId,
    media_type: params.mediaType,
    title: params.title,
    poster_path: params.posterPath,
  }, { onConflict: "user_id,media_id,media_type" });
}

export async function removeFromWatchlist(mediaId: string, mediaType: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType);
}

export async function getWatchlistStatus(mediaId: string, mediaType: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType)
    .maybeSingle();

  return !!data;
}

export async function getWatchlist() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  return data || [];
}

// ─── Watched History ─────────────────────────────────────────────────────────

export async function markWatched(params: {
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase.from("watched_history").upsert({
    user_id: user.id,
    media_id: params.mediaId,
    media_type: params.mediaType,
    title: params.title,
    poster_path: params.posterPath,
  }, { onConflict: "user_id,media_id,media_type" });
}

export async function unmarkWatched(mediaId: string, mediaType: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase
    .from("watched_history")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType);
}

export async function getWatchedStatus(mediaId: string, mediaType: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("watched_history")
    .select("id")
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType)
    .maybeSingle();

  return !!data;
}

export async function getWatchedHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("watched_history")
    .select("*")
    .eq("user_id", user.id)
    .order("watched_at", { ascending: false });

  return data || [];
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

export async function setRating(params: {
  mediaId: string;
  mediaType: string;
  rating: number;
  title?: string;
  posterPath?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase.from("ratings").upsert({
    user_id: user.id,
    media_id: params.mediaId,
    media_type: params.mediaType,
    rating: params.rating,
    title: params.title,
    poster_path: params.posterPath,
  }, { onConflict: "user_id,media_id,media_type" });
}

export async function removeRating(mediaId: string, mediaType: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase
    .from("ratings")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType);
}

export async function getUserRating(mediaId: string, mediaType: string): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("ratings")
    .select("rating")
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType)
    .maybeSingle();

  return data?.rating ?? null;
}

export async function getUserRatings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("ratings")
    .select("*")
    .eq("user_id", user.id)
    .order("rated_at", { ascending: false });

  return data || [];
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function updateProfile(params: {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  return supabase.from("profiles").upsert({
    id: user.id,
    first_name: params.firstName,
    last_name: params.lastName,
    avatar_url: params.avatarUrl,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
}

export async function uploadAvatar(file: File): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Avatar upload error:", error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  return publicUrl;
}
