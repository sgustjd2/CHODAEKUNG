import { test, expect } from "@playwright/test";
import { blankInvitation, blankSection, exampleSection } from "@/lib/invitation/samples";
import { themeRegistry } from "@/components/viewer/section-registry";
import type { SectionType, ThemeId } from "@/lib/invitation/types";

/**
 * The editor with every section type a theme supports — each as the BLANK shell the section picker can
 * produce (listed first, so the inspector, which edits the first section of each type, renders the blank
 * variant) and as its example. The editor must open without crashing, render every inspector group, and
 * show every section in its preview. Companion to viewer-all-sections (which caught a blank timeline
 * dayPlan taking the whole page down); this covers the authoring side. Desktop layout: the inspector is
 * visible by default there. The draft is injected under the key /editor?slug= loads.
 */
test.use({ viewport: { width: 1400, height: 900 } });
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "timeline", "battle", "gaming", "developer"];

for (const theme of THEMES) {
  test(`editor opens with every ${theme} section (blank + example) without crashing`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const types = Object.keys(themeRegistry[theme]!).filter((t) => t !== "cover") as SectionType[];
    const slug = `editor-all-${theme}`;
    const draft = {
      ...blankInvitation(theme),
      slug,
      sections: [exampleSection("cover", theme), ...types.flatMap((t) => [blankSection(t), exampleSection(t, theme)])],
    };
    // Seed once (the editor autosaves back under the same key; don't clobber it on reloads).
    await page.addInitScript(([k, v]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, v); }, [`chodaekung:editor:v1:${slug}`, JSON.stringify({ draft })]);
    await page.goto(`/editor?slug=${slug}`, { waitUntil: "domcontentloaded" });

    const crashed = page.getByRole("heading", { name: "문제가 발생했어요" });
    await expect(page.locator(".ed-desktop .col-inspector").or(crashed).first()).toBeVisible({ timeout: 30_000 });
    expect(await crashed.count(), `${theme}: the editor crashed — ${errors.join(" | ")}`).toBe(0);

    // every section is rendered in the editor preview (none silently dropped)
    await expect
      .poll(async () => new Set(await page.locator(".ed-desktop [data-sec-id]").evaluateAll((els) => els.map((e) => e.getAttribute("data-sec-id")))).size)
      .toBe(draft.sections.length);
    // an inspector group per section type is on screen (+ the fixed text-style / calendar groups)
    expect(await page.locator(".col-inspector .insp-group").count()).toBeGreaterThanOrEqual(types.length + 1);
    expect(errors, `${theme}: runtime errors`).toEqual([]);
  });
}
