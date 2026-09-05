"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { submitRsvpAction } from "@/lib/invitation/actions";

/**
 * Sticky share pill + a theme-agnostic RSVP form. The primary CTA (invitation.shareCta) opens the
 * form; one submit path works for every theme. Hidden in the editor preview via `.iv-contained`.
 */
export function ShareBar({ slug, shareCta, options }: { slug: string; shareCta: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [resp, setResp] = useState(options[0] ?? "참석");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      setErr("이름을 입력해주세요.");
      setState("error");
      return;
    }
    setState("sending");
    setErr("");
    const res = await submitRsvpAction(slug, { name: name.trim(), response: resp });
    if (res.ok) setState("done");
    else {
      setErr(res.error || "전송에 실패했어요.");
      setState("error");
    }
  };

  return (
    <>
      <div className="share-pill">
        <button type="button" onClick={copyLink}>
          <Icon name="ic-chat" /> 카톡
        </button>
        <button type="button" onClick={copyLink}>
          <Icon name="ic-link" /> 링크
        </button>
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
