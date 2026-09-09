import type { User } from "@supabase/supabase-js";
import { getServiceClient, isDbEnabled } from "@/lib/db/client";
import type { Invitation } from "./types";
import type { Visibility } from "./store";

/**
 * Admin-only data access (whole-table, across all owners) via the service role. Gated upstream by
 * the admin server actions (requireAdmin) — never call from a Client Component.
 */

export type AdminInvitation = {
  slug: string;
  title: string;
  theme: string;
  visibility: Visibility;
  ownerId: string | null;
  ownerEmail: string;
  tier: "free" | "premium";
  views: number;
  rsvpCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignInAt: string | null;
  banned: boolean;
  invitationCount: number;
  premiumCount: number;
};

export type AdminStats = { users: number; invitations: number; published: number; totalViews: number };

export type AdminData = { stats: AdminStats; invitations: AdminInvitation[]; users: AdminUser[] };

/** All auth users, paginated (capped for v1). */
async function fetchAllAuthUsers(): Promise<User[]> {
  const db = getServiceClient();
  const out: User[] = [];
  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) break;
    out.push(...data.users);
    if (data.users.length < perPage) break;
  }
  return out;
}

type InvRow = { slug: string; title: string; theme: string; visibility: Visibility; data: Invitation; owner_id: string | null; created_at: string; updated_at: string; views?: number };

async function fetchAllInvitations(): Promise<InvRow[]> {
  const db = getServiceClient();
  const cols = "slug, title, theme, visibility, data, owner_id, created_at, updated_at";
  const a = await db.from("invitations").select(`${cols}, views`).order("updated_at", { ascending: false });
  if (!a.error) return (a.data as unknown as InvRow[]) ?? [];
  const b = await db.from("invitations").select(cols).order("updated_at", { ascending: false }); // views column not present yet
  return !b.error ? ((b.data as unknown as InvRow[]) ?? []) : [];
}

/** Load everything the admin console shows in one pass (users + invitations + stats). */
export async function loadAdminData(): Promise<AdminData> {
  if (!isDbEnabled()) return { stats: { users: 0, invitations: 0, published: 0, totalViews: 0 }, invitations: [], users: [] };
  const db = getServiceClient();
  const [authUsers, rows] = await Promise.all([fetchAllAuthUsers(), fetchAllInvitations()]);

  const userById = new Map(authUsers.map((u) => [u.id, u]));
  const emailFor = (id: string | null) => (id && userById.get(id)?.email) || "(비회원/링크)";
  const nameOf = (u: User) => (typeof u.user_metadata?.name === "string" ? u.user_metadata.name.trim() : "") || (u.email ?? "").split("@")[0] || "";

  // RSVP counts per slug (one query).
  const slugs = rows.map((r) => r.slug);
  const rsvpCounts: Record<string, number> = {};
  if (slugs.length) {
    const { data: rs } = await db.from("rsvps").select("invitation_slug").in("invitation_slug", slugs);
    for (const r of rs ?? []) rsvpCounts[r.invitation_slug] = (rsvpCounts[r.invitation_slug] ?? 0) + 1;
  }

  const invitations: AdminInvitation[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    theme: r.theme,
    visibility: r.visibility,
    ownerId: r.owner_id,
    ownerEmail: emailFor(r.owner_id),
    tier: r.data?.tier === "premium" ? "premium" : "free",
    views: r.views ?? 0,
    rsvpCount: rsvpCounts[r.slug] ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  // Per-owner invitation + premium counts.
  const invCount: Record<string, number> = {};
  const premCount: Record<string, number> = {};
  for (const inv of invitations) {
    if (!inv.ownerId) continue;
    invCount[inv.ownerId] = (invCount[inv.ownerId] ?? 0) + 1;
    if (inv.tier === "premium") premCount[inv.ownerId] = (premCount[inv.ownerId] ?? 0) + 1;
  }

  const users: AdminUser[] = authUsers
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: nameOf(u),
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      // supabase-js types don't surface banned_until; it's present at runtime for banned users.
      banned: Boolean((u as unknown as { banned_until?: string }).banned_until),
      invitationCount: invCount[u.id] ?? 0,
      premiumCount: premCount[u.id] ?? 0,
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const stats: AdminStats = {
    users: authUsers.length,
    invitations: invitations.length,
    published: invitations.filter((i) => i.visibility === "published").length,
    totalViews: invitations.reduce((n, i) => n + i.views, 0),
  };

  return { stats, invitations, users };
}

/** Delete any invitation (admin) — rsvps + guestbook cascade on the FK. */
export async function adminDeleteInvitation(slug: string): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 설정되지 않았어요" };
  const { error } = await getServiceClient().from("invitations").delete().eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Set any invitation's visibility (admin) — e.g. takedown to 'draft', restore to 'published'. */
export async function adminSetVisibility(slug: string, visibility: Visibility): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 설정되지 않았어요" };
  const { error } = await getServiceClient().from("invitations").update({ visibility, updated_at: new Date().toISOString() }).eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Grant/revoke premium across ALL of a user's invitations (tier lives per-invitation in data). */
export async function adminSetUserTier(ownerId: string, tier: "free" | "premium"): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 설정되지 않았어요" };
  const db = getServiceClient();
  const { data: rows, error } = await db.from("invitations").select("slug, data").eq("owner_id", ownerId);
  if (error) return { ok: false, error: error.message };
  for (const r of rows ?? []) {
    const data = { ...(r.data as Invitation), tier };
    const { error: e } = await db.from("invitations").update({ data, updated_at: new Date().toISOString() }).eq("slug", r.slug);
    if (e) return { ok: false, error: e.message };
  }
  return { ok: true };
}

/** Ban or unban a user (blocks login; data preserved). */
export async function adminBanUser(userId: string, banned: boolean): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 설정되지 않았어요" };
  // A long finite duration = effectively permanent; "none" lifts the ban.
  const { error } = await getServiceClient().auth.admin.updateUserById(userId, { ban_duration: banned ? "876000h" : "none" });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Permanently delete a user and ALL their data. owner_id is on-delete-set-null, so delete their
 * invitations first (cascades rsvps + guestbook), then the auth user. */
export async function adminDeleteUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  if (!isDbEnabled()) return { ok: false, error: "백엔드가 설정되지 않았어요" };
  const db = getServiceClient();
  const { error: delInv } = await db.from("invitations").delete().eq("owner_id", userId);
  if (delInv) return { ok: false, error: delInv.message };
  const { error } = await db.auth.admin.deleteUser(userId);
  return error ? { ok: false, error: error.message } : { ok: true };
}
