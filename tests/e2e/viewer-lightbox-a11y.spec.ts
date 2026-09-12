import { test, expect } from "@playwright/test";

/**
 * Interactive a11y for the gallery lightbox (CLAUDE.md §10 dialog focus management). It declares
 * aria-modal, so it must also: open with focus inside, trap Tab, support arrow-key navigation, and
 * close on Escape. (Opened by tapping a gallery photo on the romantic sample.)
 */
test("lightbox: opens focused + labelled, arrows navigate, Tab trapped, Escape closes", async ({ page }) => {
  await page.goto("/i/jisoo-minjun", { waitUntil: "domcontentloaded" });

  await page.locator(".iv-gallery-grid img").first().click();

  const lb = page.locator(".iv-lightbox");
  await expect(lb).toBeVisible();
  await expect(lb).toHaveAttribute("aria-modal", "true");
  await expect(lb).toHaveAttribute("role", "dialog");
  await expect(lb).toHaveAttribute("aria-label", /.+/); // accessible name present

  // Focus moves into the dialog on open (the close control).
  await expect(lb.locator(".iv-lb-close")).toBeFocused();

  // Arrow keys navigate the gallery (5 photos in this sample).
  await expect(lb.locator(".iv-lb-count")).toHaveText("1 / 5");
  await page.keyboard.press("ArrowRight");
  await expect(lb.locator(".iv-lb-count")).toHaveText("2 / 5");
  await page.keyboard.press("ArrowLeft");
  await expect(lb.locator(".iv-lb-count")).toHaveText("1 / 5");

  // Tab stays trapped within the dialog (aria-modal promise).
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    const inside = await lb.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `focus escaped the lightbox after Tab #${i + 1}`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(lb).toBeHidden();
});

test("gallery thumbnail is a keyboard-operable trigger; focus returns to it on close", async ({ page }) => {
  await page.goto("/i/jisoo-minjun", { waitUntil: "domcontentloaded" });

  const thumb = page.locator(".iv-gallery-grid img").first();
  await expect(thumb).toHaveAttribute("role", "button");
  await expect(thumb).toHaveAttribute("aria-label", /.+/);

  await thumb.focus();
  await expect(thumb).toBeFocused();
  await page.keyboard.press("Enter"); // opens via keyboard (not just click)

  const lb = page.locator(".iv-lightbox");
  await expect(lb).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(lb).toBeHidden();
  await expect(thumb).toBeFocused(); // focus returned to the opening thumbnail
});
