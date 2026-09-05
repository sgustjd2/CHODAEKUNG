import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/db/supabase-server";
import { SettingsClient } from "@/components/settings/settings-client";
import "./settings.css";

export const metadata: Metadata = {
  title: "설정 · 초대쿵",
  description: "계정 정보와 비밀번호를 관리하세요.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const name = typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "";
  return <SettingsClient email={user.email ?? ""} name={name} createdAt={user.created_at ?? ""} />;
}
