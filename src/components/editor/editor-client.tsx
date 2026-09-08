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
import { ACCENTS, FONTS, TEXT_COLORS, coverPhotosFor, EVENT_TEMPLATES, REVEALS, THEME_PRESETS, metaFor, type Mode } from "@/components/editor/editor-shared";
import { themeRegistry } from "@/components/viewer/section-registry";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import { blankInvitation, blankSection, getInvitation } from "@/lib/invitation/samples";
import { invitationMeta } from "@/lib/invitation/meta";
import { monthGrid } from "@/lib/invitation/month-grid";
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
/** Apply the wizard basics onto the seeded invitation. Each field is applied independently
 * (any subset the user filled carries over) and only into fields the theme's cover actually
 * uses, so nothing the guest typed is silently dropped and no unused field is invented. */
function applyWizardSeed(inv: Invitation, w: WizardSeed) {
  const cover = inv.sections.find((s) => s.type === "cover") as Extract<Section, { type: "cover" }> | undefined;
  if (cover) {
    const c = cover.content;
    const t = w.title?.trim();
    if (t) {
      if (Array.isArray(c.names) && c.names.length) c.names = [t];
      else if (c.titleLines) c.titleLines = [[t]];
      else c.title = t;
    }
    // Subtitle → whichever field the theme's cover uses (multi-line vs single); don't invent one.
    const sub = w.subtitle?.trim();
    if (sub) {
      if (Array.isArray(c.subtitleLines)) c.subtitleLines = [sub];
      else if (typeof c.subtitle === "string") c.subtitle = sub;
    }
    // Cover date label (plain text — safe across themes). Native date input hands over ISO.
    const prettyDate = w.date?.trim() ? w.date.replace(/-/g, ".") : "";
    const dl = [prettyDate, w.time?.trim()].filter(Boolean).join(" · ");
    if (dl && typeof c.dateLabel === "string") c.dateLabel = dl;
  }
  // Venue → the location section's title line (its header). Body/address stay template-provided
  // (the user edits the rest); on a blank start the section fills in cleanly.
  const loc = w.location?.trim();
  if (loc) {
    const locSec = inv.sections.find((s) => s.type === "location") as Extract<Section, { type: "location" }> | undefined;
    if (locSec) locSec.content.title = [[loc]];
  }
  // Canonical event datetime (D-day countdown + .ics). Prefer the wizard's ISO, else date[+time].
  const iso = w.eventStart?.trim() || (w.date?.trim() ? `${w.date}${w.time?.trim() ? "T" + w.time : ""}` : "");
  if (iso) inv.eventStart = iso;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Flatten a rich Line (string | Run[]) to plain text — for the inline-edit titleLines guard. */
function lineToText(line: unknown): string {
  if (typeof line === "string") return line;
  if (Array.isArray(line)) return line.map((r) => (typeof r === "string" ? r : (r as { text?: string })?.text ?? "")).join("");
  return "";
}

/** Blank-start ONLY: fill the (empty) date section from the wizard date, across the fields the
 * themes actually render — title (romantic/cute), bigDate + dataGrid (minimal/developer), and the
 * calendar month grid (romantic). Deliberately NOT called on a template start, so a chosen
 * template keeps its own date section (the user customizes it). Themes whose blank skeleton has no
 * date section (editorial/timeline/battle/gaming) are unaffected — their date is on the cover. */
function fillBlankDateSection(inv: Invitation, w: WizardSeed) {
  const isoDate = w.date?.trim();
  if (!isoDate) return;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return;
  const date = inv.sections.find((s) => s.type === "date") as Extract<Section, { type: "date" }> | undefined;
  if (!date) return;
  const time = w.time?.trim() || "";
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const c = date.content;
  if (!c.eyebrow) c.eyebrow = "The Date";
  c.title = time ? [[`${y}. ${mm}. ${dd}`], [`${wd} `, { text: time, em: true }]] : [[`${y}. ${mm}. ${dd}`], [wd]];
  c.bigDate = [mm, dd];
  c.dataGrid = [
    { k: "Date", en: `${mm}.${dd}` },
    { k: "Day", en: wd.slice(0, 3).toUpperCase() },
    ...(time ? [{ k: "Time", en: time }] : []),
  ];
  c.calendar = {
    monthLabel: [`${MONTHS[m - 1]} `, { text: String(y), em: true }],
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    days: monthGrid(y, m - 1, d),
  };
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
  // Accent/font/text-color live in the draft (single source), so they autosave, publish, preview
  // and render via the viewer without separate plumbing. Setters write; reads derive from the draft.
  const accent = draft.accent ?? null;
  const setAccent = (c: string | null) => setDraft((d) => ({ ...d, accent: c ?? undefined }));
  const font = draft.font ?? "pretendard";
  const setFont = (id: string) => setDraft((d) => ({ ...d, font: id === "pretendard" ? undefined : id }));
  const textColor = draft.textColor ?? null;
  const setTextColor = (c: string | null) => setDraft((d) => ({ ...d, textColor: c ?? undefined }));
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
      if (wiz) {
        applyWizardSeed(base, wiz);
        if (wiz.accent) base.accent = wiz.accent;
      }
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
      applyWizardSeed(d, wiz!); // sets eventStart from the wizard too
      fillBlankDateSection(d, wiz!); // blank canvas only — populate the empty date section
      if (wiz!.accent) d.accent = wiz!.accent;
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
          // Migrate a legacy top-level saved accent into the draft (new saves keep it in draft.accent).
          if (saved.accent != null && d.accent == null) d.accent = saved.accent;
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

  // Inline WYSIWYG edit from the center preview: commit a tagged text field to the draft.
  // `path` is a field within the section content, e.g. "eyebrow", "dateLabel", "names.0".
  const handleInlineEdit = (secId: string, path: string, value: string, asLines: boolean) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== secId) return s;
        const content = { ...(s.content as Record<string, unknown>) };
        const dot = path.indexOf(".");
        if (asLines) {
          // A rich Line[] field (title/body/titleLines): split the edited text into plain-string
          // lines. Guard on change so a no-op click preserves the original Line[] and its em runs.
          const cur = Array.isArray(content[path]) ? (content[path] as unknown[]).map(lineToText).join("\n") : "";
          if (value !== cur) content[path] = value.split("\n");
        } else if (dot >= 0) {
          // A string in an array by index: names[i], subtitleLines[i], headerRightLines[i].
          const field = path.slice(0, dot);
          const idx = Number(path.slice(dot + 1));
          const arr = Array.isArray(content[field]) ? [...(content[field] as unknown[])] : [];
          arr[idx] = value;
          content[field] = arr;
        } else {
          content[path] = value;
        }
        return { ...s, content } as Section;
      }),
    }));
  };

  // Select a section AND scroll the center preview to it (section-list click → jump to that page).
  const selectSection = (id: string) => {
    setSelectedId(id);
    const scroller = document.querySelector<HTMLElement>(".phone-scroll");
    const el = scroller?.querySelector<HTMLElement>(`[data-sec-id="${CSS.escape(id)}"]`);
    if (!scroller || !el) return;
    const top = scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 8;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };
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
    font,
    setFont,
    textColor,
    setTextColor,
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
                  onClick={() => selectSection(s.id)}
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
                <InvitationViewer invitation={visibleDraft} contained onEdit={handleInlineEdit} onSelectSection={setSelectedId} />
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
                    <button
                      className={`color-swatch color-swatch-none${accent === null ? " active" : ""}`}
                      aria-label="테마 기본색"
                      title="테마 기본색"
                      onClick={() => setAccent(null)}
                    />
                    {ACCENTS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch${accent === c ? " active" : ""}`}
                        style={{ background: c }}
                        aria-label={c}
                        onClick={() => setAccent(c)}
                      />
                    ))}
                    <label className="color-swatch color-swatch-custom" title="직접 고르기" style={accent && !ACCENTS.includes(accent) ? { background: accent } : undefined}>
                      <input type="color" value={accent ?? "#E38B8B"} onChange={(e) => setAccent(e.target.value)} aria-label="직접 색상 선택" />
                    </label>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    초대장 전체의 강조색(버튼·포인트)을 바꿔요. 발행된 초대장에도 그대로 적용돼요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>글씨체</h5>
                  <div className="radio-group">
                    {FONTS.map((f) => (
                      <button
                        key={f.id}
                        className={`radio-btn${font === f.id ? " active" : ""}`}
                        style={{ fontFamily: f.stack }}
                        onClick={() => setFont(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    초대장 본문·제목 글씨체를 바꿔요. 선택한 글씨체만 불러와요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>글씨색</h5>
                  <div className="color-row">
                    <button
                      className={`color-swatch color-swatch-none${textColor === null ? " active" : ""}`}
                      aria-label="테마 기본색"
                      title="테마 기본색"
                      onClick={() => setTextColor(null)}
                    />
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch${textColor === c ? " active" : ""}`}
                        style={{ background: c }}
                        aria-label={c}
                        onClick={() => setTextColor(c)}
                      />
                    ))}
                    <label className="color-swatch color-swatch-custom" title="직접 고르기" style={textColor && !TEXT_COLORS.includes(textColor) ? { background: textColor } : undefined}>
                      <input type="color" value={textColor ?? "#2A2A3E"} onChange={(e) => setTextColor(e.target.value)} aria-label="직접 글씨색 선택" />
                    </label>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    본문 글씨색을 바꿔요. 커버(사진 위 글씨)는 그대로예요.
                  </p>
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
