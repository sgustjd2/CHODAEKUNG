import { test, expect, type Page } from "@playwright/test";

/**
 * Editor smoke (mobile bottom-sheet layout — the config's iPhone profile). Guards editor behaviours
 * added/fixed recently: the cover can't be deleted (it isn't re-addable), switching to a theme that
 * can't render a section marks it "미표시" and drops it from the preview, a new section lands before
 * the ending (not after it), battle's matchInfo / gaming's champions have inspector editors, and
 * tapping a preview text field opens the 문구 스타일 panel. Runs in demo mode (no backend), so
 * /editor?template=<slug> opens directly without auth (same as the wizard→editor smoke).
 */

async function openEditor(page: Page, template: string) {
  await page.goto(`/editor?template=${template}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".ed-mobile", { timeout: 30_000 });
  // seed applied → the preview has rendered its sections (the cover section's id varies by sample,
  // so match any section wrapper rather than a specific id).
  await expect(page.locator(".m-preview [data-sec-id]").first()).toBeVisible({ timeout: 25_000 });
}

/** Open a bottom-sheet tab by its label (내용 / 디자인 / 섹션 / 효과). An already-open sheet's backdrop
 * covers the tab bar, so close it first (the app's own way to switch sheets). */
async function openSheet(page: Page, label: string) {
  if (await page.locator(".m-sheet.open").count()) {
    await page.locator(".m-sheet-close").click();
    await expect(page.locator(".m-sheet.open")).toHaveCount(0);
  }
  await page.locator(".m-tabs .m-tab", { hasText: label }).click();
  await expect(page.locator(".m-sheet.open")).toBeVisible();
}

/** The section-list row whose type badge is exactly `type` (matches DOM textContent, case-sensitive). */
const row = (page: Page, type: string) =>
  page.locator(".m-sec").filter({ has: page.locator(".m-sec-type", { hasText: new RegExp(`^${type}$`) }) });

test("cover is not deletable; other sections are", async ({ page }) => {
  await openEditor(page, "jisoo-minjun");
  await openSheet(page, "섹션");
  await expect(row(page, "cover").locator('button[aria-label="삭제"]')).toHaveCount(0);
  await expect(row(page, "message").locator('button[aria-label="삭제"]')).toHaveCount(1);
});

test("switching to a theme that can't render a section marks it 미표시 and drops it from the preview", async ({ page }) => {
  await openEditor(page, "jisoo-minjun"); // romantic: has message + schedule, which cute can't render
  await expect(page.locator('.m-preview [data-sec-id="message"]')).toHaveCount(1);

  await openSheet(page, "디자인");
  await page.locator(".m-sheet.open").getByRole("button", { name: "Cute", exact: true }).click();
  // close the 디자인 sheet so the preview is unobstructed
  await page.locator(".m-sheet-close").click();
  await expect(page.locator(".m-sheet.open")).toHaveCount(0);

  // excluded from the preview (kept in the section list, but not rendered/published)…
  await expect(page.locator('.m-preview [data-sec-id="message"]')).toHaveCount(0);
  // …and flagged in the section list
  await openSheet(page, "섹션");
  await expect(row(page, "message").locator(".m-sec-orphan-badge")).toBeVisible();
  await expect(row(page, "schedule").locator(".m-sec-orphan-badge")).toBeVisible();
});

test("a new section lands before the ending, not after it", async ({ page }) => {
  await openEditor(page, "jisoo-minjun");
  await openSheet(page, "섹션");
  const before = await page.locator(".m-sec .m-sec-type").allTextContents();

  await page.locator(".m-sec-add-row").getByRole("button", { name: /섹션 추가/ }).click();
  await page.locator(".m-sec-pick").getByRole("button", { name: "장소", exact: true }).click();

  const after = await page.locator(".m-sec .m-sec-type").allTextContents();
  expect(after.length).toBe(before.length + 1);
  expect(after[after.length - 1]).toBe("ending"); // the closing stays last
});

test("battle matchInfo has an inspector editor", async ({ page }) => {
  await openEditor(page, "jogi-battle");
  await openSheet(page, "내용");
  await expect(page.locator(".m-sheet.open").getByRole("heading", { name: "경기 정보" })).toBeVisible();
});

test("gaming champions has an inspector editor", async ({ page }) => {
  await openEditor(page, "lol-rank");
  await openSheet(page, "내용");
  await expect(page.locator(".m-sheet.open").getByRole("heading", { name: "챔피언" })).toBeVisible();
});

test("tapping a preview text field opens the 문구 스타일 panel", async ({ page }) => {
  await openEditor(page, "jisoo-minjun");
  await page.locator(".m-preview [data-edit]").first().tap();
  const panel = page.locator(".m-ts-float");
  await expect(panel).toBeVisible();
  await expect(panel.getByText("문구 스타일")).toBeVisible();
});
