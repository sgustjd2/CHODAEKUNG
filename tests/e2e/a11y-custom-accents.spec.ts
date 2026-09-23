import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankInvitation, sampleInvitations } from "@/lib/invitation/samples";
import type { ThemeId } from "@/lib/invitation/types";

/**
 * A user-chosen accent (editor palette / wizard) on every theme: all accent tokens are derived from it
 * (accentVars), so (1) accent text actually takes the accent's hue — it used to stay the default coral on
 * light themes — and (2) every accent-derived surface stays AA, at rest and on button hover. The fixture
 * is each theme's "new invitation" flow + the shared sections, injected as the draft /preview renders.
 * Accents: a dark-ish blue (white ink), a mid-tone green no ink reaches 4.5 on, and a pale yellow (navy ink).
 */
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "timeline", "battle", "gaming", "developer"];
const ACCENTS = ["#3B6FD4", "#2E9E5B", "#F5D896"];
const SHARED = new Set(["dday", "attendees", "account", "guestbook"]);
const shared = sampleInvitations["jisoo-minjun"].sections.filter((s) => SHARED.has(s.type));

function hue(r: number, g: number, b: number): number {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}
const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];

async function blocking(page: Page, include?: string) {
  let b = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
  if (include) b = b.include(include);
  const { violations } = await b.analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.impact}:${v.id} → ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

for (const theme of THEMES) {
  test(`custom accents on ${theme}: accent hue is used, and AA at rest + hover`, async ({ page }) => {
    for (const accent of ACCENTS) {
      const base = blankInvitation(theme);
      const slug = `accent-${theme}-${accent.slice(1)}`;
      const draft = { ...base, slug, accent, sections: [...base.sections, ...shared] };
      await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [`chodaekung:editor:v1:${slug}`, JSON.stringify({ draft })]);
      await page.goto(`/preview?slug=${slug}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator(".acc-copy").first()).toBeVisible();

      // (1) accent text follows the chosen accent's hue, not the default coral
      const eb = await page.locator(".acc-eb").first().evaluate((e) => getComputedStyle(e).color);
      const [r, g, b] = eb.match(/\d+/g)!.map(Number);
      const want = hue(...hexRgb(accent)), got = hue(r, g, b);
      const dh = Math.min(Math.abs(want - got), 360 - Math.abs(want - got));
      expect(dh, `${theme} ${accent}: eyebrow ${eb} should carry the accent's hue`).toBeLessThanOrEqual(12);

      // (2) AA at rest, and hovered accent buttons
      expect(await blocking(page), `${theme} ${accent} at rest`).toEqual([]);
      for (const sel of [".acc-copy", ".gb-submit"]) {
        await page.locator(sel).first().hover();
        await page.waitForTimeout(200);
        expect(await blocking(page, sel), `${theme} ${accent} hover ${sel}`).toEqual([]);
      }
    }
  });
}
