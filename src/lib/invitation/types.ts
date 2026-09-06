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

/** Cover arrangement. `theme` (default) uses each theme's own cover renderer;
 * the rest use a shared, theme-tokenized GenericCover in the named layout. */
export type CoverLayout = "theme" | "photo-bottom" | "photo-center" | "split" | "text";

export type CoverContent = {
  image: string;
  eyebrow: string;
  /** Cover layout variant (undefined = theme default). */
  layout?: CoverLayout;
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
  /** Multi-line subtitle (timeline). */
  subtitleLines?: string[];
  /** Pill badges under the cover (timeline). */
  badges?: { label: string; icon?: string; variant?: "wax" | "sage" | "sky" | "gold" }[];
  /** Cover gradient variant (timeline: housewarming/flash/mt). */
  bg?: "hw" | "fl" | "mt";
  /** CSS filter for the cover photo (gaming scenario tints). */
  imgFilter?: string;
  /** Mascot sprite id shown on the cover (cute: momo-party). */
  mascot?: string;
  /** Split cover footer (editorial): left serif label + right latin meta. */
  coverSub?: { l: string; r: string };
  /** Command author for `$ moi --invite --from=X` (developer). */
  from?: string;
  /** JSON summary rows (developer); `t` colors the value. */
  json?: { k: string; v: string; t?: "str" | "num" | "bool" | "date" }[];
};

export type MessageContent = {
  eyebrow: string;
  flourish?: string;
  title: Line[];
  body: Line[];
  /** Magazine section number, e.g. "01" (editorial). */
  num?: string;
  /** Drop-cap first character (editorial). */
  dropCap?: string;
  /** Render body as two columns (editorial). */
  twoCol?: boolean;
};

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
  /** Dark date pill (cute), e.g. {en:"D-42", text:"· 남았어요"}. */
  pill?: { en: string; text: string };
  /** Sub-label under the big date (developer: "SUN · 19:00 KST"). */
  subLabel?: string;
  tint?: boolean;
};

export type LocationContent = {
  eyebrow: string;
  title: Line[];
  body: Line[];
  flourishIcon?: string;
  mapButtons: { label: string; primary?: boolean }[];
  /** Cover/detail photo shown above the address (cute). */
  photo?: string;
  /** Structured address block (cute): title line + detail line. */
  address?: { t: string; a: string };
  /** Magazine section number (editorial). */
  num?: string;
  /** Photo caption strip (editorial): left + right. */
  photoCap?: { l: string; r: string };
  /** Key/value output rows (developer): venue/addr/floor/lat/lng. */
  rows?: Kv[];
  tint?: boolean;
};

export type GalleryContent = {
  eyebrow: string;
  title: Line[];
  images: { src: string; tall?: boolean }[];
  /** Magazine section number (editorial). */
  num?: string;
  /** Gallery caption strip (editorial): left + right. */
  caption?: { l: string; r: string };
};

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
  /** Magazine section number (editorial). */
  num?: string;
  /** Title inside the dark RSVP box, e.g. "Will you join us?" (editorial). */
  innerTitle?: Line[];
  /** Seats progress bar (developer): filled of total. */
  progress?: { filled: number; total: number };
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
  /** Signature with emphasis (timeline: accent word). */
  signatureLines?: Line[];
  /** Magazine colophon lines under the oversized closing (editorial). */
  colophon?: Line[];
};

/* ---- Timeline / schedule-sharing section content ---- */
export type TimelineItem = {
  time: string;
  unit?: string;
  title: string;
  desc: string;
  tags?: { label: string; variant?: "sage" | "sky" | "gold" }[];
  state?: "done" | "now";
};
export type Kv = { k: string; v: string; u?: string };
export type DetailsContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  /** Magazine section number (editorial). */
  num?: string;
  info: Kv[];
  party?: { avatars: { label: string; tone?: number }[]; more?: string; countLabel: string; countSub: string };
};
export type TimelineSectionContent = { eyebrow: string; title: Line[]; tint?: boolean; items: TimelineItem[] };
export type MenuContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  cards: { cat: string; count: string; heading: string; items: { name: string; meta: string }[] }[];
};
export type ChecklistContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  items: { text: string; owner: string; checked?: boolean }[];
};
export type CostContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  costEb: string;
  total: string;
  split: Line;
  info?: Kv[];
};
export type RouteContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  stops: { icon: string; title: string; meta: string; time: string; accent?: boolean }[];
};
export type DayPlanContent = {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  days: { label: string; en: string; items: TimelineItem[] }[];
};

/* ---- Editorial (magazine party) section content ---- */
export type QuoteContent = { text: Line[] };

/* ---- Cute (housewarming/birthday/baby) section content ---- */
export type NoticeContent = {
  eyebrow: string;
  title: Line[];
  items: { icon: string; tone?: "ink" | "rose" | "sage" | "lav"; t: string; d: string }[];
};

/* ---- Gaming (LoL party) section content ---- */
export type GInfoContent = { eyebrow: string; title: Line[]; cells: Kv[] };
export type Lane = "top" | "jgl" | "mid" | "adc" | "sup";
export type LanesContent = {
  eyebrow: string;
  title: Line[];
  players: { lane: Lane; laneLabel: string; name: string; summoner: string; tier: string; tierClass?: string; open?: boolean }[];
};
export type TierChartContent = { eyebrow: string; title: Line[]; cols: { t: string; n: string }[] };
export type ChampionsContent = { eyebrow: string; title: Line[]; items: { icon: string; lane: string; picked?: boolean }[] };

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
export type CountdownContent = {
  label: string;
  cells: { n: string; l: string; warn?: boolean }[];
  /** Optional section header (gaming wraps countdown in a titled section). */
  eyebrow?: string;
  title?: Line[];
};
export type RulesContent = {
  title: string;
  rules: { t: string; d: string }[];
  prize?: { eb: string; name: string; sub: string };
  /** Optional titled-section header (gaming). */
  eyebrow?: string;
  titleLine?: Line[];
};
export type RosterContent = {
  groups: { title: string; players: { num: string; name: string; role: string; badge?: string }[] }[];
};
export type AcceptContent = { title: Line[]; sub: string; accept: string; decline: string };

/** Live D-Day countdown to the invitation's eventStart (target injected by the viewer). */
export type DdayContent = { eyebrow?: string; title?: Line[] };

/** "마음 전하기" — gift/congratulatory bank accounts with copy-to-clipboard (Korean invitations). */
export type AccountContent = {
  eyebrow?: string;
  title?: Line[];
  note?: string;
  accounts: { side?: string; bank: string; number: string; holder: string }[];
};

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
  | { id: string; type: "details"; content: DetailsContent }
  | { id: string; type: "timeline"; content: TimelineSectionContent }
  | { id: string; type: "menu"; content: MenuContent }
  | { id: string; type: "checklist"; content: ChecklistContent }
  | { id: string; type: "cost"; content: CostContent }
  | { id: string; type: "route"; content: RouteContent }
  | { id: string; type: "dayPlan"; content: DayPlanContent }
  | { id: string; type: "gInfo"; content: GInfoContent }
  | { id: string; type: "lanes"; content: LanesContent }
  | { id: string; type: "tierChart"; content: TierChartContent }
  | { id: string; type: "champions"; content: ChampionsContent }
  | { id: string; type: "notice"; content: NoticeContent }
  | { id: string; type: "quote"; content: QuoteContent }
  | { id: string; type: "account"; content: AccountContent }
  | { id: string; type: "dday"; content: DdayContent }
  | { id: string; type: "ending"; content: EndingContent };

export type SectionType = Section["type"];

/** Section reveal-on-scroll animation for the public viewer (CLAUDE.md §4.4). */
export type RevealAnim = "none" | "fade" | "fade-up" | "slide" | "zoom" | "blur" | "scale";

/**
 * Theme-agnostic layout of the shared invitation frame (not per-theme section CSS).
 * `width` = the invitation column width on wide screens; `background` = the backdrop
 * framing it. Applied on the public/preview page (the mobile editor frame is full-bleed).
 */
export type LayoutConfig = {
  width?: "narrow" | "normal" | "wide";
  background?: "soft" | "solid" | "none";
};

export type Invitation = {
  slug: string;
  theme: ThemeId;
  /** Used for share/OG and the share-pill CTA. */
  shareCta: string;
  /** Reveal animation played as each section scrolls into view (public page only). */
  reveal?: RevealAnim;
  /** Shared-frame layout (width + backdrop); does not touch per-theme section styling. */
  layout?: LayoutConfig;
  /** Canonical event start for "add to calendar" — ISO `YYYY-MM-DD` (all-day) or `YYYY-MM-DDTHH:mm`.
   * Separate from the cover's decorative dateLabel, which is styled free text. */
  eventStart?: string;
  sections: Section[];
};
