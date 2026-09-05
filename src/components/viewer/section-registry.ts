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

export const themeRegistry: Partial<Record<ThemeId, ThemeSet>> = { romantic, minimal, battle };
