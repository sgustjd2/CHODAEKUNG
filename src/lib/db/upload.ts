import { authEnabled, createBrowserSupabase } from "./supabase-browser";

const BUCKET = "invite-photos";

/** Upload an image to Supabase Storage and return its public URL (client-side, anon key). */
export async function uploadPhoto(file: File): Promise<{ url: string } | { error: string }> {
  if (!authEnabled()) return { error: "백엔드가 설정되지 않았어요 (.env.local의 Supabase 키 필요)" };
  if (!file.type.startsWith("image/")) return { error: "이미지 파일만 업로드할 수 있어요." };
  if (file.size > 5 * 1024 * 1024) return { error: "5MB 이하 이미지만 업로드할 수 있어요." };
  const sb = createBrowserSupabase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  // Logged-in uploads go under the user's folder so they form a per-account media library;
  // anonymous/link-based uploads stay in the shared g/ prefix.
  const { data: { user } } = await sb.auth.getUser();
  const dir = user ? `u/${user.id}` : "g";
  const path = `${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };
  return { url: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}
