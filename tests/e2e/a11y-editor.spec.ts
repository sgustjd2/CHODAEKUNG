import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForHydration } from "./hydration";

/**
 * a11y gate for the authoring side (critical + serious WCAG A/AA = 0): the mobile editor and each bottom
 * sheet, every desktop inspector tab, and the publish dialog. The invitation preview inside the editor is
 * excluded — invitation content is gated by the viewer specs. Before this, every inspector field was an
 * unnamed "edit text" to screen readers, closed sheets kept Tab-reachable controls, and the chrome used the
 * sub-AA muted / --wax-deep / sage text.
 */
/** Sheets, tabs and the dialog animate in; scanning mid-fade measures half-transparent text and reports
 * contrast that isn't really there. Wait until every finite animation/transition has finished. */
async function settle(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
  );
}

async function blocking(page: Page) {
  await settle(page);
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(".m-preview .iv")
    .exclude(".phone-scroll .iv")
    .analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.impact}:${v.id} → ${[...new Set(v.nodes.map((n) => n.target.join(" ")))].slice(0, 5).join(", ")}`);
}

test("mobile editor + each bottom sheet", async ({ page }) => {
  await page.goto("/editor?template=jisoo-minjun", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".ed-mobile", { timeout: 30_000 });
  await waitForHydration(page, ".m-tabs .m-tab");
  expect(await blocking(page), "mobile editor").toEqual([]);
  for (const label of ["내용", "디자인", "섹션", "효과"]) {
    if (await page.locator(".m-sheet.open").count()) {
      await page.locator(".m-sheet-close").click();
      await expect(page.locator(".m-sheet.open")).toHaveCount(0);
    }
    await page.locator(".m-tabs .m-tab", { hasText: label }).click();
    await expect(page.locator(".m-sheet.open")).toBeVisible();
    expect(await blocking(page), `sheet ${label}`).toEqual([]);
  }
});

test.describe("desktop editor", () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test("every inspector tab", async ({ page }) => {
    await page.goto("/editor?template=jisoo-minjun", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".ed-desktop .col-inspector", { timeout: 30_000 });
    await waitForHydration(page, ".ed-desktop .insp-tab");
    for (const tab of ["내용", "스타일", "레이아웃", "애니메이션"]) {
      await page.locator(".insp-tab", { hasText: tab }).click();
      await expect(page.locator(".insp-tab.active", { hasText: tab })).toBeVisible();
      expect(await blocking(page), `inspector ${tab}`).toEqual([]);
    }
  });

  test("publish dialog", async ({ page }) => {
    await page.goto("/editor?template=jisoo-minjun", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".ed-desktop", { timeout: 30_000 });
    await waitForHydration(page, ".ed-desktop .insp-tab");
    await page.getByRole("button", { name: /발행 · 공유/ }).click();
    await expect(page.locator(".pub-overlay")).toBeVisible();
    expect(await blocking(page), "publish dialog").toEqual([]);
  });
});
