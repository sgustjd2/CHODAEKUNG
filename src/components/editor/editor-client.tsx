"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { MobileEditor, type EditorApi } from "@/components/editor/mobile-editor";
import { ContentEditors, PhotoUpload } from "@/components/editor/content-editors";
import { ACCENTS, COVER_PHOTOS, REVEALS, THEME_PRESETS, metaFor, type Mode } from "@/components/editor/editor-shared";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import { blankInvitation, getInvitation } from "@/lib/invitation/samples";
import type { Invitation, Section, SectionType } from "@/lib/invitation/types";

type Tab = "content" | "style" | "layout" | "anim";

// ponytail: localStorage draft store — swap for a real backend when multi-device/sharing lands
const STORAGE_KEY = "chodaekung:editor:v1";
type SavedEditor = { draft?: Invitation; title?: string; hidden?: string[]; accent?: string | null };
const keyFor = (slug: string) => `${STORAGE_KEY}:${slug}`;
const tokenKeyFor = (slug: string) => `chodaekung:editor:token:${slug}`;

/** A friendly default editor title for an invitation (cover names, else slug). */
function defaultTitleFor(inv: Invitation): string {
  const cover = inv.sections.find((s) => s.type === "cover") as Extract<Section, { type: "cover" }> | undefined;
  const names = cover?.content.names?.filter((n) => n.trim());
  if (names && names.length) return names.join(" · ");
  return inv.slug;
}

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
  const [slug, setSlug] = useState(romanticSample.slug);
  const [editToken, setEditToken] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // On mount: resolve ?slug= (which invitation to edit), then load its saved draft or the sample.
  // (SSR renders the romantic sample; this client effect swaps in the right invitation — no mismatch.)
  useEffect(() => {
    const slugParam = new URLSearchParams(window.location.search).get("slug")?.trim();
    const s = slugParam || "new";
    // No ?slug= means a brand-new invitation → start blank, not a filled sample.
    let d = slugParam ? getInvitation(slugParam) : blankInvitation();
    let loadedTitle: string | null = null;
    try {
      const raw = localStorage.getItem(keyFor(s));
      if (raw) {
        const saved = JSON.parse(raw) as SavedEditor;
        if (saved.draft) d = saved.draft;
        if (typeof saved.title === "string") loadedTitle = saved.title;
        if (Array.isArray(saved.hidden)) setHidden(new Set(saved.hidden));
        if (saved.accent !== undefined) setAccent(saved.accent);
      }
    } catch {
      /* private mode / corrupt value — fall back to the sample */
    }
    try {
      const t = localStorage.getItem(tokenKeyFor(s));
      if (t) setEditToken(t);
    } catch {
      /* ignore */
    }
    setDraft(d);
    setSelectedId(d.sections[0]?.id ?? "");
    setTitle(loadedTitle ?? (slugParam ? defaultTitleFor(d) : ""));
    setSlug(s);
    setHydrated(true);
  }, []);

  // Autosave (per invitation) after hydration so edits survive a refresh.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent } satisfies SavedEditor));
    } catch {
      /* storage unavailable — skip; edits stay in memory */
    }
  }, [hydrated, slug, draft, title, hidden, accent]);

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
        content: { eyebrow: "", title: [[""]], body: [""] },
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

  const cover = find("cover"); // still needed for the Style tab (cover background + accent)
  const previewStyle = accent ? ({ ["--wax"]: accent, ["--wax-deep"]: accent } as CSSProperties) : undefined;

  // Open the full pre-publish preview (new tab) — saves the draft, then reads it back in /preview.
  const openPreview = () => {
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent } satisfies SavedEditor));
    } catch {
      /* storage unavailable — preview may show a stale/empty draft */
    }
    window.open(`/preview?slug=${encodeURIComponent(slug)}`, "_blank", "noopener");
  };

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
    openPublish: () => setPubOpen(true),
    openPreview,
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
          <Button variant="ghost" size="sm" onClick={openPreview}>미리보기</Button>
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
            {tab === "content" && <ContentEditors draft={draft} patch={patch} />}

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
                    {cover && /^https?:\/\//.test(cover.content.image) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover.content.image} alt="" className="cover-thumb active" />
                    )}
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
                  <div style={{ marginTop: 8 }}>
                    <PhotoUpload onUploaded={(url) => cover && patch(cover.id, { image: url })} label="+ 커버 사진 업로드" />
                  </div>
                </div>
              </>
            )}

            {tab === "layout" && <StubPanel note="레이아웃 컨트롤(높이·패딩·정렬·라운드)은 곧 연결됩니다." />}
            {tab === "anim" && (
              <div className="insp-group">
                <h5>등장 애니메이션</h5>
                <div className="radio-group">
                  {REVEALS.map((r) => (
                    <button
                      key={r.id}
                      className={`radio-btn${(draft.reveal ?? "none") === r.id ? " active" : ""}`}
                      onClick={() => setDraft((d) => ({ ...d, reveal: r.id }))}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                  스크롤하며 섹션이 나타날 때 재생돼요. 발행된 초대장에서 확인할 수 있어요(편집 미리보기는 정지 상태).
                  기기에서 &ldquo;동작 최소화&rdquo;를 켜면 자동으로 꺼져요.
                </p>
              </div>
            )}
          </div>

          <div className="foot">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const base = slug === "new" ? blankInvitation() : getInvitation(slug);
                setDraft(structuredClone(base));
                setSelectedId(base.sections[0]?.id ?? "");
                setTitle(slug === "new" ? "" : defaultTitleFor(base));
                setHidden(new Set());
                setAccent(null);
              }}
            >
              되돌리기
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                try {
                  localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent } satisfies SavedEditor));
                } catch {
                  /* storage unavailable */
                }
              }}
            >
              저장
            </Button>
          </div>
        </aside>
      </div>
      </div>

      <MobileEditor api={api} />

      <PublishDialog
        open={pubOpen}
        onClose={() => setPubOpen(false)}
        invitation={draft}
        title={title}
        editToken={editToken}
        onPublished={(r) => {
          setSlug(r.slug);
          setEditToken(r.editToken);
          try {
            localStorage.setItem(tokenKeyFor(r.slug), r.editToken);
          } catch {
            /* ignore */
          }
        }}
      />
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
