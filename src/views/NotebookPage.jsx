// src/views/NotebookPage.jsx
// Generic Notebook layout — composition shared across main project pages.
// Props:
//   data        — page content (see pages/{slug}/data.js for schema)
//   crumb       — e.g. "projects / cartapli"
//   indexHref   — link to landing/index from header brand + crumb
//   systemsKind — optional override for "N SYSTEMS" kind label
//   footerLeft  — left-side footer text (default uses crumb)

const { useEffect: useEffectNB, useState: useStateNB } = React;

function NotebookHeader({ crumb, indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}>
        <span className="nb-brand-mark"></span>
        JCH / PORTFOLIO
      </a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a>
        <span className="sep">/</span>
        <span className="cur">{crumb}</span>
      </div>
      <nav className="nb-nav">
        <a href="#systems">Systems</a>
        <a href="#evidence">Evidence</a>
        <a href="#facts">Facts</a>
      </nav>
    </header>
  );
}

function shortenNB(t) {
  const i = t.indexOf(' — ');
  return i > 0 ? t.slice(0, i) : t;
}

function NotebookRail({ systems }) {
  const [active, setActive] = useStateNB('hero');
  useEffectNB(() => {
    const ids = ['hero', 'facts', 'systems', 'evidence', ...systems.map(s => `sys-${s.no.replace('.', '-')}`)];
    const sects = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sects.length) return;
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2, 0.5] }
    );
    sects.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [systems]);

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {link('hero', 'Overview')}
      {link('facts', 'Context')}
      {link('systems', 'Action')}
      <span className="nb-rail-section">systems</span>
      {systems.map(s => link(`sys-${s.no.replace('.', '-')}`, `${s.no} · ${shortenNB(s.title)}`))}
      <span className="nb-rail-section">evidence</span>
      {link('evidence', 'Metrics + media')}
    </aside>
  );
}

function NotebookHero({ data }) {
  const m = data.meta;
  const ri = window.renderInline || ((x) => x);
  return (
    <section id="hero" className="nb-hero">
      <div className="nb-eyebrow">{m.eyebrow || `${m.code} ─ 메인 프로젝트`}</div>
      <h1 className="nb-title">{ri(m.title)}</h1>
      <p className="nb-oneline">{ri(m.oneLine)}</p>
      <div className="nb-metarow">
        {m.weeks    && <span className="nb-metapill accent"><b>{m.weeks}</b></span>}
        {m.team     && <span className="nb-metapill"><b>{m.team}</b></span>}
        {m.role     && <span className="nb-metapill"><b>{m.role}</b></span>}
        {m.platform && <span className="nb-metapill accent"><b>{m.platform}</b></span>}
      </div>

      {data.heroImage ? (
        <figure className="nb-hero-media filled">
          <img src={data.heroImage} alt={`${m.title} — key art`} />
        </figure>
      ) : (
        <div className="nb-hero-media">
          <div className="nb-hero-media-label">
            <span className="glyph">▢</span>
            <span>HERO · GAME PLAY</span>
          </div>
        </div>
      )}

      <div className="nb-stats">
        {data.heroMetrics.map((s, i) => (
          <div className="nb-stat" key={i}>
            <span className="nb-stat-n">{s.n}</span>
            <span className="nb-stat-l">{ri(s.label)}</span>
            <span className="nb-stat-s">{ri(s.sub)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotebookFacts({ data }) {
  const { ScreenshotCarousel } = window;
  return (
    <section id="facts" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 01</span>
        <h2 className="nb-section-title">Context — 프로젝트 사실</h2>
        <span className="nb-section-kind">FACTS</span>
      </div>

      {data.screenshots && data.screenshots.length > 0 && (
        <div className="nb-gallery">
          <div className="nb-gallery-head">
            <span className="lbl">GALLERY</span>
            <span className="hint">←/→ 키 또는 화살표·썸네일 클릭으로 넘김. 영상은 Steam 페이지에서.</span>
          </div>
          <ScreenshotCarousel shots={data.screenshots} />
        </div>
      )}

      <dl className="nb-facts">
        {data.facts.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt>
            <dd>{window.renderInline(v)}</dd>
          </React.Fragment>
        ))}
        {data.meta.steam && (
          <>
            <dt>Steam</dt>
            <dd><a href={data.meta.steam} target="_blank" rel="noreferrer">{data.meta.steam}</a></dd>
          </>
        )}
        {data.meta.stove && (
          <>
            <dt>STOVE</dt>
            <dd><a href={data.meta.stove} target="_blank" rel="noreferrer">{data.meta.stove}</a></dd>
          </>
        )}
        {data.meta.youtube && (
          <>
            <dt>YouTube</dt>
            <dd><a href={data.meta.youtube} target="_blank" rel="noreferrer">{data.meta.youtube}</a></dd>
          </>
        )}
      </dl>

      <div className="nb-roles">
        <div className="nb-role">
          <div className="nb-role-head"><span className="glyph">✓</span> 본인 작업</div>
          <p>{window.renderInline(data.roles.mine)}</p>
        </div>
        <div className="nb-role warn">
          <div className="nb-role-head"><span className="glyph">⚠</span> 본인 작업 아님</div>
          <p>{window.renderInline(data.roles.others)}</p>
        </div>
      </div>
    </section>
  );
}

function NotebookSystems({ data, kindLabel }) {
  const { SystemBlock } = window;
  return (
    <section id="systems" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 02</span>
        <h2 className="nb-section-title">Action — 본인이 작업한 시스템</h2>
        <span className="nb-section-kind">{kindLabel || `${data.systems.length} SYSTEMS`}</span>
      </div>
      {data.systems.map(sys => <SystemBlock key={sys.no} system={sys} />)}
    </section>
  );
}

function NotebookEvidence({ data }) {
  const { DataTable } = window;
  return (
    <section id="evidence" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 03</span>
        <h2 className="nb-section-title">Evidence — 정량 결과</h2>
        <span className="nb-section-kind">METRICS</span>
      </div>

      <div className="nb-metrics">
        <DataTable
          title={data.metrics.title || '결과 메트릭'}
          headers={data.metrics.headers}
          rows={data.metrics.rows}
        />
      </div>
    </section>
  );
}

function NotebookFooter({ crumb }) {
  return (
    <footer className="nb-footer">
      <span>JCH · 2026 · {crumb}</span>
      <span>about / resume / contact</span>
    </footer>
  );
}

function NotebookPage({ data, crumb, indexHref = 'landing.html', systemsKind }) {
  return (
    <div className="nb-page">
      <NotebookHeader crumb={crumb} indexHref={indexHref} />
      <div className="nb-body">
        <NotebookRail systems={data.systems} />
        <main>
          <NotebookHero data={data} />
          <NotebookFacts data={data} />
          <NotebookSystems data={data} kindLabel={systemsKind} />
          <NotebookEvidence data={data} />
          <NotebookFooter crumb={crumb} />
        </main>
        <div></div>
      </div>
    </div>
  );
}

window.NotebookPage = NotebookPage;
