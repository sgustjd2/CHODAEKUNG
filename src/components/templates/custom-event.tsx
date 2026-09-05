"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "캠핑장 봄맞이 모임",
  "반려동물 생일 파티",
  "이사 인사 모임",
  "결혼 5주년",
  "팬 미팅",
  "독서 모임",
  "와인 테이스팅",
  "쿠킹 클래스",
];

const MOODS: { id: string; label: string; swatch: string }[] = [
  { id: "warm", label: "따뜻하게", swatch: "var(--wax-soft)" },
  { id: "minimal", label: "미니멀", swatch: "var(--paper-3)" },
  { id: "playful", label: "재미있게", swatch: "var(--peach-soft)" },
  { id: "nature", label: "자연스럽게", swatch: "var(--sage-light)" },
  { id: "fresh", label: "산뜻하게", swatch: "var(--sky-soft)" },
  { id: "elegant", label: "우아하게", swatch: "var(--lilac-soft)" },
  { id: "celebratory", label: "축하하게", swatch: "var(--gold-light)" },
  { id: "bold", label: "강렬하게", swatch: "var(--ink)" },
];

const SECTIONS: { label: string; checked?: boolean }[] = [
  { label: "시간·일정", checked: true },
  { label: "장소·지도", checked: true },
  { label: "메뉴·준비물" },
  { label: "비용·정산" },
  { label: "참석 여부", checked: true },
  { label: "참가자 명단" },
  { label: "갤러리·사진" },
  { label: "규칙·안내" },
];

const TEMPLATE_MAP: Record<string, string> = {
  warm: "Warm & Cozy",
  minimal: "Clean Minimal",
  playful: "Playful Peach",
  nature: "Nature Sage",
  fresh: "Fresh Sky",
  elegant: "Elegant Lilac",
  celebratory: "Celebratory Gold",
  bold: "Bold Ink",
};

export function CustomEvent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [moods, setMoods] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleMood = (id: string) =>
    setMoods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const showPreview = name.trim() !== "" || moods.length > 0;
  const primary = moods[0] ? TEMPLATE_MAP[moods[0]] : "Warm & Cozy";
  const create = () =>
    router.push(`/new?event=${encodeURIComponent(name.trim() || "내 이벤트")}`);

  return (
    <>
      {/* Banner */}
      <div className="custom-event-banner">
        <div className="ceb-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L14 10L21 12L14 14L12 21L10 14L3 12L10 10L12 3Z" />
          </svg>
        </div>
        <div className="ceb-text">
          <div className="ceb-title">
            여기에 없는 이벤트도 <em>직접 만들 수 있어요</em>
          </div>
          <div className="ceb-desc">
            캠핑장 초대, 팬 미팅, 프로필 촬영, 결혼기념일, 이사 인사, 그 어떤 모임이든 —
            이벤트 이름과 성격만 입력하면 어울리는 템플릿이 준비돼요.
          </div>
        </div>
        <button className="ceb-btn" type="button" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          커스텀 이벤트 만들기
        </button>
      </div>

      {/* Modal */}
      <div
        className={["ce-modal-backdrop", open ? "open" : ""].filter(Boolean).join(" ")}
        onClick={() => setOpen(false)}
      />
      <div
        className={["ce-modal", open ? "open" : ""].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="커스텀 이벤트 만들기"
      >
        <div className="ce-modal-head">
          <div>
            <div className="ce-eb">Custom Event</div>
            <h3>
              어떤 <em>이벤트</em>인가요?
            </h3>
            <p>이름과 성격을 알려주시면 AI가 어울리는 템플릿·색상·문구를 추천해드릴게요.</p>
          </div>
          <button className="ce-close" type="button" aria-label="닫기" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ce-modal-body">
          <div className="ce-field">
            <label className="input-label" htmlFor="ceName">
              이벤트 이름 <span style={{ color: "var(--wax-deep)" }}>*</span>
            </label>
            <input
              id="ceName"
              className="input"
              placeholder="예: 캠핑장 봄맞이 모임, 팬 미팅, 결혼 5주년 파티"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="ce-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="ce-sug" type="button" onClick={() => setName(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ce-field">
            <label className="input-label">
              이벤트 성격을 골라주세요 <span style={{ color: "var(--muted)" }}>(여러 개 선택 가능)</span>
            </label>
            <div className="ce-mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={["ce-mood", moods.includes(m.id) ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => toggleMood(m.id)}
                >
                  <span className="mood-swatch" style={{ background: m.swatch }} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ce-field">
            <label className="input-label">
              필요한 섹션 <span style={{ color: "var(--muted)" }}>(있으면 체크)</span>
            </label>
            <div className="ce-sec-grid">
              {SECTIONS.map((s) => (
                <label className="ce-sec" key={s.label}>
                  <input type="checkbox" defaultChecked={s.checked} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {showPreview && (
            <div className="ce-preview">
              <div className="ce-preview-head">
                <span className="ce-preview-eb">AI Recommendation</span>
                <span className="ce-preview-name">{name.trim() || "입력 대기 중"}</span>
              </div>
              <div className="ce-preview-body">
                입력하신 정보로 <b>{primary}</b> 스타일 템플릿을 추천드릴게요.
                <br />
                선택하신 섹션이 자동으로 준비됩니다.
              </div>
            </div>
          )}
        </div>

        <div className="ce-modal-foot">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={create}>
            이 이벤트로 시작 →
          </Button>
        </div>
      </div>
    </>
  );
}
