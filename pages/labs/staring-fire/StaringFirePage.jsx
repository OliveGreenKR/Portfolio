// pages/labs/staring-fire/StaringFirePage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마의 마지막 Evidence 절은 표 하나를 반드시 요구하는데 이 PoC 에는 잴 것이 없다 —
//   이전 판은 그 칸을 채우려고 "가상의 직결합 / 튜닝 baseline" 표 7행을 지어 넣었고,
//   `evidenceFirst: true` 로 그 가짜 비교를 §02 앞자리에 세워 두고 있었다.
//   `limits` 도 공통 렌더러가 모르는 필드라 한계 절이 통째로 빠져 있었다 (KB 에는 열 항목).
//
// 순서 = 배경 → 무엇을 굴리나 → 두 번 고친 것 → 게임과 시뮬 사이 → 한계.
//   §02→§03 한 곳에만 handoff 를 둔다.
//
// 그림 배치 — 자산 넉 장 + 원리도 둘.
//   §02 는 캡처 넉 장을 한 figure 로 묶는다. 넷이 같은 순간이 아니라는 경고를 한 곳에서 해야 해서다.
//   §03 은 경계 원리도, §04 는 창구 원리도. §01·§05 는 글만.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline)
// 전용: viz.jsx · page.css

const { useEffect: useEffectSF, useState: useStateSF } = React;

/* ─── 공통 조각 ──────────────────────────────────────── */
function SFGist({ children }) {
  return <p className="sf-gist">{window.renderInline(children)}</p>;
}

function SFSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function SFHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="sf-handoff">
      <span className="sf-handoff-k">이어서</span>
      <div>
        <div className="sf-handoff-q">{ri(h.q)}</div>
        <div className="sf-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function SFPoints({ points }) {
  const ri = window.renderInline;
  return (
    <div className="sf-pts">
      {points.map(([k, v], i) => (
        <div className="sf-pt" key={k}>
          <span className="sf-pt-n">{i + 1}</span>
          <div>
            <div className="sf-pt-k">{ri(k)}</div>
            <div className="sf-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 사고 하나 — 증상 / 왜 값으로는 안 되나 / 한 것. 세 줄이 이 절의 단위다. */
function SFCase({ c }) {
  const ri = window.renderInline;
  return (
    <article className="sf-case">
      <div className="sf-case-head">
        <span className="sf-case-no">{c.no}</span>
        <h3 className="sf-case-title">{c.title}</h3>
      </div>
      <div className="sf-case-row symptom"><span>증상</span><p>{ri(c.symptom)}</p></div>
      <div className="sf-case-row why"><span>값으론</span><p>{ri(c.why)}</p></div>
      <div className="sf-case-row did"><span>한 것</span><p>{ri(c.did)}</p></div>
    </article>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function SFHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">labs / staring-fire</span>
      </div>
      <nav className="nb-nav">
        <a href="#sim">굴리는 것</a>
        <a href="#fix">고친 것</a>
        <a href="#seam">경계</a>
        <a href="#limits">한계</a>
      </nav>
    </header>
  );
}

function SFRail() {
  const [active, setActive] = useStateSF('hero');
  useEffectSF(() => {
    const ids = ['hero', 'context', 'sim', 'fix', 'seam', 'limits'];
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
      {link('sim', '02 · 굴리는 것')}
      {link('fix', '03 · 고친 것')}
      {link('seam', '04 · 경계')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '05 · 한계')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function SFHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="sf-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="sf-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="sf-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      {/* 원본 캡처는 화면의 3분의 1만 격자이고 나머지가 빈 회색이다.
          render.png 는 격자 사각형(원본 x 711..1850 · y 157..1280)만 잘라낸 것. */}
      <figure className="sf-hero-media">
        <img src="staring-fire/assets/render.png"
             alt="격자무늬 배경 앞에서 장작 두 개 사이로 크림색 불꽃이 오르고 그 위로 어두운 연기가 번진다." />
      </figure>

      <window.SFBuilt items={data.built} />
    </section>
  );
}

function SFScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="sf-scope">
      <div className="sf-scope-head">{scope.title}</div>
      <p className="sf-scope-lead">{ri(scope.lead)}</p>
      <div className="sf-scope-cols">
        <div className="sf-scope-col reads">
          <div className="sf-scope-k">다루는 것</div>
          <ul>{scope.reads.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
        <div className="sf-scope-col skips">
          <div className="sf-scope-k">다루지 않는 것</div>
          <ul>{scope.skips.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
      </div>
      <p className="sf-scope-why">{ri(scope.why)}</p>
    </div>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function SFContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <SFSectionHead no="01" title="배경 — 반복 재생으로는 안 되는 것" kind="CONTEXT" />
      <p className="sf-body">{ri(c.body)}</p>
      <p className="sf-body">{ri(c.body2)}</p>

      <div className="sf-tension">
        {c.tension.map(([k, v]) => (
          <div className="sf-tension-cell" key={k}>
            <div className="sf-tension-k">{ri(k)}</div>
            <div className="sf-tension-v">{ri(v)}</div>
          </div>
        ))}
      </div>
      <p className="sf-tension-why">{ri(c.tensionWhy)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <SFScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 무엇을 굴리나 ──────────────────────────────── */
function SFSim({ data }) {
  const ri = window.renderInline;
  const s = data.sim;
  return (
    <section id="sim" className="nb-section">
      <SFSectionHead no="02" title="굴리는 것 — 속도와 온도, 그리고 연기" kind="SIMULATION" />
      <SFGist>{s.gist}</SFGist>
      <p className="sf-body">{ri(s.body)}</p>
      <p className="sf-body">{ri(s.body2)}</p>
      <p className="sf-body">{ri(s.body3)}</p>
      <SFPoints points={s.points} />
      <window.SFGallery g={s.gallery} />
      <SFHandoff h={s.handoff} />
    </section>
  );
}

/* ─── §03 두 번 고친 것 ──────────────────────────────── */
function SFFix({ data }) {
  const ri = window.renderInline;
  const f = data.fix;
  return (
    <section id="fix" className="nb-section">
      <SFSectionHead no="03" title="고친 것 — 값을 만져서는 안 멈추던 둘" kind="STABILITY" />
      <SFGist>{f.gist}</SFGist>
      {f.cases.map(c => <SFCase key={c.no} c={c} />)}
      {/* 원리도는 두 사고를 다 읽은 뒤에 온다 — 두 번째 것의 조건만 그린다. */}
      <window.SFBoundaryViz />
      <p className="sf-body sf-after">{ri(f.after)}</p>
    </section>
  );
}

/* ─── §04 게임과 시뮬 사이 ───────────────────────────── */
function SFSeam({ data }) {
  const ri = window.renderInline;
  const s = data.seam;
  return (
    <section id="seam" className="nb-section">
      <SFSectionHead no="04" title="경계 — 게임은 시뮬을 직접 부르지 않는다" kind="STRUCTURE" />
      <SFGist>{s.gist}</SFGist>
      <p className="sf-body">{ri(s.body)}</p>
      <p className="sf-body">{ri(s.body2)}</p>
      <window.SFSeamViz />
      <p className="sf-body">{ri(s.body3)}</p>
      <SFPoints points={s.points} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function SFLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <SFSectionHead no="05" title="한계 — 안 한 것과 못 한 것" kind="OPEN" />
      <div className="sf-limits">
        {data.limits.map(([k, v]) => (
          <div className="sf-limit" key={k}>
            <span className="sf-limit-k">{ri(k)}</span>
            <span className="sf-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function StaringFirePage({ indexHref = '../../pages/landing.html' }) {
  const data = window.SF_DATA;
  return (
    <div className="nb-page">
      <SFHeader indexHref={indexHref} />
      <div className="nb-body">
        <SFRail />
        <main>
          <SFHero data={data} />
          <SFContext data={data} />
          <SFSim data={data} />
          <SFFix data={data} />
          <SFSeam data={data} />
          <SFLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · labs / staring-fire</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.StaringFirePage = StaringFirePage;
