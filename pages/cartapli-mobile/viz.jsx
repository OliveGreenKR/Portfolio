// pages/cartapli-mobile/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 (sage = 개선/현재, terra = 문제/이전, ink-3 = 기준).
//
// 규칙: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//   캡션으로 요약되지 않는 그림은 넣지 않는다 (본문과 안 맞는 자료는 이해를 방해한다).

/* ─── 단계별 남은 비용 계단 차트 ─────────────────────── */
function CMWaterfall({ steps, unit }) {
  const W = 760, H = 250;
  const padL = 46, padR = 16, padT = 42, padB = 52;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = Math.max(...steps.map(s => s.v));
  const bw = iw / steps.length;
  const barW = Math.min(84, bw * 0.54);
  const y = v => padT + ih - (v / max) * ih;
  const cx = i => padL + bw * i + bw / 2;
  const fill = k => (k === 'base' ? 'var(--terra-100)' : k === 'dots' ? 'var(--sage-300)' : 'var(--sage-300)');
  const stroke = k => (k === 'base' ? 'var(--terra-400)' : 'var(--sage-500)');

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="사이클별 남은 프레임당 CPU 비용">
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={padL} x2={W - padR} y1={padT + ih * t} y2={padT + ih * t}
                stroke="var(--rule)" strokeDasharray={t === 1 ? '' : '3 4'} />
        ))}
        <text x={padL - 8} y={padT + 4} textAnchor="end" className="cm-svg-ax">{max.toFixed(2)}</text>
        <text x={padL - 8} y={padT + ih + 4} textAnchor="end" className="cm-svg-ax">0</text>

        {steps.map((s, i) => {
          const x = cx(i) - barW / 2, top = y(s.v), prev = i > 0 ? steps[i - 1] : null;
          return (
            <g key={s.k}>
              {prev && <line x1={cx(i - 1) + barW / 2} x2={x} y1={y(prev.v)} y2={y(prev.v)}
                             stroke="var(--ink-3)" strokeDasharray="3 3" />}
              {prev && <line x1={x} x2={x} y1={y(prev.v)} y2={top} stroke={stroke(s.kind)} strokeWidth="1.5" />}
              <rect x={x} y={top} width={barW} height={padT + ih - top}
                    fill={fill(s.kind)} stroke={stroke(s.kind)} rx="2" />
              <text x={cx(i)} y={top - 9} textAnchor="middle" className="cm-svg-val">{s.t}</text>
              {s.d && <text x={cx(i)} y={top - 27} textAnchor="middle" className="cm-svg-delta big">{s.d}</text>}
              <text x={cx(i)} y={padT + ih + 20} textAnchor="middle" className="cm-svg-ax">{s.k}</text>
              <text x={cx(i)} y={padT + ih + 36} textAnchor="middle" className="cm-svg-sub">{s.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">
        {`막대 바로 위 = 그 시점에 남아 있는 비용 (${unit}). 그 위 큰 글씨 = 직전 대비 감소율. `}
        뒤로 갈수록 막대가 작은 것은 <b>남은 비용 자체가 이미 작아졌기 때문</b>이고, 감소율은 그와 별개로 계속 크다.
      </figcaption>
    </figure>
  );
}
window.CMWaterfall = CMWaterfall;

/* ─── 회차별 곡선 ────────────────────────────────────── */
function CMLineChart({ series, yMax, xLabel, yLabel, caption }) {
  const W = 760, H = 290;
  const padL = 54, padR = 96, padT = 24, padB = 44;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = Math.max(...series.map(s => s.values.length));
  const x = i => padL + (i / (n - 1)) * iw;
  const y = v => padT + ih - (v / yMax) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(yMax * t));

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img" aria-label={caption}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={padL} x2={padL + iw} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeDasharray={t === 0 ? '' : '3 4'} />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="cm-svg-ax">{t}</text>
          </g>
        ))}
        {[1, 4, 8, 12, 16].map(r => (
          <text key={r} x={x(r - 1)} y={padT + ih + 20} textAnchor="middle" className="cm-svg-ax">{r}</text>
        ))}
        <text x={padL + iw / 2} y={H - 6} textAnchor="middle" className="cm-svg-sub">{xLabel}</text>
        <text x={padL - 40} y={padT - 8} className="cm-svg-sub">{yLabel}</text>

        {series.map(s => {
          const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
          const last = s.values[s.values.length - 1];
          return (
            <g key={s.k}>
              {s.area && <polygon points={`${padL},${y(0)} ${pts} ${x(s.values.length - 1)},${y(0)}`} fill={s.color} opacity="0.13" />}
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
              {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill={s.color} />)}
              <text x={x(s.values.length - 1) + 10} y={y(last) + 4} className="cm-svg-end" fill={s.color}>{s.endLabel}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">{caption}</figcaption>
    </figure>
  );
}
window.CMLineChart = CMLineChart;

/* ─── 이전 ↔ 현재 비교 ──────────────────────────────── */
function CMCompare({ rows }) {
  const ri = window.renderInline;
  return (
    <div className="cm-cmp">
      <div className="cm-cmp-head">
        <span></span><span>이전</span><span>현재</span>
      </div>
      {rows.map(r => (
        <div className="cm-cmp-row" key={r.k}>
          <span className="cm-cmp-k">{r.k}<span className="cm-cmp-cy">{r.cy}</span></span>
          <span className="cm-cmp-was">{ri(r.was)}</span>
          <span className="cm-cmp-is">{ri(r.is)}</span>
        </div>
      ))}
    </div>
  );
}
window.CMCompare = CMCompare;

/* ─── 가려진 겹을 찾는 방법 ──────────────────────────── */
/* "어떻게 적게 만드는가" 를 그림 하나로 — 위에서 훑고, 아래에서 훑고, 둘 다 0이면 지운다 */
function CMBuriedViz() {
  const W = 720, H = 268;
  // [x, w, 위에서 보이는 넓이(0~1), 아래에서 보이는 넓이(0~1)]
  const layers = [
    [10, 200, 1.0, 0.0], [50, 140, 0.0, 0.0], [30, 190, 0.0, 0.0],
    [80, 110, 0.35, 0.0], [20, 210, 0.0, 0.0], [60, 130, 0.0, 0.55], [0, 180, 0.0, 1.0],
  ];
  const h = 18, gap = 12, ox = 16, oy = 58;
  const colTop = 250, colBot = 322, colW = 56;
  const yOf = i => oy + (layers.length - 1 - i) * (h + gap);
  const buried = l => l[2] === 0 && l[3] === 0;
  const kept = layers.filter(l => !buried(l));
  const rx = 500;

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="가려진 겹을 찾아 지우는 방법">
        <text x={ox} y="20" className="cm-svg-lbl">종이 단면 (아래에서 위로 쌓인 겹)</text>
        <text x={colTop} y="20" className="cm-svg-sub">위에서 본</text>
        <text x={colBot} y="20" className="cm-svg-sub">아래에서 본</text>
        <text x={colTop} y="36" className="cm-svg-sub">안 덮인 넓이</text>
        <text x={colBot} y="36" className="cm-svg-sub">안 덮인 넓이</text>

        {layers.map((l, i) => {
          const y = yOf(i), b = buried(l);
          return (
            <g key={i}>
              <rect x={ox + l[0]} y={y} width={l[1]} height={h} rx="2"
                    fill={b ? 'var(--terra-50)' : 'var(--sage-100)'}
                    stroke={b ? 'var(--terra-400)' : 'var(--sage-500)'}
                    strokeDasharray={b ? '4 3' : ''} />
              <rect x={colTop} y={y + 4} width={colW} height="10" fill="var(--paper-2)" stroke="var(--rule)" />
              <rect x={colTop} y={y + 4} width={colW * l[2]} height="10" fill="var(--sage-500)" />
              <rect x={colBot} y={y + 4} width={colW} height="10" fill="var(--paper-2)" stroke="var(--rule)" />
              <rect x={colBot} y={y + 4} width={colW * l[3]} height="10" fill="var(--sage-500)" />
              {b && <text x={colBot + colW + 8} y={y + 14} className="cm-svg-tag">둘 다 0 → 삭제</text>}
            </g>
          );
        })}

        <line x1={rx - 20} x2={rx - 20} y1="10" y2={oy + layers.length * (h + gap) - gap} stroke="var(--rule)" strokeDasharray="4 4" />
        <text x={rx} y="20" className="cm-svg-lbl">삭제 후 — 화면 결과 동일</text>
        {kept.map((l, i) => (
          <rect key={i} x={rx + l[0] * 0.4} y={oy + (kept.length - 1 - i) * (h + gap)} width={l[1] * 0.7} height={h}
                rx="2" fill="var(--sage-100)" stroke="var(--sage-500)" />
        ))}
      </svg>
      <figcaption className="cm-figcap">
        위·아래 <b>양쪽</b>에서 모두 안 보이는 겹만 지운다. 한쪽만 보면 접었을 때 드러날 겹까지 지우게 된다.
      </figcaption>
    </figure>
  );
}
window.CMBuriedViz = CMBuriedViz;

/* ─── 화면 객체 수 ───────────────────────────────────── */
function CMRendererViz() {
  const cells = Array.from({ length: 30 });
  return (
    <figure className="cm-figure plain">
      <div className="cm-rend">
        <div className="cm-rend-side">
          <div className="cm-rend-h">이전 — 겹 1장마다 화면 객체 1개</div>
          <div className="cm-rend-grid">
            {cells.map((_, i) => <span key={i} className="cm-rend-dot"></span>)}
            <span className="cm-rend-more">… 총 77개</span>
          </div>
          <div className="cm-rend-metric">그리기 호출 <b>+71</b></div>
        </div>
        <div className="cm-rend-arrow">→</div>
        <div className="cm-rend-side to">
          <div className="cm-rend-h">현재 — 앞뒤 두 덩어리로 고정</div>
          <div className="cm-rend-two">
            <span className="cm-rend-mesh front">앞면</span>
            <span className="cm-rend-mesh back">뒷면</span>
          </div>
          <div className="cm-rend-metric ok">그리기 호출 <b>+1</b></div>
        </div>
      </div>
      <figcaption className="cm-figcap">
        그리는 도형의 양은 그대로다. <b>바뀐 것은 그것을 몇 덩어리로 나눠 보내느냐뿐이다.</b>
      </figcaption>
    </figure>
  );
}
window.CMRendererViz = CMRendererViz;

/* ─── 잡 출력 자리 사전 배정 ─────────────────────────── */
function CMJobViz() {
  const W = 720, H = 190;
  const caps = [5, 4, 6, 4];
  // ⚠️ cursor = x0 + Σ(cap × unit × 2) 가 W 를 넘으면 .cm-figure{overflow:hidden} 에 잘린다.
  //    19 × 16 × 2 + 20 = 628 < 720.
  const unit = 16, x0 = 20, yBuf = 104, hBuf = 30;
  let cursor = x0;
  const segs = caps.map((cap, n) => {
    const w = cap * unit;
    const s = { n, xf: cursor, wf: w, xl: cursor + w, wl: w };
    cursor += w * 2;
    return s;
  });
  const colors = ['var(--sage-200)', 'var(--sage-300)', 'var(--sage-200)', 'var(--sage-300)'];

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="레이어별 출력 자리를 미리 배정해 스레드끼리 겹치지 않게 한다">
        <text x={x0} y="18" className="cm-svg-lbl">겹마다 따로 계산 — 여러 코어가 동시에, 끝나는 순서는 제각각</text>
        {segs.map((s, i) => (
          <g key={s.n}>
            <rect x={s.xf} y="28" width={s.wf + s.wl} height="24" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={s.xf + (s.wf + s.wl) / 2} y="44" textAnchor="middle" className="cm-svg-ax">겹 {s.n}</text>
            <line x1={s.xf + (s.wf + s.wl) / 2} x2={s.xf + (s.wf + s.wl) / 2} y1="54" y2={yBuf - 8}
                  stroke={colors[i]} strokeWidth="2" />
            <polygon points={`${s.xf + (s.wf + s.wl) / 2 - 4},${yBuf - 8} ${s.xf + (s.wf + s.wl) / 2 + 4},${yBuf - 8} ${s.xf + (s.wf + s.wl) / 2},${yBuf - 1}`} fill={colors[i]} />
          </g>
        ))}
        {segs.map((s, i) => (
          <g key={`b${s.n}`}>
            <rect x={s.xf} y={yBuf} width={s.wf} height={hBuf} fill={colors[i]} stroke="var(--sage-500)" />
            <rect x={s.xl} y={yBuf} width={s.wl} height={hBuf} fill="var(--paper)" stroke="var(--sage-500)" strokeDasharray="3 2" />
            <text x={s.xf + s.wf / 2} y={yBuf + 19} textAnchor="middle" className="cm-svg-sub">제자리</text>
            <text x={s.xl + s.wl / 2} y={yBuf + 19} textAnchor="middle" className="cm-svg-sub">넘어감</text>
          </g>
        ))}
        <rect x={x0} y={yBuf} width={cursor - x0} height={hBuf} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={x0} y={yBuf + hBuf + 22} className="cm-svg-lbl">미리 잡아둔 메모리 — 겹마다 자기 칸이 정해져 있다</text>
      </svg>
      <figcaption className="cm-figcap">
        칸 너비가 겹마다 다른 것은 겹의 꼭짓점 수가 다르기 때문이다.
        <b> 어느 겹이 어디에 쓸지는 계산이 시작되기 전에 이미 정해져 있다.</b>
      </figcaption>
    </figure>
  );
}
window.CMJobViz = CMJobViz;

/* ─── 큰 숫자 3칸 ────────────────────────────────────── */
function CMBigDelta({ items }) {
  return (
    <div className="cm-bigs">
      {items.map(it => (
        <div className="cm-big" key={it.label}>
          <div className="cm-big-n">{it.n}</div>
          <div className="cm-big-l">{it.label}</div>
          <div className="cm-big-s">{window.renderInline(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.CMBigDelta = CMBigDelta;
