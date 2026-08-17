// pages/motelet/MoteletPage.jsx
//
// 순서 = brief.md Structure 계약.
//   hero → 01 게임 루프 → 02 밸런싱 에디터(캡처 먼저) → 02-A 정의 → 02-B 상대 순위 → 03 런타임 → 04 한계.
// 01 이 앞에 오는 이유: 뒤의 밸런싱 절이 전부 "판과 판 사이" 를 다룬다. 그 판이 뭔지 모르면 안 읽힌다.
// 02 는 탑다운 — 도구의 실물을 먼저 보이고 그다음 그 안의 정의·판단으로 내려간다.
// 역할 경계는 절을 만들지 않고 히어로 한 줄로 끝낸다.
// 비중 8:2 — 02(밸런싱)이 본체, 03(런타임)은 같은 판단이 런타임에서 반복된 사례.
//
// 절마다 "먼저 걸려야 할 것" 이 그림이다. 산문은 그림이 못 하는 말만 한다.
//   정의 → 트리·함수 그래프 / 경계 → 경계도 / 순서 → 루프 / 구조 → 디스패치 행렬 / 규모 → 막대.
// 이 페이지에는 계측이 없다. 그래서 "측정처럼 보이는 그림" 을 만들지 않는다(viz.jsx 규칙 1).

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

function MTSubHead({ tag, children }) {
  return <h3 className="mt-subhead"><span>{tag}</span>{children}</h3>;
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
// 식 본문만 mono, '←' 뒤 우리말 주석은 본문 글꼴로 뺀다(한글은 mono 스택에서 자간이 벌어진다).
function MTDefn({ title, intro, lines, result }) {
  return (
    <div className="mt-defn">
      <div className="mt-defn-h">{RI(title)}</div>
      {intro && <p className="mt-defn-intro">{RI(intro)}</p>}
      <dl className="mt-defn-rows">
        {lines.map(([k, v]) => {
          const [expr, aside] = v.split('←');
          return (
            <React.Fragment key={k}>
              <dt>{RI(k)}</dt>
              <dd><code>{expr.trim()}</code>{aside && <i>{aside.trim()}</i>}</dd>
            </React.Fragment>
          );
        })}
      </dl>
      {result && <p className="mt-defn-note">{RI(result)}</p>}
    </div>
  );
}

const MTChips = ({ items }) => (
  <div className="mt-chips">{items.map(c => <span className="mt-chip" key={c}>{c}</span>)}</div>
);

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
        <a href="#loop">게임 루프</a>
        <a href="#tool">에디터</a>
        <a href="#runtime">런타임</a>
      </nav>
    </header>
  );
}

const MT_RAIL = [
  ['sec', 'page'], ['hero', '시작'], ['loop', '01 게임 루프'],
  ['sec', '밸런싱'], ['tool', '02 에디터'], ['model', '02-A 성장 체감'], ['sim', '02-B 상대 순위'],
  ['sec', '런타임'], ['runtime', '03 기하 · 상한'],
  ['sec', 'wrap-up'], ['cost', '04 한계'],
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


/* ─── §01 게임 루프 ──────────────────────────────────── */
function MTLoop({ data }) {
  const c = data.cycle;
  return (
    <section id="loop" className="nb-section">
      <MTSectionHead no="01" title="한 판과 그다음 판" kind="GAME LOOP" />
      <MTGist>{c.gist}</MTGist>
      <window.MTPageCycle loop={c} />
      <MTBody>{c.body}</MTBody>
    </section>
  );
}

/* ─── §02 밸런싱 에디터 (탑다운 — 실물 먼저) ─────────── */
function MTTool({ data }) {
  const s = data.sim;
  return (
    <section id="tool" className="nb-section">
      <MTSectionHead no="02" title="수학 모델로 만든 밸런싱 에디터" kind="TOOL" />
      <MTGist>{s.toolGist}</MTGist>
      {/* 칩 목록은 캡처 범례가 이미 여섯 이름을 다 부른다 — 같은 말을 두 형태로 하지 않는다. */}
      <window.MTPageShot shot={s.shot} />
      <MTBody>{s.host.body}</MTBody>
    </section>
  );
}

/* ─── §02-A 성장 체감의 수학적 모델링 ─────────────────────────── */
function MTModel({ data }) {
  const m = data.model;
  return (
    <section id="model" className="nb-section">
      <MTSectionHead no="02-A" title="성장 체감의 수학적 모델링" kind="MODEL" />
      <MTGist>{m.gist}</MTGist>
      <MTBody>{m.problem}</MTBody>

      <MTSubHead tag="A-1">무엇을 곱하고 어디서 자르는가</MTSubHead>
      <window.MTPageDecompTree decomp={m.decomp} />
      <MTDefn title={m.formula.title} intro={m.formula.intro} lines={m.formula.lines} result={m.formula.result} />

      <MTSubHead tag="A-2">두 개의 min 이 버리는 것</MTSubHead>
      <window.MTPageMins mins={m.mins} />
      <window.AsciiBlock title={m.code.title} intro={m.code.intro} code={m.code.code} result={m.code.result} />
    </section>
  );
}

/* ─── §02-B 상대 순위 ────────────────────────────────── */
function MTSim({ data }) {
  const s = data.sim;
  return (
    <section id="sim" className="nb-section">
      <MTSectionHead no="02-B" title="쓴 방식 — 절대값이 아니라 상대 순위" kind="SIMULATOR" />
      <MTGist>{s.gist}</MTGist>

      <MTSubHead tag="B-1">입력의 경계와 읽은 출력</MTSubHead>
      <window.MTPageBoundary boundary={s.boundary} split={s.split} />
      <MTPoints points={s.points} />
      <window.AsciiBlock title={s.code.title} intro={s.code.intro} code={s.code.code} result={s.code.result} />

      <MTSubHead tag="B-2">{s.policy.title}</MTSubHead>
      <MTBody>{s.policy.body}</MTBody>
    </section>
  );
}

/* ─── §04 물리 엔진 없이 ─────────────────────────────── */
function MTRuntime({ data }) {
  const r = data.runtime;
  return (
    <section id="runtime" className="nb-section">
      <MTSectionHead no="03" title="반복을 감당하는 전투씬 구조" kind="RUNTIME" />
      <MTGist>{r.gist}</MTGist>

      <MTSubHead tag="03-A">주입 계약 하나로 열리는 씬</MTSubHead>
      <window.MTPagePipeline pipeline={r.pipeline} />
      <MTPoints points={r.pipeline.rules} />

      <MTSubHead tag="03-B">필요한 묶음만 올린다</MTSubHead>
      <window.MTPageResidency residency={r.residency} />
      <MTPoints points={r.residency.invariants} />
      <MTNote>{r.residency.note}</MTNote>

      {/* 구조 → 선택 근거 → 코드 순. r.why(표)·r.queries·r.cap·r.occupancy 는 페이지에서 뺐다 — 덱 호환으로 data.js 에만 남는다. */}
      <MTSubHead tag="03-C">판정은 중앙 기하 월드에서 단발로</MTSubHead>
      <window.MTPageGeoWorld geo={r.geo} />
      <MTNote>{r.geo.note}</MTNote>
      <window.MTPageWhyGeo why={r.why2} />
      <window.MTPageMatrix matrix={r.matrix} />
      <window.AsciiBlock title={r.code.title} intro={r.code.intro} code={r.code.code} result={r.code.result} />

      <MTSubHead tag="03-D">HP 바 · 데미지 텍스트는 메시 하나로</MTSubHead>
      <window.MTPageBatch batch={r.batch} />
      <window.AsciiBlock title={r.batch.code.title} intro={r.batch.code.intro} code={r.batch.code.code} result={r.batch.code.result} />
    </section>
  );
}

/* ─── §05 한계 ───────────────────────────────────────── */
function MTCost({ data }) {
  const c = data.cost;
  return (
    <section id="cost" className="nb-section">
      <MTSectionHead no="04" title="재지 않은 것과 근사인 자리" kind="LIMITS" />
      <MTGist>{c.gist}</MTGist>

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
          <window.CoverHero slug="motelet" />
          {/* 표지에는 없는 것 — 이 3칸은 아래 절(§02 · §02-A · §03)로 가는 목차다.
              표지는 자기가 어느 페이지에 있는지 모르므로 페이지가 붙인다. */}
          <window.MTBuilt items={data.built} />
          <MTLoop data={data} />
          <MTTool data={data} />
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
