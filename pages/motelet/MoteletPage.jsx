// pages/motelet/MoteletPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//
// 순서 = 배경 → 모델 → 시뮬레이터 → 자동 탐색 → 배틀 런타임 → 남은 것.
//   절끼리 인과가 없다. 그래서 **중요한 것부터** 놓는다. 모델·시뮬레이터가 본체다.
//   handoff 배너는 실제로 이어지는 두 곳에만 있다 (모델 → 시뮬레이터 → 자동 탐색).
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx
// 전용: viz.jsx · page.css

const { useEffect: useEffectMT, useState: useStateMT } = React;

const MT_STEP_IDS = ['rt-0', 'rt-1', 'rt-2', 'rt-3'];

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

function MTHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="mt-handoff">
      <span className="mt-handoff-k">이어서</span>
      <div>
        <div className="mt-handoff-q">{ri(h.q)}</div>
        <div className="mt-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
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

function MTCallout({ title, body, kind }) {
  const ri = window.renderInline;
  return (
    <div className={`mt-callout ${kind || ''}`}>
      <div className="mt-callout-h"><span className="glyph">{kind === 'warn' ? '⚠' : '◆'}</span> {ri(title)}</div>
      <div className="mt-callout-b">{ri(body)}</div>
    </div>
  );
}

function MTSub({ title, body }) {
  const ri = window.renderInline;
  return (
    <div className="mt-sub">
      <h4 className="mt-sub-title">{title}</h4>
      <p className="mt-body">{ri(body)}</p>
    </div>
  );
}

function MTViz({ kind }) {
  if (kind === 'density') return <window.MTDensityViz />;
  if (kind === 'occupancy') return <window.MTOccupancyViz />;
  return null;
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
        <a href="#tool">Simulator</a>
        <a href="#runtime">Runtime</a>
      </nav>
    </header>
  );
}

function MTRail({ steps }) {
  const [active, setActive] = useStateMT('hero');
  useEffectMT(() => {
    const ids = ['hero', 'context', 'model', 'tool', 'search', 'runtime',
                 ...MT_STEP_IDS.slice(0, steps.length), 'limits'];
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
      {link('context', '01 · 배경 · 역할')}
      <span className="nb-rail-section">밸런싱</span>
      {link('model', '02 · 모델')}
      {link('tool', '03 · 시뮬레이터')}
      {link('search', '04 · 자동 탐색')}
      <span className="nb-rail-section">05 · 배틀 런타임</span>
      {steps.map((s, i) => link(MT_STEP_IDS[i], `${s.no} · ${s.title}`))}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '06 · 남은 것')}
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
      <p className="mt-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      <figure className="mt-shot">
        <img src={data.hero.img} alt={data.hero.caption} />
        <figcaption>{ri(data.hero.caption)}</figcaption>
      </figure>

      <window.MTBuilt items={data.built} />
    </section>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function MTContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <MTSectionHead no="01" title="배경 — 업그레이드 하나가 곧 게임이다" kind="CONTEXT" />
      <p className="mt-body">{ri(c.body)}</p>
      <p className="mt-body">{ri(c.body2)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <div className="mt-roles">
        <div className="mt-role">
          <div className="mt-role-h"><span className="glyph">✓</span> 본인 작업</div>
          <p>{ri(c.roles.mine)}</p>
        </div>
        <div className="mt-role warn">
          <div className="mt-role-h"><span className="glyph">⚠</span> 본인 작업 아님</div>
          <p>{ri(c.roles.others)}</p>
        </div>
      </div>
    </section>
  );
}

/* ─── §02 모델 ───────────────────────────────────────── */
function MTModel({ data }) {
  const ri = window.renderInline;
  const m = data.model;
  return (
    <section id="model" className="nb-section">
      <MTSectionHead no="02" title="모델 — 한 판의 골드를 무엇으로 쪼갰나" kind="MODEL" />
      <MTGist>{m.gist}</MTGist>
      <p className="mt-body">{ri(m.body)}</p>

      <window.MTDecompViz />

      <dl className="mt-terms">
        {m.terms.map(([k, v]) => (
          <React.Fragment key={k}><dt>{ri(k)}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <window.AsciiBlock title={m.formula.title} intro={m.formula.intro} code={m.formula.code} result={m.formula.result} />
      <MTSub title={m.source.title} body={m.source.body} />
      <window.MTScope scope={m.scope} />
      <MTHandoff h={m.handoff} />
    </section>
  );
}

/* ─── §03 시뮬레이터 ─────────────────────────────────── */
function MTTool({ data }) {
  const ri = window.renderInline;
  const t = data.tool;
  return (
    <section id="tool" className="nb-section">
      <MTSectionHead no="03" title="시뮬레이터 — 식을 반복해 곡선을 뽑는다" kind="TOOL" />
      <MTGist>{t.gist}</MTGist>
      <p className="mt-body">{ri(t.loopBody)}</p>

      <MTPoints points={t.read} title={t.readTitle} />
      <window.MTNodeValueViz />
      <MTCallout title={t.purpose.title} body={t.purpose.body} />

      <window.ScreenshotCarousel shots={t.shots} />
      <MTHandoff h={t.handoff} />
    </section>
  );
}

/* ─── §04 자동 탐색 ──────────────────────────────────── */
function MTSearch({ data }) {
  const ri = window.renderInline;
  const s = data.search;
  return (
    <section id="search" className="nb-section">
      <MTSectionHead no="04" title="자동 탐색 — 만든 것과 쓴 것" kind="OPTIMIZER" />
      <MTGist>{s.gist}</MTGist>
      <MTPoints points={s.built} title={s.builtTitle} />
      <p className="mt-body">{ri(s.costBody)}</p>
      <window.MTSearchCostViz />
      <MTCallout kind="warn" title={s.notUsed.title} body={s.notUsed.body} />
    </section>
  );
}

/* ─── §05 배틀 런타임 ────────────────────────────────── */
function MTStep({ s, idx }) {
  const ri = window.renderInline;
  return (
    <article id={MT_STEP_IDS[idx]} className="mt-step">
      <div className="mt-step-head">
        <span className="mt-step-no">{s.no}</span>
        <h3 className="mt-step-title">{s.title}</h3>
      </div>
      {/* 문제 한 줄 → 한 것 한 줄. 두 줄을 넘기지 않는다. */}
      <div className="mt-pd">
        <div className="mt-pd-row problem"><span>문제</span><p>{ri(s.problem)}</p></div>
        <div className="mt-pd-row did"><span>한 것</span><p>{ri(s.did)}</p></div>
      </div>
      {/* §05 의 목록만 헤더가 없다 — 바로 위 제목과 두 줄이 주제를 이미 세운다. */}
      <MTPoints points={s.points} />
      {s.link && (
        <p className="mt-xlink">
          {ri(s.link.text)} <a href={s.link.href}>{s.link.label}</a>
        </p>
      )}
      {s.viz && <MTViz kind={s.viz} />}
      {s.code && (
        <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />
      )}
    </article>
  );
}

function MTRuntime({ data }) {
  const r = data.runtime;
  return (
    <section id="runtime" className="nb-section">
      <MTSectionHead no="05" title="배틀 런타임 — 엔진이 정해 주지 않는 것 넷" kind="RUNTIME" />
      <MTGist>{r.gist}</MTGist>
      {r.steps.map((s, i) => <MTStep key={s.key} s={s} idx={i} />)}
    </section>
  );
}

/* ─── §06 남은 것 ────────────────────────────────────── */
function MTLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <MTSectionHead no="06" title="남은 것 — 재지 않은 것" kind="OPEN" />
      <div className="mt-limits">
        {data.limits.map(([k, v]) => (
          <div className="mt-limit" key={k}>
            <span className="mt-limit-k">{ri(k)}</span>
            <span className="mt-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
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
        <MTRail steps={data.runtime.steps} />
        <main>
          <MTHero data={data} />
          <MTContext data={data} />
          <MTModel data={data} />
          <MTTool data={data} />
          <MTSearch data={data} />
          <MTRuntime data={data} />
          <MTLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · projects / motelet</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.MoteletPage = MoteletPage;
