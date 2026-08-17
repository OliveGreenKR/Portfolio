// pages/cartapli-mobile/CartapliMobilePage.jsx
// Hero → Architecture → Result → four implementation cases → Validation.

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_RAIL = [
  { head: 'project' },
  { id: 'hero', label: '시작' },
  { id: 'architecture', label: '01 · 구조와 흐름' },
  { id: 'result', label: '02 · 개선 그래프' },
  { head: 'implementation' },
  { id: 'reuse', label: '03 · 참조 재사용' },
  { id: 'prune', label: '04 · 파묻힘 삭제' },
  { id: 'merge', label: '05 · 2메시 병합' },
  { id: 'native', label: '06 · Native Job' },
  { head: 'appendix' },
  { id: 'validation', label: '07 · 검증 범위' },
];

function CMHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">projects / cartapli-mobile</span>
      </div>
      <nav className="nb-nav">
        <a href="#architecture">Architecture</a>
        <a href="#result">Result</a>
        <a href="#reuse">Implementation</a>
      </nav>
    </header>
  );
}

function CMRail() {
  const [active, setActive] = useStateCM('hero');

  useEffectCM(() => {
    const elements = CM_RAIL
      .filter((item) => item.id)
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActive(visible[0].target.id);
    }, { rootMargin: '-88px 0px -62% 0px', threshold: [0, 0.2, 0.5] });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      {CM_RAIL.map((item, index) => item.head
        ? <span key={'h-' + index} className="nb-rail-section">{item.head}</span>
        : <a key={item.id} href={'#' + item.id} className={active === item.id ? 'active' : ''}>{item.label}</a>)}
    </aside>
  );
}

function SectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function Gist({ children }) {
  return <p className="cm-gist">{window.renderInline(children)}</p>;
}

function Body({ children, className = '' }) {
  return <p className={'cm-body ' + className}>{window.renderInline(children)}</p>;
}

function ScopeLabel({ children }) {
  return <p className="cm-scope">측정 범위 — {children}</p>;
}


function CMArchitecture({ data }) {
  const s = data.architecture;
  return (
    <section id="architecture" className="nb-section lv2">
      <SectionHead no="01" title="종이접기 전투의 핵심 시뮬레이션 실행 경로" kind="ARCHITECTURE" />
      <Gist>{s.gist}</Gist>
      <Body>{s.body}</Body>
      <h3 className="cm-subhead"><span>01-A</span> 클래스 책임과 호출 경계</h3>
      <window.CMPageArchitectureDiagram />
      <dl className="cm-architecture-rules">
        {s.decisions.map(([title, body]) => (
          <React.Fragment key={title}>
            <dt>{title}</dt>
            <dd>{window.renderInline(body)}</dd>
          </React.Fragment>
        ))}
      </dl>
      <h3 className="cm-subhead"><span>01-B</span> Variable Frame부터 Presentation까지</h3>
      <window.CMPageSimulationDiagram lanes={s.lanes} clock={s.clock} />
      <window.CMTransaction items={s.confirm} />
    </section>
  );
}

function CMResult({ data }) {
  const s = data.result;
  return (
    <section id="result" className="nb-section lv2">
      <SectionHead no="02" title="다섯 단계로 나눠 본 최적화 방식별 개선 결과" kind="S0 → S2-b · MEASURED" />
      <Gist>{s.gist}</Gist>
      <window.CMPageOptimizationCurve bars={s.bars} />
      <div className="cm-result-grid">
        <article className="cm-correction">
          <span>MEASUREMENT CORRECTION</span>
          <strong>{s.correction.title}</strong>
          <p>{window.renderInline(s.correction.body)}</p>
        </article>
        <dl className="cm-condition-list">
          {s.conditions.map(([key, value]) => (
            <React.Fragment key={key}><dt>{key}</dt><dd>{window.renderInline(value)}</dd></React.Fragment>
          ))}
        </dl>
      </div>
      <div className="cm-axis-grid">
        {s.axes.map(([label, value, note]) => (
          <article key={label}><span>{label}</span><b>{value}</b><small>{note}</small></article>
        ))}
      </div>
      <ScopeLabel>동일 결정론적 16회 입력 · Windows PC · Unity Editor PlayMode 상대 비교</ScopeLabel>
    </section>
  );
}

function CMMethod({ method }) {
  return (
    <section id={method.id} className="nb-section cm-method">
      <SectionHead no={method.no} title={method.title} kind={method.stage + ' · ' + method.kind} />
      <div className="cm-method-lead">
        <Gist>{method.gist}</Gist>
        <div className="cm-method-metric">
          <strong>{method.metric.value}</strong>
          <b>{method.metric.detail}</b>
          <span>{method.metric.label}</span>
        </div>
      </div>
      <window.CMPageMethodViz method={method} />
      <h3 className="cm-subhead cm-code-subhead"><span>CODE</span> 같은 판단의 구현 차이</h3>
      <div className="cm-code-pair">
        <window.AsciiBlock {...method.code.before} lang="csharp" />
        <window.AsciiBlock {...method.code.after} lang="csharp" />
      </div>
      <Body className="cm-tradeoff">{method.note}</Body>
      <ScopeLabel>{method.scope}</ScopeLabel>
    </section>
  );
}

function CMValidation({ data }) {
  const s = data.validation;
  return (
    <section id="validation" className="nb-section lv4">
      <details className="cm-appendix">
        <summary>
          <span className="nb-section-no">§ 07</span>
          <h2 className="cm-appendix-title">Editor 상대 비교의 적용 범위와 다음 검증</h2>
          <span className="cm-appendix-action">펼치기 +</span>
        </summary>
        <div className="cm-appendix-body">
          <Body>{s.intro}</Body>
          <div className="cm-validation-grid">
            {s.columns.map((column) => (
              <article key={column.title}>
                <strong>{column.title}</strong>
                <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}

function CartapliMobilePage({ indexHref = 'landing.html' }) {
  const data = window.CM_DATA;
  return (
    <div className="nb-page">
      <CMHeader indexHref={indexHref} />
      <div className="nb-body">
        <CMRail />
        <main>
          <window.CoverHero slug="cartapli-mobile" />
          <CMArchitecture data={data} />
          <CMResult data={data} />
          {data.methods.map((method) => <CMMethod method={method} key={method.id} />)}
          <CMValidation data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · projects / cartapli-mobile</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}

window.CartapliMobilePage = CartapliMobilePage;
