// pages/progression-pacing/viz.jsx
//
// DOM 도표. SVG 도표는 svg-viz.jsx 가 갖는다.
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

  /* ── S01 담당 3칸 ─────────────────────────────────────────────
     사람 / 자동 / 사람 순서 자체가 정보다 — 자동은 가운데 한 칸뿐이다. */
  function FlowSplit() {
    const d = P.flow;
    return <div className="mp-split" data-audit-protected>
      <h4>{d.splitTitle}</h4>
      <ol>
        {d.split.map(s => (
          <li className={s.tone} key={s.t}>
            <span className="mp-split-k">{s.k}</span>
            <div><strong>{s.t}</strong><p>{s.d}</p></div>
          </li>
        ))}
      </ol>
    </div>;
  }

  /* ── S03 역할 2칸 ─────────────────────────────────────────────
     좌 = 낮은 빈도로 크게, 우 = 높은 빈도로 넓게. 두 칸 사이의 축이
     «개성을 준 기준» 이다 — 카드 두 개를 나란히 놓기만 하면 축이 사라진다.

     ⚠️ 길이 막대로 그리지 않는다 — 자료에 «어느 티어까지 몇 %» 같은 값이 없다. */
  function RoleSplit() {
    const d = P.roles;
    return <Figure cls="mp-f07-wrap" title={d.title} caption={d.caption}>
      <div className="mp-roleaxis">
        <span>{d.axisLeft}</span><i aria-hidden="true"/><span>{d.axisRight}</span>
      </div>
      <div className="mp-f07">
        {d.cards.map(c => (
          <div className={'mp-role is-' + c.id} key={c.id}>
            <h4>{c.name}<em>{c.attack}</em></h4>
            <p className="mp-role-freq">{c.freq}</p>
            <dl>
              <dt>맡는 일</dt><dd>{c.job}</dd>
              <dt>주 대상</dt><dd>{c.target}</dd>
            </dl>
            <p className="mp-role-note">{c.note}</p>
          </div>
        ))}
      </div>
      <div className="mp-target-band">
        <span>{d.bandLabel}</span>
        <strong>{d.bandValue}</strong>
        <small>{d.bandNote}</small>
      </div>
      <div className="mp-role-empty">
        <h4>{d.emptyTitle}</h4>
        <p>{RI(d.empty)}</p>
      </div>
    </Figure>;
  }

  /* ── S04 주요 특징 4칸 ────────────────────────────────────────
     문제-결정을 절마다 늘어놓지 않고, 평균값 모델과 갈리는 지점만 아이콘으로 모은다. */
  function Features() {
    const d = P.features;
    return <div className="mp-features" data-audit-protected>
      <h4>{d.title}</h4>
      <ul>
        {d.items.map(it => (
          <li key={it.t}>
            <i aria-hidden="true">{it.icon}</i>
            <div><strong>{it.t}</strong><p>{it.d}</p></div>
          </li>
        ))}
      </ul>
    </div>;
  }

  /* ── S05 상태 도달선 ──────────────────────────────────────────
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

  /* ── 보조: 식 두 개 ──────────────────────────────────────────
     기호마다 쉬운 라벨을 붙인다 — 추상어(«공급 대상»·«처리 기회»)를 쓰지 않는 것이
     페이지 전체의 규칙이다. */
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

  function HtkEquation() {
    const d = P.htk;
    return <div className="mp-equation">
      <span>{d.label}</span>
      <strong>{d.formula}</strong>
      <p>{d.note}</p>
    </div>;
  }

  Object.assign(window, {
    PacingFlowSplit: FlowSplit,
    PacingRoleSplit: RoleSplit,
    PacingFeatures: Features,
    PacingReachLine: ReachLine,
    PacingContribution: Contribution,
    PacingEquation: SelectionEquation,
    PacingHtk: HtkEquation,
  });
})();
