// pages/motelet/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 (sage = 유효/채택, terra = 막힘/제외, ink-3 = 중립).
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 계측본이 없으므로
//         "측정 결과처럼 보이는 그림" 을 만들지 않는다. 여기 셋은 전부 원리도다 —
//         대체 범위 · 밀집 질의 · 여유 질의. 눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.mt-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 mt-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         숨긴 내용은 figcaption 이 받는다.

/* ─── 물리 엔진 자리에 들어간 것의 범위 ──────────────── */
/* 이 그림의 일은 자랑이 아니라 한계 긋기다 — "물리 엔진을 직접 만들었다" 로
   읽히지 않게, 실제로 들어간 것이 네 겹뿐임을 보인다. */
function MTGeoArchViz({ caption }) {
  const W = 760, H = 262;
  // 총폭: 마지막 열 x=566 + w=178 = 744 < 760 ✓
  const cols = [
    { x: 16,  w: 140, t: '호출자',       items: ['블레이드 매 프레임', '대시 스윕 1회', '장판 · 밀대', '스폰 · 배치'] },
    { x: 186, w: 170, t: '질의 4종',      items: ['원', '캡슐', '회전 사각', '캡슐 다발'] },
    { x: 386, w: 150, t: '모양 디스패치', items: ['바디 = 원', '바디 = 캡슐', '× 질의 모양', '→ 커널 선택'] },
    { x: 566, w: 178, t: '수학 커널 7',   items: ['원-원 · 원-캡슐', '원-사각 · 캡슐-캡슐', '캡슐-사각', '선분 · 점 거리'] },
  ];
  const top = 44, boxH = 176;

  return (
    /* 좁은 폭 처리는 page.css 의 .mt-figure 가 공통으로 맡는다 —
       viewBox 를 폭에 맞춰 줄이면 글자가 3.2px 로 유실되므로 그림만 가로 스와이프. */
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="물리 엔진 자리에 들어간 것은 질의 4종과 커널 7함수뿐이다">
        <text x={16} y="22" className="mt-svg-lbl">물리 엔진 없이 — 실제로 들어간 것</text>

        {cols.map((c, i) => (
          <g key={c.t}>
            <rect x={c.x} y={top} width={c.w} height={boxH} rx="3"
                  fill={i === 0 ? 'var(--paper)' : i === 3 ? 'var(--sage-50)' : 'var(--paper-2)'}
                  stroke={i === 3 ? 'var(--sage-500)' : 'var(--rule-2)'}
                  strokeWidth={i === 3 ? 1.6 : 1} />
            <text x={c.x + c.w / 2} y={top + 24} textAnchor="middle" className="mt-svg-lbl">{c.t}</text>
            <line x1={c.x + 12} x2={c.x + c.w - 12} y1={top + 36} y2={top + 36} stroke="var(--rule)" />
            {c.items.map((it, j) => (
              <text key={it} x={c.x + c.w / 2} y={top + 62 + j * 27} textAnchor="middle"
                    className="mt-svg-sub">{it}</text>
            ))}
          </g>
        ))}

        {cols.slice(0, 3).map((c, i) => {
          const x1 = c.x + c.w, x2 = cols[i + 1].x, y = top + boxH / 2;
          return (
            <g key={`a${i}`}>
              <line x1={x1 + 4} x2={x2 - 10} y1={y} y2={y} stroke="var(--rule-2)" />
              <polyline points={`${x2 - 14},${y - 4} ${x2 - 6},${y} ${x2 - 14},${y + 4}`}
                        fill="none" stroke="var(--rule-2)" />
            </g>
          );
        })}

      </svg>
      <figcaption className="mt-figcap">{window.renderInline(caption)}</figcaption>
    </figure>
  );
}
window.MTGeoArchViz = MTGeoArchViz;

/* ─── 밀집 지점 질의 — 셀 크기 R 이면 3×3 이 필요충분 ── */
function MTDensityViz() {
  const W = 760, H = 322;
  const cell = 62, cols = 5, rows = 4;
  const gx = 24, gy = 44;
  // 격자 총폭: gx + cols*cell = 24 + 310 = 334.
  // 주석 열은 x=360 에서 시작하고 가장 긴 줄이 대략 330px → 690 < 760 ✓ (텍스트라 근사)
  const cx = gx + 2 * cell + cell / 2;    // 후보 적이 놓인 칸 (col 2, row 1)
  const cy = gy + 1 * cell + cell / 2;
  const R = cell;                          // 반지름 = 셀 크기
  const nb = { x: gx + cell, y: gy, w: 3 * cell, h: 3 * cell };   // 3×3 이웃

  // 적 위치. in = 원 안 / near = 3×3 안이지만 원 밖 / far = 3×3 밖(안 봄)
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
           aria-label="셀 크기를 R 로 잡으면 반경 R 안의 적은 반드시 자기 셀의 3×3 이웃 안에 있다">
        <text x={gx} y="22" className="mt-svg-lbl">가장 많이 덮는 지점 — 셀 한 변 = R</text>

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
        <text x={360} y="60"  className="mt-svg-lbl">후보 = 적 위치 자체</text>
        <text x={360} y="80"  className="mt-svg-sub mt-svg-note">최적 원은 거의 항상 어떤 적에 걸친다</text>
        <text x={360} y="112" className="mt-svg-lbl">훑는 범위 = 자기 셀의 3×3</text>
        <text x={360} y="132" className="mt-svg-sub mt-svg-note">칸 밖 적은 검사에서 빠진다</text>

        {legend(180, 'mt-dot-seed', '후보 중심 — 이 적 위에 원을 놓아 본다')}
        {legend(204, 'mt-dot-in',   '원 안 — 세는 대상')}
        {legend(228, 'mt-dot-near', '3×3 안 · 원 밖 — 봤지만 안 셈')}
        {legend(252, 'mt-dot-far',  '3×3 밖 — 아예 보지 않음')}
      </svg>
      <figcaption className="mt-figcap">
        점 13개 중 검사에 들어가는 것은 3×3 안의 <b>8개</b>, 그중 원에 드는 것은 <b>5개</b>다.
        <span className="mt-cap-legend">주황 = 원을 놓아 본 후보 중심 · 초록 = 세는 대상 ·
        흰색 = 봤지만 안 셈 · 회색 = 격자가 걸러 낸 것.</span>
      </figcaption>
    </figure>
  );
}
window.MTDensityViz = MTDensityViz;

/* ─── 여유 질의 — 격자는 후보 샘플러다 ──────────── */
/* 위 그림과 같은 격자 치수를 쓴다. 같은 모양인데 역할이 다르다는 것이
   이 절의 요점이라, 치수를 맞춰야 대비가 산다.
   장애물 반지름과 배치 반지름은 실제 판정과 무관한 임의값 — 원리도다. */
function MTClearanceViz() {
  const W = 760, H = 322;
  const cell = 62, cols = 5, rows = 4;
  const gx = 24, gy = 44;
  // 격자 총폭: 24 + 310 = 334. 주석 열 x=360 → 위 그림과 동일 ✓
  const R = 26;   // 놓으려는 원의 반지름

  // 장애물 (cx, cy, 외접반지름)
  const obs = [[70, 80, 16], [150, 110, 20], [250, 70, 14],
               [300, 180, 18], [110, 240, 16], [200, 260, 15], [255, 215, 12]];

  // 칸마다 랜덤 1점(지터). 좌표는 고정 — 그림은 매번 같아야 한다.
  const cand = [[40, 72], [105, 88], [160, 62], [230, 90], [300, 70],
                [52, 140], [120, 155], [185, 120], [245, 145], [310, 130],
                [45, 200], [100, 180], [175, 205], [240, 185], [305, 210],
                [60, 260], [130, 275], [190, 235], [250, 280], [315, 265]];

  // 여유가 기준을 넘은 후보들 (min(중심거리 − (R + 장애물반지름)) ≥ padding)
  const passIdx = [10, 12, 14, 4];
  const pickIdx = 12;

  const legend = (y, node, text) => (
    <g className="mt-svg-note">
      {node}
      <text x={382} y={y} className="mt-svg-sub">{text}</text>
    </g>
  );

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="칸마다 랜덤 한 점을 후보로 뽑고 여유로 점수를 매긴다">
        <text x={gx} y="22" className="mt-svg-lbl">여유가 가장 큰 자리 — 칸마다 후보 1개</text>

        {/* 격자 — 여기서는 가속 구조가 아니라 후보 샘플러다 */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={gx + i * cell} x2={gx + i * cell} y1={gy} y2={gy + rows * cell}
                stroke="var(--rule)" />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={gx} x2={gx + cols * cell} y1={gy + i * cell} y2={gy + i * cell}
                stroke="var(--rule)" />
        ))}

        {/* 장애물 — 외접원으로 본다 */}
        {obs.map((o, i) => (
          <circle key={`o${i}`} cx={o[0]} cy={o[1]} r={o[2]} className="mt-obs" />
        ))}

        {/* 후보 점 */}
        {cand.map((p, i) => (
          <circle key={`c${i}`} cx={p[0]} cy={p[1]} r="3.4"
                  className={passIdx.includes(i) ? 'mt-dot-in' : 'mt-dot-near'} />
        ))}

        {/* 통과 후보에 여유 링 */}
        {passIdx.filter(i => i !== pickIdx).map(i => (
          <circle key={`p${i}`} cx={cand[i][0]} cy={cand[i][1]} r={R}
                  fill="none" stroke="var(--sage-500)" strokeDasharray="3 4" />
        ))}

        {/* 뽑힌 자리 */}
        <circle cx={cand[pickIdx][0]} cy={cand[pickIdx][1]} r={R}
                fill="var(--sage-200)" fillOpacity="0.55" stroke="var(--sage-500)" strokeWidth="1.6" />
        <circle cx={cand[pickIdx][0]} cy={cand[pickIdx][1]} r="5" className="mt-dot-seed" />

        {/* 주석 열 */}
        <text x={360} y="60"  className="mt-svg-lbl">후보 = 칸마다 랜덤 1점</text>
        <text x={360} y="80"  className="mt-svg-sub mt-svg-note">빈 자리는 장애물과 무관한 곳이다</text>
        <text x={360} y="112" className="mt-svg-lbl">최대를 고르지 않는다</text>
        <text x={360} y="132" className="mt-svg-sub mt-svg-note">기준을 넘긴 후보 중에서 균등하게 하나</text>

        {legend(180, <circle cx={368} cy={176} r="5" className="mt-dot-seed" />, '뽑힌 자리 — 통과 후보 중 균등 1개')}
        {legend(204, <circle cx={368} cy={200} r="5" className="mt-dot-in" />, '기준 통과 — 여유가 충분')}
        {legend(228, <circle cx={368} cy={224} r="5" className="mt-dot-near" />, '탈락 — 장애물에 너무 가깝다')}
        {legend(252, <circle cx={368} cy={248} r="6" className="mt-obs" />, '장애물 — 외접원으로 본다')}
      </svg>
      <figcaption className="mt-figcap">
        후보 20개 중 기준을 넘은 것은 <b>4개</b>, 그중 하나가 균등하게 뽑힌다.
        여유가 최대인 곳만 고르면 늘 같은 구석이 나오므로 <b>고르지 않는다</b>.
      </figcaption>
    </figure>
  );
}
window.MTClearanceViz = MTClearanceViz;

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
