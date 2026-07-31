// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유: 디자인 토큰(tokens.css) · 레이아웃 크롬(notebook.css) · notebook-components.jsx
// 전용: viz.jsx 의 차트/다이어그램 + page.css
//
// 순서는 탑다운 — 결과 → 어떻게 쟀나 → 무엇을 믿을지 → 기준선 → 5단계 → 검증 → 데이터 → 한계.
// 모든 섹션·단계 머리에 `gist` 한 줄(30초 안에 요지가 잡히도록).

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_NAV = [
  { id: 'hero',        label: 'Overview' },
  { id: 'context',     label: '01 · 배경' },
  { id: 'pipeline',    label: '02 · 측정 파이프라인' },
  { id: 'metrics',     label: '03 · 지표 · 기준선' },
  { id: 'stages',      label: '04 · 5단계' },
];
const CM_NAV2 = [
  { id: 'correctness', label: '05 · 정확성' },
  { id: 'rigor',       label: '06 · 측정 신뢰' },
  { id: 'data',        label: '07 · 데이터' },
  { id: 'limits',      label: '08 · 한계' },
];

/* ─── 공통 조각 ──────────────────────────────────────── */
function Gist({ children }) {
  return (
    <p className="cm-gist"><span className="cm-gist-k">요지</span>{window.renderInline(children)}</p>
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

function Code({ block }) {
  return (
    <window.AsciiBlock title={block.title} intro={block.intro} code={block.code} result={block.result} />
  );
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
        <a href="#pipeline">Pipeline</a>
        <a href="#stages">Stages</a>
        <a href="#rigor">Rigor</a>
      </nav>
    </header>
  );
}

function CMRail({ stages }) {
  const [active, setActive] = useStateCM('hero');
  useEffectCM(() => {
    const ids = [...CM_NAV.map(s => s.id), ...stages.map(s => `st-${s.no}`), ...CM_NAV2.map(s => s.id)];
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
  }, [stages]);

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {CM_NAV.map(s => link(s.id, s.label))}
      <span className="nb-rail-section">stages</span>
      {stages.map(s => link(`st-${s.no}`, `${s.no} · ${s.title.slice(0, 11)}`))}
      <span className="nb-rail-section">evidence</span>
      {CM_NAV2.map(s => link(s.id, s.label))}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function CMHero({ data }) {
  const ri = window.renderInline;
  const { CMWaterfall, CMBigDelta, CMPipeline } = window;
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

      <CMWaterfall steps={data.waterfall} unit="ms · 마커 3종 합 (Average)" />
      <p className="cm-trail-note">{ri(data.waterfallNote)}</p>

      <div className="cm-howmeasured">
        <div className="cm-howmeasured-h">이 수치는 어떻게 나왔나</div>
        <p>{ri(data.pipelineMini.lede)}</p>
        <CMPipeline steps={data.pipelineMini.steps} compact />
        <a className="cm-inline-link" href="#pipeline">→ 파이프라인 전체 보기 (§02)</a>
      </div>
    </section>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function CMContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <SectionHead no="01" title="배경 — 이식이 곧 성능 문제였다" kind="CONTEXT" />
      <Gist>{c.gist}</Gist>
      <p className="cm-lede">{ri(c.lede)}</p>

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
    </section>
  );
}

/* ─── §02 측정 파이프라인 ────────────────────────────── */
function CMPipelineSection({ data }) {
  const ri = window.renderInline;
  const { CMPipeline, CMBranchViz, DataTable } = window;
  const p = data.pipeline;
  return (
    <section id="pipeline" className="nb-section">
      <SectionHead no="02" title="측정 파이프라인 — 고치기 전에 재는 법부터" kind="AUTOMATION" />
      <Gist>{p.gist}</Gist>
      <p className="cm-lede">{ri(p.lede)}</p>

      <CMPipeline steps={p.steps} />

      {p.blocks.map(b => (
        <div className="cm-sub" key={b.title}>
          <h3 className="cm-sub-title">{b.title}</h3>
          <p className="cm-body">{ri(b.body)}</p>
          {b.code && <Code block={b.code} />}
        </div>
      ))}

      <div className="cm-sub">
        <h3 className="cm-sub-title">{p.branch.title}</h3>
        <p className="cm-body">{ri(p.branch.body)}</p>
        <CMBranchViz branches={p.branch.branches} />
        <div className="cm-scroll">
          <DataTable headers={['', '대상', '이유']} rows={p.branch.freeze} />
        </div>
        <div className="cm-scroll">
          <DataTable title="실제로 깨졌던 두 번" headers={['', '무엇이 바뀌었나', '결과']} rows={p.branch.breaks} />
        </div>
      </div>
    </section>
  );
}

/* ─── §03 지표 · 기준선 ──────────────────────────────── */
function CMMetrics({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  const m = data.metrics;
  const b = m.baseline;
  return (
    <section id="metrics" className="nb-section">
      <SectionHead no="03" title="지표 설계 — 무엇을 믿을지 먼저 정한다" kind="METHOD" />
      <Gist>{m.gist}</Gist>

      <div className="cm-scroll">
        <DataTable headers={['후보 지표', '판정', '근거']} rows={m.choice} />
      </div>

      <div className="cm-controls">
        {m.controls.map(c => (
          <div className="cm-control" key={c.title}>
            <div className="cm-control-h">{c.title}</div>
            <p>{ri(c.body)}</p>
          </div>
        ))}
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{b.title}</h3>
        <div className="cm-flip">
          <div className="cm-flip-cell was"><span className="cm-flip-lbl">예상</span>{ri(b.was)}</div>
          <div className="cm-flip-arrow">→</div>
          <div className="cm-flip-cell is"><span className="cm-flip-lbl">실측</span>{ri(b.is)}</div>
        </div>
        <p className="cm-body">{ri(b.body)}</p>
        <Code block={b.code} />
      </div>
    </section>
  );
}

/* ─── §04 5단계 ──────────────────────────────────────── */
function CMStage({ stage }) {
  const ri = window.renderInline;
  const { DataTable, MermaidToggle, CMStackViz, CMRendererViz, CMFrameViz, CMJobViz } = window;
  return (
    <article id={`st-${stage.no}`} className="cm-stage">
      <div className="cm-stage-head">
        <span className="cm-stage-no">{stage.no}</span>
        <h3 className="cm-stage-title">{stage.title}</h3>
        <span className={`cm-stage-tag ${stage.tagKind}`}>{stage.tag}</span>
      </div>

      <p className="cm-stage-gist">{ri(stage.gist)}</p>

      <div className="cm-stage-delta">
        <span className="cm-stage-delta-n">{stage.delta}</span>
        <span className="cm-stage-delta-s">{ri(stage.deltaSub)}</span>
      </div>

      {stage.viz === 'stack' && <CMStackViz />}
      {stage.viz === 'renderer' && <CMRendererViz />}
      {stage.viz === 'frames' && <CMFrameViz />}
      {stage.viz === 'job' && <CMJobViz />}

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
              {stage.designPoints.map(([h, bd], i) => (
                <div className="cm-point" key={h}>
                  <span className="cm-point-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="cm-point-h">{ri(h)}</div>
                    <div className="cm-point-b">{ri(bd)}</div>
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

      {stage.code && <Code block={stage.code} />}

      {stage.table && (
        <div className="cm-sub">
          <div className="cm-scroll">
            <DataTable title={stage.table.title} headers={stage.table.headers} rows={stage.table.rows} />
          </div>
          {stage.tableNote && <p className="cm-note">{ri(stage.tableNote)}</p>}
        </div>
      )}

      {stage.mermaid && (
        <MermaidToggle source={stage.mermaid}
                       label={`다이어그램 — ${stage.no} ${stage.title}`} hint="펼치기" />
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
  const { CMLineChart } = window;
  const lc = data.layerCurve;
  return (
    <section id="stages" className="nb-section">
      <SectionHead no="04" title="5단계 — 구조로 얼마, DOTS로 얼마" kind={`${data.stages.length} STAGES`} />
      <Gist>부하의 정체는 레이어 수다. 먼저 **레이어를 줄이고**(S1), 그 다음 **그리는 방식과 계산 방식**을 바꿨다(S2).</Gist>
      <CMLineChart series={lc.series} yMax={lc.yMax} xLabel="접기 회차" yLabel="레이어 수" caption={lc.caption} />
      {data.stages.map(s => <CMStage key={s.no} stage={s} />)}
    </section>
  );
}

/* ─── §05 정확성 ─────────────────────────────────────── */
function CMCorrectness({ data }) {
  const ri = window.renderInline;
  const { DataTable } = window;
  const c = data.correctness;
  return (
    <section id="correctness" className="nb-section">
      <SectionHead no="05" title="정확성 — 빨라졌지만 결과는 같은가" kind="VERIFICATION" />
      <Gist>{c.gist}</Gist>
      <p className="cm-lede">{ri(c.lede)}</p>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{c.sameStimulus.title}</h3>
        <p className="cm-body">{ri(c.sameStimulus.body)}</p>
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

/* ─── §06 측정 신뢰 ──────────────────────────────────── */
function CMRigor({ data }) {
  const ri = window.renderInline;
  const r = data.rigor;
  return (
    <section id="rigor" className="nb-section">
      <SectionHead no="06" title="측정 신뢰 — 내가 틀린 것들" kind="RIGOR" />
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

/* ─── §07 데이터 ─────────────────────────────────────── */
function CMData({ data }) {
  const ri = window.renderInline;
  const { DataTable, CMBars } = window;
  const d = data.data;
  return (
    <section id="data" className="nb-section">
      <SectionHead no="07" title="데이터 — 두 축으로 병기" kind="METRICS" />
      <Gist>{d.gist}</Gist>

      <div className="cm-barsgrid">
        {d.bars.map(b => <CMBars key={b.title} {...b} />)}
      </div>
      <p className="cm-note">{ri(d.axisNote)}</p>

      {d.tables.map(t => (
        <div className="cm-sub" key={t.title}>
          <div className="cm-scroll">
            <DataTable title={t.title} headers={t.headers} rows={t.rows} />
          </div>
        </div>
      ))}
      <p className="cm-note">{ri(d.note)}</p>
    </section>
  );
}

/* ─── §08 한계 ───────────────────────────────────────── */
function CMLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <SectionHead no="08" title="한계 · 다음" kind="OPEN" />
      <Gist>{data.limitsGist}</Gist>
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
          <CMPipelineSection data={data} />
          <CMMetrics data={data} />
          <CMStages data={data} />
          <CMCorrectness data={data} />
          <CMRigor data={data} />
          <CMData data={data} />
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
