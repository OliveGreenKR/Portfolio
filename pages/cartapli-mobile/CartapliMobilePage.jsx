// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유하는 것: 디자인 토큰(tokens.css) · 레이아웃 크롬(notebook.css: nb-header/nb-body/nb-rail/nb-section/nb-table)
//              · 재사용 컴포넌트(notebook-components.jsx: renderInline / AsciiBlock / DataTable / MermaidToggle)
// 새로 만든 것: 히어로 바 차트 · 단계 트레일 · 단계 카드 · 검증 카드 (pages/cartapli-mobile/page.css)

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_SECTIONS = [
  { id: 'hero',        label: 'Overview' },
  { id: 'context',     label: '01 · 배경' },
  { id: 'measure',     label: '02 · 측정 먼저' },
  { id: 'stages',      label: '03 · 5단계 개선' },
  { id: 'correctness', label: '04 · 정확성' },
  { id: 'rigor',       label: '05 · 측정 신뢰' },
  { id: 'data',        label: '06 · 데이터' },
  { id: 'limits',      label: '07 · 한계 · 다음' },
];

/* ─── Chrome ─────────────────────────────────────────── */
function CMHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}>
        <span className="nb-brand-mark"></span>
        JCH / PORTFOLIO
      </a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a>
        <span className="sep">/</span>
        <span className="cur">projects / cartapli-mobile</span>
      </div>
      <nav className="nb-nav">
        <a href="#stages">Stages</a>
        <a href="#rigor">Rigor</a>
        <a href="#data">Data</a>
      </nav>
    </header>
  );
}

function CMRail({ stages }) {
  const [active, setActive] = useStateCM('hero');
  useEffectCM(() => {
    const ids = [...CM_SECTIONS.map(s => s.id), ...stages.map(s => `st-${s.no}`)];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting);
        if (!vis.length) return;
        vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(vis[0].target.id);
      },
      { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2, 0.5] }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [stages]);

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {CM_SECTIONS.slice(0, 4).map(s => link(s.id, s.label))}
      <span className="nb-rail-section">stages</span>
      {stages.map(s => link(`st-${s.no}`, `${s.no} · ${s.title.slice(0, 12)}`))}
      <span className="nb-rail-section">evidence</span>
      {CM_SECTIONS.slice(4).map(s => link(s.id, s.label))}
    </aside>
  );
}

/* ─── Hero bar chart (인라인, 외부 라이브러리 없음) ───── */
function CMChart({ chart }) {
  const max = Math.max(...chart.rows.map(r => r.v));
  return (
    <div className={`cm-chart ${chart.accent === 'terra' ? 'terra' : ''}`}>
      <div className="cm-chart-head">
        <span className="cm-chart-title">{chart.title}</span>
        <span className="cm-chart-unit">{chart.unit}</span>
      </div>
      {chart.rows.map((r, i) => (
        <React.Fragment key={r.k}>
          <div className={`cm-bar-row ${i === chart.rows.length - 1 ? 'last' : ''}`}>
            <span className="cm-bar-k">{r.k}</span>
            <span className="cm-bar-track">
              <span className="cm-bar-fill" style={{ width: `${Math.max(1.5, (r.v / max) * 100)}%` }}></span>
            </span>
            <span className="cm-bar-v">{r.t}</span>
          </div>
          {r.note && <div className="cm-bar-note">{r.note}</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function CMHero({ data }) {
  const ri = window.renderInline;
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

      <div className="cm-charts">
        {data.charts.map(c => <CMChart key={c.title} chart={c} />)}
      </div>

      <div className="nb-stats">
        {data.heroMetrics.map((s, i) => (
          <div className="nb-stat" key={i}>
            <span className="nb-stat-n">{s.n}</span>
            <span className="nb-stat-l">{ri(s.label)}</span>
            <span className="nb-stat-s">{ri(s.sub)}</span>
          </div>
        ))}
      </div>

      <div className="cm-trail">
        {data.trail.map(t => (
          <div key={t.k} className={`cm-trail-cell ${t.kind}`}>
            <span className="cm-trail-k">{t.k}</span>
            <span className="cm-trail-label">{t.label}</span>
            <span className="cm-trail-delta">{t.delta}</span>
          </div>
        ))}
      </div>
      <p className="cm-trail-note">{ri(data.trailNote)}</p>
    </section>
  );
}

/* ─── §01 Context ────────────────────────────────────── */
function CMContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 01</span>
        <h2 className="nb-section-title">배경 — 이식이 곧 성능 문제였다</h2>
        <span className="nb-section-kind">CONTEXT</span>
      </div>

      <p className="cm-lede">{ri(c.lede)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt>
            <dd>{ri(v)}</dd>
          </React.Fragment>
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
    </section>
  );
}

/* ─── §02 측정 먼저 ──────────────────────────────────── */
function CMMeasure({ data }) {
  const ri = window.renderInline;
  const { AsciiBlock, DataTable } = window;
  const m = data.measure;
  return (
    <section id="measure" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 02</span>
        <h2 className="nb-section-title">측정 먼저 — 예상은 틀렸다</h2>
        <span className="nb-section-kind">BASELINE</span>
      </div>

      <p className="cm-lede">{ri(m.lede)}</p>

      <div className="cm-flip">
        <div className="cm-flip-cell was">
          <span className="cm-flip-lbl">예상</span>
          {m.finding.title.replace('예상 — ', '')}
        </div>
        <div className="cm-flip-arrow">→</div>
        <div className="cm-flip-cell is">
          <span className="cm-flip-lbl">실측</span>
          {ri(m.finding.result.replace('실측 — ', ''))}
        </div>
      </div>

      <p className="cm-lede">{ri(m.finding.body)}</p>

      <AsciiBlock
        title={m.finding.code.title}
        intro={m.finding.code.intro}
        code={m.finding.code.code}
        result={m.finding.code.result}
      />

      <div className="cm-sub">
        <h3 className="cm-sub-title">{m.metricChoice.title}</h3>
        <div className="cm-scroll">
          <DataTable headers={['지표', '판정과 근거']} rows={m.metricChoice.rows} />
        </div>
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{m.bench.title}</h3>
        <AsciiBlock title="벤치 조건 — 다섯 버전에 동일" code={m.bench.code} />
      </div>
    </section>
  );
}

/* ─── §03 Stages ─────────────────────────────────────── */
function CMStage({ stage }) {
  const ri = window.renderInline;
  const { AsciiBlock, DataTable, MermaidToggle } = window;
  return (
    <article id={`st-${stage.no}`} className="cm-stage">
      <div className="cm-stage-head">
        <span className="cm-stage-no">{stage.no}</span>
        <h3 className="cm-stage-title">{stage.title}</h3>
        <span className={`cm-stage-tag ${stage.tagKind}`}>{stage.tag}</span>
      </div>

      <div className="cm-stage-delta">
        <span className="cm-stage-delta-n">{stage.delta}</span>
        <span className="cm-stage-delta-s">{ri(stage.deltaSub)}</span>
      </div>

      <div className="cm-row what">
        <span className="cm-row-lbl">무엇을</span>
        <div className="cm-row-body">{ri(stage.what)}</div>
      </div>
      <div className="cm-row why">
        <span className="cm-row-lbl">왜 그렇게</span>
        <div className="cm-row-body">{ri(stage.why)}</div>
      </div>

      {stage.designPoints && (
        <div className="cm-row">
          <span className="cm-row-lbl">설계 결정</span>
          <div className="cm-row-body">
            <div className="cm-points">
              {stage.designPoints.map(([h, b], i) => (
                <div className="cm-point" key={h}>
                  <span className="cm-point-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="cm-point-h">{ri(h)}</div>
                    <div className="cm-point-b">{ri(b)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="cm-row">
        <span className="cm-row-lbl">결과</span>
        <div className="cm-row-body">
          <ul>{stage.results.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
      </div>

      {stage.table && (
        <div className="cm-sub">
          <div className="cm-scroll">
            <DataTable title={stage.table.title} headers={stage.table.headers} rows={stage.table.rows} />
          </div>
          {stage.tableNote && <p className="cm-note">{ri(stage.tableNote)}</p>}
        </div>
      )}

      {stage.code && (
        <AsciiBlock
          title={stage.code.title}
          intro={stage.code.intro}
          code={stage.code.code}
          result={stage.code.result}
        />
      )}

      {stage.mermaid && (
        <MermaidToggle
          source={stage.mermaid}
          label={`다이어그램 — ${stage.no} ${stage.title}`}
          hint="펼치기"
        />
      )}

      {stage.callout && (
        <div className={`cm-callout ${stage.callout.kind}`}>
          <div className="cm-callout-h">
            <span className="glyph">{stage.callout.kind === 'ok' ? '◆' : '⚠'}</span>
            {ri(stage.callout.title)}
          </div>
          <div className="cm-callout-b">{ri(stage.callout.body)}</div>
        </div>
      )}
    </article>
  );
}

function CMStages({ data }) {
  return (
    <section id="stages" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 03</span>
        <h2 className="nb-section-title">5단계 — 구조로 얼마, DOTS로 얼마</h2>
        <span className="nb-section-kind">{data.stages.length} STAGES</span>
      </div>
      {data.stages.map(s => <CMStage key={s.no} stage={s} />)}
    </section>
  );
}

/* ─── §04 정확성 ─────────────────────────────────────── */
function CMCorrectness({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  const c = data.correctness;
  return (
    <section id="correctness" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 04</span>
        <h2 className="nb-section-title">정확성 — 빨라졌지만 결과는 같은가</h2>
        <span className="nb-section-kind">VERIFICATION</span>
      </div>

      <p className="cm-lede">{ri(c.lede)}</p>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{c.sameStimulus.title}</h3>
        <p className="cm-lede">{ri(c.sameStimulus.body)}</p>
        <div className="cm-scroll">
          <DataTable headers={c.sameStimulus.headers} rows={c.sameStimulus.rows} />
        </div>
        <p className="cm-note">{ri(c.sameStimulus.note)}</p>
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{c.tests.title}</h3>
        <div className="cm-scroll">
          <DataTable headers={['테스트', '대조 대상', '케이스']} rows={c.tests.rows} />
        </div>
        <p className="cm-note">{ri(c.tests.note)}</p>
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
      <div className="nb-section-head">
        <span className="nb-section-no">§ 05</span>
        <h2 className="nb-section-title">측정 신뢰 — 내가 틀린 것들</h2>
        <span className="nb-section-kind">RIGOR</span>
      </div>

      <p className="cm-lede">{ri(r.lede)}</p>

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

/* ─── §06 데이터 ─────────────────────────────────────── */
function CMTables({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  return (
    <section id="data" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 06</span>
        <h2 className="nb-section-title">데이터 — 두 축으로 병기</h2>
        <span className="nb-section-kind">METRICS</span>
      </div>

      {data.tables.map(t => (
        <div className="cm-sub" key={t.title}>
          <div className="cm-scroll">
            <DataTable title={t.title} headers={t.headers} rows={t.rows} />
          </div>
        </div>
      ))}

      <p className="cm-note">{ri(data.tablesNote)}</p>
    </section>
  );
}

/* ─── §07 한계 ───────────────────────────────────────── */
function CMLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <div className="nb-section-head">
        <span className="nb-section-no">§ 07</span>
        <h2 className="nb-section-title">한계 · 다음</h2>
        <span className="nb-section-kind">OPEN</span>
      </div>
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
        <CMRail stages={data.stages} />
        <main>
          <CMHero data={data} />
          <CMContext data={data} />
          <CMMeasure data={data} />
          <CMStages data={data} />
          <CMCorrectness data={data} />
          <CMRigor data={data} />
          <CMTables data={data} />
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
