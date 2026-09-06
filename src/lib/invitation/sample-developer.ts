import type { Invitation } from "./types";

/**
 * Developer sample (design/14_viewer_developer.html) — terminal/monospace invite.
 * Theme "developer": ANSI colors, JSON payload, ASCII banner, CRT scanlines.
 * Fits dev meetups / study-group meetups.
 */
export const developerSample: Invitation = {
  slug: "dev-meetup",
  theme: "developer",
  shareCta: "rsvp",
  eventStart: "2027-04-11T19:00",
  sections: [
    {
      id: "d-cover",
      type: "cover",
      content: {
        image: "",
        eyebrow: "",
        from: "jisu",
        json: [
          { k: "event", v: "Spring Dev Meetup 2027", t: "str" },
          { k: "host", v: "@jisu · Frontend Guild", t: "str" },
          { k: "date", v: "2027-04-11T19:00+09:00", t: "date" },
          { k: "venue", v: "성수동 스타트업 캠퍼스", t: "str" },
          { k: "topic", v: "React 19 · Server Components", t: "str" },
          { k: "capacity", v: "42", t: "num" },
          { k: "snacks", v: "true", t: "bool" },
        ],
      },
    },
    {
      id: "d-date",
      type: "date",
      content: {
        eyebrow: "datetime",
        title: [],
        countdown: { days: 32, hrs: 0, min: 0, sec: 0 },
        bigDate: ["04", "11"],
        subLabel: "SUN · 19:00 KST",
        dataGrid: [
          { k: "day", v: "Sunday" },
          { k: "start", v: "19:00" },
          { k: "end", v: "22:00 (3h)" },
          { k: "tz", v: "Asia/Seoul (UTC+9)" },
        ],
      },
    },
    {
      id: "d-loc",
      type: "location",
      content: {
        eyebrow: "location",
        title: [],
        body: [],
        rows: [
          { k: "venue", v: "성수동 스타트업 캠퍼스" },
          { k: "addr", v: "서울 성동구 성수이로 113" },
          { k: "floor", v: "3층 · Auditorium" },
          { k: "lat", v: "37.54432" },
          { k: "lng", v: "127.05678" },
        ],
        mapButtons: [{ label: "$ kakaomap" }, { label: "$ copy-addr", primary: true }],
      },
    },
    {
      id: "d-schedule",
      type: "schedule",
      content: {
        eyebrow: "schedule",
        title: [],
        items: [
          { time: "19:00", title: "Doors open · welcome drinks", desc: "" },
          { time: "19:30", title: "Talk 01 · React 19 이야기", desc: "" },
          { time: "20:15", title: "Talk 02 · Server Components", desc: "" },
          { time: "21:00", title: "Q&A · networking · afterparty", desc: "" },
        ],
      },
    },
    {
      id: "d-gallery",
      type: "gallery",
      content: {
        eyebrow: "gallery",
        title: [],
        images: [{ src: "developer_terminal" }, { src: "tmpl_seminar" }, { src: "tmpl_yearend" }],
      },
    },
    {
      id: "d-rsvp",
      type: "rsvp",
      content: {
        eyebrow: "rsvp",
        title: ["will_you_attend"],
        body: [],
        options: ["yes · 참석", "maybe · 미정", "no · 불참"],
        defaultSelected: 0,
        progress: { filled: 32, total: 42 },
      },
    },
    { id: "d-ending", type: "ending", content: { signature: "see you there" } },
  ],
};
