import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * a11y for states the page-load scan (a11y.spec) never sees: the /login signup mode, and HOVER on the
 * white-text coral buttons. The hover fill used to be --wax-deep, which is actually LIGHTER than
 * --wax, so hovering dropped white text to ~3.65:1 — invisible to a resting-state axe scan.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function blocking(page: Page, include?: string) {
  let b = new AxeBuilder({ page }).withTags(TAGS);
  if (include) b = b.include(include);
  const { violations } = await b.analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.impact}:${v.id} → ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("/login signup mode (incl. its message) has no critical/serious a11y", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator(".auth-toggle button").click();
  await expect(page.locator('input[autocomplete="name"]')).toBeVisible();
  expect(await blocking(page)).toEqual([]);

  // Submitting in demo mode renders the .auth-msg error — scan that state too.
  await page.locator('input[autocomplete="name"]').fill("홍길동");
  await page.locator('input[type="email"]').fill("a@b.co");
  await page.locator('input[type="password"]').fill("secret123");
  await page.locator(".auth-btn").click();
  await expect(page.locator(".auth-msg")).toBeVisible();
  await page.mouse.move(0, 0); // leave the button so this scan is the resting state
  expect(await blocking(page)).toEqual([]);
});

const HOVER = [
  { url: "/login", sel: ".auth-btn" },
  { url: "/guide", sel: ".guide-cta-sm" },
  { url: "/guide", sel: ".guide-btn.primary" },
  { url: "/i/jisoo-minjun", sel: ".share-pill button.primary" }, // light theme (remapped --wax-deep)
  { url: "/i/dev-meetup", sel: ".share-pill button.primary" }, // dark theme
];
for (const h of HOVER) {
  test(`hovered ${h.sel} on ${h.url} keeps AA contrast`, async ({ page }) => {
    await page.goto(h.url, { waitUntil: "domcontentloaded" });
    const el = page.locator(h.sel).first();
    await el.hover();
    await page.waitForTimeout(250); // let any background transition settle
    expect(await blocking(page, h.sel)).toEqual([]);
  });
}
