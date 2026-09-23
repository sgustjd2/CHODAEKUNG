import type { Page } from "@playwright/test";

/**
 * Wait until the element matching `selector` has been hydrated by React.
 *
 * /editor and /new are statically prerendered: their controls — and even a default editor preview — are
 * VISIBLE in the server HTML before React attaches event handlers, and a click in that window is silently
 * dropped. That was the cause of editor tests failing on slower (local Windows) machines while passing in
 * CI: waiting for something to be *visible* is not a readiness signal on these pages. React tags every
 * element it manages with a `__reactProps$…` key once hydrated, so wait for that on the element you'll
 * interact with (selective hydration can reach different subtrees at different times).
 */
export async function waitForHydration(page: Page, selector: string, timeout = 30_000): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps$"));
    },
    selector,
    { timeout },
  );
}
