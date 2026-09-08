import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Whether Supabase auth is configured. When false (e.g. local without keys), login gates are
 * skipped so the app still runs anonymously in dev. */
export const authConfigured = Boolean(url && anonKey);

/** Server Supabase client bound to the request cookies (reads the logged-in user's session). */
export async function createServerSupabase() {
  if (!url || !anonKey) throw new Error("Supabase auth is not configured");
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // called from a Server Component — safe to ignore (middleware refreshes cookies)
        }
      },
    },
  });
}

/**
 * Cheap "is someone signed in?" check for UI decisions (e.g. the nav CTA). Reads the session from
 * the cookie without a network round-trip — use getCurrentUser() for anything that gates access.
 */
export async function hasSession(): Promise<boolean> {
  if (!url || !anonKey) return false;
  try {
    const sb = await createServerSupabase();
    const { data } = await sb.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

/** The currently signed-in user, or null (also null when auth is unconfigured). */
export async function getCurrentUser() {
  if (!url || !anonKey) return null;
  try {
    const sb = await createServerSupabase();
    const { data } = await sb.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
