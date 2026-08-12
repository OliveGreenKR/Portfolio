// pages/deck/engine.js
// 직무별 덱 조립 — 엔진 프로그래머.
//
// 이 파일이 하는 일은 **순서**뿐이다. 어떤 절을 뽑을지는 프로젝트별 매니페스트
// (deck/{project}.js)가 갖고, 사실은 pages/{project}/data.js 가 갖는다.
// 직무가 바뀌면 이 파일만 하나 더 만든다 — 데이터도 뷰도 안 건드린다.
//
// 순서 원칙: **최신이면서 내용의 질이 좋은 것부터.** 직무 적합도만으로 정하지 않는다 —
// 오래된 작업은 직무에 맞아도 지금의 실력을 대변하지 못한다.
//   cm       — 가장 최신. 계측된 개선이고, 사이트 전체에서 before/after 측정본이 있는 유일한 것
//   dx11     — 프로젝트 자체는 엔진 직군에 가장 맞지만 가장 오래됐다. 내용의 질이 cm 에 못 미친다
//   cartapli — 출시와 시스템 설계. 팀 작업이라 역할 경계를 먼저 밝힌다
//
// 뒤 넷은 **한 장짜리**다. 앞 셋이 32장을 쓰는데 같은 밀도로 나머지를 넣으면 100장을 넘는다.
// 이 넷의 순서도 같은 원칙 — motelet(최신 · 런타임 구현) → wobble(출시 실적) →
// edu(직무에서 가장 멂) → labs(1일~8주 실험 묶음).

(function buildEngineDeck() {
  const P = window.DECK_PARTS || {};
  const FULL = ['intro', 'cm', 'dx11', 'cartapli', 'motelet', 'wobble', 'edu', 'labs', 'outro'];

  // 프로젝트 하나만 검토할 때 — deck.html?only=cm  (여러 개면 쉼표)
  // 별도 HTML 을 프로젝트마다 만들지 않는 이유: 최종 산출물이 PDF 한 개라
  // 조립본이 반드시 필요하고, 개별본을 따로 두면 두 벌이 갈라진다.
  const only = new URLSearchParams(location.search).get('only');
  const ORDER = only ? only.split(',').map((x) => x.trim()) : FULL;

  const ROLE = '게임 클라이언트 · 엔진 프로그래머';

  const slides = [];
  ORDER.forEach((key) => {
    const part = P[key];
    if (!part) return;
    part.slides.forEach((s) => slides.push(Object.assign({ proj: part.proj }, s)));
  });

  // 표제지의 지원 직무는 이 덱이 정한다 — about/data.js 의 "클라이언트 프로그래머" 는
  // 사이트의 사실이고, 지원 직무는 덱마다 다르다. 매니페스트 로드 순서와 무관하게
  // 조립 시점에 덮는다 (intro.js 가 engine.js 보다 먼저 실행된다).
  slides.forEach((s) => {
    if (s.layout !== 'title' || !s.facts) return;
    s.facts = s.facts.map((f) => (f[0] === '지원 직무' ? ['지원 직무', ROLE] : f));
  });

  window.DECK_ENGINE = { name: 'JCH · 엔진 프로그래머', role: ROLE, slides };
})();
