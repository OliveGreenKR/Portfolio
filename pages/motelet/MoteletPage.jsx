// pages/motelet/MoteletPage.jsx
// 전용 구성 — NotebookPage 공통 스키마(systems[])를 쓰지 않는다.
//
// 순서 = 경계 → 기하 월드 → 정확/근사 → 상한의 정의 → 체감의 정의 → 자동 탐색 → 대가.
//   이전 판의 "절끼리 인과가 없다" 는 폐기됐다. CORE(정답을 먼저 정의하고 정확/근사를
//   가른다)가 절 사이 인과를 만든다. 순서 교환 6건 중 5건이 잠겼다.
//   런타임이 밸런싱보다 앞이다 — 같은 방법이 런타임에서 세 번, 밸런싱에서 한 번
//   반복되므로 세 번 나온 쪽이 먼저여야 반복이 보인다.
//
// 계약(§03): 섹션 목록·순서·LEVEL 을 여기서 바꾸지 않는다.
//   hero 가 던진 질문("무엇이 몇 개까지")을 §04 가 답으로 회수한다 — 그 참조를 지우지 않는다.
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

// 다음 절의 첫 문장을 만드는 한 줄. 절 사이 인과를 눈에 보이게 한다.
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

// 정의 강조 — 코드가 아닌 것에 CODE 라벨을 붙이지 않는다.
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

// 접기 — Level 4. 필요할 때만 읽는 상세.
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
        <a href="#geo">Runtime</a>
        <a href="#define">Balance</a>
        <a href="#cost">Limits</a>
      </nav>
    </header>
  );
}

const MT_RAIL = [
  ['sec', 'page'],
  ['hero', '전체'],
  ['boundary', '01 경계'],
  ['sec', '런타임'],
  ['geo', '02 기하'],
  ['queries', '03 질의'],
  ['cap', '04 상한'],
  ['sec', '밸런싱'],
  ['define', '05 정의'],
  ['search', '06 탐색'],
  ['sec', 'wrap-up'],
  ['cost', '07 대가'],
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

/* ─── Hero — Level 1. CORE MESSAGE 는 페이지에 하나 ──── */
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

      {/* 이 그림은 장식이 아니라 §04 의 문제 그 자체다. 캡션은 질문만 던진다. */}
      <figure className="mt-shot">
        <img src={data.hero.img} alt="전투 화면 — 플레이어 하나와 화면을 덮은 적, 블랙홀과 밀대 효과가 동시에 돌고 있다" />
        <figcaption>{ri(data.hero.caption)}</figcaption>
      </figure>

      <window.MTBuilt items={data.built} />
    </section>
  );
}

/* ─── §01 경계 ───────────────────────────────────────── */
function MTBoundary({ data }) {
  const b = data.boundary;
  return (
    <section id="boundary" className="nb-section">
      <MTSectionHead no="01" title="맡은 것과 맡지 않은 것" kind="SCOPE" />
      <MTGist>{b.gist}</MTGist>
      <MTBody>{b.body}</MTBody>

      <div className="mt-tables">
        <window.DataTable title={b.ownership.title} headers={b.ownership.headers} rows={b.ownership.rows} />
        <window.DataTable title={b.scale.title} headers={b.scale.headers} rows={b.scale.rows} />
      </div>
      <p className="mt-note">{window.renderInline(b.note)}</p>

      <MTFold label={b.scaleMore.title}>
        <window.DataTable headers={b.scaleMore.headers} rows={b.scaleMore.rows} />
      </MTFold>

      <MTBridge>{b.bridge}</MTBridge>
    </section>
  );
}

/* ─── §02 기하 월드 ──────────────────────────────────── */
function MTGeo({ data }) {
  const g = data.geo;
  return (
    <section id="geo" className="nb-section">
      <MTSectionHead no="02" title="물리 엔진 자리에 들어간 것" kind="RUNTIME" />
      <MTGist>{g.gist}</MTGist>
      <MTBody>{g.problem}</MTBody>
      <MTBody>{g.decision}</MTBody>

      <window.MTGeoArchViz caption={g.vizCaption} />

      <MTPoints points={g.points} />
      <window.AsciiBlock title={g.code.title} intro={g.code.intro} code={g.code.code} result={g.code.result} />
      <MTBridge>{g.bridge}</MTBridge>
    </section>
  );
}

/* ─── §03 정확/근사 ──────────────────────────────────── */
function MTQueryCol({ q }) {
  const ri = window.renderInline;
  return (
    <div className="mt-qcol">
      <div className="mt-qtag">{q.tag}</div>
      <h3 className="mt-qtitle">{q.title}</h3>
      <p className="mt-body">{ri(q.why)}</p>
      <p className="mt-body">{ri(q.how)}</p>
      <p className="mt-qfall"><span className="mt-qfall-k">물러설 자리</span>{ri(q.fallback)}</p>
      <window.AsciiBlock title={q.code.title} intro={q.code.intro} code={q.code.code} result={q.code.result} />
    </div>
  );
}

function MTQueries({ data }) {
  const q = data.queries;
  return (
    <section id="queries" className="nb-section">
      <MTSectionHead no="03" title="정확해가 필요한 자리와 근사로 충분한 자리" kind="RUNTIME" />
      <MTGist>{q.gist}</MTGist>

      <div className="mt-twoviz">
        <window.MTDensityViz />
        <window.MTClearanceViz />
      </div>
      <p className="mt-figcap mt-figcap-shared">{window.renderInline(q.vizCaption)}</p>

      <div className="mt-qcols">
        <MTQueryCol q={q.left} />
        <MTQueryCol q={q.right} />
      </div>

      <MTBridge>{q.pattern}</MTBridge>
    </section>
  );
}

/* ─── §04 상한의 정의 ────────────────────────────────── */
function MTCap({ data }) {
  const c = data.cap;
  return (
    <section id="cap" className="nb-section">
      <MTSectionHead no="04" title="화면이 찼다는 것을 무엇으로 재는가" kind="RUNTIME" />
      <MTGist>{c.gist}</MTGist>
      {/* hero 가 던진 질문을 여기서 회수한다. 이 문단을 지우면 hero 그림이 장식이 된다. */}
      <MTBody>{c.recall}</MTBody>
      <MTBody>{c.decision}</MTBody>

      <MTPoints points={c.points} />
      <window.AsciiBlock title={c.code.title} intro={c.code.intro} code={c.code.code} result={c.code.result} />
      <MTBridge>{c.bridge}</MTBridge>
    </section>
  );
}

/* ─── §05 체감의 정의 ────────────────────────────────── */
function MTDefine({ data }) {
  const d = data.define;
  return (
    <section id="define" className="nb-section">
      <MTSectionHead no="05" title="성장 체감을 무엇으로 재는가" kind="BALANCE" />
      <MTGist>{d.gist}</MTGist>
      <MTBody>{d.problem}</MTBody>

      <MTDefn title={d.formula.title} intro={d.formula.intro} lines={d.formula.lines} result={d.formula.result} />

      <MTBody>{d.whyNotDps}</MTBody>
      <window.AsciiBlock title={d.code.title} intro={d.code.intro} code={d.code.code} result={d.code.result} />

      <MTSub title={d.policy.title} body={d.policy.body} />

      <MTBridge>{d.bridge}</MTBridge>
    </section>
  );
}

/* ─── §06 자동 탐색 ──────────────────────────────────── */
function MTSearch({ data }) {
  const ri = window.renderInline;
  const s = data.search;
  return (
    <section id="search" className="nb-section">
      <MTSectionHead no="06" title="목표 곡선을 주면 값을 맞춘다" kind="BALANCE" />
      <MTGist>{s.gist}</MTGist>
      <MTBody>{s.body}</MTBody>

      <MTPoints points={s.points} />
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />

      {/* 코드와 화면이 같은 것을 말하는 자리. 전체 창이라 가로 스와이프로 둔다. */}
      <figure className="mt-shot mt-shot-wide">
        <div className="mt-shot-scroll">
          <img src={s.shot.img} alt="스킬트리 에디터 전체 창 — 가운데 그래프 캔버스, 좌우에 탐색 패널과 모델 노브" />
        </div>
        <figcaption>{ri(s.shot.caption)}</figcaption>
      </figure>
      <figure className="mt-shot mt-shot-zoom">
        <img src={s.shot.zoom} alt="에디터 왼쪽 패널 확대 — 탐색 설정과 로그 성장률 산점도" />
        <figcaption>{ri(s.shot.zoomCaption)}</figcaption>
      </figure>
      <p className="mt-note">{ri(s.shot.note)}</p>

      <MTSub title={s.host.title} body={s.host.body} />

      <MTFold label={s.fold.title}>
        <window.DataTable headers={s.fold.headers} rows={s.fold.rows} />
      </MTFold>

      <MTBridge>{s.bridge}</MTBridge>
    </section>
  );
}

/* ─── §07 대가 ───────────────────────────────────────── */
function MTCost({ data }) {
  const ri = window.renderInline;
  const c = data.cost;
  return (
    <section id="cost" className="nb-section">
      <MTSectionHead no="07" title="갈라서 낸 대가" kind="LIMITS" />
      <MTGist>{c.gist}</MTGist>

      {/* 색면을 쓰지 않는다 — 한계 목록이 섹션 요지와 같은 톤이 되면 층이 뭉갠다. */}
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
          <MTBoundary data={data} />
          <MTGeo data={data} />
          <MTQueries data={data} />
          <MTCap data={data} />
          <MTDefine data={data} />
          <MTSearch data={data} />
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
