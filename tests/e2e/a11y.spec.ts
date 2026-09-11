import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility scan (axe-core) of the public pages, on the iPhone profile.
 *
 * - landing & templates: gate on critical + serious WCAG A/AA (contrast, labels, roles) — these are
 *   fixed and locked against regression.
 * - viewer: gate on critical only. Its remaining `serious` are color-contrast on the accent/muted
 *   palette inside shared viewer/section files; fixing those is a coordinated pass (tracked). The
 *   count is logged so the debt stays visible.
 */
const PAGES = [
  { name: "landing", url: "/", gateSerious: true },
  { name: "templates", url: "/templates", gateSerious: true },
  { name: "viewer (romantic)", url: "/i/jisoo-minjun", gateSerious: false },
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
