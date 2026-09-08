"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { submitRsvpAction } from "@/lib/invitation/actions";
import { RSVP_OPEN_EVENT } from "@/lib/invitation/rsvp-open";
import { ensureKakao } from "@/lib/kakao";
import { downloadIcs } from "@/lib/calendar";
import { createBrowserSupabase } from "@/lib/db/supabase-browser";

export type ShareMeta = { title: string; description: string; image: string };

/**
 * Sticky share pill + a theme-agnostic RSVP form. The primary CTA (invitation.shareCta) opens the
 * form; one submit path works for every theme. Hidden in the editor preview via `.iv-contained`.
 */
export function ShareBar({
  slug,
  shareCta,
  options,
  preview,
  contained,
  share,
  eventStart,
  eventLocation,
  hasAttendees,
}: {
  slug: string;
  shareCta: string;
  options: string[];
  preview?: boolean;
  /** In the editor preview — RSVP-section buttons must NOT open the modal (you're editing, not RSVPing). */
  contained?: boolean;
  share?: ShareMeta;
  /** Canonical event start (ISO) → shows an "add to calendar" (.ics) button when present. */
  eventStart?: string;
  eventLocation?: string;
  /** The invitation has a public attendee roster → pre-fill the name for signed-in guests + warn it's shown. */
  hasAttendees?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [resp, setResp] = useState(options[0] ?? "참석");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [responded, setResponded] = useState(false); // this browser already RSVP'd → edit mode
  const [doneKind, setDoneKind] = useState<"new" | "edit">("new");
  const attending = resp === (options[0] ?? "참석");
  const modalRef = useRef<HTMLDivElement>(null);
  const rsvpKey = `chodaekung:rsvp:${slug}`;
  const triggerRef = useRef<HTMLElement | null>(null); // the control that opened the dialog, to restore focus to

  // Pre-fill the RSVP name from the signed-in account, so logged-in guests show their real name.
  useEffect(() => {
    if (preview) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await createBrowserSupabase().auth.getUser();
        const u = data.user;
        const n = (typeof u?.user_metadata?.name === "string" && u.user_metadata.name.trim()) || u?.email?.split("@")[0] || "";
        if (alive && n) setName((prev) => prev || n);
      } catch {
        /* backend not configured / signed out */
      }
    })();
    return () => {
      alive = false;
    };
  }, [preview]);

  // Recognize a returning guest (this browser) and pre-fill their prior RSVP so they can edit it
  // rather than send a duplicate. Saved per-slug on submit; the backend dedupes by name, so a
  // resubmit updates their entry. (Cross-device recognition for signed-in guests would need a
  // server lookup — a future enhancement.)
  useEffect(() => {
    if (preview) return;
    try {
      const raw = localStorage.getItem(rsvpKey);
      if (!raw) return;
      const prev = JSON.parse(raw) as { name?: string; response?: string; guests?: number; message?: string };
      if (prev.name) setName(prev.name);
      if (prev.response) setResp(prev.response);
      if (typeof prev.guests === "number" && prev.guests > 0) setGuests(prev.guests);
      if (prev.message) setMessage(prev.message);
      setResponded(true);
    } catch {
      /* private mode / corrupt value — ignore */
    }
  }, [rsvpKey, preview]);

  // RSVP sections (참석/불참 buttons, accept/decline CTAs) open this same modal via an event, so a
  // tap there leads to a real submission instead of just a visual toggle. Preselects the tapped
  // choice when it matches an option; returns focus to the section button on close.
  useEffect(() => {
    if (contained) return; // editor preview: section taps shouldn't open the RSVP modal
    const onOpen = (e: Event) => {
      const choice = (e as CustomEvent<{ choice?: string }>).detail?.choice;
      if (typeof choice === "string" && options.includes(choice)) setResp(choice);
      triggerRef.current = (document.activeElement as HTMLElement) ?? null;
      setState("idle");
      setOpen(true);
    };
    window.addEventListener(RSVP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(RSVP_OPEN_EVENT, onOpen);
  }, [contained, options]);

  // A11y (CLAUDE.md §10 dialog focus management): while the RSVP dialog is open, close on
  // Escape, trap Tab focus inside it (so keyboard users can't reach the page behind), and
  // return focus to whatever opened it on close.
  useEffect(() => {
    if (!open) return;
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;
      const nodes = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!modal.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus?.(); // restore focus to the control that opened the dialog
    };
  }, [open]);

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  // KakaoTalk share when configured; otherwise copy the link (which still shows the OG card in chat).
  const shareKakao = async () => {
    const K = await ensureKakao();
    if (!K || !share) return copyLink();
    const url = window.location.href;
    // Use the composed 1200×630 share card (the opengraph-image route), so the KakaoTalk button
    // sends the same landscape card scrapers get — not the raw (often portrait) cover.
    const imageUrl = `${window.location.origin}/i/${slug}/opengraph-image`;
    try {
      K.Share.sendDefault({
        objectType: "feed",
        content: { title: share.title, description: share.description, imageUrl, link: { mobileWebUrl: url, webUrl: url } },
        buttons: [{ title: "초대장 보기", link: { mobileWebUrl: url, webUrl: url } }],
      });
    } catch {
      copyLink();
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      setErr("이름을 입력해주세요.");
      setState("error");
      return;
    }
    if (preview) {
      setState("done"); // preview only — don't write a real RSVP row
      return;
    }
    setState("sending");
    setErr("");
    const payload = { name: name.trim(), response: resp, guests: attending ? guests : 0, message: message.trim() };
    const res = await submitRsvpAction(slug, payload);
    if (res.ok) {
      setDoneKind(responded ? "edit" : "new"); // capture before flipping responded
      try {
        localStorage.setItem(rsvpKey, JSON.stringify(payload)); // remember for editing on return
      } catch {
        /* private mode — non-fatal */
      }
      setResponded(true);
      setState("done");
      // Let the on-invite attendee roster refresh immediately.
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("chodaekung:rsvp"));
    } else {
      setErr(res.error || "전송에 실패했어요.");
      setState("error");
    }
  };

  return (
    <>
      <div className="share-pill">
        <button type="button" onClick={shareKakao}>
          <Icon name="ic-chat" /> 카톡
        </button>
        <button type="button" onClick={copyLink}>
          <Icon name="ic-link" /> {copied ? "복사됨!" : "링크"}
        </button>
        {eventStart && (
          <button type="button" onClick={() => downloadIcs(eventStart, share?.title || "초대", eventLocation || "", typeof window !== "undefined" ? window.location.href : "")} title="캘린더에 추가">
            <Icon name="ic-clock" /> 캘린더
          </button>
        )}
        <button type="button" className="primary" onClick={(e) => { triggerRef.current = e.currentTarget; setState("idle"); setOpen(true); }}>
          {responded ? "응답 수정" : shareCta}
        </button>
      </div>

      {open && (
        <div className="rsvp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="rsvp-modal" role="dialog" aria-modal="true" ref={modalRef}>
            <button className="rsvp-modal-close" aria-label="닫기" onClick={() => setOpen(false)}>
              ×
            </button>
            {state === "done" ? (
              <div className="rsvp-done" role="status">
                <div className="rsvp-done-t">{doneKind === "edit" ? "수정 완료 ✓" : "응답 완료 🎉"}</div>
                <div className="rsvp-done-s">{doneKind === "edit" ? "응답을 수정했어요. 언제든 다시 바꿀 수 있어요." : "참석 여부를 보내주셔서 감사해요."}</div>
                <button type="button" className="rsvp-btn" onClick={() => setOpen(false)}>닫기</button>
              </div>
            ) : (
              <>
                <div className="rsvp-modal-t">{responded ? "응답 수정" : shareCta}</div>
                {responded && (
                  <div style={{ fontSize: 12, color: "var(--muted, #8a8a95)", lineHeight: 1.5, marginBottom: 6 }}>
                    이미 응답을 보내셨어요. 내용을 수정하고 다시 저장하면 반영돼요.
                  </div>
                )}
                <label className="rsvp-field">
                  <span>이름</span>
                  {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="성함을 입력하세요" autoComplete="name" />
                </label>
                <div className="rsvp-field">
                  <span>참석 여부</span>
                  <div className="rsvp-opts">
                    {options.map((o) => (
                      <button key={o} type="button" className={`rsvp-opt${resp === o ? " on" : ""}`} aria-pressed={resp === o} onClick={() => setResp(o)}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                {attending && (
                  <div className="rsvp-field">
                    <span>동반 인원 (본인 포함)</span>
                    <div className="rsvp-step">
                      <button type="button" aria-label="한 명 줄이기" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                      <span className="rsvp-step-n">{guests}</span>
                      <button type="button" aria-label="한 명 늘리기" onClick={() => setGuests((g) => Math.min(20, g + 1))}>+</button>
                    </div>
                  </div>
                )}
                <label className="rsvp-field">
                  <span>전하고 싶은 말 (선택)</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="축하 메시지나 전달 사항을 남겨주세요" rows={2} maxLength={200} />
                </label>
                {hasAttendees && (
                  <div style={{ fontSize: 12, color: "var(--muted, #8a8a95)", lineHeight: 1.5, marginBottom: 4 }}>
                    ‘참석’을 선택하면 이름이 초대장 참석자 명단에 표시돼요.
                  </div>
                )}
                {state === "error" && <div className="rsvp-err" role="alert">{err}</div>}
                <button type="button" className="rsvp-btn" onClick={submit} disabled={state === "sending"}>
                  {state === "sending" ? "보내는 중…" : responded ? "수정 저장" : "보내기"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
