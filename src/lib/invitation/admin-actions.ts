"use server";

import { requireAdmin } from "@/lib/db/admin";
import { adminDeleteInvitation, adminSetVisibility, adminSetUserTier, adminBanUser, adminDeleteUser } from "./admin-store";
import type { Visibility } from "./store";

/** Every action re-checks admin rights (never trusts the page gate alone). */

export async function adminDeleteInvitationAction(slug: string) {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  return adminDeleteInvitation(slug);
}

export async function adminSetVisibilityAction(slug: string, visibility: Visibility) {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  return adminSetVisibility(slug, visibility);
}

export async function adminSetUserTierAction(ownerId: string, tier: "free" | "premium") {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  return adminSetUserTier(ownerId, tier);
}

export async function adminBanUserAction(userId: string, banned: boolean) {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (userId === gate.user.id) return { ok: false as const, error: "본인 계정은 정지할 수 없어요" };
  return adminBanUser(userId, banned);
}

export async function adminDeleteUserAction(userId: string) {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (userId === gate.user.id) return { ok: false as const, error: "본인 계정은 삭제할 수 없어요" };
  return adminDeleteUser(userId);
}
