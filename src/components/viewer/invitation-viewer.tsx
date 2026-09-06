import { Fragment } from "react";
import type { ComponentType, CSSProperties } from "react";
import type { CoverContent, DdayContent, Invitation } from "@/lib/invitation/types";
import { themeRegistry } from "./section-registry";
import { GenericCover } from "./sections/generic-cover";
import { DdaySection } from "./sections/dday";
import { invitationMeta, lineText } from "@/lib/invitation/meta";
import { ShareBar } from "./share-bar";
import { ViewPing } from "./view-ping";
import { Reveal } from "./reveal";

/** Venue name for the calendar entry, from the first location section's title (else empty). */
function eventLocationOf(inv: Invitation): string {
  const loc = inv.sections.find((s) => s.type === "location");
  return loc && "title" in loc.content ? lineText(loc.content.title) : "";
}

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
          // Cover with a non-theme layout uses the shared GenericCover; everything else the theme renderer.
          const useGeneric = s.type === "cover" && !!(s.content as CoverContent).layout && (s.content as CoverContent).layout !== "theme";
          const Renderer = set[s.type] as ComponentType<{ content: unknown; index?: number }> | undefined;
          const node = useGeneric ? (
            <GenericCover content={s.content as CoverContent} />
          ) : s.type === "dday" ? (
            // Live countdown needs the invitation's canonical datetime, which the registry render can't pass.
            <DdaySection content={s.content as DdayContent} target={invitation.eventStart} />
          ) : Renderer ? (
            <Renderer content={s.content} index={i} />
          ) : null;
          if (!node) return null;
          return animate ? (
            <Reveal key={s.id} anim={reveal} index={i}>
              {node}
            </Reveal>
          ) : (
            <Fragment key={s.id}>{node}</Fragment>
          );
        })}
      </div>

      <ShareBar
        slug={invitation.slug}
        shareCta={invitation.shareCta}
        options={rsvpOptions(invitation)}
        preview={preview}
        share={invitationMeta(invitation)}
        eventStart={invitation.eventStart}
        eventLocation={eventLocationOf(invitation)}
      />
      {!contained && !preview && <ViewPing slug={invitation.slug} />}
    </div>
  );
}
