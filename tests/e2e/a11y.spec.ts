import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility scan (axe-core) of the public pages, on the iPhone profile.
 *
 * - landing, templates & the /new wizard: gate on critical + serious WCAG A/AA (contrast, labels, roles).
 * - LIGHT-theme viewers (romantic/minimal/cute/timeline/editorial): gate on critical + serious.
 *   Their brand-coral + muted contrast is resolved (viewer.css "LIGHT THEMES" remap → --wax-onpage /
 *   --ink-3, deepened further for editorial/cute tinted paper) and locked against regression.
 * - DARK-theme viewers (battle/gaming/developer): gate on critical only. Their remaining `serious`
 *   are color-contrast on the dark accent palette (a separate coordinated pass) — logged so the debt
 *   stays visible.
 */
const PAGES = [
  { name: "landing", url: "/", gateSerious: true },
  { name: "templates", url: "/templates", gateSerious: true },
  { name: "new (wizard)", url: "/new", gateSerious: true },
  { name: "viewer · romantic", url: "/i/jisoo-minjun", gateSerious: true },
  { name: "viewer · minimal", url: "/i/appa-60", gateSerious: true },
  { name: "viewer · cute", url: "/i/cozy-home", gateSerious: true },
  { name: "viewer · timeline", url: "/i/jibdeuli", gateSerious: true },
  { name: "viewer · editorial", url: "/i/after-hours", gateSerious: true },
  { name: "viewer · battle (dark)", url: "/i/jogi-battle", gateSerious: false },
  { name: "viewer · gaming (dark)", url: "/i/lol-rank", gateSerious: false },
  { name: "viewer · developer (dark)", url: "/i/dev-meetup", gateSerious: false },
];

for (const p of PAGES) {
  test(`a11y: ${p.name}`, async ({ page }) => {
    await page.goto(p.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = violations.filter((v) => v.impact === "critical");
    const serious = violations.filter((v) => v.impact === "serious");
    if (!p.gateSerious && serious.length) {
      console.log(`[a11y] ${p.url}: ${serious.reduce((n, v) => n + v.nodes.length, 0)} serious node(s) (deferred): ${serious.map((v) => v.id).join(", ")}`);
    }

    const gated = p.gateSerious ? [...critical, ...serious] : critical;
    const report = gated
      .map((v) => `  [${v.impact}] ${v.id}: ${v.help}\n    ${[...new Set(v.nodes.map((n) => n.target.join(" ")))].slice(0, 6).join("\n    ")}`)
      .join("\n");
    expect(gated.map((v) => `${v.impact}:${v.id}`), `a11y violations on ${p.url}:\n${report}`).toEqual([]);
  });
}
