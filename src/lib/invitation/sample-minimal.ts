import type { Invitation } from "./types";

export const minimalSample: Invitation = {
  slug: "appa-60",
  theme: "minimal",
  shareCta: "참석 답장",
  eventStart: "2027-06-15T12:00",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "minimal_birthday",
        eyebrow: "",
        headerLeft: "#001 · Birthday",
        headerRight: "MOI · 2027",
        titleLines: [["아빠의"], ["60번째"], ["생신."]],
        subtitle: "6월 15일 · 저녁 6시 30분",
      },
    },
    {
      id: "message",
      type: "message",
      content: {
        eyebrow: "Invitation",
        title: [["가족들과"], ["조용한 저녁을."]],
        body: [
          ["올해로 ", { text: "60번째 생신", em: true }, "을 맞으신 아버지와"],
          "소중한 가족, 친척, 오랜 친구분들이 모여",
          "한 자리에서 저녁을 나누고자 합니다.",
        ],
      },
    },
    {
      id: "date",
      type: "date",
      content: {
        eyebrow: "Details",
        title: [],
        tint: true,
        bigDate: ["06", "15"],
        dataGrid: [
          { k: "Day", en: "MON", v: " · 월요일" },
          { k: "Time", en: "18:30", v: " KST" },
          { k: "D-Day", en: "D-114" },
          { k: "Dress", v: "Semi-formal" },
        ],
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "Location",
        title: [["서울 · 광화문"], ["THE PLAZA"]],
        body: [
          [{ text: "서울시 중구 태평로2가 23", em: true }],
          "5층 · 목련 홀 · 개별 룸",
          "지하 주차 3시간 무료",
        ],
        mapButtons: [{ label: "지도앱 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "schedule",
      type: "schedule",
      content: {
        eyebrow: "Schedule",
        title: [["그날의 "], ["순서."]],
        items: [
          { time: "18:00", title: "환영 · 웰컴 드링크", desc: "1층 로비", duration: "30M" },
          { time: "18:30", title: "저녁 식사 시작", desc: "코스 요리 · 5course", duration: "1H" },
          { time: "19:30", title: "축하 케이크 컷팅", desc: "가족 사진 촬영", duration: "30M" },
          { time: "20:00", title: "환담 · 티타임", desc: "디저트 & 자유롭게", duration: "1H" },
        ],
      },
    },
    {
      id: "gallery",
      type: "gallery",
      content: {
        eyebrow: "Gallery",
        title: [["시간의"], ["기록."]],
        images: [{ src: "minimal_birthday" }, { src: "hero_flatlay" }, { src: "tmpl_seminar" }],
      },
    },
    {
      id: "rsvp",
      type: "rsvp",
      content: {
        eyebrow: "RSVP",
        title: [["참석"], ["여부."]],
        body: [["준비를 위해 ", { text: "6월 5일까지", em: true }], "참석 여부를 알려주세요."],
        options: ["참석", "미정", "불참"],
        optionSubs: ["Attend", "Maybe", "Decline"],
        defaultSelected: 0,
      },
    },
    {
      id: "guestbook",
      type: "guestbook",
      content: { eyebrow: "Guestbook", title: [["축하 ", { text: "한마디", em: true }]], note: "따뜻한 축하 메시지를 남겨주세요." },
    },
    {
      id: "ending",
      type: "ending",
      content: { huge: [["THANK"], ["YOU", { text: ".", em: true }]], below: "Family · Friends · Love" },
    },
  ],
};
