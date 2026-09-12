import { test, expect } from "@playwright/test";

/**
 * Dead share links & unknown routes → the branded 404 (not a crash or a stray sample). A recipient
 * of an expired/mistyped invitation link should get a friendly page with a way home. HTTP status
 * must be 404 (correct for crawlers/caches), not 200.
 */
test.describe("not-found", () => {
  test("unknown invitation slug → 404 branded page with a home link", async ({ page }) => {
    const res = await page.goto("/i/zzz-does-not-exist-1234", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "초대장을 찾을 수 없어요" })).toBeVisible();
    await expect(page.getByRole("link", { name: "초대쿵 홈으로" })).toHaveAttribute("href", "/");
  });

  test("unknown route → 404 branded page", async ({ page }) => {
    const res = await page.goto("/zzz-nope-nope", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "초대장을 찾을 수 없어요" })).toBeVisible();
  });

  test("a valid published sample resolves 200 (control)", async ({ page }) => {
    const res = await page.goto("/i/jisoo-minjun", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
  });

  test("home link recovers to the landing page", async ({ page }) => {
    await page.goto("/i/zzz-does-not-exist-1234", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "초대쿵 홈으로" }).click();
    await expect(page.locator(".hero-title")).toBeVisible();
  });
});
