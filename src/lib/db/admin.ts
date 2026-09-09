import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "./supabase-server";
import { getServiceClient, isDbEnabled } from "./client";

/**
 * Admin authorization — server-only. An email is an admin iff it has a row in `public.admins`
 * (migration 0006). The `admins` table has no anon/auth RLS policy, so it is readable only via the
 * service role here. NEVER import this from a Client Component (it reaches the service key).
 */

/** True when this email is in the admins allowlist table. */
export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email || !isDbEnabled()) return false;
  try {
    const { data } = await getServiceClient().from("admins").select("email").eq("email", email.toLowerCase()).maybeSingle();
    return Boolean(data);
  } catch {
    return false;
  }
}

/** The signed-in user if they are an admin, else null. Use to gate the /admin page + header link. */
export async function getAdminUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return (await isAdminEmail(user.email)) ? user : null;
}

/** Gate for admin server actions — re-checked on every action, never trusting the page gate alone. */
export async function requireAdmin(): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const user = await getAdminUser();
  return user ? { ok: true, user } : { ok: false, error: "관리자 권한이 필요해요" };
}
