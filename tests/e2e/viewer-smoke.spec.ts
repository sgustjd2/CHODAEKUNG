import { test, expect, type Page } from "@playwright/test";

/**
 * Public invitation viewer (/i/<slug>) — the share-driven page guests actually see. With no backend
 * configured, `/i/<slug>` renders the bundled theme samples (getSampleOrNull), so this exercises the
 * real viewer across themes without a DB: it renders, the sticky share pill + RSVP CTA are present,
 * and the RSVP modal opens and is interactive. Submitting needs a DB, so we don't submit here.
 */

// One curated sample per theme family (light + dark, simple + complex).
const SAMPLES = [
  { slug: "jisoo-minjun", theme: "romantic" },
  { slug: "cozy-home", theme: "cute" },
  { slug: "after-hours", theme: "editorial" },
  { slug: "jogi-battle", theme: "battle" },
  { slug: "lol-rank", theme: "gaming" },
];

/** Collect real JS errors, ignoring blocked/absent network resources (external fonts/CDN, which
 * fail closed in the sandbox but resolve in CI). */
function trackJsErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/ERR_NAME_NOT_RESOLVED|Failed to load resource|net::ERR/i.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}

for (const s of SAMPLES) {
  test(`published viewer renders — ${s.theme} (${s.slug})`, async ({ page }) => {
    const errors = trackJsErrors(page);
    // domcontentloaded (not networkidle): the live roster/guestbook poll, so the network never idles.
    await page.goto(`/i/${s.slug}`, { waitUntil: "domcontentloaded" });

    const iv = page.locator(`.iv.t-${s.theme}`).first();
    await expect(iv).toBeVisible(); // correct theme rendered
    await expect(iv).toContainText(/\S/); // with real content
    await expect(page.locator(".share-pill .primary")).toBeVisible(); // sticky RSVP CTA

    expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("RSVP modal opens and is interactive", async ({ page }) => {
  await page.goto("/i/jisoo-minjun", { waitUntil: "domcontentloaded" });

  await page.locator(".share-pill .primary").click();
  const modal = page.locator(".rsvp-modal");
  await expect(modal).toBeVisible();
  await expect(modal.locator('input[autocomplete="name"]')).toBeVisible();

  // selecting a response option reflects in aria-pressed
  const opts = modal.locator(".rsvp-opt");
  await expect(opts.first()).toBeVisible();
  await opts.nth(1).click();
  await expect(opts.nth(1)).toHaveAttribute("aria-pressed", "true");

  await modal.locator(".rsvp-modal-close").click();
  await expect(modal).toBeHidden();
});
