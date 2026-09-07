"use client";

import { useEffect, useState } from "react";
import type { GuestbookContent } from "@/lib/invitation/types";
import { lineText } from "@/lib/invitation/meta";
import { submitGuestbookAction, listGuestbookAction } from "@/lib/invitation/actions";

type Row = { id: string; name: string; message: string; createdAt: string };

/**
 * 방명록 — congratulatory messages. Messages live in the DB (submitted by guests);
 * this fetches them on the live page and posts new ones. In preview/editor it stays
 * optimistic (no DB), so the section is previewable without a backend.
 */
export function GuestbookSection({ content, slug, preview }: { content: GuestbookContent; slug?: string; preview?: boolean }) {
  const title = lineText(content.title);
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [err, setErr] = useState("");
  // preview/editor, or no slug (rendered outside the viewer): stay optimistic, no DB.
  const noDb = preview || !slug;
  // Gate the empty state on the first fetch, so a slow connection doesn't flash "leave the
  // first message" before the existing messages arrive.
  const [loaded, setLoaded] = useState(noDb);

  // Live like the attendee roster: load on mount, then poll every 12s so messages other
  // guests leave show up without a reload. The optimistic row a submitter prepends is
  // reconciled away by the next poll (server list replaces it — same id, no duplicate).
  useEffect(() => {
    if (noDb || !slug) return; // preview/editor: don't hit the DB
    let alive = true;
    const load = () =>
      listGuestbookAction(slug)
        .then((r) => {
          if (alive && r.ok) setRows(r.rows);
        })
        .catch(() => {})
        .finally(() => {
          if (alive) setLoaded(true);
        });
    load();
    const id = setInterval(load, 12000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [slug, noDb]);

  const submit = async () => {
    if (!msg.trim()) {
      setErr("메시지를 입력해주세요.");
      setState("error");
      return;
    }
    const optimistic: Row = { id: `local-${Date.now()}`, name: name.trim(), message: msg.trim(), createdAt: new Date().toISOString() };
    if (noDb || !slug) {
      setRows((p) => [optimistic, ...p]);
      setName("");
      setMsg("");
      setState("idle");
      return;
    }
    setState("sending");
    setErr("");
    const res = await submitGuestbookAction(slug, { name: name.trim(), message: msg.trim() });
    if (res.ok) {
      setRows((p) => [optimistic, ...p]);
      setName("");
      setMsg("");
      setState("idle");
    } else {
      setErr(res.error || "전송에 실패했어요.");
      setState("error");
    }
  };

  return (
    <section className="iv-guestbook">
      {content.eyebrow && <div className="gb-eb">{content.eyebrow}</div>}
      {title && <h3 className="gb-title">{title}</h3>}
      {content.note && <p className="gb-note">{content.note}</p>}
      <div className="gb-form">
        <input className="gb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 (선택)" maxLength={20} />
        <textarea className="gb-textarea" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="축하 메시지를 남겨주세요" rows={2} maxLength={200} />
        {state === "error" && <div className="gb-err" role="alert">{err}</div>}
        <button type="button" className="gb-submit" onClick={submit} disabled={state === "sending"}>
          {state === "sending" ? "남기는 중…" : "메시지 남기기"}
        </button>
      </div>
      <div className="gb-list">
        {rows.length === 0 ? (
          loaded && <div className="gb-empty">첫 번째 축하 메시지를 남겨보세요 💌</div>
        ) : (
          rows.map((r) => (
            <div className="gb-card" key={r.id}>
              <div className="gb-card-msg">{r.message}</div>
              <div className="gb-card-name">— {r.name || "익명"}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
