// pages/dx11-engine/DX11Page.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마는 problem/decision/results/stack 여섯 칸을 항목마다 반복해 전부 같은 무게로 깐다.
//   이 페이지는 §02 의 한 결정이 나머지를 만든 구조라 위계가 필요하다.
//
// 순서 = 배경 → 데이터 소유권 → 프레임 루프 → 충돌 → 렌더링 → 코어 → 남은 것.
//   §02 안의 다섯 항만 앞뒤로 인과가 있다. handoff 배너는 거기에만 있다.
//   §03 은 §02 가 세운 "통로 넷" 이 한 틱 어디에 놓이는지를 받으므로 바로 뒤에 온다.
//   §04·05·06 은 서로 인과가 없어 다리를 놓지 않고 중요한 것부터 놓는다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock /
//       DataTable)
// 전용: viz.jsx · page.css

const { useEffect: useEffectDX, useState: useStateDX } = React;

const DX_BD_IDS = ['bd-0', 'bd-1', 'bd-2', 'bd-3', 'bd-4'];

/* ─── 공통 조각 ──────────────────────────────────────── */
function DXGist({ children }) {
  return <p className="dx-gist">{window.renderInline(children)}</p>;
}

function DXSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function DXHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="dx-handoff">
      <span className="dx-handoff-k">이어서</span>
      <div>
        <div className="dx-handoff-q">{ri(h.q)}</div>
        <div className="dx-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function DXPoints({ points, title }) {
  const ri = window.renderInline;
  return (
    <div className="dx-pts">
      {title && <div className="dx-pts-h">{ri(title)}</div>}
      {points.map(([k, v], i) => (
        <div className="dx-pt" key={k}>
          <span className="dx-pt-n">{i + 1}</span>
          <div>
            <div className="dx-pt-k">{ri(k)}</div>
            <div className="dx-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DXViz({ kind }) {
  if (kind === 'boundary') return <window.DXBoundaryViz />;
  if (kind === 'tick')     return <window.DXTickViz />;
  if (kind === 'compact')  return <window.DXCompactViz />;
  if (kind === 'fat')      return <window.DXFatAABBViz />;
  if (kind === 'swept')    return <window.DXSweptViz />;
  return null;
}

/* 항 카드 — §02 · §04 · §05 가 같은 형태를 쓴다.
   문제 한 줄 → 한 것 한 줄 → 요점 목록 → (표) → (그림) → (코드) → (이어서) */
function DXStep({ s, id }) {
  const ri = window.renderInline;
  return (
    <article id={id} className="dx-step">
      <div className="dx-step-head">
        <span className="dx-step-no">{s.no}</span>
        <h3 className="dx-step-title">{s.title}</h3>
      </div>
      <div className="dx-pd">
        <div className="dx-pd-row problem"><span>문제</span><p>{ri(s.problem)}</p></div>
        <div className="dx-pd-row did"><span>한 것</span><p>{ri(s.did)}</p></div>
      </div>
      <DXPoints points={s.points} />
      {s.table && (
        <window.DataTable title={s.tableTitle} headers={s.table.headers} rows={s.table.rows} />
      )}
      {s.viz && <DXViz kind={s.viz} />}
      {s.code && (
        <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />
      )}
      {s.handoff && <DXHandoff h={s.handoff} />}
    </article>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function DXHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">projects / dx11-engine</span>
      </div>
      <nav className="nb-nav">
        <a href="#boundary">Ownership</a>
        <a href="#frame">Frame</a>
        <a href="#collision">Collision</a>
        <a href="#render">Render</a>
        <a href="#limits">Open</a>
      </nav>
    </header>
  );
}

function DXRail({ steps }) {
  const [active, setActive] = useStateDX('hero');
  useEffectDX(() => {
    const ids = ['hero', 'context', 'boundary', ...DX_BD_IDS.slice(0, steps.length),
                 'frame', 'collision', 'render', 'core', 'limits'];
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
  }, [steps]);

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {link('hero', '전체')}
      {link('context', '01 · 배경 · 범위')}
      {/* 레일 폭은 120px 고정이다. 항 제목을 그대로 넣으면 11px mono 로 세 줄이 되고
          다섯 항이면 레일이 뷰포트를 넘긴다 — 짧은 키를 따로 받는다. */}
      <span className="nb-rail-section">02 · 데이터 소유권</span>
      {steps.map((s, i) => link(DX_BD_IDS[i], `${s.no} · ${s.rail || s.title}`))}
      <span className="nb-rail-section">systems</span>
      {link('frame', '03 · 프레임 루프')}
      {link('collision', '04 · 충돌')}
      {link('render', '05 · 렌더링')}
      {link('core', '06 · 코어 · 인프라')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '07 · 남은 것')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function DXHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="dx-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="dx-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="dx-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      <figure className="dx-shot">
        <img src={data.hero.img} alt={data.hero.caption} />
        <figcaption>{ri(data.hero.caption)}</figcaption>
      </figure>

      <window.DXBuilt items={data.built} />

      <div className="dx-links">
        <a href={data.repo.href} target="_blank" rel="noopener">{data.repo.label} ↗</a>
        <a href={data.youtube.href} target="_blank" rel="noopener">{data.youtube.label} ↗</a>
      </div>
    </section>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function DXContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <DXSectionHead no="01" title="배경 — 엔진 안쪽을 직접 짜 본다" kind="CONTEXT" />
      <p className="dx-body">{ri(c.body)}</p>
      <p className="dx-body">{ri(c.body2)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <window.DXScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 경계 — 본체 ────────────────────────────────── */
function DXBoundary({ data }) {
  const ri = window.renderInline;
  const b = data.boundary;
  return (
    <section id="boundary" className="nb-section">
      {/* 제목에 "경계" 를 쓰지 않는다 — §04 의 "여유 경계"(AABB) 와 같은 낱말이 되어 뜻이 갈린다. */}
      <DXSectionHead no="02" title="데이터 소유권 — 게임과 물리 사이에 무엇을 두었나" kind="ARCHITECTURE" />
      <DXGist>{b.gist}</DXGist>
      <p className="dx-lede">{ri(b.lede)}</p>
      {b.steps.map((s, i) => <DXStep key={s.key} s={s} id={DX_BD_IDS[i]} />)}
    </section>
  );
}

/* ─── §03 프레임 루프 ────────────────────────────────── */
/* §02 가 "통로 넷" 을 말했으므로, 그 넷이 한 틱 어디에 놓이는지를 여기서 바로 받는다. */
function DXFrame({ data }) {
  const ri = window.renderInline;
  const f = data.frame;
  return (
    <section id="frame" className="nb-section">
      <DXSectionHead no="03" title="프레임 루프 — 한 틱이 진행시키는 양을 묶는다" kind="SIMULATION" />
      <DXGist>{f.gist}</DXGist>
      <p className="dx-body">{ri(f.body)}</p>
      <DXViz kind={f.viz} />
      <DXPoints points={f.points} />
      <window.AsciiBlock title={f.code.title} intro={f.code.intro} code={f.code.code} result={f.code.result} />
    </section>
  );
}

/* ─── §04 충돌 ───────────────────────────────────────── */
function DXCollision({ data }) {
  const ri = window.renderInline;
  const c = data.collision;
  return (
    <section id="collision" className="nb-section">
      <DXSectionHead no="04" title="충돌 — 컴포넌트를 보지 않는 파이프라인" kind="PHYSICS" />
      <DXGist>{c.gist}</DXGist>
      {c.steps.map(s => <DXStep key={s.key} s={s} id={`col-${s.key}`} />)}
      <figure className="dx-shot">
        <img src={c.shot.src} alt={c.shot.caption} />
        <figcaption>{ri(c.shot.caption)}</figcaption>
      </figure>
    </section>
  );
}

/* ─── §05 렌더링 ─────────────────────────────────────── */
function DXRender({ data }) {
  const r = data.render;
  return (
    <section id="render" className="nb-section">
      <DXSectionHead no="05" title="렌더링 — 상태로 묶고 프레임 끝에 버린다" kind="RENDERING" />
      <DXGist>{r.gist}</DXGist>
      {r.steps.map(s => <DXStep key={s.key} s={s} id={`rn-${s.key}`} />)}
    </section>
  );
}

/* ─── §06 코어 · 인프라 ──────────────────────────────── */
function DXCore({ data }) {
  const c = data.core;
  return (
    <section id="core" className="nb-section">
      <DXSectionHead no="06" title="엔진 코어 · 인프라" kind="SYSTEM" />
      <DXGist>{c.gist}</DXGist>
      {c.groups.map(g => (
        <div className="dx-group" key={g.title}>
          <h3 className="dx-group-title">{g.title}</h3>
          <DXPoints points={g.points} />
          {g.table && (
            <window.DataTable title={g.tableTitle} headers={g.table.headers} rows={g.table.rows} />
          )}
          {g.code && (
            <window.AsciiBlock title={g.code.title} intro={g.code.intro} code={g.code.code} result={g.code.result} />
          )}
        </div>
      ))}
    </section>
  );
}

/* ─── §07 남은 것 ────────────────────────────────────── */
function DXLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <DXSectionHead no="07" title="남은 것 — 검증하지 않은 것" kind="OPEN" />
      <div className="dx-limits">
        {data.limits.map(([k, v]) => (
          <div className="dx-limit" key={k}>
            <span className="dx-limit-k">{ri(k)}</span>
            <span className="dx-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function DX11Page({ indexHref = 'landing.html' }) {
  const data = window.DX11_DATA;
  return (
    <div className="nb-page">
      <DXHeader indexHref={indexHref} />
      <div className="nb-body">
        <DXRail steps={data.boundary.steps} />
        <main>
          <DXHero data={data} />
          <DXContext data={data} />
          <DXBoundary data={data} />
          <DXFrame data={data} />
          <DXCollision data={data} />
          <DXRender data={data} />
          <DXCore data={data} />
          <DXLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · projects / dx11-engine</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.DX11Page = DX11Page;
