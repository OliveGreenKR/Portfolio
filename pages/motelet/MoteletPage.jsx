// pages/motelet/MoteletPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마는 시스템 카드를 나란히 세우는 형태라, 순서를 바꿔도 말이 된다.
//   이 페이지는 §02 의 스폰 천장이 §03 의 항으로 회수되는 사슬이 요지라 나열형이 죽인다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock / ScreenshotCarousel)
// 전용: viz.jsx · page.css
//
// 읽는 순서 = 배경 → 화면(런타임) → 모델 → 도구 → 자동 탐색 → 남은 것
// 각 절 끝의 `이어서` 배너가 다음 절의 첫 문장을 만든다.

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
        <a href="#runtime">Runtime</a>
        <a href="#model">Model</a>
        <a href="#tool">Tool</a>
      </nav>
    </header>
  );
}

function MTRail({ steps }) {
  const [active, setActive] = useStateMT('hero');
  useEffectMT(() => {
    const ids = ['hero', 'context', 'runtime', ...MT_STEP_IDS.slice(0, steps.length), 'model', 'tool', 'search', 'limits'];
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
      <span className="nb-rail-section">02 · 화면</span>
      {steps.map((s, i) => link(MT_STEP_IDS[i], `${s.no} · ${s.title}`))}
      <span className="nb-rail-section">밸런싱</span>
      {link('model', '03 · 모델')}
      {link('tool', '04 · 도구')}
      {link('search', '05 · 자동 탐색')}
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
      <MTSectionHead no="01" title="배경 — 인크레멘탈에서 성장은 게임 그 자체다" kind="CONTEXT" />
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

      <MTHandoff h={c.handoff} />
    </section>
  );
}

/* ─── §02 화면 ───────────────────────────────────────── */
function MTStep({ s, idx }) {
  const ri = window.renderInline;
  return (
    <article id={MT_STEP_IDS[idx]} className="mt-step">
      <div className="mt-step-head">
        <span className="mt-step-no">{s.no}</span>
        <h3 className="mt-step-title">{s.title}</h3>
      </div>
      <p className="mt-body">{ri(s.body)}</p>
      {/* §02 의 목록만 헤더가 없다 — 바로 위 mt-step-title 과 본문이 목록의 주제를
          이미 세우고 있어, 헤더를 붙이면 같은 말이 두 줄 연속으로 놓인다.
          §04·§05 는 상위 제목이 섹션 제목뿐이라 박스 안 헤더를 쓴다. */}
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
      <MTSectionHead no="02" title="화면 — 엔진이 정해 주지 않는 것 넷" kind="RUNTIME" />
      <MTGist>{r.gist}</MTGist>
      {r.steps.map((s, i) => <MTStep key={s.key} s={s} idx={i} />)}
      <MTHandoff h={r.handoff} />
    </section>
  );
}

/* ─── §03 모델 ───────────────────────────────────────── */
function MTModel({ data }) {
  const ri = window.renderInline;
  const m = data.model;
  return (
    <section id="model" className="nb-section">
      <MTSectionHead no="03" title="모델 — 어디까지 읽을 수 있다고 봤나" kind="MODEL" />
      <MTGist>{m.gist}</MTGist>
      <p className="mt-body">{ri(m.body)}</p>

      <window.AsciiBlock title={m.formula.title} intro={m.formula.intro} code={m.formula.code} result={m.formula.result} />

      <div className="mt-sub">
        <h4 className="mt-sub-title">{m.ceiling.title}</h4>
        <p className="mt-body">{ri(m.ceiling.body)}</p>
      </div>

      <div className="mt-sub">
        <h4 className="mt-sub-title">{m.mirror.title}</h4>
        <p className="mt-body">{ri(m.mirror.body)}</p>
      </div>

      <window.MTScope scope={m.scope} />
      <MTHandoff h={m.handoff} />
    </section>
  );
}

/* ─── §04 도구 ───────────────────────────────────────── */
function MTTool({ data }) {
  const ri = window.renderInline;
  const t = data.tool;
  return (
    <section id="tool" className="nb-section">
      <MTSectionHead no="04" title="도구 — 체감과 곡선을 나란히" kind="TOOL" />
      <MTGist>{t.gist}</MTGist>
      <p className="mt-body">{ri(t.loopBody)}</p>

      <MTPoints points={t.read} title={t.readTitle} />
      <window.MTNodeValueViz />

      <div className="mt-callout">
        <div className="mt-callout-h"><span className="glyph">◆</span> 실제 작업 방식</div>
        <div className="mt-callout-b">{ri(t.howBody)}</div>
      </div>

      <window.ScreenshotCarousel shots={t.shots} />
      <MTHandoff h={t.handoff} />
    </section>
  );
}

/* ─── §05 자동 탐색 ──────────────────────────────────── */
function MTSearch({ data }) {
  const ri = window.renderInline;
  const s = data.search;
  return (
    <section id="search" className="nb-section">
      <MTSectionHead no="05" title="자동 탐색 — 만든 것과 쓴 것" kind="OPTIMIZER" />
      <MTGist>{s.gist}</MTGist>
      <MTPoints points={s.built} title={s.builtTitle} />
      <p className="mt-body">{ri(s.costBody)}</p>
      <window.MTSearchCostViz />

      <div className="mt-callout warn">
        <div className="mt-callout-h"><span className="glyph">⚠</span> {ri(s.notUsed.title)}</div>
        <div className="mt-callout-b">{ri(s.notUsed.body)}</div>
      </div>
    </section>
  );
}

/* ─── §06 남은 것 ────────────────────────────────────── */
function MTLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <MTSectionHead no="06" title="남은 것 — 재지 않은 것과 못 한 것" kind="OPEN" />
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
          <MTRuntime data={data} />
          <MTModel data={data} />
          <MTTool data={data} />
          <MTSearch data={data} />
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
