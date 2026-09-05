import { getServiceClient, isDbEnabled } from "@/lib/db/client";
import { getInvitation as getSampleInvitation } from "./samples";
import type { Invitation, ThemeId } from "./types";

/**
 * Invitation data layer. When Supabase is configured, reads/writes the DB; otherwise falls back to
 * the bundled samples (so the app runs with no backend). Server-only — uses the service role.
 */

export type Visibility = "draft" | "unlisted" | "published";

export type RsvpRow = { id: string; name: string; response: string; guests: number; message: string; createdAt: string };

/** Public read for the share page: a live (published/unlisted) DB row, else the sample fallback. */
export async function getPublishedInvitation(slug: string): Promise<Invitation> {
  if (isDbEnabled()) {
    const { data, error } = await getServiceClient()
      .from("invitations")
      .select("data, visibility")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data && data.visibility !== "draft") return data.data as Invitation;
  }
  return getSampleInvitation(slug);
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
}): Promise<{ ok: true; editToken: string } | { ok: false; error: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요 (.env.local의 Supabase 키 필요)" };
  const db = getServiceClient();

  const { data: existing } = await db.from("invitations").select("edit_token").eq("slug", rec.slug).maybeSingle();
  if (existing) {
    if (!rec.editToken || rec.editToken !== existing.edit_token) return { ok: false, error: "이 초대장을 편집할 권한이 없어요" };
    const { error } = await db
      .from("invitations")
      .update({ title: rec.title, theme: rec.theme, visibility: rec.visibility, data: rec.data, updated_at: new Date().toISOString() })
      .eq("slug", rec.slug);
    return error ? { ok: false, error: error.message } : { ok: true, editToken: rec.editToken };
  }

  const { data: created, error } = await db
    .from("invitations")
    .insert({ slug: rec.slug, title: rec.title, theme: rec.theme, visibility: rec.visibility, data: rec.data })
    .select("edit_token")
    .single();
  return error || !created ? { ok: false, error: error?.message ?? "생성 실패" } : { ok: true, editToken: created.edit_token };
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

/** Owner-only RSVP list — requires the invitation's editToken. */
export async function listRsvps(slug: string, editToken: string): Promise<{ ok: true; rows: RsvpRow[] } | { ok: false; error: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 아직 설정되지 않았어요" };
  const db = getServiceClient();
  const { data: inv } = await db.from("invitations").select("edit_token").eq("slug", slug).maybeSingle();
  if (!inv) return { ok: false, error: "초대장을 찾을 수 없어요" };
  if (inv.edit_token !== editToken) return { ok: false, error: "권한이 없어요" };
  const { data, error } = await db
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
