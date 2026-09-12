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

test("a duplicated section is independently editable via the inspector", async ({ page }) => {
  await openEditor(page, "jisoo-minjun"); // romantic: has a schedule with items
  // item count of each schedule section in the preview (the copy's id starts with "schedule" too)
  const scheduleItemCounts = () =>
    page.evaluate(() =>
      [...document.querySelectorAll(".m-preview [data-sec-id]")]
        .filter((w) => (w.getAttribute("data-sec-id") || "").startsWith("schedule"))
        .map((w) => new Set([...w.querySelectorAll("[data-edit]")].map((e) => (e.getAttribute("data-edit") || "").match(/^items\.(\d+)/)?.[1]).filter(Boolean)).size),
    );

  await openSheet(page, "섹션");
  await row(page, "schedule").locator('button[aria-label="복제"]').click();
  await expect(row(page, "schedule")).toHaveCount(2);
  const dup = await scheduleItemCounts();
  expect(dup.length).toBe(2);
  expect(dup[0]).toBe(dup[1]); // fresh copy is identical

  // select the SECOND schedule (the copy), then add an item to it via the inspector
  await row(page, "schedule").nth(1).click();
  await openSheet(page, "내용");
  await page.locator(".m-sheet.open").getByRole("button", { name: /일정 추가/ }).click();
  await page.locator(".m-sheet-close").click();

  // exactly the copy grew — the inspector targeted the selected instance, not the first-of-type
  const after = await scheduleItemCounts();
  expect(after.filter((n) => n === dup[0] + 1)).toHaveLength(1);
  expect(after.filter((n) => n === dup[0])).toHaveLength(1);
});

test("picking a cover photo on a text-cover theme switches to a photo layout", async ({ page }) => {
  await openEditor(page, "jibdeuli"); // timeline: its theme cover is text/badge (.tl-cover), no photo
  await expect(page.locator(".m-preview .tl-cover")).toBeVisible();
  await expect(page.locator(".m-preview .gcover")).toHaveCount(0);

  await openSheet(page, "디자인");
  await page.locator(".m-sheet.open .m-thumbs .m-thumb").first().click();
  await page.locator(".m-sheet-close").click();

  // the pick is now visible: the cover renders via the shared GenericCover (a photo layout)
  await expect(page.locator(".m-preview .gcover")).toBeVisible();
});

test("hiding a section removes it from the preview", async ({ page }) => {
  await openEditor(page, "jisoo-minjun");
  await openSheet(page, "섹션");
  const previewSections = page.locator(".m-preview [data-sec-id]");
  const before = await previewSections.count();
  await row(page, "gallery").locator('button[aria-label="숨김"]').click();
  await expect(previewSections).toHaveCount(before - 1); // excluded from the preview (and publish)
});

test("applying an accent color updates the invitation", async ({ page }) => {
  await openEditor(page, "jisoo-minjun");
  await openSheet(page, "디자인");
  const swatch = page.locator(".m-sheet.open .m-color:not(.m-color-none)").first();
  const color = (await swatch.getAttribute("aria-label")) ?? "";
  await swatch.click();
  const wax = await page.evaluate(() =>
    getComputedStyle(document.querySelector(".m-preview .iv") as Element).getPropertyValue("--wax").trim(),
  );
  expect(wax.toLowerCase()).toBe(color.toLowerCase());
});

test('matchInfo "+ 항목 추가" adds a cell to the section', async ({ page }) => {
  await openEditor(page, "jogi-battle");
  await openSheet(page, "내용");
  const cells = page.locator(".m-preview .ivb-info-cell");
  const before = await cells.count();
  const group = page.locator(".m-sheet.open .insp-group").filter({ has: page.getByRole("heading", { name: "경기 정보" }) });
  await group.getByRole("button", { name: /항목 추가/ }).click();
  await expect(cells).toHaveCount(before + 1);
});
