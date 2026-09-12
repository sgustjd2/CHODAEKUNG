import { test, expect } from "@playwright/test";
import { lineToText, getAtPath, flattenText } from "@/lib/invitation/path";

/** Pure helpers behind inline editing: flattening rich Lines (string | (string|Run)[]) to plain
 * text for comparison, and reading a value at a dot-path (numeric segments index arrays). */

test.describe("lineToText", () => {
  test("plain string passes through", () => {
    expect(lineToText("홍대 골목집")).toBe("홍대 골목집");
    expect(lineToText("")).toBe("");
  });
  test("Run[] joins text runs (ignores em), mixed with bare strings", () => {
    expect(lineToText(["a", { text: "b" }, "c"])).toBe("abc");
    expect(lineToText([{ text: "강조", em: true }, " 보통"])).toBe("강조 보통");
    expect(lineToText([])).toBe("");
  });
  test("missing/invalid run text → empty segment; non-line → empty string", () => {
    expect(lineToText([{ nope: 1 } as unknown as { text: string }, "x"])).toBe("x");
    expect(lineToText(42)).toBe("");
    expect(lineToText(null)).toBe("");
    expect(lineToText({ text: "not-an-array" })).toBe("");
  });
});

test.describe("getAtPath", () => {
  test("reads nested object keys", () => {
    expect(getAtPath({ a: { b: { c: 3 } } }, "a.b.c")).toBe(3);
    expect(getAtPath({ title: "hi" }, "title")).toBe("hi");
  });
  test("numeric segments index into arrays", () => {
    expect(getAtPath({ items: [{ t: "x" }, { t: "y" }] }, "items.1.t")).toBe("y");
    expect(getAtPath(["zero", "one"], "0")).toBe("zero");
  });
  test("missing keys and null along the path → undefined (no throw)", () => {
    expect(getAtPath({ a: 1 }, "a.z")).toBeUndefined();
    expect(getAtPath({ a: null }, "a.b")).toBeUndefined();
    expect(getAtPath(null, "a")).toBeUndefined();
    expect(getAtPath(undefined, "a.b.c")).toBeUndefined();
  });
});

test.describe("flattenText", () => {
  test("nullish → empty string", () => {
    expect(flattenText(null)).toBe("");
    expect(flattenText(undefined)).toBe("");
  });
  test("string passes through", () => {
    expect(flattenText("한 줄")).toBe("한 줄");
  });
  test("array of lines joins with newline; each line flattened", () => {
    expect(flattenText(["a", "b"])).toBe("a\nb");
    expect(flattenText([["x", { text: "y" }], "z"])).toBe("xy\nz");
    expect(flattenText([])).toBe("");
  });
  test("non-string/array leaf → empty string", () => {
    expect(flattenText(7)).toBe("");
    expect(flattenText({ a: 1 })).toBe("");
  });
});
