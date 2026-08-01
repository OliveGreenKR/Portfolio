// pages/labs/sound-system/SoundSystemPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//   공통 스키마는 problem/decision/results/stack 네 칸을 항목마다 반복해 전부 같은 무게로 깐다.
//   이 페이지는 §02(되는 일) → §03(그러려고 가른 자리) → §04(선이 맞았다는 증거) 로
//   뒤로 갈수록 무게가 실리는 구조라 위계가 필요하다.
//
// 순서 = 배경 → 되는 일 → 가른 자리 → 두 번째 적용 → 한계.
//   §02→§03, §03→§04 에만 handoff 를 둔다. §01·§05 는 앞뒤로 인과가 없다.
//   Labs 는 메인 페이지의 절반 이하 분량이 적정하다 — 본문 4절에서 멈춘다.
//
// 공유: tokens.css · notebook.css 크롬 · notebook-components.jsx (renderInline / AsciiBlock / DataTable)
// 전용: viz.jsx · page.css

const { useEffect: useEffectSD, useState: useStateSD } = React;

const SD_EF_IDS = ['ef-0', 'ef-1', 'ef-2'];

/* ─── 공통 조각 ──────────────────────────────────────── */
function SDGist({ children }) {
  return <p className="sd-gist">{window.renderInline(children)}</p>;
}

function SDSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function SDHandoff({ h }) {
  const ri = window.renderInline;
  return (
    <div className="sd-handoff">
      <span className="sd-handoff-k">이어서</span>
      <div>
        <div className="sd-handoff-q">{ri(h.q)}</div>
        <div className="sd-handoff-a">{ri(h.a)}</div>
      </div>
    </div>
  );
}

function SDPoints({ points }) {
  const ri = window.renderInline;
  return (
    <div className="sd-pts">
      {points.map(([k, v], i) => (
        <div className="sd-pt" key={k}>
          <span className="sd-pt-n">{i + 1}</span>
          <div>
            <div className="sd-pt-k">{ri(k)}</div>
            <div className="sd-pt-v">{ri(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 항 카드 — §02 의 세 항이 같은 형태를 쓴다.
   문제 한 줄 → 한 것 한 줄 → 요점 목록 */
function SDStep({ s, id }) {
  const ri = window.renderInline;
  return (
    <article id={id} className="sd-step">
      <div className="sd-step-head">
        <span className="sd-step-no">{s.no}</span>
        <h3 className="sd-step-title">{s.title}</h3>
      </div>
      <div className="sd-pd">
        <div className="sd-pd-row problem"><span>문제</span><p>{ri(s.problem)}</p></div>
        <div className="sd-pd-row did"><span>한 것</span><p>{ri(s.did)}</p></div>
      </div>
      <SDPoints points={s.points} />
    </article>
  );
}

/* ─── Chrome ─────────────────────────────────────────── */
function SDHeader({ indexHref }) {
  return (
    <header className="nb-header">
      <a className="nb-brand" href={indexHref}><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
      <div className="nb-crumbs">
        <a href={indexHref}>index</a><span className="sep">/</span>
        <span className="cur">labs / sound-system</span>
      </div>
      <nav className="nb-nav">
        <a href="#effects">되는 일</a>
        <a href="#seam">모듈 경계</a>
        <a href="#reuse">재사용</a>
        <a href="#limits">한계</a>
      </nav>
    </header>
  );
}

function SDRail({ steps }) {
  const [active, setActive] = useStateSD('hero');
  useEffectSD(() => {
    const ids = ['hero', 'context', 'effects', ...SD_EF_IDS.slice(0, steps.length),
                 'seam', 'reuse', 'limits'];
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
      {link('context', '01 · 배경')}
      {/* 레일 폭은 120px 고정이다. 항 제목을 그대로 넣으면 11px mono 로 세 줄이 된다 —
          데이터의 짧은 키(rail)를 쓴다. */}
      <span className="nb-rail-section">02 · 되는 일</span>
      {steps.map((s, i) => link(SD_EF_IDS[i], `${s.no} · ${s.rail || s.title}`))}
      <span className="nb-rail-section">structure</span>
      {link('seam', '03 · 모듈 경계')}
      {link('reuse', '04 · 복제와 값')}
      <span className="nb-rail-section">wrap-up</span>
      {link('limits', '05 · 한계')}
    </aside>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
function SDHero({ data }) {
  const ri = window.renderInline;
  const m = data.meta;
  return (
    <section id="hero" className="sd-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="sd-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="sd-hook">{ri(data.hook)}</p>

      <div className="nb-metarow">
        {m.pills.map((p, i) => (
          <span key={i} className={`nb-metapill ${p.kind === 'accent' ? 'accent' : ''}`}><b>{p.text}</b></span>
        ))}
      </div>

      <window.SDBeforeViz />
      <window.SDBuilt items={data.built} />
    </section>
  );
}

/* 무엇이 이 페이지의 범위인가 */
function SDScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="sd-scope">
      <div className="sd-scope-head">{scope.title}</div>
      <p className="sd-scope-lead">{ri(scope.lead)}</p>
      <div className="sd-scope-cols">
        <div className="sd-scope-col reads">
          <div className="sd-scope-k">이 페이지가 다루는 것</div>
          <ul>{scope.reads.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
        <div className="sd-scope-col skips">
          <div className="sd-scope-k">다루지 않는 것</div>
          <ul>{scope.skips.map(t => <li key={t}>{ri(t)}</li>)}</ul>
        </div>
      </div>
      <p className="sd-scope-why">{ri(scope.why)}</p>
    </div>
  );
}

/* ─── §01 배경 ───────────────────────────────────────── */
function SDContext({ data }) {
  const ri = window.renderInline;
  const c = data.context;
  return (
    <section id="context" className="nb-section">
      <SDSectionHead no="01" title="배경 — 부딪힌 두 요구" kind="CONTEXT" />
      <p className="sd-body">{ri(c.body)}</p>

      <div className="sd-tension">
        {c.tension.map(([k, v]) => (
          <div className="sd-tension-cell" key={k}>
            <div className="sd-tension-k">{ri(k)}</div>
            <div className="sd-tension-v">{ri(v)}</div>
          </div>
        ))}
      </div>
      <p className="sd-tension-why">{ri(c.tensionWhy)}</p>

      <dl className="nb-facts">
        {c.facts.map(([k, v]) => (
          <React.Fragment key={k}><dt>{k}</dt><dd>{ri(v)}</dd></React.Fragment>
        ))}
      </dl>

      <SDScope scope={c.scope} />
    </section>
  );
}

/* ─── §02 되는 일 — 효과부터 ─────────────────────────── */
function SDEffects({ data }) {
  const ri = window.renderInline;
  const e = data.effects;
  return (
    <section id="effects" className="nb-section">
      <SDSectionHead no="02" title="되는 일 — 클립마다 다르게 다룬다" kind="BEHAVIOUR" />
      <SDGist>{e.gist}</SDGist>
      {e.steps.map((s, i) => <SDStep key={s.key} s={s} id={SD_EF_IDS[i]} />)}
      {/* 그림은 셋을 다 읽은 뒤에 온다 — 셋이 한 경로 위에서 어떻게 만나는지가 그림의 몫이다. */}
      <window.SDPathViz />
      <SDHandoff h={e.handoff} />
    </section>
  );
}

/* ─── §03 가른 자리 — 구조 ───────────────────────────── */
function SDSeam({ data }) {
  const ri = window.renderInline;
  const s = data.seam;
  return (
    <section id="seam" className="nb-section">
      <SDSectionHead no="03" title="모듈 경계 — 클립 취득만 안에 넣었다" kind="ARCHITECTURE" />
      <SDGist>{s.gist}</SDGist>
      <p className="sd-body">{ri(s.body)}</p>
      <SDPoints points={s.points} />
      <window.AsciiBlock title={s.code.title} code={s.code.code} result={s.code.result} />
      <p className="sd-caution">{ri(s.caution)}</p>
      <SDHandoff h={s.handoff} />
    </section>
  );
}

/* ─── §04 두 번째 적용 — 증거 ────────────────────────── */
function SDReuse({ data }) {
  const ri = window.renderInline;
  const r = data.reuse;
  return (
    <section id="reuse" className="nb-section">
      <SDSectionHead no="04" title="복제 — 이펙트 리소스 시스템과 그 값" kind="EVIDENCE" />
      <SDGist>{r.gist}</SDGist>
      <p className="sd-body">{ri(r.body)}</p>
      <SDPoints points={r.points} />
      <window.AsciiBlock title={r.code.title} code={r.code.code} result={r.code.result} />
      <window.SDReuseViz />
      <window.DataTable title={r.tableTitle} headers={r.table.headers} rows={r.table.rows} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function SDLimits({ data }) {
  const ri = window.renderInline;
  return (
    <section id="limits" className="nb-section">
      <SDSectionHead no="05" title="한계 — 확인하지 않은 것" kind="OPEN" />
      <div className="sd-limits">
        {data.limits.map(([k, v]) => (
          <div className="sd-limit" key={k}>
            <span className="sd-limit-k">{ri(k)}</span>
            <span className="sd-limit-v">{ri(v)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function SoundSystemPage({ indexHref = '../../pages/landing.html' }) {
  const data = window.SOUND_DATA;
  return (
    <div className="nb-page">
      <SDHeader indexHref={indexHref} />
      <div className="nb-body">
        <SDRail steps={data.effects.steps} />
        <main>
          <SDHero data={data} />
          <SDContext data={data} />
          <SDEffects data={data} />
          <SDSeam data={data} />
          <SDReuse data={data} />
          <SDLimits data={data} />
          <footer className="nb-footer">
            <span>JCH · 2026 · labs / sound-system</span>
            <span>about / resume / contact</span>
          </footer>
        </main>
        <div></div>
      </div>
    </div>
  );
}
window.SoundSystemPage = SoundSystemPage;
