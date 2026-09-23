import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankInvitation, sampleInvitations } from "@/lib/invitation/samples";
import type { ThemeId } from "@/lib/invitation/types";

/**
 * The shared sections (account / guestbook / attendees / d-day) can be added to ANY theme, but the
 * bundled samples only carry them on light themes — so the page-level gate (a11y.spec) never saw them
 * on the dark themes, where they hid real failures (gaming's un-remapped coral fills, battle's light
 * accent text on the white account card). Graft them onto each theme's "new invitation" flow, inject it
 * as the editor draft that /preview renders (no DB needed), and require AA at rest and on button hover.
 */
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "timeline", "battle", "gaming", "developer"];
const SHARED = new Set(["dday", "attendees", "account", "guestbook"]);
const shared = sampleInvitations["jisoo-minjun"].sections.filter((s) => SHARED.has(s.type));

async function blocking(page: Page, include?: string) {
  let b = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
  if (include) b = b.include(include);
  const { violations } = await b.analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.impact}:${v.id} → ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("the grafted fixture really contains all four shared sections", () => {
  expect(shared.map((s) => s.type).sort()).toEqual(["account", "attendees", "dday", "guestbook"]);
});

for (const theme of THEMES) {
  test(`shared sections on ${theme}: AA at rest and on button hover`, async ({ page }) => {
    const base = blankInvitation(theme);
    const slug = `a11y-shared-${theme}`;
    const draft = { ...base, slug, sections: [...base.sections, ...shared] };
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [`chodaekung:editor:v1:${slug}`, JSON.stringify({ draft })]);
    await page.goto(`/preview?slug=${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".acc-copy").first()).toBeVisible();
    await expect(page.locator(".gb-submit")).toBeVisible();

    expect(await blocking(page), `${theme} at rest`).toEqual([]);
    for (const sel of [".acc-copy", ".gb-submit"]) {
      await page.locator(sel).first().hover();
      await page.waitForTimeout(250);
      expect(await blocking(page, sel), `${theme} hover ${sel}`).toEqual([]);
    }
  });
}
