// pages/cartapli-mobile/viz.jsx
// 이 페이지가 쓰는 그림은 둘뿐이다 (§03 분량 배분: 그림 2).
//   CMSlotViz   — 출력 버퍼 슬롯 배정 (S6). 대신하는 문장 = data.js s6.vizCaption
//   CMStageBars — 단계별 기여 (S8).     대신하는 문장 = data.js s8.caption
//
// SVG 글자는 12px 아래로 내리지 않는다. page.css 가 figure 를 가로 스크롤로 두고
// svg{min-width:560px} 을 걸어 두므로 390px 폰에서 배율은 0.78 — 12px → 9.4px 로 남는다.
// (viewBox 를 폰 폭까지 줄이면 11px 글자가 4~5px 로 떨어져 유실된다)

/* ── 그림 ① 출력 버퍼 슬롯 배정 ─────────────────────────────────────────── */
// 배치 상수 — 총폭 검산: BUF_X(112) + CELL_W(96) × 6 = 688 ≤ viewBox 720 ✓
const CM_BUF_X = 112;
const CM_CELL_W = 96;
const CM_PAIRS = 3;

function CMSlotViz() {
  const cells = [];
  for (let i = 0; i < CM_PAIRS; i++) {
    const x = CM_BUF_X + i * CM_CELL_W * 2;
    cells.push({ i, x, cx: x + CM_CELL_W });
  }
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 268" role="img" aria-label="출력 버퍼가 레이어별 두 칸으로 미리 나뉘어 있고 각 잡 스레드가 자기 칸에만 쓰는 구조">
        {/* 행 라벨 */}
        <text className="cm-svg-lbl" x="8" y="60">잡 스레드</text>
        <text className="cm-svg-lbl" x="8" y="176">출력 버퍼</text>

        {/* 스레드 박스 */}
        {cells.map(c => (
          <g key={`t${c.i}`}>
            <rect className="cm-svg-box" x={c.cx - 76} y="34" width="152" height="40" rx="3" />
            <text className="cm-svg-txt" x={c.cx} y="59" textAnchor="middle">레이어 {c.i} 분할</text>
            <line className="cm-svg-arrow" x1={c.cx} y1="76" x2={c.cx} y2="146" markerEnd="url(#cmArrow)" />
          </g>
        ))}

        {/* 버퍼 칸 */}
        {cells.map(c => (
          <g key={`b${c.i}`}>
            <rect className="cm-svg-cell fixed" x={c.x} y="150" width={CM_CELL_W} height="46" />
            <rect className="cm-svg-cell flip" x={c.x + CM_CELL_W} y="150" width={CM_CELL_W} height="46" />
            <text className="cm-svg-cap" x={c.x + CM_CELL_W / 2} y="178" textAnchor="middle">제자리</text>
            <text className="cm-svg-cap" x={c.x + CM_CELL_W * 1.5} y="178" textAnchor="middle">넘어감</text>
            <line className="cm-svg-sep" x1={c.x} y1="150" x2={c.x} y2="196" />
            <text className="cm-svg-slot" x={c.x + 4} y="214">SlotStarts[{c.i}]</text>
          </g>
        ))}
        <rect className="cm-svg-bufline" x={CM_BUF_X} y="150" width={CM_CELL_W * 2 * CM_PAIRS} height="46" />

        {/* 레이어별 구간 — 서로 겹치지 않는다 */}
        {cells.map(c => (
          <g key={`s${c.i}`}>
            <line className="cm-svg-span" x1={c.x} y1="232" x2={c.x + CM_CELL_W * 2} y2="232" />
            <text className="cm-svg-cap" x={c.cx} y="252" textAnchor="middle">레이어 {c.i}의 몫</text>
          </g>
        ))}

        <defs>
          <marker id="cmArrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s6.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMSlotViz = CMSlotViz;

/* ── 그림 ② 단계별 기여 ─────────────────────────────────────────────────── */
// 배치 상수 — 총폭 검산: BAR_MAX(600) + 값 라벨 폭(≈108) = 708 ≤ viewBox 720 ✓
const CM_BAR_MAX = 600;
const CM_ROW_H = 64;
const CM_ROW_TOP = 34;

function CMStageBars() {
  const { bars, legend, unitNote } = window.CM_DATA.s8.chart;
  const h = CM_ROW_TOP + bars.length * CM_ROW_H + 4;
  return (
    <figure className="cm-fig">
      <svg viewBox={`0 0 720 ${h}`} role="img" aria-label="단계별 프레임당 마커 합. S0 을 100 으로 두었을 때 S1-1 58.1, S1-2 25.6, S2-b 6.2">
        {/* 범례 — 항목당 96px 슬롯 */}
        {legend.map((l, i) => (
          <g key={l.group}>
            <rect className={`cm-bar ${l.group}`} x={i * 96} y="6" width="12" height="12" />
            <text className="cm-svg-cap" x={i * 96 + 18} y="16">{l.label}</text>
          </g>
        ))}
        <text className="cm-svg-cap dim" x="612" y="16">{unitNote}</text>

        {bars.map((b, i) => {
          const top = CM_ROW_TOP + i * CM_ROW_H;
          const w = Math.max(2, (b.pct / 100) * CM_BAR_MAX);
          return (
            <g key={b.stage}>
              <text className="cm-svg-txt" x="0" y={top + 12}>
                <tspan className="cm-svg-stage">{b.stage}</tspan>
                <tspan dx="10">{b.name}</tspan>
              </text>
              <line className="cm-svg-base" x1="0" y1={top + 44} x2={CM_BAR_MAX} y2={top + 44} />
              <rect className={`cm-bar ${b.group}`} x="0" y={top + 22} width={w} height="22" />
              <text className="cm-svg-val" x="612" y={top + 39}>
                <tspan className="cm-svg-pct">{b.pct}</tspan>
                <tspan dx="8" className="cm-svg-delta">{b.delta}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s8.caption)}</figcaption>
    </figure>
  );
}
window.CMStageBars = CMStageBars;

/* ── S7 재측정 전후 수치 쌍 (그림 아님 — 텍스트 블록의 일부) ─────────────── */
function CMDelta({ d }) {
  const ri = window.renderInline;
  return (
    <div className="cm-delta">
      <div className="cm-delta-lbl">{d.label}</div>
      <div className="cm-delta-row">
        <span className="cm-delta-cell was"><b>{d.before.v}</b><i>{d.before.k}</i></span>
        <span className="cm-delta-ar">→</span>
        <span className="cm-delta-cell now"><b>{d.after.v}</b><i>{d.after.k}</i></span>
      </div>
      <p className="cm-delta-note">{ri(d.note)}</p>
    </div>
  );
}
window.CMDelta = CMDelta;
