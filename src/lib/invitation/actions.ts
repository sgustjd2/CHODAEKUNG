"use server";

import { upsertInvitation, submitRsvp, type Visibility } from "./store";
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
  const slug = input.editToken ? input.slug : randomSlug();
  const data: Invitation = { ...input.data, slug };
  const res = await upsertInvitation({ slug, title: input.title, theme: input.theme, data, visibility: input.visibility, editToken: input.editToken });
  if (!res.ok) return res;
  return { ok: true, slug, editToken: res.editToken, url: `/i/${slug}` };
}

/** Guest RSVP submission from a published invitation. */
export async function submitRsvpAction(slug: string, entry: { name: string; response: string; guests?: number; message?: string }) {
  return submitRsvp(slug, entry);
}
