"use client";

import { useEffect, useState } from "react";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import type { Invitation } from "@/lib/invitation/types";
import "@/components/viewer/viewer.css";
import "./preview.css";

// Mirrors EditorClient's localStorage draft store, so preview shows the exact in-editor draft.
const keyFor = (slug: string) => `chodaekung:editor:v1:${slug}`;
type SavedEditor = { draft?: Invitation; title?: string; hidden?: string[]; accent?: string | null };

export default function PreviewPage() {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("slug")?.trim();
    if (!slug) return setStatus("empty");
    try {
      const raw = localStorage.getItem(keyFor(slug));
      if (!raw) return setStatus("empty");
      const saved = JSON.parse(raw) as SavedEditor;
      if (!saved.draft) return setStatus("empty");
      const hidden = new Set(saved.hidden ?? []);
      // A legacy save kept the accent at the top level (new saves keep it in draft.accent) — fold it in, as
      // the editor does, so the viewer derives every accent token from it (accentVars) instead of a raw wrapper.
      const accent = saved.draft.accent ?? saved.accent ?? undefined;
      setInvitation({ ...saved.draft, accent, sections: saved.draft.sections.filter((s) => !hidden.has(s.id)) });
      setStatus("ready");
    } catch {
      setStatus("empty");
    }
  }, []);

  if (status === "empty") {
    return (
      <div className="pv-empty">
        <p>미리보기할 초대장이 없어요.</p>
        <p className="pv-empty-sub">에디터에서 “미리보기”를 눌러 열어주세요.</p>
      </div>
    );
  }
  if (!invitation) return <div className="pv-empty" aria-busy="true" />;

  return (
    <div>
      <div className="pv-badge" aria-hidden="true">
        미리보기
      </div>
      <InvitationViewer invitation={invitation} preview />
    </div>
  );
}
