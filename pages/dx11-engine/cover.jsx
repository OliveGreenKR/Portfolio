// pages/dx11-engine/cover.jsx
// DX11 엔진 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/dx11-engine/data.js 를 참조만 한다.
//
// 이 프로젝트의 표지가 말하는 것: **혼자서 엔진 전체를 만들었다.**
// 그래서 큰 글자는 무엇을 만들었나(제목)이고, 그 아래 한 줄이 범위를 못 박는다.
// 수치는 표지에 안 둔다 — 이 프로젝트에는 개선 전후를 비교할 계측본이 없고,
// '137 파일' 은 규모지 성과가 아니라 배지 한 칸이면 충분하다.

(function buildDx11Cover() {
  const D = window.DX11_DATA;

  const links = [
    { label: 'Repo', v: D.repo.label, href: D.repo.href, tone: 'blue' },
    { label: 'Demo', v: D.youtube.label, href: D.youtube.href, tone: 'terra' },
  ];

  // 배지는 **성과 먼저, 기술 스택 마지막** 순서로 통일한다 — 세 프로젝트의 목차 태그 축이
  // 갈리면 훑는 눈이 칸을 못 맞춘다. data.js 의 pills 는 페이지 배지용 순서라 여기서 세운다.
  const stack = D.meta.stack.join(' · ');
  const pills = D.meta.pills
    .filter((p) => p.text !== stack)
    .concat([{ kind: 'plain', text: stack }]);

  window.COVERS = window.COVERS || {};
  window.COVERS['dx11-engine'] = {
    // 덱 목차가 세어 가는 것. 표지가 스스로 내놓는다 —
    // 예전에는 목차가 표지의 pills 배열을 훔쳐봐서, 배지 순서를 바꾸면 목차가 따라 흔들렸다.
    toc: { title: D.meta.title, period: D.meta.period, tags: pills.map((p) => p.text) },

    render: ({ density }) => (
      <window.CoverSplit
        main={
          <React.Fragment>
            <window.Eyebrow>{D.meta.subtitle}</window.Eyebrow>
            <window.CoverTitle>{D.meta.title}</window.CoverTitle>
            <window.Lede>{D.hook}</window.Lede>
            <window.Pills items={pills} />
            <window.LinkRow links={links} />
          </React.Fragment>
        }
        art={<window.Art img={D.hero.img} caption={D.hero.caption} />}
      />
    ),
  };
})();
