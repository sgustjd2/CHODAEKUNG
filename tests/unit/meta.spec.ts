import { test, expect } from "@playwright/test";
import { lineText, invitationMeta } from "@/lib/invitation/meta";
import type { Invitation } from "@/lib/invitation/types";

/**
 * Share/OG metadata derived from invitation content (public page <title>/description, KakaoTalk +
 * copy share, OG card). lineText flattens rich Line[]; invitationMeta picks the title/description/
 * image with sensible fallbacks.
 */
const inv = (sections: unknown[]): Invitation => ({ slug: "t", theme: "romantic", sections } as unknown as Invitation);

test.describe("lineText", () => {
  test("flattens strings, runs, and mixed lines; trims", () => {
    expect(lineText(undefined)).toBe("");
    expect(lineText(["A", "B"])).toBe("A B");
    expect(lineText([["Hello ", { text: "world", em: true }]])).toBe("Hello world");
    expect(lineText(["첫줄", ["둘째 ", { text: "강조" }]])).toBe("첫줄 둘째 강조");
    expect(lineText([" 여백 "])).toBe("여백");
  });
});

test.describe("invitationMeta", () => {
  test("title from cover names (blank names dropped)", () => {
    const m = invitationMeta(inv([{ id: "c", type: "cover", content: { names: ["지수", "  ", "민준"], image: "" } }]));
    expect(m.title).toBe("지수 · 민준");
  });

  test("title falls back names → titleLines → default", () => {
    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { titleLines: [["오늘 ", { text: "번개" }]], image: "" } }])).title).toBe("오늘 번개");
    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { image: "" } }])).title).toBe("초대장");
    expect(invitationMeta(inv([])).title).toBe("초대장"); // no cover
  });

  test("image: bare name → /assets path, absolute URL kept, none → hero_flatlay", () => {
    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { image: "romantic_wedding" } }])).image).toBe("/assets/photos/romantic_wedding.jpg");
    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { image: "https://cdn.example.com/x.jpg" } }])).image).toBe("https://cdn.example.com/x.jpg");
    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { image: "" } }])).image).toBe("/assets/photos/hero_flatlay.jpg");
  });

  test("description joins date + location titles, else a default", () => {
    const m = invitationMeta(inv([
      { id: "c", type: "cover", content: { names: ["지수"], image: "" } },
      { id: "d", type: "date", content: { title: [["2026. 10. 02"]] } },
      { id: "l", type: "location", content: { title: [["강남역 포차거리"]] } },
    ]));
    expect(m.description).toBe("2026. 10. 02 · 강남역 포차거리");

    expect(invitationMeta(inv([{ id: "c", type: "cover", content: { names: ["지수"], image: "" } }])).description)
      .toBe("초대장을 확인하고 참석 여부를 알려주세요.");
  });
});
