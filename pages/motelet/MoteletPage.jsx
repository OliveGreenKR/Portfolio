// pages/motelet/MoteletPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//
// 비중 8:2 — 밸런싱이 본체다. 02·03·04(모델 → 시뮬 → 자동 탐색)가 8,
//   05(배틀 런타임)가 2. 런타임은 밸런싱의 근거가 아니라 병렬 작업이라 한 절로 누른다.
//
// 순서 = [주관이었다] → [정의했다] → [계산했다] → [자동화했다] → [런타임] → [한계]
//   02·03·04 는 한 사슬이다. 정의가 서야 곡선이 나오고, 곡선이 있어야 목표에 맞출 수 있다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx
// 전용: viz.jsx · page.css

const { useEffect: useEffectMT, useState: useStateMT } = React;

/* ─── 공통 조각 ──────────────────────────────────────── */
function MTGist({ children }) {
  return <p className="mt-gist">{window.renderInline(children)}</p>;
}

function MTSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function MTBody({ children }) {
  return <p className="mt-body">{window.renderInline(children)}</p>;
}

// 다음 절의 첫 문장을 만드는 한 줄.
function MTBridge({ children }) {
  return <p className="mt-bridge">{window.renderInline(children)}</p>;
}

function MTPoints({ points, title }) {
  const ri = window.renderInline;
  return (
    <div className="mt-pts">
      {title && <div className="mt-pts-h">{ri(title)}</div>}
      {points.map(([k, v], i) => (
        <div className="mt-pt" key={k}>
          <span className="mt-pt-n">{i + 1}</span>
          <div>
            <div className="mt-pt-k">{ri(k)}</div>
            <div className="mt-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MTSub({ title, body }) {
  return (
    <div className="mt-sub">
      <h3 className="mt-sub-title">{title}</h3>
      <p className="mt-body">{window.renderInline(body)}</p>
    </div>
  );
}

// 정의 강조 — 코드가 아닌 것에 CODE 크롬을 붙이지 않는다.
function MTDefn({ title, intro, lines, result }) {
  const ri = window.renderInline;
  return (
    <div className="mt-defn">
      <div className="mt-defn-h">{ri(title)}</div>
      {intro && <p className="mt-defn-intro">{ri(intro)}</p>}
      <dl className="mt-defn-rows">
        {lines.map(([k, v]) => (
          <React.Fragment key={k}><dt>{ri(k)}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>
      {result && <p className="mt-defn-note">{ri(result)}</p>}
    </div>
  );
}

// 접기 — 필요할 때만 읽는 상세.
function MTFold({ label, children }) {
  const [open, setOpen] = useStateMT(false);
  return (
    <div className={`mt-fold ${open ? 'open' : ''}`}>
      <button className="mt-fold-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="mt-fold-mark">{open ? '−' : '+'}</span>{label}
      </button>
      {open && <div className="mt-fold-body">{children}</div>}
    </div>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function MTHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">projects / motelet</span>
      </div>
      <nav className="nb-nav">
        <a href="#model">Model</a>
        <a href="#sim">Simulator</a>
        <a href="#search">Optimizer</a>
      </nav>
    </header>
  );
}

const MT_RAIL = [
  ['sec', 'page'],
  ['hero', '전체'],
  ['scope', '01 범위'],
  ['sec', '밸런싱'],
  ['model', '02 정의'],
  ['sim', '03 시뮬'],
  ['search', '04 탐색'],
  ['sec', '런타임'],
  ['runtime', '05 기하'],
  ['sec', 'wrap-up'],
  ['cost', '06 남은 것'],
];

function MTRail() {
  const [active, setActive] = useStateMT('hero');
  useEffectMT(() => {
    const ids = MT_RAIL.filter(r => r[0] !== 'sec').map(r => r[0]);
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
  }, []);

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      {MT_RAIL.map(([id, label], i) =>
        id === 'sec'
          ? <span className="nb-rail-section" key={`s${i}`}>{label}</span>
          : <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
      )}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function MTHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="mt-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="mt-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="mt-what">{ri(data.what)}</p>
      <p className="mt-hook">{ri(data.hook)}</p>

      <figure className="mt-shot">
        <img src={data.hero.img} alt="전투 화면 — 플레이어 하나와 화면을 덮은 적, 광역 효과가 동시에 돌고 있다" />
        <figcaption>{ri(data.hero.caption)}</figcaption>
      </figure>

      <window.MTBuilt items={data.built} />
    </section>
  );
}

/* ─── §01 맡은 범위 ──────────────────────────────────── */
function MTScope({ data }) {
  const s = data.scope;
  return (
    <section id="scope" className="nb-section">
      <MTSectionHead no="01" title="맡은 범위" kind="SCOPE" />
      <MTGist>{s.gist}</MTGist>

      <div className="mt-tables">
        <window.DataTable title={s.ownership.title} headers={s.ownership.headers} rows={s.ownership.rows} />
        <window.DataTable title={s.scale.title} headers={s.scale.headers} rows={s.scale.rows} />
      </div>
      <p className="mt-note">{window.renderInline(s.note)}</p>

      <MTBridge>{s.bridge}</MTBridge>
    </section>
  );
}

/* ─── §02 성장 체감의 정의 ───────────────────────────── */
function MTModel({ data }) {
  const m = data.model;
  return (
    <section id="model" className="nb-section">
      <MTSectionHead no="02" title="성장 체감의 정의" kind="MODEL" />
      <MTGist>{m.gist}</MTGist>
      <MTBody>{m.problem}</MTBody>

      <MTDefn title={m.formula.title} intro={m.formula.intro} lines={m.formula.lines} result={m.formula.result} />

      <MTSub title={m.decompose.title} body={m.decompose.body} />
      <MTBody>{m.whyNotDps}</MTBody>
      <window.AsciiBlock title={m.code.title} intro={m.code.intro} code={m.code.code} result={m.code.result} />

      <MTBridge>{m.bridge}</MTBridge>
    </section>
  );
}

/* ─── §03 성장 곡선 시뮬레이터 ───────────────────────── */
function MTSim({ data }) {
  const s = data.sim;
  return (
    <section id="sim" className="nb-section">
      <MTSectionHead no="03" title="성장 곡선 시뮬레이터" kind="SIMULATOR" />
      <MTGist>{s.gist}</MTGist>
      <MTBody>{s.body}</MTBody>

      <MTPoints points={s.points} />
      <p className="mt-honest">{window.renderInline(s.honest)}</p>

      <MTBridge>{s.bridge}</MTBridge>
    </section>
  );
}

/* ─── §04 수치 자동 탐색 ─────────────────────────────── */
function MTSearch({ data }) {
  const ri = window.renderInline;
  const s = data.search;
  return (
    <section id="search" className="nb-section">
      <MTSectionHead no="04" title="수치 자동 탐색" kind="OPTIMIZER" />
      <MTGist>{s.gist}</MTGist>
      <MTBody>{s.body}</MTBody>

      <MTPoints points={s.points} />
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />

      <MTFold label={s.fold.title}>
        <window.DataTable headers={s.fold.headers} rows={s.fold.rows} />
      </MTFold>

      <figure className="mt-shot mt-shot-zoom">
        <img src={s.shot.img} alt="에디터의 탐색 패널 — 설정과 로그 성장률 산점도, 아래 구간 분석" />
        <figcaption>{ri(s.shot.caption)}</figcaption>
        <p className="mt-note">{ri(s.shot.note)}</p>
      </figure>

      <MTSub title={s.host.title} body={s.host.body} />
      <MTBridge>{s.bridge}</MTBridge>
    </section>
  );
}

/* ─── §05 자체 2D 기하 쿼리 ──────────────────────────── */
function MTRuntime({ data }) {
  const r = data.runtime;
  return (
    <section id="runtime" className="nb-section">
      <MTSectionHead no="05" title="자체 2D 기하 쿼리" kind="RUNTIME" />
      <MTGist>{r.gist}</MTGist>
      <MTBody>{r.why}</MTBody>
      <MTBody>{r.what}</MTBody>

      <MTPoints points={r.points} />
      <window.AsciiBlock title={r.code.title} intro={r.code.intro} code={r.code.code} result={r.code.result} />

      <MTBridge>{r.bridge}</MTBridge>
    </section>
  );
}

/* ─── §06 남은 것 ────────────────────────────────────── */
function MTCost({ data }) {
  const ri = window.renderInline;
  const c = data.cost;
  return (
    <section id="cost" className="nb-section">
      <MTSectionHead no="06" title="남은 것" kind="LIMITS" />
      <MTGist>{c.gist}</MTGist>

      {c.groups.map(g => (
        <div className="mt-costgrp" key={g.head}>
          <h3 className="mt-costgrp-h">{g.head}</h3>
          <div className="mt-costs">
            {g.items.map(([k, v]) => (
              <div className="mt-cost" key={k}>
                <span className="mt-cost-k">{ri(k)}</span>
                <span className="mt-cost-v">{ri(v)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="mt-close">{ri(c.close)}</p>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function MoteletPage({ indexHref = 'landing.html' }) {
  const data = window.MOTELET_DATA;
  return (
    <div className="nb-page">
      <MTHeader indexHref={indexHref} />
      <div className="nb-body">
        <MTRail />
        <main>
          <MTHero data={data} />
          <MTScope data={data} />
          <MTModel data={data} />
          <MTSim data={data} />
          <MTSearch data={data} />
          <MTRuntime data={data} />
          <MTCost data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · projects / motelet</span>
            <a href={indexHref}>index</a>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.MoteletPage = MoteletPage;
