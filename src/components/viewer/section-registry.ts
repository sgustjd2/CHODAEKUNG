import type { ComponentType } from "react";
import type { Section } from "@/lib/invitation/types";
import { CoverSection } from "./sections/cover";
import { MessageSection } from "./sections/message";
import { DateSection } from "./sections/date";
import { LocationSection } from "./sections/location";
import { GallerySection } from "./sections/gallery";
import { ScheduleSection } from "./sections/schedule";
import { RsvpSection } from "./sections/rsvp";
import { EndingSection } from "./sections/ending";

type Renderer<T extends Section["type"]> = ComponentType<{
  content: Extract<Section, { type: T }>["content"];
}>;

/** section.type → one renderer (CLAUDE.md §7.3). */
export const sectionRegistry: { [T in Section["type"]]: Renderer<T> } = {
  cover: CoverSection,
  message: MessageSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  schedule: ScheduleSection,
  rsvp: RsvpSection,
  ending: EndingSection,
};
