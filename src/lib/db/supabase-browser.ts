import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when public Supabase env is present (auth UI can run). */
export function authEnabled(): boolean {
  return Boolean(url && anonKey);
}

/** Browser Supabase client (anon key) for client-side auth — signUp / signIn / signOut. */
export function createBrowserSupabase() {
  if (!url || !anonKey) throw new Error("Supabase auth is not configured");
  return createBrowserClient(url, anonKey);
}
