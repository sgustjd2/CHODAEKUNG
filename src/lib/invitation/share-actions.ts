/** Bridge so a section (e.g. the developer-theme ending) can trigger the ShareBar's share actions
 * instead of shipping dead buttons — ShareBar owns the Kakao/clipboard/.ics logic + the invitation data. */
export const SHARE_EVENT = "chodaekung:share";

export type ShareAction = "kakao" | "copy" | "cal";

export function triggerShare(action: ShareAction) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHARE_EVENT, { detail: { action } }));
}
