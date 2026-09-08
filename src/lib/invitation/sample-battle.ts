import type { Invitation } from "./types";

export const battleSample: Invitation = {
  slug: "jogi-battle",
  theme: "battle",
  shareCta: "도전 응답",
  eventStart: "2027-04-18T07:00",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "battle_sports",
        eyebrow: "Official Challenge",
        headerLeft: "Match 003 · Battle",
        headerRightLines: ["2027 · 04 · 18", "SUN · 07:00 AM"],
        titleLines: [["조기축구"], [{ text: "배틀", em: true }]],
        subtitle: "2팀 · 90분 · 서울숲 축구장",
      },
    },
    {
      id: "versus",
      type: "versus",
      content: {
        eyebrow: "Matchup",
        title: [["홈 대 어웨이"]],
        vsWord: "VS",
        home: { flag: "호", name: "호랑이FC", meta: "HOME · 성수동", record: { w: "8", d: "2", l: "1" } },
        away: { flag: "번", name: "번개FC", meta: "AWAY · 연남동", record: { w: "6", d: "3", l: "2" } },
      },
    },
    {
      id: "match-info",
      type: "matchInfo",
      content: {
        title: "Match Details",
        cells: [
          { k: "Kickoff", v: [{ t: "07:00" }, { t: "AM", u: true }] },
          { k: "Duration", v: [{ t: "90" }, { t: "min", u: true }] },
          { k: "Format", v: [{ t: "11 " }, { t: "v", u: true }, { t: " 11" }] },
          { k: "Weather", v: [{ t: "Clear" }, { t: " · 12°C", u: true }] },
        ],
      },
    },
    {
      id: "countdown",
      type: "countdown",
      content: {
        label: "Kickoff In",
        cells: [
          { n: "03", l: "Days", warn: true },
          { n: "14", l: "Hrs" },
          { n: "28", l: "Min" },
          { n: "42", l: "Sec" },
        ],
      },
    },
    {
      id: "rules",
      type: "rules",
      content: {
        title: "Match Rules",
        rules: [
          { t: "공식 규정 준수", d: "FIFA 룰 기반 · 옐로/레드카드 정상 적용" },
          { t: "부상 방지 최우선", d: "과격한 태클 금지 · 준비운동 필수 · 페어플레이" },
          { t: "교체는 자유롭게", d: "체력 회복 필요 시 즉시 교체 가능" },
          { t: "승부 후엔 뒤끝 없이", d: "경기 후 팀별 회식 · 진 팀이 1차, 이긴 팀이 2차" },
        ],
        prize: { eb: "Prize", name: "우승컵 + 회식비 40만원", sub: "패자는 다음 경기 유니폼 세탁 담당" },
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "Where",
        title: [["서울숲 A구장"]],
        body: ["서울 성동구 뚝섬로 273 · 인조잔디 · 조명 완비"],
        mapButtons: [{ label: "지도앱 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "roster",
      type: "roster",
      content: {
        groups: [
          {
            title: "Home · 호랑이FC",
            players: [
              { num: "10", name: "김주장", role: "Captain · MF", badge: "C" },
              { num: "7", name: "이슛돌이", role: "Striker · 시즌 12골", badge: "GK" },
              { num: "4", name: "박수비", role: "Defender" },
              { num: "1", name: "최키퍼", role: "Goalkeeper" },
            ],
          },
          {
            title: "Away · 번개FC",
            players: [
              { num: "9", name: "정번개", role: "Captain · Striker", badge: "C" },
              { num: "11", name: "한윙어", role: "Winger" },
              { num: "6", name: "임미드필더", role: "Midfielder" },
            ],
          },
        ],
      },
    },
    {
      id: "accept",
      type: "accept",
      content: {
        title: [["받으시겠어요"], [{ text: "이 도전을?", em: true }]],
        sub: "참석 여부를 4월 13일까지 알려주세요",
        accept: "도전 받는다",
        decline: "다음에",
      },
    },
    {
      id: "ending",
      type: "ending",
      content: { stamp: "Challenge Sealed", signature: "도전", below: "MADE WITH 초대쿵" },
    },
  ],
};

/** Humorous 1v1 "맞짱 신청서" — a mock-formal duel challenge, reusing the battle theme. */
export const duelSample: Invitation = {
  slug: "matjjang",
  theme: "battle",
  shareCta: "맞짱 응답",
  eventStart: "2027-05-09T19:00",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "battle_sports",
        eyebrow: "선전포고 · 맞짱 신청서",
        headerLeft: "Duel No. 001",
        headerRightLines: ["2027 · 05 · 09", "SAT · 07:00 PM"],
        titleLines: [["피할 수 없는"], [{ text: "1대1 맞짱", em: true }]],
        subtitle: "변명·뒤끝·도망 전부 금지 — 자신 없으면 지금 꼬리 내려.",
      },
    },
    {
      id: "versus",
      type: "versus",
      content: {
        eyebrow: "누가 더 센가",
        title: [["도전자 대 도망자 후보"]],
        vsWord: "VS",
        home: { flag: "나", name: "천하무적 이 몸", meta: "CHALLENGER · 무패 신화", record: { w: "100", d: "0", l: "0" } },
        away: { flag: "너", name: "떨고 있는 그대", meta: "도망 확률 87%", record: { w: "0", d: "0", l: "99" } },
      },
    },
    {
      id: "match-info",
      type: "matchInfo",
      content: {
        title: "맞짱 상세",
        cells: [
          { k: "종목", v: [{ t: "니가 골라" }, { t: " 다 이김", u: true }] },
          { k: "판수", v: [{ t: "단판" }, { t: " 승부", u: true }] },
          { k: "상품", v: [{ t: "패자의" }, { t: " 자존심", u: true }] },
          { k: "각오", v: [{ t: "지면" }, { t: " 인정", u: true }] },
        ],
      },
    },
    {
      id: "countdown",
      type: "countdown",
      content: {
        label: "맞짱까지",
        cells: [
          { n: "03", l: "Days", warn: true },
          { n: "14", l: "Hrs" },
          { n: "28", l: "Min" },
          { n: "42", l: "Sec" },
        ],
      },
    },
    {
      id: "rules",
      type: "rules",
      content: {
        title: "맞짱 규칙",
        rules: [
          { t: "변명은 곧 항복", d: "'봐줬다' · '컨디션 안 좋았다' = 패배 인정으로 간주" },
          { t: "도망치면 영구 박제", d: "불참 시 단톡방에 '겁쟁이' 공지 · 재도전 3년 금지" },
          { t: "단판 승부", d: "질질 끌지 않는다 · 한 방에 끝낸다" },
          { t: "결과는 절대적", d: "진 사람은 두말없이 무릎 꿇고 인정한다" },
        ],
        prize: { eb: "Prize", name: "승자에게 하루 절대복종권", sub: "패자는 심부름·계산·뒷정리 풀세트" },
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "결투장",
        title: [["도망 못 가는 링 위"]],
        body: ["못 나오면 자동 기권 · 겁먹은 걸로 확정"],
        mapButtons: [{ label: "지도앱 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "accept",
      type: "accept",
      content: {
        title: [["받든가"], [{ text: "도망치든가", em: true }]],
        sub: "고민하는 순간, 이미 지고 있는 겁니다",
        accept: "맞짱 받는다",
        decline: "겁나서 도망",
      },
    },
    {
      id: "ending",
      type: "ending",
      content: { stamp: "맞짱 성립", signature: "맞짱", below: "MADE WITH 초대쿵" },
    },
  ],
};
