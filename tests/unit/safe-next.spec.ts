import { test, expect } from "@playwright/test";
import { safeNextPath } from "@/lib/safe-next";

/** `?next=` after login must never leave our origin. Node's URL is the same WHATWG parser browsers (and
 * so router.push) use, so these cases are exactly what a victim's browser would do. */

const oldGuard = (n: string) => n.startsWith("/") && !n.startsWith("//"); // what login/page.tsx used to do
const host = (n: string) => new URL(n, "https://chodaekung.example").host;

test("same-origin paths pass through (query + hash kept)", () => {
  expect(safeNextPath("/editor")).toBe("/editor");
  expect(safeNextPath("/new?template=jisoo-minjun#top")).toBe("/new?template=jisoo-minjun#top");
  expect(safeNextPath("/i/inv-abc123")).toBe("/i/inv-abc123");
});

test("missing → fallback", () => {
  expect(safeNextPath(null)).toBe("/dashboard");
  expect(safeNextPath("")).toBe("/dashboard");
  expect(safeNextPath(undefined, "/")).toBe("/");
});

test("prefix-guard bypasses are real open redirects — and are now rejected", () => {
  const bs = "\\";
  for (const payload of [`/${bs}evil.com`, `/${bs}${bs}evil.com`, "/\t/evil.com", "/\n/evil.com", "/\r/evil.com"]) {
    expect(oldGuard(payload), `old guard let ${JSON.stringify(payload)} through`).toBe(true);
    expect(host(payload), `${JSON.stringify(payload)} really resolves off-site`).toBe("evil.com");
    expect(safeNextPath(payload), JSON.stringify(payload)).toBe("/dashboard");
  }
});

test("other off-origin / non-http forms → fallback", () => {
  for (const payload of ["//evil.com", "https://evil.com/x", " //evil.com", "javascript:alert(1)", "data:text/html,hi", "\\\\evil.com"]) {
    expect(safeNextPath(payload), JSON.stringify(payload)).toBe("/dashboard");
  }
});
