import type { LocationContent } from "./types";
import { lineText } from "./meta";

/** The address to copy / search — structured address line if present, else the body text. */
export function locationAddress(c: LocationContent): string {
  return (c.address?.a || lineText(c.body) || "").trim();
}

/** Map-search query: venue name + address (both help maps resolve the place). */
export function locationQuery(c: LocationContent): string {
  const venue = lineText(c.title);
  const addr = locationAddress(c);
  return [venue, addr].filter(Boolean).join(" ").trim();
}

/**
 * Build a map URL from a Korean map-button label + a place query. Uses web URLs (which deep-link
 * to the app on mobile and still work on desktop). Kakao/Google are detected explicitly; everything
 * else (네이버지도, "지도앱 열기", unknown) defaults to Naver Map — the most common, reliable choice.
 */
export function mapHref(label: string, query: string): string {
  const q = encodeURIComponent(query || "");
  if (/카카오|kakao/i.test(label)) return `https://map.kakao.com/?q=${q}`;
  if (/구글|google/i.test(label)) return `https://www.google.com/maps/search/?api=1&query=${q}`;
  return `https://map.naver.com/p/search/${q}`;
}

/** A "주소 복사"-type button (copies the address) vs a map-open button. */
export const isCopyLabel = (label: string) => /복사|copy/i.test(label);
