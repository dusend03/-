// =====================================================================
//  청룡의 축제 비하인드 앨범 — 내용 설정 파일
//  ▶ 사진/영상은 assets/ 폴더에 넣고, 아래 pages 배열만 고치면 됩니다.
//  ▶ media 확장자가 .mp4 / .mov / .webm 이면 자동으로 영상 페이지가 됩니다.
// =====================================================================
window.ALBUM = {
  // ── 표지 ─────────────────────────────────────────────
  cover: {
    kicker: "BEHIND THE FESTIVAL",
    title: "청룡의 축제",
    subtitle: "비하인드 앨범",
    org: "용산청소년센터 ESG축제 기획단",
    year: "2026",
  },

  // 화면 상단에 작게 뜨는 문구 (비우려면 "")
  topLabel: "ESG축제 기획단 '청룡' · Behind",

  // ── 색상 테마 ────────────────────────────────────────
  theme: {
    cover: "#1d5c57",      // 표지 색 (청룡 = 청록)
    coverDark: "#123b38",
    gold: "#e9c46a",       // 표지 금박 글씨
    paper: "#fbf6ea",      // 속지 색
    accent: "#2a7f6f",     // 대제목 색
    ink: "#3a3a3a",        // 본문 색
    bgTop: "#cfe8dc",      // 배경 그라데이션
    bgBottom: "#f6efd9",
  },

  // ── 타이밍 (초) ──────────────────────────────────────
  timing: {
    intro: 1.6,       // 책이 날아와 자리잡는 시간
    coverHold: 0.8,   // 표지 보여주는 시간
    flip: 0.9,        // 한 장 넘기는 시간
    pageHold: 3.0,    // 사진 페이지 머무는 시간 (페이지별 duration 으로 개별 지정 가능)
    videoMax: 6,      // 영상 페이지 최대 길이 (개별 duration 이 우선)
    outroHold: 2.6,   // 마지막 페이지 머무는 시간
  },

  // ── 페이지 (사진 10장 정도) ──────────────────────────
  //  media   : 파일 경로 (필수)
  //  title   : 대제목
  //  body    : 본문 (줄바꿈은 \n)
  //  page    : 페이지 번호 (생략하면 1부터 자동)
  //  duration: 이 페이지 머무는 시간(초) — 선택
  //  start   : (영상만) 몇 초부터 쓸지 — 선택
  //  fit     : "cover"(꽉 채우기, 기본) / "contain"(잘림 없이)
  pages: [
    { media: "assets/sample/photo01.jpg", title: "첫 만남, 첫 회의", body: "어색했던 자기소개로 시작한\n청룡 기획단의 첫 번째 회의" },
    { media: "assets/sample/photo02.jpg", title: "아이디어 대폭발", body: "포스트잇이 모자랄 만큼\n쏟아진 ESG 축제 아이디어들" },
    { media: "assets/sample/photo03.jpg", title: "부스 이름 정하기", body: "투표만 세 번!\n드디어 정해진 우리 부스 이름" },
    { media: "assets/sample/clip01.mp4",  title: "리허설 현장", body: "실전처럼 맞춰 본 동선과 진행,\n웃음이 끊이지 않았던 시간" },
    { media: "assets/sample/photo04.jpg", title: "업사이클링 준비", body: "버려질 뻔한 재료들이\n축제 소품으로 다시 태어났어요" },
    { media: "assets/sample/photo05.jpg", title: "포스터 완성", body: "밤늦게까지 고친 끝에\n완성된 우리만의 포스터" },
    { media: "assets/sample/photo06.jpg", title: "축제 당일 아침", body: "설렘 반 긴장 반,\n부스를 세우며 시작한 하루" },
    { media: "assets/sample/photo07.jpg", title: "북적북적 부스", body: "찾아와 준 친구들 덕분에\n쉴 틈 없이 바빴던 오후" },
    { media: "assets/sample/photo08.jpg", title: "우리가 만든 변화", body: "작은 실천이 모여\n지구를 위한 큰 걸음이 되었어요" },
    { media: "assets/sample/photo09.jpg", title: "청룡, 고마워!", body: "함께 고민하고 웃었던 모든 순간,\n잊지 못할 거예요" },
  ],

  // ── 마지막 페이지 ─────────────────────────────────────
  outro: {
    title: "THANK YOU",
    body: "청룡의 축제를 함께해 주신\n모든 분들께 감사드립니다",
    sign: "용산청소년센터 ESG축제 기획단 청룡",
  },
};
