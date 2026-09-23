import { test, expect, type Page } from "@playwright/test";
import { gzipSync } from "node:zlib";
import { waitForHydration } from "./hydration";

/**
 * JS budget for the public pages (CLAUDE.md §11 — the invitation is opened on phones, often inside
 * KakaoTalk's in-app browser). The Supabase auth client (~67KB gzip) and the QR library used to ship on
 * EVERY page though they're only needed after an interaction; they're now loaded on demand. This locks
 * that in — initial JS may not contain either — plus a total budget so a heavy dependency slipping back
 * into a shared chunk fails CI. (~150KB gzip today; the budget leaves headroom for normal growth.)
 */
const HEAVY: Record<string, RegExp> = {
  "@supabase auth client": /GoTrueClient|PostgrestClient|RealtimeClient/,
  "qrcode-generator": /stringToBytesFuncs|createStringToBytes|_typeNumber/,
};
const BUDGET_KB = 180;

function trackJs(page: Page) {
  const files: { url: string; gz: number; libs: string[] }[] = [];
  page.on("response", async (r) => {
    if (!r.url().includes("/_next/") || !r.url().endsWith(".js")) return;
    try {
      const body = await r.body();
      files.push({ url: r.url(), gz: gzipSync(body).length, libs: Object.entries(HEAVY).filter(([, re]) => re.test(body.toString())).map(([k]) => k) });
    } catch {
      /* response body unavailable (e.g. navigated away) */
    }
  });
  return files;
}

for (const url of ["/", "/templates", "/new", "/i/jisoo-minjun"]) {
  test(`${url}: initial JS has no auth/QR library and stays under ${BUDGET_KB}KB gzip`, async ({ page }) => {
    const files = trackJs(page);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const libs = [...new Set(files.flatMap((f) => f.libs))];
    expect(libs, `${url} ships libraries that should load on demand`).toEqual([]);
    const kb = files.reduce((n, f) => n + f.gz, 0) / 1024;
    expect(kb, `${url} initial JS = ${kb.toFixed(1)}KB gzip`).toBeLessThan(BUDGET_KB);
  });
}

test("viewer QR action still downloads a PNG, loading its library only on tap", async ({ page }) => {
  const files = trackJs(page);
  await page.goto("/i/dev-meetup", { waitUntil: "networkidle" });
  expect(files.some((f) => f.libs.includes("qrcode-generator")), "QR library loaded before any tap").toBe(false);

  await waitForHydration(page, ".d-btn");
  const qrBtn = page.getByRole("button", { name: "$ gen-qr" });
  await qrBtn.scrollIntoViewIfNeeded();
  const [download] = await Promise.all([page.waitForEvent("download"), qrBtn.click()]);
  expect(download.suggestedFilename()).toBe("dev-meetup-qr.png");
  expect(files.some((f) => f.libs.includes("qrcode-generator")), "QR library fetched on tap").toBe(true);
});
