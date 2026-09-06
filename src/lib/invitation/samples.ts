import type { Invitation, Section, SectionType, ThemeId } from "./types";
import { romanticSample } from "./sample-romantic";
import { minimalSample } from "./sample-minimal";
import { cuteSample } from "./sample-cute";
import { editorialSample } from "./sample-editorial";
import { developerSample } from "./sample-developer";
import { battleSample } from "./sample-battle";
import { timelineSamples } from "./sample-timeline";
import { gamingSamples } from "./sample-gaming";

/** Placeholder store until a real data layer exists. */
export const sampleInvitations: Record<string, Invitation> = {
  [romanticSample.slug]: romanticSample,
  [minimalSample.slug]: minimalSample,
  [cuteSample.slug]: cuteSample,
  [editorialSample.slug]: editorialSample,
  [developerSample.slug]: developerSample,
  [battleSample.slug]: battleSample,
  ...Object.fromEntries(timelineSamples.map((s) => [s.slug, s])),
  ...Object.fromEntries(gamingSamples.map((s) => [s.slug, s])),
};

/** Look up by slug; falls back to the romantic sample so any demo link renders.
 * Used by the editor for template/slug seeding (always wants *something*). */
export function getInvitation(slug: string): Invitation {
  return sampleInvitations[slug] ?? romanticSample;
}

/** Strict lookup: a curated sample, or null. Used by the public viewer so an
 * unknown slug is a real 404 instead of silently showing the romantic sample. */
export function getSampleOrNull(slug: string): Invitation | null {
  return sampleInvitations[slug] ?? null;
}

/**
 * A blank invitation for the "new" flow — the standard section skeleton with
 * empty text, so a new invitation opens ready to fill (not pre-filled with a
 * sample). Cover keeps a neutral default photo so the hero isn't broken; RSVP
 * keeps the standard 참석/미정/불참 choices since those are functional, not text
 * the user has to delete.
 */
/** A single empty section of the given type, for the editor's "add section" picker. */
export function blankSection(type: SectionType): Section {
  const id = `${type}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  switch (type) {
    case "cover":
      return { id, type, content: { image: "romantic_wedding", eyebrow: "", names: ["", ""], connector: "&", dateLabel: "" } };
    case "date":
      return { id, type, content: { eyebrow: "", title: [[""]] } };
    case "location":
      return { id, type, content: { eyebrow: "", title: [[""]], body: [""], mapButtons: [] } };
    case "gallery":
      return { id, type, content: { eyebrow: "", title: [[""]], images: [] } };
    case "schedule":
      return { id, type, content: { eyebrow: "", title: [[""]], items: [] } };
    case "rsvp":
      return { id, type, content: { eyebrow: "", title: [[""]], body: [""], options: ["참석", "미정", "불참"], defaultSelected: 0 } };
    case "ending":
      return { id, type, content: { signature: "", names: "" } };
    // --- theme-specific section types (blank shells; user fills the rows) ---
    case "details":
      return { id, type, content: { eyebrow: "", title: [[""]], info: [] } };
    case "timeline":
      return { id, type, content: { eyebrow: "", title: [[""]], items: [] } };
    case "menu":
      return { id, type, content: { eyebrow: "", title: [[""]], cards: [] } };
    case "checklist":
      return { id, type, content: { eyebrow: "", title: [[""]], items: [] } };
    case "cost":
      return { id, type, content: { eyebrow: "", title: [[""]], costEb: "", total: "", split: "" } };
    case "route":
      return { id, type, content: { eyebrow: "", title: [[""]], stops: [] } };
    case "dayPlan":
      return { id, type, content: { eyebrow: "", title: [[""]], days: [] } };
    case "quote":
      return { id, type, content: { text: [[""]] } };
    case "notice":
      return { id, type, content: { eyebrow: "", title: [[""]], items: [] } };
    case "versus":
      return { id, type, content: { eyebrow: "", title: [[""]], home: { flag: "", name: "", meta: "" }, away: { flag: "", name: "", meta: "" } } };
    case "matchInfo":
      return { id, type, content: { title: "", cells: [] } };
    case "countdown":
      return { id, type, content: { label: "", cells: [] } };
    case "rules":
      return { id, type, content: { title: "", rules: [] } };
    case "roster":
      return { id, type, content: { groups: [] } };
    case "accept":
      return { id, type, content: { title: [[""]], sub: "", accept: "참석", decline: "불참" } };
    case "gInfo":
      return { id, type, content: { eyebrow: "", title: [[""]], cells: [] } };
    case "lanes":
      return { id, type, content: { eyebrow: "", title: [[""]], players: [] } };
    case "tierChart":
      return { id, type, content: { eyebrow: "", title: [[""]], cols: [] } };
    case "champions":
      return { id, type, content: { eyebrow: "", title: [[""]], items: [] } };
    case "account":
      return { id, type, content: { eyebrow: "", title: [[""]], note: "", accounts: [] } };
    default:
      return { id, type: "message", content: { eyebrow: "", title: [[""]], body: [""] } };
  }
}

/** A sensible starter section flow per theme (only types that theme actually renders). */
const THEME_DEFAULT_SECTIONS: Record<ThemeId, SectionType[]> = {
  romantic: ["cover", "message", "date", "location", "gallery", "schedule", "rsvp", "ending"],
  minimal: ["cover", "message", "date", "location", "gallery", "rsvp", "ending"],
  cute: ["cover", "date", "location", "notice", "gallery", "rsvp", "ending"],
  editorial: ["cover", "message", "details", "location", "gallery", "rsvp", "ending"],
  timeline: ["cover", "details", "timeline", "location", "accept", "ending"],
  battle: ["cover", "versus", "matchInfo", "countdown", "location", "accept", "ending"],
  gaming: ["cover", "gInfo", "countdown", "lanes", "location", "accept", "ending"],
  developer: ["cover", "date", "location", "schedule", "rsvp", "ending"],
};
/** A theme-appropriate default cover photo (bundled asset id). */
const THEME_COVER: Record<ThemeId, string> = {
  romantic: "romantic_wedding",
  minimal: "minimal_birthday",
  cute: "cute_housewarming",
  editorial: "editorial_party",
  timeline: "timeline_gathering",
  battle: "battle_sports",
  gaming: "game_lol_rank",
  developer: "developer_terminal",
};

/**
 * A blank invitation for the "new" flow — the theme's natural section set with empty text,
 * so a new invitation opens ready to fill (not pre-filled with a sample) and matches the
 * chosen theme (its own sections + a theme-appropriate cover photo).
 */
export function blankInvitation(theme: ThemeId = "romantic"): Invitation {
  const types = THEME_DEFAULT_SECTIONS[theme] ?? THEME_DEFAULT_SECTIONS.romantic;
  const sections = types.map((t) => blankSection(t));
  const cover = sections.find((s) => s.type === "cover");
  if (cover && cover.type === "cover") cover.content.image = THEME_COVER[theme] ?? "romantic_wedding";
  return { slug: "new", theme, shareCta: "참석 여부 전하기", sections };
}
