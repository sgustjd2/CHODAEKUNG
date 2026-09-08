import type { CoverLayout, Invitation, Line, RevealAnim, Section, SectionType, ThemeId } from "@/lib/invitation/types";

/** Shared editor constants + helpers used by both the desktop and mobile layouts. */

/** Format an ISO datetime (or bare date) into the battle/gaming cover header's two lines:
 *  ["YYYY · MM · DD", "WKD · hh:mm AM/PM"]. */
export function coverDateLines(iso: string): [string, string] {
  const [datePart, timePart] = iso.split("T");
  const [y, mo, dd] = datePart.split("-");
  const d = new Date(iso.includes("T") ? iso : `${iso}T00:00`);
  const wd = Number.isNaN(d.getTime()) ? "" : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
  let timeLine = "";
  if (timePart) {
    const [hh, mm] = timePart.split(":").map(Number);
    const h12 = ((hh + 11) % 12) + 1;
    timeLine = `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
  }
  return [`${y} · ${mo} · ${dd}`, [wd, timeLine].filter(Boolean).join(" · ")];
}

/** Mirror the event datetime onto the cover for themes that show it on the cover header
 *  (battle/gaming `headerRightLines`); other covers keep their own date fields untouched. */
export function syncCoverDate(inv: Invitation, iso?: string): Invitation {
  if (!iso?.trim()) return inv;
  const lines = coverDateLines(iso);
  return {
    ...inv,
    sections: inv.sections.map((s: Section) => {
      if (s.type !== "cover") return s;
      const c = s.content;
      return Array.isArray(c.headerRightLines) ? { ...s, content: { ...c, headerRightLines: lines } } : s;
    }),
  };
}

export const SECTION_META: Partial<Record<SectionType, { label: string; icon: string }>> = {
  cover: { label: "커버", icon: "ic-cover" },
  message: { label: "초대 문구", icon: "ic-message" },
  date: { label: "날짜 · 시간", icon: "ic-clock" },
  location: { label: "장소", icon: "ic-pin" },
  gallery: { label: "갤러리", icon: "ic-grid" },
  schedule: { label: "일정", icon: "ic-clock" },
  rsvp: { label: "RSVP", icon: "ic-heart" },
  ending: { label: "엔딩", icon: "ic-flower" },
  details: { label: "상세", icon: "ic-info" },
  timeline: { label: "타임라인", icon: "ic-clock" },
  menu: { label: "메뉴", icon: "ic-food" },
  checklist: { label: "체크리스트", icon: "ic-check" },
  cost: { label: "비용", icon: "ic-info" },
  route: { label: "이동 경로", icon: "ic-pin" },
  dayPlan: { label: "일별 일정", icon: "ic-clock" },
  versus: { label: "매치업", icon: "ic-swords" },
  matchInfo: { label: "경기 정보", icon: "ic-info" },
  countdown: { label: "카운트다운", icon: "ic-clock" },
  rules: { label: "규칙", icon: "ic-info" },
  roster: { label: "명단", icon: "ic-users" },
  accept: { label: "참석 응답", icon: "ic-heart" },
  notice: { label: "안내", icon: "ic-info" },
  quote: { label: "인용", icon: "ic-message" },
  gInfo: { label: "매치 정보", icon: "ic-info" },
  lanes: { label: "라인업", icon: "ic-users" },
  tierChart: { label: "티어 분포", icon: "ic-grid" },
  champions: { label: "챔피언", icon: "ic-grid" },
  account: { label: "마음 전하기", icon: "ic-heart" },
  dday: { label: "D-Day 카운트다운", icon: "ic-clock" },
  guestbook: { label: "방명록", icon: "ic-message" },
  attendees: { label: "참석자 명단", icon: "ic-users" },
};
export const metaFor = (t: SectionType) => SECTION_META[t] ?? { label: t, icon: "ic-info" };

export const COVER_PHOTOS = ["romantic_wedding", "wedding_gallery_2", "hero_flatlay", "minimal_birthday"];

/** Cover background presets tailored to each theme/event category. */
export const COVER_PHOTOS_BY_THEME: Record<ThemeId, string[]> = {
  romantic: ["romantic_wedding", "wedding_gallery_1", "wedding_gallery_2", "hero_flatlay"],
  minimal: ["minimal_birthday", "tmpl_doljanchi", "tmpl_bridalshower", "hero_flatlay"],
  cute: ["cute_housewarming", "tmpl_doljanchi", "tmpl_pet", "minimal_birthday"],
  editorial: ["editorial_party", "tmpl_yearend", "tmpl_bridalshower", "tmpl_seminar"],
  timeline: ["timeline_gathering", "tmpl_camping", "tmpl_travel", "tmpl_hiking"],
  battle: ["battle_sports", "tmpl_badminton", "tmpl_baseball", "tmpl_tennis"],
  gaming: ["game_lol_rank", "game_valorant", "game_overwatch", "developer_terminal"],
  developer: ["developer_terminal", "tmpl_gaming", "tmpl_seminar", "tmpl_study"],
};
/** Cover presets for a theme, falling back to the default set. */
export function coverPhotosFor(theme: ThemeId): string[] {
  return COVER_PHOTOS_BY_THEME[theme] ?? COVER_PHOTOS;
}
export const ACCENTS = ["#E38B8B", "#C96A6A", "#E29F76", "#D9B96A", "#F5D896", "#8AA588", "#B5CAB2", "#8AB2C6", "#A0A8B8", "#B097CC", "#C97AA0", "#2A2A3E"];

/** Text-color presets for the invitation body (--ink override). Dark, readable inks. */
export const TEXT_COLORS = ["#2A2A3E", "#1A1A1A", "#3A2E2E", "#2E3A34", "#4A4A5E"];

/** Background-color presets for the invitation page (--iv-bg override). Soft light tints. */
export const BG_COLORS = ["#FFFFFF", "#FDF8F2", "#FCE0DC", "#F1F5F0", "#EEF4F8", "#F3F0F7"];

/** One-click color palettes: a harmonious accent + background + text combo applied together,
 * so a non-designer gets a coherent look without hand-picking each. `null` = theme default. */
export const PALETTES: { id: string; label: string; accent: string | null; bg: string | null; text: string | null }[] = [
  { id: "default", label: "기본", accent: null, bg: null, text: null },
  { id: "blush", label: "블러시", accent: "#E38B8B", bg: "#FDF8F2", text: "#3A2E2E" },
  { id: "peach", label: "피치", accent: "#E29F76", bg: "#FCE7D5", text: "#3A2E2E" },
  { id: "sage", label: "세이지", accent: "#8AA588", bg: "#F1F5F0", text: "#2E3A34" },
  { id: "sky", label: "스카이", accent: "#8AB2C6", bg: "#EEF4F8", text: "#25323A" },
  { id: "lilac", label: "라일락", accent: "#B097CC", bg: "#F3F0F7", text: "#2E2838" },
  { id: "gold", label: "골드", accent: "#D9B96A", bg: "#FFFDF5", text: "#2A2A3E" },
  { id: "mono", label: "모노", accent: "#2A2A3E", bg: "#F5F3F0", text: "#1A1A1A" },
];

// Font registry lives in lib (shared with the viewer without pulling editor code into its bundle).
export { FONTS, fontById, googleFontHref } from "@/lib/invitation/fonts";
export const THEME_PRESETS: { id: ThemeId; label: string; enabled: boolean }[] = [
  { id: "romantic", label: "Romantic", enabled: true },
  { id: "minimal", label: "Minimal", enabled: true },
  { id: "cute", label: "Cute", enabled: true },
  { id: "editorial", label: "Editorial", enabled: true },
  { id: "timeline", label: "Timeline", enabled: true },
  { id: "battle", label: "Battle", enabled: true },
  { id: "gaming", label: "Gaming", enabled: true },
  { id: "developer", label: "Developer", enabled: true },
];

/** Cover layout variants offered in the editor. `theme` keeps the theme's own cover. */
export const COVER_LAYOUTS: { id: CoverLayout; label: string }[] = [
  { id: "theme", label: "테마 기본" },
  { id: "photo-bottom", label: "클래식" },
  { id: "photo-center", label: "히어로" },
  { id: "split", label: "스플릿" },
  { id: "text", label: "미니멀" },
];

export const REVEALS: { id: RevealAnim; label: string }[] = [
  { id: "none", label: "없음" },
  { id: "fade", label: "Fade" },
  { id: "fade-up", label: "Fade Up" },
  { id: "slide", label: "Slide" },
  { id: "zoom", label: "Zoom" },
  { id: "blur", label: "Blur Reveal" },
  { id: "scale", label: "Scale Reveal" },
];

/** Event types → the representative template (sample) the editor re-applies when the user switches. */
export const EVENT_TEMPLATES: { label: string; slug: string }[] = [
  { label: "웨딩", slug: "jisoo-minjun" },
  { label: "생일·돌", slug: "appa-60" },
  { label: "집들이", slug: "cozy-home" },
  { label: "파티", slug: "after-hours" },
  { label: "모임·MT", slug: "jibdeuli" },
  { label: "스포츠", slug: "jogi-battle" },
  { label: "게이밍", slug: "lol-quick" },
  { label: "개발자", slug: "dev-meetup" },
];

export type Mode = "scroll" | "story" | "magazine";

// --- Line[] <-> plain text helpers (edits lose emphasis; acceptable for the first cut) ---
export function linesToText(lines: Line[]): string {
  return lines
    .map((l) => (typeof l === "string" ? l : l.map((r) => (typeof r === "string" ? r : r.text)).join("")))
    .join("\n");
}
export function textToLines(text: string): string[] {
  return text.split("\n");
}
export function plainTitle(title: Line[]): string {
  return linesToText(title).replace(/\n/g, " ");
}
