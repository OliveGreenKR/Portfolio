// pages/labs/ue5-action/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
// 규칙 2: 없는 데이터를 그리지 않는다. 계측본도 에디터 캡처도 없다.
//         둘 다 원리도다 — 무엇이 어느 쪽에 있나 · 방향을 언제 정하나. 눈금도 값도 없다.
//         V2 의 가로축은 시간이지만 **길이가 특정 프레임 수를 뜻하지 않는다.**
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.ua-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 설명 문장에는 ua-svg-note 를 붙인다 — 720px 이하에서 숨겨진다.
// 규칙 5: 자산이 hero 한 장(455×275)뿐이라 히어로 자리를 원리도가 진다.
//         그 사진은 디버그 표시를 켠 화면이고 이 페이지의 주장과 무관해서 §01 로 내렸다.

/* ─── 만든 것 3칸 ────────────────────────────────────── */
function UABuilt({ items }) {
  const ri = window.renderInline;
  return (
    <div className="ua-built">
      {items.map(it => (
        <div className="ua-built-cell" key={it.title}>
          <div className="ua-built-kind">{it.kind}</div>
          <div className="ua-built-t">{ri(it.title)}</div>
          <div className="ua-built-s">{ri(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.UABuilt = UABuilt;

/* ─── V1 · 무엇이 어느 쪽에 있나 (히어로) ────────────── */
/* 이 페이지의 유일한 실질 주장이 경계의 위치다. 그것만 그린다.
   에디터 화면이 없으므로 "편집이 쉽다" 는 그리지 않는다 — 무엇이 어디 있는지까지만. */
function UABoundaryViz() {
  const W = 760, H = 300;
  // 두 칸: 40..368 · 392..720. 가운데 24 가 경계선 자리 ✓
  const LX = 40, RX = 392, CW = 328;
  const rows = {
    data: ['위력 · 사거리 · 지속', '몇 번째 타까지', '어떤 조건에서 다음으로', '맞았을 때 낼 반응'],
    code: ['지금 시작해라', '끝났는지 봐라', '다음으로 넘어가라'],
  };
  const rowY = i => 96 + i * 40;

  const col = (x, title, sub, items, tone) => (
    <g>
      <text x={x} y="34" className={`ua-svg-lbl root${tone === 'data' ? ' accent' : ''}`}>{title}</text>
      <text x={x} y="54" className="ua-svg-sub">{sub}</text>
      <rect x={x} y="70" width={CW} height={rows.data.length * 40 + 16} rx="4"
            fill={tone === 'data' ? 'var(--terra-50)' : 'var(--paper-2)'}
            stroke={tone === 'data' ? 'var(--terra-400)' : 'var(--rule-2)'}
            strokeWidth={tone === 'data' ? 1.6 : 1.1} />
      {items.map((t, i) => (
        <g key={t}>
          <rect x={x + 16} y={rowY(i) - 20} width={CW - 32} height="30" rx="3"
                fill="var(--paper)" stroke="var(--rule)" />
          <text x={x + 30} y={rowY(i)} className="ua-svg-sub">{t}</text>
        </g>
      ))}
    </g>
  );

  return (
    <figure className="ua-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="ua-svg" role="img"
           aria-label="스킬이 무엇을 하고 어디로 이어지는지는 에셋에 있고, 코드에는 실행 절차만 남아 있다">
        {col(LX, '에셋에 적는 것', '스킬마다 다른 것', rows.data, 'data')}
        {col(RX, '코드에 남긴 것', '어떤 스킬이든 같은 것', rows.code, 'code')}

        {/* 경계선 */}
        <line x1={(LX + CW + RX) / 2} x2={(LX + CW + RX) / 2} y1="70" y2="256"
              stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />

        <text x={LX} y="288" className="ua-svg-sub ua-svg-note">
          스킬을 하나 더 넣을 때 오른쪽은 그대로다 — 왼쪽에 한 줄이 늘어날 뿐이다
        </text>
      </svg>
      <figcaption className="ua-figcap">
        오른쪽 세 줄이 <b>어떤 스킬에도 똑같이</b> 도는 절차다. 스킬마다 달라지는 것은 전부 왼쪽에 있고,
        연결(다음에 무엇이 오는가)까지 왼쪽이라는 점이 이 그림의 요지다.
      </figcaption>
    </figure>
  );
}
window.UABoundaryViz = UABoundaryViz;

/* ─── V2 · 방향을 언제 정하나 ────────────────────────── */
/* §03. 같은 입력에 같은 구간을 주고, 확정 시점만 다르게 둔다.
   위 줄은 만들어 본 적 없는 구현이 아니라 "누른 순간에 굳히면" 이라는 조건 자체다. */
function UATimingViz() {
  const W = 760, H = 300;
  // 트랙: 176..724 (548). 왼쪽 라벨 24..168 ✓
  const T0 = 176, T1 = 724, LBL = 24;
  const win = { a: T0 + 96, b: T0 + 396 };   // 선입력 구간 272..572

  const track = (y, fixAt, tone, tag) => (
    <g>
      <line x1={T0} x2={T1} y1={y} y2={y} stroke="var(--rule-2)" strokeWidth="2" />
      {/* 선입력 구간 */}
      <rect x={win.a} y={y - 17} width={win.b - win.a} height="34" rx="3"
            fill="var(--paper-3)" stroke="var(--rule-2)" />
      <text x={(win.a + win.b) / 2} y={y + 5} textAnchor="middle" className="ua-svg-sub">다음 입력을 받는 구간</text>
      {/* 확정 지점 */}
      <line x1={fixAt} x2={fixAt} y1={y - 34} y2={y + 34} stroke={tone} strokeWidth="2.4" />
      <circle cx={fixAt} cy={y} r="6" fill={tone} />
      <text x={fixAt} y={y - 42} textAnchor="middle" className="ua-svg-tag" fill={tone}>{tag}</text>
    </g>
  );

  return (
    <figure className="ua-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="ua-svg" role="img"
           aria-label="같은 선입력 구간에서 방향을 누른 순간에 정하면 도중의 변화가 반영되지 않고, 구간이 끝날 때 정하면 반영된다">
        <text x={LBL} y="30" className="ua-svg-lbl root">같은 구간, 확정 시점만 다르게</text>

        <text x={LBL} y="96" className="ua-svg-lbl">누른 순간에</text>
        <text x={LBL} y="114" className="ua-svg-sub">굳혀 두면</text>
        {track(104, win.a, 'var(--ink-3)', '여기서 확정')}

        <text x={LBL} y="216" className="ua-svg-lbl">구간이 끝날 때</text>
        <text x={LBL} y="234" className="ua-svg-sub">정하면</text>
        {track(224, win.b, 'var(--terra-400)', '여기서 확정')}

        {/* 도중 변화 표시 */}
        <text x={(win.a + win.b) / 2} y="160" textAnchor="middle" className="ua-svg-tag">
          이 사이에 적이 움직인다
        </text>
        <path d={`M${win.a + 40} 140 L${win.b - 40} 140`} stroke="var(--rule-2)" strokeWidth="1.2" strokeDasharray="4 4" />

        <text x={LBL} y="286" className="ua-svg-sub ua-svg-note">
          가로 길이는 시간의 흐름만 뜻한다 — 특정 프레임 수가 아니다
        </text>
      </svg>
      <figcaption className="ua-figcap">
        두 줄의 <b>구간은 같다.</b> 다른 것은 세로선의 위치뿐이고, 그 차이가
        "이미 마음을 바꾼 입력이 반영되느냐" 를 가른다.
      </figcaption>
    </figure>
  );
}
window.UATimingViz = UATimingViz;
