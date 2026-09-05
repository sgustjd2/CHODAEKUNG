/**
 * Structured invitation model (CLAUDE.md §7.1/§7.3).
 * An invitation is data — `sections[]` + theme — never authored HTML.
 * A section's `type` maps to one renderer via the section registry.
 */

/** A run of text; `em` marks emphasis (theme renders it as weight+accent, never italic). */
export type Run = { text: string; em?: boolean };
/** One line of rich text: a plain string, or a sequence of strings/runs. */
export type Line = string | (string | Run)[];

export type ThemeId =
  | "romantic"
  | "minimal"
  | "cute"
  | "editorial"
  | "developer"
  | "battle"
  | "timeline"
  | "gaming";

export type CoverContent = {
  image: string;
  eyebrow: string;
  /** Two-or-more stacked names (e.g. couple); rendered with `connector` between. */
  names?: string[];
  connector?: string;
  /** Single-title alternative to `names`. */
  title?: string;
  dateLabel: string;
  seal?: string;
  brand?: string;
};

export type MessageContent = { eyebrow: string; flourish?: string; title: Line[]; body: string[] };

export type CalendarDay = { n: number; dim?: boolean; today?: boolean };
export type CalendarData = { monthLabel: Line; weekdays: string[]; days: CalendarDay[] };
export type Countdown = { days: number; hrs: number; min: number; sec: number };
export type DateContent = {
  eyebrow: string;
  title: Line[];
  calendar?: CalendarData;
  countdown?: Countdown;
  tint?: boolean;
};

export type LocationContent = {
  eyebrow: string;
  title: Line[];
  body: string[];
  flourishIcon?: string;
  mapButtons: { label: string; primary?: boolean }[];
};

export type GalleryContent = { eyebrow: string; title: Line[]; images: { src: string; tall?: boolean }[] };

export type ScheduleContent = {
  eyebrow: string;
  title: Line[];
  items: { time: string; title: string; desc: string }[];
};

export type RsvpContent = {
  eyebrow: string;
  title: Line[];
  body: string[];
  options: string[];
  defaultSelected?: number;
  tint?: boolean;
};

export type EndingContent = { flourish?: string; signature: string; names: string };

export type Section =
  | { id: string; type: "cover"; content: CoverContent }
  | { id: string; type: "message"; content: MessageContent }
  | { id: string; type: "date"; content: DateContent }
  | { id: string; type: "location"; content: LocationContent }
  | { id: string; type: "gallery"; content: GalleryContent }
  | { id: string; type: "schedule"; content: ScheduleContent }
  | { id: string; type: "rsvp"; content: RsvpContent }
  | { id: string; type: "ending"; content: EndingContent };

export type SectionType = Section["type"];

export type Invitation = {
  slug: string;
  theme: ThemeId;
  /** Used for share/OG and the share-pill CTA. */
  shareCta: string;
  sections: Section[];
};
