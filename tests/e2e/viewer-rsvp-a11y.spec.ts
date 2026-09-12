import { test, expect } from "@playwright/test";

/**
 * Interactive a11y for the viewer's RSVP dialog (CLAUDE.md §10 dialog focus management) — the part
 * axe's automated scan can't check: the dialog opens with focus inside it, Tab is trapped so keyboard
 * users can't reach the page behind, and Escape closes it and returns focus to the trigger.
 */
test("RSVP dialog: opens focused, traps Tab, Escape closes and restores focus", async ({ page }) => {
  await page.goto("/i/jisoo-minjun", { waitUntil: "domcontentloaded" });

  const trigger = page.locator(".share-pill button.primary");
  await expect(trigger).toBeVisible();
  await trigger.click();

  const modal = page.locator(".rsvp-modal");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute("aria-modal", "true");
  await expect(modal).toHaveAttribute("role", "dialog");

  // Opens with focus inside the dialog (the name field autoFocuses).
  await expect(modal.locator("input").first()).toBeFocused();

  // Focus trap: repeated Tab never lets focus escape the dialog to the page behind.
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const inside = await modal.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `focus escaped the dialog after Tab #${i + 1}`).toBe(true);
  }
  // Shift+Tab at the boundary also stays trapped.
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Shift+Tab");
    const inside = await modal.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `focus escaped the dialog after Shift+Tab #${i + 1}`).toBe(true);
  }

  // Escape closes the dialog and returns focus to the control that opened it.
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await expect(trigger).toBeFocused();
});
