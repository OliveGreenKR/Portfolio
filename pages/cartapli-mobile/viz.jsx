// pages/cartapli-mobile/viz.jsx
// 이 페이지가 쓰는 그림은 여덟이다 (§03 2026-08-15 분량 배분: 그림 8).
//   1 CMStageBars      단계별 기여 (S3)   · 대신하는 문장 = data.js s3.caption
//   2 CMMapViz         네 방식 지도 (S4)  · s4.vizCaption   ← 가로축이 프레임 두 종류를 겸한다
//   3 CMDiagnoseViz    진단 (S5)          · s5.vizCaption
//   4 CMReuseViz       ① 재사용 (S6)      · s6.vizCaption
//   5 CMPruneViz       ② 버리기 (S7)        · s7.vizCaption
//   6 CMRenderStructViz ③ 병합 (S8)       · s8.vizCaption
//   7 CMSlotViz        ④ 슬롯 배정 (S9)   · s9.vizCaption
//   8 CMPolicyCompareViz ⑥ 세 방식 비교 (S11) · s11.compareCaption
//   9 CMConvexSubViz   ⑥ 채택한 방식의 기전 (S11) · s11.vizCaption
// S10(⑤ 재측정)에는 그림이 없다 — 고친 것이 계측기라 기존→개선으로 그릴 형상이 없다(§03 결정).
//
// 그림이 아닌 것 — CMCodePair(코드 쌍) · CMDelta(재측정 전후 수치 쌍).
//
// SVG 글자는 12px 아래로 내리지 않는다. page.css 가 figure 를 가로 스크롤로 두고
// svg{min-width:560px} 을 걸어 두므로 390px 폰에서 배율은 0.78 — 12px → 9.4px 로 남는다.
// (viewBox 를 폰 폭까지 줄이면 11px 글자가 4~5px 로 떨어져 유실된다)

/* ── 코드 쌍 (그림 아님) ─────────────────────────────────────────────────────
   before/after 를 **위아래로** 쌓는다. 좌우 2열로 두면 한 칸이 36ch 로 좁아져
   PaperFoldSplitPipeline 급 식별자가 가로 스크롤을 만든다(§2 함정표).
   위아래면 폭이 AsciiBlock 과 같고, 읽는 순서도 시간 순과 맞는다. */
function CMCodePair({ p }) {
  const hl = window.highlightCode;
  const panel = (kind, o) => (
    <div className={`cm-pair-panel ${kind}`}>
      <div className="cm-pair-lbl">
        <span className="tag">{kind === 'was' ? '이전' : '이후'}</span>
        <span className="ref">{o.ref}</span>
      </div>
      {hl
        ? <pre dangerouslySetInnerHTML={{ __html: hl(o.code, 'csharp') }} />
        : <pre>{o.code}</pre>}
    </div>
  );
  return (
    <div className="cm-pair">
      <div className="cm-pair-head">
        <span>CODE</span>
        <span className="lbl">{p.file}</span>
        <span className="commit">{p.commit}</span>
      </div>
      {p.intro && <div className="cm-pair-intro">{p.intro}</div>}
      {panel('was', p.before)}
      {panel('now', p.after)}
      {p.result && <div className="cm-pair-result">→ {p.result}</div>}
    </div>
  );
}
window.CMCodePair = CMCodePair;

/* ── 1. 단계별 기여 (S3) ─────────────────────────────────────────────────── */
// 배치 상수 — 총폭 검산: BAR_MAX(600) + 값 라벨 폭(≈108) = 708 ≤ viewBox 720 ✓
// 범례 슬롯은 150 — 가장 긴 "Burst 잡으로 옮긴 몫"(≈130px)이 다음 색칩을 안 덮어야 한다
const CM_BAR_MAX = 600;
const CM_ROW_H = 64;
const CM_ROW_TOP = 34;

function CMStageBars() {
  const { bars, legend, unitNote } = window.CM_DATA.s3.chart;
  const h = CM_ROW_TOP + bars.length * CM_ROW_H + 4;
  return (
    <figure className="cm-fig">
      <svg viewBox={`0 0 720 ${h}`} role="img" aria-label="단계별 프레임당 마커 합. S0 을 100 으로 두었을 때 S1-1 58.1, S1-2 25.6, S2-a 9.7, S2-b 6.2">
        {/* 범례 — 항목당 96px 슬롯 */}
        {legend.map((l, i) => (
          <g key={l.group}>
            <rect className={`cm-bar ${l.group}`} x={i * 150} y="6" width="12" height="12" />
            <text className="cm-svg-cap" x={i * 150 + 18} y="16">{l.label}</text>
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
              <text className="cm-svg-val" x="612" y={top + 33}>
                <tspan className="cm-svg-pct">{b.pct}</tspan>
                <tspan dx="8" className="cm-svg-delta">{b.delta}</tspan>
              </text>
              <text className="cm-svg-cap" x="612" y={top + 50}>{b.ms} ms</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s3.caption)}</figcaption>
    </figure>
  );
}
window.CMStageBars = CMStageBars;

/* ── 2. 네 방식 지도 (S4) ────────────────────────────────────────────────── */
// 가로축이 프레임 두 종류를 겸한다 — 별도 타임라인 그림 한 칸을 여기서 흡수했다(§03 결정).
// 배치 검산: 확정 영역 462 + 242 = 704 ≤ viewBox 720 ✓
// ⚠️ 2026-08-15 축 교체 — 옛 축(보간/확정 프레임)은 **사실이 아니었다.**
//    ④는 확정에서도 같은 잡을 쓰고, ②는 확정 때 일어나지만 효과가 그 뒤 모든 프레임에 걸린다.
// 배치 검산: 변경 상자 266 + 438 = 704 ≤ viewBox 720 ✓
const CM_MAP_AXIS_X = 26, CM_MAP_BOX_X = 266, CM_MAP_BOX_W = 438;
const CM_MAP_TOP = 40, CM_MAP_ROW_H = 54;

function CMMapViz() {
  const m = window.CM_DATA.s4.map;
  const rows = m.rows, after = m.after;
  const gridBottom = CM_MAP_TOP + rows.length * CM_MAP_ROW_H;
  const afterTop = gridBottom + 32;
  const h = afterTop + after.length * 40 + 6;      // 검산: 40+216+32+80+6 = 374
  return (
    <figure className="cm-fig">
      <svg viewBox={`0 0 720 ${h}`} role="img"
           aria-label="네 변경이 각각 무엇을 줄였는지 — 같은 일을 다시 하기, 레이어 장수, 레이어당 유니티 객체, 프레임마다 새로 만들던 관리형 객체. 아래 두 칸은 단계가 아닌 후속이다">
        <text className="cm-svg-lbl" x={CM_MAP_AXIS_X} y="16">{m.axisLabel}</text>
        <text className="cm-svg-lbl" x={CM_MAP_BOX_X} y="16">그래서 무엇을 했나</text>
        <line className="cm-svg-base" x1="0" y1="24" x2="704" y2="24" />

        {rows.map((r, i) => {
          const top = CM_MAP_TOP + i * CM_MAP_ROW_H;
          return (
            <g key={r.n}>
              <text className="cm-svg-num" x="0" y={top + 26}>{r.n}</text>
              <text className="cm-svg-txt" x={CM_MAP_AXIS_X} y={top + 26}>{r.axis}</text>
              <rect className="cm-svg-box" x={CM_MAP_BOX_X} y={top} width={CM_MAP_BOX_W} height="44" rx="3" />
              <text className="cm-svg-txt" x={CM_MAP_BOX_X + 14} y={top + 19}>{r.title}</text>
              <text className="cm-svg-cap" x={CM_MAP_BOX_X + 14} y={top + 36}>{r.what}</text>
              {i < rows.length - 1 && <line className="cm-svg-span" x1="0" y1={top + 48} x2="704" y2={top + 48} />}
            </g>
          );
        })}

        <line className="cm-svg-span" x1="0" y1={gridBottom + 10} x2="704" y2={gridBottom + 10} strokeDasharray="4 4" />
        <text className="cm-svg-lbl" x={CM_MAP_AXIS_X} y={gridBottom + 26}>{m.afterLabel}</text>
        {after.map((r, i) => {
          const top = afterTop + i * 40;
          return (
            <g key={r.n}>
              <text className="cm-svg-num dim" x="0" y={top + 21}>{r.n}</text>
              <rect className="cm-svg-box dim" x={CM_MAP_AXIS_X} y={top} width={704 - CM_MAP_AXIS_X} height="32" rx="3" />
              <text className="cm-svg-cap" x={CM_MAP_AXIS_X + 14} y={top + 20}>{r.title}</text>
              <text className="cm-svg-cap dim" x={CM_MAP_BOX_X + 14} y={top + 20}>{r.what}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s4.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMMapViz = CMMapViz;

/* ── 3. 진단 — 예상과 실측 (S5) ──────────────────────────────────────────── */
// 막대 높이는 실측 Average 에 비례한다(0.4525 / 0.0201 / 0.1700 중 최대를 108px 로).
// 배치 검산: 마지막 상자 495 + 190 = 685 ≤ viewBox 720 ✓
// ⚠️ 상자 두 줄(이름 + 무엇을 하나)과 최대 막대의 값 라벨은 **입력값과 무관하게** 겹친다 —
//    최대 막대는 항상 MAXH 를 꽉 채우므로 그 라벨 y 가 고정이다. 상자 아래 여백이 헤드룸이다.
//    실측으로 잡았다(교차 전수 검사: "메시로 만들어 올린다" ↔ "0.4525" 가 6px 겹쳤다).
const CM_DG_BOX_BOTTOM = 84;
const CM_DG_BASE = 240, CM_DG_MAXH = 108;   // 라벨 최상단 ≈ 240−108−9−11 = 112 > 84 ✓
// ⚠️ 이 셋은 data.js s5.table 과 **같은 값이어야 한다.** 두 곳을 손으로 맞춘다
const CM_DG_STAGES = [
  { x: 35, name: 'FoldOperation.Split', what: '접는 선으로 자른다', v: 0.1700, label: '0.1700' },
  { x: 265, name: 'FoldOperation.Compose', what: '조각을 쌓는다', v: 0.0201, label: '0.0201' },
  { x: 495, name: 'Renderer.Sync', what: '메시로 만들어 올린다', v: 0.4525, label: '0.4525' },
];

function CMDiagnoseViz() {
  const max = 0.4525;
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 282" role="img"
           aria-label="접기 한 프레임의 세 단계를 같은 축에 놓은 그림. 예상은 자르는 계산이었으나 실측에서는 메시로 만들어 올리는 준비가 가장 비쌌다">
        <text className="cm-svg-lbl" x="35" y="12">예상 — 여기가 비쌀 것이라고 봤다</text>
        <line className="cm-svg-arrow" x1="130" y1="17" x2="130" y2="36" markerEnd="url(#cmArrow)" />

        {CM_DG_STAGES.map((s, i) => {
          const h = Math.max(3, (s.v / max) * CM_DG_MAXH);
          const cx = s.x + 95;
          return (
            <g key={s.name}>
              {/* 이름과 설명을 상자 안에 넣는다 — 상자 밖에 두면 최대 막대의 값 라벨과 겹친다 */}
              <rect className="cm-svg-box" x={s.x} y="40" width="190" height={CM_DG_BOX_BOTTOM - 40} rx="3" />
              <text className="cm-svg-txt" x={s.x + 12} y="60">{s.name}</text>
              <text className="cm-svg-cap" x={s.x + 12} y="78">{s.what}</text>
              {i < 2 && (
                <line className="cm-svg-arrow" x1={s.x + 196} y1="62" x2={s.x + 224} y2="62" markerEnd="url(#cmArrow)" />
              )}
              {/* ⚠️ .cm-bar.burst 를 쓰지 않는다 — §02 의 범례가 그 색을 "Burst 잡"으로 정의했다.
                  두 절 뒤에서 같은 색이 "렌더링 준비"를 뜻하면 색이 거짓말을 한다(05 렌즈0·2 일치). */}
              <rect className={`cm-bar ${i === 2 ? 'hot' : 'neutral'}`} x={cx - 33} y={CM_DG_BASE - h} width="66" height={h} />
              <text className="cm-svg-val" x={cx} y={CM_DG_BASE - h - 9} textAnchor="middle">{s.label}</text>
            </g>
          );
        })}

        <line className="cm-svg-base" x1="20" y1={CM_DG_BASE} x2="700" y2={CM_DG_BASE} />
        <text className="cm-svg-cap" x="20" y="262">막대 = 16회 벤치 프레임당 Average (ms)</text>

        <defs>
          <marker id="cmArrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s5.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMDiagnoseViz = CMDiagnoseViz;

/* ── 4. ① 재사용 before/after (S6) ───────────────────────────────────────── */
// 조각의 x 구간이 접는 선을 넘느냐가 곧 "다시 만드느냐"다 — 도형이 원리를 그대로 쓴다.
// 배치 검산: 우측 패널 380 + 240 = 620 ≤ viewBox 720 ✓
const CM_RU_PIECES = [
  { x: 16, w: 110 }, { x: 100, w: 120 }, { x: 40, w: 80 },
  { x: 120, w: 100 }, { x: 30, w: 90 },
];
const CM_RU_LINE = 150;   // 패널 기준 접는 선 x

function CMReuseViz() {
  const panel = (px, title, redrawAll) => (
    <g>
      <text className="cm-svg-lbl" x={px} y="14">{title}</text>
      {/* ⚠️ 이 라벨을 선 위쪽(y≈22)에 두면 패널 제목과 겹친다 — 제목이 x 0..180 을 먹는데
          선이 x=150 이라 같은 구간이다. 교차 전수 검사로 잡았다. 아래쪽 빈 자리로 내린다. */}
      <line className="cm-svg-half" x1={px + CM_RU_LINE} y1="24" x2={px + CM_RU_LINE} y2="162" strokeDasharray="4 3" />
      <text className="cm-svg-cap" x={px + CM_RU_LINE + 6} y="174">접는 선</text>
      {CM_RU_PIECES.map((p, i) => {
        const crosses = p.x < CM_RU_LINE && p.x + p.w > CM_RU_LINE;
        const hot = redrawAll || crosses;
        const y = 34 + i * 26;
        return (
          <g key={i}>
            {/* 비용을 뜻하는 색은 sage 가 아니다 — sage 는 이 페이지에서 개선 쪽이다(코드쌍 '이후' 태그·구조 막대) */}
            <rect className={hot ? 'cm-svg-redraw' : 'cm-svg-piece'} x={px + p.x} y={y} width={p.w} height="18" rx="2" />
            {/* ⚠️ x=236 이면 조각 우단(px+220)이 글자를 관통한다. 가장 긴 라벨 63px 기준 시작 227 > 220 */}
            <text className="cm-svg-cap" x={px + 290} y={y + 13} textAnchor="end">
              {hot ? '새로 만듦' : '참조 그대로'}
            </text>
          </g>
        );
      })}
      {/* '접는 선' 라벨(y=174)과 x 가 겹치므로 한 줄 더 내린다 */}
      <text className="cm-svg-cap" x={px} y="196">
        {redrawAll ? '5장 전부 다시 만든다' : '걸치는 2장만 새로 · 3장은 원본 인스턴스 통과'}
      </text>
    </g>
  );
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 212" role="img"
           aria-label="이전에는 접는 선에 걸치지 않는 레이어까지 매 프레임 다시 만들었고, 이후에는 걸치는 것만 새로 만들고 나머지는 원본 인스턴스를 그대로 통과시킨다">
        {panel(0, '이전 — 매 프레임 전부 재생성', true)}
        <line className="cm-svg-sep" x1="350" y1="8" x2="350" y2="204" />
        {panel(380, '이후 — 걸치는 것만', false)}
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s6.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMReuseViz = CMReuseViz;

/* ── 5. ② 버리기 before/after (S7) ─────────────────────────────────────────── */
// 종이 단면. 위·아래 양쪽에서 가려진 슬래브는 어떻게 접어도 드러나지 않는다.
// 배치 검산: 우측 패널 380 + 40 + 200 = 620 ≤ viewBox 720 ✓
// 가려짐 표시 수는 캡션의 감소율과 맞아야 한다 — 9장 중 7장을 버려 2장(−78%)이 337→57(−83%)에 가장 가깝다
const CM_PR_BEFORE = [0, 1, 1, 1, 1, 1, 1, 1, 0];
const CM_PR_AFTER = [0, 0];
const CM_PR_SLAB_X = 44, CM_PR_SLAB_W = 190, CM_PR_SLAB_H = 11, CM_PR_STEP = 15;

function CMPruneViz() {
  const panel = (px, title, slabs, count, note, arrows) => {
    const bottom = 34 + slabs.length * CM_PR_STEP;
    return (
      <g>
        <text className="cm-svg-lbl" x={px} y="14">{title}</text>
        {/* 화살표는 x=px+22 한 열에만 있다 — 카운트를 슬래브 열(px+44)에 두어 x 가 안 겹친다 */}
        {arrows && <line className="cm-svg-arrow" x1={px + 22} y1="22" x2={px + 22} y2="34" markerEnd="url(#cmArrow2)" />}
        {slabs.map((buried, i) => (
          <rect key={i} className={buried ? 'cm-svg-done' : 'cm-svg-piece'}
                x={px + CM_PR_SLAB_X} y={34 + i * CM_PR_STEP} width={CM_PR_SLAB_W} height={CM_PR_SLAB_H} rx="1" />
        ))}
        {arrows && <line className="cm-svg-arrow" x1={px + 22} y1={bottom + 12} x2={px + 22} y2={bottom} markerEnd="url(#cmArrow2)" />}
        <text className="cm-svg-pct" x={px + CM_PR_SLAB_X} y="196">{count}</text>
        <text className="cm-svg-cap" x={px + CM_PR_SLAB_X + 46} y="196">{note}</text>
      </g>
    );
  };
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 210" role="img"
           aria-label="이전에는 위아래 양쪽에서 가려진 레이어까지 계속 쌓였고, 이후에는 확정할 때 그것들을 버려 회차 16 기준 337장이 57장으로 줄었다">
        {panel(0, '이전 — 가려진 것도 쌓인다', CM_PR_BEFORE, '337장', '회차 16', true)}
        {/* 두 주석은 구분선(x=350) 안쪽에 머물러야 한다 — 1회차에 366 까지 뻗어 뚫었다 */}
        <text className="cm-svg-cap" x="248" y="54">위에서 안 보임</text>
        <text className="cm-svg-cap" x="248" y="160">아래에서도 안 보임</text>
        <line className="cm-svg-sep" x1="350" y1="8" x2="350" y2="202" />
        {panel(380, '이후 — 확정할 때 버린다', CM_PR_AFTER, '57장', '같은 화면', false)}

        <defs>
          <marker id="cmArrow2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s7.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMPruneViz = CMPruneViz;

/* ── 6. ③ 렌더 구조 before/after (S8) ────────────────────────────────────── */
// 배치 검산: 최우단은 z스택 라벨 "가림은 z-buffer 가"(x=586, 12px 11글자 ≈ 108) = 694 ≤ viewBox 720 ✓
function CMRenderStructViz() {
  const stack = [0, 1, 2];
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 230" role="img"
           aria-label="가려진 레이어를 버린 뒤에도 남아 있던 렌더 오브젝트 77개를, 앞뒤 메시 두 개에 전 레이어를 이어붙여 2개로 고정한다">
        {/* ⚠️ 여기에 337 을 쓰면 337→2 를 병합의 몫으로 귀속하게 된다 —
            버리기(②)가 이미 337→77 을 했다. §01 F04 정정이 명시 금지한 자리다. */}
        <text className="cm-svg-lbl" x="0" y="14">이전 — 레이어마다 렌더 오브젝트</text>
        {stack.map(i => (
          <g key={i}>
            <rect className="cm-svg-box" x={i * 7} y={30 + i * 26} width="196" height="22" rx="2" />
            <text className="cm-svg-cap" x={i * 7 + 8} y={45 + i * 26}>렌더 오브젝트 한 벌</text>
          </g>
        ))}
        <text className="cm-svg-cap" x="22" y={30 + 3 * 26 + 16}>⋮</text>
        <rect className="cm-svg-box" x="28" y="130" width="196" height="22" rx="2" />
        <text className="cm-svg-cap" x="36" y="145">렌더 오브젝트 한 벌</text>
        <text className="cm-svg-pct" x="0" y="180">77개</text>
        <text className="cm-svg-cap" x="46" y="180">②가 버린 뒤 · 회차 16</text>

        <line className="cm-svg-arrow" x1="252" y1="96" x2="304" y2="96" markerEnd="url(#cmArrow3)" />

        <text className="cm-svg-lbl" x="330" y="14">이후 — 앞뒤 메시 2개</text>
        <rect className="cm-svg-cell fixed" x="330" y="30" width="228" height="50" />
        <text className="cm-svg-txt" x="342" y="50">앞면 메시 1개</text>
        <text className="cm-svg-cap" x="342" y="70">제자리에 남은 조각 전부</text>
        <rect className="cm-svg-cell flip" x="330" y="90" width="228" height="50" />
        <text className="cm-svg-txt" x="342" y="110">뒷면 메시 1개</text>
        <text className="cm-svg-cap" x="342" y="130">넘어간 조각 전부</text>
        <text className="cm-svg-pct" x="330" y="180">2개</text>
        <text className="cm-svg-cap" x="372" y="180">레이어가 몇 장이든 고정</text>

        <text className="cm-svg-cap" x="586" y="26">쌓임은 정점 z 에</text>
        {stack.map(i => (
          <path key={i} className="cm-svg-zslab" d={`M592,${46 + i * 20} l52,-11 v13 l-52,11 z`} />
        ))}
        <text className="cm-svg-cap" x="586" y="130">가림은 z-buffer 가</text>

        <defs>
          <marker id="cmArrow3" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s8.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMRenderStructViz = CMRenderStructViz;

/* ── 7. ④ 출력 버퍼 슬롯 배정 (S9) ──────────────────────────────────────── */
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
        <text className="cm-svg-lbl" x="8" y="60">잡 스레드</text>
        <text className="cm-svg-lbl" x="8" y="176">출력 버퍼</text>

        {cells.map(c => (
          <g key={`t${c.i}`}>
            <rect className="cm-svg-box" x={c.cx - 76} y="34" width="152" height="40" rx="3" />
            <text className="cm-svg-txt" x={c.cx} y="59" textAnchor="middle">레이어 {c.i} 분할</text>
            <line className="cm-svg-arrow" x1={c.cx} y1="76" x2={c.cx} y2="146" markerEnd="url(#cmArrow4)" />
          </g>
        ))}

        {cells.map(c => (
          <g key={`b${c.i}`}>
            {/* 칸 색은 정보를 나르지 않는다 — '제자리'·'넘어감' 글자가 이미 구분한다. 둘 다 중립. */}
            <rect className="cm-svg-cell fixed" x={c.x} y="150" width={CM_CELL_W} height="46" />
            <rect className="cm-svg-cell flip" x={c.x + CM_CELL_W} y="150" width={CM_CELL_W} height="46" />
            <text className="cm-svg-cap" x={c.x + CM_CELL_W / 2} y="178" textAnchor="middle">제자리</text>
            <text className="cm-svg-cap" x={c.x + CM_CELL_W * 1.5} y="178" textAnchor="middle">넘어감</text>
            <line className="cm-svg-sep" x1={c.x} y1="150" x2={c.x} y2="196" />
            <text className="cm-svg-slot" x={c.x + 4} y="214">SlotStarts[{c.i}]</text>
          </g>
        ))}
        <rect className="cm-svg-bufline" x={CM_BUF_X} y="150" width={CM_CELL_W * 2 * CM_PAIRS} height="46" />

        {cells.map(c => (
          <g key={`s${c.i}`}>
            <line className="cm-svg-span" x1={c.x} y1="232" x2={c.x + CM_CELL_W * 2} y2="232" />
            <text className="cm-svg-cap" x={c.cx} y="252" textAnchor="middle">레이어 {c.i}의 몫</text>
          </g>
        ))}

        <defs>
          <marker id="cmArrow4" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s9.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMSlotViz = CMSlotViz;

/* ── 8. ⑥ 세 방식 비교 (S11) ────────────────────────────────────────────── */
// 같은 상황(위 두 장이 걸쳐 있고 둘이 합쳐야 아래를 다 가린다)에서 셋이 무엇을 하는지.
// 라벨은 전부 도형 **밖**(y=28 · y≥110)에 둔다 — 안에 두면 상자 테두리가 글자를 관통한다.
// 배치 검산: 마지막 패널 488 + 216 = 704 ≤ viewBox 720 ✓
const CM_PC_W = 216, CM_PC_GAP = 244;
function CMPolicyCompareViz() {
  const P = i => i * CM_PC_GAP;
  const shapes = (p, kind) => (
    <g>
      <text className="cm-svg-cap" x={p + 44} y="32">위 레이어 A</text>
      <text className="cm-svg-cap" x={p + 140} y="32">B</text>
      <rect className={kind === 'miss' ? 'cm-svg-piece' : 'cm-svg-done'} x={p + 6} y="40" width="204" height="58" rx="2" />
      <rect className="cm-svg-cover" x={p + 6} y="40" width="120" height="58" />
      <rect className="cm-svg-cover" x={p + 90} y="40" width="120" height="58" />
      {kind === 'union' && <rect className="cm-svg-union" x={p + 2} y="36" width="212" height="66" rx="3" />}
      {kind === 'step' && <line className="cm-svg-half" x1={p + 90} y1="36" x2={p + 90} y2="102" />}
      {kind === 'miss' && <text className="cm-svg-cap" x={p + 24} y="116">A 만으로도, B 만으로도 못 덮는다</text>}
    </g>
  );
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 206" role="img"
           aria-label="위에 두 장이 걸쳐 있고 둘이 합쳐야 아래 조각을 다 가리는 상황에서 세 방식이 각각 무엇을 하는지. 한 장씩만 보는 방식만 이 경우를 놓친다">
        <g>
          <text className="cm-svg-lbl" x={P(0)} y="14">합쳐서 빼기</text>
          {shapes(P(0), 'union')}
          <text className="cm-svg-cap" x={P(0)} y="138">A 와 B 를 먼저 하나로 합치고</text>
          <text className="cm-svg-cap" x={P(0)} y="156">그 합집합을 아래에서 뺀다</text>
          <text className="cm-svg-txt" x={P(0)} y="186">가려짐 → 버린다</text>
        </g>
        <line className="cm-svg-sep" x1="228" y1="8" x2="228" y2="198" />
        <g>
          <text className="cm-svg-lbl" x={P(1)} y="14">한 장씩 빼기 · 채택</text>
          {shapes(P(1), 'step')}
          <text className="cm-svg-cap" x={P(1)} y="138">A 를 빼고, 남은 데서 B 를 뺀다</text>
          <text className="cm-svg-cap" x={P(1)} y="156">합치는 단계가 없다</text>
          <text className="cm-svg-txt" x={P(1)} y="186">가려짐 → 버린다</text>
        </g>
        <line className="cm-svg-sep" x1="472" y1="8" x2="472" y2="198" />
        <g>
          <text className="cm-svg-lbl" x={P(2)} y="14">한 장씩만 본다</text>
          {shapes(P(2), 'miss')}
          <text className="cm-svg-cap" x={P(2)} y="138">한 장이 통째로 품는 경우만 본다</text>
          <text className="cm-svg-cap" x={P(2)} y="156">둘이 나눠 가리면 못 잡는다</text>
          <text className="cm-svg-txt" x={P(2)} y="186">못 잡는다 → 남긴다</text>
        </g>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s11.compareCaption)}</figcaption>
    </figure>
  );
}
window.CMPolicyCompareViz = CMPolicyCompareViz;

/* ── 9. ⑥ 채택한 방식이 어떻게 도는가 (S11) ─────────────────────────────── */
// 배치 검산: 4패널 × 176 = 704 ≤ viewBox 720 ✓
const CM_SUB_PANEL = 176;
function CMConvexSubViz() {
  const P = i => i * CM_SUB_PANEL;
  return (
    <figure className="cm-fig">
      <svg viewBox="0 0 720 250" role="img"
           aria-label="조각에서 덮개를 뺄 때 덮개의 변을 차례로 반평면 경계로 삼아 바깥 조각을 떼어 내고 안쪽만 다음 변으로 넘긴다. 남은 것이 없으면 완전히 덮인 것이다">
        {/* 1 — 시작 */}
        <g>
          <text className="cm-svg-lbl" x={P(0)} y="14">시작</text>
          <path className="cm-svg-piece" d={`M${P(0) + 6},26 L${P(0) + 130},26 L${P(0) + 130},118 L${P(0) + 6},118 Z`} />
          <text className="cm-svg-cap" x={P(0) + 14} y="44">조각 W</text>
          <path className="cm-svg-cover" d={`M${P(0) + 50},50 L${P(0) + 118},50 L${P(0) + 118},104 L${P(0) + 50},104 Z`} />
          <text className="cm-svg-cap" x={P(0) + 58} y="80">덮개 Q</text>
          <text className="cm-svg-cap" x={P(0)} y="146">둘 다 볼록이다</text>
        </g>
        {/* 2 — h0 */}
        <g>
          <text className="cm-svg-lbl" x={P(1)} y="14">h₀ 로 자른다</text>
          <path className="cm-svg-cut" d={`M${P(1) + 6},26 L${P(1) + 130},26 L${P(1) + 130},50 L${P(1) + 6},50 Z`} />
          <path className="cm-svg-piece" d={`M${P(1) + 6},50 L${P(1) + 130},50 L${P(1) + 130},118 L${P(1) + 6},118 Z`} />
          <line className="cm-svg-half" x1={P(1)} y1="50" x2={P(1) + 140} y2="50" />
          <text className="cm-svg-cap" x={P(1) + 112} y="44">h₀</text>
          <text className="cm-svg-cap" x={P(1)} y="146">바깥을 떼어 낸다</text>
          <text className="cm-svg-cap" x={P(1)} y="166">안쪽만 다음 변으로</text>
        </g>
        {/* 3 — h1 */}
        <g>
          <text className="cm-svg-lbl" x={P(2)} y="14">h₁ 로 자른다</text>
          <path className="cm-svg-done" d={`M${P(2) + 6},26 L${P(2) + 130},26 L${P(2) + 130},50 L${P(2) + 6},50 Z`} />
          <path className="cm-svg-cut" d={`M${P(2) + 6},50 L${P(2) + 50},50 L${P(2) + 50},118 L${P(2) + 6},118 Z`} />
          <path className="cm-svg-piece" d={`M${P(2) + 50},50 L${P(2) + 130},50 L${P(2) + 130},118 L${P(2) + 50},118 Z`} />
          <line className="cm-svg-half" x1={P(2) + 50} y1="26" x2={P(2) + 50} y2="126" />
          {/* ⚠️ 이 라벨은 선 옆 빈 자리에만 놓인다 — 위(패널 제목)·아래(캡션) 둘 다 글자가 있어 겹친다.
              자동 지표(폰트·넘침·이탈)는 글자끼리 겹치는 것을 못 잡는다. 교차 전수 검사로 두 번 걸렀다. */}
          <text className="cm-svg-cap" x={P(2) + 56} y="66">h₁</text>
          <text className="cm-svg-cap" x={P(2)} y="146">또 하나 떼어 낸다</text>
          <text className="cm-svg-cap" x={P(2)} y="166">떼어 낸 것도 볼록이다</text>
        </g>
        {/* 4 — 완료 */}
        <g>
          <text className="cm-svg-lbl" x={P(3)} y="14">변을 다 훑으면</text>
          <path className="cm-svg-done" d={`M${P(3) + 6},26 L${P(3) + 130},26 L${P(3) + 130},50 L${P(3) + 6},50 Z`} />
          <path className="cm-svg-done" d={`M${P(3) + 6},50 L${P(3) + 50},50 L${P(3) + 50},118 L${P(3) + 6},118 Z`} />
          <path className="cm-svg-cut" d={`M${P(3) + 50},104 L${P(3) + 130},104 L${P(3) + 130},118 L${P(3) + 50},118 Z`} />
          <path className="cm-svg-cut" d={`M${P(3) + 118},50 L${P(3) + 130},50 L${P(3) + 130},104 L${P(3) + 118},104 Z`} />
          <path className="cm-svg-hole" d={`M${P(3) + 50},50 L${P(3) + 118},50 L${P(3) + 118},104 L${P(3) + 50},104 Z`} />
          <text className="cm-svg-cap" x={P(3) + 62} y="82">Q 자리</text>
          <text className="cm-svg-cap" x={P(3)} y="146">남은 것이 W 빼기 Q</text>
          <text className="cm-svg-cap" x={P(3)} y="166">전부 볼록 조각이다</text>
        </g>

        <line className="cm-svg-base" x1="0" y1="190" x2="700" y2="190" />
        <text className="cm-svg-txt" x="0" y="214">남은 것이 없으면 그 레이어는 완전히 가려진 것 — 버려도 된다.</text>
        <text className="cm-svg-cap" x="0" y="238">여러 장이 나눠 덮는 경우도 조각이 깎여 사라지는 같은 경로다.</text>
      </svg>
      <figcaption className="cm-figcap">{window.renderInline(window.CM_DATA.s11.vizCaption)}</figcaption>
    </figure>
  );
}
window.CMConvexSubViz = CMConvexSubViz;

/* ── 재측정 전후 수치 쌍 (그림 아님 — 텍스트 블록의 일부) ─────────────────── */
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
