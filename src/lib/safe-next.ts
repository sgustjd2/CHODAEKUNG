/**
 * The `?next=` return path after login, reduced to a same-origin path — or `fallback`.
 *
 * A prefix check (`startsWith("/") && !startsWith("//")`) is NOT enough: the WHATWG URL parser (browsers,
 * and so `router.push`) treats `\` as `/` and strips tabs/newlines, so `/\evil.com` or `/<TAB>/evil.com`
 * pass that check yet resolve to https://evil.com/ — an open redirect off our domain. Instead, let the
 * parser resolve the value and accept it only if the origin didn't change.
 */
export function safeNextPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  const base = "https://same-origin.invalid";
  try {
    const u = new URL(raw, base);
    return u.origin === base ? u.pathname + u.search + u.hash : fallback;
  } catch {
    return fallback;
  }
}
