import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "대시보드 · 초대쿵",
  description: "내 초대장 목록과 조회·RSVP 통계를 한곳에서 관리하세요.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
