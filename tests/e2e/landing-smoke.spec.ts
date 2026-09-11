import { test, expect } from "@playwright/test";

/**
 * Landing (/) — the public top of the funnel. Renders, the primary CTAs point at create/templates,
 * and footer links meet the 44px touch-target minimum (a11y — CLAUDE.md §10). All DB-independent.
 */
test.describe("landing (/)", () => {
  test("renders with hero + primary CTAs, no runtime errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
    page.on("console", (m) => {
      if (m.type() === "error" && !/ERR_NAME_NOT_RESOLVED|Failed to load resource|net::ERR/i.test(m.text())) errors.push(m.text());
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".hero-title")).toBeVisible();
    await expect(page.locator('.hero-actions a[href="/new"]')).toBeVisible();
    await expect(page.locator('.hero-actions a[href="/templates"]')).toBeVisible();
    expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("footer links meet the 44px touch-target minimum", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const links = page.locator(".footer-col a");
    const n = await links.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const box = await links.nth(i).boundingBox();
      expect(box, `footer link #${i} has no layout box`).not.toBeNull();
      expect(box!.height, `footer link #${i} tap-target height`).toBeGreaterThanOrEqual(44);
    }
  });

  test("템플릿 구경하기 → /templates gallery", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('.hero-actions a[href="/templates"]').click();
    await expect(page).toHaveURL(/\/templates$/);
    await expect(page.locator(".head-title")).toBeVisible();
  });
});
