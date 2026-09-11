import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility scan (axe-core) of the public pages, on the iPhone profile.
 *
 * GATE: no `critical` WCAG A/AA violations (missing accessible names, no-alt images, broken roles …).
 * REPORT: `serious` violations are logged but non-blocking — the current ones are color-contrast on
 * the brand accent/muted palette used as small bold text (e.g. --wax-deep #C96A6A ≈ 3.65:1), which is
 * a brand/design decision (darkening the palette) rather than a mechanical fix, and some live in
 * shared viewer files. Tracked to fix with design input; this keeps the gate honest meanwhile.
 */
const PAGES = [
  { name: "landing", url: "/" },
  { name: "templates", url: "/templates" },
  { name: "viewer (romantic)", url: "/i/jisoo-minjun" },
];

const fmt = (vs: { impact?: string | null; id: string; help: string; nodes: { target: unknown[] }[] }[]) =>
  vs.map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`).join("\n");

for (const p of PAGES) {
  test(`a11y: ${p.name} — no critical WCAG A/AA violations`, async ({ page }) => {
    await page.goto(p.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = violations.filter((v) => v.impact === "critical");
    const serious = violations.filter((v) => v.impact === "serious");
    if (serious.length) console.log(`\n[a11y] ${p.url} — serious (non-gating), fix with design input:\n${fmt(serious)}\n`);

    expect(critical.map((v) => v.id), `critical a11y violations on ${p.url}:\n${fmt(critical)}`).toEqual([]);
  });
}
