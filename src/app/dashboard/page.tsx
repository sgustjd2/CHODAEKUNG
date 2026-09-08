import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getCurrentUser } from "@/lib/db/supabase-server";
import { listMyInvitations } from "@/lib/invitation/store";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "대시보드 · 초대쿵",
  description: "내 초대장 목록과 조회·RSVP 통계를 한곳에서 관리하세요.",
};

// Account view — requires login (anonymous/link creators manage via their edit link instead).
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const invitations = await listMyInvitations(user.id);
  // Prefer the nickname the user set in 설정 (user_metadata.name); fall back to the email id.
  const metaName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const displayName = metaName || (user.email ?? "").split("@")[0] || "회원";
  return <DashboardClient userEmail={user.email ?? ""} displayName={displayName} myInvitations={invitations} />;
}
