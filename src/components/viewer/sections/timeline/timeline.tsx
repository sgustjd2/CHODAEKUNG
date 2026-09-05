import { TlSection } from "./tl-section";
import { TimelineList } from "./timeline-list";
import type { TimelineSectionContent } from "@/lib/invitation/types";

export function TimelineSchedule({ content }: { content: TimelineSectionContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <TimelineList items={content.items} />
    </TlSection>
  );
}
