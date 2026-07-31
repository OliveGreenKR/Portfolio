// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock / DataTable)
// 전용: viz.jsx · page.css
//
// 읽는 순서 = 전체 성과 → 이전↔현재 → 왜 그 순서였나(3 사이클) → 검증 → 측정 신뢰 → 다음
// 사이클 카드의 `다음 문제` 배너가 다음 카드의 `관측` 이다.

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_NAV = [
  { id: 'hero',    label: '전체 성과' },
  { id: 'context', label: '01 · 배경 · 측정 조건' },
  { id: 'summary', label: '02 · 이전 ↔ 현재' },
];
const CM_NAV2 = [
  { id: 'verify', label: '04 · 검증' },
  { id: 'rigor',  label: '05 · 측정 신뢰' },
  { id: 'limits', label: '06 · 남은 것' },
];

/* ─── 공통 조각 ──────────────────────────────────────── */
function Gist({ children }) {
  return <p className="cm-gist">{window.renderInline(children)}</p>;
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

function Code({ block }) {
  return <window.AsciiBlock title={block.title} intro={block.intro} code={block.code} result={block.result} />;
}

/* ─── Chrome ─────────────────────────────────────────── */
function CMHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">projects / cartapli-mobile</span>
      </div>
      <nav className="nb-nav">
        <a href="#summary">Summary</a>
        <a href="#cycles">How</a>
        <a href="#rigor">Rigor</a>
      </nav>
    </header>
  );
}

function CMRail({ cycles }) {
  const [active, setActive] = useStateCM('hero');
  useEffectCM(() => {
    const ids = [...CM_NAV.map(s => s.id), 'cycles', ...cycles.map((c, i) => `cy-${i}`), ...CM_NAV2.map(s => s.id)];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting);
      if (!vis.length) return;
      vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActive(vis[0].target.id);
    }, { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cycles]);

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {CM_NAV.map(s => link(s.id, s.label))}
      <span className="nb-rail-section">03 · 왜 이 순서</span>
      {cycles.map((c, i) => link(`cy-${i}`, `${c.no} · ${c.title}`))}
      <span className="nb-rail-section">wrap-up</span>
      {CM_NAV2.map(s => link(s.id, s.label))}
    </aside>
  );
}

/* ─── Hero — 전체 성과 ───────────────────────────────── */
function CMHero({ data }) {
  const ri = window.renderInline;
  const { CMWaterfall, CMBigDelta } = window;
  const m = data.meta;
  return (
    <section id="hero" className="cm-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="cm-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="cm-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      <CMBigDelta items={data.bigs} />
      <p className="cm-defnote">{ri(data.hookNote)}</p>
      <CMWaterfall steps={data.waterfall} unit="ms" />
      <p className="cm-note">{ri(data.waterfallNote)}</p>
    </section>
  );
}

/* ─── §01 배경 · 측정 방법 ───────────────────────────── */
function CMContext({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  const c = data.context;
  const me = c.measure;
  return (
    <section id="context" className="nb-section">
      <SectionHead no="01" title="배경 · 측정 조건" kind="CONTEXT" />
      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <div className="cm-roles">
        <div className="cm-role">
          <div className="cm-role-h"><span className="glyph">✓</span> 본인 작업</div>
          <p>{ri(c.roles.mine)}</p>
        </div>
        <div className="cm-role warn">
          <div className="cm-role-h"><span className="glyph">⚠</span> 본인 작업 아님</div>
          <p>{ri(c.roles.others)}</p>
        </div>
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{me.title}</h3>
        <p className="cm-body">{ri(me.body)}</p>
        <div className="cm-scroll">
          <DataTable headers={me.metrics.headers} rows={me.metrics.rows} />
        </div>
        <p className="cm-note">{ri(me.metrics.note)}</p>
      </div>
    </section>
  );
}

/* ─── §02 이전 ↔ 현재 ────────────────────────────────── */
function CMSummary({ data }) {
  const ri = window.renderInline;
  const { CMCompare, CMLineChart } = window;
  const lc = data.layerCurve;
  return (
    <section id="summary" className="nb-section">
      <SectionHead no="02" title="무엇을 바꿨나 — 이전 ↔ 현재" kind="SUMMARY" />
      <Gist>{data.summary.gist}</Gist>
      <CMCompare rows={data.summary.rows} />
      <p className="cm-defnote">{ri(data.summary.defNote)}</p>
      <CMLineChart series={lc.series} yMax={lc.yMax} xLabel="접기 회차" yLabel="겹 수" caption={lc.caption} />
    </section>
  );
}

/* ─── §03 사이클 ─────────────────────────────────────── */
function Viz({ kind }) {
  const { CMBuriedViz, CMRendererViz, CMJobViz } = window;
  if (kind === 'buried') return <CMBuriedViz />;
  if (kind === 'renderer') return <CMRendererViz />;
  if (kind === 'job') return <CMJobViz />;
  return null;
}

function CMCycle({ c, idx }) {
  const ri = window.renderInline;
  return (
    <article id={`cy-${idx}`} className="cm-cycle">
      <div className="cm-cycle-head">
        <span className="cm-cycle-no">{c.no}</span>
        <h3 className="cm-cycle-title">{c.title}</h3>
        <span className="cm-cycle-tag">{c.tag}</span>
      </div>

      <div className="cm-row observe">
        <span className="cm-row-lbl">관측</span>
        <div className="cm-row-body">{ri(c.observe)}</div>
      </div>
      <div className="cm-row cause">
        <span className="cm-row-lbl">원인</span>
        <div className="cm-row-body">{ri(c.cause)}</div>
      </div>

      <div className="cm-how">
        <div className="cm-how-h">{c.howTitle}</div>
        {c.how.map(([h, b], i) => (
          <div className="cm-how-step" key={h}>
            <span className="cm-how-n">{i + 1}</span>
            <div>
              <div className="cm-how-k">{ri(h)}</div>
              <div className="cm-how-v">{ri(b)}</div>
            </div>
          </div>
        ))}
      </div>

      {c.viz && <Viz kind={c.viz} />}
      {c.code && <Code block={c.code} />}

      <div className="cm-result">
        <ul>{c.results.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
      </div>

      {c.callout && (
        <div className={`cm-callout ${c.callout.kind}`}>
          <div className="cm-callout-h">
            <span className="glyph">{c.callout.kind === 'ok' ? '◆' : '⚠'}</span>
            {ri(c.callout.title)}
          </div>
          <div className="cm-callout-b">{ri(c.callout.body)}</div>
        </div>
      )}

      <div className="cm-handoff">
        <span className="cm-handoff-k">다음 문제</span>
        <div>
          <div className="cm-handoff-q">{ri(c.next.q)}</div>
          <div className="cm-handoff-a">{ri(c.next.a)}</div>
        </div>
      </div>
    </article>
  );
}

function CMCycles({ data }) {
  return (
    <section id="cycles" className="nb-section">
      <SectionHead no="03" title="왜 이 순서였나 — 세 사이클" kind="HOW" />
      {data.cycles.map((c, i) => <CMCycle key={c.no} c={c} idx={i} />)}
    </section>
  );
}

/* ─── §04 검증 ───────────────────────────────────────── */
function CMVerify({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  const v = data.verify;
  return (
    <section id="verify" className="nb-section">
      <SectionHead no="04" title="검증 — 빨라진 것이 같은 결과인가" kind="VERIFICATION" />
      <Gist>{v.gist}</Gist>
      <p className="cm-body">{ri(v.body)}</p>
      <div className="cm-scroll">
        <DataTable headers={v.headers} rows={v.rows} />
      </div>
      <div className="cm-sub">
        <h3 className="cm-sub-title">{v.tests.title}</h3>
        <p className="cm-defnote">{ri(v.tests.note0)}</p>
        <div className="cm-scroll">
          <DataTable headers={['검사', '대조 대상', '케이스']} rows={v.tests.rows} />
        </div>
        <p className="cm-note">{ri(v.tests.note)}</p>
      </div>
    </section>
  );
}

/* ─── §05 측정 신뢰 ──────────────────────────────────── */
function CMRigor({ data }) {
  const ri = window.renderInline;
  const r = data.rigor;
  return (
    <section id="rigor" className="nb-section">
      <SectionHead no="05" title="측정 신뢰 — 내가 틀린 것들" kind="RIGOR" />
      <Gist>{r.gist}</Gist>
      <div className="cm-rigor">
        {r.cards.map(c => (
          <div key={c.badge} className={`cm-rigor-card ${c.kind}`}>
            <span className="cm-rigor-badge">{c.badge}</span>
            <span className="cm-rigor-title">{ri(c.title)}</span>
            <span className="cm-rigor-b">{ri(c.body)}</span>
          </div>
        ))}
      </div>
      <p className="cm-lesson">{ri(r.lesson)}</p>
    </section>
  );
}

/* ─── §06 다음 ───────────────────────────────────────── */
function CMLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <SectionHead no="06" title="남은 것 — 다음 대상과 아직 못 잰 것" kind="OPEN" />
      <div className="cm-limits">
        {data.limits.map(([k, v]) => (
          <div className="cm-limit" key={k}>
            <span className="cm-limit-k">{ri(k)}</span>
            <span className="cm-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function CartapliMobilePage({ indexHref = 'landing.html' }) {
  const data = window.CM_DATA;
  return (
    <div className="nb-page">
      <CMHeader indexHref={indexHref} />
      <div className="nb-body">
        <CMRail cycles={data.cycles} />
        <main>
          <CMHero data={data} />
          <CMContext data={data} />
          <CMSummary data={data} />
          <CMCycles data={data} />
          <CMVerify data={data} />
          <CMRigor data={data} />
          <CMLimits data={data} />
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
