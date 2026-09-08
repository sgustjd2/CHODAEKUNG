/** Bridge so RSVP-style section buttons (참석/불참, accept/decline CTAs) open the ShareBar's RSVP
 * modal — the one place that actually submits — instead of only toggling a visual selection. */
export const RSVP_OPEN_EVENT = "chodaekung:rsvp:open";

export function openRsvpModal(choice?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(RSVP_OPEN_EVENT, { detail: { choice } }));
}
