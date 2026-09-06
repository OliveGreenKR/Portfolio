// pages/progression-pacing/Page.jsx
//
// 8절 조립. 절마다 **같은 7슬롯**을 쓴다:
//   제목 → 결과 한 줄 → 주 시각자료 → 판단(PRDRow) → 보조 → 코드 → 다음 질문
//
// 순서가 계약이다. 결과(lead)가 그림보다 앞이고 코드가 맨 뒤다 —
// 설명을 다 읽어야 결론이 나오는 절을 만들지 않는다.
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
  const renderPanel = (panel, index) => {
    const panelStyle = { aspectRatio: panel.w + '/' + panel.h };
    const panelImageStyle = {
      width: (panel.full / panel.w * 100) + '%',
      maxWidth: 'none',
      left: (-panel.x / panel.w * 100) + '%',
      top: (-panel.y / panel.h * 100) + '%',
    };
    return <span className="mp-crop-panel" key={panel.label || index}>
      <strong>{panel.label}</strong>
      <span className="mp-crop" style={panelStyle} data-audit-allow-clip>
        <img src={src} alt="" style={panelImageStyle} data-audit-allow-clip/>
      </span>
    </span>;
  };
  return <figure className={'mp-evidence ' + className} data-audit-protected>
    <h3>{item.title}</h3>
    <button type="button" className="mp-evidence-button" onClick={() => dialog.current.showModal()}>
      {item.crops
        ? <span className="mp-crop-set">{item.crops.map(renderPanel)}</span>
        : crop
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
    {/* 한 절에 같은 kind 가 두 번 올 수 있다(01절의 결정 2줄). key 는 순서로 잡는다. */}
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
   목표 3단을 앞에 늘어놓고 여섯 절이 이어지면 «전부 다뤘다» 로 읽힌다. */
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
      {/* rail — 8절을 4덩이로 묶는다. 롱스크롤에서 위치가 8개가 아니라 4개로 읽힌다. */}
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

        {/* 절에 들어가기 전에 전체 지도를 한 번 준다.
            절이 아니므로 절 순서를 침범하지 않는다. */}
        <window.PacingF00/>
        <p className="mp-scope-role">{RI(P.scope.role)}</p>

        {/* 01 게임과 목표 — 무엇을 이루려 했는가 */}
        <StorySection index={0}>
          <window.PacingF01/>
          <window.PacingGoal/>
          <div className="mp-goal-extra">
            <div className="mp-goal-novelty">
              <h4>{P.goal.noveltyTitle}</h4>
              <p>{RI(P.goal.novelty)}</p>
            </div>
            <div className="mp-goal-axes">
              <h4>{P.goal.axesTitle}</h4>
              <ol>
                {P.goal.axes.map(a => (
                  <li key={a.k}><span>{a.k}</span><strong>{a.t}</strong><p>{a.d}</p></li>
                ))}
              </ol>
              <p className="mp-aux-note">{P.goal.axesNote}</p>
            </div>
          </div>
          <Judgment s={P.sections[0]}/>
          <p className="mp-goal-mine">{RI(P.goal.mine)}</p>
        </StorySection>

        {/* 02 성장의 해석 — 이 페이지의 핵심 그림 두 개 */}
        <StorySection index={1}>
          <window.PacingF02/>
          <window.PacingF03/>
          <Judgment s={P.sections[1]}/>
          <div className="mp-aux">
            <window.DataTable title={P.ladder.tierTableTitle} headers={P.ladder.tierHeaders}
              rows={P.ladder.tiers.map(t => [
                String(t.tier), t.name + ' · ' + t.id, t.hpL, t.scoreL, t.goldL, t.ratio.toFixed(1)
              ])}/>
            <window.DataTable title={P.ladder.levelTableTitle} headers={P.ladder.levelHeaders}
              rows={P.ladder.levels.map(l => [
                'Lv ' + l.lv,
                l.requiredL,
                l.weights.map(w => {
                  const t = P.ladder.tiers.find(x => x.id === w.id);
                  return t.name + ' ' + w.w;
                }).join(' / ')
              ])}/>
            <p className="mp-aux-note">{P.ladder.knobs}</p>
          </div>
        </StorySection>

        {/* 03 계산 관계 */}
        <StorySection index={2}>
          <window.PacingF04/>
          <window.PacingF05/>
          <Judgment s={P.sections[2]}/>
          <Code items={[P.code.tick, P.code.damage, P.code.ledger]}/>
        </StorySection>

        {/* 04 공간과 적중 */}
        <StorySection index={3}>
          <window.PacingF06/>
          <Judgment s={P.sections[3]}/>
          <div className="mp-aux">
            <window.PacingEquation/>
            <p className="mp-aux-note">{P.f06.contactRef}</p>
          </div>
          <Code items={[P.code.dash, P.code.chain]}/>
        </StorySection>

        {/* 05 역할과 조정 판단 — 중심 절. 코드가 없는 것이 의도다. */}
        <StorySection index={4}>
          <window.PacingRoleGrid/>
          <window.PacingF08/>
          <Judgment s={P.sections[4]}/>
          <div className="mp-aux">
            <window.PacingHtk/>
            <window.DataTable title={P.adjust.title} headers={P.adjust.headers} rows={P.adjust.rows}/>
            <window.PacingStamina/>
            <p className="mp-evidence-note">{P.evidence.boundary}</p>
            <EvidenceCrop item={P.evidence.contribution}/>
          </div>
        </StorySection>

        {/* 06 관찰과 기준 보완 */}
        <StorySection index={5}>
          <window.PacingF09/>
          <window.PacingBoundaryMatrix/>
          <Judgment s={P.sections[5]}/>
          <div className="mp-aux">
            <p className="mp-evidence-note">{P.evidence.boundary}</p>
            <EvidenceCrop item={P.evidence.grid}/>
            <EvidenceCrop item={P.evidence.pace}/>
          </div>
        </StorySection>

        {/* 07 반복 실험 구조 — 이 페이지에서 코드가 가장 많은 절 */}
        <StorySection index={6}>
          <window.PacingF11/>
          <Judgment s={P.sections[6]}/>
          <div className="mp-aux">
            <window.DataTable title={P.decisions.title} headers={P.decisions.headers}
              rows={P.decisions.rows}/>
            <p className="mp-evidence-note">{P.evidence.boundary}</p>
            <EvidenceCrop item={P.evidence.editor}/>
            <EvidenceCrop item={P.evidence.timeline}/>
          </div>
          <Code items={[P.code.guards, P.code.override, P.code.campaign, P.code.rebuild]}/>
        </StorySection>

        {/* 08 확인된 범위와 기여 */}
        <StorySection index={7}>
          <window.PacingReachLine/>
          <Judgment s={P.sections[7]}/>
          <div className="mp-aux">
            <window.PacingContribution/>
            <EvidenceCrop item={P.evidence.apply}/>
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
