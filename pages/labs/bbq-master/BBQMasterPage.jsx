// pages/labs/bbq-master/BBQMasterPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마는 problem/decision/results/stack 네 칸을 항목마다 반복해 전부 같은 무게로 깐다.
//   그리고 마지막 Evidence 절이 표 하나를 반드시 요구하는데, 이 PoC 에는 잴 것이 없다 —
//   이전 판은 그 칸을 채우려고 "가상의 baseline" 표를 지어 넣었다.
//
// 순서 = 배경 → 만든 것 → 보이게 만든 것 → 갈라 둔 것 → 한계.
//   §02→§03, §03→§04 에만 handoff 를 둔다. §01·§05 는 앞뒤로 인과가 없다.
//   Labs 는 메인 페이지의 1/3 분량이 적정하다 — 본문 4절에서 멈춘다.
//
// 그림이 본체다. 네 절 중 셋이 그림을 하나씩 지고 있고, 본문이 그 그림을 받는다.
//   §02 원리도 + 단면 접사 / §03 원리도 + 자홍색 접사 / §04 결과 화면.
//   §01·§05 는 글만 — 그 자리에 넣을 그림이 없다면 넣지 않는다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / DataTable)
// 전용: viz.jsx · page.css

const { useEffect: useEffectBQ, useState: useStateBQ } = React;

/* ─── 공통 조각 ──────────────────────────────────────── */
function BQGist({ children }) {
  return <p className="bq-gist">{window.renderInline(children)}</p>;
}

function BQSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function BQHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="bq-handoff">
      <span className="bq-handoff-k">이어서</span>
      <div>
        <div className="bq-handoff-q">{ri(h.q)}</div>
        <div className="bq-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function BQPoints({ points, title }) {
  const ri = window.renderInline;
  return (
    <div className="bq-pts">
      {title && <div className="bq-pts-h">{ri(title)}</div>}
      {points.map(([k, v], i) => (
        <div className="bq-pt" key={k}>
          <span className="bq-pt-n">{i + 1}</span>
          <div>
            <div className="bq-pt-k">{ri(k)}</div>
            <div className="bq-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 화면 캡처 한 장 — 캡션은 그림만 줄 수 있는 것을 말한다. */
function BQShot({ f }) {
  return (
    <figure className="bq-shot">
      {/* loading="lazy" 를 쓰지 않는다 — 그림 넷이 전부다. 지연시켜 아끼는 것보다
          "스크롤해야 뜬다" 는 상태가 검증을 흐리는 비용이 크다. */}
      <img src={f.src} alt={f.alt} />
      <figcaption className="bq-figcap">{window.renderInline(f.cap)}</figcaption>
    </figure>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function BQHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">labs / bbq-master</span>
      </div>
      <nav className="nb-nav">
        <a href="#field">만든 것</a>
        <a href="#show">보이게</a>
        <a href="#model">갈라 둔 것</a>
        <a href="#limits">한계</a>
      </nav>
    </header>
  );
}

function BQRail() {
  const [active, setActive] = useStateBQ('hero');
  useEffectBQ(() => {
    const ids = ['hero', 'context', 'field', 'show', 'model', 'limits'];
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
      {link('field', '02 · 만든 것')}
      {link('show', '03 · 보이게')}
      {link('model', '04 · 갈라 둔 것')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '05 · 한계')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function BQHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="bq-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="bq-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="bq-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      {/* 히어로 그림은 만든 것을 한 눈에 보이는 컷이다.
          아래 절들이 이 그림의 부분을 잘라 다시 쓴다 — 같은 파일을 두 번 걸지 않는다. */}
      <figure className="bq-hero-media">
        <img src="bbq-master/assets/sliced-cut.png"
             alt="굽고 잘라 낸 고기 세 조각과, 화력 게이지 · 앞으로 5초 예보가 함께 보이는 실행 화면" />
      </figure>

      <window.BQBuilt items={data.built} />
    </section>
  );
}

/* 무엇이 이 페이지의 범위인가 */
function BQScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="bq-scope">
      <div className="bq-scope-head">{scope.title}</div>
      <p className="bq-scope-lead">{ri(scope.lead)}</p>
      <div className="bq-scope-cols">
        <div className="bq-scope-col reads">
          <div className="bq-scope-k">다루는 것</div>
          <ul>{scope.reads.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
        <div className="bq-scope-col skips">
          <div className="bq-scope-k">다루지 않는 것</div>
          <ul>{scope.skips.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
      </div>
      <p className="bq-scope-why">{ri(scope.why)}</p>
    </div>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function BQContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <BQSectionHead no="01" title="배경 — 숫자를 안 보여 주고 굽게 하기" kind="CONTEXT" />
      <p className="bq-body">{ri(c.body)}</p>
      <p className="bq-body">{ri(c.body2)}</p>

      <div className="bq-tension">
        {c.tension.map(([k, v]) => (
          <div className="bq-tension-cell" key={k}>
            <div className="bq-tension-k">{ri(k)}</div>
            <div className="bq-tension-v">{ri(v)}</div>
          </div>
        ))}
      </div>
      <p className="bq-tension-why">{ri(c.tensionWhy)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <BQScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 만든 것 ────────────────────────────────────── */
function BQField({ data }) {
  const ri = window.renderInline;
  const f = data.field;
  return (
    <section id="field" className="nb-section">
      <BQSectionHead no="02" title="만든 것 — 안쪽 상태를 따로 굴린다" kind="SIMULATION" />
      <BQGist>{f.gist}</BQGist>
      <p className="bq-body">{ri(f.body)}</p>
      <p className="bq-body">{ri(f.body2)}</p>
      {/* 원리도가 먼저 온다 — 격자가 어디에 붙어 있는지를 알아야 아래 네 줄이 읽힌다. */}
      <window.BQFrameViz />
      <BQPoints points={f.points} />
      <BQShot f={f.figure} />
      <BQHandoff h={f.handoff} />
    </section>
  );
}

/* ─── §03 보이게 만든 것 ─────────────────────────────── */
function BQShow({ data }) {
  const ri = window.renderInline;
  const s = data.show;
  return (
    <section id="show" className="nb-section">
      <BQSectionHead no="03" title="보이게 만든 것 — 어느 칸을 읽느냐" kind="VISUALISATION" />
      <BQGist>{s.gist}</BQGist>
      <p className="bq-body">{ri(s.body)}</p>
      <p className="bq-body">{ri(s.body2)}</p>
      <window.BQVoxelViz />
      <BQPoints points={s.points} />
      <window.DataTable title={s.tableTitle} headers={s.table.headers} rows={s.table.rows} />
      <BQShot f={s.figure} />
      <BQHandoff h={s.handoff} />
    </section>
  );
}

/* ─── §04 갈라 둔 것 ─────────────────────────────────── */
function BQModel({ data }) {
  const ri = window.renderInline;
  const m = data.model;
  return (
    <section id="model" className="nb-section">
      <BQSectionHead no="04" title="갈라 둔 것 — 칸에 무엇을 저장했나" kind="DATA MODEL" />
      <BQGist>{m.gist}</BQGist>
      <p className="bq-body">{ri(m.body)}</p>
      <p className="bq-body">{ri(m.body2)}</p>
      <BQPoints points={m.points} />
      <BQShot f={m.figure} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function BQLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <BQSectionHead no="05" title="한계 — 안 한 것과 못 한 것" kind="OPEN" />
      <div className="bq-limits">
        {data.limits.map(([k, v]) => (
          <div className="bq-limit" key={k}>
            <span className="bq-limit-k">{ri(k)}</span>
            <span className="bq-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function BBQMasterPage({ indexHref = '../../pages/landing.html' }) {
  const data = window.BBQ_DATA;
  return (
    <div className="nb-page">
      <BQHeader indexHref={indexHref} />
      <div className="nb-body">
        <BQRail />
        <main>
          <BQHero data={data} />
          <BQContext data={data} />
          <BQField data={data} />
          <BQShow data={data} />
          <BQModel data={data} />
          <BQLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · labs / bbq-master</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.BBQMasterPage = BBQMasterPage;
