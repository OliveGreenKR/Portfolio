// pages/labs/bbq-master/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 PoC 에는 계측본이 하나도 없다.
//         둘 다 원리도다 — 격자가 어디에 붙어 있나 · voxel 을 어떻게 가르나.
//         눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.bq-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 설명 문장에는 bq-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         그 내용은 figcaption 이 미리 받아 둔다.
// 규칙 5: 앞선 그림이 뒤 절의 개념을 미리 그리지 않는다.
//         V1(§02)은 격자의 위치만 말한다 — voxel 을 셋으로 가르는 일은 §03 이 처음 꺼낸다.

/* ─── 만든 것 3칸 ────────────────────────────────────── */
function BQBuilt({ items }) {
  const ri = window.renderInline;
  return (
    <div className="bq-built">
      {items.map(it => (
        <div className="bq-built-cell" key={it.title}>
          <div className="bq-built-kind">{it.kind}</div>
          <div className="bq-built-t">{ri(it.title)}</div>
          <div className="bq-built-s">{ri(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.BQBuilt = BQBuilt;

/* ─── V1 · 격자가 어디에 붙어 있나 ───────────────────── */
/* §02. 같은 회전을 두 방식에 똑같이 먹여 결과만 나란히 둔다.
   왼쪽은 채택하지 않은 쪽이다 — 만들어 본 적 없으므로 "이랬을 것" 이 아니라
   "격자를 고정하면 이렇게 어긋난다" 는 기하 자체를 그린다. */
function BQFrameViz() {
  const W = 760, H = 300;
  // 패널 두 장: 40..360 · 420..740. 오른쪽 끝 740 < 760 ✓
  const PW = 320, Lx = 40, Rx = 420;
  const ROT = -17;                       // 두 패널에 같은 각도를 먹인다
  const CELL = 26, COLS = 8, ROWS = 4;   // 8×26 = 208 · 4×26 = 104
  const gw = COLS * CELL, gh = ROWS * CELL;
  const CY = 150;
  // 회전 후 차지하는 크기: 폭 208·cos17 + 104·sin17 = 229 → cx±115, 패널 320 안에 든다 ✓
  //                        높이 208·sin17 + 104·cos17 = 160 → 70..230, 아래 태그(248)와 안 겹친다 ✓

  // 고기 판: 격자와 같은 크기. 패널 안쪽에서 중앙 정렬.
  const panel = (x, title, tone) => ({
    x, cx: x + PW / 2, cy: CY,
    gx: x + (PW - gw) / 2, gy: CY - gh / 2, title, tone,
  });

  const grid = (gx, gy, key) => (
    <g key={key}>
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <line key={`v${i}`} x1={gx + i * CELL} x2={gx + i * CELL} y1={gy} y2={gy + gh}
              stroke="var(--rule-2)" strokeWidth="0.8" />
      ))}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <line key={`h${i}`} x1={gx} x2={gx + gw} y1={gy + i * CELL} y2={gy + i * CELL}
              stroke="var(--rule-2)" strokeWidth="0.8" />
      ))}
    </g>
  );

  const slab = (gx, gy, key, fill) => (
    <rect key={key} x={gx} y={gy} width={gw} height={gh} rx="3"
          fill={fill} stroke="var(--ink-3)" strokeWidth="1.6" />
  );

  const L = panel(Lx, '격자를 화면에 고정하면', 'off');
  const R = panel(Rx, '격자를 고기에 붙이면', 'on');

  return (
    <figure className="bq-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="bq-svg" role="img"
           aria-label="고기를 같은 각도로 돌렸을 때, 격자를 화면에 고정하면 칸과 고기가 어긋나고 격자를 고기에 붙이면 칸이 그대로 따라온다">
        {[L, R].map(p => (
          <g key={p.title}>
            <text x={p.x + 4} y="30" className="bq-svg-lbl root">{p.title}</text>
            <rect x={p.x} y="44" width={PW} height="216" rx="4"
                  fill="var(--paper-2)" stroke="var(--rule-2)" />
          </g>
        ))}

        {/* 왼쪽 — 격자는 그대로, 고기만 돈다 */}
        {grid(L.gx, L.gy, 'gl')}
        <g transform={`rotate(${ROT} ${L.cx} ${L.cy})`}>
          {slab(L.gx, L.gy, 'sl', 'rgba(200,103,79,0.14)')}
        </g>
        <text x={L.cx} y="248" textAnchor="middle" className="bq-svg-tag">
          칸과 고기가 어긋난다
        </text>

        {/* 오른쪽 — 격자가 고기와 함께 돈다 */}
        <g transform={`rotate(${ROT} ${R.cx} ${R.cy})`}>
          {grid(R.gx, R.gy, 'gr')}
          {slab(R.gx, R.gy, 'sr', 'rgba(126,165,113,0.16)')}
        </g>
        <text x={R.cx} y="248" textAnchor="middle" className="bq-svg-tag ok">
          칸이 그대로 따라온다
        </text>

        <text x={W / 2} y="286" textAnchor="middle" className="bq-svg-sub bq-svg-note">
          칸은 시작할 때 한 번 정해 두고 끝까지 고치지 않는다
        </text>
      </svg>
      <figcaption className="bq-figcap">
        같은 각도를 두 쪽에 똑같이 먹였다. 오른쪽에서 칸이 <b>비뚤어져 보이는 것</b>이 맞는 그림이다 —
        화면 기준으로 반듯한 격자는 고기를 돌리는 순간 고기와 남남이 된다.
      </figcaption>
    </figure>
  );
}
window.BQFrameViz = BQFrameViz;

/* ─── V2 · voxel 을 셋으로 가르고, 읽는 곳을 나눈다 ─── */
/* §03. 분류 규칙(안쪽 칸 중 이웃에 바깥이 하나라도 있으면 겉면)을 코드로 계산해 그린다.
   손으로 색칠하면 규칙과 그림이 어긋난다. */
function BQVoxelViz() {
  const W = 760, H = 330;
  // 격자 12×7 · CELL 30 → 360 x 210. x 36..396. 오른쪽 설명단 424..744 < 760 ✓
  const CELL = 30, COLS = 12, ROWS = 7, GX = 36, GY = 62;
  const RX = 424, RW = 320;

  // 고기 단면을 타원으로 둔다. 이 판정은 그림 전용 — 실제는 mesh 안팎 판정이다.
  const inside = (c, r) => Math.pow((c - 5.5) / 4.3, 2) + Math.pow((r - 3) / 2.4, 2) <= 1;
  // 겉면 = 안쪽 칸 중 8-이웃에 바깥이 하나라도 있는 것 (2D 의 Chebyshev 반경 1)
  const isSurface = (c, r) => {
    if (!inside(c, r)) return false;
    for (let dc = -1; dc <= 1; dc++)
      for (let dr = -1; dr <= 1; dr++)
        if (!inside(c + dc, r + dr)) return true;
    return false;
  };

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const inn = inside(c, r), surf = isSurface(c, r);
      cells.push(
        <rect key={`${c}-${r}`} x={GX + c * CELL} y={GY + r * CELL} width={CELL} height={CELL}
              fill={surf ? 'var(--terra-50)' : inn ? 'var(--paper-3)' : 'var(--paper)'}
              stroke={surf ? 'var(--terra-400)' : inn ? 'var(--rule-2)' : 'var(--rule)'}
              strokeWidth={surf ? 1.4 : 0.8}
              strokeDasharray={inn ? undefined : '3 3'} />
      );
    }
  }

  const legend = [
    ['var(--paper)',      'var(--rule)',       '바깥',  '고기가 없는 칸'],
    ['var(--terra-50)',   'var(--terra-400)',  '겉면',  '이웃에 바깥이 있는 칸'],
    ['var(--paper-3)',  'var(--rule-2)',     '속',    '나머지 안쪽 칸'],
  ];

  return (
    <figure className="bq-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="bq-svg" role="img"
           aria-label="칸을 바깥 겉면 속 셋으로 가르고, 겉면 색은 겉면 칸만 읽고 단면 그림은 겉면과 속을 함께 읽는다">
        <text x={GX} y="34" className="bq-svg-lbl root">한 번 갈라 두는 세 종류</text>
        <text x={GX} y="52" className="bq-svg-sub bq-svg-note">
          고기 모양이 안 바뀌므로 굽기 전에 한 번만 가른다
        </text>
        {cells}

        {/* 오른쪽 — 범례 + 두 갈래 */}
        {legend.map(([f, s, k, v], i) => (
          <g key={k}>
            <rect x={RX} y={70 + i * 34} width={22} height={22} rx="2"
                  fill={f} stroke={s} strokeWidth="1.4"
                  strokeDasharray={k === '바깥' ? '3 3' : undefined} />
            <text x={RX + 32} y={80 + i * 34} className="bq-svg-lbl">{k}</text>
            <text x={RX + 76} y={80 + i * 34} className="bq-svg-sub">{v}</text>
          </g>
        ))}

        <line x1={RX} x2={RX + RW} y1="188" y2="188" stroke="var(--rule)" />
        <text x={RX} y="212" className="bq-svg-lbl root">읽는 곳을 나눈다</text>

        <rect x={RX} y="226" width={RW} height="40" rx="3"
              fill="var(--terra-50)" stroke="var(--terra-400)" strokeWidth="1.4" />
        <text x={RX + 12} y="243" className="bq-svg-lbl accent">겉면 색</text>
        <text x={RX + 12} y="259" className="bq-svg-sub">겉면 칸만 — 속에 끌려가지 않게</text>

        <rect x={RX} y="274" width={RW} height="40" rx="3"
              fill="var(--paper-3)" stroke="var(--rule-2)" strokeWidth="1.4" />
        <text x={RX + 12} y="291" className="bq-svg-lbl">자른 단면</text>
        <text x={RX + 12} y="307" className="bq-svg-sub">겉면 + 속 — 깊이가 층으로 보이게</text>
      </svg>
      <figcaption className="bq-figcap">
        칠한 것이 아니라 <b>규칙으로 계산</b>했다 — 안쪽 칸 중 이웃에 바깥이 하나라도 있으면 겉면이다.
        같은 격자를 두 창이 서로 다른 범위로 읽는다는 것이 이 그림의 요지다.
      </figcaption>
    </figure>
  );
}
window.BQVoxelViz = BQVoxelViz;
