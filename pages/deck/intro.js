// pages/deck/intro.js
// 문서 표제지 — 프로젝트 표지가 아니라 이 문서 전체의 첫 장이다.
//
// ⚠️ 사실을 만들지 않는다. about/data.js 와 landing/data.js 를 참조만 한다.
//    두 곳에 이미 다 있다 — 정체성 문구 · 이력 · 학력 · 연락처 · 대표 수치.
//
// 한 장으로 압축한다. 소개에 세 장을 쓸 만큼 설명할 게 없고,
// 항목마다 해당 사실 한 줄이면 족하다.
//
// 본문 장이 있는 프로젝트(cm · dx11 · cartapli · motelet)는 여기서 되풀이하지 않는다.
// 본문 장이 **없는** 것 — Wobble Wobble · 외주 · Labs 5종 — 만 이력 한 줄로 남긴다.
// 한 장짜리 요약 슬라이드를 넉 장 두는 것보다 이쪽이 낫다: 밀도 낮은 장이 안 생기고,
// 출시작은 스토어 링크로 바로 확인되니 덱이 대신 설명할 필요가 없다.

(function buildIntro() {
  const A = window.ABOUT_DATA;
  const L = window.LANDING_DATA;
  const C = window.CARTAPLI_DATA;
  const W = window.WOBBLE_DATA;
  const E = window.EDU_GAMIFICATION_DATA;

  const fact = (k) => (A.facts.find((f) => f[0] === k) || [k, ''])[1];
  // 학력은 about/data.js 의 facts 가 갖는다 (대학 + 게임랩 4기).

  // 출시 이력 한 줄. 문장을 새로 쓰지 않고 각 프로젝트 meta 를 조립한다 —
  // 기간·주수·인원이 바뀌면 이 줄도 같이 바뀐다.
  //
  // 표기만 기계적으로 맞춘다. data.js 는 페이지 배지용이라 '13 weeks' · '4 인' 인데,
  // 한글 한 줄 안에 섞이면 눈에 걸린다. 값을 바꾸는 게 아니라 단위 표기만 바꾼다.
  const ko = (s) => String(s).replace(/\s*weeks?$/i, '주').replace(/(\d)\s+인/, '$1인');
  const shipped = (m) => m.title + ' (' + m.period + ' · ' + ko(m.weeks) + ' · ' + ko(m.team) + ')';

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
          ['학력', fact('학력')],
          ['엔진', fact('엔진')],
          ['언어', fact('언어')],
          ['출시', shipped(C.meta) + ' · ' + shipped(W.meta)],
          // 제목에 이미 '(외주)' 가 있고 period 도 괄호를 물고 있다 — 그대로 이으면 괄호가 겹친다.
          ['외주', E.meta.title.replace(/\s*\(외주\)\s*$/, '')
            + ' (' + E.meta.period.replace(/\s*\((.+)\)$/, ' · $1') + ')'],
          // 오른쪽 대표 수치 칸이 이미 같은 문장을 갖는다(05 · PoC labs). 여기서는 개수만.
          ['Labs', 'PoC 5종 (1일 ~ 8주)'],
        ],
        // 스토어 링크는 about/data.js 의 Steam 한 줄로는 부족하다 — 출시가 둘이다.
        // 이력 줄은 텍스트라 링크를 못 걸어서(renderInline 이 링크를 안 만든다)
        // 여기 링크 줄에 게임 이름을 붙여 낸다.
        links: A.links.items
          .filter((l) => l.label !== 'Steam')
          .map((l) => Object.assign({}, l, { tone: l.label === 'GitHub' ? 'blue' : undefined }))
          .concat([
            { label: 'Steam', v: C.meta.title, href: C.meta.steam, tone: 'sage' },
            { label: 'Steam', v: W.meta.title, href: W.meta.steam, tone: 'sage' },
          ]),
        stats: L.identity.stats,
      },
    ],
  };
})();
