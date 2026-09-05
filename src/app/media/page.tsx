import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/db/supabase-server";
import { MediaClient } from "@/components/media/media-client";
import "./media.css";

export const metadata: Metadata = {
  title: "미디어 라이브러리 · 초대쿵",
  description: "업로드한 사진을 한곳에서 관리하고 재사용하세요.",
};

export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <MediaClient />;
}
