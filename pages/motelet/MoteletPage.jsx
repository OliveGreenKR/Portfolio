// pages/motelet/MoteletPage.jsx
//
// 구성 원칙 — 최대한 적은 글로, 거짓 없이, 가장 빠르게.
//   비교는 2열 표 / 순서는 스트립 / 규칙은 식 / 구조는 그림. 산문은 남는 것만.
//   절마다 "30초에 잡혀야 할 한 줄" 이 시각적으로 먼저 걸리는 자리에 있어야 한다.
//
// 비중 8:2 — 02·03·04(밸런싱) = 8, 05(런타임) = 2.
// hero 순서 = 제목 → hook → 게임 한 줄 → 만든 것 3칸 → 스크린샷.
//   3칸이 접힘선 아래로 밀리면 첫 화면이 아무것도 안 준다(30초 스캔 실측).

const { useEffect: useEffectMT, useState: useStateMT } = React;
const RI = s => window.renderInline(s);

/* ─── 공통 조각 ──────────────────────────────────────── */
const MTGist = ({ children }) => <p className="mt-gist">{RI(children)}</p>;
const MTBody = ({ children }) => <p className="mt-body">{RI(children)}</p>;
const MTNote = ({ children }) => <p className="mt-note">{RI(children)}</p>;

function MTSectionHead({ no, title, kind }) {
  return (
    <div className="nb-section-head">
      <span className="nb-section-no">§ {no}</span>
      <h2 className="nb-section-title">{title}</h2>
      <span className="nb-section-kind">{kind}</span>
    </div>
  );
}

function MTPoints({ points }) {
  return (
    <div className="mt-pts">
      {points.map(([k, v], i) => (
        <div className="mt-pt" key={k}>
          <span className="mt-pt-n">{i + 1}</span>
          <div>
            <div className="mt-pt-k">{RI(k)}</div>
            <div className="mt-pt-v">{RI(v)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 규칙·정의 — 코드가 아닌 것에 CODE 크롬을 붙이지 않는다.
function MTDefn({ title, intro, lines, result }) {
  return (
    <div className="mt-defn">
      <div className="mt-defn-h">{RI(title)}</div>
      {intro && <p className="mt-defn-intro">{RI(intro)}</p>}
      <dl className="mt-defn-rows">
        {lines.map(([k, v]) => (
          <React.Fragment key={k}><dt>{RI(k)}</dt><dd>{RI(v)}</dd></React.Fragment>
        ))}
      </dl>
      {result && <p className="mt-defn-note">{RI(result)}</p>}
    </div>
  );
}

const MTChips = ({ items }) => (
  <div className="mt-chips">{items.map(c => <span className="mt-chip" key={c}>{c}</span>)}</div>
);

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
        <a href="#model">밸런싱</a>
        <a href="#runtime">런타임</a>
        <a href="#cost">한계</a>
      </nav>
    </header>
  );
}

const MT_RAIL = [
  ['sec', 'page'], ['hero', '전체'], ['scope', '01 범위'],
  ['sec', '밸런싱'], ['model', '02 정의'], ['sim', '03 상대 비교'],
  ['sec', '런타임'], ['runtime', '04 기하'],
  ['sec', 'wrap-up'], ['cost', '05 한계'],
];

function MTRail() {
  const [active, setActive] = useStateMT('hero');
  useEffectMT(() => {
    const ids = MT_RAIL.filter(r => r[0] !== 'sec').map(r => r[0]);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(es => {
      const v = es.filter(e => e.isIntersecting);
      if (!v.length) return;
      v.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActive(v[0].target.id);
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
  const m = data.meta;
  return (
    <section id="hero" className="mt-hero">
      <div className="nb-eyebrow">{m.eyebrow}</div>
      <p className="mt-hero-sub">{m.subtitle}</p>
      <h1 className="nb-title">{m.title}</h1>
      <p className="mt-hook">{RI(data.hook)}</p>
      <p className="mt-what">{RI(data.what)}</p>

      {/* 3칸이 먼저다 — 첫 화면에서 이게 목차 역할을 한다. */}
      <window.MTBuilt items={data.built} />

      <figure className="mt-shot">
        <img src={data.hero.img} alt="전투 화면 — 플레이어 하나와 화면을 덮은 적, 광역 효과가 동시에 돌고 있다" />
        <figcaption>{RI(data.hero.caption)}</figcaption>
      </figure>
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
      <MTNote>{s.note}</MTNote>
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

      {/* 분해를 먼저 세운다. 트리가 최상위 3단, 아래 정의 블록이 잎 둘. */}
      <window.MTGoldDecompViz />
      <MTDefn title={m.formula.title} intro={m.formula.intro} lines={m.formula.lines} result={m.formula.result} />

      {/* 이 절의 진짜 주장 — 산문이었을 때 30초에 안 잡혔다. */}
      <window.DataTable title={m.minTable.title} headers={m.minTable.headers} rows={m.minTable.rows} />
      <window.AsciiBlock title={m.code.title} intro={m.code.intro} code={m.code.code} result={m.code.result} />
    </section>
  );
}

/* ─── §03 시뮬레이터를 쓴 방식 ───────────────────────── */
function MTSim({ data }) {
  const s = data.sim;
  return (
    <section id="sim" className="nb-section">
      <MTSectionHead no="03" title="쓴 방식 — 절대값이 아니라 상대 순위" kind="SIMULATOR" />
      <MTGist>{s.gist}</MTGist>

      {/* 두 열을 나란히 놓는 순간 "섞이면 안 된다" 가 증명된다. */}
      <window.DataTable title={s.split.title} headers={s.split.headers} rows={s.split.rows} />
      <MTNote>{s.splitNote}</MTNote>

      <MTPoints points={s.points} />
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />

      {/* 루프는 순서다. 순서는 화살표가 문장보다 빠르다. */}
      <div className="mt-loop">
        <div className="mt-loop-h">{RI(s.loop.title)}</div>
        <window.FSMTrail steps={s.loop.steps} />
        <p className="mt-body">{RI(s.loop.note)}</p>
      </div>

      <div className="mt-host">
        <div className="mt-host-h">{RI(s.host.title)}</div>
        <MTChips items={s.host.chips} />
        <p className="mt-body">{RI(s.host.body)}</p>
      </div>

      <figure className="mt-shot">
        <img src={s.shot.img} alt="스킬트리 에디터 — 노드 색이 상대 순위 히트맵, 우측이 소스/가정 config 패널, 좌하단이 구간 분석" />
        <figcaption>{RI(s.shot.caption)}</figcaption>
        <MTNote>{s.shot.note}</MTNote>
      </figure>

    </section>
  );
}

/* ─── §04 물리 엔진 없이 ─────────────────────────────── */
function MTRuntime({ data }) {
  const r = data.runtime;
  return (
    <section id="runtime" className="nb-section">
      <MTSectionHead no="04" title="물리 엔진 없이 — 커널 7 · 질의 4종" kind="RUNTIME" />
      <MTGist>{r.gist}</MTGist>

      {/* 답을 먼저. 산문 뒤에 묻어 두면 30초에 못 찾는다. */}
      <window.MTGeoArchViz caption={r.vizCaption} />

      <window.DataTable title={r.why.title} headers={r.why.headers} rows={r.why.rows} />
      <MTNote>{r.whyNote}</MTNote>

      <window.DataTable title={r.queries.title} headers={r.queries.headers} rows={r.queries.rows} />
      <MTDefn title={r.cap.title} intro={r.cap.intro} lines={r.cap.lines} result={r.cap.result} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function MTCost({ data }) {
  const c = data.cost;
  return (
    <section id="cost" className="nb-section">
      <MTSectionHead no="05" title="재지 않은 것과 근사인 자리" kind="LIMITS" />
      <MTGist>{c.gist}</MTGist>

      {/* 3분류가 안 보여서 11개가 평평한 자책 목록으로 읽혔다 — 카드로 세운다. */}
      <div className="mt-costcards">
        {c.groups.map(g => (
          <div className="mt-costcard" key={g.head}>
            <h3 className="mt-costcard-h">{g.head}</h3>
            <p className="mt-costcard-lead">{RI(g.lead)}</p>
            <ul>
              {g.items.map(([k, v]) => (
                <li key={k}><b>{RI(k)}</b><span>{RI(v)}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-close">{RI(c.close)}</p>
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
