import type { Invitation } from "./types";

const housewarming: Invitation = {
  slug: "jibdeuli",
  theme: "timeline",
  shareCta: "응답",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "",
        bg: "hw",
        eyebrow: "Housewarming Party",
        titleLines: [["집으로 ", { text: "초대할게요", em: true }]],
        subtitleLines: ["지수 · 민준의 새 집으로 오세요", "따뜻한 밥과 이야기가 준비되어 있어요"],
        badges: [
          { label: "04.05 SAT 오후 3시", icon: "ic-clock", variant: "wax" },
          { label: "연남동 새 집", icon: "ic-pin", variant: "sage" },
        ],
      },
    },
    {
      id: "details",
      type: "details",
      content: {
        eyebrow: "Details",
        title: [["기본 ", { text: "정보", em: true }]],
        tint: true,
        info: [
          { k: "Date", v: "04. 05", u: "SAT" },
          { k: "Time", v: "15:00", u: "- 22:00" },
          { k: "Guests", v: "12", u: "명 예정" },
          { k: "Dress", v: "Comfy", u: " · 편하게" },
        ],
        party: {
          avatars: [{ label: "지" }, { label: "민", tone: 2 }, { label: "서", tone: 3 }, { label: "준", tone: 4 }, { label: "하", tone: 5 }],
          more: "+7",
          countLabel: "12명",
          countSub: "Confirmed",
        },
      },
    },
    {
      id: "timeline",
      type: "timeline",
      content: {
        eyebrow: "Schedule · 시간별 흐름",
        title: [["이렇게 ", { text: "진행돼요", em: true }]],
        items: [
          { time: "15:00", unit: "Welcome", title: "웰컴 · 집 구경", desc: "가벼운 인사와 함께 새 집을 소개할게요. 웰컴 티도 준비되어 있어요.", tags: [{ label: "차 · 커피" }, { label: "House Tour", variant: "sage" }], state: "done" },
          { time: "16:00", unit: "Snack", title: "애피타이저 타임", desc: "치즈 플래터와 과일, 그리고 스파클링 와인으로 가볍게 시작", tags: [{ label: "Wine", variant: "gold" }, { label: "Cheese" }, { label: "Fruits", variant: "sage" }], state: "now" },
          { time: "17:30", unit: "Dinner", title: "본식 · 저녁 식사", desc: "파스타 3종, 스테이크, 리조또. 취향껏 골라서 드세요.", tags: [{ label: "Pasta" }, { label: "Steak" }, { label: "Risotto" }] },
          { time: "19:00", unit: "Games", title: "보드게임 · 마피아", desc: "준비된 보드게임 4종 중 골라서. 마피아팀 리매치 가능", tags: [{ label: "Board", variant: "sky" }, { label: "Mafia" }] },
          { time: "20:30", unit: "Dessert", title: "디저트 · 티타임", desc: "직접 만든 케이크와 다양한 티. 마무리는 조곤조곤", tags: [{ label: "Cake" }, { label: "Tea", variant: "sage" }] },
          { time: "22:00", unit: "End", title: "아쉽지만 마무리", desc: "헤어질 때 작은 선물도 준비해뒀어요", tags: [{ label: "Small Gift", variant: "gold" }] },
        ],
      },
    },
    {
      id: "menu",
      type: "menu",
      content: {
        eyebrow: "Menu · 메뉴 구성",
        title: [["준비한 ", { text: "메뉴", em: true }]],
        tint: true,
        cards: [
          { cat: "Appetizer", count: "4 items", heading: "가볍게 시작", items: [{ name: "치즈 플래터", meta: "까망베르 · 브리 · 체다" }, { name: "계절 과일", meta: "딸기 · 무화과 · 청포도" }, { name: "올리브 마리네이드", meta: "직접 절임" }, { name: "크래커 · 바게트", meta: "따뜻하게" }] },
          { cat: "Main · 본식", count: "3 items", heading: "골라 드세요", items: [{ name: "트러플 크림 파스타", meta: "Chef's Pick" }, { name: "스테이크 (미디엄)", meta: "호주산 채끝" }, { name: "버섯 리조또", meta: "비건 옵션" }] },
          { cat: "Drink", count: "6 items", heading: "취향껏", items: [{ name: "스파클링 와인", meta: "Prosecco" }, { name: "레드 · 화이트 와인", meta: "각 2병" }, { name: "수제 레모네이드", meta: "Non-alc" }, { name: "커피 · 티 3종", meta: "디저트용" }] },
        ],
      },
    },
    {
      id: "checklist",
      type: "checklist",
      content: {
        eyebrow: "Checklist · 준비물",
        title: [["이것만 ", { text: "가져오세요", em: true }]],
        items: [
          { text: "편한 옷 (실내에서 편하게)", owner: "ALL", checked: true },
          { text: "즐길 준비 (음식·이야기)", owner: "ALL", checked: true },
          { text: "선물은 안 가져와도 돼요", owner: "OPT." },
          { text: "본인 취향 술 한 병 (원한다면)", owner: "OPT." },
        ],
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "Location",
        title: [["연남동 ", { text: "새 집", em: true }]],
        tint: true,
        body: ["서울 마포구 연남로 12길", "301호 · 3층 · 엘리베이터 있음"],
        mapButtons: [{ label: "지도앱 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "cta",
      type: "accept",
      content: { title: [["올 수 있어요, ", { text: "그죠?", em: true }]], sub: "준비 인원 확정을 위해 알려주세요", accept: "참석할게요", decline: "아쉽게 못가요" },
    },
    {
      id: "ending",
      type: "ending",
      content: { signatureLines: [["따뜻하게 ", { text: "기다릴게요", em: true }]], names: "지수 & 민준" },
    },
  ],
};

const flash: Invitation = {
  slug: "beongae",
  theme: "timeline",
  shareCta: "응답",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "",
        bg: "fl",
        eyebrow: "Flash Meetup · 번개",
        titleLines: [["오늘 ", { text: "번개", em: true }, " 어때요?"]],
        subtitleLines: ["퇴근 후 짧고 굵게", "가볍게 한 잔, 두 시간이면 충분해요"],
        badges: [
          { label: "오늘 저녁 7시", icon: "ic-clock", variant: "wax" },
          { label: "홍대 골목집", icon: "ic-pin", variant: "sage" },
          { label: "2시간", icon: "ic-glass", variant: "gold" },
        ],
      },
    },
    {
      id: "details",
      type: "details",
      content: {
        eyebrow: "Right Now",
        title: [["정보 ", { text: "딱", em: true }, "이만큼"]],
        tint: true,
        info: [
          { k: "When", v: "19:00", u: "- 21:00" },
          { k: "Where", v: "홍대", u: " 골목집" },
          { k: "People", v: "5", u: "/8명" },
          { k: "Budget", v: "30K", u: "원 예상" },
        ],
        party: {
          avatars: [{ label: "주" }, { label: "지", tone: 2 }, { label: "현", tone: 3 }, { label: "태", tone: 4 }, { label: "민", tone: 5 }],
          countLabel: "5명 확정",
          countSub: "3자리 남음",
        },
      },
    },
    {
      id: "timeline",
      type: "timeline",
      content: {
        eyebrow: "Flow · 두 시간의 흐름",
        title: [["이렇게 ", { text: "놀아요", em: true }]],
        items: [
          { time: "19:00", unit: "Start", title: "모임 · 안주 시키기", desc: "늦어도 15분 이내에 오세요. 안주 시키고 첫 잔 시작", tags: [{ label: "First Drink", variant: "gold" }], state: "now" },
          { time: "19:30", unit: "Talk", title: "근황 토크", desc: "한 명씩 요즘 어떻게 지내는지. 자연스럽게 이야기 이어가기", tags: [{ label: "Casual" }] },
          { time: "20:00", unit: "2R", title: "2차 안주 · 술 추가", desc: "배고픈 사람 위해 안주 하나 더 · 마시고 싶은 사람만 술 추가", tags: [{ label: "Snack" }, { label: "Optional", variant: "gold" }] },
          { time: "21:00", unit: "End", title: "마무리 · 계산", desc: "n빵 정산 · 미리 계좌 공유해둘게요. 다음 번개 예약도 여기서", tags: [{ label: "Split", variant: "sage" }] },
        ],
      },
    },
    {
      id: "cost",
      type: "cost",
      content: {
        eyebrow: "Money · 예상 비용",
        title: [["1인당 ", { text: "얼마?", em: true }]],
        tint: true,
        costEb: "Estimated per Person",
        total: "₩ 30,000",
        split: ["n빵 예정 · 총 ", { text: "240,000원", em: true }, " / 8명"],
        info: [
          { k: "Food", v: "15K", u: "/인" },
          { k: "Drink", v: "12K", u: "/인" },
          { k: "2차", v: "3K", u: "/인 여유" },
          { k: "Method", v: "n빵", u: " · 카카오페이" },
        ],
      },
    },
    {
      id: "location",
      type: "location",
      content: {
        eyebrow: "Location",
        title: [["홍대 ", { text: "골목집", em: true }]],
        body: ["서울 마포구 와우산로 29길 · 골목집", "홍대입구역 9번 출구 도보 5분"],
        mapButtons: [{ label: "지도앱 열기" }, { label: "주소 복사", primary: true }],
      },
    },
    {
      id: "cta",
      type: "accept",
      content: { title: [["번개, ", { text: "참전?", em: true }]], sub: "3자리 남았어요. 늦지 않게 응답 부탁", accept: "간다!", decline: "다음에" },
    },
    {
      id: "ending",
      type: "ending",
      content: { signatureLines: [["오늘 ", { text: "불태우자", em: true }]], names: "주최 · 김주장" },
    },
  ],
};

const mt: Invitation = {
  slug: "yangyang-mt",
  theme: "timeline",
  shareCta: "응답",
  sections: [
    {
      id: "cover",
      type: "cover",
      content: {
        image: "",
        bg: "mt",
        eyebrow: "MT · Trip Together",
        titleLines: [["양양 ", { text: "2박 3일", em: true }, " MT"]],
        subtitleLines: ["봄바다 보러 가요", "서핑, 야식, 별 보기, 새벽 낚시까지"],
        badges: [
          { label: "05.10 - 05.12", icon: "ic-clock", variant: "sky" },
          { label: "양양 · 죽도해변", icon: "ic-mountain", variant: "sage" },
          { label: "8명 예정", icon: "ic-users", variant: "gold" },
        ],
      },
    },
    {
      id: "details",
      type: "details",
      content: {
        eyebrow: "Trip Info",
        title: [["여행 ", { text: "기본 정보", em: true }]],
        tint: true,
        info: [
          { k: "Dates", v: "05.10 - 12", u: "2박3일" },
          { k: "Where", v: "양양", u: " 죽도해변" },
          { k: "Stay", v: "풀빌라", u: " · 3룸" },
          { k: "Move", v: "렌트카", u: " · SUV 2대" },
        ],
        party: {
          avatars: [{ label: "지" }, { label: "민", tone: 2 }, { label: "현", tone: 3 }, { label: "준", tone: 4 }, { label: "서", tone: 5 }],
          more: "+3",
          countLabel: "8명 확정",
          countSub: "Confirmed",
        },
      },
    },
    {
      id: "route",
      type: "route",
      content: {
        eyebrow: "Route · 이동 경로",
        title: [["가는 길 ", { text: "계획", em: true }]],
        stops: [
          { icon: "A", title: "서울 사당역 픽업", meta: "모든 인원 사당역 4번 출구 · 렌트카 대기", time: "05.10 · 07:00" },
          { icon: "B", title: "평창 휴게소 · 아침", meta: "가락국수 · 커피 · 잠깐 스트레칭", time: "05.10 · 09:30" },
          { icon: "C", title: "양양 도착 · 죽도해변", meta: "숙소 짐 놓고 바로 바다부터", time: "05.10 · 11:00" },
          { icon: "◉", title: "돌아오는 길 (5.12)", meta: "양양 → 서울, 저녁 이전 도착 예정", time: "05.12 · 15:00", accent: true },
        ],
      },
    },
    {
      id: "dayplan",
      type: "dayPlan",
      content: {
        eyebrow: "Daily Plan · 일별 일정",
        title: [["이렇게 ", { text: "보낼 예정", em: true }]],
        tint: true,
        days: [
          {
            label: "Day 1",
            en: "FRI",
            items: [
              { time: "07:00", unit: "Meet", title: "사당역 집결 · 출발", desc: "렌트카 SUV 2대 픽업 후 출발", state: "now" },
              { time: "11:00", unit: "Check-in", title: "숙소 체크인 · 짐 정리", desc: "3룸 풀빌라. 각자 방 정하고 짐만 놓고 바다로", tags: [{ label: "Villa", variant: "sky" }] },
              { time: "12:00", unit: "Lunch", title: "회 무한리필 · 물회", desc: "양양 회 맛집 · 도착하자마자 배 채우기", tags: [{ label: "Sashimi" }] },
              { time: "14:00", unit: "Beach", title: "죽도해변 · 서핑 강습", desc: "초보자 3시간 강습. 서핑 못하는 사람은 바다 산책", tags: [{ label: "Surf", variant: "sky" }, { label: "Beach" }] },
              { time: "19:00", unit: "BBQ", title: "숙소 바베큐", desc: "삼겹살·목살·소시지·야채. 술은 소맥 · 와인 · 하이볼", tags: [{ label: "BBQ", variant: "gold" }, { label: "Drink" }] },
              { time: "22:00", unit: "Chill", title: "별 보기 · 마피아 게임", desc: "숙소 옥상에서 별 감상. 야식은 라면" },
            ],
          },
          {
            label: "Day 2",
            en: "SAT",
            items: [
              { time: "05:00", unit: "Optional", title: "새벽 낚시", desc: "일찍 일어난 사람만. 낚시 도구는 현지 대여", tags: [{ label: "Optional", variant: "sky" }] },
              { time: "09:00", unit: "Brunch", title: "브런치 · 카페 투어", desc: "양양 감성 카페 3곳 순회" },
              { time: "14:00", unit: "Hike", title: "하조대 · 낙산사 산책", desc: "가벼운 산책 코스. 등산은 아니라서 편하게", tags: [{ label: "Walk", variant: "sage" }] },
              { time: "19:00", unit: "Dinner", title: "저녁 · 자유시간", desc: "해변 근처 맛집 자유 선택. 이후 밤바다 산책" },
            ],
          },
          {
            label: "Day 3",
            en: "SUN",
            items: [
              { time: "09:00", unit: "Wake", title: "늦잠 · 아침", desc: "각자 편하게 아침. 남은 재료로 대충 정리" },
              { time: "11:00", unit: "Out", title: "체크아웃 · 짐 정리", desc: "숙소 뒷정리 · 사진 정리 · 다같이 단체사진", tags: [{ label: "Photo" }] },
              { time: "12:30", unit: "Lunch", title: "돌아가는 길 · 점심", desc: "횡성 한우로 마지막 식사" },
              { time: "17:00", unit: "Home", title: "서울 도착 · 해산", desc: "사당역 하차 · 각자 집으로", tags: [{ label: "See you", variant: "sage" }] },
            ],
          },
        ],
      },
    },
    {
      id: "cost",
      type: "cost",
      content: {
        eyebrow: "Cost · 예산",
        title: [["1인당 ", { text: "얼마?", em: true }]],
        costEb: "Total per Person",
        total: "₩ 180,000",
        split: ["총 ", { text: "1,440,000원", em: true }, " / 8명 · 사전 입금"],
        info: [
          { k: "숙박", v: "70K", u: "/인" },
          { k: "렌트카", v: "40K", u: "/인" },
          { k: "식비", v: "50K", u: "/인" },
          { k: "액티비티", v: "20K", u: "/인" },
        ],
      },
    },
    {
      id: "checklist",
      type: "checklist",
      content: {
        eyebrow: "Packing List · 준비물",
        title: [["이건 ", { text: "꼭", em: true }, " 챙겨오세요"]],
        tint: true,
        items: [
          { text: "수영복 · 래시가드", owner: "ALL", checked: true },
          { text: "선크림 · 모자", owner: "ALL", checked: true },
          { text: "보드게임 · 카드 (자원자)", owner: "1명" },
          { text: "블루투스 스피커 (자원자)", owner: "1명" },
          { text: "약통 · 밴드 (자원자)", owner: "1명" },
        ],
      },
    },
    {
      id: "cta",
      type: "accept",
      content: { title: [["같이 ", { text: "갈 거죠?", em: true }]], sub: "4월 30일까지 참가비 입금 확정 부탁", accept: "GO 양양", decline: "이번엔 패스" },
    },
    {
      id: "ending",
      type: "ending",
      content: { signatureLines: [["바다에서 ", { text: "만나요", em: true }]], names: "총무 · 정민준" },
    },
  ],
};

export const timelineSamples: Invitation[] = [housewarming, flash, mt];
