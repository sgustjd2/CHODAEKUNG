import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EditorClient } from "@/components/editor/editor-client";
import { getCurrentUser, authConfigured } from "@/lib/db/supabase-server";
import "@/components/viewer/viewer.css";
import "./editor.css";

export const metadata: Metadata = {
  title: "에디터 · 초대쿵",
  description: "초대장을 섹션 단위로 편집하고 실시간으로 미리보세요.",
};

// Editing/creating requires an account (invitations belong to the creator's dashboard).
export default async function EditorPage() {
  if (authConfigured && !(await getCurrentUser())) redirect("/login?next=/editor");
  return <EditorClient />;
}
