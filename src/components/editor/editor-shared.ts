import type { CoverLayout, Line, RevealAnim, SectionType, ThemeId } from "@/lib/invitation/types";

/** Shared editor constants + helpers used by both the desktop and mobile layouts. */

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
export const ACCENTS = ["#E38B8B", "#C96A6A", "#B5CAB2", "#A0A8B8", "#F5D896", "#2A2A3E"];
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

/** Section types offered by the editor's "add section" picker (filtered by theme support at use). */
export const ADDABLE_SECTIONS: SectionType[] = ["message", "date", "location", "gallery", "schedule", "rsvp", "ending"];

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
