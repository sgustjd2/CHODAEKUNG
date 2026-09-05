import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access using the service role (bypasses RLS).
 * NEVER import this from a Client Component: the service key has no NEXT_PUBLIC_ prefix, so Next
 * strips it from client bundles — `isDbEnabled()` is false on the client and `getServiceClient()`
 * would throw. Call these only from Server Components / Server Actions / Route Handlers.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the Supabase env is configured; otherwise the app falls back to bundled samples. */
export function isDbEnabled(): boolean {
  return Boolean(url && serviceKey);
}

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (!url || !serviceKey) throw new Error("Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  cached ??= createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}
