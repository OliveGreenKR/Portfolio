// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유: 디자인 토큰(tokens.css) · 레이아웃 크롬(notebook.css) · notebook-components.jsx
// 전용: viz.jsx 의 차트/다이어그램 + page.css
//
// 페이지 전체가 하나의 사슬이다:
//   배경 → 측정 환경(얕게) → [관측 → 원인 → 해결 → 결과 → 다음 문제] × 5 → 종합 → 신뢰 → 다음 사이클
// 사이클 카드의 마지막 `다음 문제` 배너가 곧 다음 카드의 `관측` 이다. 순서를 바꾸면 이유가 사라진다.

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_NAV = [
  { id: 'hero',    label: 'Overview' },
  { id: 'context', label: '01 · 배경' },
  { id: 'env',     label: '02 · 측정 환경' },
  { id: 'cycles',  label: '03 · 개선 사이클' },
];
const CM_NAV2 = [
  { id: 'result', label: '04 · 결과 · 검증' },
  { id: 'rigor',  label: '05 · 측정 신뢰' },
  { id: 'limits', label: '06 · 다음 사이클' },
];

/* ─── 공통 조각 ──────────────────────────────────────── */
function Gist({ children }) {
  return <p className="cm-gist"><span className="cm-gist-k">요지</span>{window.renderInline(children)}</p>;
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
        <a href="#cycles">Cycles</a>
        <a href="#result">Result</a>
        <a href="#rigor">Rigor</a>
      </nav>
    </header>
  );
}

function CMRail({ cycles }) {
  const [active, setActive] = useStateCM('hero');
  useEffectCM(() => {
    const ids = [...CM_NAV.map(s => s.id), ...cycles.map(c => `cy-${c.no}`), ...CM_NAV2.map(s => s.id)];
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
      <span className="nb-rail-section">cycles</span>
      {cycles.map(c => link(`cy-${c.no}`, `${c.no} · ${c.title.slice(0, 10)}`))}
      <span className="nb-rail-section">wrap-up</span>
      {CM_NAV2.map(s => link(s.id, s.label))}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
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
      <CMWaterfall steps={data.waterfall} unit="ms · 마커 3종 합 (Average)" />
      <p className="cm-trail-note">{ri(data.waterfallNote)}</p>
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

/* ─── §02 측정 환경 (얕게) ───────────────────────────── */
function CMEnv({ data }) {
  const ri = window.renderInline;
  const { CMPipeline, DataTable } = window;
  const e = data.env;
  return (
    <section id="env" className="nb-section">
      <SectionHead no="02" title="측정 환경 — 비교가 성립하게 만든다" kind="SETUP" />
      <Gist>{e.gist}</Gist>

      <CMPipeline steps={e.steps} />

      <div className="cm-fixed">
        {e.fixed.map(([k, v], i) => (
          <div className="cm-fixed-item" key={k}>
            <span className="cm-fixed-n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="cm-fixed-k">{k}</div>
              <div className="cm-fixed-v">{ri(v)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{e.measured.title}</h3>
        <div className="cm-scroll">
          <DataTable headers={e.measured.headers} rows={e.measured.rows} />
        </div>
      </div>

      <p className="cm-handoff standalone">{ri(e.close)}</p>
    </section>
  );
}

/* ─── §03 사이클 ─────────────────────────────────────── */
function CMCycle({ c }) {
  const ri = window.renderInline;
  const { DataTable, MermaidToggle, CMStackViz, CMRendererViz, CMFrameViz, CMJobViz } = window;
  return (
    <article id={`cy-${c.no}`} className={`cm-cycle ${c.tagKind}`}>
      <div className="cm-cycle-head">
        <span className="cm-cycle-badge">{c.cycle}</span>
        <span className="cm-cycle-no">{c.no}</span>
        <h3 className="cm-cycle-title">{c.title}</h3>
        <span className={`cm-stage-tag ${c.tagKind}`}>{c.tag}</span>
      </div>

      {c.flip && (
        <div className="cm-flip">
          <div className="cm-flip-cell was"><span className="cm-flip-lbl">예상</span>{ri(c.flip.was)}</div>
          <div className="cm-flip-arrow">→</div>
          <div className="cm-flip-cell is"><span className="cm-flip-lbl">실측</span>{ri(c.flip.is)}</div>
        </div>
      )}

      {/* 관측 → 원인 */}
      <div className="cm-row observe">
        <span className="cm-row-lbl">관측</span>
        <div className="cm-row-body">{ri(c.observe)}</div>
      </div>
      <div className="cm-row cause">
        <span className="cm-row-lbl">원인</span>
        <div className="cm-row-body">{ri(c.cause)}</div>
      </div>

      {/* 해결 */}
      {c.fix && (
        <div className="cm-row fix">
          <span className="cm-row-lbl">해결</span>
          <div className="cm-row-body">
            <ul>{c.fix.map((f, i) => <li key={i}>{ri(f)}</li>)}</ul>
          </div>
        </div>
      )}

      {c.designPoints && (
        <div className="cm-row fix">
          <span className="cm-row-lbl">설계 결정</span>
          <div className="cm-row-body">
            <div className="cm-points">
              {c.designPoints.map(([h, b], i) => (
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

      {c.code && <Code block={c.code} />}

      {c.viz === 'stack' && <CMStackViz />}
      {c.viz === 'renderer' && <CMRendererViz />}
      {c.viz === 'frames' && <CMFrameViz />}
      {c.viz === 'job' && <CMJobViz />}

      {c.mermaid && (
        <MermaidToggle source={c.mermaid} label={`다이어그램 — ${c.no} ${c.title}`} hint="펼치기" />
      )}

      {/* 결과 */}
      {c.results && (
        <div className="cm-result">
          {c.delta && (
            <div className="cm-result-n">
              <span className="cm-result-delta">{c.delta}</span>
              <span className="cm-result-sub">{ri(c.deltaSub)}</span>
            </div>
          )}
          {!c.delta && <div className="cm-result-n"><span className="cm-result-sub">{ri(c.deltaSub)}</span></div>}
          <ul>{c.results.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
      )}
      {!c.results && c.deltaSub && (
        <div className="cm-result"><div className="cm-result-n"><span className="cm-result-sub">{ri(c.deltaSub)}</span></div></div>
      )}

      {c.table && (
        <div className="cm-sub">
          <div className="cm-scroll">
            <DataTable title={c.table.title} headers={c.table.headers} rows={c.table.rows} />
          </div>
          {c.tableNote && <p className="cm-note">{ri(c.tableNote)}</p>}
        </div>
      )}

      {c.callout && (
        <div className={`cm-callout ${c.callout.kind}`}>
          <div className="cm-callout-h">
            <span className="glyph">{c.callout.kind === 'ok' ? '◆' : '⚠'}</span>
            {ri(c.callout.title)}
          </div>
          <div className="cm-callout-b">{ri(c.callout.body)}</div>
        </div>
      )}

      {/* 다음 문제 — 다음 카드의 관측이 된다 */}
      {c.next && (
        <div className="cm-handoff">
          <span className="cm-handoff-k">다음 문제</span>
          <div>
            <div className="cm-handoff-q">{ri(c.next.q)}</div>
            <div className="cm-handoff-a">{ri(c.next.a)}</div>
          </div>
        </div>
      )}
    </article>
  );
}

function CMCycles({ data }) {
  const { CMLineChart, CMChainViz } = window;
  const lc = data.layerCurve;
  return (
    <section id="cycles" className="nb-section">
      <SectionHead no="03" title="개선 사이클 — 관측 → 원인 → 해결 → 다음 문제" kind={`${data.cycles.length} CYCLES`} />
      <Gist>{data.chain.gist}</Gist>
      <CMChainViz rows={data.chain.rows} caption={data.chain.caption} />
      <CMLineChart series={lc.series} yMax={lc.yMax} xLabel="접기 회차" yLabel="레이어 수" caption={lc.caption} />
      {data.cycles.map(c => <CMCycle key={c.no} c={c} />)}
    </section>
  );
}

/* ─── §04 결과 · 검증 ────────────────────────────────── */
function CMResult({ data }) {
  const ri = window.renderInline;
  const { DataTable, CMBars } = window;
  const r = data.result;
  const co = r.correctness;
  return (
    <section id="result" className="nb-section">
      <SectionHead no="04" title="결과 — 두 축으로 병기하고, 같은 결과인지 확인한다" kind="OUTCOME" />
      <Gist>{r.gist}</Gist>

      <div className="cm-barsgrid">
        {r.bars.map(b => <CMBars key={b.title} {...b} />)}
      </div>
      <p className="cm-note">{ri(r.axisNote)}</p>

      <div className="cm-sub">
        <div className="cm-scroll">
          <DataTable title={r.table.title} headers={r.table.headers} rows={r.table.rows} />
        </div>
      </div>

      <div className="cm-sub">
        <h3 className="cm-sub-title">{co.title}</h3>
        <p className="cm-body">{ri(co.body)}</p>
        <div className="cm-scroll">
          <DataTable headers={co.headers} rows={co.rows} />
        </div>
        <p className="cm-note">{ri(co.note)}</p>
        <div className="cm-scroll">
          <DataTable title="네이티브 구현은 관리형 구현을 오라클로 검증한다"
                     headers={['테스트', '대조 대상', '케이스']} rows={co.tests.rows} />
        </div>
        <p className="cm-note">{ri(co.tests.note)}</p>
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

/* ─── §06 다음 사이클 ────────────────────────────────── */
function CMLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <SectionHead no="06" title="다음 사이클 — 이미 지목돼 있는 것들" kind="OPEN" />
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
        <CMRail cycles={data.cycles} />
        <main>
          <CMHero data={data} />
          <CMContext data={data} />
          <CMEnv data={data} />
          <CMCycles data={data} />
          <CMResult data={data} />
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
