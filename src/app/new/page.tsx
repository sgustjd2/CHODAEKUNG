import type { Metadata } from "next";
import { NewInvitationWizard } from "@/components/new/new-invitation-wizard";
import "./wizard.css";

export const metadata: Metadata = {
  title: "새 초대장 · 초대쿵",
  description: "이벤트를 고르고 기본 정보와 템플릿을 선택해 초대장을 시작하세요.",
};

export default function NewInvitationPage() {
  return <NewInvitationWizard />;
}
