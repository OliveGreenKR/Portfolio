// pages/deck/wobble.js
// 슬라이드 덱 매니페스트 — Wobble Wobble (Steam + STOVE 출시).
//
// ⚠️ 사실을 만들지 않는다. pages/wobble-wobble/data.js 를 참조만 한다.
//
// **한 장짜리 프로젝트**다 (이유 = deck/motelet.js 머리 주석).
// 이 프로젝트의 몫은 "두 번째 출시를 5주에 끝냈다" 다. 그 주장은 수치가 대므로
// columns 가 아니라 stats 로 낸다 — 카드 제목이 아니라 숫자가 먼저 시선을 받아야 한다.
//
// 뺀 것: systems 3.1~3.5 (타임라인 · 재제작 · 사운드 시스템 · LogSystem · 자동화 인프라)
//   -> 사운드 시스템은 Labs 의 재사용 모듈 카드가 같은 축을 덮는다.
//      나머지는 엔진 직군의 판단 근거가 아니라 운영 이력이다. 사이트에 있다.

(function buildWobbleDeck() {
  const W = window.WOBBLE_DATA;
  const fact = (k) => (W.facts.find((f) => f[0] === k) || [])[1];

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.wobble = {
    proj: 'Wobble Wobble',
    slides: [
      // 표지는 **프로젝트가 소유한다** — pages/wobble-wobble/cover.jsx.
      // 한 장짜리 프로젝트라 그 한 장이 곧 표지다.
      { layout: 'projectCover', section: 'Main · Shipped', slug: 'wobble-wobble' },
    ],
  };
})();
