import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * The remaining public marketing/legal pages (in the sitemap): /guide and /privacy. Render, no
 * runtime errors, key links, and no critical *or serious* WCAG A/AA violations — their brand-palette
 * contrast is fixed (accent text → --wax-onpage, muted → --ink-3, white-on-wax → --wax-onpage bg),
 * so both are locked at AA. (The invitation viewer's remaining serious contrast is a separate
 * coordinated pass — see a11y.spec.)
 */
function trackJsErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/ERR_NAME_NOT_RESOLVED|Failed to load resource|net::ERR/i.test(m.text())) errors.push(m.text());
  });
  return errors;
}

async function expectNoBlockingA11y(page: Page, url: string) {
  await page.waitForTimeout(300);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const blocking = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  const report = blocking.map((v) => `  [${v.impact}] ${v.id} (${v.nodes.length})`).join("\n");
  expect(blocking.map((v) => `${v.impact}:${v.id}`), `critical/serious a11y violations on ${url}:\n${report}`).toEqual([]);
}

test("/guide renders with a create CTA and no critical/serious a11y", async ({ page }) => {
  const errors = trackJsErrors(page);
  const res = await page.goto("/guide", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.locator(".guide-title")).toBeVisible();
  await expect(page.locator('.guide a[href="/new"]').first()).toBeVisible();
  expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
  await expectNoBlockingA11y(page, "/guide");
});

test("/privacy renders the policy and no critical/serious a11y", async ({ page }) => {
  const errors = trackJsErrors(page);
  const res = await page.goto("/privacy", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "개인정보 처리방침" })).toBeVisible();
  await expect(page.locator('.legal a[href="/"]').first()).toBeVisible();
  expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
  await expectNoBlockingA11y(page, "/privacy");
});
