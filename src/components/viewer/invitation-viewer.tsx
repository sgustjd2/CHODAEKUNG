import type { ComponentType } from "react";
import type { Invitation } from "@/lib/invitation/types";
import { sectionRegistry } from "./section-registry";
import { Icon } from "@/components/ui/icon";

/** Renders a published invitation from its structured data (sections[] + theme). */
export function InvitationViewer({ invitation }: { invitation: Invitation }) {
  return (
    <div className={`iv t-${invitation.theme}`}>
      <div className="iv-doc">
        {invitation.sections.map((s) => {
          const Renderer = sectionRegistry[s.type] as ComponentType<{ content: unknown }>;
          return <Renderer key={s.id} content={s.content} />;
        })}
      </div>

      <div className="share-pill">
        <button type="button">
          <Icon name="ic-chat" /> 카톡
        </button>
        <button type="button">
          <Icon name="ic-link" /> 링크
        </button>
        <button type="button" className="primary">
          {invitation.shareCta}
        </button>
      </div>
    </div>
  );
}
