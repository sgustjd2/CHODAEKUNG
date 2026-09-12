"use server";

import { getServiceClient, isDbEnabled } from "@/lib/db/client";

/**
 * Create an account that's already confirmed, so signup needs no email verification — the user can
 * sign in immediately after. Uses the service-role admin API (server-only), which works regardless
 * of the project's "Confirm email" setting. Email uniqueness is enforced by Supabase: a duplicate
 * email returns an error, so this can't create two accounts for the same email.
 *
 * `name` is required at signup (real name, not a nickname) — it seeds `user_metadata.name`, which
 * drives both the dashboard/header greeting (settings.tsx) and the RSVP form's pre-filled name for
 * signed-in guests (share-bar.tsx), so a logged-in guest's RSVP defaults to their real name instead
 * of an email-derived string. Still freely editable per-RSVP — this only fixes the default.
 */
export async function signUpAction(email: string, password: string, name: string) {
  if (!isDbEnabled()) return { ok: false as const, error: "백엔드가 설정되지 않았어요 (Supabase 키 필요)." };
  const trimmedName = name.trim();
  if (!trimmedName) return { ok: false as const, error: "이름을 입력해 주세요." };
  const { error } = await getServiceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: trimmedName },
  });
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
}
