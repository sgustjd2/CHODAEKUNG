import type { CalendarDay, Invitation } from "./types";

// May 2026 grid (Sun-first); 24th marked today. (Static demo — real countdown/calendar later.)
const may2026: CalendarDay[] = [
  { n: 26, dim: true }, { n: 27, dim: true }, { n: 28, dim: true }, { n: 29, dim: true }, { n: 30, dim: true }, { n: 1 }, { n: 2 },
  { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 9 },
  { n: 10 }, { n: 11 }, { n: 12 }, { n: 13 }, { n: 14 }, { n: 15 }, { n: 16 },
  { n: 17 }, { n: 18 }, { n: 19 }, { n: 20 }, { n: 21 }, { n: 22 }, { n: 23 },
  { n: 24, today: true }, { n: 25 }, { n: 26 }, { n: 27 }, { n: 28 }, { n: 29 }, { n: 30 },
  { n: 31 }, { n: 1, dim: true }, { n: 2, dim: true }, { n: 3, dim: true }, { n: 4, dim: true }, { n: 5, dim: true }, { n: 6, dim: true },
];

export const romanticSample: Invitation = {
  slug: "jisoo-minjun",
  theme: "romantic",
  shareCta: "참석 답장",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "romantic_wedding",
        brand: "C · H · O · D · A · E · K · U · N · G",
        seal: "M",
        eyebrow: "Save the Date",
        names: ["지수", "민준"],
        connector: "&",
        dateLabel: "2026 · 05 · 24 · SAT",
      },
    },
    {
      id: "message",
      type: "message",
      content: {
        eyebrow: "Invitation",
        flourish: "✻",
        title: [["우리의 시작에"], [{ text: "초대합니다.", em: true }]],
        body: [
          "두 사람이 오래 걸어온 길의 끝에서",
          "새로운 시작을 함께 하려 합니다.",
          "소중한 분들의 축복 속에서",
          "작지만 따뜻한 하루를 열고 싶어요.",
        ],
      },
    },
    {
      id: "date",
      type: "date",
      content: {
        eyebrow: "The Date",
        title: [["2026. 05. 24"], ["Saturday ", { text: "12:00", em: true }]],
        calendar: {
          monthLabel: ["May ", { text: "2026", em: true }],
          weekdays: ["S", "M", "T", "W", "T", "F", "S"],
          days: may2026,
        },
        countdown: { days: 92, hrs: 14, min: 32, sec: 8 },
        tint: true,
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "Location",
        title: [["성수 ", { text: "가든", em: true }]],
        body: ["서울 성동구 성수동1가 685", "1층 야외 정원 · 지하 주차 가능"],
        flourishIcon: "ic-flower",
        mapButtons: [
          { label: "카카오맵" },
          { label: "네이버지도" },
          { label: "주소 복사", primary: true },
        ],
      },
    },
    {
      id: "gallery",
      type: "gallery",
      content: {
        eyebrow: "Gallery",
        title: [["우리의 ", { text: "순간들", em: true }]],
        images: [
          { src: "romantic_wedding", tall: true },
          { src: "wedding_gallery_1" },
          { src: "wedding_gallery_2" },
          { src: "hero_flatlay" },
          { src: "tmpl_bridalshower" },
        ],
      },
    },
    {
      id: "schedule",
      type: "schedule",
      content: {
        eyebrow: "Schedule",
        title: [["그날의 ", { text: "흐름", em: true }]],
        items: [
          { time: "11:30", title: "하객 입장", desc: "가든 로비에서 안내드립니다" },
          { time: "12:00", title: "본식 · 예식", desc: "1층 야외 정원" },
          { time: "12:45", title: "기념 촬영", desc: "가족, 친구 순서로 진행" },
          { time: "13:30", title: "피로연 · 식사", desc: "2층 다이닝홀 · 코스 요리" },
        ],
      },
    },
    {
      id: "rsvp",
      type: "rsvp",
      content: {
        eyebrow: "RSVP",
        title: [["참석해주실 ", { text: "거죠?", em: true }]],
        body: ["두 사람의 시작을 함께해주세요.", "여러분의 참석 여부를 알려주시면 감사하겠습니다."],
        options: ["참석", "미정", "불참"],
        defaultSelected: 0,
        tint: true,
      },
    },
    {
      id: "account",
      type: "account",
      content: {
        eyebrow: "Gift",
        title: [["마음 ", { text: "전하기", em: true }]],
        note: "축하의 마음을 전하고 싶으신 분들을 위해 계좌를 안내드립니다.",
        accounts: [
          { side: "신랑측", bank: "○○은행", number: "000-0000-0000", holder: "김민준" },
          { side: "신부측", bank: "○○은행", number: "000-0000-0000", holder: "이지수" },
        ],
      },
    },
    {
      id: "guestbook",
      type: "guestbook",
      content: {
        eyebrow: "Guestbook",
        title: [["축하 ", { text: "메시지", em: true }]],
        note: "두 사람에게 따뜻한 한마디를 남겨주세요.",
      },
    },
    {
      id: "ending",
      type: "ending",
      content: { flourish: "✻", signature: "with love,", names: "지수 & 민준" },
    },
  ],
};
