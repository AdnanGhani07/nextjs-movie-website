import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an ephemeral, server-side Supabase client scoped to the user's JWT.
 * When bearerToken is provided, queries run under that user's identity (auth.uid()),
 * ensuring PostgreSQL Row Level Security (RLS) is strictly enforced.
 * NEVER use SUPABASE_SERVICE_ROLE_KEY here.
 */
export function createMcpSupabaseClient(bearerToken?: string): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken.trim()}` } : {},
    },
  });
}

/**
 * Helper to extract a Bearer token from an Authorization header value.
 */
export function extractBearerToken(authHeader?: string | null): string | undefined {
  if (!authHeader) return undefined;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : undefined;
}
