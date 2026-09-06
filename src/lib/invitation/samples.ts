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

/** Look up by slug; falls back to the romantic sample so any demo link renders. */
export function getInvitation(slug: string): Invitation {
  return sampleInvitations[slug] ?? romanticSample;
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
  const id = `${type}-${Date.now().toString(36)}`;
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
    default:
      return { id, type: "message", content: { eyebrow: "", title: [[""]], body: [""] } };
  }
}

export function blankInvitation(theme: ThemeId = "romantic"): Invitation {
  return {
    slug: "new",
    theme,
    shareCta: "참석 여부 전하기",
    sections: [
      { id: "cover", type: "cover", content: { image: "romantic_wedding", eyebrow: "", names: ["", ""], connector: "&", dateLabel: "" } },
      { id: "message", type: "message", content: { eyebrow: "", title: [[""]], body: [""] } },
      { id: "date", type: "date", content: { eyebrow: "", title: [[""]] } },
      { id: "location", type: "location", content: { eyebrow: "", title: [[""]], body: [""], mapButtons: [] } },
      { id: "gallery", type: "gallery", content: { eyebrow: "", title: [[""]], images: [] } },
      { id: "schedule", type: "schedule", content: { eyebrow: "", title: [[""]], items: [] } },
      { id: "rsvp", type: "rsvp", content: { eyebrow: "", title: [[""]], body: [""], options: ["참석", "미정", "불참"], defaultSelected: 0 } },
      { id: "ending", type: "ending", content: { signature: "", names: "" } },
    ],
  };
}
