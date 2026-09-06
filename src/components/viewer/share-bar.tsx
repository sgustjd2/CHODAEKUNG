"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { submitRsvpAction } from "@/lib/invitation/actions";
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
  share,
  eventStart,
  eventLocation,
  hasAttendees,
}: {
  slug: string;
  shareCta: string;
  options: string[];
  preview?: boolean;
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
  const attending = resp === (options[0] ?? "참석");

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
    const imageUrl = /^https?:\/\//.test(share.image) ? share.image : window.location.origin + share.image;
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
    const res = await submitRsvpAction(slug, { name: name.trim(), response: resp, guests: attending ? guests : 0, message: message.trim() });
    if (res.ok) {
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
        <button type="button" className="primary" onClick={() => { setState("idle"); setOpen(true); }}>
          {shareCta}
        </button>
      </div>

      {open && (
        <div className="rsvp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="rsvp-modal" role="dialog" aria-modal="true">
            <button className="rsvp-modal-close" aria-label="닫기" onClick={() => setOpen(false)}>
              ×
            </button>
            {state === "done" ? (
              <div className="rsvp-done">
                <div className="rsvp-done-t">응답 완료 🎉</div>
                <div className="rsvp-done-s">참석 여부를 보내주셔서 감사해요.</div>
                <button type="button" className="rsvp-btn" onClick={() => setOpen(false)}>닫기</button>
              </div>
            ) : (
              <>
                <div className="rsvp-modal-t">{shareCta}</div>
                <label className="rsvp-field">
                  <span>이름</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="성함을 입력하세요" />
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
                {state === "error" && <div className="rsvp-err">{err}</div>}
                <button type="button" className="rsvp-btn" onClick={submit} disabled={state === "sending"}>
                  {state === "sending" ? "보내는 중…" : "보내기"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
