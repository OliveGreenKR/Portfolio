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

/* ─── V0 · 시뮬레이션 공간 자체가 격자다 ─────────────── */
/* §02 첫 그림. 고기를 격자로 나눈 것이 아니라 공간을 나눴고,
   그 안에서 고기 칸과 공기 칸이 갈린다 — 둘 다 같은 격자에 산다.
   32 를 그대로 그리면 선만 남으므로 4 칸으로 줄여 그리고, 실수치는 라벨이 말한다. */
function BQSpaceViz() {
  const W = 760, H = 330;
  const N = 4;                       // 그림용 분할. 실제는 32.
  const AX = 26, AY = 14.6, DY = 26; // i:(+26,+14.6) · j:(-26,+14.6) · k(아래):(0,+26)
  const T = { x: 160, y: 56 };       // 위 꼭짓점
  // 가로: 160 ± N·26 = 56..264 ✓ / 세로: 56 .. 56 + 2N·14.6 + N·26 = 276.8 ✓ (H 330 안)
  const P = (i, j, k) => [T.x + (i - j) * AX, T.y + (i + j) * AY + k * DY];
  const pts = arr => arr.map(p => p.join(',')).join(' ');

  // 아이소메트릭 상자 하나 — 위 · 오른쪽(i 최대) · 왼쪽(j 최대) 세 면만 보인다.
  const isoBox = (i0, j0, k0, di, dj, dk, fill, stroke, sw, key) => {
    const top = [P(i0, j0, k0), P(i0 + di, j0, k0), P(i0 + di, j0 + dj, k0), P(i0, j0 + dj, k0)];
    const rgt = [P(i0 + di, j0, k0), P(i0 + di, j0 + dj, k0), P(i0 + di, j0 + dj, k0 + dk), P(i0 + di, j0, k0 + dk)];
    const lft = [P(i0, j0 + dj, k0), P(i0 + di, j0 + dj, k0), P(i0 + di, j0 + dj, k0 + dk), P(i0, j0 + dj, k0 + dk)];
    return (
      <g key={key}>
        <polygon points={pts(lft)} fill={fill} stroke={stroke} strokeWidth={sw} opacity="0.82" />
        <polygon points={pts(rgt)} fill={fill} stroke={stroke} strokeWidth={sw} />
        <polygon points={pts(top)} fill={fill} stroke={stroke} strokeWidth={sw} opacity="0.92" />
      </g>
    );
  };

  // 겉 상자의 칸 선 — 보이는 세 면에만 긋는다.
  const rules = [];
  for (let a = 1; a < N; a++) {
    rules.push(<line key={`t1${a}`} x1={P(a, 0, 0)[0]} y1={P(a, 0, 0)[1]} x2={P(a, N, 0)[0]} y2={P(a, N, 0)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
    rules.push(<line key={`t2${a}`} x1={P(0, a, 0)[0]} y1={P(0, a, 0)[1]} x2={P(N, a, 0)[0]} y2={P(N, a, 0)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
    rules.push(<line key={`r1${a}`} x1={P(N, a, 0)[0]} y1={P(N, a, 0)[1]} x2={P(N, a, N)[0]} y2={P(N, a, N)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
    rules.push(<line key={`r2${a}`} x1={P(N, 0, a)[0]} y1={P(N, 0, a)[1]} x2={P(N, N, a)[0]} y2={P(N, N, a)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
    rules.push(<line key={`l1${a}`} x1={P(a, N, 0)[0]} y1={P(a, N, 0)[1]} x2={P(a, N, N)[0]} y2={P(a, N, N)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
    rules.push(<line key={`l2${a}`} x1={P(0, N, a)[0]} y1={P(0, N, a)[1]} x2={P(N, N, a)[0]} y2={P(N, N, a)[1]} stroke="var(--rule)" strokeWidth="0.7" />);
  }

  const RX = 322;
  return (
    <figure className="bq-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="bq-svg" role="img"
           aria-label="시뮬레이션 공간 전체가 격자이고 그 안에 고기 칸과 공기 칸이 함께 들어 있다">
        <text x="56" y="34" className="bq-svg-lbl root">공간 전체를 칸으로 나눈다</text>
        <text x="56" y="50" className="bq-svg-sub bq-svg-note">그림은 4칸 — 실제는 한 변 32칸</text>

        {/* 겉 상자 = 시뮬레이션 공간 (공기 포함) */}
        {isoBox(0, 0, 0, N, N, N, 'var(--paper)', 'var(--rule-2)', 1.2, 'space')}
        {rules}
        {/* 안쪽 덩이 = 고기 */}
        {isoBox(1, 1, 1, 2, 2, 2, 'var(--terra-100)', 'var(--terra-400)', 1.5, 'meat')}

        <text x={P(N, N, N)[0]} y={P(N, N, N)[1] + 22} textAnchor="middle" className="bq-svg-tag">
          이 상자 하나가 시뮬레이션 공간
        </text>

        {/* 오른쪽 — 칸 하나가 드는 것 */}
        <text x={RX} y="74" className="bq-svg-lbl root">칸 하나가 드는 것</text>
        <rect x={RX} y="86" width="404" height="60" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
        <text x={RX + 14} y="110" className="bq-svg-lbl">온도</text>
        <text x={RX + 74} y="110" className="bq-svg-sub">지금 온도 · 여태 닿은 최고 온도</text>
        <text x={RX + 14} y="134" className="bq-svg-lbl accent">전도율</text>
        <text x={RX + 74} y="134" className="bq-svg-sub">열이 얼마나 잘 통하는지 — 칸 종류마다 다르다</text>

        <text x={RX} y="180" className="bq-svg-lbl root">그래서 두 종류가 한 격자에 산다</text>
        <rect x={RX} y="192" width="196" height="52" rx="3" fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth="1.4" />
        <text x={RX + 14} y="214" className="bq-svg-lbl accent">고기 칸</text>
        <text x={RX + 14} y="232" className="bq-svg-sub">열을 빨리 옮긴다</text>
        <rect x={RX + 208} y="192" width="196" height="52" rx="3" fill="var(--paper)" stroke="var(--rule-2)" strokeDasharray="4 3" />
        <text x={RX + 222} y="214" className="bq-svg-lbl">공기 칸</text>
        <text x={RX + 222} y="232" className="bq-svg-sub">열을 천천히 옮긴다</text>

        {/* 본문 바로 위 문단이 "이웃끼리 주고받는다" 를 이미 말한다 — 여기서 되풀이하지 않는다. */}
      </svg>
      <figcaption className="bq-figcap">
        나눈 것은 고기가 아니라 <b>공간</b>이다. 고기 칸과 공기 칸이 같은 격자 안에 있고,
        둘의 차이는 <b>열을 옮기는 속도</b> 하나뿐이다 — 겉이 먼저 익고 속이 늦게 익는 모양은
        규칙으로 넣은 것이 아니라 이 속도 차이에서 저절로 나온다.
      </figcaption>
    </figure>
  );
}
window.BQSpaceViz = BQSpaceViz;

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
    ['var(--paper)',    'var(--rule)',      '공기',  '고기가 없는 칸'],
    ['var(--terra-50)', 'var(--terra-400)', '겉면',  '이웃에 공기가 있는 고기 칸'],
    ['var(--paper-3)',  'var(--rule-2)',    '속',    '나머지 고기 칸'],
  ];

  return (
    <figure className="bq-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="bq-svg" role="img"
           aria-label="칸을 공기 겉면 속 셋으로 가르고, 겉면 색은 겉면 칸만 읽고 단면 그림은 겉면과 속을 함께 읽는다">
        <text x={GX} y="34" className="bq-svg-lbl root">격자를 한 면으로 자른 모습</text>
        <text x={GX} y="52" className="bq-svg-sub bq-svg-note">
          고기 모양이 안 바뀌므로 굽기 전에 한 번만 갈라 둔다
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
        칠한 것이 아니라 <b>규칙으로 계산</b>했다 — 고기 칸 중 이웃에 공기가 하나라도 있으면 겉면이다.
        같은 격자를 두 창이 서로 다른 범위로 읽는다는 것이 이 그림의 요지다.
      </figcaption>
    </figure>
  );
}
window.BQVoxelViz = BQVoxelViz;

/* ─── V3 · 데이터에서 화면까지 한 방향 ───────────────── */
/* §04 의 본체. 네 칸이 각자 무엇을 알고 무엇을 모르는지가 이 그림의 전부다.
   "아는 것 / 모르는 것" 을 칸마다 적어 두면 화살표가 왜 한 방향인지가 그림으로 선다. */
function BQPipeViz() {
  const W = 760, H = 268;   // 칸(74..192) + 바꾸는 자리 대괄호(~240) + 여백
  // 칸 4개: 4×166 + 3×26 = 742 — 시작 10 → 10..752. 화살표는 칸 사이 26 안에 든다 ✓
  const BW = 166, GAP = 26, X0 = 10, BY = 74, BH = 118;
  const bx = i => X0 + i * (BW + GAP);

  const stages = [
    { k: '복셀 배열',  t: '온도만 들고 있다',      no: '등급도 점수도 색도 모른다', tone: 'data' },
    { k: '읽기',      t: '어느 칸을 볼지 고른다', no: '값을 고치지 않는다',        tone: '' },
    { k: '색으로',     t: '온도를 색으로 바꾼다',  no: '격자를 다시 안 본다',       tone: 'rule' },
    { k: '렌더러',     t: '받은 색을 칠한다',      no: '온도를 모른다',            tone: 'out' },
  ];

  const arrow = (i) => {
    const x1 = bx(i) + BW + 4, x2 = bx(i + 1) - 4, y = BY + BH / 2;
    return (
      <g key={`ar${i}`}>
        <line x1={x1} x2={x2 - 8} y1={y} y2={y} stroke="var(--ink-3)" strokeWidth="1.5" />
        <polygon points={`${x2},${y} ${x2 - 9},${y - 5} ${x2 - 9},${y + 5}`} fill="var(--ink-3)" />
      </g>
    );
  };

  return (
    <figure className="bq-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="bq-svg" role="img"
           aria-label="복셀 배열에서 읽기와 색 변환을 거쳐 렌더러까지 한 방향으로 흐르고, 렌더러는 온도를 모르며 복셀은 색을 모른다">
        <text x={X0} y="34" className="bq-svg-lbl root">칸마다 아는 것이 다르다</text>
        <text x={X0} y="52" className="bq-svg-sub bq-svg-note">화살표가 한 방향이라 뒤 칸을 고쳐도 앞 칸이 안 흔들린다</text>

        {stages.map((s, i) => (
          <g key={s.k}>
            <rect x={bx(i)} y={BY} width={BW} height={BH} rx="4"
                  fill={s.tone === 'data' ? 'var(--terra-50)' : s.tone === 'rule' ? 'var(--sage-50)' : 'var(--paper-2)'}
                  stroke={s.tone === 'data' ? 'var(--terra-400)' : s.tone === 'rule' ? 'var(--sage-500)' : 'var(--rule-2)'}
                  strokeWidth={s.tone === 'data' || s.tone === 'rule' ? 1.6 : 1.1} />
            <text x={bx(i) + 14} y={BY + 28}
                  className={`bq-svg-lbl root${s.tone === 'rule' ? ' ok' : s.tone === 'data' ? ' accent' : ''}`}>{s.k}</text>
            <line x1={bx(i) + 14} x2={bx(i) + BW - 14} y1={BY + 40} y2={BY + 40} stroke="var(--rule)" />
            <text x={bx(i) + 14} y={BY + 64} className="bq-svg-sub">한다</text>
            <text x={bx(i) + 14} y={BY + 82} className="bq-svg-lbl">{s.t}</text>
            <text x={bx(i) + 14} y={BY + 102} className="bq-svg-sub">모른다 · {s.no}</text>
          </g>
        ))}
        {[0, 1, 2].map(arrow)}

        {/* 바꾸는 자리 — 가운데 두 칸 아래 */}
        <path d={`M${bx(1)} ${BY + BH + 16} L${bx(1)} ${BY + BH + 26} L${bx(2) + BW} ${BY + BH + 26} L${bx(2) + BW} ${BY + BH + 16}`}
              fill="none" stroke="var(--sage-500)" strokeWidth="1.4" />
        <text x={(bx(1) + bx(2) + BW) / 2} y={BY + BH + 48} textAnchor="middle" className="bq-svg-tag ok">
          등급 기준 · 점수 방식을 바꾸는 자리
        </text>

        {/* "같은 배열을 셋이 따로 읽는다" 는 아래 요점 5번이 진다 — 그림에서 되풀이하지 않는다. */}
      </svg>
      <figcaption className="bq-figcap">
        가운데 두 칸이 <b>게임 규칙이 사는 자리</b>다. 여기만 갈아 끼우면 등급도 점수도 바뀌고,
        왼쪽 배열과 오른쪽 렌더러는 손대지 않는다 — 렌더러가 온도를 모르기 때문에 가능한 일이다.
      </figcaption>
    </figure>
  );
}
window.BQPipeViz = BQPipeViz;
