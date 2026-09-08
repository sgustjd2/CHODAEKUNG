import { Fragment } from "react";
import type { ComponentType, CSSProperties } from "react";
import type { AttendeesContent, CoverContent, DdayContent, GuestbookContent, Invitation } from "@/lib/invitation/types";
import { themeRegistry } from "./section-registry";
import { GenericCover } from "./sections/generic-cover";
import { DdaySection } from "./sections/dday";
import { GuestbookSection } from "./sections/guestbook";
import { AttendeesSection } from "./sections/attendees";
import { invitationMeta, lineText } from "@/lib/invitation/meta";
import { ShareBar } from "./share-bar";
import { ViewPing } from "./view-ping";
import { Reveal } from "./reveal";
import { EditContext } from "./editable";
import { FontLink } from "./font-link";
import { fontById } from "@/lib/invitation/fonts";

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
  onEdit,
  onSelectSection,
}: {
  invitation: Invitation;
  contained?: boolean;
  /** Full preview (new-tab, pre-publish): animations play, but no view-count ping or real RSVP write. */
  preview?: boolean;
  /** Editor-only: enables inline WYSIWYG editing of tagged text (commits field edits to the draft).
   * `asLines` marks a rich Line[] field (title/body) vs a plain string. */
  onEdit?: (secId: string, path: string, value: string, asLines: boolean) => void;
  /** Editor-only: focusing an inline field selects its section, so the side panel follows the preview. */
  onSelectSection?: (secId: string) => void;
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
  // User customizations, applied as CSS-var overrides on the invitation root — one place that
  // covers the contained editor preview, the full preview and the published page. Every theme's
  // CSS reads these vars (--wax = accent, --font-* = Korean text font, --ink = body text color).
  // ponytail: --wax-deep uses the same hue as --wax (matches the editor); derive a darker shade if hover depth matters.
  const font = fontById(invitation.font);
  const vars: Record<string, string> = {};
  if (invitation.accent) {
    vars["--wax"] = invitation.accent;
    vars["--wax-deep"] = invitation.accent;
  }
  if (font?.google) {
    // Only override for non-default fonts (default Pretendard needs no change / no load).
    vars["--font-ko"] = font.stack;
    vars["--font-serif"] = font.stack;
    vars["--font-display"] = font.stack;
    vars["--font-body"] = font.stack;
  }
  if (invitation.textColor) vars["--ink"] = invitation.textColor;
  if (invitation.fontScale && invitation.fontScale !== 1) vars["--iv-fs"] = String(invitation.fontScale);
  if (invitation.letterSpacing) vars["--iv-ls"] = `${invitation.letterSpacing}em`;
  if (invitation.lineHeight && invitation.lineHeight !== 1) vars["--iv-lh"] = String(invitation.lineHeight);
  const base = contained ? undefined : layoutStyle;
  const rootStyle: CSSProperties | undefined =
    base || Object.keys(vars).length ? ({ ...base, ...vars } as CSSProperties) : undefined;
  return (
    <div
      className={`iv t-${invitation.theme}${contained ? " iv-contained" : ""}`}
      data-bg={!contained && bg && bg !== "soft" ? bg : undefined}
      style={rootStyle}
    >
      <FontLink google={font?.google} />
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
          ) : s.type === "guestbook" ? (
            // Guestbook needs the slug (DB reads/writes) + preview flag, which the registry render can't pass.
            <GuestbookSection content={s.content as GuestbookContent} slug={invitation.slug} preview={preview || contained} />
          ) : s.type === "attendees" ? (
            <AttendeesSection content={s.content as AttendeesContent} slug={invitation.slug} preview={preview || contained} />
          ) : Renderer ? (
            <Renderer content={s.content} index={i} />
          ) : null;
          if (!node) return null;
          // In the editor preview (contained), wrap each section so the editor can scroll to it
          // (section-list click) and target inline edits. Public viewer DOM stays unchanged.
          if (contained) {
            return (
              <div key={s.id} data-sec-id={s.id} className="iv-secwrap">
                {onEdit ? <EditContext.Provider value={{ secId: s.id, onEdit, onSelect: onSelectSection }}>{node}</EditContext.Provider> : node}
              </div>
            );
          }
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
        hasAttendees={invitation.sections.some((s) => s.type === "attendees")}
      />
      {!contained && !preview && <ViewPing slug={invitation.slug} />}
    </div>
  );
}
