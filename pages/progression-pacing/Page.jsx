// pages/progression-pacing/Page.jsx
//
// 5절 조립. 절마다 **같은 슬롯**을 쓴다:
//   제목 → 결과 한 줄(lead) → 주 시각자료 → 판단(PRDRow) → 보조 → 코드 → 다음 질문
//
// 순서가 계약이다. 결과(lead)가 그림보다 앞이고 코드가 맨 뒤다 —
// 설명을 다 읽어야 결론이 나오는 절을 만들지 않는다.
//
// ── 2026-09-06 재구성 ────────────────────────────────────────────
//   01 워크플로우 · 02 결과 · 03 밸런싱 목표 · 04 시뮬레이션 설계 · 05 확인된 범위
//   앞 두 절이 «어떻게 일했고 무엇이 나왔는지» 를 먼저 끝낸다. 목표·모델·도구는 그 뒤다.
//
// ⚠️ 문장을 여기 박지 않는다. 전부 data.js.
//    도표는 svg-viz.jsx(SVG) 와 viz.jsx(DOM) 가 갖는다.

const P = window.PACING_DATA;
const RI = window.renderInline;

/* 스크린샷. 원본은 크고 글자가 작아서, 읽어야 할 구간만 잘라 보이고
   원본은 dialog 로 연다. crop 좌표는 data.js 가 갖는다. */
function EvidenceCrop({ item, className = '' }) {
  const src = 'progression-pacing/assets/' + item.image;
  const dialog = React.useRef(null);
  const crop = item.crop;
  const cropStyle = crop ? { aspectRatio: crop.w + '/' + crop.h } : null;
  const imageStyle = crop ? {
    width: (crop.full / crop.w * 100) + '%',
    maxWidth: 'none',
    left: (-crop.x / crop.w * 100) + '%',
    top: (-crop.y / crop.h * 100) + '%',
  } : null;
  return <figure className={'mp-evidence ' + className} data-audit-protected>
    <h3>{item.title}</h3>
    <button type="button" className="mp-evidence-button" onClick={() => dialog.current.showModal()}>
      {crop
        ? <span className="mp-crop" style={cropStyle} data-audit-allow-clip>
            <img src={src} alt={item.alt} style={imageStyle} data-audit-allow-clip/>
          </span>
        : <img src={src} alt={item.alt}/>}
      <span className="mp-zoom">{P.evidence.zoom} ↗</span>
    </button>
    <figcaption>{item.caption}</figcaption>
    <dialog ref={dialog} className="mp-image-dialog" aria-label={item.title}>
      <div><strong>{item.title}</strong>
        <button type="button" onClick={() => dialog.current.close()}>{P.evidence.close}</button></div>
      <p>{P.evidence.pan}</p>
      <section tabIndex="0"><img src={src} alt={item.alt}/></section>
    </dialog>
  </figure>;
}

/* 판단 슬롯. 절마다 2~4줄. 이 슬롯이 비면 그 절은 겉핥기가 된다. */
function Judgment({ s }) {
  return <div className="mp-prd">
    {/* 한 절에 같은 kind 가 두 번 올 수 있다. key 는 순서로 잡는다. */}
    {s.prd.map((r, i) => (
      <window.PRDRow key={i} label={r.label} kind={r.kind}>{RI(r.text)}</window.PRDRow>
    ))}
  </div>;
}

function Code({ items }) {
  return <div className="mp-code">
    {items.map((c, i) => (
      <window.AsciiBlock key={c.label} title={c.label} intro={c.intro} code={c.code}
        result={i === items.length - 1 ? P.code.sourceNote : null} lang="csharp"/>
    ))}
  </div>;
}

/* 이 절이 주기의 어느 구간을 다루는지. 비어 있는 것도 정보다 —
   목표 3단을 앞에 늘어놓고 절이 이어지면 «전부 다뤘다» 로 읽힌다. */
function GoalBadges({ ids }) {
  if (!ids || !ids.length) return null;
  return <span className="mp-badges" aria-label={P.goal.badgeLegend}>
    {ids.map(id => <i key={id} className={'mp-badge is-' + id}>{P.goal.badgeLabels[id]}</i>)}
  </span>;
}

function StorySection({ index, children }) {
  const s = P.sections[index];
  const total = String(P.sections.length).padStart(2, '0');
  return <section id={s.id} className="nb-section mp-section">
    <div className="nb-section-head">
      <span className="nb-section-no">{String(index + 1).padStart(2, '0')} / {total}</span>
      <h2 className="nb-section-title">{s.title}</h2>
      <span className="nb-section-kind">{s.kind}</span>
    </div>
    <GoalBadges ids={s.goals}/>
    <p className="mp-lead">{RI(s.lead)}</p>
    {children}
    {s.next && <p className="mp-next">→ {s.next}</p>}
  </section>;
}

function PacingPage() {
  const [active, setActive] = React.useState('hero');

  React.useEffect(() => {
    document.title = P.meta.title || document.title;
    const ids = ['hero'].concat(P.sections.map(s => s.id));
    const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(() => {
      const passed = targets
        .filter(el => el.getBoundingClientRect().top <= 130)
        .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);
      setActive((passed[0] || targets[0]).id);
    }, { rootMargin: '-92px 0px -62% 0px', threshold: [0, .2, .5] });
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const byId = Object.fromEntries(P.sections.map(s => [s.id, s]));

  return <div className="nb-page mp-page" id="top">
    <header className="nb-header">
      <a className="nb-brand" href="landing.html"><span className="nb-brand-mark"/>{P.meta.brand}</a>
      <div className="nb-crumbs">
        <a href="landing.html">index</a><span className="sep">/</span>
        <span className="cur">{P.meta.crumb}</span>
      </div>
      <nav className="nb-nav">
        {P.meta.nav.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
      </nav>
    </header>

    <div className="nb-body">
      <aside className="nb-rail" aria-label={P.meta.navLabel}>
        <a href="#hero" className={active === 'hero' ? 'active' : ''}>OVERVIEW</a>
        {P.meta.railGroups.map(g => (
          <div className="nb-rail-group" key={g.label}>
            <span className="nb-rail-glabel">{g.label}</span>
            {g.ids.map(id => (
              <a key={id} href={'#' + id} className={active === id ? 'active' : ''}>{byId[id].nav}</a>
            ))}
          </div>
        ))}
      </aside>

      <main>
        <window.CoverHero slug="progression-pacing"/>
        <p className="mp-scope-role">{RI(P.scope.role)}</p>

        {/* 01 워크플로우 — 전체를 한 장으로 먼저 보인다 */}
        <StorySection index={0}>
          <window.PacingFlow/>
          <window.PacingFlowSplit/>
          <Judgment s={P.sections[0]}/>
        </StorySection>

        {/* 02 결과 — 만들어진 화면. 2열로 늘어놓는다 */}
        <StorySection index={1}>
          <p className="mp-evidence-note">{P.results.boundary}</p>
          <div className="mp-results">
            {P.results.order.map(k => <EvidenceCrop key={k} item={P.evidence[k]}/>)}
          </div>
          <Judgment s={P.sections[1]}/>
        </StorySection>

        {/* 03 밸런싱 목표 — 주기 → 진행도 축 → 사다리 → 조정 기준 */}
        <StorySection index={2}>
          <window.PacingGoal/>
          <div className="mp-goal-novelty">
            <h4>{P.goal.noveltyTitle}</h4>
            <p>{RI(P.goal.novelty)}</p>
          </div>
          <window.PacingProgress/>
          <window.PacingF02/>
          <window.PacingRoleSplit/>
          <Judgment s={P.sections[2]}/>
          <div className="mp-aux">
            <window.PacingHtk/>
            <window.PacingEquation/>
            <window.DataTable title={P.adjust.title} headers={P.adjust.headers} rows={P.adjust.rows}/>
          </div>
          <p className="mp-goal-mine">{RI(P.goal.mine)}</p>
        </StorySection>

        {/* 04 시뮬레이션 설계 — 구조 → 특징 → 코드 → 도구 배치 */}
        <StorySection index={3}>
          <window.PacingSim/>
          <p className="mp-aux-note">{RI(P.sim.energyNote)}</p>
          <window.PacingFeatures/>
          <window.PacingF06/>
          <window.PacingF05/>
          <window.PacingF11/>
          <Judgment s={P.sections[3]}/>
          <div className="mp-aux">
            <window.DataTable title={P.decisions.title} headers={P.decisions.headers}
              rows={P.decisions.rows}/>
          </div>
          {/* 코드는 절 맨 뒤. 그림 → 판단 → 표 → 코드 순서를 절 안에서도 지킨다. */}
          <Code items={[P.code.tick, P.code.dash, P.code.chain, P.code.damage, P.code.ledger,
                        P.code.campaign, P.code.guards, P.code.override, P.code.apply]}/>
        </StorySection>

        {/* 05 확인된 범위와 기여 */}
        <StorySection index={4}>
          <window.PacingReachLine/>
          <Judgment s={P.sections[4]}/>
          <div className="mp-aux">
            <window.PacingContribution/>
          </div>
        </StorySection>

        <footer className="nb-footer">
          <span>{P.meta.footer}</span><a href="#top">{P.meta.back} ↑</a>
        </footer>
      </main>
      <div/>
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<PacingPage/>);
