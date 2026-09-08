import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewInvitationWizard } from "@/components/new/new-invitation-wizard";
import { getCurrentUser, authConfigured } from "@/lib/db/supabase-server";
import "./wizard.css";

export const metadata: Metadata = {
  title: "새 초대장 · 초대쿵",
  description: "이벤트를 고르고 기본 정보와 템플릿을 선택해 초대장을 시작하세요.",
};

// Creating an invitation requires an account (so it's saved to the creator's dashboard).
export default async function NewInvitationPage() {
  if (authConfigured && !(await getCurrentUser())) redirect("/login?next=/new");
  return <NewInvitationWizard />;
}
