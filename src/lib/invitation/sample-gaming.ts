import type { Invitation } from "./types";

/**
 * Gaming / 롤 파티 samples (design/17_viewer_gaming.html).
 * Three scenarios: 빠른대전 · 내전 5v5 · 랭크 파티 — all theme "gaming".
 */

const quick: Invitation = {
  slug: "lol-quick",
  theme: "gaming",
  shareCta: "참전",
  sections: [
    {
      id: "q-cover",
      type: "cover",
      content: {
        image: "tmpl_gaming",
        headerLeft: "Quick Match · Live",
        headerRightLines: ["TONIGHT", "21:00 KST"],
        eyebrow: "Party Invitation",
        titleLines: [["오늘 밤 ", { text: "빠대?", em: true }]],
        subtitleLines: ["5인 파티 · 3자리 남음 · 노말 or ARAM"],
      },
    },
    {
      id: "q-info",
      type: "gInfo",
      content: {
        eyebrow: "Match Info",
        title: [["오늘 ", { text: "방침", em: true }]],
        cells: [
          { k: "Kickoff", v: "21:00", u: "KST" },
          { k: "Mode", v: "노말", u: " · ARAM" },
          { k: "Games", v: "3", u: "판 예상" },
          { k: "Voice", v: "Discord", u: " · #롤방" },
        ],
      },
    },
    {
      id: "q-countdown",
      type: "countdown",
      content: {
        label: "",
        eyebrow: "Kickoff Countdown",
        title: [["남은 ", { text: "시간", em: true }]],
        cells: [
          { n: "02", l: "Hrs", warn: true },
          { n: "18", l: "Min" },
          { n: "42", l: "Sec" },
        ],
      },
    },
    {
      id: "q-lanes",
      type: "lanes",
      content: {
        eyebrow: "Party · 5명 파티",
        title: [[{ text: "2/5", em: true }, " 확정"]],
        players: [
          { lane: "top", laneLabel: "TOP", name: "김주장", summoner: "HideOnBush #KR1", tier: "D2", tierClass: "diamond" },
          { lane: "mid", laneLabel: "MID", name: "박미드", summoner: "MidOrAFK #KR2", tier: "P1", tierClass: "plat" },
          { lane: "jgl", laneLabel: "JGL", name: "정글 자리 열림", summoner: "누구든 환영", tier: "모집 중", open: true },
          { lane: "adc", laneLabel: "ADC", name: "원딜 자리 열림", summoner: "플레티넘 이상 우대", tier: "모집 중", open: true },
          { lane: "sup", laneLabel: "SUP", name: "서포터 자리 열림", summoner: "서폿 잘하시면 사랑해요", tier: "모집 중", open: true },
        ],
      },
    },
    {
      id: "q-rules",
      type: "rules",
      content: {
        title: "",
        eyebrow: "Ground Rules",
        titleLine: [[{ text: "즐겁게", em: true }, "하자"]],
        rules: [
          { t: "디스코드 필수", d: "보이스 없으면 소통 안 됨 · #롤방 자동 초대" },
          { t: "3판 후 자율", d: "3판 하고 각자 컨디션 봐서 더 or 해산" },
          { t: "감정 소모 X", d: "싸움 금지 · 재밌게가 원칙 · 서로 존중" },
        ],
      },
    },
    {
      id: "q-accept",
      type: "accept",
      content: {
        title: ["참전", [{ text: "하시겠습니까?", em: true }]],
        sub: "오늘 저녁 8시 30분 전까지 답장",
        accept: "참전한다",
        decline: "패스",
      },
    },
    { id: "q-ending", type: "ending", content: { signature: "GLHF", names: "주최 · HideOnBush" } },
  ],
};

const scrim: Invitation = {
  slug: "lol-scrim",
  theme: "gaming",
  shareCta: "참전",
  sections: [
    {
      id: "s-cover",
      type: "cover",
      content: {
        image: "tmpl_gaming",
        imgFilter: "hue-rotate(-30deg) saturate(1.1)",
        headerLeft: "Custom Game · Scrim",
        headerRightLines: ["2026.04.20 · SAT", "20:00 KST"],
        eyebrow: "Internal Match",
        titleLines: [[{ text: "10인", em: true }, " 내전"]],
        subtitleLines: ["Blue Team vs Red Team · 드래프트 픽"],
      },
    },
    {
      id: "s-info",
      type: "gInfo",
      content: {
        eyebrow: "Match Format",
        title: [["내전 ", { text: "규정", em: true }]],
        cells: [
          { k: "Date", v: "04. 20", u: "SAT" },
          { k: "Time", v: "20:00", u: "- 23:00" },
          { k: "Games", v: "Best of", u: " 3" },
          { k: "Draft", v: "Fearless", u: " · 밴/픽" },
        ],
      },
    },
    {
      id: "s-blue",
      type: "lanes",
      content: {
        eyebrow: "Blue Team · 팀 A",
        title: [["블루팀 ", { text: "5/5", em: true }]],
        players: [
          { lane: "top", laneLabel: "TOP", name: "신주장", summoner: "TheShy2 #KR1", tier: "M", tierClass: "master" },
          { lane: "jgl", laneLabel: "JGL", name: "이정글", summoner: "JungleKing #KR2", tier: "D1", tierClass: "diamond" },
          { lane: "mid", laneLabel: "MID", name: "최미드", summoner: "FakerFan #KR3", tier: "D3", tierClass: "diamond" },
          { lane: "adc", laneLabel: "ADC", name: "한원딜", summoner: "DeftFan #KR4", tier: "P1", tierClass: "plat" },
          { lane: "sup", laneLabel: "SUP", name: "임서폿", summoner: "KerianMain #KR5", tier: "P2", tierClass: "plat" },
        ],
      },
    },
    {
      id: "s-red",
      type: "lanes",
      content: {
        eyebrow: "Red Team · 팀 B",
        title: [["레드팀 ", { text: "3/5", em: true }]],
        players: [
          { lane: "top", laneLabel: "TOP", name: "박탑솔", summoner: "TopDiff #KR1", tier: "D4", tierClass: "diamond" },
          { lane: "mid", laneLabel: "MID", name: "정미드", summoner: "1v9AP #KR2", tier: "D2", tierClass: "diamond" },
          { lane: "adc", laneLabel: "ADC", name: "홍원딜", summoner: "ADCarry #KR3", tier: "P3", tierClass: "plat" },
          { lane: "jgl", laneLabel: "JGL", name: "정글 필요!", summoner: "디이아 이상 우대", tier: "모집", open: true },
          { lane: "sup", laneLabel: "SUP", name: "서포터 필요!", summoner: "멘탈 좋은 분 환영", tier: "모집", open: true },
        ],
      },
    },
    {
      id: "s-rules",
      type: "rules",
      content: {
        title: "",
        eyebrow: "Rules",
        titleLine: [["내전 ", { text: "룰", em: true }]],
        rules: [
          { t: "Fearless Draft", d: "한 판에 밴됐거나 픽한 챔피언은 다음 판 사용 금지" },
          { t: "Discord Voice 필수", d: "팀 내 소통 · 서로 다른 채널 · 관전자만 공용" },
          { t: "패자는 치킨 쏘기", d: "3판 종합 진 팀이 이긴 팀에 배달비 포함 치킨" },
        ],
      },
    },
    {
      id: "s-accept",
      type: "accept",
      content: {
        title: [["내전 ", { text: "참전?", em: true }]],
        sub: "2자리 남음 · 4월 18일까지 답장",
        accept: "참전한다",
        decline: "패스",
      },
    },
    { id: "s-ending", type: "ending", content: { signature: "GG WP", names: "주최 · 신주장" } },
  ],
};

const rank: Invitation = {
  slug: "lol-rank",
  theme: "gaming",
  shareCta: "참전",
  sections: [
    {
      id: "r-cover",
      type: "cover",
      content: {
        image: "tmpl_gaming",
        imgFilter: "hue-rotate(40deg) saturate(1.15)",
        headerLeft: "Ranked Solo/Duo",
        headerRightLines: ["SEASON 26", "SPLIT 2"],
        eyebrow: "Ranked Party",
        titleLines: [[{ text: "랭크", em: true }, "같이"], "올릴 사람"],
        subtitleLines: ["Duo · Flex 5인 파티 · 골드 이상"],
      },
    },
    {
      id: "r-info",
      type: "gInfo",
      content: {
        eyebrow: "Squad Requirements",
        title: [["이 팀 ", { text: "모집 기준", em: true }]],
        cells: [
          { k: "Min Tier", v: "Gold", u: " ~" },
          { k: "Max Tier", v: "Diamond", u: " ~" },
          { k: "Queue", v: "Flex", u: " · Solo/Duo" },
          { k: "Playtime", v: "평일 밤", u: " 9-12시" },
        ],
      },
    },
    {
      id: "r-lanes",
      type: "lanes",
      content: {
        eyebrow: "Squad · 소환사 5인",
        title: [[{ text: "3/5", em: true }, " 확정"]],
        players: [
          { lane: "top", laneLabel: "TOP", name: "김탑", summoner: "RoseWaxSeal #KR1", tier: "D4", tierClass: "diamond" },
          { lane: "jgl", laneLabel: "JGL", name: "이정글", summoner: "JungleMaster #KR2", tier: "P1", tierClass: "plat" },
          { lane: "mid", laneLabel: "MID", name: "박미드", summoner: "SylasMain #KR3", tier: "P3", tierClass: "plat" },
          { lane: "adc", laneLabel: "ADC", name: "원딜 자리", summoner: "골드 이상 · 진 · 이즈리얼 잘하시면", tier: "모집", open: true },
          { lane: "sup", laneLabel: "SUP", name: "서포터 자리", summoner: "쓰레쉬 · 노틸러스 · 유미 우대", tier: "모집", open: true },
        ],
      },
    },
    {
      id: "r-tier",
      type: "tierChart",
      content: {
        eyebrow: "Tier Chart",
        title: [["우리 팀 ", { text: "티어 분포", em: true }]],
        cols: [
          { t: "IRON", n: "0" },
          { t: "BRZ", n: "0" },
          { t: "SLV", n: "0" },
          { t: "GOLD", n: "0" },
          { t: "PLAT", n: "2" },
          { t: "DIA", n: "1" },
          { t: "MSTR", n: "0" },
        ],
      },
    },
    {
      id: "r-champs",
      type: "champions",
      content: {
        eyebrow: "Champion Pool",
        title: [["주력 ", { text: "챔피언", em: true }]],
        items: [
          { icon: "👑", lane: "TOP", picked: true },
          { icon: "🌲", lane: "JGL", picked: true },
          { icon: "⚡", lane: "MID", picked: true },
          { icon: "?", lane: "ADC" },
          { icon: "?", lane: "SUP" },
          { icon: "🛡", lane: "TOP", picked: true },
          { icon: "🔥", lane: "JGL", picked: true },
          { icon: "✨", lane: "MID", picked: true },
        ],
      },
    },
    {
      id: "r-rules",
      type: "rules",
      content: {
        title: "",
        eyebrow: "Party Rules",
        titleLine: [["같이 올리는 ", { text: "약속", em: true }]],
        rules: [
          { t: "패배 후 3판 원칙", d: "지고 나서 강제 큐 X · 감정 소모 방지 · 3판마다 쉬어가기" },
          { t: "Not 조언, Yes 응원", d: "중간에 지적 대신 응원 · 리뷰는 게임 끝나고" },
          { t: "고정 시간 · 평일 9-12시", d: "주말은 자유 · 평일은 9시 이후 정기적으로" },
          { t: "시즌 목표: 팀 전체 티어 UP", d: "시즌 끝날 때까지 함께 · 개인 랭킹보다 함께 성장" },
        ],
      },
    },
    {
      id: "r-accept",
      type: "accept",
      content: {
        title: [["같이 ", { text: "올라갈래?", em: true }]],
        sub: "2자리 남음 · Op.gg 링크 답장으로 부탁",
        accept: "랭크 GO",
        decline: "패스",
      },
    },
    { id: "r-ending", type: "ending", content: { signature: "GG · CLIMB TOGETHER", names: "주최 · RoseWaxSeal" } },
  ],
};

export const gamingSamples: Invitation[] = [quick, scrim, rank];
