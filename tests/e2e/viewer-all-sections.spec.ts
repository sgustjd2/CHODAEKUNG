import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankInvitation, blankSection, exampleSection, sampleInvitations } from "@/lib/invitation/samples";
import { themeRegistry } from "@/components/viewer/section-registry";
import type { Section, SectionType, ThemeId } from "@/lib/invitation/types";

/**
 * Every section a theme can render — each as its example AND as the blank shell the editor creates — plus
 * every generic cover layout and the shared sections, on every theme, with the default palette and a pale
 * custom accent. Must render without crashing the viewer (a blank timeline dayPlan used to throw and take
 * the whole invitation down to the error page) and be AA (critical + serious = 0). The bundled samples
 * only exercise a subset of these combinations, which is where earlier bugs hid.
 */
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "timeline", "battle", "gaming", "developer"];
const SHARED = new Set(["dday", "attendees", "account", "guestbook"]);
const shared = sampleInvitations["jisoo-minjun"].sections.filter((s) => SHARED.has(s.type));
const LAYOUTS = ["photo-bottom", "photo-center", "split", "text"] as const;

async function blocking(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.impact}:${v.id} → ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

for (const theme of THEMES) {
  for (const accent of [undefined, "#F5D896"]) {
    test(`${theme}${accent ? ` + accent ${accent}` : ""}: every section (example + blank) and cover layout renders, AA`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const cover = exampleSection("cover", theme);
      const types = Object.keys(themeRegistry[theme]!).filter((t) => t !== "cover" && !SHARED.has(t)) as SectionType[];
      const sections: Section[] = [
        cover,
        ...LAYOUTS.map((layout, i) => ({ ...structuredClone(cover), id: `gcover-${i}`, content: { ...(cover.content as object), layout } }) as Section),
        ...types.flatMap((t) => [exampleSection(t, theme), blankSection(t)]),
        ...shared,
      ];
      const slug = `all-${theme}-${accent?.slice(1) ?? "default"}`;
      const draft = { ...blankInvitation(theme), slug, accent, sections };
      await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [`chodaekung:editor:v1:${slug}`, JSON.stringify({ draft })]);
      await page.goto(`/preview?slug=${slug}`, { waitUntil: "domcontentloaded" });

      const crashed = page.getByRole("heading", { name: "문제가 발생했어요" });
      await expect(page.locator(".acc-copy").first().or(crashed)).toBeVisible();
      expect(await crashed.count(), `${theme}: a section crashed the viewer — ${errors.join(" | ")}`).toBe(0);
      expect(errors, `${theme}: runtime errors`).toEqual([]);

      await page.waitForTimeout(300);
      expect(await blocking(page), `${theme}${accent ? ` + ${accent}` : ""}`).toEqual([]);
    });
  }
}
