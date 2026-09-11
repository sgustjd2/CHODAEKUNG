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
import { EditContext, TextStyleContext } from "./editable";
import { FontLink } from "./font-link";
import { LightboxRoot } from "./lightbox";
import { fontById } from "@/lib/invitation/fonts";
import { waxInk, waxDeep, accentOn } from "@/lib/invitation/contrast";

/** Themes whose page background is dark → accent-colored TEXT must be lightened (not darkened) to stay
 * legible. Value is each theme's base --iv-bg (see viewer.css). */
const DARK_THEME_BG: Partial<Record<string, string>> = { battle: "#1A1A2E", gaming: "#14101E", developer: "#0D0F0A" };

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
  onSelectField,
  selectedId,
  templateDefaults,
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
  /** Editor-only: focusing an inline field reports (secId, path) so the per-field style controls target it. */
  onSelectField?: (secId: string, path: string) => void;
  /** Editor-only: the currently selected section id — highlights that section in the contained preview. */
  selectedId?: string;
  /** Editor-only: the template a fresh invitation was seeded from. Fields still matching it render as
   * gray "example" hints (see Editable). Undefined for existing/blank starts. */
  templateDefaults?: Invitation | null;
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
  // Per-field font overrides (section.style.text[*].font) each need their Google font loaded too.
  const fieldFonts = new Set<string>();
  for (const s of invitation.sections) {
    const text = s.style?.text;
    if (!text) continue;
    for (const ts of Object.values(text)) {
      const g = ts.font ? fontById(ts.font)?.google : undefined;
      if (g && g !== font?.google) fieldFonts.add(g);
    }
  }
  const vars: Record<string, string> = {};
  if (invitation.accent) {
    vars["--wax"] = invitation.accent;
    // --wax-deep drives accent-BG panels (accept/ending) + accent text on light surfaces → darken so
    // white text on it and it-as-text-on-white both stay legible. --wax-ink keeps text on accent-BG legible.
    vars["--wax-deep"] = waxDeep(invitation.accent);
    vars["--wax-ink"] = waxInk(invitation.accent);
    // --wax-onpage is accent TEXT on the page background. On light themes it equals --wax-deep (via the
    // token default), but on dark themes darkening makes it vanish — lighten against the dark page instead.
    const darkBg = DARK_THEME_BG[invitation.theme];
    if (darkBg) vars["--wax-onpage"] = accentOn(invitation.accent, darkBg);
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
  if (invitation.bgColor) vars["--iv-bg"] = invitation.bgColor;
  const base = contained ? undefined : layoutStyle;
  const rootStyle: CSSProperties | undefined =
    base || Object.keys(vars).length ? ({ ...base, ...vars } as CSSProperties) : undefined;
  // The invitation body is the page's main landmark on the full/public viewer (screen-reader nav);
  // the editor's contained preview stays a plain div — it lives inside the editor app's own layout.
  const Doc = contained ? "div" : "main";
  return (
    <div
      className={`iv t-${invitation.theme}${contained ? " iv-contained" : ""}`}
      data-bg={!contained && bg && bg !== "soft" ? bg : undefined}
      style={rootStyle}
    >
      <FontLink google={font?.google} />
      {[...fieldFonts].map((g) => (
        <FontLink key={g} google={g} />
      ))}
      {animate && (
        <noscript>
          <style>{`.iv-reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      )}
      <Doc className="iv-doc">
        {invitation.sections.map((s, i) => {
          // Cover with a non-theme layout uses the shared GenericCover; everything else the theme renderer.
          const useGeneric = s.type === "cover" && !!(s.content as CoverContent).layout && (s.content as CoverContent).layout !== "theme";
          const Renderer = set[s.type] as ComponentType<{ content: unknown; index?: number; target?: string; slug?: string; preview?: boolean; capacity?: number }> | undefined;
          const node = useGeneric ? (
            <GenericCover content={s.content as CoverContent} />
          ) : s.type === "dday" ? (
            // Live countdown needs the invitation's canonical datetime, which the registry render can't pass.
            <DdaySection content={s.content as DdayContent} target={invitation.eventStart} />
          ) : s.type === "countdown" ? (
            // Same: the battle/gaming countdown ticks from the invitation's eventStart.
            Renderer ? <Renderer content={s.content} index={i} target={invitation.eventStart} /> : null
          ) : s.type === "guestbook" ? (
            // Guestbook needs the slug (DB reads/writes) + preview flag, which the registry render can't pass.
            <GuestbookSection content={s.content as GuestbookContent} slug={invitation.slug} preview={preview || contained} />
          ) : s.type === "attendees" ? (
            <AttendeesSection content={s.content as AttendeesContent} slug={invitation.slug} preview={preview || contained} />
          ) : s.type === "details" && Renderer ? (
            // The details party block (avatars + N명 확정) is live-RSVP-driven on the published page,
            // so it needs the slug + preview flag + capacity (for "자리 남음"), like attendees.
            <Renderer content={s.content} index={i} slug={invitation.slug} preview={preview || contained} capacity={invitation.capacity} />
          ) : Renderer ? (
            <Renderer content={s.content} index={i} />
          ) : null;
          if (!node) return null;
          // Per-section color overrides (on top of the invitation-wide vars): same CSS vars,
          // scoped to this one section's wrapper.
          const st = s.style;
          const secVars: CSSProperties | undefined =
            st && (st.accent || st.bg)
              ? ({ ...(st.accent ? { ["--wax"]: st.accent, ["--wax-deep"]: waxDeep(st.accent), ["--wax-ink"]: waxInk(st.accent) } : null), ...(st.bg ? { background: st.bg } : null) } as CSSProperties)
              : undefined;
          // In the editor preview (contained), wrap each section so the editor can scroll to it
          // (section-list click) and target inline edits. Public viewer DOM stays unchanged
          // unless the section carries a per-section override (then it gets a vars wrapper).
          const textStyles = s.style?.text ?? null;
          if (contained) {
            return (
              <div key={s.id} data-sec-id={s.id} className={`iv-secwrap${selectedId === s.id ? " selected" : ""}`} style={secVars}>
                <TextStyleContext.Provider value={textStyles}>
                  {onEdit ? (
                    <EditContext.Provider
                      value={{
                        secId: s.id,
                        onEdit,
                        onSelect: onSelectSection,
                        onSelectField,
                        content: s.content,
                        defaultContent: templateDefaults?.sections.find((d) => d.id === s.id)?.content,
                      }}
                    >
                      {node}
                    </EditContext.Provider>
                  ) : (
                    node
                  )}
                </TextStyleContext.Provider>
              </div>
            );
          }
          // Public page: only wrap in a style provider when this section actually carries field styles.
          const styled = textStyles ? <TextStyleContext.Provider value={textStyles}>{node}</TextStyleContext.Provider> : node;
          const inner = secVars ? <div className="iv-secvars" style={secVars}>{styled}</div> : styled;
          return animate ? (
            <Reveal key={s.id} anim={reveal} index={i}>
              {inner}
            </Reveal>
          ) : (
            <Fragment key={s.id}>{inner}</Fragment>
          );
        })}
      </Doc>

      <ShareBar
        slug={invitation.slug}
        shareCta={invitation.shareCta}
        options={rsvpOptions(invitation)}
        preview={preview}
        contained={contained}
        share={invitationMeta(invitation)}
        eventStart={invitation.eventStart}
        eventLocation={eventLocationOf(invitation)}
        hasAttendees={invitation.sections.some((s) => s.type === "attendees")}
        capacity={invitation.capacity}
      />
      {!contained && !preview && <ViewPing slug={invitation.slug} />}
      <LightboxRoot />
    </div>
  );
}
