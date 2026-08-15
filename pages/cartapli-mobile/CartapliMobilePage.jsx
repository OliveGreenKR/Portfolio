// pages/cartapli-mobile/CartapliMobilePage.jsx
// 전용 구성 — NotebookPage 공통 스키마를 쓰지 않는다.
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock / DataTable)
// 전용: viz.jsx · page.css
//
// 절 목록·순서·LEVEL 은 §03 섹션 계약(2026-08-15 재작성)이 정한다. 여기서 바꾸지 않는다.
//   knowledge_base/projects/cartapli_mobile/research/portfolio-flow.md · §03
//
//   S1 히어로(L1) → S2 개요·경계(L3) → S3 최종결과(L2) → S4 지도(L2) → S5 진단(L2)
//   → S6 ①재사용(L3) → S7 ②삭제(L3) → S8 ③병합(L3) → S9 ④Burst(L3)
//   → S10 ⑤재측정(L3) → S11 ⑥판정(L3) → S12 검증·한계(L4)
//
// 순서를 잠그는 것은 **커밋 날짜**다 — S6~S11 이 385fd68(7/22) · 992c50a(7/23) ·
// 792bb3a(7/24) · cafa4ae(7/24) · f920035(7/24) · 0d73c39(8/12) 순이다.
// 순서를 바꾸면 날짜가 어긋난다. 그리고 각 절 첫 줄(`link`)이 앞 절을 명시적으로 가리킨다 —
// 잠금이 설계에만 있고 지면에 안 적혀 있으면 독자에게는 안 잠긴다(직전 회차 G2 미통과 원인).
//
// S6~S11 은 고정 리듬이다 — [기존→개선 그림] → [코드 쌍] → [설명 3줄].
// 전부 Level 3 인 것도 리듬의 일부다. 어느 방식이 더 중요해 보이면 리듬이 깨진다.

const { useEffect: useEffectCM, useState: useStateCM } = React;

// 레일 그룹 — 각 그룹 = 질문 하나 + 그 답. 이름이 그 절들에 대해 문자 그대로 참이어야 한다.
// 폐기한 이름: '네 방식'(⑤⑥이 어느 그룹에도 안 붙는다) · '측정의 신뢰'(⑥은 신뢰 문제가 아니다)
//              '결과와 범위'(02·03 은 범위가 아니다)
const CM_RAIL = [
  { head: 'page' },
  { id: 'hero', label: 'hero' },
  { head: '배경' },
  { id: 'context', label: '01 · 경계' },
  { head: '무엇을 벌었나' },
  { id: 'result', label: '02 · 최종' },
  { id: 'map', label: '03 · 지도' },
  { head: '어디가 비쌌나' },
  { id: 'diagnose', label: '04 · 병목' },
  { head: '무엇을 고쳤나' },
  { id: 'reuse', label: '05 · 재사용' },
  { id: 'prune', label: '06 · 버리기' },
  { id: 'merge', label: '07 · 병합' },
  { id: 'burst', label: '08 · Burst' },
  { head: '다시 재고, 고른 것' },
  { id: 'remeasure', label: '09 · 계측' },
  { id: 'policy', label: '10 · 판정' },
  { head: '어디까지 맞나' },
  { id: 'verify', label: '11 · 검증·한계' },
];

/* ─── 공통 조각 ──────────────────────────────────────── */
function Gist({ children }) {
  return <p className="cm-gist">{window.renderInline(children)}</p>;
}

function Body({ children, className = '' }) {
  return <p className={`cm-body ${className}`}>{window.renderInline(children)}</p>;
}

// 절의 첫 줄 — 앞 절을 명시적으로 가리켜 순서를 지면에 잠근다.
function Link({ children }) {
  return <p className="cm-link">{window.renderInline(children)}</p>;
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

// 설명 3줄 — 방식 절의 고정 리듬 마지막 칸. 세 줄을 넘기지 않는다(§02 REMOVE: 구구절절).
function Notes({ items }) {
  const ri = window.renderInline;
  return (
    <ul className="cm-notes">
      {items.map((t, i) => <li key={i}>{ri(t)}</li>)}
    </ul>
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
        <a href="#result">Result</a>
        <a href="#diagnose">Findings</a>
        <a href="#verify">Limits</a>
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

      <div className="cm-headline">
        <b className="cm-headline-v">{m.headline.v}</b>
        <span className="cm-headline-k">{m.headline.k}</span>
        <a className="cm-headline-a" href={m.headline.href}>{m.headline.hrefLabel}</a>
      </div>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className="nb-metapill"><b>{p.text}</b></span>
        ))}
      </div>

      <figure className="cm-fig cm-fig-hero">
        <img src={g.src} width={g.w} height={g.h} alt={g.alt} />
        <figcaption className="cm-figcap">{window.renderInline(g.caption)}</figcaption>
      </figure>
    </section>
  );
}

/* ─── S2 개요 · 저작 경계 (Level 3) ──────────────────── */
function CMContext({ data }) {
  const ri = window.renderInline;
  const s = data.s2;
  return (
    <section id="context" className="nb-section lv3">
      <SectionHead no="01" title="개요와 저작 경계" kind="CONTEXT" />
      {/* 경계가 정의표보다 먼저 온다 — 뒤에 두면 독자는 이미 전부를 내 작업으로 읽은 뒤다 */}
      <div className="cm-roles">
        <div className="cm-role">
          <div className="cm-role-h"><span className="glyph" aria-hidden="true">✓</span> 이 프로젝트에서 내가 만든 것</div>
          <p>{ri(s.mine)}</p>
        </div>
        <div className="cm-role warn">
          <div className="cm-role-h"><span className="glyph" aria-hidden="true">⚠️</span> 내 작업이 아닌 것</div>
          <p>{ri(s.others)}</p>
        </div>
      </div>
      <dl className="nb-facts">
        {s.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>
    </section>
  );
}

/* ─── S3 최종 결과 (Level 2) ─────────────────────────── */
function CMResult({ data }) {
  const s = data.s3;
  return (
    <section id="result" className="nb-section lv2">
      <SectionHead no="02" title="최종 결과 — 어느 단계가 얼마를 벌었나" kind="RESULT" />
      <Gist>{s.gist}</Gist>
      <Body>{s.lead}</Body>
      <window.CMStageBars />
      <Cond />
      <Notes items={s.notes} />
    </section>
  );
}

/* ─── S4 네 방식 한눈에 (Level 2) ────────────────────── */
function CMMap({ data }) {
  const s = data.s4;
  return (
    <section id="map" className="nb-section lv2">
      <SectionHead no="03" title="네 방식 한눈에" kind="MAP" />
      <Gist>{s.gist}</Gist>
      <Body>{s.lead}</Body>
      <window.CMMapViz />
    </section>
  );
}

/* ─── S5 진단 (Level 2) ──────────────────────────────── */
function CMDiagnose({ data }) {
  const s = data.s5;
  return (
    <section id="diagnose" className="nb-section lv2">
      <SectionHead no="04" title="진단 — 예상과 실측" kind="DIAGNOSIS" />
      <Gist>{s.gist}</Gist>
      <Body>{s.body}</Body>
      <window.CMDiagnoseViz />
      <Table t={s.table} />
      <p className="cm-tablecap">{window.renderInline(s.caption)}</p>
      <Cond />
      <Body className="cm-revised">{s.revised}</Body>
      <Body>{s.after}</Body>
    </section>
  );
}

/* ─── S6 ① 재사용 (Level 3) ─────────────────────────── */
function CMReuse({ data }) {
  const s = data.s6;
  return (
    <section id="reuse" className="nb-section lv3">
      <SectionHead no="05" title="① 안 바뀐 레이어는 다시 만들지 않는다" kind="2026-07-22" />
      <Link>{s.link}</Link>
      <window.CMReuseViz />
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
    </section>
  );
}

/* ─── S7 ② 삭제 (Level 3) ───────────────────────────── */
function CMPrune({ data }) {
  const s = data.s7;
  return (
    <section id="prune" className="nb-section lv3">
      <SectionHead no="06" title="② 가려진 레이어를 확정 때 버린다" kind="2026-07-23" />
      <Link>{s.link}</Link>
      <window.CMPruneViz />
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
    </section>
  );
}

/* ─── S8 ③ 병합 (Level 3) ───────────────────────────── */
function CMMerge({ data }) {
  const ri = window.renderInline;
  const s = data.s8;
  return (
    <section id="merge" className="nb-section lv3">
      <SectionHead no="07" title="③ 레이어당 렌더 오브젝트를 없애고 앞뒤 2메시로" kind="2026-07-24" />
      <Link>{s.link}</Link>
      <window.CMRenderStructViz />
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
      <Table t={s.table} />
      <p className="cm-tablecap">{ri(s.reconcile)}</p>
    </section>
  );
}

/* ─── S9 ④ Burst (Level 3) ──────────────────────────── */
function CMBurst({ data }) {
  const s = data.s9;
  return (
    <section id="burst" className="nb-section lv3">
      <SectionHead no="08" title="④ 분할을 Burst 잡과 네이티브 버퍼로" kind="2026-07-24" />
      <Link>{s.link}</Link>
      <window.CMSlotViz />
      <window.AsciiBlock title={s.slot.title} code={s.slot.code} />
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
      <ul className="cm-results">
        {s.results.map((r, i) => <li key={i}>{window.renderInline(r)}</li>)}
      </ul>
      <Cond />
    </section>
  );
}

/* ─── S10 ⑤ 재측정 (Level 3) ────────────────────────── */
function CMRemeasure({ data }) {
  const ri = window.renderInline;
  const s = data.s10;
  return (
    <section id="remeasure" className="nb-section lv3">
      <SectionHead no="09" title="⑤ 재기 전에 계측을 의심했다" kind="2026-07-24" />
      <Link>{s.link}</Link>
      <Body>{s.split}</Body>
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
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

/* ─── S11 ⑥ 판정 교체 (Level 3) ─────────────────────── */
function CMPolicy({ data }) {
  const ri = window.renderInline;
  const s = data.s11;
  return (
    <section id="policy" className="nb-section lv3">
      <SectionHead no="10" title="⑥ 가려짐 판정 방식을 다시 골랐다" kind="2026-08-12" />
      <Link>{s.link}</Link>
      <window.CMConvexSubViz />
      <window.CMCodePair p={s.pair} />
      <Notes items={s.notes} />
      <Table t={s.table} />
      <p className="cm-tablecap">{ri(s.tablecap)}</p>
      {/* 공통 Cond 를 쓰지 않는다 — 이 표는 세 방식을 따로 돌린 별도 하네스다 */}
      <p className="cm-cond">측정 조건 — {data.condPolicy}</p>
      <Body>{s.decide}</Body>
    </section>
  );
}

/* ─── S12 검증과 한계 (Level 4) ─────────────────────── */
function CMVerify({ data }) {
  const ri = window.renderInline;
  const s = data.s12;
  return (
    <section id="verify" className="nb-section lv4">
      <SectionHead no="11" title="검증과 한계" kind="APPENDIX" />
      <Body>{s.lead}</Body>
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
      <hr className="cm-hr" />
      <Body>{s.limitsLead}</Body>
      <div className="cm-limits">
        {s.limits.map(([k, v]) => (
          <div className="cm-limit" key={k}>
            <span className="cm-limit-k">{ri(k)}</span>
            <span className="cm-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
      <Body className="cm-close">{s.close}</Body>
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
          <CMResult data={data} />
          <CMMap data={data} />
          <CMDiagnose data={data} />
          <CMReuse data={data} />
          <CMPrune data={data} />
          <CMMerge data={data} />
          <CMBurst data={data} />
          <CMRemeasure data={data} />
          <CMPolicy data={data} />
          <CMVerify data={data} />
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
