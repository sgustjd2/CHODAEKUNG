import type { ComponentType } from "react";
import type { Invitation } from "@/lib/invitation/types";
import { themeRegistry } from "./section-registry";
import { Icon } from "@/components/ui/icon";

/**
 * Renders a published invitation from its structured data (sections[] + theme).
 * `contained` fits it inside a positioned box (editor preview) instead of the viewport.
 */
export function InvitationViewer({
  invitation,
  contained,
}: {
  invitation: Invitation;
  contained?: boolean;
}) {
  const set = themeRegistry[invitation.theme] ?? themeRegistry.romantic!;
  return (
    <div className={`iv t-${invitation.theme}${contained ? " iv-contained" : ""}`}>
      <div className="iv-doc">
        {invitation.sections.map((s, i) => {
          const Renderer = set[s.type] as ComponentType<{ content: unknown; index?: number }> | undefined;
          if (!Renderer) return null;
          return <Renderer key={s.id} content={s.content} index={i} />;
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
