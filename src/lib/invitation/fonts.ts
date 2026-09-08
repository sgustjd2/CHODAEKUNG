/**
 * Selectable invitation fonts (used by both the editor picker and the viewer).
 * `stack` is the CSS font-family value; `google` (if set) is the Google Fonts family query
 * loaded on demand — Google auto-subsets by unicode-range, so only used glyphs download.
 * The default (Pretendard) is already loaded globally and needs no `google`.
 */
export const FONTS: { id: string; label: string; stack: string; google?: string }[] = [
  { id: "pretendard", label: "기본", stack: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" },
  { id: "nanumgothic", label: "고딕", stack: "'Nanum Gothic', sans-serif", google: "Nanum+Gothic:wght@400;700;800" },
  { id: "myeongjo", label: "명조", stack: "'Nanum Myeongjo', serif", google: "Nanum+Myeongjo:wght@400;700;800" },
  { id: "gowun", label: "고운바탕", stack: "'Gowun Batang', serif", google: "Gowun+Batang:wght@400;700" },
  { id: "songmyung", label: "송명", stack: "'Song Myung', serif", google: "Song+Myung" },
  { id: "jua", label: "둥근", stack: "'Jua', sans-serif", google: "Jua" },
  { id: "dongle", label: "동글", stack: "'Dongle', sans-serif", google: "Dongle:wght@300;400;700" },
  { id: "dohyeon", label: "도현", stack: "'Do Hyeon', sans-serif", google: "Do+Hyeon" },
  { id: "blackhan", label: "굵게", stack: "'Black Han Sans', sans-serif", google: "Black+Han+Sans" },
  { id: "gaegu", label: "손글씨", stack: "'Gaegu', cursive", google: "Gaegu:wght@400;700" },
  { id: "nanumpen", label: "펜글씨", stack: "'Nanum Pen Script', cursive", google: "Nanum+Pen+Script" },
  { id: "gamja", label: "감자꽃", stack: "'Gamja Flower', cursive", google: "Gamja+Flower" },
];

export const fontById = (id?: string) => FONTS.find((f) => f.id === id);
export const googleFontHref = (google: string) => `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
