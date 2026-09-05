import type { ComponentType } from "react";
import type { Invitation } from "@/lib/invitation/types";
import { themeRegistry } from "./section-registry";
import { ShareBar } from "./share-bar";
import { ViewPing } from "./view-ping";

/** RSVP response options: from the rsvp section, else the accept CTA, else a sensible default. */
function rsvpOptions(inv: Invitation): string[] {
  const r = inv.sections.find((s) => s.type === "rsvp");
  if (r && r.type === "rsvp" && r.content.options.length) return r.content.options;
  const a = inv.sections.find((s) => s.type === "accept");
  if (a && a.type === "accept") return [a.content.accept, a.content.decline];
  return ["참석", "미정", "불참"];
}

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

      <ShareBar slug={invitation.slug} shareCta={invitation.shareCta} options={rsvpOptions(invitation)} />
      {!contained && <ViewPing slug={invitation.slug} />}
    </div>
  );
}
