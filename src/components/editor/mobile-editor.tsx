"use client";

import { useState } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { Icon } from "@/components/ui/icon";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { ContentEditors, PhotoUpload } from "./content-editors";
import { ACCENTS, COVER_PHOTOS, REVEALS, THEME_PRESETS, metaFor, type Mode } from "./editor-shared";
import type { Invitation, Section } from "@/lib/invitation/types";

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
  // Quick-jump chips reflect the invitation's actual sections (deduped by type).
  const chips = [...new Set(api.draft.sections.map((s) => metaFor(s.type).label))];
  return (
    <>
      <DecorTabs tabs={chips} />
      <ContentEditors draft={api.draft} patch={api.patch} />
    </>
  );
}

function DesignPanel({ api }: { api: EditorApi }) {
  const { draft, setDraft, accent, setAccent, cover, patch } = api;
  const [overlay, setOverlay] = useState(65);
  return (
    <>
      <DecorTabs tabs={["Theme", "Color", "Cover", "Motion"]} />
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
          {cover && /^https?:\/\//.test(cover.content.image) && (
            <button type="button" className="m-thumb active" style={{ backgroundImage: `url('${cover.content.image}')` }} aria-label="업로드한 커버" />
          )}
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
        <div style={{ marginTop: 10 }}>
          <PhotoUpload onUploaded={(url) => cover && patch(cover.id, { image: url })} label="+ 커버 사진 업로드" />
        </div>
        <div className="m-field" style={{ marginTop: 12 }}>
          <div className="m-lbl">
            Overlay 강도 <span className="v">{overlay}%</span>
          </div>
          <input type="range" className="m-slider" min={0} max={100} value={overlay} onChange={(e) => setOverlay(+e.target.value)} />
        </div>
      </div>
      <div className="m-group">
        <h6>등장 애니메이션</h6>
        <div className="m-radios">
          {REVEALS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`m-radio${(draft.reveal ?? "none") === r.id ? " active" : ""}`}
              onClick={() => setDraft((d) => ({ ...d, reveal: r.id }))}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
          발행된 초대장에서 스크롤 시 재생돼요. 기기의 &ldquo;동작 최소화&rdquo; 설정은 자동으로 존중해요.
        </p>
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

