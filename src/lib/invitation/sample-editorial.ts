import type { Invitation } from "./types";

/**
 * Editorial sample (design/13_viewer_editorial.html) — magazine/film party invite.
 * Theme "editorial": issue numbers, serif italics, film grain, magazine grid.
 */
export const editorialSample: Invitation = {
  slug: "after-hours",
  theme: "editorial",
  shareCta: "RSVP",
  sections: [
    {
      id: "e-cover",
      type: "cover",
      content: {
        image: "editorial_party",
        headerLeft: "Issue No. 03 · Party",
        headerRightLines: ["2026 · 03 · 28", "Sat · 20:00"],
        eyebrow: "The Invitation",
        titleLines: ["After", [{ text: "Hours.", em: true }]],
        coverSub: { l: "A Rooftop Party", r: "Vol. 03 · Spring" },
      },
    },
    {
      id: "e-note",
      type: "message",
      content: {
        num: "01",
        eyebrow: "Editor's Note · Invitation",
        title: [["봄이 ", { text: "완전히", em: true }], "도착한 밤에."],
        dropCap: "해",
        body: [
          "가 완전히 넘어간 뒤, 낯익은 얼굴들이 한 곳에 모이는 시간. 겨울 내내 참아왔던 잔을 부딪치고, 봄바람이 지나가는 옥상에서 우리는 조금 더 오래 웃기로 했습니다.",
          "이번 봄, 짧은 시간이지만 진심으로 반가운 자리를 만들려 합니다. 자리는 넉넉하고 이야기는 넘칠 예정이니, 편안한 마음으로 놀러오세요.",
        ],
      },
    },
    {
      id: "e-details",
      type: "details",
      content: {
        num: "02",
        eyebrow: "The Details",
        title: [["언제 · 어디서 · ", { text: "어떻게", em: true }]],
        tint: true,
        info: [
          { k: "Date", v: "2026. 03. 28 · Sat" },
          { k: "Time", v: "저녁 8시 — 자정" },
          { k: "Venue", v: "한남동 · Rooftop Bar HAZE" },
          { k: "Dress", v: "Cocktail · Smart Casual" },
          { k: "Bring", v: "좋은 기분 · 그 외엔 없음" },
        ],
      },
    },
    {
      id: "e-loc",
      type: "location",
      content: {
        num: "03",
        eyebrow: "Location",
        title: [["한남동에서 ", { text: "가장", em: true }], "낮게 뜬 별."],
        body: ["한남대로에서 두 블록 안쪽, 오래된 벽돌 건물 6층. 엘리베이터에서 내리면 나무 문이 있어요. 문을 열면 옥상, 옥상 너머는 강."],
        photo: "editorial_party",
        photoCap: { l: "Photo · Rooftop Bar HAZE", r: "Location 03" },
        mapButtons: [{ label: "지도 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    { id: "e-quote", type: "quote", content: { text: ["어떤 밤은 오래도록", "말하고 싶어진다."] } },
    {
      id: "e-gallery",
      type: "gallery",
      content: {
        num: "04",
        eyebrow: "Gallery · Last Year",
        title: [["지난해의 ", { text: "기억", em: true }]],
        images: [
          { src: "editorial_party" },
          { src: "tmpl_yearend" },
          { src: "wedding_gallery_2" },
          { src: "hero_flatlay" },
          { src: "romantic_wedding" },
        ],
        caption: { l: "Vol. 02 · Winter Chapter", r: "Photos · 24" },
      },
    },
    {
      id: "e-rsvp",
      type: "rsvp",
      content: {
        num: "05",
        eyebrow: "RSVP",
        title: [["답장이 ", { text: "필요해요", em: true }]],
        body: ["3월 20일까지 참석 여부를 답해주세요. 카운터에 이름을 남겨놓을게요."],
        innerTitle: [["Will you ", { text: "join us", em: true }, "?"]],
        options: ["Yes", "Maybe", "No"],
        defaultSelected: 0,
      },
    },
    {
      id: "e-ending",
      type: "ending",
      content: {
        huge: ["SEE YOU", [{ text: "after hours.", em: true }]],
        colophon: ["CHODAEKUNG · VOL 03 · 2026", "A ROOFTOP PARTY · SPRING EDITION", "MADE WITH LOVE IN SEOUL"],
      },
    },
  ],
};
