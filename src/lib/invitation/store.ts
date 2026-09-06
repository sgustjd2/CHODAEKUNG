import { getServiceClient, isDbEnabled } from "@/lib/db/client";
import { getSampleOrNull } from "./samples";
import type { Invitation, ThemeId } from "./types";

/**
 * Invitation data layer. When Supabase is configured, reads/writes the DB; otherwise falls back to
 * the bundled samples (so the app runs with no backend). Server-only — uses the service role.
 */

export type Visibility = "draft" | "unlisted" | "published";

export type RsvpRow = { id: string; name: string; response: string; guests: number; message: string; createdAt: string };
export type GuestbookRow = { id: string; name: string; message: string; createdAt: string };

/** Is this invitation live (published/unlisted)? Gates the public guestbook read/write. */
async function isLiveInvitation(slug: string): Promise<boolean> {
  const { data } = await getServiceClient().from("invitations").select("visibility").eq("slug", slug).maybeSingle();
  return !!data && (data.visibility === "published" || data.visibility === "unlisted");
}

/** Public: post a congratulatory message to a live invitation's guestbook. */
export async function submitGuestbookEntry(slug: string, entry: { name: string; message: string }): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  if (!entry.message.trim()) return { ok: false, error: "메시지를 입력해주세요" };
  if (!(await isLiveInvitation(slug))) return { ok: false, error: "발행된 초대장에만 남길 수 있어요" };
  const { error } = await getServiceClient().from("guestbook").insert({ invitation_slug: slug, name: entry.name, message: entry.message });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Public: names of people who RSVP'd 참석 to a live invitation (for the on-invite attendee roster).
 * Only the name is exposed here — the full RSVP (guests/message) stays owner-only. */
export async function listAttendees(slug: string): Promise<{ name: string }[]> {
  if (!isDbEnabled()) return [];
  if (!(await isLiveInvitation(slug))) return [];
  const { data, error } = await getServiceClient()
    .from("rsvps")
    .select("name")
    .eq("invitation_slug", slug)
    .eq("response", "참석")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) return [];
  return (data ?? []).filter((r) => r.name?.trim()).map((r) => ({ name: r.name }));
}

/** Public: read a live invitation's guestbook messages (newest first). */
export async function listGuestbook(slug: string): Promise<GuestbookRow[]> {
  if (!isDbEnabled()) return [];
  if (!(await isLiveInvitation(slug))) return [];
  const { data, error } = await getServiceClient()
    .from("guestbook")
    .select("id, name, message, created_at")
    .eq("invitation_slug", slug)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return [];
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, message: r.message, createdAt: r.created_at }));
}

/**
 * Public read for the share page: a live (published/unlisted) DB row, or null (→ 404).
 * With a DB, the DB is the source of truth — an unknown/deleted/draft slug is not found
 * (never a stray sample). With no DB (local/demo), only curated sample slugs resolve.
 */
export async function getPublishedInvitation(slug: string): Promise<Invitation | null> {
  if (isDbEnabled()) {
    const { data, error } = await getServiceClient()
      .from("invitations")
      .select("data, visibility")
      .eq("slug", slug)
      .maybeSingle();
    return !error && data && data.visibility !== "draft" ? (data.data as Invitation) : null;
  }
  return getSampleOrNull(slug);
}

/**
 * Create or update an invitation. New slug → creates and returns a fresh `editToken`.
 * Existing slug → requires the matching `editToken` (link-based ownership).
 */
export async function upsertInvitation(rec: {
  slug: string;
  title: string;
  theme: ThemeId;
  visibility: Visibility;
  data: Invitation;
  editToken?: string;
  ownerId?: string;
}): Promise<{ ok: true; editToken: string } | { ok: false; error: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요 (.env.local의 Supabase 키 필요)" };
  const db = getServiceClient();

  const { data: existing } = await db.from("invitations").select("edit_token, owner_id").eq("slug", rec.slug).maybeSingle();
  if (existing) {
    const isOwner = rec.ownerId != null && rec.ownerId === existing.owner_id;
    const hasToken = rec.editToken != null && rec.editToken === existing.edit_token;
    if (!isOwner && !hasToken) return { ok: false, error: "이 초대장을 편집할 권한이 없어요" };
    const patch: Record<string, unknown> = { title: rec.title, theme: rec.theme, visibility: rec.visibility, data: rec.data, updated_at: new Date().toISOString() };
    if (rec.ownerId && !existing.owner_id) patch.owner_id = rec.ownerId; // claim ownership on first authed publish
    const { error } = await db.from("invitations").update(patch).eq("slug", rec.slug);
    return error ? { ok: false, error: error.message } : { ok: true, editToken: rec.editToken ?? "" };
  }

  const { data: created, error } = await db
    .from("invitations")
    .insert({ slug: rec.slug, title: rec.title, theme: rec.theme, visibility: rec.visibility, data: rec.data, owner_id: rec.ownerId ?? null })
    .select("edit_token")
    .single();
  return error || !created ? { ok: false, error: error?.message ?? "생성 실패" } : { ok: true, editToken: created.edit_token };
}

/** Read an invitation the given account owns (for duplicate/manage); null if not found or not owned. */
export async function getOwnedInvitation(
  slug: string,
  ownerId: string,
): Promise<{ title: string; theme: ThemeId; visibility: Visibility; data: Invitation } | null> {
  if (!isDbEnabled()) return null;
  const { data } = await getServiceClient().from("invitations").select("title, theme, visibility, data, owner_id").eq("slug", slug).maybeSingle();
  if (!data || data.owner_id !== ownerId) return null;
  return { title: data.title, theme: data.theme as ThemeId, visibility: data.visibility as Visibility, data: data.data as Invitation };
}

/** Delete an invitation and its RSVP rows (owner-only). */
export async function deleteInvitation(slug: string, ownerId: string): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  const db = getServiceClient();
  const { data: inv } = await db.from("invitations").select("owner_id").eq("slug", slug).maybeSingle();
  if (!inv) return { ok: false, error: "초대장을 찾을 수 없어요" };
  if (inv.owner_id !== ownerId) return { ok: false, error: "권한이 없어요" };
  await db.from("rsvps").delete().eq("invitation_slug", slug);
  const { error } = await db.from("invitations").delete().eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export type MyInvitation = { slug: string; title: string; theme: string; visibility: Visibility; img: string; updatedAt: string; views: number; rsvpCount: number };

/** Invitations owned by a user, newest first, with view + RSVP counts (for the dashboard). */
export async function listMyInvitations(ownerId: string): Promise<MyInvitation[]> {
  if (!isDbEnabled()) return [];
  const db = getServiceClient();
  type Row = { slug: string; title: string; theme: string; visibility: Visibility; data: Invitation; updated_at: string; views?: number };
  // Try selecting `views`; fall back if the column isn't there yet (migration 0003 not run).
  let rows: Row[] | null = null;
  const a = await db.from("invitations").select("slug, title, theme, visibility, data, updated_at, views").eq("owner_id", ownerId).order("updated_at", { ascending: false });
  if (!a.error) rows = a.data as unknown as Row[];
  else {
    const b = await db.from("invitations").select("slug, title, theme, visibility, data, updated_at").eq("owner_id", ownerId).order("updated_at", { ascending: false });
    if (!b.error) rows = b.data as unknown as Row[];
  }
  if (!rows) return [];

  const slugs = rows.map((r) => r.slug);
  const rsvpCounts: Record<string, number> = {};
  if (slugs.length) {
    const { data: rs } = await db.from("rsvps").select("invitation_slug").in("invitation_slug", slugs);
    for (const r of rs ?? []) rsvpCounts[r.invitation_slug] = (rsvpCounts[r.invitation_slug] ?? 0) + 1;
  }

  return rows.map((r) => {
    const inv = r.data as Invitation;
    const cover = inv?.sections?.find((s) => s.type === "cover");
    const img = cover && "image" in cover.content ? (cover.content.image as string) || "hero_flatlay" : "hero_flatlay";
    return {
      slug: r.slug,
      title: r.title,
      theme: r.theme,
      visibility: r.visibility,
      img,
      updatedAt: r.updated_at,
      views: r.views ?? 0,
      rsvpCount: rsvpCounts[r.slug] ?? 0,
    };
  });
}

/** Guest RSVP submission (anonymous). The invitation must be live. */
export async function submitRsvp(slug: string, entry: { name: string; response: string; guests?: number; message?: string }): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  const { error } = await getServiceClient().from("rsvps").insert({
    invitation_slug: slug,
    name: entry.name,
    response: entry.response,
    guests: entry.guests ?? 1,
    message: entry.message ?? "",
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Fetch an invitation's RSVP rows (call only after an ownership check). */
async function fetchRsvpRows(slug: string): Promise<{ ok: true; rows: RsvpRow[] } | { ok: false; error: string }> {
  const { data, error } = await getServiceClient()
    .from("rsvps")
    .select("id, name, response, guests, message, created_at")
    .eq("invitation_slug", slug)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    rows: (data ?? []).map((r) => ({ id: r.id, name: r.name, response: r.response, guests: r.guests, message: r.message, createdAt: r.created_at })),
  };
}

/** Owner-only RSVP list via the invitation's editToken (link-based ownership). */
export async function listRsvps(slug: string, editToken: string): Promise<{ ok: true; rows: RsvpRow[] } | { ok: false; error: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  const { data: inv } = await getServiceClient().from("invitations").select("edit_token").eq("slug", slug).maybeSingle();
  if (!inv) return { ok: false, error: "초대장을 찾을 수 없어요" };
  if (inv.edit_token !== editToken) return { ok: false, error: "권한이 없어요" };
  return fetchRsvpRows(slug);
}

/** Owner-only RSVP list via the signed-in account (works on any device, no local token needed). */
export async function listRsvpsByOwner(slug: string, ownerId: string): Promise<{ ok: true; rows: RsvpRow[] } | { ok: false; error: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  const { data: inv } = await getServiceClient().from("invitations").select("owner_id").eq("slug", slug).maybeSingle();
  if (!inv) return { ok: false, error: "초대장을 찾을 수 없어요" };
  if (inv.owner_id !== ownerId) return { ok: false, error: "권한이 없어요" };
  return fetchRsvpRows(slug);
}
