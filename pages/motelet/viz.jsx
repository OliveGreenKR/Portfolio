// pages/motelet/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 (sage = 유효/채택, terra = 막힘/제외, ink-3 = 중립).
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 시계열 계측본이 없으므로
//         "측정 곡선처럼 보이는 그림" 을 만들지 않는다. 여기 있는 넷은 원리도 둘(밀집 · 점유),
//         실측 두 값의 대비 하나(폭등), 실측 설정값의 산술 하나(탐색 비용)다.
//         실제 곡선은 에디터 스크린샷으로만 보인다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.mt-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 mt-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).

/* ─── 밀집 지점 질의 — 셀 크기 R 이면 3×3 이 필요충분 ── */
function MTDensityViz() {
  const W = 760, H = 322;
  const cell = 62, cols = 5, rows = 4;
  const gx = 24, gy = 44;
  // 격자 총폭: gx + cols*cell = 24 + 310 = 334.
  // 주석 열은 x=360 에서 시작하고 가장 긴 줄이 대략 330px → 690 < 760 ✓ (텍스트라 근사)
  const cx = gx + 2 * cell + cell / 2;    // 중심 바디가 놓인 칸 (col 2, row 1)
  const cy = gy + 1 * cell + cell / 2;
  const R = cell;                          // 반지름 = 셀 크기
  const nb = { x: gx + cell, y: gy, w: 3 * cell, h: 3 * cell };   // 3×3 이웃

  // 바디 위치. in = 원 안 / near = 3×3 안이지만 원 밖 / far = 3×3 밖(안 봄)
  const inCircle = [[150, 120], [205, 155], [168, 175], [215, 115]];
  const near     = [[100, 62], [255, 210], [245, 72]];
  const far      = [[45, 70], [60, 262], [302, 92], [316, 266], [40, 186]];

  const dot = (p, i, cls, r) => <circle key={cls + i} cx={p[0]} cy={p[1]} r={r} className={cls} />;
  // 범례도 note 취급 — 720px 이하에서 10.5px 글자가 읽히지 않는다. 네 항목 전부 figcaption 이 받는다.
  const legend = (y, cls, text) => (
    <g className="mt-svg-note">
      <circle cx={368} cy={y - 4} r="5" className={cls} />
      <text x={382} y={y} className="mt-svg-sub">{text}</text>
    </g>
  );

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="셀 크기를 R 로 잡으면 반경 R 안의 바디는 반드시 자기 셀의 3×3 이웃 안에 있다">
        <text x={gx} y="22" className="mt-svg-lbl">균일 격자 — 셀 한 변 = R</text>

        {/* 격자 */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={gx + i * cell} x2={gx + i * cell} y1={gy} y2={gy + rows * cell}
                stroke="var(--rule)" />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={gx} x2={gx + cols * cell} y1={gy + i * cell} y2={gy + i * cell}
                stroke="var(--rule)" />
        ))}

        {/* 3×3 이웃 — 실제로 훑는 범위 */}
        <rect x={nb.x} y={nb.y} width={nb.w} height={nb.h} fill="var(--sage-50)" stroke="var(--sage-500)"
              strokeWidth="1.6" strokeDasharray="5 3" />

        {/* 후보 원 */}
        <circle cx={cx} cy={cy} r={R} fill="var(--sage-200)" fillOpacity="0.5" stroke="var(--sage-500)" strokeWidth="1.6" />
        <line x1={cx} x2={cx + R} y1={cy} y2={cy} stroke="var(--sage-700)" strokeDasharray="3 3" />
        <text x={cx + R / 2} y={cy - 6} textAnchor="middle" className="mt-svg-tag">R</text>

        {far.map((p, i) => dot(p, i, 'mt-dot-far', 4))}
        {near.map((p, i) => dot(p, i, 'mt-dot-near', 4.5))}
        {inCircle.map((p, i) => dot(p, i, 'mt-dot-in', 5))}
        <circle cx={cx} cy={cy} r="6" className="mt-dot-seed" />

        {/* 주석 열 */}
        <text x={360} y="60"  className="mt-svg-lbl">후보 = 바디 위치 자체</text>
        <text x={360} y="80"  className="mt-svg-sub mt-svg-note">최적 원은 거의 항상 어떤 바디에 걸친다</text>
        <text x={360} y="112" className="mt-svg-lbl">훑는 범위 = 자기 셀의 3×3</text>
        <text x={360} y="132" className="mt-svg-sub mt-svg-note">칸 밖 바디는 검사에서 빠진다</text>

        {legend(180, 'mt-dot-seed', '후보 중심 — 이 바디 위에 원을 놓아 본다')}
        {legend(204, 'mt-dot-in',   '원 안 — 세는 대상')}
        {legend(228, 'mt-dot-near', '3×3 안 · 원 밖 — 봤지만 안 셈')}
        {legend(252, 'mt-dot-far',  '3×3 밖 — 아예 보지 않음')}
      </svg>
      <figcaption className="mt-figcap">
        점 13개 중 검사에 들어가는 것은 3×3 안의 <b>8개</b>, 그중 원에 드는 것은 <b>5개</b>다.
        주황 = 원을 놓아 본 후보 중심 · 초록 = 세는 대상 · 흰색 = 봤지만 안 셈 · 회색 = 격자가 걸러 낸 것.
      </figcaption>
    </figure>
  );
}
window.MTDensityViz = MTDensityViz;

/* ─── 스폰 상한 — 마릿수 축과 면적 축 ────────────────── */
/* 두 패널의 마릿수는 같고 반지름만 2배다. 면적은 정확히 4배가 된다(π 는 약분).
   절대 점유율은 화면 크기에 달렸으므로 적지 않고, 축 사이의 비만 보인다. */
function MTOccupancyViz() {
  const W = 760, H = 306;
  const pad = 20, panelW = 350, gap = 20;
  // 총폭: 20 + 350 + 20 + 350 = 740 < 760 ✓
  const panels = [
    { x: pad,                r: 16, head: '작은 적 8마리', occ: '×1', ok: true },
    { x: pad + panelW + gap, r: 32, head: '큰 적 8마리',   occ: '×4', ok: false },
  ];
  // 화면 사각 안의 8자리 (패널 로컬 비율 0~1)
  const slots = [[0.14, 0.24], [0.40, 0.16], [0.68, 0.28], [0.88, 0.55],
                 [0.20, 0.62], [0.46, 0.50], [0.70, 0.74], [0.34, 0.84]];
  const scrX = 14, scrY = 56, scrW = panelW - 28, scrH = 150;

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="마릿수가 같아도 반지름이 두 배면 화면 점유 면적은 네 배가 된다">
        {panels.map(p => (
          <g key={p.head}>
            <text x={p.x + scrX} y="26" className="mt-svg-lbl">{p.head}</text>
            <rect x={p.x + scrX} y={scrY} width={scrW} height={scrH} rx="3"
                  fill={p.ok ? 'var(--sage-50)' : 'var(--terra-50)'} stroke="var(--rule-2)" />
            <text x={p.x + scrX + 6} y={scrY + 16} className="mt-svg-sub">화면</text>
            {slots.map((s, i) => (
              <circle key={i}
                      cx={p.x + scrX + 20 + s[0] * (scrW - 40)}
                      cy={scrY + 24 + s[1] * (scrH - 44)}
                      r={p.r}
                      fill={p.ok ? 'var(--sage-200)' : 'var(--terra-100)'}
                      fillOpacity="0.85"
                      stroke={p.ok ? 'var(--sage-500)' : 'var(--terra-400)'} />
            ))}

            {/* 두 축 */}
            <text x={p.x + scrX} y={scrY + scrH + 28} className="mt-svg-sub">마릿수 축</text>
            <rect x={p.x + scrX + 74} y={scrY + scrH + 18} width={110} height={12} rx="2"
                  fill="var(--ink-3)" fillOpacity="0.35" stroke="var(--rule-2)" />
            <text x={p.x + scrX + 192} y={scrY + scrH + 28} className="mt-svg-tag">8 / 8 — 동일</text>

            <text x={p.x + scrX} y={scrY + scrH + 52} className="mt-svg-sub">면적 축</text>
            <rect x={p.x + scrX + 74} y={scrY + scrH + 42} width={p.ok ? 42 : 168} height={12} rx="2"
                  fill={p.ok ? 'var(--sage-300)' : 'var(--terra-300)'}
                  stroke={p.ok ? 'var(--sage-500)' : 'var(--terra-400)'} />
            <text x={p.x + scrX + (p.ok ? 124 : 250)} y={scrY + scrH + 52} className="mt-svg-tag">{p.occ}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-figcap">
        두 화면의 마릿수 막대는 길이가 같고, 면적 막대는 <b>×1 대 ×4</b> 다.
        반지름이 두 배면 면적은 네 배이므로 두 축의 눈금은 같이 움직이지 않는다.
      </figcaption>
    </figure>
  );
}
window.MTOccupancyViz = MTOccupancyViz;

/* ─── 실측 폭등 — 에디터 화면에서 그대로 읽은 두 값 ──── */
/* 이 페이지에서 유일한 실측 대비다. 값을 여기서 만들지 않고 data.js 의 tool.spike 에서 받는다. */
function MTSpikeViz({ spike }) {
  const W = 760, H = 236;
  // ⚠️ padT 는 헤드룸이다. 큰 막대는 항상 ih 를 꽉 채우므로 그 값 라벨이 y = base-ih-10 에 뜬다.
  //    padT 가 작으면 그 라벨이 y=24 의 도형 제목과 겹친다 — 입력값과 무관한 구조적 충돌이다.
  //    padT 62 → 라벨 y = 52, 제목과 28px 간격.
  const padT = 62, padB = 52, ih = H - padT - padB;   // 122
  const base = padT + ih;                              // 184
  const bw = 130, x1 = 140, x2 = 330;
  // 총폭: 오른쪽 요약 박스 520 + 200 = 720 < 760 ✓
  const h2 = ih;
  const h1 = Math.round(ih * (spike.from / spike.to));
  const fmt = n => n.toLocaleString('en-US');

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label={`한 구간의 구매가 다음 판의 기대 골드를 ${spike.ratio} 로 올렸다`}>
        <text x="20" y="24" className="mt-svg-lbl">한 구간의 구매가 다음 판에 만든 차이 — 에디터 화면 실측</text>
        <line x1="20" x2="500" y1={base} y2={base} stroke="var(--rule-2)" />

        <rect x={x1} y={base - h1} width={bw} height={h1} rx="2"
              fill="var(--terra-100)" stroke="var(--terra-400)" />
        <text x={x1 + bw / 2} y={base - h1 - 10} textAnchor="middle" className="mt-svg-num sm">{fmt(spike.from)}</text>
        <text x={x1 + bw / 2} y={base + 20} textAnchor="middle" className="mt-svg-sub">구간 진입 시</text>

        <rect x={x2} y={base - h2} width={bw} height={h2} rx="2"
              fill="var(--sage-200)" stroke="var(--sage-500)" />
        <text x={x2 + bw / 2} y={base - h2 - 10} textAnchor="middle" className="mt-svg-num sm">{fmt(spike.to)}</text>
        <text x={x2 + bw / 2} y={base + 20} textAnchor="middle" className="mt-svg-sub">58번째 판</text>

        <line x1={x1 + bw + 12} x2={x2 - 12} y1={base - h1 - 34} y2={base - h1 - 34} stroke="var(--ink-3)" />
        <polygon points={`${x2 - 12},${base - h1 - 38} ${x2 - 12},${base - h1 - 30} ${x2 - 4},${base - h1 - 34}`} fill="var(--ink-3)" />
        <text x={(x1 + bw + x2) / 2} y={base - h1 - 42} textAnchor="middle" className="mt-svg-tag">51~57판 구매</text>

        <rect x="520" y={padT + 4} width="200" height="96" rx="3" fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x="620" y={padT + 48} textAnchor="middle" className="mt-svg-num strong">{spike.ratio}</text>
        <text x="620" y={padT + 74} textAnchor="middle" className="mt-svg-sub">기대 골드 · 한 구간 만에</text>
      </svg>
      <figcaption className="mt-figcap">{window.renderInline(spike.caption)}</figcaption>
    </figure>
  );
}
window.MTSpikeViz = MTSpikeViz;

/* ─── 탐색 비용 — 실측 설정값의 산술 ─────────────────── */
function MTSearchCostViz() {
  const W = 760, H = 178;
  const y = 52, bh = 68;
  // 총폭: 20+120 (×) 170+120 (×) 320+120 (=) 480+220 = 700 < 760 ✓
  const cells = [
    { x: 20,  w: 120, n: '90',  t: '곡선 1개 = 판' },
    { x: 170, w: 120, n: '128', t: '세대 1 = 후보' },
    { x: 320, w: 120, n: '64',  t: '세대 수' },
  ];
  const ops = [{ x: 155, s: '×' }, { x: 305, s: '×' }, { x: 460, s: '=' }];

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="탐색 한 번은 곡선 8192개, 판 737280회에 해당한다">
        <text x="20" y="26" className="mt-svg-lbl">탐색 한 번의 비용 — 에디터에 설정된 값 그대로</text>
        {cells.map(c => (
          <g key={c.t}>
            <rect x={c.x} y={y} width={c.w} height={bh} rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={c.x + c.w / 2} y={y + 30} textAnchor="middle" className="mt-svg-num">{c.n}</text>
            <text x={c.x + c.w / 2} y={y + 52} textAnchor="middle" className="mt-svg-sub">{c.t}</text>
          </g>
        ))}
        {ops.map(o => (
          <text key={o.x} x={o.x} y={y + 40} textAnchor="middle" className="mt-svg-op">{o.s}</text>
        ))}
        <rect x="480" y={y} width="220" height={bh} rx="3" fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x="590" y={y + 30} textAnchor="middle" className="mt-svg-num strong">737,280</text>
        <text x="590" y={y + 52} textAnchor="middle" className="mt-svg-sub">판 · 곡선으로는 8,192개</text>
      </svg>
      <figcaption className="mt-figcap">
        곡선 하나가 판 90회, 세대 하나가 후보 128개, 세대를 64번.
        <b> 사람이 플레이로 대신할 수 있는 규모가 아니다.</b>
      </figcaption>
    </figure>
  );
}
window.MTSearchCostViz = MTSearchCostViz;

/* ─── 만든 것 3칸 ────────────────────────────────────── */
/* 큰 숫자 밴드가 아니다. 이 페이지에는 개선 전후를 비교할 계측본이 없어
   히어로에 올릴 성과 수치가 없다. 규모·설정값을 숫자처럼 세우면 훅과 무관한
   장식이 되므로, 세 칸에 만든 것을 적고 kind 로 아래 섹션을 예고한다. */
function MTBuilt({ items }) {
  return (
    <div className="mt-built">
      {items.map(it => (
        <div className="mt-built-cell" key={it.title}>
          <div className="mt-built-kind">{it.kind}</div>
          <div className="mt-built-t">{window.renderInline(it.title)}</div>
          <div className="mt-built-s">{window.renderInline(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.MTBuilt = MTBuilt;

/* ─── 사정거리 — 읽는 것 / 안 읽는 것 ────────────────── */
function MTScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="mt-scope">
      <div className="mt-scope-head">{scope.title}</div>
      <p className="mt-scope-lead">{ri(scope.lead)}</p>
      <div className="mt-scope-cols">
        <div className="mt-scope-col reads">
          <div className="mt-scope-k"><span className="glyph">✓</span> 읽는다</div>
          <ul>{scope.reads.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
        <div className="mt-scope-col skips">
          <div className="mt-scope-k"><span className="glyph">✕</span> 읽지 않는다</div>
          <ul>{scope.skips.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
      </div>
      <p className="mt-scope-why">{ri(scope.why)}</p>
    </div>
  );
}
window.MTScope = MTScope;
