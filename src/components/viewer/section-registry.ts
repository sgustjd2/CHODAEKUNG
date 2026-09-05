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

type Renderer<T extends SectionType> = ComponentType<{
  content: Extract<Section, { type: T }>["content"];
  index?: number;
}>;
type ThemeSet = { [T in SectionType]: Renderer<T> };

/**
 * theme → (section.type → renderer). Themes differ structurally, so each provides
 * its own renderer set (CLAUDE.md §7.3, applied per theme). Add a theme = add a set.
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

export const themeRegistry: Partial<Record<ThemeId, ThemeSet>> = { romantic, minimal };
