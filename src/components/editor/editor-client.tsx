"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { TypeMenu } from "@/components/editor/type-menu";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { MobileEditor, type EditorApi } from "@/components/editor/mobile-editor";
import { ContentEditors, PhotoUpload } from "@/components/editor/content-editors";
import { ACCENTS, coverPhotosFor, EVENT_TEMPLATES, REVEALS, THEME_PRESETS, metaFor, type Mode } from "@/components/editor/editor-shared";
import { themeRegistry } from "@/components/viewer/section-registry";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import { blankInvitation, blankSection, getInvitation } from "@/lib/invitation/samples";
import { invitationMeta } from "@/lib/invitation/meta";
import { getInvitationForEditAction } from "@/lib/invitation/actions";
import type { Invitation, Section, SectionType, ThemeId } from "@/lib/invitation/types";

type Tab = "content" | "style" | "layout" | "anim";

// ponytail: localStorage draft store — swap for a real backend when multi-device/sharing lands
const STORAGE_KEY = "chodaekung:editor:v1";
type SavedEditor = { draft?: Invitation; title?: string; hidden?: string[]; accent?: string | null };
const keyFor = (slug: string) => `${STORAGE_KEY}:${slug}`;
const tokenKeyFor = (slug: string) => `chodaekung:editor:token:${slug}`;

/** Basics handed over from the /new wizard (one-shot, via sessionStorage). */
type WizardSeed = { title?: string; subtitle?: string; date?: string; time?: string; location?: string; eventName?: string; theme?: ThemeId; accent?: string; eventStart?: string };
function readWizardSeed(): WizardSeed | null {
  try {
    const raw = sessionStorage.getItem("chodaekung:wizard");
    if (!raw) return null;
    sessionStorage.removeItem("chodaekung:wizard"); // consume once
    return JSON.parse(raw) as WizardSeed;
  } catch {
    return null;
  }
}
/** Apply the wizard title to the cover heading, whichever field the theme's cover uses. */
function applyWizardSeed(inv: Invitation, w: WizardSeed) {
  const t = w.title?.trim();
  if (!t) return;
  const cover = inv.sections.find((s) => s.type === "cover") as Extract<Section, { type: "cover" }> | undefined;
  if (!cover) return;
  const c = cover.content;
  if (Array.isArray(c.names) && c.names.length) c.names = [t];
  else if (c.titleLines) c.titleLines = [[t]];
  else c.title = t;
  // Cover date label, where the theme's cover carries one (plain text — safe across themes).
  // Native date input hands over ISO (YYYY-MM-DD); show it as YYYY.MM.DD.
  const prettyDate = w.date?.trim() ? w.date.replace(/-/g, ".") : "";
  const dl = [prettyDate, w.time?.trim()].filter(Boolean).join(" · ");
  if (dl && typeof c.dateLabel === "string") c.dateLabel = dl;
}

/** A friendly default editor title (cover names/title across themes, else a neutral default). */
function defaultTitleFor(inv: Invitation): string {
  const cover = inv.sections.find((s) => s.type === "cover") as Extract<Section, { type: "cover" }> | undefined;
  const names = cover?.content.names?.filter((n) => n.trim());
  if (names && names.length) return names.join(" · ");
  const t = invitationMeta(inv).title;
  if (t && t !== "초대장") return t;
  return inv.slug === "new" ? "새 초대장" : inv.slug;
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
  const [addOpen, setAddOpen] = useState(false);
  const [slug, setSlug] = useState(romanticSample.slug);
  const [editToken, setEditToken] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const didInit = useRef(false);

  // On mount: resolve ?slug=/?template= then load the saved draft, sample, or blank.
  // Runs exactly once — the ?template= branch rewrites the URL, so a StrictMode re-invoke
  // (or any remount) must not re-read the now-stripped query and fall through to blank.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void (async () => {
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template")?.trim();
    const slugParam = params.get("slug")?.trim();
    const wiz = readWizardSeed(); // basics handed over from the /new wizard (one-shot)

    // ?template=<sampleSlug> → start a NEW invitation seeded from that template (fresh copy).
    // Drop the param so a refresh keeps the user's edits (autosaved under "new") instead of re-seeding.
    if (templateParam && !slugParam) {
      const base = structuredClone(getInvitation(templateParam));
      base.slug = "new";
      if (wiz) applyWizardSeed(base, wiz);
      setDraft(base);
      setSelectedId(base.sections[0]?.id ?? "");
      setTitle(wiz?.title?.trim() || defaultTitleFor(base));
      setSlug("new");
      try {
        const t = localStorage.getItem(tokenKeyFor("new"));
        if (t) localStorage.removeItem(tokenKeyFor("new")); // a fresh template start owns no prior token
      } catch {
        /* ignore */
      }
      window.history.replaceState(null, "", "/editor");
      setHydrated(true);
      return;
    }

    const s = slugParam || "new";
    // No ?slug= means a brand-new invitation → start blank, not a filled sample.
    // Blank start uses the wizard's mood theme when provided, else the default blank.
    let d = slugParam ? getInvitation(slugParam) : blankInvitation(wiz?.theme);
    // Wizard "처음부터" (blank) start: seed the typed title fresh; don't restore a prior "new" draft.
    const freshFromWizard = !slugParam && !!wiz;
    if (freshFromWizard) {
      applyWizardSeed(d, wiz!);
      if (wiz!.accent) setAccent(wiz!.accent);
      if (wiz!.eventStart) d.eventStart = wiz!.eventStart;
    }
    let loadedTitle: string | null = null;
    let hadLocalDraft = false;
    if (!freshFromWizard) {
      try {
        const raw = localStorage.getItem(keyFor(s));
        if (raw) {
          const saved = JSON.parse(raw) as SavedEditor;
          if (saved.draft) { d = saved.draft; hadLocalDraft = true; }
          if (typeof saved.title === "string") loadedTitle = saved.title;
          if (Array.isArray(saved.hidden)) setHidden(new Set(saved.hidden));
          if (saved.accent !== undefined) setAccent(saved.accent);
        }
      } catch {
        /* private mode / corrupt value — fall back to the sample */
      }
    }
    try {
      const t = localStorage.getItem(tokenKeyFor(s));
      if (t) setEditToken(t);
    } catch {
      /* ignore */
    }
    // Editing an existing invitation with no local draft (another device, or a duplicate)?
    // Load its real content from the DB (owner-checked). A local WIP draft takes precedence.
    if (slugParam && !hadLocalDraft) {
      try {
        const res = await getInvitationForEditAction(slugParam);
        if (res.ok) {
          d = res.data;
          loadedTitle = res.title;
        }
      } catch {
        /* offline / not owned — keep the sample fallback */
      }
    }
    setDraft(d);
    setSelectedId(d.sections[0]?.id ?? "");
    setTitle(loadedTitle ?? wiz?.title?.trim() ?? (slugParam ? defaultTitleFor(d) : ""));
    setSlug(s);
    setHydrated(true);
    })();
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
  // Section types the current theme can actually render (for the add-section picker).
  // Every section type the current theme can render (its own palette), minus cover
  // (you don't "add" a cover). Order follows the theme's natural section flow.
  const addableTypes = (Object.keys(themeRegistry[draft.theme] ?? {}) as SectionType[]).filter((t) => t !== "cover");
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
  const addSection = (type: SectionType) =>
    setDraft((d) => ({ ...d, sections: [...d.sections, blankSection(type)] }));

  // Change an existing section's type in place (keeps its id/position; content resets to the new type).
  const changeSectionType = (id: string, type: SectionType) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? ({ ...blankSection(type), id } as Section) : s)) }));

  // Change event type after creation: re-apply the chosen event's template (theme + sections),
  // keeping the current slug. Replaces content, so confirm first.
  const applyTemplate = (sampleSlug: string) => {
    if (typeof window !== "undefined" && !window.confirm("현재 초대장 내용이 선택한 이벤트 템플릿으로 교체돼요. 계속할까요?")) return;
    const base = structuredClone(getInvitation(sampleSlug));
    base.slug = slug;
    setDraft(base);
    setSelectedId(base.sections[0]?.id ?? "");
    setTitle(defaultTitleFor(base));
    setHidden(new Set());
  };
  // Move a section from one index to another. Backs both drag-and-drop (desktop)
  // and the ▲/▼ buttons (touch/keyboard, since HTML5 drag doesn't fire on touch).
  const move = (from: number, to: number) => {
    setDraft((d) => {
      if (from === to || to < 0 || to >= d.sections.length) return d;
      const s = [...d.sections];
      const [m] = s.splice(from, 1);
      s.splice(to, 0, m);
      return { ...d, sections: s };
    });
  };
  const reorder = (to: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from != null) move(from, to);
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
    changeSectionType,
    reorder,
    move,
    dragIndex,
    cover,
    openPublish: () => setPubOpen(true),
    openPreview,
    applyTemplate,
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
            <div style={{ position: "relative" }}>
              <button className="add-section" title="섹션 추가" onClick={() => setAddOpen((v) => !v)}>
                <Icon name="ic-plus" />
              </button>
              {addOpen && (
                <>
                  <div onClick={() => setAddOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 41, minWidth: 164, background: "#fff", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 12px 32px rgba(26,26,46,0.16)", padding: 6, display: "flex", flexDirection: "column", gap: 1 }}>
                    {addableTypes.map((t) => {
                      const m = metaFor(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { addSection(t); setAddOpen(false); }}
                          style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit", fontSize: 13, fontWeight: 600, color: "var(--ink)", padding: "9px 10px", borderRadius: 8 }}
                        >
                          <Icon name={m.icon} width={16} height={16} style={{ flexShrink: 0 }} /> {m.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
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
                    <TypeMenu
                      current={s.type}
                      options={Array.from(new Set<SectionType>(["cover", ...addableTypes, s.type]))}
                      onChange={(t) => changeSectionType(s.id, t)}
                      triggerClassName="sec-type-select"
                    />
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
                <ContentEditors draft={draft} patch={patch} />
                <div className="insp-group">
                  <h5>캘린더</h5>
                  <div className="insp-field">
                    <div className="insp-label">행사 일시 (캘린더 추가용)</div>
                    <input
                      className="insp-input"
                      type="datetime-local"
                      value={draft.eventStart ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, eventStart: e.target.value || undefined }))}
                    />
                    <div style={{ fontSize: 11, color: "var(--fg-3, #8a8a99)", marginTop: 6, lineHeight: 1.5 }}>
                      방문객이 “캘린더에 추가”로 저장할 실제 일시예요. 커버에 보이는 날짜 문구와는 별개로 설정돼요.
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "style" && (
              <>
                <div className="insp-group">
                  <h5>이벤트 종류</h5>
                  <div className="radio-group">
                    {EVENT_TEMPLATES.map((e) => (
                      <button key={e.slug} className="radio-btn" onClick={() => applyTemplate(e.slug)}>
                        {e.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    이벤트에 맞는 템플릿(테마·섹션 구성)으로 바꿔요. 지금 입력한 내용은 새 템플릿으로 교체돼요.
                  </p>
                </div>
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
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    같은 내용을 테마만 바꿔 즉시 다시 렌더해요. 게이밍·개발자 테마는 섹션 구성이 달라 일부 섹션이 숨겨질 수 있어요.
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
                    {coverPhotosFor(draft.theme).map((p) => (
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

            {tab === "layout" && (
              <>
                <div className="insp-group">
                  <h5>콘텐츠 폭</h5>
                  <div className="radio-group">
                    {([["narrow", "좁게"], ["normal", "기본"], ["wide", "넓게"]] as const).map(([id, label]) => (
                      <button
                        key={id}
                        className={`radio-btn${(draft.layout?.width ?? "normal") === id ? " active" : ""}`}
                        onClick={() => setDraft((d) => ({ ...d, layout: { ...d.layout, width: id } }))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="insp-group">
                  <h5>배경</h5>
                  <div className="radio-group">
                    {([["soft", "부드럽게"], ["solid", "단색"], ["none", "꽉 채움"]] as const).map(([id, label]) => (
                      <button
                        key={id}
                        className={`radio-btn${(draft.layout?.background ?? "soft") === id ? " active" : ""}`}
                        onClick={() => setDraft((d) => ({ ...d, layout: { ...d.layout, background: id } }))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    초대장을 감싸는 폭·여백·배경이에요. 발행·미리보기 화면(특히 데스크톱)에 반영돼요 — 편집 프리뷰는 항상 폰 폭으로 꽉 차게 보여요.
                  </p>
                </div>
              </>
            )}
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
