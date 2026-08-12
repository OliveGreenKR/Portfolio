// pages/deck/outro.js
// 마지막 장 — 링크 정리.
//
// 각 프로젝트 표지에도 링크 버튼이 붙지만(repo · 데모 영상 등), 그건 그 프로젝트 것이다.
// 이 장은 문서 전체의 출구다 — 연락처와 공개 사이트.
//
// ⚠️ 사실을 만들지 않는다. about/data.js 의 links 를 참조한다.
//    사이트 URL 만 여기서 준다 — data.js 에 자기 사이트 주소가 없다(자기 자신이라서).

(function buildOutro() {
  const A = window.ABOUT_DATA;

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.outro = {
    proj: 'JCH Portfolio',
    slides: [
      {
        layout: 'outro',
        section: 'Links',
        title: '링크',
        gist: '각 프로젝트의 상세 서술 · 코드 스니펫 · 다이어그램은 공개 사이트에 있다. 이 문서는 그중 엔진 직군에 맞는 것만 뽑은 것이다.',
        links: [
          { label: '포트폴리오 사이트', v: 'olivegreenkr.github.io/Portfolio',
            href: 'https://olivegreenkr.github.io/Portfolio/', tone: 'sage' },
        ].concat(A.links.items.map((l) => Object.assign({}, l, {
          tone: l.label === 'GitHub' ? 'blue' : l.label === 'Steam' ? 'sage' : undefined,
        }))),
        note: A.footer,
      },
    ],
  };
})();
