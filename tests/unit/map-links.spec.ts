import { test, expect } from "@playwright/test";
import { locationAddress, locationQuery, mapHref, isCopyLabel } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

/** The location section's map buttons (지도앱 열기 / 주소 복사): address/query derivation and the
 * app-deep-linking web URL per provider, with proper query encoding. */
const loc = (o: object): LocationContent => o as unknown as LocationContent;

test.describe("locationAddress / locationQuery", () => {
  test("address prefers structured .a, else body text, else empty", () => {
    expect(locationAddress(loc({ address: { a: "서울 강남구 테헤란로 1" } }))).toBe("서울 강남구 테헤란로 1");
    expect(locationAddress(loc({ body: ["서울 마포구 와우산로 29길"] }))).toBe("서울 마포구 와우산로 29길");
    expect(locationAddress(loc({}))).toBe("");
  });
  test("query = venue title + address (both, then trimmed)", () => {
    expect(locationQuery(loc({ title: [["홍대 골목집"]], body: ["서울 마포구 와우산로 29길"] }))).toBe("홍대 골목집 서울 마포구 와우산로 29길");
    expect(locationQuery(loc({ title: [["홍대 골목집"]] }))).toBe("홍대 골목집");
    expect(locationQuery(loc({}))).toBe("");
  });
});

test.describe("mapHref", () => {
  const q = "강남역 포차거리";
  const enc = encodeURIComponent(q);
  test("routes by label; unknown/네이버/지도앱 → Naver", () => {
    expect(mapHref("카카오맵", q)).toBe(`https://map.kakao.com/?q=${enc}`);
    expect(mapHref("kakao", q)).toBe(`https://map.kakao.com/?q=${enc}`);
    expect(mapHref("구글 지도", q)).toBe(`https://www.google.com/maps/search/?api=1&query=${enc}`);
    expect(mapHref("google", q)).toBe(`https://www.google.com/maps/search/?api=1&query=${enc}`);
    expect(mapHref("지도앱 열기", q)).toBe(`https://map.naver.com/p/search/${enc}`);
    expect(mapHref("네이버지도", q)).toBe(`https://map.naver.com/p/search/${enc}`);
    expect(mapHref("아무거나", q)).toBe(`https://map.naver.com/p/search/${enc}`);
  });
  test("encodes the query; empty query → empty q", () => {
    expect(mapHref("카카오", "a b&c")).toBe(`https://map.kakao.com/?q=${encodeURIComponent("a b&c")}`);
    expect(mapHref("지도", "")).toBe("https://map.naver.com/p/search/");
  });
});

test("isCopyLabel detects copy buttons", () => {
  expect(isCopyLabel("주소 복사")).toBe(true);
  expect(isCopyLabel("copy address")).toBe(true);
  expect(isCopyLabel("지도앱 열기")).toBe(false);
});
