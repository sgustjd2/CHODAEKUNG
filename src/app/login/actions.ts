"use server";

import { getServiceClient, isDbEnabled } from "@/lib/db/client";

/**
 * Create an account that's already confirmed, so signup needs no email verification — the user can
 * sign in immediately after. Uses the service-role admin API (server-only), which works regardless
 * of the project's "Confirm email" setting. Email uniqueness is enforced by Supabase: a duplicate
 * email returns an error, so this can't create two accounts for the same email.
 */
export async function signUpAction(email: string, password: string) {
  if (!isDbEnabled()) return { ok: false as const, error: "백엔드가 설정되지 않았어요 (Supabase 키 필요)." };
  const { error } = await getServiceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
}
