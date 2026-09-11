import { test, expect, type Page } from "@playwright/test";

/**
 * Mobile smoke: the /new wizard → editor happy path on an iPhone profile. Guards the mobile
 * behaviours we care about: the wizard's category taxonomy matches the /templates gallery, the
 * basics entered up front land in the editor (venue on the cover chip + WHERE card, not the
 * template sample), untouched template examples show as gray hints, inline tap-to-edit commits,
 * and the publish dialog opens and its 발행하기 button is reachable within the viewport.
 */

// The 8 categories shared with the /templates gallery (order matters).
const CATEGORIES = [
  "결혼 · 기념일",
  "생일 · 돌잔치",
  "집들이 · 홈파티",
  "스포츠 배틀",
  "게이밍 · 롤",
  "아웃도어",
  "취미 소모임",
  "파티 · 이벤트",
];

/** Advance the wizard, waiting for `expectVisible` to appear — retrying the click once, since the
 * step panels animate in and a single click can occasionally land before the panel is interactive. */
async function next(page: Page, expectVisible: ReturnType<Page["locator"]>) {
  const btn = page.getByRole("button", { name: /다음/ });
  await btn.click();
  try {
    await expectVisible.waitFor({ state: "visible", timeout: 6_000 });
  } catch {
    await btn.click();
    await expectVisible.waitFor({ state: "visible", timeout: 10_000 });
  }
}

/** Drive the /new wizard with a known event + basics, then open the editor. */
async function createFromWizard(page: Page) {
  await page.goto("/new", { waitUntil: "domcontentloaded" });
  const card = page.getByText("동호회 모임", { exact: true });
  await card.scrollIntoViewIfNeeded();
  await card.click();

  const title = page.getByPlaceholder("예: 지수 · 민준의 결혼식");
  await next(page, title); // step 1 → 2
  await title.fill("강남 번개모임");
  await page.getByPlaceholder(/저희의 시작/).fill("금요일 저녁 한잔");
  await page.locator('input[type="date"]').fill("2026-10-02");
  await page.locator('input[type="time"]').fill("19:30");
  await page.getByPlaceholder("장소명 · 주소").fill("강남역 포차거리");

  await next(page, page.getByRole("heading", { name: /스타일/ })); // step 2 → 3 (템플릿)
  await next(page, page.getByRole("button", { name: /에디터로 이동/ })); // step 3 → 4 (완료)
  await page.getByRole("button", { name: /에디터로 이동/ }).click();

  await page.waitForSelector(".ed-mobile", { timeout: 30_000 });
  await expect(page.locator('.ed-mobile [data-sec-id="cover"]')).toBeVisible();
}

test("Step 1 categories match the /templates gallery taxonomy", async ({ page }) => {
  await page.goto("/new", { waitUntil: "domcontentloaded" });
  const labels = page.locator(".egh-label");
  // 8 shared categories + the trailing 기타(Custom) group.
  await expect(labels).toHaveText([...CATEGORIES, "기타"]);
  // each of the 8 category headers carries an icon chip (visual parity with /templates)
  expect(await page.locator(".egh-icon").count()).toBeGreaterThanOrEqual(CATEGORIES.length);
});

test("wizard basics land in the editor; untouched examples are gray hints", async ({ page }) => {
  await createFromWizard(page);

  const details = page.locator('.ed-mobile [data-sec-id="details"]').first();
  // generous timeout: first /editor hit compiles on the dev server before the seed-applied render
  await expect(details).toContainText("강남역 포차거리", { timeout: 25_000 }); // wizard venue, not the 홍대 sample
  await expect(details).not.toContainText("홍대");

  // the wizard-filled venue chip is solid; an untouched example (the 2시간 chip) is ghosted
  await expect(page.locator('.ed-mobile [data-edit="badges.1.label"]').first()).not.toHaveClass(/iv-example/);
  await expect(page.locator('.ed-mobile [data-edit="badges.2.label"]').first()).toHaveClass(/iv-example/);
});

test("inline tap-to-edit commits a change in the preview", async ({ page }) => {
  await createFromWizard(page);
  // a solid (wizard-filled) field: place cursor at end and append, then commit with Enter.
  const chip = page.locator('.ed-mobile [data-edit="badges.1.label"]').first();
  await chip.tap();
  await page.keyboard.press("End");
  await page.keyboard.type(" (수정)");
  await page.keyboard.press("Enter");
  await expect(chip).toContainText("(수정)");
});

test("publish dialog opens on mobile and 발행하기 is reachable", async ({ page }) => {
  await createFromWizard(page);
  await page.locator('.ed-mobile button[aria-label="발행"]').click();

  const overlay = page.locator(".pub-overlay.open");
  await expect(overlay).toBeVisible();

  // scroll the modal to its footer; the publish button must sit within the viewport height.
  await page.locator(".pub-modal").evaluate((m) => (m.scrollTop = m.scrollHeight));
  const foot = page.getByRole("button", { name: /발행하기/ });
  await expect(foot).toBeVisible();
  const box = await foot.boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(vh + 1);
});
