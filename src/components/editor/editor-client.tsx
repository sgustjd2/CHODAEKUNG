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
import { TextStyleControls } from "@/components/editor/text-style-controls";
import { mergeTextStyle } from "@/lib/invitation/text-style";
import { ACCENTS, BG_COLORS, FONTS, PALETTES, TEXT_COLORS, coverImagePatch, coverPhotosFor, coverDateLines, syncCoverDate, EVENT_TEMPLATES, REVEALS, THEME_PRESETS, metaFor, type Mode } from "@/components/editor/editor-shared";
import { themeRegistry } from "@/components/viewer/section-registry";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import { blankInvitation, exampleSection, getInvitation } from "@/lib/invitation/samples";
import { invitationMeta } from "@/lib/invitation/meta";
import { monthGrid } from "@/lib/invitation/month-grid";
import { getAtPath, flattenText, lineToText } from "@/lib/invitation/path";
import { getInvitationForEditAction } from "@/lib/invitation/actions";
import type { Invitation, Section, SectionType, TextStyle, ThemeId } from "@/lib/invitation/types";

type Tab = "content" | "style" | "layout" | "anim";

// ponytail: localStorage draft store — swap for a real backend when multi-device/sharing lands
const STORAGE_KEY = "chodaekung:editor:v1";
type SavedEditor = { draft?: Invitation; title?: string; hidden?: string[]; accent?: string | null; templateDefaults?: Invitation | null };
const keyFor = (slug: string) => `${STORAGE_KEY}:${slug}`;
const tokenKeyFor = (slug: string) => `chodaekung:editor:token:${slug}`;

// The order ContentEditors renders section groups in (mirrors content-editors.tsx JSX order).
// Lets a section-list click scroll the inspector to that section's editor group.
// ponytail: keep in sync with content-editors.tsx if its group order changes.
const INSPECTOR_ORDER: SectionType[] = [
  "cover", "message", "location", "date", "schedule", "gallery", "rsvp", "versus", "matchInfo", "countdown", "rules",
  "account", "dday", "guestbook", "attendees", "accept", "timeline", "checklist", "details", "notice",
  "quote", "lanes", "gInfo", "tierChart", "champions", "cost", "route", "roster", "menu", "dayPlan", "ending",
];

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
// Cover badge icons that mean "place" vs "time" — used to steer the wizard venue/date into the
// right chip (timeline/meetup covers carry the venue + date as badges, not a dateLabel).
const PLACE_BADGE_ICONS = ["ic-pin", "ic-mountain", "ic-map", "ic-location"];
// Details `info` row keys that mean "venue" (case-insensitive), so a wizard venue lands there too.
const VENUE_INFO_KEYS = ["where", "location", "place", "venue", "장소", "위치"];
function applyWizardSeed(inv: Invitation, w: WizardSeed) {
  const loc = w.location?.trim();
  const prettyDate = w.date?.trim() ? w.date.replace(/-/g, ".") : "";
  const dl = [prettyDate, w.time?.trim()].filter(Boolean).join(" · ");
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
    if (dl && typeof c.dateLabel === "string") c.dateLabel = dl;
    // Battle/gaming covers show the date on the cover header (headerRightLines), not a dateLabel —
    // update those too so a wizard-entered date actually reflects on the cover.
    if (Array.isArray(c.headerRightLines) && w.date?.trim()) {
      c.headerRightLines = coverDateLines(`${w.date}${w.time?.trim() ? "T" + w.time : "T00:00"}`);
    }
    // Timeline/meetup covers carry the venue + date as badges (chips), not names/dateLabel — steer
    // the wizard venue into the place chip and the date into the clock chip so they're not left at
    // the template's sample (e.g. "홍대 골목집"). Matched by the badge's icon.
    if (Array.isArray(c.badges)) {
      c.badges = c.badges.map((b) => {
        if (loc && b.icon && PLACE_BADGE_ICONS.includes(b.icon)) return { ...b, label: loc };
        if (dl && b.icon === "ic-clock") return { ...b, label: dl };
        return b;
      });
    }
  }
  // Venue → the location section's title line (its header). Body/address stay template-provided
  // (the user edits the rest); on a blank start the section fills in cleanly.
  if (loc) {
    const locSec = inv.sections.find((s) => s.type === "location") as Extract<Section, { type: "location" }> | undefined;
    if (locSec) locSec.content.title = [[loc]];
    // A details/info card also surfaces the venue (its "Where" row) — update it so the venue isn't
    // left at the sample there either. Full venue goes in the value; the unit suffix is cleared.
    const detailsSec = inv.sections.find((s) => s.type === "details") as Extract<Section, { type: "details" }> | undefined;
    if (detailsSec?.content.info) {
      detailsSec.content.info = detailsSec.content.info.map((kv) =>
        VENUE_INFO_KEYS.includes((kv.k ?? "").trim().toLowerCase()) ? { ...kv, v: loc, u: "" } : kv,
      );
    }
  }
  // Canonical event datetime (D-day countdown + .ics). Prefer the wizard's ISO, else date[+time].
  const iso = w.eventStart?.trim() || (w.date?.trim() ? `${w.date}${w.time?.trim() ? "T" + w.time : ""}` : "");
  if (iso) inv.eventStart = iso;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Immutably set a value at a dot-path, cloning each container along the way (numeric segment → array
 * index, else object key). Used by inline editing to write nested fields (badges.0.label, info.2.v,
 * party.countLabel, items.0.title) without mutating the previous draft. */
function setAtPath<T extends Record<string, unknown>>(root: T, path: string, value: unknown): T {
  const parts = path.split(".");
  const clone = (v: unknown): Record<string, unknown> | unknown[] => (Array.isArray(v) ? [...v] : { ...(v as Record<string, unknown> | undefined) });
  const out = clone(root) as Record<string, unknown>;
  let cur: Record<string, unknown> | unknown[] = out;
  for (let i = 0; i < parts.length - 1; i++) {
    const key: string | number = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i];
    const child = clone((cur as Record<string, unknown>)[key as string]);
    (cur as Record<string, unknown>)[key as string] = child;
    cur = child;
  }
  const last = parts[parts.length - 1];
  (cur as Record<string, unknown>)[/^\d+$/.test(last) ? Number(last) : last] = value;
  return out as T;
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
  const fontScale = draft.fontScale ?? 1;
  const setFontScale = (n: number) => setDraft((d) => ({ ...d, fontScale: n === 1 ? undefined : n }));
  const letterSpacing = draft.letterSpacing ?? 0;
  const setLetterSpacing = (n: number) => setDraft((d) => ({ ...d, letterSpacing: n === 0 ? undefined : n }));
  const lineHeight = draft.lineHeight ?? 1;
  const setLineHeight = (n: number) => setDraft((d) => ({ ...d, lineHeight: n === 1 ? undefined : n }));
  const bgColor = draft.bgColor ?? null;
  const setBgColor = (c: string | null) => setDraft((d) => ({ ...d, bgColor: c ?? undefined }));
  // One-click palette: sets accent + background + text color together (a coherent combo).
  const applyPalette = (p: (typeof PALETTES)[number]) =>
    setDraft((d) => ({ ...d, accent: p.accent ?? undefined, bgColor: p.bg ?? undefined, textColor: p.text ?? undefined }));
  const paletteActive = (p: (typeof PALETTES)[number]) => (p.accent ?? null) === accent && (p.bg ?? null) === bgColor && (p.text ?? null) === textColor;
  // True when any color/typography customization is set (so the reset button can disable itself).
  const hasCustomDesign =
    !!(draft.accent || draft.font || draft.textColor || draft.fontScale || draft.letterSpacing || draft.lineHeight || draft.bgColor) ||
    draft.sections.some((s) => s.style);
  // Reset color/typography customizations to the theme defaults, keeping content, sections and theme.
  const resetDesign = () =>
    setDraft((d) => ({
      ...d,
      accent: undefined,
      font: undefined,
      textColor: undefined,
      fontScale: undefined,
      letterSpacing: undefined,
      lineHeight: undefined,
      bgColor: undefined,
      sections: d.sections.map((s) => {
        if (!s.style) return s;
        const { style: _drop, ...rest } = s;
        return rest as Section;
      }),
    }));
  // Per-section color override for the currently-selected section (on top of the invitation-wide vars).
  const selSec = draft.sections.find((s) => s.id === selectedId);
  const setSecStyle = (key: "accent" | "bg", val: string | null) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== selectedId) return s;
        const style = { ...s.style };
        if (val == null) delete style[key];
        else style[key] = val;
        return { ...s, style: Object.keys(style).length ? style : undefined };
      }),
    }));
  // Per-field text styling: the currently-focused editable text field (from the preview) + a writer
  // that merges a style override into that field, keyed by the field's Editable path.
  const [selectedField, setSelectedField] = useState<{ secId: string; path: string } | null>(null);
  const patchTextStyle = (secId: string, path: string, partial: Partial<TextStyle> | null) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== secId) return s;
        const style = { ...s.style };
        const text = { ...(style.text ?? {}) };
        const next = mergeTextStyle(text[path], partial);
        if (next) text[path] = next;
        else delete text[path];
        if (Object.keys(text).length) style.text = text;
        else delete style.text;
        return { ...s, style: Object.keys(style).length ? style : undefined };
      }),
    }));
  const selFieldStyle: TextStyle | undefined = selectedField
    ? draft.sections.find((s) => s.id === selectedField.secId)?.style?.text?.[selectedField.path]
    : undefined;
  // Floating style toolbar: anchor it above the selected editable in the preview, following scroll.
  const previewRef = useRef<HTMLDivElement>(null);
  const [ftPos, setFtPos] = useState<{ top: number; left: number } | null>(null);

  const [pubOpen, setPubOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  // Raw template a NEW invitation was seeded from — its example values render as gray "hint" text
  // (still untouched by the user) and are dropped from the published copy. Null for existing/blank starts.
  const [templateDefaults, setTemplateDefaults] = useState<Invitation | null>(null);
  // Two-step guard for the destructive full reset ("되돌리기"): first click arms, second confirms.
  const [resetArmed, setResetArmed] = useState(false);
  // Snapshot of the invitation as first loaded, so "되돌리기" reverts to *this* invitation's starting
  // point — not getInvitation(slug)/blankInvitation(), which fall back to the romantic sample for any
  // non-bundled slug and turned a 맞짱 (or any real invitation) into the wedding template.
  const initialRef = useRef<{ draft: Invitation; title: string; hidden: string[] } | null>(null);
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
      // Baseline = the template's own example content (before the wizard fills anything), so a field
      // the user/wizard hasn't changed still reads as a gray hint; wizard-filled fields are "real".
      setTemplateDefaults(structuredClone(base));
      if (wiz) {
        applyWizardSeed(base, wiz);
        if (wiz.accent) base.accent = wiz.accent;
      }
      const initTitle = wiz?.title?.trim() || defaultTitleFor(base);
      setDraft(base);
      setSelectedId(base.sections[0]?.id ?? "");
      setTitle(initTitle);
      setSlug("new");
      initialRef.current = { draft: structuredClone(base), title: initTitle, hidden: [] };
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
    let loadedHidden: string[] = [];
    let hadLocalDraft = false;
    if (!freshFromWizard) {
      try {
        const raw = localStorage.getItem(keyFor(s));
        if (raw) {
          const saved = JSON.parse(raw) as SavedEditor;
          if (saved.draft) { d = saved.draft; hadLocalDraft = true; }
          if (typeof saved.title === "string") loadedTitle = saved.title;
          if (Array.isArray(saved.hidden)) { setHidden(new Set(saved.hidden)); loadedHidden = saved.hidden; }
          // Restore the template baseline so untouched example fields stay gray hints (and drop on
          // publish) after a refresh — without it the hints hardened into permanent solid content.
          if (saved.templateDefaults) setTemplateDefaults(saved.templateDefaults);
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
    const initTitle = loadedTitle ?? wiz?.title?.trim() ?? (slugParam ? defaultTitleFor(d) : "");
    setDraft(d);
    setSelectedId(d.sections[0]?.id ?? "");
    setTitle(initTitle);
    setSlug(s);
    initialRef.current = { draft: structuredClone(d), title: initTitle, hidden: loadedHidden };
    setHydrated(true);
    })();
  }, []);

  // Autosave (per invitation) after hydration so edits survive a refresh.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent, templateDefaults } satisfies SavedEditor));
    } catch {
      /* storage unavailable — skip; edits stay in memory */
    }
  }, [hydrated, slug, draft, title, hidden, accent, templateDefaults]);

  // Mobile viewport height: track the visual viewport so the editor shell fits the *visible* area —
  // above the browser chrome, and (on iOS, which ignores interactive-widget) above the on-screen
  // keyboard, so the bottom sheet's fields aren't hidden behind it. CSS falls back to 100dvh.
  // ponytail: pinch-zoom also shrinks visualViewport.height; acceptable for an editor.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const set = () => document.documentElement.style.setProperty("--app-vh", `${Math.round(vv.height)}px`);
    set();
    vv.addEventListener("resize", set);
    vv.addEventListener("scroll", set);
    return () => {
      vv.removeEventListener("resize", set);
      vv.removeEventListener("scroll", set);
      document.documentElement.style.removeProperty("--app-vh");
    };
  }, []);

  // A section the current theme has no renderer for is "orphaned" — kept in the draft (and still
  // editable, so switching back restores it) but excluded from the preview AND the published record,
  // so a cross-theme switch never silently ships an invisible section. Derived from theme+type (no
  // stored hide state), so it self-corrects when the theme changes back.
  const canRenderInTheme = (type: SectionType) => !!themeRegistry[draft.theme]?.[type];
  const visibleDraft: Invitation = { ...draft, sections: draft.sections.filter((s) => !hidden.has(s.id) && canRenderInTheme(s.type)) };

  // Keep the floating style toolbar anchored above the selected editable field as the preview scrolls
  // or the layout changes (a style edit can resize the text). Cleared when no field is selected.
  useEffect(() => {
    if (!selectedField) { setFtPos(null); return; }
    const preview = previewRef.current;
    if (!preview) return;
    // Fixed positioning (viewport coords) so the panel is never clipped by the preview's overflow;
    // recomputed on any scroll/resize so it tracks the field.
    const compute = () => {
      const sel = `[data-sec-id="${CSS.escape(selectedField.secId)}"] [data-edit="${CSS.escape(selectedField.path)}"]`;
      const el = preview.querySelector<HTMLElement>(sel);
      if (!el) { setFtPos(null); return; }
      const er = el.getBoundingClientRect();
      setFtPos({ top: er.bottom + 6, left: Math.max(150, Math.min(er.left + er.width / 2, window.innerWidth - 150)) });
    };
    compute();
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => { window.removeEventListener("scroll", compute, true); window.removeEventListener("resize", compute); };
    // Depend on `draft` (stable identity between edits), NOT the derived `visibleDraft` (a fresh object
    // every render) — the latter re-ran this effect every render, and its setFtPos re-triggered the
    // render, looping until React's "Maximum update depth exceeded". A real edit still repositions.
  }, [selectedField, draft]);

  // Inline WYSIWYG edit from the center preview: commit a tagged text field to the draft.
  // `path` is a field within the section content, e.g. "eyebrow", "dateLabel", "names.0".
  const handleInlineEdit = (secId: string, path: string, value: string, asLines: boolean) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== secId) return s;
        // A rich Line[] leaf (title/body/titleLines): guard a no-op so an incidental click preserves
        // the original Line[] and its em runs (a real edit flattens to plain-string lines).
        if (asLines) {
          const cur = getAtPath(s.content, path);
          const curText = Array.isArray(cur) ? (cur as unknown[]).map(lineToText).join("\n") : "";
          if (value === curText) return s;
        }
        // Write the edited text into the section content at `path` — supports nested paths with
        // array indices and object keys (badges.0.label, info.2.v, party.countLabel, items.0.title).
        const content = setAtPath(s.content as Record<string, unknown>, path, asLines ? value.split("\n") : value);
        return { ...s, content } as Section;
      }),
    }));
  };

  // Scroll the inspector's 내용 tab to a section's editor group. The 내용 tab stacks every section's
  // editor; groups render in INSPECTOR_ORDER for the types that exist, so the group index = the
  // selected type's position among existing types. The leading 문구 스타일 and trailing 캘린더/참여 인원
  // groups carry data-fixed-group, so they're filtered out (else every jump landed one group short).
  const scrollInspectorToSection = (sec: Section | undefined) => {
    if (tab !== "content" || !sec) return;
    const body = document.querySelector<HTMLElement>(".inspector-body");
    if (!body) return;
    const idx = INSPECTOR_ORDER.filter((t) => draft.sections.some((s) => s.type === t)).indexOf(sec.type);
    if (idx < 0) return;
    const groups = [...body.querySelectorAll<HTMLElement>(".insp-group")].filter((g) => !g.dataset.fixedGroup);
    const group = groups[idx];
    if (group) body.scrollTop = Math.max(0, body.scrollTop + group.getBoundingClientRect().top - body.getBoundingClientRect().top - 8);
  };
  const scrollPreviewToSection = (id: string) => {
    const scroller = document.querySelector<HTMLElement>(".phone-scroll");
    const el = scroller?.querySelector<HTMLElement>(`[data-sec-id="${CSS.escape(id)}"]`);
    if (!scroller || !el) return;
    // scrollTo({behavior:"smooth"}) silently no-ops on this scroll container in some browsers; set
    // scrollTop directly (always works). The focus ring makes the jump obvious.
    scroller.scrollTop = Math.max(0, scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 8);
  };
  // Section-list click → select + jump the preview AND the inspector to that section (all three sync).
  const selectSection = (id: string) => {
    setSelectedId(id);
    scrollPreviewToSection(id);
    scrollInspectorToSection(draft.sections.find((s) => s.id === id));
  };
  // Preview field focus → select + follow in the inspector and section list (but don't yank the
  // preview, which the user is already looking at). Only re-scroll when the section actually changed,
  // so tabbing between fields of the same section doesn't jump the inspector.
  const selectFromPreview = (id: string) => {
    const changed = id !== selectedId;
    setSelectedId(id);
    if (!changed) return;
    scrollInspectorToSection(draft.sections.find((s) => s.id === id));
    document.querySelector<HTMLElement>(`.sec-list [data-sec-item="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "nearest" });
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
  // The cover is never deletable — it isn't in the add picker, so deleting it strands the invitation
  // with no cover and dead cover controls. Deleting the selected section also re-points the selection.
  const del = (id: string) => {
    const target = draft.sections.find((s) => s.id === id);
    if (!target || target.type === "cover") return;
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
    if (selectedId === id) setSelectedId(draft.sections.find((s) => s.id !== id)?.id ?? "");
  };
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
  // Insert a new section right after the selected one (so it lands where the user is working), never
  // after the ending — the closing stays last; falls back to just-before-ending, else the end. Selects
  // the new section so the user sees where it went.
  const addSection = (type: SectionType) => {
    const sec = exampleSection(type, draft.theme);
    setDraft((d) => {
      const sections = [...d.sections];
      const selIdx = sections.findIndex((s) => s.id === selectedId);
      const endIdx = sections.findIndex((s) => s.type === "ending");
      let at = selIdx >= 0 ? selIdx + 1 : sections.length;
      if (endIdx >= 0 && at > endIdx) at = endIdx;
      sections.splice(at, 0, sec);
      return { ...d, sections };
    });
    setSelectedId(sec.id);
  };

  // Change an existing section's type in place (keeps its id/position; content resets to a
  // theme-appropriate example for the new type).
  const changeSectionType = (id: string, type: SectionType) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? ({ ...exampleSection(type, d.theme), id } as Section) : s)) }));

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
      localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent, templateDefaults } satisfies SavedEditor));
    } catch {
      /* storage unavailable — preview may show a stale/empty draft */
    }
    window.open(`/preview?slug=${encodeURIComponent(slug)}`, "_blank", "noopener");
  };

  // Build the copy to publish: drop the template's example DATA the user never touched (shown as gray
  // hints in the editor). The editable fields are read from the preview's data-edit markers (the
  // authoritative set). A field is "untouched" if its value still equals the template default. We
  // remove whole untouched *items* from list fields (badges, info rows, schedule steps, …) rather than
  // blanking leaves — so no empty cards/pills ship — and keep any item the user edited even partially.
  const cleanForPublish = (): Invitation => {
    if (!templateDefaults) return visibleDraft;
    const defBy = new Map(templateDefaults.sections.map((s) => [s.id, s.content]));
    const pathsBySec = new Map<string, Set<string>>();
    document.querySelectorAll<HTMLElement>("[data-sec-id] [data-edit]").forEach((el) => {
      const secId = el.closest<HTMLElement>("[data-sec-id]")?.dataset.secId;
      const path = el.dataset.edit;
      if (!secId || !path) return;
      if (!pathsBySec.has(secId)) pathsBySec.set(secId, new Set());
      pathsBySec.get(secId)!.add(path);
    });
    let out = visibleDraft;
    for (const [secId, pathSet] of pathsBySec) {
      const defContent = defBy.get(secId);
      const sec = out.sections.find((s) => s.id === secId);
      if (!defContent || !sec) continue;
      const isPristine = (p: string) => {
        const d = flattenText(getAtPath(defContent, p));
        return d !== "" && flattenText(getAtPath(sec.content, p)) === d;
      };
      // Group the section's editable paths by their top-level list item ("badges.0", "info.2").
      const groups = new Map<string, string[]>();
      for (const p of pathSet) {
        const m = p.match(/^([^.]+)\.(\d+)(?:\.|$)/);
        if (m) {
          const key = `${m[1]}.${m[2]}`;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(p);
        }
      }
      // An item is a droppable example when every editable leaf under it is still pristine.
      const dropIdx = new Map<string, Set<number>>();
      for (const [key, ps] of groups) {
        if (!ps.every(isPristine)) continue;
        const [arr, idx] = key.split(".");
        if (!dropIdx.has(arr)) dropIdx.set(arr, new Set());
        dropIdx.get(arr)!.add(Number(idx));
      }
      if (dropIdx.size === 0) continue;
      let content = sec.content as Record<string, unknown>;
      let changed = false;
      for (const [arr, idxs] of dropIdx) {
        const cur = content[arr];
        if (!Array.isArray(cur)) continue;
        const kept = cur.filter((_, i) => !idxs.has(i));
        if (kept.length !== cur.length) {
          content = { ...content, [arr]: kept };
          changed = true;
        }
      }
      if (changed) out = { ...out, sections: out.sections.map((s) => (s.id === secId ? ({ ...s, content } as Section) : s)) };
    }
    return out;
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
    fontScale,
    setFontScale,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight,
    bgColor,
    setBgColor,
    resetDesign,
    handleInlineEdit,
    setSecStyle,
    previewStyle,
    patch,
    addSection,
    changeSectionType,
    del,
    duplicate,
    toggleHide,
    hidden,
    reorder,
    move,
    dragIndex,
    cover,
    templateDefaults,
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
                  data-sec-item={s.id}
                  className={`sec-item${selectedId === s.id ? " active" : ""}${hidden.has(s.id) ? " hidden-sec" : ""}${!canRenderInTheme(s.type) ? " orphan-sec" : ""}`}
                  title={!canRenderInTheme(s.type) ? "이 테마에서는 표시되지 않아요 (다른 테마로 바꾸면 다시 나타나요)" : undefined}
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
                  {!canRenderInTheme(s.type) && <span className="sec-orphan-badge">미표시</span>}
                  <div className="sec-actions">
                    <button title="숨김" onClick={(e) => { e.stopPropagation(); toggleHide(s.id); }}>
                      <Icon name={hidden.has(s.id) ? "ic-eye" : "ic-eye-off"} />
                    </button>
                    <button title="복제" onClick={(e) => { e.stopPropagation(); duplicate(s.id); }}>
                      <Icon name="ic-duplicate" />
                    </button>
                    {s.type !== "cover" && (
                      <button title="삭제" onClick={(e) => { e.stopPropagation(); del(s.id); }}>
                        <Icon name="ic-x" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER: preview */}
        <div className="col-preview" ref={previewRef}>
          <div className="preview-toolbar">
            <span className="d" /> LIVE PREVIEW · 390 × 844 · {mode.toUpperCase()} MODE
          </div>
          <div className={`device${device === "desktop" ? " desktop" : ""}`}>
            <div className="notch" />
            <div className="screen">
              <div className="phone-scroll" style={previewStyle}>
                <InvitationViewer invitation={visibleDraft} contained onEdit={handleInlineEdit} onSelectSection={selectFromPreview} onSelectField={(secId, path) => setSelectedField({ secId, path })} selectedId={selectedId} templateDefaults={templateDefaults} />
              </div>
            </div>
          </div>
          {selectedField && ftPos && (
            <div className="ts-float" style={{ top: ftPos.top, left: ftPos.left }}>
              <div className="ts-float-head">
                <span>문구 스타일</span>
                <button type="button" aria-label="닫기" onClick={() => setSelectedField(null)}>✕</button>
              </div>
              <TextStyleControls
                value={selFieldStyle}
                onChange={(p) => patchTextStyle(selectedField.secId, selectedField.path, p)}
                onReset={() => patchTextStyle(selectedField.secId, selectedField.path, null)}
              />
            </div>
          )}
        </div>

        {/* RIGHT: inspector */}
        <aside className="col-inspector">
          <div className="inspector-tabs">
            {(["content", "style", "layout", "anim"] as Tab[]).map((t) => (
              <button key={t} className={`insp-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t === "content" ? "내용" : t === "style" ? "스타일" : t === "layout" ? "레이아웃" : "애니메이션"}
              </button>
            ))}
          </div>

          <div className="inspector-body">
            {tab === "content" && (
              <>
                <div className="insp-group" data-fixed-group>
                  <h5>문구 스타일</h5>
                  {selectedField ? (
                    <TextStyleControls
                      value={selFieldStyle}
                      onChange={(p) => patchTextStyle(selectedField.secId, selectedField.path, p)}
                      onReset={() => patchTextStyle(selectedField.secId, selectedField.path, null)}
                    />
                  ) : (
                    <div className="ts-hint">프리뷰에서 바꾸고 싶은 문구를 클릭하면 크기·색·글꼴·굵기·기울임을 지정할 수 있어요.</div>
                  )}
                </div>
                <ContentEditors draft={draft} patch={patch} selectedId={selectedId} />
                <div className="insp-group" data-fixed-group>
                  <h5>캘린더</h5>
                  <div className="insp-field">
                    <div className="insp-label">행사 일시</div>
                    <input
                      className="insp-input"
                      type="datetime-local"
                      value={draft.eventStart ?? ""}
                      onChange={(e) => { const iso = e.target.value || undefined; setDraft((d) => syncCoverDate({ ...d, eventStart: iso }, iso)); }}
                    />
                    <div style={{ fontSize: 11, color: "var(--fg-3, #8a8a99)", marginTop: 6, lineHeight: 1.5 }}>
                      카운트다운·“캘린더에 추가”의 기준이에요. 배틀·게이밍 테마는 커버 날짜도 이 일시를 따라가요.
                    </div>
                  </div>
                </div>
                <div className="insp-group" data-fixed-group>
                  <h5>참여 인원</h5>
                  <div className="insp-field">
                    <div className="insp-label">정원 (참석 인원 제한)</div>
                    <input
                      className="insp-input"
                      type="number"
                      min={0}
                      placeholder="비우면 제한 없음 · 예: 20"
                      value={draft.capacity ?? ""}
                      onChange={(e) => { const n = parseInt(e.target.value, 10); setDraft((d) => ({ ...d, capacity: Number.isFinite(n) && n > 0 ? n : undefined })); }}
                    />
                    <div style={{ fontSize: 11, color: "var(--fg-3, #8a8a99)", marginTop: 6, lineHeight: 1.5 }}>
                      참석 인원(동반 포함)이 이 수에 도달하면 초대장에 ‘마감’이 표시되고 새 참석 응답이 막혀요.
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
                  <h5>테마</h5>
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
                  <h5>색상 팔레트</h5>
                  <div className="palette-row">
                    {PALETTES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`palette-chip${paletteActive(p) ? " active" : ""}`}
                        style={{ background: p.bg ?? "var(--card)", color: p.text ?? "var(--ink)" }}
                        onClick={() => applyPalette(p)}
                        title={p.label}
                      >
                        <span className="palette-dot" style={{ background: p.accent ?? "var(--muted)" }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    강조색·배경·글씨색을 한 번에 어울리는 조합으로 바꿔요. 아래에서 개별로 더 다듬을 수 있어요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>강조색</h5>
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
                  <h5>글씨 크기</h5>
                  <div className="radio-group">
                    {([["아주 작게", 0.85], ["작게", 0.92], ["기본", 1], ["크게", 1.12], ["아주 크게", 1.25]] as const).map(([label, n]) => (
                      <button key={label} className={`radio-btn${fontScale === n ? " active" : ""}`} onClick={() => setFontScale(n)}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    글씨만 커지고 여백·레이아웃은 그대로예요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>자간</h5>
                  <div className="radio-group">
                    {([["좁게", -0.02], ["기본", 0], ["넓게", 0.04]] as const).map(([label, n]) => (
                      <button key={label} className={`radio-btn${letterSpacing === n ? " active" : ""}`} onClick={() => setLetterSpacing(n)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="insp-group">
                  <h5>줄 간격</h5>
                  <div className="radio-group">
                    {([["좁게", 0.92], ["기본", 1], ["넓게", 1.12]] as const).map(([label, n]) => (
                      <button key={label} className={`radio-btn${lineHeight === n ? " active" : ""}`} onClick={() => setLineHeight(n)}>
                        {label}
                      </button>
                    ))}
                  </div>
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
                  <h5>배경색</h5>
                  <div className="color-row">
                    <button
                      className={`color-swatch color-swatch-none${bgColor === null ? " active" : ""}`}
                      aria-label="테마 기본색"
                      title="테마 기본색"
                      onClick={() => setBgColor(null)}
                    />
                    {BG_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch${bgColor === c ? " active" : ""}`}
                        style={{ background: c, borderColor: "var(--line)" }}
                        aria-label={c}
                        onClick={() => setBgColor(c)}
                      />
                    ))}
                    <label className="color-swatch color-swatch-custom" title="직접 고르기" style={bgColor && !BG_COLORS.includes(bgColor) ? { background: bgColor } : undefined}>
                      <input type="color" value={bgColor ?? "#FFFFFF"} onChange={(e) => setBgColor(e.target.value)} aria-label="직접 배경색 선택" />
                    </label>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    초대장 페이지 배경색이에요. 커버 사진 영역은 그대로예요.
                  </p>
                </div>
                {selSec && (
                  <div className="insp-group">
                    <h5>선택한 섹션 · {metaFor(selSec.type).label}</h5>
                    <div className="insp-label" style={{ marginBottom: 6 }}>강조색</div>
                    <div className="color-row">
                      <button className={`color-swatch color-swatch-none${!selSec.style?.accent ? " active" : ""}`} aria-label="기본" title="기본" onClick={() => setSecStyle("accent", null)} />
                      {ACCENTS.map((c) => (
                        <button key={c} className={`color-swatch${selSec.style?.accent === c ? " active" : ""}`} style={{ background: c }} aria-label={c} onClick={() => setSecStyle("accent", c)} />
                      ))}
                      <label className="color-swatch color-swatch-custom" title="직접 고르기" style={selSec.style?.accent && !ACCENTS.includes(selSec.style.accent) ? { background: selSec.style.accent } : undefined}>
                        <input type="color" value={selSec.style?.accent ?? "#E38B8B"} onChange={(e) => setSecStyle("accent", e.target.value)} aria-label="직접 강조색 선택" />
                      </label>
                    </div>
                    <div className="insp-label" style={{ margin: "12px 0 6px" }}>배경색</div>
                    <div className="color-row">
                      <button className={`color-swatch color-swatch-none${!selSec.style?.bg ? " active" : ""}`} aria-label="기본" title="기본" onClick={() => setSecStyle("bg", null)} />
                      {BG_COLORS.map((c) => (
                        <button key={c} className={`color-swatch${selSec.style?.bg === c ? " active" : ""}`} style={{ background: c, borderColor: "var(--line)" }} aria-label={c} onClick={() => setSecStyle("bg", c)} />
                      ))}
                      <label className="color-swatch color-swatch-custom" title="직접 고르기" style={selSec.style?.bg && !BG_COLORS.includes(selSec.style.bg) ? { background: selSec.style.bg } : undefined}>
                        <input type="color" value={selSec.style?.bg ?? "#FFFFFF"} onChange={(e) => setSecStyle("bg", e.target.value)} aria-label="직접 배경색 선택" />
                      </label>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                      왼쪽 목록이나 프리뷰에서 섹션을 고르면 그 섹션만 색이 바뀌어요.
                    </p>
                  </div>
                )}
                <div className="insp-group">
                  <h5>커버 배경</h5>
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
                        onClick={() => cover && patch(cover.id, coverImagePatch(draft.theme, cover.content.layout, p))}
                      />
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <PhotoUpload onUploaded={(url) => cover && patch(cover.id, coverImagePatch(draft.theme, cover.content.layout, url))} label="+ 커버 사진 업로드" />
                  </div>
                </div>
                <div className="insp-group">
                  <button type="button" className="design-reset" onClick={resetDesign} disabled={!hasCustomDesign}>
                    색상·글씨 초기화
                  </button>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, lineHeight: 1.6 }}>
                    색상·글씨 커스터마이즈를 테마 기본값으로 되돌려요. 내용·섹션·테마는 그대로예요.
                  </p>
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
                if (!resetArmed) {
                  // Arm; auto-disarm after 3s so a stray earlier click can't silently confirm later.
                  setResetArmed(true);
                  setTimeout(() => setResetArmed(false), 3000);
                  return;
                }
                // Revert to this invitation's own starting point (template/DB/blank as first loaded),
                // clearing edits + accent/font/colors — never to the romantic sample.
                const init = initialRef.current;
                if (init) {
                  setDraft(structuredClone(init.draft));
                  setSelectedId(init.draft.sections[0]?.id ?? "");
                  setTitle(init.title);
                  setHidden(new Set(init.hidden));
                }
                setResetArmed(false);
              }}
              title="내용·디자인을 처음 상태로 되돌려요"
            >
              {resetArmed ? "정말 되돌릴까요?" : "되돌리기"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                try {
                  localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent, templateDefaults } satisfies SavedEditor));
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
        invitation={visibleDraft}
        prepareData={cleanForPublish}
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
