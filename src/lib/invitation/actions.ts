"use server";

import { upsertInvitation, submitRsvp, listRsvps, listRsvpsByOwner, listMyInvitations, type Visibility } from "./store";
import { getServiceClient, isDbEnabled } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/db/supabase-server";
import type { Invitation, ThemeId } from "./types";

function randomSlug(): string {
  return "inv-" + Math.random().toString(36).slice(2, 10);
}

/**
 * Publish (create or update) an invitation.
 * - With an `editToken` → updates that invitation (owner check in the store).
 * - Without one → creates a fresh, unique slug so we never clobber a sample or someone else's row,
 *   and returns the new slug + its secret edit token (the caller stores it as link-based ownership).
 */
export async function publishInvitationAction(input: {
  slug: string;
  title: string;
  theme: ThemeId;
  data: Invitation;
  visibility: Visibility;
  editToken?: string;
}): Promise<{ ok: true; slug: string; editToken: string; url: string } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  const slug = input.editToken ? input.slug : randomSlug();
  const data: Invitation = { ...input.data, slug };
  const res = await upsertInvitation({ slug, title: input.title, theme: input.theme, data, visibility: input.visibility, editToken: input.editToken, ownerId: user?.id });
  if (!res.ok) return res;
  return { ok: true, slug, editToken: res.editToken, url: `/i/${slug}` };
}

/** Invitations owned by the signed-in user (dashboard). */
export async function listMyInvitationsAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  return { ok: true as const, invitations: await listMyInvitations(user.id) };
}

/** Guest RSVP submission from a published invitation. */
export async function submitRsvpAction(slug: string, entry: { name: string; response: string; guests?: number; message?: string }) {
  return submitRsvp(slug, entry);
}

/** Owner-only RSVP list (verifies the invitation's edit token). */
export async function listRsvpsAction(slug: string, editToken: string) {
  return listRsvps(slug, editToken);
}

/** Owner-only RSVP list for the signed-in account (dashboard → /rsvp?slug=…). */
export async function listMyRsvpsAction(slug: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  return listRsvpsByOwner(slug, user.id);
}

/** Count one view (fire-and-forget from the public viewer). No-op if unconfigured/pre-migration. */
export async function bumpViewAction(slug: string) {
  if (!isDbEnabled()) return;
  try {
    await getServiceClient().rpc("increment_views", { p_slug: slug });
  } catch {
    /* rpc missing (migration not run) — ignore */
  }
}
