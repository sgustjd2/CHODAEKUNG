import type { ComponentType, CSSProperties } from "react";
import type { Invitation } from "@/lib/invitation/types";
import { themeRegistry } from "./section-registry";
import { invitationMeta } from "@/lib/invitation/meta";
import { ShareBar } from "./share-bar";
import { ViewPing } from "./view-ping";
import { Reveal } from "./reveal";

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
  preview,
}: {
  invitation: Invitation;
  contained?: boolean;
  /** Full preview (new-tab, pre-publish): animations play, but no view-count ping or real RSVP write. */
  preview?: boolean;
}) {
  const set = themeRegistry[invitation.theme] ?? themeRegistry.romantic!;
  // Reveal animation plays on the public page and full preview; the in-editor phone preview (contained) stays static.
  const reveal = invitation.reveal ?? "none";
  const animate = !contained && reveal !== "none";
  // Shared-frame layout (theme-agnostic): column width + backdrop. Full-bleed in the
  // contained editor frame, so these apply on the published/preview page.
  const lw = invitation.layout?.width;
  const layoutStyle: CSSProperties | undefined =
    lw === "narrow" ? ({ ["--iv-w"]: "392px" } as CSSProperties) : lw === "wide" ? ({ ["--iv-w"]: "512px" } as CSSProperties) : undefined;
  const bg = invitation.layout?.background;
  return (
    <div
      className={`iv t-${invitation.theme}${contained ? " iv-contained" : ""}`}
      data-bg={!contained && bg && bg !== "soft" ? bg : undefined}
      style={contained ? undefined : layoutStyle}
    >
      {animate && (
        <noscript>
          <style>{`.iv-reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      )}
      <div className="iv-doc">
        {invitation.sections.map((s, i) => {
          const Renderer = set[s.type] as ComponentType<{ content: unknown; index?: number }> | undefined;
          if (!Renderer) return null;
          if (animate) {
            return (
              <Reveal key={s.id} anim={reveal} index={i}>
                <Renderer content={s.content} index={i} />
              </Reveal>
            );
          }
          return <Renderer key={s.id} content={s.content} index={i} />;
        })}
      </div>

      <ShareBar slug={invitation.slug} shareCta={invitation.shareCta} options={rsvpOptions(invitation)} preview={preview} share={invitationMeta(invitation)} />
      {!contained && !preview && <ViewPing slug={invitation.slug} />}
    </div>
  );
}
