import { test, expect } from "@playwright/test";

/**
 * Templates gallery (/templates) — public browse page. Renders the 8-category gallery with cards
 * and search, category quick-nav chips are proper tap targets, and clicking a card hands off to the
 * editor seeded from that template. DB-independent.
 */
test.describe("templates (/templates)", () => {
  test("renders gallery: categories, cards, search, no runtime errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
    page.on("console", (m) => {
      if (m.type() === "error" && !/ERR_NAME_NOT_RESOLVED|Failed to load resource|net::ERR/i.test(m.text())) errors.push(m.text());
    });

    await page.goto("/templates", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".head-title")).toBeVisible();
    await expect(page.locator(".cat-nav a")).toHaveCount(8); // 8 shared categories
    await expect(page.locator(".tpl").first()).toBeVisible(); // template cards
    await expect(page.locator(".search input")).toBeVisible();
    expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("category quick-nav chips meet the 44px touch-target minimum", async ({ page }) => {
    await page.goto("/templates", { waitUntil: "domcontentloaded" });
    const chips = page.locator(".cat-nav a");
    const n = await chips.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const box = await chips.nth(i).boundingBox();
      expect(box, `chip #${i} has no layout box`).not.toBeNull();
      expect(box!.height, `chip #${i} tap-target height`).toBeGreaterThanOrEqual(44);
    }
  });

  test("clicking a template card opens the editor seeded from it", async ({ page }) => {
    await page.goto("/templates", { waitUntil: "domcontentloaded" });
    await page.locator(".tpl").first().click();
    await expect(page).toHaveURL(/\/editor(\?|$)/);
    await expect(page.locator(".ed-mobile")).toBeVisible(); // editor shell on the iPhone profile
  });
});
