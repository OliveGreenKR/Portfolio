// pages/progression-pacing/viz.jsx
//
// DOM 도표 3종 + 보조 부품. SVG 도표는 svg-viz.jsx 가 갖는다.
//
// ⚠️ 문장을 여기 박지 않는다. 전부 data.js.
// ⚠️ 마크업 구조는 page.css 가 계약이다 — 클래스명을 임의로 바꾸지 않는다.
//
// DOM 으로 만드는 기준: 격자·대응·목록처럼 **글자가 주인공이고 좌표가 보조**인 것.
// 선의 연속성·경로·절단처럼 좌표가 주인공인 것은 SVG(svg-viz.jsx)로 간다.

(function definePacingDomVisuals() {
  const P = window.PACING_DATA;
  const RI = window.renderInline;

  function Figure({ cls, title, caption, children }) {
    return <figure className={'mp-fig ' + cls} data-audit-protected>
      {title && <h3 className="mp-fig-title">{title}</h3>}
      {children}
      {caption && <figcaption>{RI(caption)}</figcaption>}
    </figure>;
  }

  /* ── F07 역할 격자 ────────────────────────────────────────────
     열 = 대상 티어, 열 안의 목록 = 그 티어를 맡는 공격.
     열 위치는 §02 겹침 행렬과 같고, 배경의 옅은 대각 밴드(page.css ::before)가
     그 계승을 눈으로 증명한다.

     ⚠️ 길이 막대로 그리지 않는다 — 자료에 «어느 티어까지 몇 %» 같은 값이 없다.
        범주를 범주로 인코딩한다. */
  function RoleGrid() {
    const d = P.roles;
    return <Figure cls="mp-f07-wrap" title={d.title} caption={d.caption}>
      <p className="mp-aux-note">{d.inheritNote}</p>
      <div className="mp-f07">
        {d.tiers.map((t, col) => (
          <div key={t.id}>
            <h4><span className="mp-f07-tier">{t.code}</span>{t.name}</h4>
            <p className="mp-f07-goal">{t.goal}</p>
            <ul>
              {d.matrix.map(r => (
                <li className={r.tones[col]} key={r.attack}>
                  <b>{r.attack}</b>
                  <p>{r.cells[col]}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mp-aux-note">{RI(d.matrixNote)}</p>
      <div className="mp-target-band">
        <span>{d.bandLabel}</span>
        <strong>{d.bandValue}</strong>
        <small>{d.bandNote}</small>
      </div>
    </Figure>;
  }

  /* ── F10 검사 대응 매트릭스 ───────────────────────────────────
     같은 프레임에서 대응선이 1개 → 3개로 채워지는 것이 «변화» 의 인코딩이다.
     가운데 96px 트랙은 화살표 전용 공간 — 긴 라벨 사이에 기호를 끼우지 않는다.
     빈 두 줄은 «검사하지 않은 것» 이다. 지우면 변화가 안 보인다. */
  function BoundaryMatrix() {
    const d = P.f10;
    const heads = <li className="mp-f10-colhead">
      <span>{d.leftHead}</span><i aria-hidden="true"/><span>{d.rightHead}</span>
    </li>;
    return <Figure cls="mp-f10-wrap" title={d.title} caption={d.caption}>
      <div className="mp-f10">
        <p className="mp-f10-ref">{d.reference}</p>

        <div className="mp-f10-state">
          <div className="mp-f10-head">{d.beforeLabel}</div>
          <ul>
            {heads}
            <li>
              <span>{d.beforePair[0]}</span>
              <i aria-hidden="true">↔</i>
              <span className="empty">{d.beforePair[1]}</span>
            </li>
            <li className="is-empty"><span className="empty"/><i aria-hidden="true">↔</i><span className="empty"/></li>
            <li className="is-empty"><span className="empty"/><i aria-hidden="true">↔</i><span className="empty"/></li>
          </ul>
        </div>

        <div className="mp-f10-state">
          <div className="mp-f10-head">{d.afterLabel}</div>
          <ul>
            {heads}
            {d.pairs.map(p => (
              <li key={p.when}>
                <span><em className="mp-f10-when">{p.when}</em>{p.left}</span>
                <i aria-hidden="true">↔</i>
                <span>{p.right}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>;
  }

  /* ── F12 상태 도달선 ──────────────────────────────────────────
     네 상태는 서로 다르고, 확인은 앞쪽까지만 왔다.
     왼쪽 밴드가 **끝나는 위치**가 곧 «어디까지 확인됐는가» 의 답이다.
     밴드는 page.css 의 li::before 가 그린다 — 별도 요소를 두지 않는다. */
  function ReachLine() {
    const d = P.reach;
    return <div className="mp-reach-wrap" data-audit-protected>
      <h3 className="mp-fig-title">{d.title}</h3>
      <div className="mp-reach">
        <ol>
          {/* ⚠️ li 는 `26px | 1fr` 그리드다. ::before 가 1열을 먹으므로
                 본문은 **한 덩이**여야 한다 — strong·span 을 나란히 두면
                 span 이 다음 행 26px 칸으로 떨어져 세로로 한 글자씩 쌓인다(실측). */}
          {d.rows.map(r => (
            <li className={r.state} key={r.name}>
              <div>
                <strong>{r.name}</strong>
                <span>{r.note}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="mp-reach-legend">
        {d.legend.map(([k, label]) => (
          <span className={k} key={k}><i aria-hidden="true"/>{label}</span>
        ))}
      </p>
    </div>;
  }

  /* ── 기여 2열 ─────────────────────────────────────────────────
     공용 .nb-roles / .nb-role / .nb-role.warn 을 그대로 쓴다.
     남의 작업은 ⚠ 로 표시한다 (DESIGN_SYSTEM 규약). */
  function Contribution() {
    const d = P.contribution;
    return <div className="mp-contrib">
      <div className="nb-roles">
        <div className="nb-role">
          <div className="nb-role-head"><span className="glyph">✓</span> {d.mineLabel}</div>
          <p>{d.mine.join(' · ')}</p>
        </div>
      </div>
      <div className="nb-roles">
        <div className="nb-role warn">
          <div className="nb-role-head"><span className="glyph">⚠</span> {d.othersLabel}</div>
          <p>{d.others.join(' · ')}</p>
        </div>
      </div>
    </div>;
  }

  /* ── 보조: 선택식 ────────────────────────────────────────────
     §04 의 정적 비교식. 기호마다 쉬운 라벨을 붙인다 —
     추상어(«공급 대상»·«처리 기회»)를 쓰지 않는 것이 페이지 전체의 규칙이다. */
  function SelectionEquation() {
    const d = P.equation;
    return <div className="mp-equation">
      <span>{d.label}</span>
      <strong>{d.formula}</strong>
      <p>
        {d.terms.map(([sym, mean], i) => (
          <React.Fragment key={sym}>
            {i > 0 && ' · '}<code>{sym}</code> {mean}
          </React.Fragment>
        ))}
      </p>
      <p>{d.note}</p>
    </div>;
  }

  /* ── 보조: 처치 타격 수 식 ──────────────────────────────────── */
  function HtkEquation() {
    const d = P.intersection;
    return <div className="mp-equation">
      <span>판단 기준</span>
      <strong>{d.htk}</strong>
      <p>{d.htkNote}</p>
    </div>;
  }

  /* ── 보조: 스태미나 4단계 ────────────────────────────────────
     역할 격자 «밖» 에 둔다 — 배치 자체가 «이건 공격 역할이 아니다» 를 말한다. */
  function StaminaStrip() {
    const d = P.stamina;
    return <div className="mp-stamina">
      <h4>{d.title}</h4>
      <window.FSMTrail steps={d.steps}/>
      <p>{d.note}</p>
    </div>;
  }

  Object.assign(window, {
    PacingRoleGrid: RoleGrid,
    PacingBoundaryMatrix: BoundaryMatrix,
    PacingReachLine: ReachLine,
    PacingContribution: Contribution,
    PacingEquation: SelectionEquation,
    PacingHtk: HtkEquation,
    PacingStamina: StaminaStrip,
  });
})();
