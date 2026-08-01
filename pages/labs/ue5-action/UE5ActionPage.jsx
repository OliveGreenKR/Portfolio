// pages/labs/ue5-action/UE5ActionPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마의 Evidence 절이 표 하나를 요구하는데 이 프로젝트에는 잴 것이 없다.
//   이전 판은 그 칸을 "결과 — 이전 vs 이후" 표 6행으로 채웠고, 왼쪽 '이전' 열은
//   만든 적 없는 나쁜 구현이었다. `limits` 도 공통 렌더러가 몰라 한계 절이 통째로 없었다.
//
// 순서 = 배경 → 경계 → 타이밍 → 한계. 본문 3절.
//   §02→§03 한 곳에만 handoff. 8주짜리라 규모는 크지만 **주장은 둘뿐**이므로 절도 둘이다.
//   피격 반응은 독립 절로 세우지 않았다 — 경계 이야기의 한 사례라 §02 요점으로 넣었다.
//
// 히어로 자리를 원리도가 진다. 사진이 455×275 한 장뿐이라 히어로 폭에서 두 배로 늘어나고,
//   내용도 디버그 표시를 켠 화면이라 이 페이지의 주장과 무관하다 — §01 로 내려 원본 크기로 둔다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline)
// 전용: viz.jsx · page.css

const { useEffect: useEffectUA, useState: useStateUA } = React;

/* ─── 공통 조각 ──────────────────────────────────────── */
function UAGist({ children }) {
  return <p className="ua-gist">{window.renderInline(children)}</p>;
}

function UASectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function UAHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="ua-handoff">
      <span className="ua-handoff-k">이어서</span>
      <div>
        <div className="ua-handoff-q">{ri(h.q)}</div>
        <div className="ua-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function UAPoints({ points }) {
  const ri = window.renderInline;
  return (
    <div className="ua-pts">
      {points.map(([k, v], i) => (
        <div className="ua-pt" key={k}>
          <span className="ua-pt-n">{i + 1}</span>
          <div>
            <div className="ua-pt-k">{ri(k)}</div>
            <div className="ua-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 화면 캡처. 원본이 455×275 라 늘리지 않는다 — CSS 가 width 를 주지 않는다. */
function UAShot({ f }) {
  return (
    <figure className="ua-shot">
      <img src={f.src} alt={f.alt} />
      <figcaption className="ua-figcap">{window.renderInline(f.cap)}</figcaption>
    </figure>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function UAHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">labs / ue5-action</span>
      </div>
      <nav className="nb-nav">
        <a href="#context">배경</a>
        <a href="#boundary">경계</a>
        <a href="#timing">타이밍</a>
        <a href="#limits">한계</a>
      </nav>
    </header>
  );
}

function UARail() {
  const [active, setActive] = useStateUA('hero');
  useEffectUA(() => {
    const ids = ['hero', 'context', 'boundary', 'timing', 'limits'];
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

  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );

  // 레일 폭은 120px 고정이다 — 항 제목을 그대로 넣으면 11px mono 로 세 줄이 된다.
  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {link('hero', '전체')}
      {link('context', '01 · 배경')}
      <span className="nb-rail-section">build</span>
      {link('boundary', '02 · 경계')}
      {link('timing', '03 · 타이밍')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '04 · 한계')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function UAHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="ua-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="ua-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="ua-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      {/* 히어로 그림이 원리도다 — 사진 한 장이 이 페이지의 주장과 무관해서 §01 로 내렸다. */}
      <window.UABoundaryViz />
      <window.UABuilt items={data.built} />
    </section>
  );
}

function UAScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="ua-scope">
      <div className="ua-scope-head">{scope.title}</div>
      <p className="ua-scope-lead">{ri(scope.lead)}</p>
      <div className="ua-scope-cols">
        <div className="ua-scope-col reads">
          <div className="ua-scope-k">다루는 것</div>
          <ul>{scope.reads.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
        <div className="ua-scope-col skips">
          <div className="ua-scope-k">다루지 않는 것</div>
          <ul>{scope.skips.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
      </div>
      <p className="ua-scope-why">{ri(scope.why)}</p>
    </div>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function UAContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <UASectionHead no="01" title="배경 — 계속 고칠 수 있게 먼저 잡은 것" kind="CONTEXT" />
      <p className="ua-body">{ri(c.body)}</p>
      <p className="ua-body">{ri(c.body2)}</p>

      <div className="ua-tension">
        {c.tension.map(([k, v]) => (
          <div className="ua-tension-cell" key={k}>
            <div className="ua-tension-k">{ri(k)}</div>
            <div className="ua-tension-v">{ri(v)}</div>
          </div>
        ))}
      </div>
      <p className="ua-tension-why">{ri(c.tensionWhy)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <UAShot f={c.figure} />
      <UAScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 경계 ───────────────────────────────────────── */
function UABoundary({ data }) {
  const ri = window.renderInline;
  const b = data.boundary;
  return (
    <section id="boundary" className="nb-section">
      <UASectionHead no="02" title="경계 — 연결까지 코드 밖으로 내보냈다" kind="STRUCTURE" />
      <UAGist>{b.gist}</UAGist>
      <p className="ua-body">{ri(b.body)}</p>
      <p className="ua-body">{ri(b.body2)}</p>
      <p className="ua-body">{ri(b.body3)}</p>
      <UAPoints points={b.points} />
      <UAHandoff h={b.handoff} />
    </section>
  );
}

/* ─── §03 타이밍 ─────────────────────────────────────── */
function UATiming({ data }) {
  const ri = window.renderInline;
  const t = data.timing;
  return (
    <section id="timing" className="nb-section">
      <UASectionHead no="03" title="타이밍 — 공격 방향을 확정하는 순간" kind="FEEL" />
      <UAGist>{t.gist}</UAGist>
      <p className="ua-body">{ri(t.body)}</p>
      <p className="ua-body">{ri(t.body2)}</p>
      <window.UATimingViz />
      <p className="ua-body">{ri(t.body3)}</p>
      <UAPoints points={t.points} />
    </section>
  );
}

/* ─── §04 한계 ───────────────────────────────────────── */
function UALimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <UASectionHead no="04" title="한계 — 확인하지 못한 것" kind="OPEN" />
      <div className="ua-limits">
        {data.limits.map(([k, v]) => (
          <div className="ua-limit" key={k}>
            <span className="ua-limit-k">{ri(k)}</span>
            <span className="ua-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function UE5ActionPage({ indexHref = '../../pages/landing.html' }) {
  const data = window.UA_DATA;
  return (
    <div className="nb-page">
      <UAHeader indexHref={indexHref} />
      <div className="nb-body">
        <UARail />
        <main>
          <UAHero data={data} />
          <UAContext data={data} />
          <UABoundary data={data} />
          <UATiming data={data} />
          <UALimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · labs / ue5-action</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.UE5ActionPage = UE5ActionPage;
