"use server";

import { upsertInvitation, submitRsvp, listRsvps, listRsvpsByOwner, listMyInvitations, getOwnedInvitation, deleteInvitation, type Visibility } from "./store";
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

/** Load one of the signed-in user's invitations for editing (data + title). */
export async function getInvitationForEditAction(slug: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const };
  const inv = await getOwnedInvitation(slug, user.id);
  return inv ? { ok: true as const, data: inv.data, title: inv.title } : { ok: false as const };
}

/** Duplicate one of the signed-in user's invitations into a fresh draft copy. */
export async function duplicateInvitationAction(sourceSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  const src = await getOwnedInvitation(sourceSlug, user.id);
  if (!src) return { ok: false as const, error: "복제할 초대장을 찾을 수 없어요" };
  const slug = randomSlug();
  const data: Invitation = { ...src.data, slug };
  const res = await upsertInvitation({ slug, title: `${src.title} (사본)`, theme: src.theme, visibility: "draft", data, ownerId: user.id });
  return res.ok ? { ok: true as const, slug } : { ok: false as const, error: res.error };
}

/** Delete one of the signed-in user's invitations (and its RSVPs). */
export async function deleteInvitationAction(slug: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  return deleteInvitation(slug, user.id);
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

/** The signed-in user's uploaded photos (media library), newest first. */
export async function listMyMediaAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  if (!isDbEnabled()) return { ok: false as const, error: "백엔드가 설정되지 않았어요" };
  const bucket = getServiceClient().storage.from("invite-photos");
  const prefix = `u/${user.id}`;
  const { data, error } = await bucket.list(prefix, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) return { ok: false as const, error: error.message };
  const items = (data ?? [])
    .filter((o) => o.id) // files carry an id; folder placeholders don't
    .map((o) => ({ path: `${prefix}/${o.name}`, url: bucket.getPublicUrl(`${prefix}/${o.name}`).data.publicUrl }));
  return { ok: true as const, items };
}

/** Delete one of the signed-in user's uploaded photos (path must be under their folder). */
export async function deleteMediaAction(path: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요해요" };
  if (!path.startsWith(`u/${user.id}/`)) return { ok: false as const, error: "권한이 없어요" };
  const { error } = await getServiceClient().storage.from("invite-photos").remove([path]);
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
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
