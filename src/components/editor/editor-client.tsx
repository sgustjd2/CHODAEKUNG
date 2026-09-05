"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { MobileEditor, type EditorApi } from "@/components/editor/mobile-editor";
import { ACCENTS, COVER_PHOTOS, THEME_PRESETS, linesToText, metaFor, plainTitle, textToLines, type Mode } from "@/components/editor/editor-shared";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import type { CoverContent, Invitation, LocationContent, MessageContent, Section, SectionType } from "@/lib/invitation/types";

type Tab = "content" | "style" | "layout" | "anim";

export function EditorClient() {
  const [draft, setDraft] = useState<Invitation>(() => structuredClone(romanticSample));
  const [title, setTitle] = useState("지수 · 민준의 결혼식");
  const [selectedId, setSelectedId] = useState(draft.sections[0]?.id ?? "");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>("content");
  const [mode, setMode] = useState<Mode>("scroll");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [accent, setAccent] = useState<string | null>(null);
  const [pubOpen, setPubOpen] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const visibleDraft: Invitation = { ...draft, sections: draft.sections.filter((s) => !hidden.has(s.id)) };
  const find = <T extends SectionType>(t: T) =>
    draft.sections.find((s) => s.type === t) as Extract<Section, { type: T }> | undefined;

  const patch = (id: string, content: object) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? ({ ...s, content: { ...s.content, ...content } } as Section) : s)),
    }));

  const toggleHide = (id: string) =>
    setHidden((h) => {
      const n = new Set(h);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const del = (id: string) => setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
  const duplicate = (id: string) =>
    setDraft((d) => {
      const i = d.sections.findIndex((s) => s.id === id);
      if (i < 0) return d;
      const clone = structuredClone(d.sections[i]);
      clone.id = `${clone.id}-copy-${Date.now().toString(36)}`;
      const s = [...d.sections];
      s.splice(i + 1, 0, clone);
      return { ...d, sections: s };
    });
  const addSection = () =>
    setDraft((d) => {
      const s: Section = {
        id: `message-${Date.now().toString(36)}`,
        type: "message",
        content: { eyebrow: "New Section", title: [["새 섹션"]], body: ["여기에 내용을 입력하세요."] },
      };
      return { ...d, sections: [...d.sections, s] };
    });
  const reorder = (to: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === to) return;
    setDraft((d) => {
      const s = [...d.sections];
      const [m] = s.splice(from, 1);
      s.splice(to, 0, m);
      return { ...d, sections: s };
    });
  };

  const cover = find("cover");
  const message = find("message");
  const location = find("location");
  const previewStyle = accent ? ({ ["--wax"]: accent, ["--wax-deep"]: accent } as CSSProperties) : undefined;

  const api: EditorApi = {
    draft,
    visibleDraft,
    setDraft,
    title,
    selectedId,
    setSelectedId,
    mode,
    setMode,
    accent,
    setAccent,
    previewStyle,
    patch,
    addSection,
    reorder,
    dragIndex,
    cover,
    message,
    location,
    openPublish: () => setPubOpen(true),
  };

  return (
    <div className="editor-page">
      <div className="ed-desktop">
      {/* TOP BAR */}
      <div className="top">
        <div className="top-left">
          <Link className="top-logo" href="/">
            <Logo />
          </Link>
          <span className="top-crumb">Dashboard · Editor</span>
          <input className="top-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="save-indicator">
            <span className="d" /> Saved · 방금 전
          </div>
        </div>
        <div className="top-right">
          <div className="mode-toggle">
            {(["scroll", "story", "magazine"] as Mode[]).map((m) => (
              <button key={m} className={mode === m ? "active" : undefined} onClick={() => setMode(m)}>
                {m === "scroll" ? "Scroll" : m === "story" ? "Story" : "Magazine"}
              </button>
            ))}
          </div>
          <div className="device-toggle">
            <button className={device === "mobile" ? "active" : undefined} onClick={() => setDevice("mobile")}>
              Mobile
            </button>
            <button className={device === "desktop" ? "active" : undefined} onClick={() => setDevice("desktop")}>
              Desktop
            </button>
          </div>
          <Button variant="ghost" size="sm">미리보기</Button>
          <Button variant="wax" size="sm" onClick={() => setPubOpen(true)}>발행 · 공유 →</Button>
        </div>
      </div>

      <div className="editor">
        {/* LEFT: sections */}
        <aside className="col-sections">
          <div className="col-head">
            <h4>Sections</h4>
            <button className="add-section" title="섹션 추가" onClick={addSection}>
              <Icon name="ic-plus" />
            </button>
          </div>
          <div className="sec-list">
            {draft.sections.map((s, i) => {
              const m = metaFor(s.type);
              return (
                <div
                  key={s.id}
                  className={`sec-item${selectedId === s.id ? " active" : ""}${hidden.has(s.id) ? " hidden-sec" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorder(i)}
                >
                  <span className="sec-drag">
                    <Icon name="ic-drag" />
                  </span>
                  <span className="sec-icon">
                    <Icon name={m.icon} />
                  </span>
                  <div className="sec-info">
                    <div className="sec-name">{m.label}</div>
                    <div className="sec-type">{s.type}</div>
                  </div>
                  <div className="sec-actions">
                    <button title="숨김" onClick={(e) => { e.stopPropagation(); toggleHide(s.id); }}>
                      <Icon name={hidden.has(s.id) ? "ic-eye" : "ic-eye-off"} />
                    </button>
                    <button title="복제" onClick={(e) => { e.stopPropagation(); duplicate(s.id); }}>
                      <Icon name="ic-duplicate" />
                    </button>
                    <button title="삭제" onClick={(e) => { e.stopPropagation(); del(s.id); }}>
                      <Icon name="ic-x" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER: preview */}
        <div className="col-preview">
          <div className="preview-toolbar">
            <span className="d" /> LIVE PREVIEW · 390 × 844 · {mode.toUpperCase()} MODE
          </div>
          <div className={`device${device === "desktop" ? " desktop" : ""}`}>
            <div className="notch" />
            <div className="screen">
              <div className="phone-scroll" style={previewStyle}>
                <InvitationViewer invitation={visibleDraft} contained />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: inspector */}
        <aside className="col-inspector">
          <div className="inspector-tabs">
            {(["content", "style", "layout", "anim"] as Tab[]).map((t) => (
              <button key={t} className={`insp-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t === "content" ? "Content" : t === "style" ? "Style" : t === "layout" ? "Layout" : "Animation"}
              </button>
            ))}
          </div>

          <div className="inspector-body">
            {tab === "content" && (
              <>
                {cover && (
                  <div className="insp-group">
                    <h5>Cover Section</h5>
                    <Field label="Eyebrow" value={cover.content.eyebrow} onChange={(v) => patch(cover.id, { eyebrow: v } satisfies Partial<CoverContent>)} />
                    {cover.content.names?.map((n, i) => (
                      <Field
                        key={i}
                        label={`이름 ${i + 1}`}
                        value={n}
                        onChange={(v) => patch(cover.id, { names: cover.content.names!.map((x, j) => (j === i ? v : x)) })}
                      />
                    ))}
                    <Field label="날짜 표기" value={cover.content.dateLabel ?? ""} onChange={(v) => patch(cover.id, { dateLabel: v })} />
                  </div>
                )}
                {message && (
                  <div className="insp-group">
                    <h5>Message</h5>
                    <Field
                      label="본문"
                      textarea
                      value={linesToText(message.content.body)}
                      onChange={(v) => patch(message.id, { body: textToLines(v) } satisfies Partial<MessageContent>)}
                    />
                  </div>
                )}
                {location && (
                  <div className="insp-group">
                    <h5>Location</h5>
                    <Field label="장소명" value={plainTitle(location.content.title)} onChange={(v) => patch(location.id, { title: [[v]] } satisfies Partial<LocationContent>)} />
                    <Field label="주소 · 설명" textarea value={linesToText(location.content.body)} onChange={(v) => patch(location.id, { body: textToLines(v) })} />
                  </div>
                )}
                {!cover && !message && !location && (
                  <div className="insp-group">
                    <h5>Content</h5>
                    <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>
                      이 테마의 섹션별 상세 편집은 순차적으로 추가됩니다. 지금은 커버·문구·장소 편집을 지원해요.
                    </p>
                  </div>
                )}
              </>
            )}

            {tab === "style" && (
              <>
                <div className="insp-group">
                  <h5>Theme Preset</h5>
                  <div className="radio-group">
                    {THEME_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        className={`radio-btn${draft.theme === p.id ? " active" : ""}`}
                        disabled={!p.enabled}
                        onClick={() => p.enabled && setDraft((d) => ({ ...d, theme: p.id }))}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8 }}>
                    같은 데이터가 테마만 바꿔 즉시 다시 렌더돼요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>Accent Color</h5>
                  <div className="color-row">
                    {ACCENTS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch${accent === c ? " active" : ""}`}
                        style={{ background: c }}
                        aria-label={c}
                        onClick={() => setAccent(c)}
                      />
                    ))}
                  </div>
                </div>
                <div className="insp-group">
                  <h5>Cover Background</h5>
                  <div className="cover-thumbs">
                    {COVER_PHOTOS.map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={p}
                        src={`/assets/photos/${p}.jpg`}
                        alt=""
                        className={`cover-thumb${cover?.content.image === p ? " active" : ""}`}
                        onClick={() => cover && patch(cover.id, { image: p })}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "layout" && <StubPanel note="레이아웃 컨트롤(높이·패딩·정렬·라운드)은 곧 연결됩니다." />}
            {tab === "anim" && <StubPanel note="애니메이션(Fade Up·Slide·Zoom·Blur·Parallax)은 곧 연결됩니다." />}
          </div>

          <div className="foot">
            <Button variant="ghost" size="sm" onClick={() => { setDraft(structuredClone(romanticSample)); setHidden(new Set()); setAccent(null); }}>
              되돌리기
            </Button>
            <Button variant="primary" size="sm">저장</Button>
          </div>
        </aside>
      </div>
      </div>

      <MobileEditor api={api} />

      <PublishDialog open={pubOpen} onClose={() => setPubOpen(false)} invitation={draft} title={title} />
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="insp-field">
      <div className="insp-label">{label}</div>
      {textarea ? (
        <textarea className="insp-input" rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="insp-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function StubPanel({ note }: { note: string }) {
  return (
    <div className="insp-group">
      <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>{note}</p>
    </div>
  );
}
