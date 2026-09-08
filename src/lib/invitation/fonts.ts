/**
 * Selectable invitation fonts (used by both the editor picker and the viewer).
 * `stack` is the CSS font-family value; `google` (if set) is the Google Fonts family query
 * loaded on demand — Google auto-subsets by unicode-range, so only used glyphs download.
 * The default (Pretendard) is already loaded globally and needs no `google`.
 */
export const FONTS: { id: string; label: string; stack: string; google?: string }[] = [
  { id: "pretendard", label: "기본", stack: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" },
  { id: "myeongjo", label: "명조", stack: "'Nanum Myeongjo', serif", google: "Nanum+Myeongjo:wght@400;700;800" },
  { id: "gowun", label: "고운바탕", stack: "'Gowun Batang', serif", google: "Gowun+Batang:wght@400;700" },
  { id: "gaegu", label: "손글씨", stack: "'Gaegu', cursive", google: "Gaegu:wght@400;700" },
  { id: "jua", label: "둥근", stack: "'Jua', sans-serif", google: "Jua" },
  { id: "blackhan", label: "굵게", stack: "'Black Han Sans', sans-serif", google: "Black+Han+Sans" },
];

export const fontById = (id?: string) => FONTS.find((f) => f.id === id);
export const googleFontHref = (google: string) => `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
