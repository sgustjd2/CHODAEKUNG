import type { Line, SectionType, ThemeId } from "@/lib/invitation/types";

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
export const ACCENTS = ["#E38B8B", "#C96A6A", "#B5CAB2", "#A0A8B8", "#F5D896", "#2A2A3E"];
export const THEME_PRESETS: { id: ThemeId; label: string; enabled: boolean }[] = [
  { id: "romantic", label: "Romantic", enabled: true },
  { id: "minimal", label: "Minimal", enabled: true },
  { id: "editorial", label: "Editorial", enabled: false },
  { id: "cute", label: "Cute", enabled: false },
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
