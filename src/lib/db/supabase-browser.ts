const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when public Supabase env is present (auth UI can run). */
export function authEnabled(): boolean {
  return Boolean(url && anonKey);
}

/**
 * Browser Supabase client (anon key) for client-side auth — signUp / signIn / signOut.
 *
 * Async on purpose: `@supabase/ssr` is ~67KB gzip (≈30% of a public page's JS), and a static import here
 * shipped it to EVERY page — landing and the invitation viewer included — though they only need it
 * after an interaction. Importing it lazily makes each page download it only when auth is actually used.
 */
export async function createBrowserSupabase() {
  if (!url || !anonKey) throw new Error("Supabase auth is not configured");
  const { createBrowserClient } = await import("@supabase/ssr");
  return createBrowserClient(url, anonKey);
}
