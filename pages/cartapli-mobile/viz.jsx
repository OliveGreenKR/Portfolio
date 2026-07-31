// pages/cartapli-mobile/viz.jsx
// 이 페이지 전용 시각화 프리미티브. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 쓴다 (sage = 구조 개선, terra = DOTS/강조, ink-3 = 기준선).
//
// window 로 내보내는 것:
//   CMWaterfall   단계별 남은 비용 계단 차트 (구조 3 + DOTS 1 기여 분해)
//   CMBars        가로 막대 (수치 비교)
//   CMLineChart   회차별 곡선 (레이어 폭발 vs 삭제 후)
//   CMPipeline    측정 파이프라인 흐름 스트립
//   CMBranchViz   벤치 브랜치 = 엔진 얼림 + 인프라 오버레이
//   CMStackViz    레이어 스택 단면 — 파묻힘 삭제
//   CMRendererViz 레이어당 렌더러 N개 → 앞/뒤 2메시
//   CMBigDelta    큰 숫자 대비 (A → B)

/* ─── 단계별 남은 비용 계단 차트 ─────────────────────── */
function CMWaterfall({ steps, unit }) {
  const W = 760, H = 260;
  const padL = 46, padR = 16, padT = 46, padB = 54;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = Math.max(...steps.map(s => s.v));
  const bw = iw / steps.length;
  const barW = Math.min(76, bw * 0.52);
  const y = v => padT + ih - (v / max) * ih;
  const cx = i => padL + bw * i + bw / 2;

  const fill = k => (k === 'base' ? 'var(--rule-2)' : k === 'dots' ? 'var(--terra-300)' : 'var(--sage-300)');
  const stroke = k => (k === 'base' ? 'var(--ink-3)' : k === 'dots' ? 'var(--terra-500)' : 'var(--sage-500)');

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="단계별 남은 프레임당 CPU 비용 계단 차트">
        {/* baseline grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={padL} x2={W - padR} y1={padT + ih * t} y2={padT + ih * t}
                stroke="var(--rule)" strokeWidth="1" strokeDasharray={t === 1 ? '' : '3 4'} />
        ))}
        <text x={padL - 8} y={padT + 4} textAnchor="end" className="cm-svg-ax">{max.toFixed(2)}</text>
        <text x={padL - 8} y={padT + ih + 4} textAnchor="end" className="cm-svg-ax">0</text>

        {steps.map((s, i) => {
          const x = cx(i) - barW / 2;
          const top = y(s.v);
          const prev = i > 0 ? steps[i - 1] : null;
          return (
            <g key={s.k}>
              {/* drop connector from previous top */}
              {prev && (
                <line x1={cx(i - 1) + barW / 2} x2={x} y1={y(prev.v)} y2={y(prev.v)}
                      stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
              )}
              {prev && (
                <line x1={x} x2={x} y1={y(prev.v)} y2={top}
                      stroke={stroke(s.kind)} strokeWidth="1.5" />
              )}
              <rect x={x} y={top} width={barW} height={padT + ih - top}
                    fill={fill(s.kind)} stroke={stroke(s.kind)} strokeWidth="1" rx="2" />
              {/* value */}
              <text x={cx(i)} y={top - 8} textAnchor="middle" className="cm-svg-val">{s.t}</text>
              {/* delta */}
              {s.d && (
                <text x={cx(i)} y={top - 24} textAnchor="middle"
                      className={`cm-svg-delta ${s.kind}`}>{s.d}</text>
              )}
              {/* x label */}
              <text x={cx(i)} y={padT + ih + 20} textAnchor="middle" className="cm-svg-ax">{s.k}</text>
              <text x={cx(i)} y={padT + ih + 36} textAnchor="middle" className="cm-svg-sub">{s.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">
        남은 프레임당 비용 ({unit}). 막대 위 값은 <b>직전 단계 대비</b> 감소율.
        <span className="cm-legend"><i className="sw sage"></i>구조 개선</span>
        <span className="cm-legend"><i className="sw terra"></i>DOTS</span>
      </figcaption>
    </figure>
  );
}
window.CMWaterfall = CMWaterfall;

/* ─── 가로 막대 ──────────────────────────────────────── */
function CMBars({ title, unit, rows, accent }) {
  const max = Math.max(...rows.map(r => r.v));
  return (
    <div className={`cm-bars ${accent === 'terra' ? 'terra' : ''}`}>
      {title && (
        <div className="cm-bars-head">
          <span className="cm-bars-title">{title}</span>
          {unit && <span className="cm-bars-unit">{unit}</span>}
        </div>
      )}
      {rows.map((r, i) => (
        <div className={`cm-bar-row ${i === rows.length - 1 ? 'last' : ''}`} key={r.k}>
          <div className="cm-bar-k">{r.k}</div>
          <div className="cm-bar-track">
            <div className="cm-bar-fill" style={{ width: `${Math.max(0.6, (r.v / max) * 100)}%` }}></div>
          </div>
          <div className="cm-bar-v">{r.t}</div>
          {r.note && <div className="cm-bar-note">{r.note}</div>}
        </div>
      ))}
    </div>
  );
}
window.CMBars = CMBars;

/* ─── 회차별 곡선 ────────────────────────────────────── */
function CMLineChart({ series, yMax, xLabel, yLabel, caption }) {
  const W = 760, H = 300;
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
            <line x1={padL} x2={padL + iw} y1={y(t)} y2={y(t)}
                  stroke="var(--rule)" strokeDasharray={t === 0 ? '' : '3 4'} />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="cm-svg-ax">{t}</text>
          </g>
        ))}
        {[1, 4, 8, 12, 16].map(r => (
          <text key={r} x={x(r - 1)} y={padT + ih + 20} textAnchor="middle" className="cm-svg-ax">{r}</text>
        ))}
        <text x={padL + iw / 2} y={H - 6} textAnchor="middle" className="cm-svg-sub">{xLabel}</text>
        <text x={padL - 38} y={padT - 8} className="cm-svg-sub">{yLabel}</text>

        {series.map(s => {
          const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
          const area = `${padL},${y(0)} ${pts} ${x(s.values.length - 1)},${y(0)}`;
          const last = s.values[s.values.length - 1];
          return (
            <g key={s.k}>
              {s.area && <polygon points={area} fill={s.color} opacity="0.13" />}
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5"
                        strokeLinejoin="round" strokeLinecap="round" />
              {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill={s.color} />)}
              <text x={x(s.values.length - 1) + 10} y={y(last) + 4} className="cm-svg-end" fill={s.color}>
                {s.endLabel}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">{caption}</figcaption>
    </figure>
  );
}
window.CMLineChart = CMLineChart;

/* ─── 측정 파이프라인 스트립 ─────────────────────────── */
function CMPipeline({ steps, compact }) {
  return (
    <div className={`cm-pipe ${compact ? 'compact' : ''}`}>
      {steps.map((s, i) => (
        <React.Fragment key={s.name}>
          <div className={`cm-pipe-node ${s.kind || ''}`}>
            <span className="cm-pipe-kind">{s.kind === 'auto' ? 'AUTO' : s.kind === 'out' ? 'OUT' : 'RUN'}</span>
            <span className="cm-pipe-name">{s.name}</span>
            {!compact && s.sub && <span className="cm-pipe-sub">{s.sub}</span>}
          </div>
          {i < steps.length - 1 && <div className="cm-pipe-arrow">→</div>}
        </React.Fragment>
      ))}
    </div>
  );
}
window.CMPipeline = CMPipeline;

/* ─── 벤치 브랜치 = 엔진 얼림 + 인프라 오버레이 ──────── */
function CMBranchViz({ branches }) {
  return (
    <div className="cm-branch">
      <div className="cm-branch-src">
        <span className="cm-branch-src-k">main</span>
        <span className="cm-branch-src-t">인프라 (벤치 · 테스트 · 로깅)</span>
        <span className="cm-branch-src-s">계속 자란다 · 바뀌면 전 브랜치에 다시 덮어씀</span>
      </div>
      <div className="cm-branch-fan">
        {branches.map(b => (
          <div className="cm-branch-cell" key={b.k}>
            <span className="cm-branch-arrow">↓</span>
            <span className="cm-branch-k">{b.k}</span>
            <span className="cm-branch-engine">엔진 {b.commit}</span>
            <span className="cm-branch-note">{b.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
window.CMBranchViz = CMBranchViz;

/* ─── 레이어 스택 단면 — 파묻힘 삭제 ─────────────────── */
function CMStackViz() {
  const W = 700, H = 230;
  // [x0, w, buried]
  const before = [
    [0, 190, false], [40, 150, true], [20, 210, true], [70, 120, false],
    [10, 230, true], [50, 160, true], [0, 200, false],
  ];
  const after = before.filter(s => !s[2]);
  const slab = (s, i, total, ox, oy) => {
    const h = 15, gap = 8;
    const yy = oy + (total - 1 - i) * (h + gap);
    return (
      <g key={i}>
        <rect x={ox + s[0]} y={yy} width={s[1]} height={h} rx="2"
              fill={s[2] ? 'var(--terra-100)' : 'var(--sage-100)'}
              stroke={s[2] ? 'var(--terra-400)' : 'var(--sage-500)'}
              strokeWidth="1.2"
              strokeDasharray={s[2] ? '4 3' : ''} />
        {s[2] && (
          <text x={ox + s[0] + s[1] + 8} y={yy + 11} className="cm-svg-tag">파묻힘 → 삭제</text>
        )}
      </g>
    );
  };
  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="레이어 스택 단면 — 위·아래 모두 가려진 레이어를 삭제">
        <text x="8" y="18" className="cm-svg-lbl">삭제 전 — 위·아래 양쪽이 덮인 레이어가 섞여 있다</text>
        {before.map((s, i) => slab(s, i, before.length, 8, 34))}

        <line x1={W / 2 - 8} x2={W / 2 - 8} y1="10" y2={H - 10} stroke="var(--rule)" strokeDasharray="4 4" />

        <text x={W / 2 + 8} y="18" className="cm-svg-lbl">삭제 후 — 화면 결과는 같다</text>
        {after.map((s, i) => slab(s, i, after.length, W / 2 + 8, 34))}

        <text x="8" y={H - 8} className="cm-svg-sub">
          접으면 넘어간 조각의 위아래가 뒤집힌다. 양쪽이 다 덮여 있으면 서로 자리를 바꿀 뿐이라 몇 번을 접어도 드러나지 않는다.
        </text>
      </svg>
      <figcaption className="cm-figcap">
        판정은 <b>위·아래 양쪽</b>을 본다 — 한쪽만 보면 접었을 때 드러날 레이어까지 지우게 된다.
      </figcaption>
    </figure>
  );
}
window.CMStackViz = CMStackViz;

/* ─── 렌더러 구조 비교 ───────────────────────────────── */
function CMRendererViz() {
  const cells = Array.from({ length: 36 });
  return (
    <div className="cm-rend">
      <div className="cm-rend-side">
        <div className="cm-rend-h">S0 — 레이어 1장 = 렌더러 1개</div>
        <div className="cm-rend-grid">
          {cells.map((_, i) => <span key={i} className="cm-rend-dot"></span>)}
          <span className="cm-rend-more">… × 337</span>
        </div>
        <div className="cm-rend-note">GameObject + MeshFilter + MeshRenderer + Mesh 를 레이어마다</div>
        <div className="cm-rend-metric">드로우콜 <b>+298</b></div>
      </div>
      <div className="cm-rend-arrow">→</div>
      <div className="cm-rend-side to">
        <div className="cm-rend-h">S2-a — 앞/뒤 메시 2개 고정</div>
        <div className="cm-rend-two">
          <span className="cm-rend-mesh front">앞면 메시</span>
          <span className="cm-rend-mesh back">뒷면 메시</span>
        </div>
        <div className="cm-rend-note">전 레이어 폴리곤을 <code>IsFolded</code> 로 갈라 이어붙임 · 쌓임 순서는 정점 z · 가림은 z-buffer</div>
        <div className="cm-rend-metric ok">드로우콜 <b>+1</b></div>
      </div>
    </div>
  );
}
window.CMRendererViz = CMRendererViz;

/* ─── 16회차 프레임 분해 — 가장 비싼 프레임은 중간이다 ─ */
function CMFrameViz() {
  const frames = [
    { f: 1, ms: 4.09,  cross: 0 },    { f: 2, ms: 3.53,  cross: 0 },
    { f: 3, ms: 3.04,  cross: 0 },    { f: 4, ms: 4.09,  cross: 0 },
    { f: 5, ms: 9.21,  cross: 0 },    { f: 6, ms: 80.96, cross: 3195 },
    { f: 7, ms: 17.75, cross: 1775 }, { f: 8, ms: 9.0,   cross: 1775 },
  ];
  const W = 720, H = 210, padL = 44, padR = 20, padT = 34, padB = 46;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = 85, bw = iw / frames.length, barW = bw * 0.56;
  const y = v => padT + ih - (v / max) * ih;

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="16회차 프레임별 소요 시간 — 6번 프레임이 압도적">
        <line x1={padL} x2={W - padR} y1={padT + ih} y2={padT + ih} stroke="var(--rule)" />
        <text x={padL - 8} y={padT + 4} textAnchor="end" className="cm-svg-ax">80ms</text>
        {frames.map((fr, i) => {
          const x = padL + bw * i + (bw - barW) / 2;
          const hot = fr.ms > 40;
          return (
            <g key={fr.f}>
              <rect x={x} y={y(fr.ms)} width={barW} height={padT + ih - y(fr.ms)} rx="2"
                    fill={hot ? 'var(--terra-300)' : 'var(--sage-200)'}
                    stroke={hot ? 'var(--terra-500)' : 'var(--sage-500)'} />
              <text x={x + barW / 2} y={y(fr.ms) - 7} textAnchor="middle" className="cm-svg-val">
                {fr.ms.toFixed(fr.ms > 20 ? 1 : 0)}
              </text>
              <text x={x + barW / 2} y={padT + ih + 18} textAnchor="middle" className="cm-svg-ax">f{fr.f}</text>
              <text x={x + barW / 2} y={padT + ih + 32} textAnchor="middle" className="cm-svg-sub">
                {fr.cross ? `걸침 ${fr.cross.toLocaleString()}` : '통과'}
              </text>
            </g>
          );
        })}
        <text x={padL} y={18} className="cm-svg-lbl">선이 종이에 닿기 전 (전량 통과) — S1-1 이 사실상 공짜로 만든 구간</text>
        <text x={W - padR} y={y(80.96) - 24} textAnchor="end" className="cm-svg-tag">
          뷰 풀 4,186 → 6,461 (2,275세트 신규 생성)
        </text>
      </svg>
      <figcaption className="cm-figcap">
        <b>가장 비싼 프레임은 최종이 아니라 중간(f6)이다.</b> 잠정 레이어 6,461장이 최종 5,041장보다 28% 많다.
      </figcaption>
    </figure>
  );
}
window.CMFrameViz = CMFrameViz;

/* ─── 잡 출력 자리 사전 배정 = 결정론 ────────────────── */
function CMJobViz() {
  const W = 720, H = 210;
  const layers = [
    { n: 0, cap: 5 }, { n: 1, cap: 4 }, { n: 2, cap: 6 }, { n: 3, cap: 4 },
  ];
  const unit = 24, x0 = 20, yBuf = 118, hBuf = 30;
  let cursor = x0;
  const segs = layers.map(l => {
    const wFixed = l.cap * unit, wFlip = l.cap * unit;
    const s = { ...l, xf: cursor, wf: wFixed, xl: cursor + wFixed, wl: wFlip };
    cursor += wFixed + wFlip;
    return s;
  });
  const colors = ['var(--sage-200)', 'var(--sage-300)', 'var(--sage-200)', 'var(--sage-300)'];

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="레이어별 출력 슬롯 사전 배정 — 스레드 간 겹침 없음">
        <text x={x0} y="18" className="cm-svg-lbl">레이어 (병렬 실행 — 순서 보장 없음)</text>
        {segs.map((s, i) => (
          <g key={s.n}>
            <rect x={s.xf} y="30" width={s.wf + s.wl} height="26" rx="3"
                  fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={s.xf + (s.wf + s.wl) / 2} y="47" textAnchor="middle" className="cm-svg-ax">
              레이어 {s.n}
            </text>
            <line x1={s.xf + (s.wf + s.wl) / 2} x2={s.xf + (s.wf + s.wl) / 2} y1="58" y2={yBuf - 4}
                  stroke={colors[i]} strokeWidth="2" markerEnd="" />
            <polygon points={`${s.xf + (s.wf + s.wl) / 2 - 4},${yBuf - 8} ${s.xf + (s.wf + s.wl) / 2 + 4},${yBuf - 8} ${s.xf + (s.wf + s.wl) / 2},${yBuf - 1}`}
                     fill={colors[i]} />
          </g>
        ))}

        <text x={x0} y={yBuf - 14} className="cm-svg-sub">SlotStarts[i] 로 미리 배정된 구간에만 쓴다</text>
        {segs.map((s, i) => (
          <g key={`b${s.n}`}>
            <rect x={s.xf} y={yBuf} width={s.wf} height={hBuf} fill={colors[i]} stroke="var(--sage-500)" />
            <rect x={s.xl} y={yBuf} width={s.wl} height={hBuf} fill="var(--paper)" stroke="var(--sage-500)" strokeDasharray="3 2" />
            <text x={s.xf + s.wf / 2} y={yBuf + 19} textAnchor="middle" className="cm-svg-sub">제자리</text>
            <text x={s.xl + s.wl / 2} y={yBuf + 19} textAnchor="middle" className="cm-svg-sub">넘어감</text>
          </g>
        ))}
        <rect x={x0} y={yBuf} width={cursor - x0} height={hBuf} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={x0} y={yBuf + hBuf + 20} className="cm-svg-lbl">
          OutVertices — 단일 NativeArray. 칸 크기 = 정점 수 + SlotMargin
        </text>
        <text x={x0} y={yBuf + hBuf + 36} className="cm-svg-sub">
          볼록을 직선으로 자르면 조각 정점은 n+1 을 넘지 않는다 → 칸 크기를 미리 정할 수 있다
        </text>
      </svg>
      <figcaption className="cm-figcap">
        구간이 겹치지 않으므로 <b>경쟁이 없고, 결과 순서가 스레드 속도와 무관하게 결정된다.</b>
        쌓임 순서가 곧 종이의 앞뒤라서 이 결정성이 필수다.
      </figcaption>
    </figure>
  );
}
window.CMJobViz = CMJobViz;

/* ─── 사이클 사슬 — 결과가 다음 관측을 만든다 ────────── */
function CMChainViz({ rows, caption }) {
  const ri = window.renderInline;
  return (
    <figure className="cm-figure chain">
      <div className="cm-chain">
        <div className="cm-chain-head">
          <span></span><span>관측 — 무엇이 보였나</span><span>처방 — 무엇을 했나</span><span>결과</span>
        </div>
        {rows.map((r, i) => (
          <div className={`cm-chain-row ${i === 0 ? 'base' : ''}`} key={r.k}>
            <span className="cm-chain-k">{r.k}</span>
            <span className="cm-chain-o">{ri(r.observe)}</span>
            <span className="cm-chain-f">{ri(r.fix)}</span>
            <span className="cm-chain-r">{ri(r.out)}</span>
          </div>
        ))}
      </div>
      <figcaption className="cm-figcap">{caption}</figcaption>
    </figure>
  );
}
window.CMChainViz = CMChainViz;

/* ─── 큰 숫자 대비 ───────────────────────────────────── */
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
