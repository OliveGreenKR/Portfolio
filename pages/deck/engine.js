// pages/deck/engine.js
// 직무별 덱 조립 — 엔진 프로그래머.
//
// 이 파일이 하는 일은 **순서**뿐이다. 어떤 절을 뽑을지는 프로젝트별 매니페스트
// (deck/{project}.js)가 갖고, 사실은 pages/{project}/data.js 가 갖는다.
// 직무가 바뀌면 이 파일만 하나 더 만든다 — 데이터도 뷰도 안 건드린다.
//
// 순서 원칙: 핵심 강점이면서 보여줄 게 많은 것부터.
//   dx11 — "엔진을 통째로 짜봤다". 엔진 직군이 첫 5장에서 찾는 단어가 여기 있다
//   cm   — 계측된 개선. 사이트 전체에서 before/after 측정본이 있는 유일한 프로젝트

(function buildEngineDeck() {
  const P = window.DECK_PARTS || {};
  const FULL = ['intro', 'dx11', 'cm', 'outro'];

  // 프로젝트 하나만 검토할 때 — deck.html?only=cm  (여러 개면 쉼표)
  // 별도 HTML 을 프로젝트마다 만들지 않는 이유: 최종 산출물이 PDF 한 개라
  // 조립본이 반드시 필요하고, 개별본을 따로 두면 두 벌이 갈라진다.
  const only = new URLSearchParams(location.search).get('only');
  const ORDER = only ? only.split(',').map((x) => x.trim()) : FULL;

  const slides = [];
  ORDER.forEach((key) => {
    const part = P[key];
    if (!part) return;
    part.slides.forEach((s) => slides.push(Object.assign({ proj: part.proj }, s)));
  });

  window.DECK_ENGINE = { name: 'JCH · 엔진 프로그래머', slides };
})();
