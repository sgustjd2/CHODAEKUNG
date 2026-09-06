import type { Invitation } from "./types";

/**
 * Cute sample (design/12_viewer_cute.html) — warm pastel housewarming with the MOMO mascot.
 * Theme "cute": rounded cards, colored eyebrow pills, notice list.
 */
export const cuteSample: Invitation = {
  slug: "cozy-home",
  theme: "cute",
  shareCta: "참석 답장",
  sections: [
    {
      id: "c-cover",
      type: "cover",
      content: {
        image: "",
        mascot: "momo-party",
        eyebrow: "Housewarming Party",
        titleLines: ["새 집으로", ["이사했", { text: "어요!", em: true }]],
        subtitleLines: ["따뜻한 차 한잔 하러", "놀러오지 않을래요?"],
      },
    },
    {
      id: "c-date",
      type: "date",
      content: {
        eyebrow: "When · 일시",
        title: ["2026. 04. 05", [{ text: "일요일", em: true }, " 오후 3시"]],
        pill: { en: "D-42", text: "· 남았어요" },
        countdown: { days: 42, hrs: 8, min: 15, sec: 0 },
      },
    },
    {
      id: "c-loc",
      type: "location",
      content: {
        eyebrow: "Where · 장소",
        title: [["우리의 ", { text: "새 집", em: true }]],
        body: [],
        photo: "cute_housewarming",
        address: { t: "서울 마포구 연남로 12길", a: "301호 · 3층 · 엘리베이터 있음" },
        mapButtons: [{ label: "지도앱" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "c-notice",
      type: "notice",
      content: {
        eyebrow: "Notice · 안내",
        title: [["알아두면 ", { text: "좋아요", em: true }]],
        items: [
          { icon: "ic-car", tone: "ink", t: "주차", d: "건물 지하 2시간 무료 · 이후 시간당 3천원" },
          { icon: "ic-cake", tone: "rose", t: "준비물", d: "빈손도 좋아요. 하지만 케이크는 환영해요 :)" },
          { icon: "ic-cat", tone: "sage", t: "고양이가 살아요", d: "모모라는 흰색 고양이가 있어요. 놀라지 마세요." },
          { icon: "ic-shirt", tone: "lav", t: "드레스 코드", d: "편안하게 · 슬리퍼도 좋아요" },
        ],
      },
    },
    {
      id: "c-gallery",
      type: "gallery",
      content: {
        eyebrow: "Gallery · 새 집 구경",
        title: [["방마다 ", { text: "다른", em: true }, " 이야기"]],
        images: [
          { src: "cute_housewarming" },
          { src: "tmpl_doljanchi" },
          { src: "hero_flatlay" },
          { src: "minimal_birthday" },
          { src: "tmpl_bridalshower" },
          { src: "tmpl_seminar" },
        ],
      },
    },
    {
      id: "c-rsvp",
      type: "rsvp",
      content: {
        eyebrow: "RSVP",
        title: ["올 수 있어요?"],
        body: ["준비할 게 있어서 미리 알려주면 정말 고마울 것 같아요 :)"],
        options: ["갈게요", "미정", "못가요"],
        defaultSelected: 0,
      },
    },
    { id: "guestbook", type: "guestbook", content: { eyebrow: "Guestbook", title: [["방명록"]], note: "집들이 방문 인사를 남겨주세요 🏡" } },
    { id: "c-ending", type: "ending", content: { signature: "See you at home", names: "지수 & 모모" } },
  ],
};
