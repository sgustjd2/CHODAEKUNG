import type { Metadata } from "next";
import { EditorClient } from "@/components/editor/editor-client";
import "@/components/viewer/viewer.css";
import "./editor.css";

export const metadata: Metadata = {
  title: "에디터 · 초대쿵",
  description: "초대장을 섹션 단위로 편집하고 실시간으로 미리보세요.",
};

export default function EditorPage() {
  return <EditorClient />;
}
