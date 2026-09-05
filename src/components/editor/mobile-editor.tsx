"use client";

import { useState } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { Icon } from "@/components/ui/icon";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { ACCENTS, COVER_PHOTOS, THEME_PRESETS, linesToText, metaFor, plainTitle, textToLines, type Mode } from "./editor-shared";
import type { CoverContent, DateContent, EndingContent, GalleryContent, Invitation, LocationContent, MessageContent, RsvpContent, ScheduleContent, Section } from "@/lib/invitation/types";

/** Shared editor state/actions, owned by EditorClient and consumed by both layouts. */
export type EditorApi = {
  draft: Invitation;
  visibleDraft: Invitation;
  setDraft: Dispatch<SetStateAction<Invitation>>;
  title: string;
  selectedId: string;
  setSelectedId: (id: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  accent: string | null;
  setAccent: (c: string) => void;
  previewStyle?: CSSProperties;
  patch: (id: string, content: object) => void;
  addSection: () => void;
  reorder: (to: number) => void;
  dragIndex: { current: number | null };
  cover?: Extract<Section, { type: "cover" }>;
  message?: Extract<Section, { type: "message" }>;
  location?: Extract<Section, { type: "location" }>;
  date?: Extract<Section, { type: "date" }>;
  gallery?: Extract<Section, { type: "gallery" }>;
  schedule?: Extract<Section, { type: "schedule" }>;
  rsvp?: Extract<Section, { type: "rsvp" }>;
  ending?: Extract<Section, { type: "ending" }>;
  openPublish: () => void;
};

type MTab = "content" | "design" | "sections" | "anim";
const TABS: { id: MTab; label: string }[] = [
  { id: "content", label: "내용" },
  { id: "design", label: "디자인" },
  { id: "sections", label: "섹션" },
  { id: "anim", label: "효과" },
];
const SHEET_SUB: Record<MTab, string> = {
  content: "Cover · Message · Location",
  design: "Theme · Color · Cover",
  sections: "Add · Reorder",
  anim: "Mode · Animation · Timing",
};

export function MobileEditor({ api }: { api: EditorApi }) {
  const [sheet, setSheet] = useState<MTab | null>(null);
  const { draft, visibleDraft, previewStyle, title } = api;

  return (
    <div className="ed-mobile">
      <div className="m-top">
        <button className="m-btn" type="button" aria-label="뒤로">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <div className="m-title">
          <div className="n">{title}</div>
          <div className="s">
            <span className="d" /> Saved
          </div>
        </div>
        <button className="m-btn" type="button" aria-label="미리보기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button className="m-btn primary" type="button" aria-label="발행" onClick={api.openPublish}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
        </button>
      </div>

      <div className="m-preview" style={previewStyle}>
        <InvitationViewer invitation={visibleDraft} contained />
      </div>

      <div className="m-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`m-tab${sheet === t.id ? " active" : ""}`} onClick={() => setSheet(t.id)}>
            <TabIcon tab={t.id} />
            <span className="lbl">{t.label}</span>
          </button>
        ))}
      </div>

      <div className={`m-backdrop${sheet ? " open" : ""}`} onClick={() => setSheet(null)} />
      <div className={`m-sheet${sheet ? " open" : ""}`} role="dialog" aria-hidden={!sheet}>
        <div className="m-handle" />
        <div className="m-sheet-head">
          <div className="m-sheet-title">
            {sheet ? TABS.find((t) => t.id === sheet)!.label : ""}
            {sheet && <span className="sub">{SHEET_SUB[sheet]}</span>}
          </div>
          <button className="m-sheet-close" type="button" onClick={() => setSheet(null)} aria-label="닫기">
            ×
          </button>
        </div>
        <div className="m-sheet-body">
          {sheet === "content" && <ContentPanel api={api} />}
          {sheet === "design" && <DesignPanel api={api} />}
          {sheet === "sections" && <SectionsPanel api={api} />}
          {sheet === "anim" && <AnimPanel api={api} />}
        </div>
      </div>

      {/* draft is referenced so theme/section changes re-render the sheet panels */}
      <span hidden data-theme={draft.theme} />
    </div>
  );
}

function ContentPanel({ api }: { api: EditorApi }) {
  const { cover, message, location, date, schedule, gallery, rsvp, ending, patch } = api;
  const names = cover?.content.names;
  return (
    <>
      <DecorTabs tabs={["Cover", "Message", "Date", "Location", "Gallery", "RSVP"]} />
      {cover && names && (
        <div className="m-group">
          <h6>Cover · Names</h6>
          {names.map((n, i) => (
            <MField
              key={i}
              label={`이름 ${i + 1}`}
              value={n}
              onChange={(v) => patch(cover.id, { names: names.map((x, j) => (j === i ? v : x)) } satisfies Partial<CoverContent>)}
            />
          ))}
        </div>
      )}
      {message && (
        <div className="m-group">
          <h6>Message</h6>
          <MField label="제목" value={plainTitle(message.content.title)} onChange={(v) => patch(message.id, { title: [[v]] } satisfies Partial<MessageContent>)} />
          <MField textarea label="본문" value={linesToText(message.content.body)} onChange={(v) => patch(message.id, { body: textToLines(v) } satisfies Partial<MessageContent>)} />
        </div>
      )}
      {location && (
        <div className="m-group">
          <h6>Location</h6>
          <MField label="장소명" value={plainTitle(location.content.title)} onChange={(v) => patch(location.id, { title: [[v]] } satisfies Partial<LocationContent>)} />
          <MField textarea label="주소 · 설명" value={linesToText(location.content.body)} onChange={(v) => patch(location.id, { body: textToLines(v) })} />
        </div>
      )}
      {date && (
        <div className="m-group">
          <h6>Date</h6>
          <MField label="Eyebrow" value={date.content.eyebrow} onChange={(v) => patch(date.id, { eyebrow: v } satisfies Partial<DateContent>)} />
          <MField label="제목" value={plainTitle(date.content.title)} onChange={(v) => patch(date.id, { title: [[v]] } satisfies Partial<DateContent>)} />
          {date.content.countdown && (
            <MField
              label="D-day (남은 일수)"
              value={String(date.content.countdown.days)}
              onChange={(v) => patch(date.id, { countdown: { ...date.content.countdown!, days: Math.max(0, Number(v) || 0) } })}
            />
          )}
        </div>
      )}
      {schedule && (
        <div className="m-group">
          <h6>Schedule</h6>
          <MField label="Eyebrow" value={schedule.content.eyebrow} onChange={(v) => patch(schedule.id, { eyebrow: v } satisfies Partial<ScheduleContent>)} />
          <MField label="제목" value={plainTitle(schedule.content.title)} onChange={(v) => patch(schedule.id, { title: [[v]] } satisfies Partial<ScheduleContent>)} />
          {schedule.content.items.map((it, i) => (
            <div key={i} className="m-subitem">
              <div className="m-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(schedule.id, { items: schedule.content.items.filter((_, j) => j !== i) })}>
                  삭제
                </button>
              </div>
              <MField label="시간" value={it.time} onChange={(v) => patch(schedule.id, { items: schedule.content.items.map((x, j) => (j === i ? { ...x, time: v } : x)) })} />
              <MField label="제목" value={it.title} onChange={(v) => patch(schedule.id, { items: schedule.content.items.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <MField label="설명" value={it.desc} onChange={(v) => patch(schedule.id, { items: schedule.content.items.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="m-add" onClick={() => patch(schedule.id, { items: [...schedule.content.items, { time: "00:00", title: "새 일정", desc: "" }] })}>
            + 일정 추가
          </button>
        </div>
      )}
      {gallery && (
        <div className="m-group">
          <h6>Gallery</h6>
          <MField label="Eyebrow" value={gallery.content.eyebrow} onChange={(v) => patch(gallery.id, { eyebrow: v } satisfies Partial<GalleryContent>)} />
          <MField label="제목" value={plainTitle(gallery.content.title)} onChange={(v) => patch(gallery.id, { title: [[v]] } satisfies Partial<GalleryContent>)} />
          <p className="m-note">사진 {gallery.content.images.length}장 · 이미지 업로드는 곧 지원돼요.</p>
        </div>
      )}
      {rsvp && (
        <div className="m-group">
          <h6>RSVP</h6>
          <MField label="제목" value={plainTitle(rsvp.content.title)} onChange={(v) => patch(rsvp.id, { title: [[v]] } satisfies Partial<RsvpContent>)} />
          <MField textarea label="안내 문구" value={linesToText(rsvp.content.body)} onChange={(v) => patch(rsvp.id, { body: textToLines(v) })} />
          <MField textarea label="응답 옵션 (한 줄에 하나)" value={rsvp.content.options.join("\n")} onChange={(v) => patch(rsvp.id, { options: v.split("\n").filter((o) => o.trim().length > 0) })} />
        </div>
      )}
      {ending && (
        <div className="m-group">
          <h6>Ending</h6>
          <MField label="맺음말" value={ending.content.signature ?? ""} onChange={(v) => patch(ending.id, { signature: v } satisfies Partial<EndingContent>)} />
          <MField label="서명 (이름)" value={ending.content.names ?? ""} onChange={(v) => patch(ending.id, { names: v } satisfies Partial<EndingContent>)} />
        </div>
      )}
    </>
  );
}

function DesignPanel({ api }: { api: EditorApi }) {
  const { draft, setDraft, accent, setAccent, cover, patch } = api;
  const [overlay, setOverlay] = useState(65);
  return (
    <>
      <DecorTabs tabs={["Theme", "Color", "Font", "Cover"]} />
      <div className="m-group">
        <h6>Theme Preset</h6>
        <div className="m-radios">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`m-radio${draft.theme === p.id ? " active" : ""}`}
              disabled={!p.enabled}
              onClick={() => p.enabled && setDraft((d) => ({ ...d, theme: p.id }))}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="m-group">
        <h6>Accent Color</h6>
        <div className="m-colors">
          {ACCENTS.map((c) => (
            <button key={c} type="button" className={`m-color${accent === c ? " active" : ""}`} style={{ background: c }} aria-label={c} onClick={() => setAccent(c)} />
          ))}
        </div>
      </div>
      <div className="m-group">
        <h6>Cover Background</h6>
        <div className="m-thumbs">
          {COVER_PHOTOS.map((p) => (
            <button
              key={p}
              type="button"
              className={`m-thumb${cover?.content.image === p ? " active" : ""}`}
              style={{ backgroundImage: `url(/assets/photos/${p}.jpg)` }}
              aria-label={p}
              onClick={() => cover && patch(cover.id, { image: p })}
            />
          ))}
        </div>
        <div className="m-field" style={{ marginTop: 12 }}>
          <div className="m-lbl">
            Overlay 강도 <span className="v">{overlay}%</span>
          </div>
          <input type="range" className="m-slider" min={0} max={100} value={overlay} onChange={(e) => setOverlay(+e.target.value)} />
        </div>
      </div>
    </>
  );
}

function SectionsPanel({ api }: { api: EditorApi }) {
  const { draft, selectedId, setSelectedId, addSection, reorder, dragIndex } = api;
  return (
    <>
      <div className="m-sec-add-row">
        <button type="button" className="btn btn-primary btn-sm" onClick={addSection}>
          + 섹션 추가
        </button>
      </div>
      <div className="m-sec-list">
        {draft.sections.map((s, i) => {
          const m = metaFor(s.type);
          const active = selectedId === s.id;
          return (
            <div
              key={s.id}
              className={`m-sec${active ? " active" : ""}`}
              onClick={() => setSelectedId(s.id)}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => reorder(i)}
            >
              <span className="m-sec-drag">⋮⋮</span>
              <span className="m-sec-icon">
                <Icon name={m.icon} />
              </span>
              <div className="m-sec-info">
                <div className="m-sec-name">{m.label}</div>
                <div className="m-sec-type">{s.type}</div>
              </div>
              {active && <span className="m-sec-badge">ACTIVE</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

function AnimPanel({ api }: { api: EditorApi }) {
  const { mode, setMode } = api;
  return (
    <>
      <div className="m-group">
        <h6>Page Mode</h6>
        <div className="m-radios">
          {(["scroll", "story", "magazine"] as Mode[]).map((m) => (
            <button key={m} type="button" className={`m-radio${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
              {m === "scroll" ? "Scroll" : m === "story" ? "Story" : "Magazine"}
            </button>
          ))}
        </div>
      </div>
      <div className="m-group">
        <h6>Reveal Animation</h6>
        <StubRadios options={["None", "Fade Up", "Slide", "Zoom", "Blur", "Parallax"]} defaultIndex={1} />
      </div>
      <div className="m-group">
        <div className="m-toggle-row">
          <span>prefers-reduced-motion 준수</span>
          <Toggle defaultOn />
        </div>
        <div className="m-toggle-row">
          <span>배경 음악</span>
          <Toggle />
        </div>
      </div>
      <p className="m-note">애니메이션 · 타이밍 세부 설정은 순차적으로 연결됩니다.</p>
    </>
  );
}

function TabIcon({ tab }: { tab: MTab }) {
  const common = { className: "ic", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (tab === "content")
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    );
  if (tab === "design")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    );
  if (tab === "sections")
    return (
      <svg {...common}>
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function DecorTabs({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="m-sh-tabs">
      {tabs.map((t, i) => (
        <button key={t} type="button" className={`m-sh-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
          {t}
        </button>
      ))}
    </div>
  );
}

function StubRadios({ options, defaultIndex = 0 }: { options: string[]; defaultIndex?: number }) {
  const [i, setI] = useState(defaultIndex);
  return (
    <div className="m-radios">
      {options.map((o, idx) => (
        <button key={o} type="button" className={`m-radio${i === idx ? " active" : ""}`} onClick={() => setI(idx)}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return <button type="button" className={`m-toggle${on ? " on" : ""}`} role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} />;
}

function MField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="m-field">
      <div className="m-lbl">{label}</div>
      {textarea ? (
        <textarea className="m-input" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="m-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
