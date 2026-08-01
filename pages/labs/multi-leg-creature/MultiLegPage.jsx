// pages/labs/multi-leg-creature/MultiLegPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마는 problem/decision/results/stack 네 칸을 항목마다 반복해 전부 같은 무게로 깐다.
//   그리고 마지막 Evidence 절이 표 하나를 반드시 요구하는데 이 PoC 에는 잴 것이 없다 —
//   이전 판은 그 칸을 채우려고 "가상의 baseline" 표 8행을 지어 넣었다.
//   `limits` 도 공통 렌더러가 모르는 필드라, 한계 절이 통째로 빠져 있었다.
//
// 순서 = 배경 → 만든 것 → 나눠 둔 것 → 튜닝 → 한계.
//   §02→§03, §03→§04 에만 handoff 를 둔다. §01·§05 는 앞뒤로 인과가 없다.
//   Labs 는 메인 페이지의 1/3 분량이 적정하다 — 본문 4절에서 멈춘다.
//
// 그림은 넷 중 둘만 진다. 자산이 hero 한 장뿐이고 추가 캡처가 불가능하다.
//   §02 힘 원리도 + 붙잡은 자리 접사 / §03 흐름 원리도.
//   §01·§04·§05 는 글만 — 넣을 그림이 없으면 넣지 않는다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline)
// 전용: viz.jsx · page.css

const { useEffect: useEffectML, useState: useStateML } = React;

/* ─── 공통 조각 ──────────────────────────────────────── */
function MLGist({ children }) {
  return <p className="ml-gist">{window.renderInline(children)}</p>;
}

function MLSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function MLHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="ml-handoff">
      <span className="ml-handoff-k">이어서</span>
      <div>
        <div className="ml-handoff-q">{ri(h.q)}</div>
        <div className="ml-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function MLPoints({ points }) {
  const ri = window.renderInline;
  return (
    <div className="ml-pts">
      {points.map(([k, v], i) => (
        <div className="ml-pt" key={k}>
          <span className="ml-pt-n">{i + 1}</span>
          <div>
            <div className="ml-pt-k">{ri(k)}</div>
            <div className="ml-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 화면 캡처 한 장. loading="lazy" 는 쓰지 않는다 — 그림이 둘뿐이고,
   "스크롤해야 뜬다" 는 상태가 검증을 흐리는 비용이 더 크다. */
function MLShot({ f }) {
  return (
    <figure className="ml-shot">
      <img src={f.src} alt={f.alt} />
      <figcaption className="ml-figcap">{window.renderInline(f.cap)}</figcaption>
    </figure>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function MLHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">labs / multi-leg-creature</span>
      </div>
      <nav className="nb-nav">
        <a href="#force">만든 것</a>
        <a href="#split">나눠 둔 것</a>
        <a href="#tune">튜닝</a>
        <a href="#limits">한계</a>
      </nav>
    </header>
  );
}

function MLRail() {
  const [active, setActive] = useStateML('hero');
  useEffectML(() => {
    const ids = ['hero', 'context', 'force', 'split', 'tune', 'limits'];
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

  // 레일 폭은 120px 고정이다. 항 제목을 그대로 넣으면 11px mono 로 세 줄이 된다 — 짧은 키를 쓴다.
  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {link('hero', '전체')}
      {link('context', '01 · 배경')}
      <span className="nb-rail-section">build</span>
      {link('force', '02 · 만든 것')}
      {link('split', '03 · 나눠 둔 것')}
      {link('tune', '04 · 튜닝')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '05 · 한계')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function MLHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="ml-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="ml-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="ml-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      {/* 원본 hero.png 는 좌우에 회색·남색 레터박스가 있다. screen.png 는 실제 게임 화면만 잘라낸 것.
          화면 위 빨간·파란 글씨는 빌드에 들어 있는 튜토리얼 문구다 — 지울 수 없어 캡션이 받는다. */}
      <figure className="ml-hero-media">
        <img src="multi-leg-creature/assets/screen.png"
             alt="민트색 화면에 분홍 몸통과 다리 두 개, 위쪽에 파란 발판. 다리 하나가 발판 모서리를 붙잡고 있다." />
        <figcaption className="ml-figcap">
          화면 위 글씨는 빌드에 들어 있는 <b>튜토리얼 문구</b>다. 목표는 "위로 올라가세요" —
          바닥을 걷는 것이 아니라 발판을 붙잡아 가며 오른다.
        </figcaption>
      </figure>

      <window.MLBuilt items={data.built} />
    </section>
  );
}

/* 무엇이 이 페이지의 범위인가 */
function MLScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="ml-scope">
      <div className="ml-scope-head">{scope.title}</div>
      <p className="ml-scope-lead">{ri(scope.lead)}</p>
      <div className="ml-scope-cols">
        <div className="ml-scope-col reads">
          <div className="ml-scope-k">다루는 것</div>
          <ul>{scope.reads.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
        <div className="ml-scope-col skips">
          <div className="ml-scope-k">다루지 않는 것</div>
          <ul>{scope.skips.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
      </div>
      <p className="ml-scope-why">{ri(scope.why)}</p>
    </div>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function MLContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <MLSectionHead no="01" title="배경 — 여럿이 한 몸을 당기면 어떻게 되나" kind="CONTEXT" />
      <p className="ml-body">{ri(c.body)}</p>
      <p className="ml-body">{ri(c.body2)}</p>

      <div className="ml-tension">
        {c.tension.map(([k, v]) => (
          <div className="ml-tension-cell" key={k}>
            <div className="ml-tension-k">{ri(k)}</div>
            <div className="ml-tension-v">{ri(v)}</div>
          </div>
        ))}
      </div>
      <p className="ml-tension-why">{ri(c.tensionWhy)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <MLScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 만든 것 ────────────────────────────────────── */
function MLForce({ data }) {
  const ri = window.renderInline;
  const f = data.force;
  return (
    <section id="force" className="nb-section">
      <MLSectionHead no="02" title="만든 것 — 다리가 낸 힘의 합으로만 움직인다" kind="MECHANIC" />
      <MLGist>{f.gist}</MLGist>
      <p className="ml-body">{ri(f.body)}</p>
      <p className="ml-body">{ri(f.body2)}</p>
      {/* 원리도가 본문 두 문단 뒤에 온다 — 무엇을 더하는지 알아야 그림이 읽힌다. */}
      <window.MLForceViz />
      <p className="ml-body">{ri(f.body3)}</p>
      <MLPoints points={f.points} />
      <MLShot f={f.figure} />
      <MLHandoff h={f.handoff} />
    </section>
  );
}

/* ─── §03 나눠 둔 것 ─────────────────────────────────── */
function MLSplit({ data }) {
  const ri = window.renderInline;
  const s = data.split;
  return (
    <section id="split" className="nb-section">
      <MLSectionHead no="03" title="나눠 둔 것 — 다리는 서로를 모른다" kind="STRUCTURE" />
      <MLGist>{s.gist}</MLGist>
      <p className="ml-body">{ri(s.body)}</p>
      <p className="ml-body">{ri(s.body2)}</p>
      <p className="ml-body">{ri(s.body3)}</p>
      <window.MLFlowViz />
      <MLPoints points={s.points} />
      <MLHandoff h={s.handoff} />
    </section>
  );
}

/* ─── §04 튜닝 ───────────────────────────────────────── */
function MLTune({ data }) {
  const ri = window.renderInline;
  const t = data.tune;
  return (
    <section id="tune" className="nb-section">
      <MLSectionHead no="04" title="튜닝 — 값을 바꿔 보는 시간을 먼저 줄였다" kind="WORKFLOW" />
      <MLGist>{t.gist}</MLGist>
      <p className="ml-body">{ri(t.body)}</p>
      <p className="ml-body">{ri(t.body2)}</p>
      <p className="ml-body">{ri(t.body3)}</p>
      <MLPoints points={t.points} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function MLLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <MLSectionHead no="05" title="한계 — 안 한 것과 못 한 것" kind="OPEN" />
      <div className="ml-limits">
        {data.limits.map(([k, v]) => (
          <div className="ml-limit" key={k}>
            <span className="ml-limit-k">{ri(k)}</span>
            <span className="ml-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function MultiLegPage({ indexHref = '../../pages/landing.html' }) {
  const data = window.ML_DATA;
  return (
    <div className="nb-page">
      <MLHeader indexHref={indexHref} />
      <div className="nb-body">
        <MLRail />
        <main>
          <MLHero data={data} />
          <MLContext data={data} />
          <MLForce data={data} />
          <MLSplit data={data} />
          <MLTune data={data} />
          <MLLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · labs / multi-leg-creature</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.MultiLegPage = MultiLegPage;
