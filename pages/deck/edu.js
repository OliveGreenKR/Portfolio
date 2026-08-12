// pages/deck/edu.js
// 슬라이드 덱 매니페스트 — 교육용 게이미피케이션 (외주 · 납품 완료).
//
// ⚠️ 사실을 만들지 않는다. pages/edu-gamification/data.js 를 참조만 한다.
//
// **한 장짜리 프로젝트**다 (이유 = deck/motelet.js 머리 주석).
// 엔진 직군 덱에서 이 프로젝트의 몫은 기술 축이 아니라 **실무 이력**이다 —
// 돈 받고 계약 기간 안에 납품했다. 그래서 순서도 맨 뒤고, 근거도 수치로만 낸다.
//
// 뺀 것: systems 5.1~5.9 전부 (내러티브 · 연동 · NoSQL · 배포 콘솔 · 라우팅 ·
//   인가 게이트 · 감사 3계층 · 대량 작업 · AI 학습)
//   -> 아홉 절 어느 것도 엔진·클라이언트 판단 근거가 아니다. 클라이언트 · 서버 직군
//      덱을 만들 때는 여기서 5.5(라우팅) · 5.6(인가) · 5.4(배포 콘솔)를 살린다.

(function buildEduDeck() {
  const E = window.EDU_GAMIFICATION_DATA;
  const fact = (k) => (E.facts.find((f) => f[0] === k) || [])[1];
  // 랜딩 카드용 한 줄. 같은 사실을 페이지 히어로용(meta.oneLine)과 카드용으로 두 벌 갖고
  // 있는데, 히어로용은 "미확정 ·" 같은 라벨 조각으로 시작해 슬라이드 첫 문장에 안 맞는다.
  const card = window.LANDING_DATA.main.find((m) => m.slug === 'edu-gamification');

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.edu = {
    proj: '교육용 게이미피케이션 (외주)',
    slides: [
      {
        layout: 'stats',
        section: 'Main · Freelance',
        // 러닝헤더(proj)가 이미 "(외주)" 고 섹션이 Main · Freelance 다. 제목에서 뗀다.
        title: E.meta.title.replace(/\s*\(외주\)\s*$/, ''),
        gist: card.oneLine,
        bigs: E.heroMetrics,
        pairs: [['본인 작업', E.roles.mine], ['팀 · 범위', E.roles.others]],
        note: [fact('기간'), fact('기여')].filter(Boolean).join(' · '),
      },
    ],
  };
})();
