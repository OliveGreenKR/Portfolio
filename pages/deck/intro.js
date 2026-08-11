// pages/deck/intro.js
// 문서 표제지 — 프로젝트 표지가 아니라 이 문서 전체의 첫 장이다.
//
// ⚠️ 사실을 만들지 않는다. about/data.js 와 landing/data.js 를 참조만 한다.
//    두 곳에 이미 다 있다 — 정체성 문구 · 이력 · 학력 · 연락처 · 대표 수치.
//
// 한 장으로 압축한다. 소개에 세 장을 쓸 만큼 설명할 게 없고,
// 항목마다 해당 사실 한 줄이면 족하다.

(function buildIntro() {
  const A = window.ABOUT_DATA;
  const L = window.LANDING_DATA;

  const fact = (k) => (A.facts.find((f) => f[0] === k) || [k, ''])[1];
  // background.rows 는 연도순 이력이다. 학력 한 줄만 뽑아 쓴다 — 나머지는
  // 프로젝트 장들이 직접 말하므로 표제지에서 되풀이하지 않는다.
  const edu = A.background.rows.find((r) => /대학교/.test(r.t));

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.intro = {
    proj: 'JCH Portfolio',
    slides: [
      {
        layout: 'title',
        section: 'Portfolio · 2026',
        photo: '../assets/profile-glasses.png',
        headline: L.identity.headline,
        headlineMark: L.identity.headlineMarkSecondLine,
        stance: L.identity.stance,
        facts: [
          ['이름', fact('이름')],
          ['지원 직무', window.DECK_ROLE || fact('직무')],
          ['학력', edu ? edu.y + ' · ' + edu.t.split('.')[0] : fact('어학')],
          ['엔진', fact('엔진')],
          ['언어', fact('언어')],
        ],
        links: A.links.items.map((l) => Object.assign({}, l, {
          tone: l.label === 'GitHub' ? 'blue' : l.label === 'Steam' ? 'sage' : undefined,
        })),
        stats: L.identity.stats,
      },
    ],
  };
})();
