import type { Metadata } from "next";
import { RsvpClient } from "@/components/rsvp/rsvp-client";
import "./rsvp.css";

export const metadata: Metadata = {
  title: "RSVP 대시보드 · 초대쿵",
  description: "참석자 응답을 실시간으로 확인하고 명단을 관리하세요.",
};

export default function RsvpPage() {
  return <RsvpClient />;
}
