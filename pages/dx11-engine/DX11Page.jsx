const { useEffect: useEffectDX, useState: useStateDX } = React;

function DXSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function DXHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs"><a href={indexHref}>index</a><span className="sep">/</span><span className="cur">projects / dx11-engine</span></div>
      <nav className="nb-nav">
        <a href="#summary">Summary</a><a href="#overview">Overview</a><a href="#physics">Physics</a><a href="#systems">Rendering</a>
      </nav>
    </header>
  );
}

function DXRail() {
  const ids = ['hero', 'summary', 'overview', 'physics', 'systems'];
  const [active, setActive] = useStateDX('hero');
  useEffectDX(() => {
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2] });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const labels = { hero: '전체', summary: '00 · 요약', overview: '01 · 엔진 구조', physics: '02 · 물리 심화', systems: '03 · 렌더링' };
  return <aside className="nb-rail" aria-label="On-page navigation">{ids.map(id => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{labels[id]}</a>)}</aside>;
}


function DXEvidenceChips({ items }) {
  return <div className="dx-evidence-chips" aria-label="Code evidence">{items.map(item => <code key={item}>{item}</code>)}</div>;
}

function DXStoryBlock({ item, viz }) {
  const ri = window.renderInline;
  return (
    <article className="dx-story">
      <div className="dx-story-copy"><h3>{item.title}</h3><p>{ri(item.body)}</p><DXEvidenceChips items={item.evidence} /></div>
      {React.createElement(window[viz])}
    </article>
  );
}

function DXCodeEvidence({ item }) {
  const AsciiBlock = window.AsciiBlock;
  return (
    <div className="dx-code-evidence">
      <h3>{item.title}</h3>
      <AsciiBlock
        title={item.source}
        intro={item.intro}
        code={item.code}
        result={item.result}
        lang={item.lang}
      />
    </div>
  );
}

function DXOverview({ data }) {
  const ri = window.renderInline;
  return (
    <section id="overview" className="nb-section">
      <DXSectionHead no="01" title="엔진 전체 구조" kind="TOP DOWN" />
      <p className="dx-gist">{ri(data.overview.gist)}</p>
      <DXStoryBlock item={data.overview.architecture} viz="DXArchitectureViz" />
      <DXStoryBlock item={data.overview.frame} viz="DXFrameFlowViz" />
    </section>
  );
}

function DXPhysics({ data }) {
  const ri = window.renderInline;
  return (
    <section id="physics" className="nb-section">
      <DXSectionHead no="02" title="물리 심화 — 데이터 경계부터 충돌까지" kind="DEEP DIVE" />
      <p className="dx-gist">{ri(data.physics.gist)}</p>
      <DXStoryBlock item={data.physics.boundary} viz="DXBoundaryViz" />
      <DXStoryBlock item={data.physics.sync} viz="DXSyncTierViz" />
      <DXCodeEvidence item={data.code.sync} />
      <DXStoryBlock item={data.physics.tick} viz="DXTickViz" />
      <DXCodeEvidence item={data.code.tick} />
      <DXStoryBlock item={data.physics.collision} viz="DXCollisionPipelineViz" />
    </section>
  );
}

function DXSystems({ data }) {
  const ri = window.renderInline;
  return (
    <section id="systems" className="nb-section">
      <DXSectionHead no="03" title="렌더링 — 제출과 실행의 분리" kind="ENGINE SYSTEMS" />
      <p className="dx-gist">{ri(data.systems.gist)}</p>
      <DXStoryBlock item={data.systems.render} viz="DXRenderPipelineViz" />
      <DXCodeEvidence item={data.code.renderCache} />
    </section>
  );
}

// 결론을 히어로 바로 뒤에 둔다 — 무엇을 만들었고(범위), 무엇으로 확인했고(근거),
// 어디까지가 적용 범위인지(한계)를 한 화면에서 끝낸다. 덱의 두 번째 장과 같은 구성이다.
//
// verified[2]('범위')는 넣지 않는다 — 왼쪽 칸의 '직접 구현'과 같은 말이다.
function DXSummary({ data }) {
  const ri = window.renderInline;
  const column = (title, tone, rows) => (
    <div className={`dx-proof-col ${tone}`}>
      <h3>{title}</h3>
      {rows.map(([key, value]) => (
        <div className="dx-proof-row" key={key}><strong>{key}</strong><p>{ri(value)}</p></div>
      ))}
    </div>
  );
  return (
    <section id="summary" className="nb-section">
      <DXSectionHead no="00" title="구현 범위와 검증 근거, 적용 한계" kind="SUMMARY" />
      <p className="dx-gist">{ri(data.evidence.gist)}</p>
      <div className="dx-proof-grid">
        {column('직접 만든 범위', 'scope', data.overview.facts)}
        {column('확인 가능한 근거', 'verified', data.evidence.verified.slice(0, 2))}
        {column('적용 범위 · 개선 과제', 'limits', data.evidence.limits)}
      </div>
    </section>
  );
}

function DX11Page({ indexHref = 'landing.html' }) {
  const data = window.DX11_DATA;
  return (
    <div className="nb-page">
      <DXHeader indexHref={indexHref} />
      <div className="nb-body">
        <DXRail />
        <main>
          <window.CoverHero slug="dx11-engine" stats={data.heroMetrics} />
          <DXSummary data={data} />
          <DXOverview data={data} />
          <DXPhysics data={data} />
          <DXSystems data={data} />
          <footer className="nb-footer"><span>JCH · 2026 · projects / dx11-engine</span><span>about / resume / contact</span></footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}

window.DX11Page = DX11Page;
