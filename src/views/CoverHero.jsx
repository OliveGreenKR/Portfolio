// JCH Portfolio — CoverHero.jsx
// 상세 페이지 최상단 히어로. 페이지마다 따로 그리던 것을 **표지 하나로** 통일한다.
//
// 표지는 pages/{slug}/cover.jsx 가 소유하고 덱 · 랜딩 카드 · 여기가 함께 쓴다.
// 자리가 정하는 것은 축척(--cs)과 껍데기뿐이고, 무엇을 그릴지는 표지가 정한다.
//
// props
//   slug   COVERS 키
//   stats  표지가 수치를 안 갖는 프로젝트만 넘긴다 — 페이지의 기존 수치 줄을 유지한다
//          (DX11 · Motelet 표지에는 큰 숫자 칸이 없다. 그 둘은 계측본이 없어서다)
//   children  표지가 없을 때 쓸 예전 히어로

(function defineCoverHero() {
  function CoverHero({ slug, stats, children }) {
    const cover = (window.COVERS || {})[slug];
    if (!cover) return children || null;
    const ri = window.renderInline || ((x) => x);
    return (
      <section id="hero" className="nb-hero cv-hero">
        <div className="cv-host">{cover.render({ density: 'hero' })}</div>
        {stats && stats.length > 0 && (
          <div className="nb-stats">
            {stats.map((s, i) => (
              <div className="nb-stat" key={i}>
                <span className="nb-stat-n">{s.n}</span>
                <span className="nb-stat-l">{ri(s.label)}</span>
                <span className="nb-stat-s">{ri(s.sub)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
  window.CoverHero = CoverHero;
})();
