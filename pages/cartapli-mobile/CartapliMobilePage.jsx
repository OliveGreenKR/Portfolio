// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock / DataTable)
// 전용: viz.jsx · page.css
//
// 섹션 목록·순서·LEVEL 은 §03 섹션 계약이 정한다. 여기서 바꾸지 않는다.
//   knowledge_base/projects/cartapli_mobile/research/portfolio-flow.md · §03
//
//   S1 히어로 (L1) → S2 배경·저작 경계 (L3) → S3 병목의 위치 (L2)
//   → S4 구조 변경 (L2) → S5 판정 정책 (L3) → S6 병렬화 (L3)
//   → S7 측정 신뢰 (L2) → S8 단계별 기여 (L2) → S9 결과 동치 (L4) → S10 한계 (L4)
//
// 순서를 잠그는 것: S4 의 삭제가 S5 의 비용을 만들고, S5(확정 때) → S6(매 프레임) 은 빈도 축이며,
// S7 이 S8 보다 먼저 와야 −93.8% 가 자기 신고 숫자가 되지 않는다.

const { useEffect: useEffectCM, useState: useStateCM } = React;

const CM_RAIL = [
  { head: 'page' },
  { id: 'hero', label: 'hero' },
  { id: 'context', label: '01 · 경계' },
  { head: '실측이 정한 것' },
  { id: 'bottleneck', label: '02 · 오진' },
  { id: 'structure', label: '03 · 구조' },
  { id: 'policy', label: '04 · 정책' },
  { id: 'parallel', label: '05 · 병렬' },
  { head: '그 측정의 신뢰' },
  { id: 'rigor', label: '06 · 측정' },
  { id: 'stages', label: '07 · 기여' },
  { id: 'oracle', label: '08 · 검증' },
  { id: 'limits', label: '09 · 한계' },
];

/* ─── 공통 조각 ──────────────────────────────────────── */
function Gist({ children }) {
  return <p className="cm-gist">{window.renderInline(children)}</p>;
}

function Body({ children, className = '' }) {
  return <p className={`cm-body ${className}`}>{window.renderInline(children)}</p>;
}

function Cond() {
  return <p className="cm-cond">측정 조건 — {window.CM_DATA.cond}</p>;
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

function Table({ t }) {
  return (
    <div className="cm-scroll">
      <window.DataTable headers={t.headers} rows={t.rows} />
    </div>
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
        <a href="#bottleneck">Findings</a>
        <a href="#rigor">Rigor</a>
        <a href="#limits">Limits</a>
      </nav>
    </header>
  );
}

function CMRail() {
  const [active, setActive] = useStateCM('hero');
  useEffectCM(() => {
    const els = CM_RAIL.filter(s => s.id)
      .map(s => document.getElementById(s.id))
      .filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting);
      if (!vis.length) return;
      vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActive(vis[0].target.id);
    }, { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      {CM_RAIL.map((s, i) => s.head
        ? <span key={`h${i}`} className="nb-rail-section">{s.head}</span>
        : <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>{s.label}</a>
      )}
    </aside>
  );
}

/* ─── S1 히어로 (Level 1) ────────────────────────────── */
function CMHero({ data }) {
  const m = data.meta;
  const g = data.hero;
  return (
    <section id="hero" className="cm-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <h1 className="nb-title">{m.title}</h1>
      <p className="cm-hero-sub">{m.subtitle}</p>
      <p className="cm-core">{m.core}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      <figure className="cm-fig cm-fig-hero">
        <img src={g.src} width={g.w} height={g.h} alt={g.alt} />
        <figcaption className="cm-figcap">{window.renderInline(g.caption)}</figcaption>
      </figure>
    </section>
  );
}

/* ─── S2 배경 · 저작 경계 (Level 3) ──────────────────── */
function CMContext({ data }) {
  const ri = window.renderInline;
  const s = data.s2;
  return (
    <section id="context" className="nb-section lv3">
      <SectionHead no="01" title="배경 — 프로젝트와 저작 경계" kind="CONTEXT" />
      <dl className="nb-facts">
        {s.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>
      <div className="cm-roles">
        <div className="cm-role">
          <div className="cm-role-h"><span className="glyph">✓</span> 이 프로젝트에서 내가 만든 것</div>
          <p>{ri(s.mine)}</p>
        </div>
        <div className="cm-role warn">
          <div className="cm-role-h"><span className="glyph">⚠️</span> 내 작업이 아닌 것</div>
          <p>{ri(s.others)}</p>
        </div>
      </div>
    </section>
  );
}

/* ─── S3 병목의 위치 (Level 2) ───────────────────────── */
function CMBottleneck({ data }) {
  const s = data.s3;
  return (
    <section id="bottleneck" className="nb-section lv2">
      <SectionHead no="02" title="병목의 위치 — 예상과 실측" kind="DIAGNOSIS" />
      <Gist>{s.gist}</Gist>
      <Body>{s.body}</Body>
      <Table t={s.table} />
      <p className="cm-tablecap">{window.renderInline(s.caption)}</p>
      <Cond />
      <Body>{s.after}</Body>
    </section>
  );
}

/* ─── S4 구조 변경 (Level 2) ─────────────────────────── */
function CMStructure({ data }) {
  const ri = window.renderInline;
  const s = data.s4;
  return (
    <section id="structure" className="nb-section lv2">
      <SectionHead no="03" title="구조 변경 — 레이어 수와 무관한 렌더 비용" kind="DECISION" />
      <Gist>{s.gist}</Gist>
      <Body className="cm-bg">{s.kernel}</Body>
      <div className="cm-steps">
        {s.changes.map(([h, b], i) => (
          <div className="cm-step" key={h}>
            <span className="cm-step-n">{i + 1}</span>
            <div>
              <div className="cm-step-k">{ri(h)}</div>
              <div className="cm-step-v">{ri(b)}</div>
            </div>
          </div>
        ))}
      </div>
      <Body>{s.alt}</Body>
      <Table t={s.table} />
      <p className="cm-tablecap">{ri(s.reconcile)}</p>
      <Body className="cm-tradeoff">{s.tradeoff}</Body>
    </section>
  );
}

/* ─── S5 판정 정책 (Level 3) ─────────────────────────── */
function CMPolicy({ data }) {
  const ri = window.renderInline;
  const s = data.s5;
  return (
    <section id="policy" className="nb-section lv3">
      <SectionHead no="04" title="가려진 레이어 판정의 선택" kind="TRADE-OFF" />
      <Body>{s.intro}</Body>
      <Table t={s.table} />
      <Cond />
      <Body>{s.decide}</Body>
      <Body className="cm-tradeoff">{s.tradeoff}</Body>
      <div className="cm-callout">
        <div className="cm-callout-h">{s.revert.title}</div>
        <div className="cm-callout-b">{ri(s.revert.body)}</div>
      </div>
    </section>
  );
}

/* ─── S6 병렬화 (Level 3) ────────────────────────────── */
function CMParallel({ data }) {
  const s = data.s6;
  return (
    <section id="parallel" className="nb-section lv3">
      <SectionHead no="05" title="분할의 병렬화와 결과 순서" kind="IMPLEMENTATION" />
      <Body>{s.intro}</Body>
      <Body>{s.decision}</Body>
      <window.CMSlotViz />
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />
      <Body>{s.compose}</Body>
      <Body>{s.alt}</Body>
      <ul className="cm-results">
        {s.results.map((r, i) => <li key={i}>{window.renderInline(r)}</li>)}
      </ul>
      <Cond />
    </section>
  );
}

/* ─── S7 측정 신뢰 (Level 2) ─────────────────────────── */
function CMRigor({ data }) {
  const ri = window.renderInline;
  const s = data.s7;
  return (
    <section id="rigor" className="nb-section lv2">
      <SectionHead no="06" title="측정 자체의 신뢰" kind="RIGOR" />
      <Gist>{s.gist}</Gist>
      <Body>{s.split}</Body>
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />
      <Body>{s.remeasure}</Body>
      <window.CMDelta d={s.delta} />
      <div className="cm-rules">
        {s.rules.map(([h, b]) => (
          <div className="cm-rule" key={h}>
            <div className="cm-rule-k">{ri(h)}</div>
            <div className="cm-rule-v">{ri(b)}</div>
          </div>
        ))}
      </div>
      <Cond />
    </section>
  );
}

/* ─── S8 단계별 기여 (Level 2) ───────────────────────── */
function CMStages({ data }) {
  const s = data.s8;
  return (
    <section id="stages" className="nb-section lv2">
      <SectionHead no="07" title="단계별 기여의 분리" kind="RESULT" />
      <Gist>{s.gist}</Gist>
      <window.CMStageBars />
      <p className="cm-note">{window.renderInline(s.note)}</p>
      <Cond />
    </section>
  );
}

/* ─── S9 결과 동치 (Level 4) ─────────────────────────── */
function CMOracle({ data }) {
  const ri = window.renderInline;
  const s = data.s9;
  return (
    <section id="oracle" className="nb-section lv4">
      <SectionHead no="08" title="결과 동치의 검증" kind="APPENDIX" />
      <Body>{s.body}</Body>
      <ul className="cm-tests">
        {s.tests.map(([n, d, c]) => (
          <li key={n}>
            <span className="cm-test-n">{ri(n)}</span>
            <span className="cm-test-d">{ri(d)}</span>
            <span className="cm-test-c">{c}</span>
          </li>
        ))}
      </ul>
      <Body>{s.why}</Body>
    </section>
  );
}

/* ─── S10 한계 (Level 4) ─────────────────────────────── */
function CMLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section lv4">
      <SectionHead no="09" title="한계와 다음" kind="APPENDIX" />
      <div className="cm-limits">
        {data.s10.map(([k, v]) => (
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
        <CMRail />
        <main>
          <CMHero data={data} />
          <CMContext data={data} />
          <CMBottleneck data={data} />
          <CMStructure data={data} />
          <CMPolicy data={data} />
          <CMParallel data={data} />
          <CMRigor data={data} />
          <CMStages data={data} />
          <CMOracle data={data} />
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
