// pages/labs/multi-leg-creature/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 PoC 에는 계측본이 하나도 없다.
//         둘 다 원리도다 — 힘이 어디서 합쳐지나 · 무엇이 무엇을 아나. 눈금도 값도 없다.
//         화살표 길이는 임의다. 특정 파라미터 값을 나타내지 않는다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.ml-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 설명 문장에는 ml-svg-note 를 붙인다 — 720px 이하에서 숨겨진다.
//         그 내용은 figcaption 이 미리 받아 둔다.
// 규칙 5: 앞선 그림이 뒤 절의 개념을 미리 그리지 않는다.
//         V1(§02)은 힘이 합쳐진다는 것까지만 말한다 — 누가 무엇을 아느냐는 §03 이 처음 꺼낸다.

/* ─── 만든 것 3칸 ────────────────────────────────────── */
function MLBuilt({ items }) {
  const ri = window.renderInline;
  return (
    <div className="ml-built">
      {items.map(it => (
        <div className="ml-built-cell" key={it.title}>
          <div className="ml-built-kind">{it.kind}</div>
          <div className="ml-built-t">{ri(it.title)}</div>
          <div className="ml-built-s">{ri(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.MLBuilt = MLBuilt;

/* ─── V1 · 힘이 몸통 한 곳에서 합쳐진다 ──────────────── */
/* §02 의 본체. 다리 셋이 각자 낸 힘과, 몸통이 받는 것은 그 합 하나뿐이라는 것.
   두 종류의 힘(뻗는 반작용 · 붙잡고 당김)을 색으로 갈라 둔다 — §04 에서 이 둘을
   따로 튜닝했다고 말하므로, 그림이 미리 갈라 놓아야 뒤 절이 읽힌다. */
function MLForceViz() {
  const W = 760, H = 340;
  const BX = 300, BY = 200, BR = 26;

  // 화살표마다 라벨을 달면 끝점이 viewBox 밖으로 나간다 (실측: 위 +9 · 아래 +37).
  // 종류는 왼쪽 위 범례가 대신 말하고, 화살표에는 글자를 붙이지 않는다.
  // 부착점·화살표 끝 전수: A(110,130)→(42,80) · B(430,118)→(457,60) · C(420,288)→(446,323)
  //   가장 왼쪽 42 > 0 ✓ · 가장 오른쪽 457 < 500(구분선) ✓ · 위 60 > 44 ✓ · 아래 323 < 340 ✓
  const legs = [
    { ax: 110, ay: 130, fx: -0.62, fy: -0.78, kind: 'pull',  n: '1' },
    { ax: 430, ay: 118, fx:  0.42, fy: -0.90, kind: 'pull',  n: '2' },
    { ax: 420, ay: 288, fx:  0.60, fy:  0.80, kind: 'react', n: '3' },
  ];
  const LEN = 64;

  const arrow = (x, y, dx, dy, len, color, w, key) => {
    const ex = x + dx * len, ey = y + dy * len;
    const hx = x + dx * (len - 12), hy = y + dy * (len - 12);
    const px = -dy * 6, py = dx * 6;
    return (
      <g key={key}>
        <line x1={x} y1={y} x2={hx} y2={hy} stroke={color} strokeWidth={w} strokeLinecap="round" />
        <polygon points={`${ex},${ey} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
      </g>
    );
  };

  const col = k => (k === 'pull' ? 'var(--terra-400)' : 'var(--ink-3)');

  // 합벡터 = 세 힘의 단순 합. 그림용 축척으로 줄여 그린다 (값이 아니라 방향이 요지).
  const sx = legs.reduce((s, l) => s + l.fx, 0), sy = legs.reduce((s, l) => s + l.fy, 0);
  const sm = Math.hypot(sx, sy);

  return (
    <figure className="ml-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="ml-svg" role="img"
           aria-label="다리 셋이 각자 낸 힘이 몸통 한 곳에서 더해지고, 몸통은 그 합 하나만 받는다">
        <text x="24" y="26" className="ml-svg-lbl root">다리가 낸 힘</text>
        <text x="530" y="26" className="ml-svg-lbl root">몸통이 받는 것</text>
        <line x1="500" x2="500" y1="40" y2="316" stroke="var(--rule)" strokeDasharray="5 4" />

        {/* 범례 — 화살표에 글자를 붙이지 않는 대신 여기서 종류를 말한다 */}
        {[['pull', '붙잡고 당김'], ['react', '뻗는 반작용']].map(([k, t], i) => (
          <g key={k}>
            <line x1="24" x2="48" y1={44 + i * 18} y2={44 + i * 18} stroke={col(k)} strokeWidth="3" strokeLinecap="round" />
            <text x="56" y={48 + i * 18} className="ml-svg-tag" fill={col(k)}>{t}</text>
          </g>
        ))}

        {/* 다리 셋 — 부착점에서 몸통으로 이어지는 다리 + 힘 화살표 */}
        {legs.map(l => (
          <g key={l.n}>
            <line x1={l.ax} y1={l.ay} x2={BX} y2={BY} stroke="var(--rule-2)" strokeWidth="7" strokeLinecap="round" />
            <circle cx={l.ax} cy={l.ay} r="7" fill="var(--sage-300)" stroke="var(--sage-700)" strokeWidth="1.4" />
            {arrow(l.ax, l.ay, l.fx, l.fy, LEN, col(l.kind), 3, `a${l.n}`)}
          </g>
        ))}

        {/* 몸통 */}
        <circle cx={BX} cy={BY} r={BR} fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth="1.8" />
        <text x={BX} y={BY + 5} textAnchor="middle" className="ml-svg-lbl accent">몸통</text>

        {/* 합벡터 — 몸통에서 하나만 나간다. 끝점 (346,100), 라벨 (352,92)..(~430,92) < 500 ✓ */}
        {arrow(BX, BY, sx / sm, sy / sm, 110, 'var(--sage-700)', 4.5, 'sum')}
        <text x={BX + (sx / sm) * 110 + 8} y={BY + (sy / sm) * 110 - 6} className="ml-svg-lbl ok">힘의 합 하나</text>

        {/* 오른쪽 — 몸통이 안 받는 것 */}
        <rect x="530" y="120" width="214" height="46" rx="3"
              fill="var(--paper)" stroke="var(--rule-2)" strokeDasharray="4 3" />
        <text x="544" y="140" className="ml-svg-lbl">이동 입력</text>
        <text x="544" y="158" className="ml-svg-sub">없다 — 키도 조이스틱도 안 받는다</text>

        <rect x="530" y="180" width="214" height="46" rx="3"
              fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.5" />
        <text x="544" y="200" className="ml-svg-lbl ok">힘의 합</text>
        <text x="544" y="218" className="ml-svg-sub">이것만 받아 물리로 민다</text>

        <text x="24" y="330" className="ml-svg-sub ml-svg-note">
          화살표 길이는 임의다 — 방향이 합쳐진다는 것만 말한다
        </text>
      </svg>
      <figcaption className="ml-figcap">
        몸통으로 들어가는 화살표가 <b>하나뿐</b>인 것이 요지다. 세 다리는 각자 자기 힘만 내놓고,
        어디로 갈지는 아무도 정하지 않는다 — 방향은 더해진 결과로만 나온다.
        색이 갈린 둘은 <b>서로 다른 힘</b>이라 값을 따로 잡는다.
      </figcaption>
    </figure>
  );
}
window.MLForceViz = MLForceViz;

/* ─── V2 · 무엇이 무엇을 아는가 ──────────────────────── */
/* §03. 다리끼리 잇는 선이 없다는 것이 이 그림의 전부다.
   선을 안 그린 자리가 요점이므로, 없는 선을 점선으로라도 그리지 않는다. */
function MLFlowViz() {
  const W = 760, H = 300;
  // 3열: 입력 40..200 / 다리 260..500 / 몸통 560..720 ✓
  const IX = 40, LX = 260, BX2 = 560, CW = 160, LW = 240;
  const legY = [70, 140, 210];

  const arrow = (x1, y1, x2, y2, key, tone) => (
    <g key={key}>
      <line x1={x1} y1={y1} x2={x2 - 9} y2={y2} stroke={tone || 'var(--ink-3)'} strokeWidth="1.5" />
      <polygon points={`${x2},${y2} ${x2 - 10},${y2 - 5} ${x2 - 10},${y2 + 5}`} fill={tone || 'var(--ink-3)'} />
    </g>
  );

  return (
    <figure className="ml-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="ml-svg" role="img"
           aria-label="입력은 다리로, 다리는 몸통으로만 간다. 다리끼리 잇는 선은 없다">
        <text x={IX} y="34" className="ml-svg-lbl root">입력</text>
        <text x={LX} y="34" className="ml-svg-lbl root">다리 (각자 따로)</text>
        <text x={BX2} y="34" className="ml-svg-lbl root">몸통</text>

        <rect x={IX} y="120" width={CW} height="72" rx="4" fill="var(--paper-2)" stroke="var(--rule-2)" />
        <text x={IX + 14} y="148" className="ml-svg-lbl">고른 다리 하나</text>
        <text x={IX + 14} y="168" className="ml-svg-sub">마우스 위치 · 버튼 상태</text>

        {legY.map((y, i) => (
          <g key={i}>
            <rect x={LX} y={y} width={LW} height={54} rx="4"
                  fill={i === 0 ? 'var(--terra-50)' : 'var(--paper)'}
                  stroke={i === 0 ? 'var(--terra-400)' : 'var(--rule-2)'}
                  strokeWidth={i === 0 ? 1.6 : 1} />
            <text x={LX + 14} y={y + 24} className={i === 0 ? 'ml-svg-lbl accent' : 'ml-svg-lbl'}>
              다리 {i + 1}{i === 0 ? ' — 지금 고른 것' : ''}
            </text>
            <text x={LX + 14} y={y + 42} className="ml-svg-sub">내놓는 것은 자기 힘 하나뿐</text>
            {arrow(LX + LW, y + 27, BX2, 156, `r${i}`, i === 0 ? 'var(--terra-400)' : 'var(--rule-2)')}
          </g>
        ))}
        {arrow(IX + CW, 156, LX, 97, 'i0', 'var(--terra-400)')}

        <rect x={BX2} y="120" width={CW} height="72" rx="4"
              fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x={BX2 + 14} y="148" className="ml-svg-lbl ok">더하기만 한다</text>
        <text x={BX2 + 14} y="168" className="ml-svg-sub">다리를 하나씩 보지 않는다</text>

        <text x={LX} y="288" className="ml-svg-sub ml-svg-note">
          다리와 다리 사이에는 선이 없다 — 서로의 상태를 묻지 않는다
        </text>
      </svg>
      <figcaption className="ml-figcap">
        <b>그리지 않은 선</b>이 요점이다. 다리끼리 잇는 화살표가 하나도 없어서,
        다리를 하나 더 붙이든 조종하는 사람을 하나 더 붙이든 기존 다리의 코드가 바뀌지 않는다.
        입력이 다리 하나에만 닿는 것도 같은 이유다.
      </figcaption>
    </figure>
  );
}
window.MLFlowViz = MLFlowViz;
