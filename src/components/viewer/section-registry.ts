import type { ComponentType } from "react";
import type { Section, SectionType, ThemeId } from "@/lib/invitation/types";

// Romantic renderers
import { CoverSection } from "./sections/cover";
import { MessageSection } from "./sections/message";
import { DateSection } from "./sections/date";
import { LocationSection } from "./sections/location";
import { GallerySection } from "./sections/gallery";
import { ScheduleSection } from "./sections/schedule";
import { RsvpSection } from "./sections/rsvp";
import { EndingSection } from "./sections/ending";

// Minimal renderers
import { MinimalCover } from "./sections/minimal/cover";
import { MinimalMessage } from "./sections/minimal/message";
import { MinimalDate } from "./sections/minimal/date";
import { MinimalLocation } from "./sections/minimal/location";
import { MinimalGallery } from "./sections/minimal/gallery";
import { MinimalSchedule } from "./sections/minimal/schedule";
import { MinimalRsvp } from "./sections/minimal/rsvp";
import { MinimalEnding } from "./sections/minimal/ending";

// Battle renderers
import { BattleCover } from "./sections/battle/cover";
import { BattleVersus } from "./sections/battle/versus";
import { BattleMatchInfo } from "./sections/battle/match-info";
import { BattleCountdown } from "./sections/battle/countdown";
import { BattleRules } from "./sections/battle/rules";
import { BattleLocation } from "./sections/battle/location";
import { BattleRoster } from "./sections/battle/roster";
import { BattleAccept } from "./sections/battle/accept";
import { BattleEnding } from "./sections/battle/ending";

// Timeline renderers
import { TimelineCover } from "./sections/timeline/cover";
import { TimelineDetails } from "./sections/timeline/details";
import { TimelineSchedule } from "./sections/timeline/timeline";
import { TimelineMenu } from "./sections/timeline/menu";
import { TimelineChecklist } from "./sections/timeline/checklist";
import { TimelineCost } from "./sections/timeline/cost";
import { TimelineLocation } from "./sections/timeline/location";
import { TimelineCta } from "./sections/timeline/cta";
import { TimelineEnding } from "./sections/timeline/ending";
import { TimelineRoute } from "./sections/timeline/route";
import { TimelineDayPlan } from "./sections/timeline/dayplan";

// Cute renderers
import { CuteCover } from "./sections/cute/cover";
import { CuteDate } from "./sections/cute/date";
import { CuteLocation } from "./sections/cute/location";
import { CuteNotice } from "./sections/cute/notice";
import { CuteGallery } from "./sections/cute/gallery";
import { CuteRsvp } from "./sections/cute/rsvp";
import { CuteEnding } from "./sections/cute/ending";

// Editorial renderers
import { EditorialCover } from "./sections/editorial/cover";
import { EditorialArticle } from "./sections/editorial/article";
import { EditorialDetails } from "./sections/editorial/details";
import { EditorialLocation } from "./sections/editorial/location";
import { EditorialQuote } from "./sections/editorial/quote";
import { EditorialGallery } from "./sections/editorial/gallery";
import { EditorialRsvp } from "./sections/editorial/rsvp";
import { EditorialEnding } from "./sections/editorial/ending";

// Developer renderers
import { DevCover } from "./sections/developer/cover";
import { DevDate } from "./sections/developer/date";
import { DevLocation } from "./sections/developer/location";
import { DevSchedule } from "./sections/developer/schedule";
import { DevGallery } from "./sections/developer/gallery";
import { DevRsvp } from "./sections/developer/rsvp";
import { DevEnding } from "./sections/developer/ending";

// Shared (theme-agnostic) renderers
import { AccountSection } from "./sections/account";
import { DdaySection } from "./sections/dday";

// Gaming renderers
import { GamingCover } from "./sections/gaming/cover";
import { GamingInfo } from "./sections/gaming/info";
import { GamingLocation } from "./sections/gaming/location";
import { GamingCountdown } from "./sections/gaming/countdown";
import { GamingLanes } from "./sections/gaming/lanes";
import { GamingRules } from "./sections/gaming/rules";
import { GamingTierChart } from "./sections/gaming/tierchart";
import { GamingChampions } from "./sections/gaming/champions";
import { GamingCta } from "./sections/gaming/cta";
import { GamingEnding } from "./sections/gaming/ending";

type Renderer<T extends SectionType> = ComponentType<{
  content: Extract<Section, { type: T }>["content"];
  index?: number;
}>;
/** A theme renders a SUBSET of section types (themes differ structurally). */
type ThemeSet = Partial<{ [T in SectionType]: Renderer<T> }>;

/**
 * theme → (section.type → renderer). Each theme ships its own renderer set
 * (CLAUDE.md §7.3, applied per theme). Add a theme = add a set.
 */
const romantic: ThemeSet = {
  cover: CoverSection,
  message: MessageSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  schedule: ScheduleSection,
  rsvp: RsvpSection,
  ending: EndingSection,
};

const minimal: ThemeSet = {
  cover: MinimalCover,
  message: MinimalMessage,
  date: MinimalDate,
  location: MinimalLocation,
  gallery: MinimalGallery,
  schedule: MinimalSchedule,
  rsvp: MinimalRsvp,
  ending: MinimalEnding,
};

const battle: ThemeSet = {
  cover: BattleCover,
  versus: BattleVersus,
  matchInfo: BattleMatchInfo,
  countdown: BattleCountdown,
  rules: BattleRules,
  location: BattleLocation,
  roster: BattleRoster,
  accept: BattleAccept,
  ending: BattleEnding,
};

const timeline: ThemeSet = {
  cover: TimelineCover,
  details: TimelineDetails,
  timeline: TimelineSchedule,
  menu: TimelineMenu,
  checklist: TimelineChecklist,
  cost: TimelineCost,
  location: TimelineLocation,
  accept: TimelineCta,
  route: TimelineRoute,
  dayPlan: TimelineDayPlan,
  ending: TimelineEnding,
};

const cute: ThemeSet = {
  cover: CuteCover,
  date: CuteDate,
  location: CuteLocation,
  notice: CuteNotice,
  gallery: CuteGallery,
  rsvp: CuteRsvp,
  ending: CuteEnding,
};

const editorial: ThemeSet = {
  cover: EditorialCover,
  message: EditorialArticle,
  details: EditorialDetails,
  location: EditorialLocation,
  quote: EditorialQuote,
  gallery: EditorialGallery,
  rsvp: EditorialRsvp,
  ending: EditorialEnding,
};

const developer: ThemeSet = {
  cover: DevCover,
  date: DevDate,
  location: DevLocation,
  schedule: DevSchedule,
  gallery: DevGallery,
  rsvp: DevRsvp,
  ending: DevEnding,
};

const gaming: ThemeSet = {
  cover: GamingCover,
  gInfo: GamingInfo,
  location: GamingLocation,
  countdown: GamingCountdown,
  lanes: GamingLanes,
  rules: GamingRules,
  tierChart: GamingTierChart,
  champions: GamingChampions,
  accept: GamingCta,
  ending: GamingEnding,
};

// Sections every theme supports (rendered theme-agnostically). Spread last so a theme
// could still override, and so it appears at the end of each theme's section palette.
const common: ThemeSet = { account: AccountSection, dday: DdaySection };

export const themeRegistry: Partial<Record<ThemeId, ThemeSet>> = {
  romantic: { ...romantic, ...common },
  minimal: { ...minimal, ...common },
  cute: { ...cute, ...common },
  editorial: { ...editorial, ...common },
  developer: { ...developer, ...common },
  battle: { ...battle, ...common },
  timeline: { ...timeline, ...common },
  gaming: { ...gaming, ...common },
};
