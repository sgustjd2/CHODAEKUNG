import { test, expect } from "@playwright/test";
import { textStyleCss, isEmptyTextStyle, mergeTextStyle } from "@/lib/invitation/text-style";

/** Per-field text styling (문구별 스타일): TextStyle → inline CSS, empty detection, and the
 * edit-merge that drops no-op overrides so the data stays clean. */
test.describe("textStyleCss", () => {
  test("empty / no-op → undefined", () => {
    expect(textStyleCss(undefined)).toBeUndefined();
    expect(textStyleCss({})).toBeUndefined();
    expect(textStyleCss({ size: 1 })).toBeUndefined(); // size 1 = no change
  });
  test("maps size (em) / color / bold / italic", () => {
    expect(textStyleCss({ size: 1.3 })).toEqual({ fontSize: "1.3em" });
    expect(textStyleCss({ color: "#E38B8B" })).toEqual({ color: "#E38B8B" });
    expect(textStyleCss({ bold: true, italic: true })).toEqual({ fontWeight: 700, fontStyle: "italic" });
  });
  test("font: known id → its stack; unknown id ignored", () => {
    expect(textStyleCss({ font: "myeongjo" })).toEqual({ fontFamily: "'Nanum Myeongjo', serif" });
    expect(textStyleCss({ font: "does-not-exist" })).toBeUndefined();
  });
});

test("isEmptyTextStyle — true for empty/no-op, false for any override", () => {
  expect(isEmptyTextStyle(undefined)).toBe(true);
  expect(isEmptyTextStyle({})).toBe(true);
  expect(isEmptyTextStyle({ size: 1 })).toBe(true);
  expect(isEmptyTextStyle({ size: 1.3 })).toBe(false);
  expect(isEmptyTextStyle({ color: "#f00" })).toBe(false);
  expect(isEmptyTextStyle({ bold: true })).toBe(false);
});

test.describe("mergeTextStyle", () => {
  test("null clears the field", () => {
    expect(mergeTextStyle({ bold: true }, null)).toBeUndefined();
  });
  test("merges partial and sets a value", () => {
    expect(mergeTextStyle({ bold: true }, { italic: true })).toEqual({ bold: true, italic: true });
    expect(mergeTextStyle(undefined, { size: 1.3 })).toEqual({ size: 1.3 });
  });
  test("drops no-op values → undefined when nothing remains", () => {
    expect(mergeTextStyle({ color: "#f00" }, { color: "" })).toBeUndefined(); // cleared the only override
    expect(mergeTextStyle({ bold: true }, { bold: false })).toBeUndefined();
    expect(mergeTextStyle({ size: 1 }, {})).toBeUndefined(); // size 1 is a no-op
  });
});
