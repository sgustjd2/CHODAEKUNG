"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { AddressSearch } from "@/components/ui/address-search";

type EventDef = { id: string; icon: string; name: string; hint: string };

const EVENTS: EventDef[] = [
  { id: "wedding", icon: "ic-ring", name: "결혼식", hint: "wedding" },
  { id: "birthday", icon: "ic-cake", name: "생일", hint: "birthday" },
  { id: "dol", icon: "ic-balloon", name: "돌잔치", hint: "first birthday" },
  { id: "housewarming", icon: "ic-house", name: "집들이", hint: "housewarming" },
  { id: "bridal", icon: "ic-flower", name: "브라이덜 샤워", hint: "bridal shower" },
  { id: "baby", icon: "ic-baby", name: "베이비 샤워", hint: "baby shower" },
  { id: "yearend", icon: "ic-glass", name: "송년회", hint: "year-end" },
  { id: "party", icon: "ic-confetti", name: "파티", hint: "party" },
  { id: "seminar", icon: "ic-book", name: "세미나", hint: "seminar" },
  { id: "club", icon: "ic-target", name: "동호회 모임", hint: "club meet" },
  { id: "corporate", icon: "ic-briefcase", name: "회사 행사", hint: "corporate" },
  { id: "sports-battle", icon: "ic-ball", name: "조기축구", hint: "soccer battle" },
  { id: "running", icon: "ic-run", name: "러닝 모임", hint: "morning run" },
  { id: "badminton", icon: "ic-badminton", name: "배드민턴", hint: "badminton" },
  { id: "hiking", icon: "ic-mountain", name: "등산 모임", hint: "hiking" },
  { id: "baseball", icon: "ic-baseball", name: "야구 관람", hint: "baseball watch" },
  { id: "basketball", icon: "ic-basketball", name: "농구 모임", hint: "basketball" },
  { id: "tennis", icon: "ic-tennis", name: "테니스", hint: "tennis meet" },
  { id: "golf", icon: "ic-golf", name: "골프 라운딩", hint: "golf" },
  { id: "cycling", icon: "ic-bike", name: "자전거", hint: "cycling" },
  { id: "swim", icon: "ic-swim", name: "수영·서핑", hint: "swim & surf" },
  { id: "yoga", icon: "ic-yoga", name: "요가·필라테스", hint: "yoga · pilates" },
  { id: "study", icon: "ic-study", name: "스터디", hint: "study group" },
  { id: "camping", icon: "ic-camping", name: "캠핑·차박", hint: "camping" },
  { id: "picnic", icon: "ic-picnic", name: "피크닉", hint: "picnic" },
  { id: "travel", icon: "ic-travel", name: "여행 모임", hint: "travel" },
  { id: "cafe", icon: "ic-coffee", name: "카페 투어", hint: "cafe hop" },
  { id: "foodie", icon: "ic-food", name: "맛집 탐방", hint: "foodie meet" },
  { id: "music", icon: "ic-music", name: "음악·공연", hint: "concert" },
  { id: "photo", icon: "ic-camera", name: "사진 출사", hint: "photo walk" },
  { id: "pet", icon: "ic-pet", name: "반려동물 모임", hint: "pet meetup" },
  { id: "game-battle", icon: "ic-controller", name: "게임 도전장", hint: "e-sports" },
  { id: "tournament", icon: "ic-trophy", name: "토너먼트", hint: "championship" },
];

// Chosen event → the built theme sample the editor starts from (theme-appropriate content).
const EVENT_SAMPLE: Record<string, string> = {
  wedding: "jisoo-minjun", birthday: "appa-60", dol: "cozy-home", housewarming: "cozy-home",
  bridal: "after-hours", baby: "cozy-home", yearend: "after-hours", party: "after-hours",
  seminar: "after-hours", club: "beongae", corporate: "after-hours", "sports-battle": "jogi-battle",
  running: "beongae", badminton: "jogi-battle", hiking: "yangyang-mt", baseball: "jogi-battle",
  basketball: "jogi-battle", tennis: "jogi-battle", golf: "jogi-battle", cycling: "beongae",
  swim: "beongae", yoga: "beongae", study: "beongae", camping: "yangyang-mt", picnic: "beongae",
  travel: "yangyang-mt", cafe: "beongae", foodie: "beongae", music: "after-hours", photo: "after-hours",
  pet: "cozy-home", "game-battle": "lol-quick", tournament: "lol-rank",
};

const CUSTOM_SUGGESTIONS: { name: string; label: string }[] = [
  { name: "캠핑장 봄맞이 모임", label: "🏕 캠핑장 모임" },
  { name: "반려동물 생일 파티", label: "🐕 반려동물 생일" },
  { name: "이사 인사", label: "📦 이사 인사" },
  { name: "결혼 5주년", label: "💐 결혼 기념일" },
  { name: "팬 미팅", label: "🎤 팬 미팅" },
  { name: "독서 모임", label: "📖 독서 모임" },
  { name: "와인 테이스팅", label: "🍷 와인 테이스팅" },
  { name: "쿠킹 클래스", label: "👩‍🍳 쿠킹 클래스" },
  { name: "프로필 촬영", label: "📸 프로필 촬영" },
  { name: "플리마켓 · 판매", label: "🛍 플리마켓" },
];

const CUSTOM_ICONS = [
  "ic-sparkle", "ic-camping", "ic-pet", "ic-house", "ic-heart", "ic-music",
  "ic-book", "ic-glass", "ic-food", "ic-camera", "ic-briefcase", "ic-target",
];

const CUSTOM_MOODS: { id: string; label: string; swatch: string }[] = [
  { id: "warm", label: "따뜻하게", swatch: "var(--wax-soft)" },
  { id: "playful", label: "재미있게", swatch: "var(--peach-soft)" },
  { id: "nature", label: "자연스럽게", swatch: "var(--sage-light)" },
  { id: "fresh", label: "산뜻하게", swatch: "var(--sky-soft)" },
  { id: "elegant", label: "우아하게", swatch: "var(--lilac-soft)" },
  { id: "celebratory", label: "축하하게", swatch: "var(--gold-light)" },
];

// Custom-event mood → the theme + accent the blank editor starts with, so the mood choice
// actually shapes the invitation instead of being discarded.
const MOOD_THEME: Record<string, { theme: string; accent: string }> = {
  warm: { theme: "romantic", accent: "#E38B8B" },
  playful: { theme: "cute", accent: "#F5D896" },
  nature: { theme: "timeline", accent: "#B5CAB2" },
  fresh: { theme: "minimal", accent: "#A0A8B8" },
  elegant: { theme: "editorial", accent: "#2A2A3E" },
  celebratory: { theme: "cute", accent: "#C96A6A" },
};

type StyleDef = { id: string; img?: string; blank?: boolean; cat: string; name: ReactNode; nameText: string };
const STYLES: StyleDef[] = [
  { id: "1", img: "romantic_wedding", cat: "Romantic · Featured", name: <>Meadow <em>Love</em></>, nameText: "Meadow Love" },
  { id: "2", img: "hero_flatlay", cat: "Handwritten · Classic", name: <>Wax <em>Seal</em></>, nameText: "Wax Seal" },
  { id: "3", img: "wedding_gallery_1", cat: "Fine Art · Serif", name: <>Hands <em>Together</em></>, nameText: "Hands Together" },
  { id: "4", img: "wedding_gallery_2", cat: "Editorial · Trending", name: <>Golden <em>Trail</em></>, nameText: "Golden Trail" },
  { id: "5", img: "minimal_birthday", cat: "Minimal · Editorial", name: <>Quiet <em>Day</em></>, nameText: "Quiet Day" },
  { id: "6", blank: true, cat: "Blank · Custom", name: <>처음<em>부터</em></>, nameText: "처음부터" },
];

const STEP_LABELS = ["이벤트 선택", "기본 정보", "템플릿", "완료"];
const STEP_NAMES = ["Event Type", "Basic Info", "Template", "Ready"];
const TOTAL = 4;

export function NewInvitationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState("wedding");
  const [quick, setQuick] = useState(true);
  const [customName, setCustomName] = useState("캠핑장 봄맞이 모임");
  const [customIcon, setCustomIcon] = useState("ic-sparkle");
  const [customMoods, setCustomMoods] = useState<string[]>([]);
  const [template, setTemplate] = useState("1");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const customOpen = event === "custom";

  // Prefill from ?event= (read directly on mount; robust across nav types)
  useEffect(() => {
    const ev = new URLSearchParams(window.location.search).get("event");
    if (ev) {
      setCustomName(ev);
      setEvent("custom");
    }
  }, []);

  // Scroll to custom panel when it opens
  useEffect(() => {
    if (customOpen && panelRef.current) {
      const el = panelRef.current;
      const t = setTimeout(() => {
        const y = el.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [customOpen]);

  const go = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open the editor: seed the chosen theme's template (or blank for "처음부터"/custom),
  // and hand the typed basics to the editor via sessionStorage.
  const startEditor = () => {
    const eventName = event === "custom" ? customName : selectedEvent?.name ?? "";
    // Custom events start blank; apply the picked mood as the starting theme + accent.
    const moodStyle = event === "custom" ? MOOD_THEME[customMoods[0]] : undefined;
    try {
      sessionStorage.setItem(
        "chodaekung:wizard",
        JSON.stringify({ title, subtitle, date, time, location, eventName, theme: moodStyle?.theme, accent: moodStyle?.accent }),
      );
    } catch {
      /* ignore */
    }
    const blank = template === "6" || event === "custom";
    const sample = blank ? "" : EVENT_SAMPLE[event] ?? "";
    router.push(sample ? `/editor?template=${sample}` : "/editor");
  };
  const toggleMood = (id: string) =>
    setCustomMoods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const selectedEvent = EVENTS.find((e) => e.id === event);
  const selectedStyle = STYLES.find((s) => s.id === template);
  const summaryEventName = event === "custom" ? customName : selectedEvent?.name ?? "—";
  const summaryEventIcon = event === "custom" ? customIcon : selectedEvent?.icon ?? "ic-sparkle";

  return (
    <div className="wizard">
      {/* Top bar */}
      <div className="top">
        <Link href="/" className="top-logo">
          <Logo />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="progress-info">
            Step <b>{step}</b> / {TOTAL}
          </div>
          <Link href="/" aria-label="종료">
            <button className="top-close" type="button" title="종료">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className="step-track">
          {STEP_LABELS.map((_, i) => {
            const n = i + 1;
            const cls = n < step ? "step-dot done" : n === step ? "step-dot active" : "step-dot";
            return (
              <div key={n} style={{ display: "contents" }}>
                <div className={cls}>
                  <span>{n}</span>
                </div>
                {n < TOTAL && <div className={`step-line${n < step ? " done" : ""}`} />}
              </div>
            );
          })}
        </div>
        <div className="step-labels">
          {STEP_LABELS.map((l, i) => (
            <div key={l} className={`lbl${i + 1 === step ? " active" : ""}`}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-body">
        {/* STEP 1 */}
        <div className={`step-panel${step === 1 ? " active" : ""}`}>
          <div className="step-eyebrow">Step 1 · Event Type</div>
          <h1 className="step-title">
            어떤 <em>모임</em>을 준비하시나요?
          </h1>
          <p className="step-desc">
            결혼식·돌잔치는 물론, 러닝·등산·조기축구·스터디·야구관람 같은 소모임 초대장까지.
            원하는 이벤트를 선택하면 어울리는 템플릿과 섹션이 자동으로 준비돼요.
          </p>

          <div className="quick-toggle">
            <span>빠른 제작 모드</span>
            <button
              type="button"
              className={`toggle${quick ? " on" : ""}`}
              aria-pressed={quick}
              aria-label="빠른 제작 모드"
              onClick={() => setQuick((v) => !v)}
            />
            <span style={{ color: "var(--fg-3)", fontWeight: 500 }}>최소 정보만으로 자동 완성</span>
          </div>

          <div className="event-grid">
            {EVENTS.map((e) => (
              <button
                key={e.id}
                type="button"
                className={`event-card${event === e.id ? " selected" : ""}`}
                onClick={() => setEvent(e.id)}
              >
                <Icon name={e.icon} className="event-icon" />
                <div className="event-name">{e.name}</div>
                <div className="event-hint">{e.hint}</div>
              </button>
            ))}
            <button
              type="button"
              className={`event-card event-card-custom${event === "custom" ? " selected" : ""}`}
              onClick={() => setEvent("custom")}
            >
              <Icon name={customIcon} className="event-icon" />
              <div className="event-name">직접 입력</div>
              <div className="event-hint">custom event</div>
            </button>
          </div>

          {/* Custom panel */}
          <div className={`custom-event-panel${customOpen ? " open" : ""}`} ref={panelRef}>
            <div className="cep-head">
              <div>
                <div className="cep-eb">Custom · 자유 입력</div>
                <h3>
                  여기에 없는 <em>이벤트</em>인가요?
                </h3>
                <p>이벤트 이름과 성격을 자유롭게 입력해주세요. 어울리는 템플릿을 준비해드릴게요.</p>
              </div>
              <button className="cep-close" type="button" title="닫기" aria-label="닫기" onClick={() => setEvent("")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="cep-body">
              <div className="cep-field">
                <label className="input-label" htmlFor="cepName">이벤트 이름</label>
                <input
                  id="cepName"
                  className="input"
                  placeholder="예: 캠핑장 봄맞이 모임, 팬 미팅, 결혼 5주년 파티"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="cep-field">
                <div className="input-label">
                  이런 이벤트도 있어요 <span style={{ color: "var(--muted)", fontWeight: 500 }}>(클릭해서 채우기)</span>
                </div>
                <div className="cep-suggest-row">
                  {CUSTOM_SUGGESTIONS.map((s) => (
                    <button key={s.name} className="cep-sug" type="button" onClick={() => setCustomName(s.name)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cep-field">
                <label className="input-label">아이콘 선택</label>
                <div className="cep-icon-grid">
                  {CUSTOM_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`cep-icon-btn${customIcon === ic ? " active" : ""}`}
                      aria-label={ic}
                      onClick={() => setCustomIcon(ic)}
                    >
                      <Icon name={ic} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="cep-field">
                <label className="input-label">
                  이벤트 성격 <span style={{ color: "var(--muted)", fontWeight: 500 }}>(선택)</span>
                </label>
                <div className="cep-mood-row">
                  {CUSTOM_MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`cep-mood${customMoods.includes(m.id) ? " active" : ""}`}
                      onClick={() => toggleMood(m.id)}
                    >
                      <span className="mood-swatch" style={{ background: m.swatch }} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cep-preview">
                <div className="cep-preview-icon">
                  <Icon name={customIcon} />
                </div>
                <div className="cep-preview-info">
                  <div className="cep-preview-eb">Custom Event</div>
                  <div className="cep-preview-name">{customName.trim() || "내 이벤트"}</div>
                  <div className="cep-preview-desc">준비된 섹션으로 다음 단계에서 편집을 시작할 수 있어요</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`step-panel${step === 2 ? " active" : ""}`}>
          <div className="step-eyebrow">Step 2 · Basic Info</div>
          <h1 className="step-title">
            기본 정보를 <em>입력</em>하세요
          </h1>
          <p className="step-desc">언제든지 편집기에서 변경할 수 있어요. 최소 정보만 입력하면 나머지는 자동으로 완성됩니다.</p>

          <div className="form-grid">
            <div className="full">
              <label className="input-label">초대장 제목</label>
              <input className="input" placeholder="예: 지수 · 민준의 결혼식" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="full">
              <label className="input-label">서브 메시지 (선택)</label>
              <input className="input" placeholder="예: 저희의 시작에 함께해주세요" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div>
              <label className="input-label">날짜</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="input-label">시간</label>
              <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="full">
              <label className="input-label">장소</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" style={{ flex: 1 }} placeholder="장소명 · 주소" value={location} onChange={(e) => setLocation(e.target.value)} />
                <AddressSearch className="btn btn-outline" label="주소 찾기" onSelect={(a) => setLocation((p) => (p.trim() ? `${p.trim()} · ${a}` : a))} />
              </div>
            </div>
            <div className="full">
              <label className="input-label">대표 사진 (선택 · 나중에 업로드 가능)</label>
              <div className="upload-drop">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
                  <path d="M12 15V3M8 7l4-4 4 4M20 17l0 4H4l0-4" />
                </svg>
                <div className="u-hint">
                  이미지를 드래그하거나 <span>파일 선택</span>
                </div>
                <div className="u-meta">JPG · PNG · HEIC · MAX 8MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={`step-panel${step === 3 ? " active" : ""}`}>
          <div className="step-eyebrow">Step 3 · Template</div>
          <h1 className="step-title">
            <em>스타일</em>을 선택하세요
          </h1>
          <p className="step-desc">추천 템플릿이에요. 나중에 언제든 변경 가능해요.</p>

          <div className="style-grid">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`style-card${template === s.id ? " selected" : ""}`}
                onClick={() => setTemplate(s.id)}
              >
                {s.blank ? (
                  <div className="style-thumb blank">
                    <Icon name="momo-card" viewBox="0 0 220 240" />
                  </div>
                ) : (
                  <div className="style-thumb" style={{ backgroundImage: `url('/assets/photos/${s.img}.jpg')` }} />
                )}
                <div className="style-info">
                  <div className="style-cat">{s.cat}</div>
                  <div className="style-name">{s.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 4 */}
        <div className={`step-panel${step === 4 ? " active" : ""}`}>
          <div className="complete-hero">
            <Icon name="momo-party" viewBox="0 0 200 260" />
            <div className="step-eyebrow">Step 4 · Ready</div>
            <h1 className="step-title">
              준비가 <em>완료됐어요.</em>
            </h1>
            <p className="step-desc">에디터로 이동해서 사진과 문구를 자유롭게 편집해보세요. 언제든 저장되고, 미리보기로 확인할 수 있어요.</p>
          </div>

          <div className="complete-info">
            <div className="row">
              <span className="k">이벤트</span>
              <span className="v" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name={summaryEventIcon} style={{ width: 16, height: 16, color: "var(--rose)" }} /> {summaryEventName}
              </span>
            </div>
            <div className="row"><span className="k">제목</span><span className="v">{title || "—"}</span></div>
            <div className="row"><span className="k">일시</span><span className="v">{date || time ? [date.replace(/-/g, "."), time].filter(Boolean).join(" · ") : "—"}</span></div>
            <div className="row"><span className="k">장소</span><span className="v">{location.split(" · ")[0] || "—"}</span></div>
            <div className="row"><span className="k">템플릿</span><span className="v">{selectedStyle?.nameText} · {selectedStyle?.cat.split(" · ")[0]}</span></div>
            <div className="row"><span className="k">공개 상태</span><span className="v" style={{ color: "var(--sage-deep)" }}>Draft · 나만 볼 수 있음</span></div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="wizard-nav">
        <div className="progress-text">
          Step {step} of {TOTAL} · {STEP_NAMES[step - 1]}
        </div>
        <div className="actions">
          {step > 1 && (
            <Button variant="ghost" onClick={() => go(step - 1)}>← 이전</Button>
          )}
          {step < TOTAL && (
            <Button variant="primary" onClick={() => go(step + 1)}>다음 →</Button>
          )}
          {step === TOTAL && (
            <button type="button" onClick={startEditor} className="btn btn-wax">
              에디터로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
