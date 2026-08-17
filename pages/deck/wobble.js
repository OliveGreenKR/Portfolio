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
      {
        layout: 'stats',
        section: 'Main · Shipped',
        title: W.meta.title + ' — 5주 압축 출시',
        gist: W.meta.oneLine,
        bigs: W.heroMetrics,
        // 5인 팀이라 역할 경계를 같은 장에서 밝힌다. 숫자 넷만 두면 "이걸 혼자 했나" 가 남는다.
        pairs: [['본인 작업', W.roles.mine], ['팀원 작업', W.roles.others]],
        links: [
          { label: 'Steam', v: '글로벌', href: W.meta.steam, tone: 'sage' },
          { label: 'STOVE', v: '한국', href: W.meta.stove, tone: 'blue' },
        ],
        // 기간 fact 의 괄호("(5주: 출시 준비 4주 + 출시 1주)")는 뗀다 — 제목 · 요약 ·
        // 큰 수치와 그 sub 가 이미 5주 구성을 네 번 말했다. 끝 날짜에는 무슨 날인지 붙인다.
        note: [fact('기간').split(' (')[0], fact('팀 구성'), fact('출시일') + ' 출시']
          .filter(Boolean).join(' · '),
      },
    ],
  };
})();
