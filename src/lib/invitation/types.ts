/**
 * Structured invitation model (CLAUDE.md §7.1/§7.3).
 * An invitation is data — `sections[]` + theme — never authored HTML.
 * A section's `type` maps to one renderer per theme via the theme registry.
 *
 * Content carries semantic facts as a superset; each theme's renderer reads the
 * subset it presents (§7.1: same data, multiple views). Themes differ structurally
 * (romantic uses a calendar; minimal uses a data grid), so renderers are per-theme.
 */

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
  /** Couple/stacked names, rendered with `connector` between (romantic). */
  names?: string[];
  connector?: string;
  /** Single title, or stacked title lines (minimal). */
  title?: string;
  titleLines?: Line[];
  subtitle?: string;
  dateLabel?: string;
  seal?: string;
  brand?: string;
  /** Swiss-grid header corners (minimal). */
  headerLeft?: string;
  headerRight?: string;
  /** Multi-line header corner, e.g. battle date tag. */
  headerRightLines?: string[];
};

export type MessageContent = { eyebrow: string; flourish?: string; title: Line[]; body: Line[] };

export type CalendarDay = { n: number; dim?: boolean; today?: boolean };
export type CalendarData = { monthLabel: Line; weekdays: string[]; days: CalendarDay[] };
export type Countdown = { days: number; hrs: number; min: number; sec: number };
export type DateContent = {
  eyebrow: string;
  title: Line[];
  calendar?: CalendarData;
  countdown?: Countdown;
  /** Big two-part date, e.g. ["06","15"] → 06.15 (minimal). */
  bigDate?: [string, string];
  /** Editorial key/value grid (minimal); `en` renders in the latin/numeric face. */
  dataGrid?: { k: string; en?: string; v?: string }[];
  tint?: boolean;
};

export type LocationContent = {
  eyebrow: string;
  title: Line[];
  body: Line[];
  flourishIcon?: string;
  mapButtons: { label: string; primary?: boolean }[];
};

export type GalleryContent = { eyebrow: string; title: Line[]; images: { src: string; tall?: boolean }[] };

export type ScheduleContent = {
  eyebrow: string;
  title: Line[];
  items: { time: string; title: string; desc: string; duration?: string }[];
};

export type RsvpContent = {
  eyebrow: string;
  title: Line[];
  body: Line[];
  options: string[];
  /** Parallel sub-labels for each option (minimal: Attend/Maybe/Decline). */
  optionSubs?: string[];
  defaultSelected?: number;
  tint?: boolean;
};

export type EndingContent = {
  flourish?: string;
  signature?: string;
  names?: string;
  /** Oversized closing word(s), e.g. THANK YOU. (minimal). */
  huge?: Line[];
  below?: string;
  /** Rotated stamp label, e.g. "Challenge Sealed" (battle). */
  stamp?: string;
};

/* ---- Battle / competitive section content ---- */
export type Team = {
  flag: string;
  name: string;
  meta: string;
  record?: { w: string; d: string; l: string };
};
export type VersusContent = { eyebrow: string; title: Line[]; home: Team; away: Team; vsWord?: string };
/** Editorial 2×2 match info; each value is unitized parts (`u` = small suffix face). */
export type MatchInfoContent = { title: string; cells: { k: string; v: { t: string; u?: boolean }[] }[] };
export type CountdownContent = { label: string; cells: { n: string; l: string; warn?: boolean }[] };
export type RulesContent = {
  title: string;
  rules: { t: string; d: string }[];
  prize?: { eb: string; name: string; sub: string };
};
export type RosterContent = {
  groups: { title: string; players: { num: string; name: string; role: string; badge?: string }[] }[];
};
export type AcceptContent = { title: Line[]; sub: string; accept: string; decline: string };

export type Section =
  | { id: string; type: "cover"; content: CoverContent }
  | { id: string; type: "message"; content: MessageContent }
  | { id: string; type: "date"; content: DateContent }
  | { id: string; type: "location"; content: LocationContent }
  | { id: string; type: "gallery"; content: GalleryContent }
  | { id: string; type: "schedule"; content: ScheduleContent }
  | { id: string; type: "rsvp"; content: RsvpContent }
  | { id: string; type: "versus"; content: VersusContent }
  | { id: string; type: "matchInfo"; content: MatchInfoContent }
  | { id: string; type: "countdown"; content: CountdownContent }
  | { id: string; type: "rules"; content: RulesContent }
  | { id: string; type: "roster"; content: RosterContent }
  | { id: string; type: "accept"; content: AcceptContent }
  | { id: string; type: "ending"; content: EndingContent };

export type SectionType = Section["type"];

export type Invitation = {
  slug: string;
  theme: ThemeId;
  /** Used for share/OG and the share-pill CTA. */
  shareCta: string;
  sections: Section[];
};
