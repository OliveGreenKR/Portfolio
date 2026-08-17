// pages/motelet/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / HTML — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 (sage = 채택·유효, terra = 버려짐·문제, ink-3 = 중립).
//
// 규칙 1: 이 프로젝트에는 공개 가능한 계측이 없다. 그래서 그림은 **측정처럼 보이면 안 된다.**
//         여기 있는 그림이 인코딩하는 것은 정의(식) · 경계(소스/가정) · 순서(루프) · 구조(디스패치)뿐이고,
//         눈금 있는 축은 정의가 스스로 만드는 두 곳(치사율 클램프 · 점유율 게이트)에만 있다.
// 규칙 2: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
// 규칙 3: 좁은 폭은 축소가 아니라 **재조립**으로 푼다. viewBox 를 그대로 줄이면
//         12px 글자가 8px 밑으로 떨어진다(320px 실측). 그래서 narrow 전용 SVG 를 따로 그린다.
// 규칙 4: 배치 상수 옆에 총폭 계산 주석을 남긴다.
//
// 덱 호환 — 맨 아래 MTGoldDecompViz · MTGeoArchViz · MTBuilt 는 pages/deck/motelet.js 가 쓴다.
// 페이지는 MTPage* 만 쓴다. 덱 재작성 전까지 아래 세 개를 지우지 않는다.

const MT_NARROW = 820;

function useMTNarrow(max = MT_NARROW) {
  const query = '(max-width: ' + max + 'px)';
  const [narrow, setNarrow] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setNarrow(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return narrow;
}

function MTFigure({ label, caption, kicker, children, className = '' }) {
  return (
    <figure className={'mt-fig ' + className}>
      {kicker && <figcaption className="mt-fig-kicker">{window.renderInline(kicker)}</figcaption>}
      <div className="mt-fig-body" role="img" aria-label={label}>{children}</div>
      {caption && <figcaption className="mt-fig-cap">{window.renderInline(caption)}</figcaption>}
    </figure>
  );
}

/* ─── 02 골드 분해 트리 ───────────────────────────────────
   숫자 없음. 구조만 말한다 — 무엇을 곱하고 어디서 min 이 끼어드는가. */
function MTNode({ x, y, w, h, title, sub, tone }) {
  const fill = tone === 'root' ? 'var(--sage-100)' : tone === 'leaf' ? 'var(--paper)' : 'var(--paper-2)';
  const stroke = tone === 'root' ? 'var(--sage-500)' : 'var(--rule-2)';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke={stroke} strokeWidth={tone === 'root' ? 1.6 : 1} />
      <text x={x + w / 2} y={y + (sub ? 25 : h / 2 + 5)} textAnchor="middle" className="mt-t-node">{title}</text>
      {sub && <text x={x + w / 2} y={y + 43} textAnchor="middle" className="mt-t-sub">{sub}</text>}
    </g>
  );
}

function MTOp({ x, y, t }) {
  const wide = t.length > 1;
  return (
    <g>
      <rect x={x - (wide ? 20 : 13)} y={y - 13} width={wide ? 40 : 26} height="26" rx="13"
            fill="var(--paper)" stroke="var(--sage-500)" />
      <text x={x} y={y + 5} textAnchor="middle" className="mt-t-op">{t}</text>
    </g>
  );
}

function MTElbow({ x1, y1, x2, y2 }) {
  const mid = x1 + (x2 - x1) / 2;
  return <polyline points={`${x1},${y1} ${mid},${y1} ${mid},${y2} ${x2},${y2}`} fill="none" stroke="var(--rule-2)" />;
}

function MTPageDecompTree({ decomp }) {
  const narrow = useMTNarrow();
  const n = decomp.nodes;

  if (narrow) {
    /* 세로 재조립 — 깊이를 들여쓰기로 준다. 가로 축소가 아니라 다시 그린 것이다.
       단계별 y: 부모 아래로 두 자식, 그 사이 세로선 위에 연산자.
       총높이: spawn 박스 374+40=414 + 꼬리 86 = 500 ✓ (겹침 없음) */
    /* 상자는 x=44 부터. 왼쪽 44px 은 분기선·연산자 전용 여백이다 —
       예전엔 연산자 알약이 상자 위에 얹혀 겹쳤다(390·320 실측). */
    const box = (y, depth, title, sub, tone) => (
      <MTNode key={title} x={44 + depth * 14} y={y} w={284 - depth * 14} h={sub ? 52 : 40} title={title} sub={sub} tone={tone} />
    );
    // 분기: 세로선 x, 부모 아래 y, 두 자식의 중심 y, 자식 왼쪽 x, 연산자 y(행 사이 빈 구간)
    const fork = (key, vx, y0, ya, yb, cx, op, opY) => (
      <g key={key}>
        <path d={`M${vx} ${y0} V${yb}`} className="mt-line" />
        <path d={`M${vx} ${ya} H${cx}`} className="mt-line" />
        <path d={`M${vx} ${yb} H${cx}`} className="mt-line" />
        <MTOp x={vx} y={opY} t={op} />
      </g>
    );
    return (
      <MTFigure kicker={decomp.title} caption={decomp.caption}
        label="한 판의 골드를 처치 수와 처치당 골드로, 처치 수를 처치율과 버틴 시간으로, 처치율을 공격력 항과 스폰 항 중 작은 쪽으로 분해한 세로 트리">
        <svg viewBox="0 0 340 500" className="mt-svg narrow">
          {/* 연산자는 첫 자식과 같은 높이 — 어느 분기의 연산인지 위치로 읽힌다. 좌측 여백이라 상자와 안 겹친다. */}
          {fork('f1', 30, 50, 96, 152, 58, '×', 96)}
          {fork('f2', 44, 116, 220, 276, 72, '×', 220)}
          {fork('f3', 58, 240, 344, 394, 86, 'min', 344)}
          {box(10, 0, n.root, null, 'root')}
          {box(76, 1, n.kills, null, 'mid')}
          {box(126, 1, n.goldPerKill[0], n.goldPerKill[1], 'leaf')}
          {box(200, 2, n.killRate, null, 'mid')}
          {box(250, 2, n.survived[0], n.survived[1], 'leaf')}
          {box(324, 3, n.atk, null, 'leaf')}
          {box(374, 3, n.spawn, null, 'leaf')}
          <line x1="12" x2="328" y1="436" y2="436" stroke="var(--rule)" />
          <text x="12" y="458" className="mt-t-note">× 곱 · min 작은 쪽 · 들여쓴 만큼 아래 단계</text>
          <text x="12" y="484" className="mt-t-node">스킬 한 칸은 이 잎 중 하나를 움직인다</text>
        </svg>
      </MTFigure>
    );
  }

  // 총폭: 마지막 열 x=742 + w=196 = 938 < 960 ✓
  return (
    <MTFigure kicker={decomp.title} caption={decomp.caption}
      label="한 판의 골드를 처치 수와 처치당 골드로, 처치 수를 처치율과 버틴 시간으로, 처치율을 공격력 항과 스폰 항 중 작은 쪽으로 분해한 트리">
      <svg viewBox="0 0 960 282" className="mt-svg">
        <MTElbow x1={186} y1={132} x2={252} y2={64} />
        <MTElbow x1={186} y1={132} x2={252} y2={200} />
        <MTElbow x1={430} y1={64} x2={496} y2={40} />
        <MTElbow x1={430} y1={64} x2={496} y2={104} />
        <MTElbow x1={676} y1={40} x2={742} y2={22} />
        <MTElbow x1={676} y1={40} x2={742} y2={76} />

        <MTNode x={20} y={104} w={166} h={56} title={n.root} tone="root" />
        <MTOp x={219} y={132} t="×" />
        <MTNode x={252} y={40} w={178} h={48} title={n.kills} tone="mid" />
        <MTNode x={252} y={176} w={178} h={56} title={n.goldPerKill[0]} sub={n.goldPerKill[1]} tone="leaf" />
        <MTOp x={463} y={64} t="×" />
        <MTNode x={496} y={16} w={180} h={48} title={n.killRate} tone="mid" />
        <MTNode x={496} y={80} w={180} h={56} title={n.survived[0]} sub={n.survived[1]} tone="leaf" />
        <MTOp x={709} y={40} t="min" />
        <MTNode x={742} y={0} w={196} h={44} title={n.atk} tone="leaf" />
        <MTNode x={742} y={54} w={196} h={44} title={n.spawn} tone="leaf" />

        <line x1="20" x2="938" y1="252" y2="252" stroke="var(--rule)" />
        <text x="20" y="274" className="mt-t-note">연산은 곱셈과 min 둘뿐 — 잎에 도달하면 더 쪼갤 것이 없다</text>
      </svg>
    </MTFigure>
  );
}
window.MTPageDecompTree = MTPageDecompTree;

/* ─── 02 두 개의 min ──────────────────────────────────────
   A 는 함수 그래프, B 는 길이 비교. 둘 다 정의가 스스로 만드는 그림이라
   측정본 없이 그려도 거짓이 아니다. 버려지는 쪽은 항상 terra + 빗금. */
function MTHatch({ id }) {
  return (
    <defs>
      <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="var(--terra-300)" strokeWidth="2.4" />
      </pattern>
      <marker id={id + '-arrow'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
      </marker>
    </defs>
  );
}

function MTClampPanel({ clamp }) {
  // plot: x 90..430, y 42..212. 1.0 지점 = x 260.
  const x0 = 90, x1 = 430, y0 = 212, yTop = 62, xOne = 260;
  return (
    <div className="mt-panel">
      <div className="mt-panel-head"><span>{clamp.tag}</span><strong>{clamp.head}</strong></div>
      <svg viewBox="0 0 460 250" className="mt-svg" role="img"
           aria-label="치사율은 데미지가 적 HP에 도달할 때까지 비례해 오르고 그 뒤로는 1에서 평평해진다. 초과분은 버려진다.">
        <MTHatch id="mt-clamp" />
        <path d={`M ${xOne} ${yTop} L ${x1} ${yTop - 44} L ${x1} ${yTop} Z`} fill="url(#mt-clamp)" opacity="0.55" />
        <line x1={x0} x2={x1} y1={yTop} y2={yTop} className="mt-grid" strokeDasharray="3 4" />
        <line x1={xOne} x2={xOne} y1={yTop} y2={y0} className="mt-grid" strokeDasharray="3 4" />
        <line x1={x0} x2={x1} y1={y0} y2={y0} className="mt-axis" />
        <line x1={x0} x2={x0} y1={y0} y2={38} className="mt-axis" />
        <path d={`M ${x0} ${y0} L ${xOne} ${yTop} L ${x1} ${yTop}`} className="mt-curve" />
        <path d={`M ${xOne} ${yTop} L ${x1} ${yTop - 44}`} className="mt-curve ghost" />
        <circle cx={xOne} cy={yTop} r="5" className="mt-dot" />
        <text x={x0 - 8} y={yTop + 5} textAnchor="end" className="mt-t-axis">{clamp.mark}</text>
        <text x={xOne} y={y0 + 20} textAnchor="middle" className="mt-t-axis">1</text>
        <text x={x1} y={y0 + 20} textAnchor="end" className="mt-t-axis">{clamp.xLabel}</text>
        <text x={x0 - 8} y={46} textAnchor="end" className="mt-t-axis">{clamp.yLabel}</text>
        <text x={x1} y={yTop - 30} textAnchor="end" className="mt-t-cut">{clamp.cut}</text>
        <text x={20} y={240} className="mt-t-note">{clamp.foot}</text>
      </svg>
    </div>
  );
}

function MTGatePanel({ gate }) {
  /* 막대 3개. 공격력 항은 자라고(화살표), 출력은 스폰 항 길이에 고정된다.
     라벨은 막대 왼쪽이 아니라 위에 둔다 — 320px 에서 글자를 키우면
     왼쪽 라벨이 viewBox 밖으로 나갔다(실측 −181). 위에 두면 길이가 배치를 안 깬다.
     총폭: x(20) + full(250) + 화살표 30 = 300 < 460 ✓ */
  const x = 20, full = 250, spawn = 130;
  const row = (y, label, bar) => (
    <g>
      <text x={x} y={y} className="mt-t-lbl">{label}</text>
      {bar(y + 8)}
    </g>
  );
  return (
    <div className="mt-panel">
      <div className="mt-panel-head"><span>{gate.tag}</span><strong>{gate.head}</strong></div>
      <svg viewBox="0 0 460 250" className="mt-svg" role="img"
           aria-label="공격력 항 막대가 스폰 항 막대보다 길어도 출력 막대는 스폰 항 길이에서 멈춘다.">
        <MTHatch id="mt-gate" />
        <line x1={x + spawn} x2={x + spawn} y1="26" y2="204" className="mt-grid" strokeDasharray="3 4" />

        {row(34, gate.aLabel, (y) => (
          <g>
            <rect x={x} y={y} width={spawn} height="24" rx="2" fill="var(--sage-100)" stroke="var(--sage-500)" />
            <rect x={x + spawn} y={y} width={full - spawn} height="24" rx="2" fill="url(#mt-gate)" stroke="var(--terra-400)" opacity="0.9" />
            <line x1={x + full - 6} x2={x + full + 26} y1={y + 12} y2={y + 12} className="mt-arrow" markerEnd="url(#mt-gate-arrow)" />
            <text x={x + spawn + 6} y={y + 44} className="mt-t-cut">늘려도 안 쓰인다</text>
          </g>
        ))}
        {row(112, gate.bLabel, (y) => (
          <rect x={x} y={y} width={spawn} height="24" rx="2" fill="var(--sage-100)" stroke="var(--sage-500)" />
        ))}
        {row(176, gate.outLabel, (y) => (
          <rect x={x} y={y} width={spawn} height="24" rx="2" fill="var(--sage-300)" stroke="var(--sage-700)" />
        ))}
        {/* SVG text 안에서는 인라인 마크업을 못 쓴다 — ** 를 지워 원문만 남긴다. */}
        <text x={x} y="240" className="mt-t-note">{gate.foot.replace(/\*\*/g, '')}</text>
      </svg>
    </div>
  );
}

function MTPageMins({ mins }) {
  return (
    <MTFigure kicker={mins.title} caption={mins.caption} className="mt-fig-panels"
      label="두 개의 min — 치사율 클램프 곡선과 병목 선택 막대 비교">
      <div className="mt-panels">
        <MTClampPanel clamp={mins.clamp} />
        <MTGatePanel gate={mins.gate} />
      </div>
    </MTFigure>
  );
}
window.MTPageMins = MTPageMins;

/* ─── 03 소스 / 가정 경계 ─────────────────────────────────
   이 그림의 일은 자랑이 아니라 경계 긋기다 — 어느 출력이 가정에 딸려 있고
   어느 출력을 실제로 읽었는지를 선의 출발점으로 보인다. */
function MTPageBoundary({ boundary, split }) {
  const narrow = useMTNarrow();
  const sources = split.rows.map((r) => r[0]);
  const assumes = split.rows.map((r) => r[1]);
  const out = boundary.outputs;

  if (narrow) {
    /* 좁은 폭에서는 SVG 를 줄이지 않고 HTML 로 다시 조립한다 —
       입력 항목이 20자를 넘어 SVG text 로는 잘리고, 자르면 모바일에서만 사실이 사라진다. */
    return (
      <figure className="mt-fig mt-fig-flow">
        <figcaption className="mt-fig-kicker">{window.renderInline(boundary.title)}</figcaption>
        <div className="mt-flow" role="img"
             aria-label="게임 자산 입력과 가정값 입력이 기대 골드 모델로 들어가고, 절대 골드 출력은 가정값에 딸려 있어 읽지 않고 노드 간 순위만 읽는다">
          <div className="mt-flow-box src">
            <span>{boundary.sourceHead}</span>
            <ul>{sources.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="mt-flow-arrow" aria-hidden="true">↓</div>
          <div className="mt-flow-box assume">
            <span>{boundary.assumeHead}</span>
            <ul>{assumes.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="mt-flow-arrow" aria-hidden="true">↓</div>
          <div className="mt-flow-model">{boundary.simLabel}</div>
          <div className="mt-flow-arrow split" aria-hidden="true">↓</div>
          <div className="mt-flow-out">
            <div className="mt-flow-box drop">
              <b>{out[0].label}</b>
              <i>안 읽는다</i>
              <p>{out[0].note}</p>
            </div>
            <div className="mt-flow-box take">
              <b>{out[1].label}</b>
              <i>이걸 읽는다</i>
              <p>{out[1].note}</p>
            </div>
          </div>
        </div>
        <figcaption className="mt-fig-cap">{window.renderInline(boundary.caption)}</figcaption>
      </figure>
    );
  }

  const item = (x, y, items, cls) => items.map((text, i) => (
    <text key={text} x={x} y={y + i * 21} className={'mt-t-item ' + (cls || '')}>{text}</text>
  ));

  // 총폭: 출력 박스 x=690 + w=250 = 940 < 960 ✓
  return (
    <MTFigure kicker={boundary.title} caption={boundary.caption}
      label="게임 자산 입력과 가정값 입력이 기대 골드 모델로 들어가고, 절대 골드 출력은 가정값에 딸려 있어 읽지 않고 노드 간 순위만 읽는다">
      <svg viewBox="0 0 960 330" className="mt-svg">
        <defs>
          <marker id="mt-b-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
          </marker>
        </defs>

        <rect x="16" y="10" width="330" height="130" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
        <text x="32" y="34" className="mt-t-lbl">{boundary.sourceHead}</text>
        {item(32, 60, sources)}

        <rect x="16" y="164" width="330" height="130" rx="3" fill="var(--terra-50)" stroke="var(--terra-200)" />
        <text x="32" y="188" className="mt-t-lbl terra">{boundary.assumeHead}</text>
        {item(32, 214, assumes)}

        <path d="M346 75 H400 V140" className="mt-line" markerEnd="url(#mt-b-arrow)" />
        <path d="M346 229 H400 V190" className="mt-line" markerEnd="url(#mt-b-arrow)" />

        <rect x="400" y="140" width="216" height="50" rx="3" fill="var(--sage-100)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x="508" y="170" textAnchor="middle" className="mt-t-node">{boundary.simLabel}</text>

        <path d="M616 165 H654 V70 H690" className="mt-line" markerEnd="url(#mt-b-arrow)" />
        <path d="M616 165 H654 V236 H690" className="mt-line" markerEnd="url(#mt-b-arrow)" />

        <rect x="690" y="36" width="250" height="70" rx="3" fill="var(--paper)" stroke="var(--rule-2)" strokeDasharray="4 3" />
        <text x="706" y="62" className="mt-t-node muted">{out[0].label}</text>
        <text x="706" y="84" className="mt-t-sub">{out[0].note} · 안 읽는다</text>

        <rect x="690" y="202" width="250" height="70" rx="3" fill="var(--sage-50)" stroke="var(--sage-500)" />
        <text x="706" y="228" className="mt-t-node">{out[1].label}</text>
        <text x="706" y="250" className="mt-t-sub">{out[1].note} · 이걸 읽는다</text>

        <path d="M240 294 V312 H664 V116 H690 V71" className="mt-line dep" />
        <text x="250" y="310" className="mt-t-cut">점선 = 절대값이 가정값에 딸려 있다</text>

        <line x1="16" x2="940" y1="322" y2="322" stroke="var(--rule)" />
      </svg>
    </MTFigure>
  );
}
window.MTPageBoundary = MTPageBoundary;

/* ─── 01 게임 루프 ────────────────────────────────────────
   순서는 화살표가 문장보다 빠르다. 되돌아오는 선이 있어야 "반복"이 보이고,
   그 되돌아오는 선 위에 "성장 = 판과 판 사이" 를 얹어야 뒤의 밸런싱 절이 선다. */
function MTPageCycle({ loop }) {
  const narrow = useMTNarrow();
  const steps = loop.steps;
  const subs = loop.subs || [];

  const label = '전투에서 번 골드로 업그레이드를 사고 더 강한 적이 있는 다음 판으로 돌아가는 순환';

  if (narrow) {
    return (
      <MTFigure kicker={loop.title} caption={loop.caption} label={label}>
        {/* 총높이: 마지막 박스 256+58=314, 반복 라벨 332 → 344 */}
        <svg viewBox="0 0 340 344" className="mt-svg narrow">
          <defs>
            <marker id="mt-loop-arrow-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
            </marker>
          </defs>
          {steps.map((step, i) => (
            <g key={step}>
              <rect x="40" y={10 + i * 82} width="212" height="58" rx="3"
                    fill={i === 1 ? 'var(--sage-100)' : 'var(--paper-2)'}
                    stroke={i === 1 ? 'var(--sage-500)' : 'var(--rule-2)'} />
              <text x="146" y={34 + i * 82} textAnchor="middle" className="mt-t-node">{step}</text>
              <text x="146" y={54 + i * 82} textAnchor="middle" className="mt-t-sub">{subs[i]}</text>
              {i < steps.length - 1 && (
                <path d={`M146 ${68 + i * 82} V ${86 + i * 82}`} className="mt-line" markerEnd="url(#mt-loop-arrow-m)" />
              )}
            </g>
          ))}
          <path d="M252 285 H300 V39 H258" className="mt-line" markerEnd="url(#mt-loop-arrow-m)" />
          <text x="316" y="162" className="mt-t-cut" transform="rotate(-90 316 162)" textAnchor="middle">{loop.watch}</text>
          <text x="12" y="332" className="mt-t-lbl">{loop.loopLabel}</text>
        </svg>
      </MTFigure>
    );
  }

  // 총폭: 마지막 노드 x=714 + 196 = 910 < 960 ✓
  return (
    <MTFigure kicker={loop.title} caption={loop.caption} label={label}>
      <svg viewBox="0 0 960 170" className="mt-svg">
        <defs>
          <marker id="mt-loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
          </marker>
        </defs>
        {steps.map((step, i) => {
          const x = 24 + i * 230;
          return (
            <g key={step}>
              <rect x={x} y="34" width="196" height="66" rx="3"
                    fill={i === 1 ? 'var(--sage-100)' : 'var(--paper-2)'}
                    stroke={i === 1 ? 'var(--sage-500)' : 'var(--rule-2)'} />
              <text x={x + 98} y="64" textAnchor="middle" className="mt-t-node">{step}</text>
              <text x={x + 98} y="86" textAnchor="middle" className="mt-t-sub">{subs[i]}</text>
              {i < steps.length - 1 && (
                <line x1={x + 196} x2={x + 224} y1="67" y2="67" className="mt-line" markerEnd="url(#mt-loop-arrow)" />
              )}
            </g>
          );
        })}
        <path d="M812 100 V150 H122 V106" className="mt-line" markerEnd="url(#mt-loop-arrow)" />
        <text x="466" y="144" textAnchor="middle" className="mt-t-cut">{loop.watch}</text>
        <text x="24" y="24" className="mt-t-lbl">{loop.loopLabel}</text>
      </svg>
    </MTFigure>
  );
}
window.MTPageCycle = MTPageCycle;

/* ─── 03 주석 단 에디터 캡처 ──────────────────────────────
   전체 창 캡처는 그대로 두면 "복잡한 화면"으로만 소비된다.
   번호를 얹어 §03 의 주장(여섯 기능 + 소스/가정 경계)이 실제 어느 자리인지 대응시킨다. */
function MTPageShot({ shot }) {
  return (
    <figure className="mt-shotfig">
      <div className="mt-shotfig-scroll">
        <div className="mt-shotfig-frame">
          <img src={shot.img} alt={shot.alt} />
          {shot.callouts.map((c) => (
            <span key={c.n} className="mt-pin" style={{ left: c.x + '%', top: c.y + '%' }} aria-hidden="true">{c.n}</span>
          ))}
        </div>
      </div>
      <ol className="mt-pinlist">
        {shot.callouts.map((c) => (
          <li key={c.n}><span className="mt-pin static">{c.n}</span><b>{c.label}</b><span>{c.body}</span></li>
        ))}
      </ol>
      <figcaption className="mt-fig-cap">
        {window.renderInline(shot.caption)}<br />{window.renderInline(shot.note)}
      </figcaption>
    </figure>
  );
}
window.MTPageShot = MTPageShot;

/* ─── 03 부팅 파이프라인 ──────────────────────────────────
   화살표가 실제 호출 순서이고, 아래로 꺾이는 지점이 "여기서부터 씬 안" 이다.
   상자에 글자를 넣은 그림이 아니라, 계약이 어디서 끊기는지를 위치로 말한다. */
function MTBox({ x, y, w, h, tag, title, sub, tone }) {
  const fill = tone === 'accent' ? 'var(--sage-100)' : tone === 'outside' ? 'var(--terra-50)' : 'var(--paper-2)';
  const stroke = tone === 'accent' ? 'var(--sage-500)' : tone === 'outside' ? 'var(--terra-200)' : 'var(--rule-2)';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke={stroke} strokeWidth={tone === 'accent' ? 1.6 : 1} />
      {tag && <text x={x + 12} y={y + 20} className={'mt-t-lbl' + (tone === 'outside' ? ' terra' : '')}>{tag}</text>}
      <text x={x + 12} y={y + (tag ? 44 : 26)} className="mt-t-node">{title}</text>
      {sub && <text x={x + 12} y={y + (tag ? 64 : 46)} className="mt-t-sub">{sub}</text>}
    </g>
  );
}

function MTPagePipeline({ pipeline }) {
  const narrow = useMTNarrow();
  const p = pipeline;
  const label = '외부 Provider 가 주입 계약 하나를 넘기면 부팅 지휘자가 Core, Infrastructure, Gameplay 순으로 시스템을 초기화하고 Playing 으로 전이한다';
  const arrow = (id) => (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
      </marker>
    </defs>
  );

  if (narrow) {
    // 세로 재조립. 모든 칸이 같은 높이(66)라 sub 가 상자 밖으로 나가지 않는다(390 실측에서 12px 이탈이 있었다).
    const rows = [
      { title: p.outside.items[0], sub: p.outside.items[1], tag: p.outside.tag, tone: 'outside' },
      { title: p.entry.title, sub: p.entry.sub, tag: p.entry.tag, tone: 'accent' },
      { title: p.boot.title, sub: p.boot.sub, tag: p.boot.tag },
      { title: p.phases[0][0], sub: p.phases[0][1] },
      { title: p.phases[1][0], sub: p.phases[1][1] },
      { title: p.phases[2][0], sub: p.phases[2][1] },
      // phaseNote 원문은 320px 에서 상자를 15px 넘겼다 — 좁은 폭에서는 짧은 형태로 바꾼다.
      { title: p.state.title, sub: '세 페이즈 완료 뒤 전이', tag: p.state.tag, tone: 'accent' },
    ];
    const H = 74, GAP = 16;
    let y = 26;
    const laid = rows.map((r) => { const at = y; y += H + GAP; return { ...r, y: at }; });
    return (
      <MTFigure kicker={p.title} caption={p.caption} label={label}>
        <svg viewBox={`0 0 340 ${y - GAP + 8}`} className="mt-svg narrow">
          {arrow('mt-pipe-arrow-m')}
          <text x={12} y={14} className="mt-t-cut">첫 칸까지가 외부 — 그 아래는 전부 씬 안</text>
          {laid.map((r, i) => (
            <g key={r.title}>
              <MTBox x={12} y={r.y} w={316} h={H} tag={r.tag} title={r.title} sub={r.sub} tone={r.tone} />
              {i < laid.length - 1 && (
                <path d={`M170 ${r.y + H} V ${r.y + H + 12}`} className="mt-line" markerEnd="url(#mt-pipe-arrow-m)" />
              )}
            </g>
          ))}
        </svg>
      </MTFigure>
    );
  }

  // 총폭: Playing 790 + 154 = 944 < 960 ✓
  return (
    <MTFigure kicker={p.title} caption={p.caption} label={label}>
      <svg viewBox="0 0 960 306" className="mt-svg">
        {arrow('mt-pipe-arrow')}
        <MTBox x={16} y={26} w={270} h={92} tag={p.outside.tag} title={p.outside.items[0]} sub={p.outside.items[1]} tone="outside" />
        <line x1="286" x2="316" y1="72" y2="72" className="mt-line" markerEnd="url(#mt-pipe-arrow)" />
        <MTBox x={320} y={26} w={210} h={92} tag={p.entry.tag} title={p.entry.title} sub={p.entry.sub} tone="accent" />
        <line x1="530" x2="560" y1="72" y2="72" className="mt-line" markerEnd="url(#mt-pipe-arrow)" />
        <MTBox x={564} y={26} w={210} h={92} tag={p.boot.tag} title={p.boot.title} sub={p.boot.sub} />

        <path d="M669 118 V152 H134 V172" className="mt-line" markerEnd="url(#mt-pipe-arrow)" />
        {p.phases.map((phase, i) => {
          const x = 16 + i * 252;
          return (
            <g key={phase[0]}>
              <MTBox x={x} y={174} w={236} h={62} title={phase[0]} sub={phase[1]} />
              {i < 2 && <line x1={x + 236} x2={x + 250} y1="205" y2="205" className="mt-line" markerEnd="url(#mt-pipe-arrow)" />}
            </g>
          );
        })}
        <line x1="756" x2="786" y1="205" y2="205" className="mt-line" markerEnd="url(#mt-pipe-arrow)" />
        <MTBox x={790} y={174} w={154} h={62} title={p.state.title} tone="accent" />
        {/* 경계선은 시간축이 아니라 소유권이다 — 왼쪽이 외부, 오른쪽부터 전부 씬 안. */}
        <line x1="303" x2="303" y1="8" y2="146" stroke="var(--terra-300)" strokeDasharray="4 5" />
        <text x={311} y={12} className="mt-t-cut">여기부터 씬 안 — 전투씬은 바깥을 모른다</text>
        <text x={16} y={266} className="mt-t-note">{p.phaseNote}</text>
      </svg>
    </MTFigure>
  );
}
window.MTPagePipeline = MTPagePipeline;

/* ─── 03 적재 정책 ────────────────────────────────────────
   시간축이 있는 그림이다 — 왼쪽이 취득, 오른쪽이 반납·유예·언로드.
   두 레인의 차이가 곧 정책 값(Always / Preloadable)의 차이다. */
function MTPageResidency({ residency }) {
  const narrow = useMTNarrow();
  const r = residency;
  const label = 'Always 정책은 즉시 상주하고 Preloadable 정책은 취득 시점에 비동기 로드와 프레임 분산 프리워밍을 거치며, 반납 뒤 유예가 지나면 언로드된다';

  const pill = (x, y, w, text, tone) => (
    <g key={text + x + y}>
      <rect x={x} y={y} width={w} height="38" rx="19"
            fill={tone === 'drop' ? 'var(--paper)' : tone === 'accent' ? 'var(--sage-100)' : 'var(--paper-2)'}
            stroke={tone === 'drop' ? 'var(--rule-2)' : tone === 'accent' ? 'var(--sage-500)' : 'var(--rule-2)'}
            strokeDasharray={tone === 'drop' ? '4 3' : undefined} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" className="mt-t-node">{text}</text>
    </g>
  );

  if (narrow) {
    const rows = [];
    let y = 34;
    r.lanes.forEach((lane) => {
      rows.push({ kind: 'head', text: lane.tag + ' · ' + lane.note, y: y - 10 });
      lane.steps.forEach((step) => { rows.push({ kind: 'pill', text: step, y }); y += 48; });
      y += 26;
    });
    rows.push({ kind: 'head', text: '반납 이후', y: y - 10 });
    r.release.forEach((step) => { rows.push({ kind: 'pill', text: step, y, tone: 'drop' }); y += 48; });
    return (
      <MTFigure kicker={r.title} caption={r.caption} label={label}>
        <svg viewBox={`0 0 340 ${y}`} className="mt-svg narrow">
          {rows.map((row) => row.kind === 'head'
            ? <text key={row.text} x={12} y={row.y} className="mt-t-lbl">{row.text}</text>
            : pill(12, row.y, 316, row.text, row.tone))}
        </svg>
      </MTFigure>
    );
  }

  // 총폭: 라벨 140 + 4 pill(180) + 3 gap(28) = 140 + 804 = 944 < 960 ✓
  const lane = (y, tag, note, steps, tone) => (
    <g key={tag}>
      <text x={16} y={y + 16} className="mt-t-lbl">{tag}</text>
      <text x={16} y={y + 36} className="mt-t-sub">{note}</text>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          {pill(140 + i * 208, y, 180, step, i === steps.length - 1 ? tone : undefined)}
          {i < steps.length - 1 && (
            <line x1={140 + i * 208 + 180} x2={140 + (i + 1) * 208 - 4} y1={y + 19} y2={y + 19}
                  className="mt-line" markerEnd="url(#mt-res-arrow)" />
          )}
        </React.Fragment>
      ))}
    </g>
  );

  return (
    <MTFigure kicker={r.title} caption={r.caption} label={label}>
      <svg viewBox="0 0 960 250" className="mt-svg">
        <defs>
          <marker id="mt-res-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
          </marker>
        </defs>
        {lane(14, r.lanes[0].tag, r.lanes[0].note, r.lanes[0].steps, 'accent')}
        {lane(88, r.lanes[1].tag, r.lanes[1].note, r.lanes[1].steps, 'accent')}
        <line x1="16" x2="944" y1="158" y2="158" stroke="var(--rule)" strokeDasharray="2 6" />
        {lane(174, '반납 이후', '참조수가 0 이 된 뒤', r.release, 'drop')}
      </svg>
    </MTFigure>
  );
}
window.MTPageResidency = MTPageResidency;

/* ─── 03 기하 월드 아키텍처 ───────────────────────────────
   양쪽에서 가운데로 모이는 배치가 곧 주장이다 — 바디도 호출자도 서로를 모르고,
   둘을 잇는 것은 월드 하나뿐. 두 화살표의 뜻이 달라서(수명 등록 / 실행 질의) 선을 다르게 그린다. */
function MTPageGeoWorld({ geo }) {
  const narrow = useMTNarrow();
  const g = geo;
  const label = '적·아이템·분신 같은 바디가 활성 상태에 맞춰 기하 월드에 스스로 등록하고, 블레이드·대시·장판·스폰은 월드에 질의만 던진다';

  const defs = (
    <defs>
      <marker id="mt-geo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
      </marker>
      <marker id="mt-geo-arrow-q" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--sage-700)" />
      </marker>
    </defs>
  );

  if (narrow) {
    const row = (x, y, w, text) => (
      <g key={text}>
        <rect x={x} y={y} width={w} height="34" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
        <text x={x + 12} y={y + 22} className="mt-t-item">{text}</text>
      </g>
    );
    return (
      <MTFigure kicker={g.title} caption={g.caption} label={label}>
        <svg viewBox="0 0 340 496" className="mt-svg narrow">
          {defs}
          <text x={12} y={16} className="mt-t-lbl">{g.bodyHead}</text>
          {g.bodies.map((b, i) => row(12, 26 + i * 40, 200, b))}
          <path d="M216 100 H262 V196" className="mt-line" strokeDasharray="4 4" markerEnd="url(#mt-geo-arrow)" />
          <text x={224} y={92} className="mt-t-sub">등록</text>

          <rect x={12} y={198} width="316" height="66" rx="3" fill="var(--sage-100)" stroke="var(--sage-500)" strokeWidth="1.6" />
          <text x={24} y={226} className="mt-t-node">{g.worldTitle}</text>
          <text x={24} y={248} className="mt-t-sub">{g.worldSub}</text>

          <path d="M262 264 V300 H216" className="mt-line q" markerEnd="url(#mt-geo-arrow-q)" />
          <text x={224} y={290} className="mt-t-sub">질의</text>
          <text x={12} y={296} className="mt-t-lbl">{g.callerHead}</text>
          {g.callers.map((c, i) => row(12, 306 + i * 40, 200, c))}
          <text x={12} y={486} className="mt-t-cut">{g.callerEdge}</text>
        </svg>
      </MTFigure>
    );
  }

  // 총폭: 호출자 열 x=700 + w=244 = 944 < 960 ✓
  const col = (x, head, items, headTone) => (
    <g>
      <text x={x} y={18} className={'mt-t-lbl' + (headTone ? ' terra' : '')}>{head}</text>
      {items.map((item, i) => (
        <g key={item}>
          <rect x={x} y={34 + i * 46} width="244" height="36" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
          <text x={x + 14} y={57 + i * 46} className="mt-t-item">{item}</text>
        </g>
      ))}
    </g>
  );

  return (
    <MTFigure kicker={g.title} caption={g.caption} label={label}>
      <svg viewBox="0 0 960 286" className="mt-svg">
        {defs}
        {col(16, g.bodyHead, g.bodies)}
        {col(700, g.callerHead, g.callers)}

        {[0, 1, 2, 3].map((i) => (
          <path key={'reg' + i} d={`M260 ${52 + i * 46} H340 V${114 + i * 6}`} className="mt-line" strokeDasharray="4 4" />
        ))}
        <path d="M340 128 H392" className="mt-line" strokeDasharray="4 4" markerEnd="url(#mt-geo-arrow)" />
        <text x={16} y={230} className="mt-t-sub">{g.bodyEdge}</text>

        <rect x={396} y={92} width="264" height="76" rx="3" fill="var(--sage-100)" stroke="var(--sage-500)" strokeWidth="1.8" />
        <text x={412} y={124} className="mt-t-node">{g.worldTitle}</text>
        <text x={412} y={148} className="mt-t-sub">{g.worldSub}</text>

        {[0, 1, 2, 3].map((i) => (
          <path key={'q' + i} d={`M700 ${52 + i * 46} H660 V${114 + i * 6}`} className="mt-line q" />
        ))}
        <path d="M660 128 H668" className="mt-line q" />
        <path d="M676 128 H664" className="mt-line q" markerEnd="url(#mt-geo-arrow-q)" />
        <text x={700} y={230} className="mt-t-cut">{g.callerEdge}</text>

        <line x1="16" x2="944" y1="248" y2="248" stroke="var(--rule)" />
        <text x={16} y={272} className="mt-t-note">점선 = 수명에 따른 자기 등록 · 실선 = 실행 중 질의. 둘은 서로를 참조하지 않는다</text>
      </svg>
    </MTFigure>
  );
}
window.MTPageGeoWorld = MTPageGeoWorld;

/* ─── 03 왜 자체 기하인가 ─────────────────────────────────
   표가 아니라 선택지 두 장으로 세운다 — 기각한 쪽과 고른 쪽의 대비가 이 절의 논거다. */
function MTPageWhyGeo({ why }) {
  return (
    <figure className="mt-fig mt-fig-compare">
      <figcaption className="mt-fig-kicker">{window.renderInline(why.title)}</figcaption>
      <div className="mt-compare-lead">{window.renderInline(why.lead)}</div>
      <div className="mt-compare">
        <div className="mt-compare-axis">
          <span></span>
          {why.rows.map(([axis]) => <b key={axis}>{axis}</b>)}
        </div>
        {why.cols.map((col, c) => (
          <div className={'mt-compare-col ' + col.tone} key={col.head}>
            <span>{col.head}</span>
            {why.rows.map((row, r) => (
              <b key={row[0]} className={r === why.decisive ? 'decisive' : ''}>{row[c + 1]}</b>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mt-fig-cap">{window.renderInline(why.foot)}</figcaption>
    </figure>
  );
}
window.MTPageWhyGeo = MTPageWhyGeo;

/* ─── 03 배치 렌더 ────────────────────────────────────────
   Before/After 를 같은 축(요청자 수 → 제출 수)으로 그린다.
   왼쪽은 요청자마다 제출이 하나씩 늘고, 오른쪽은 제출이 하나로 고정된다. */
function MTPageBatch({ batch }) {
  const narrow = useMTNarrow();
  const b = batch;
  const label = '요청자마다 캔버스와 오브젝트를 두던 구조에서, 등록만 받고 정점 버퍼 하나에 모아 메시 하나로 그리는 구조로 바꿨다';

  const before = (ox, oy) => (
    <g>
      <text x={ox} y={oy} className="mt-t-lbl terra">{b.beforeHead}</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = ox + (i % 3) * 112, y = oy + 20 + Math.floor(i / 3) * 56;
        return (
          <g key={i}>
            <rect x={x} y={y} width="96" height="40" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
            <rect x={x + 8} y={y + 10} width="52" height="8" rx="4" fill="var(--terra-100)" stroke="var(--terra-400)" />
            <text x={x + 8} y={y + 32} className="mt-t-sub">캔버스</text>
            <line x1={x + 96} y1={y + 20} x2={ox + 372} y2={oy + 40 + i * 22} className="mt-line" />
          </g>
        );
      })}
      <rect x={ox + 372} y={oy + 26} width="52" height="140" rx="3" fill="var(--paper)" stroke="var(--terra-400)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={ox + 380} y={oy + 34 + i * 22} width="36" height="12" rx="2" fill="var(--terra-100)" />
      ))}
      <text x={ox + 398} y={oy + 186} textAnchor="middle" className="mt-t-sub">제출 6</text>
    </g>
  );

  const after = (ox, oy) => (
    <g>
      <text x={ox} y={oy} className="mt-t-lbl">{b.afterHead}</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={ox + 14} cy={oy + 34 + i * 22} r="6" fill="var(--sage-100)" stroke="var(--sage-500)" />
          <line x1={ox + 22} y1={oy + 34 + i * 22} x2={ox + 74} y2={oy + 92} className="mt-line" />
        </g>
      ))}
      <text x={ox + 30} y={oy + 176} className="mt-t-sub">등록만 한다</text>
      <rect x={ox + 78} y={oy + 62} width="180" height="62" rx="3" fill="var(--sage-50)" stroke="var(--sage-500)" />
      <text x={ox + 168} y={oy + 90} textAnchor="middle" className="mt-t-node">정점 버퍼 1개</text>
      <text x={ox + 168} y={oy + 110} textAnchor="middle" className="mt-t-sub">LateUpdate 에 다시 채움</text>
      <line x1={ox + 258} y1={oy + 92} x2={ox + 292} y2={oy + 92} className="mt-line" markerEnd="url(#mt-batch-arrow)" />
      <rect x={ox + 296} y={oy + 70} width="120" height="46" rx="3" fill="var(--sage-100)" stroke="var(--sage-700)" />
      <text x={ox + 356} y={oy + 98} textAnchor="middle" className="mt-t-node">제출 1</text>
    </g>
  );

  const defs = (
    <defs>
      <marker id="mt-batch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
      </marker>
    </defs>
  );

  if (narrow) {
    /* 축소(scale)로 줄이면 글자가 0.72 배가 돼 8.03px 로 떨어진다(390 실측).
       그래서 좁은 폭 전용으로 다시 그린다 — 요청자 4개로 줄이고 세로로 쌓는다. */
    const n = 4;
    return (
      <MTFigure kicker={b.title} caption={b.caption} label={label}>
        <svg viewBox="0 0 340 470" className="mt-svg narrow">
          {defs}
          <text x={12} y={16} className="mt-t-lbl terra">{b.beforeHead}</text>
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <rect x={12} y={28 + i * 38} width="150" height="30" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
              <rect x={20} y={38 + i * 38} width="44" height="8" rx="4" fill="var(--terra-100)" stroke="var(--terra-400)" />
              <text x={74} y={48 + i * 38} className="mt-t-sub">캔버스</text>
              <line x1={162} y1={43 + i * 38} x2={236} y2={44 + i * 34} className="mt-line" />
            </g>
          ))}
          <rect x={236} y={28} width="46" height="140" rx="3" fill="var(--paper)" stroke="var(--terra-400)" />
          {Array.from({ length: n }, (_, i) => (
            <rect key={i} x={244} y={36 + i * 34} width="30" height="12" rx="2" fill="var(--terra-100)" />
          ))}
          <text x={259} y={188} textAnchor="middle" className="mt-t-sub">제출 {n}</text>

          <line x1="12" x2="328" y1="212" y2="212" stroke="var(--rule)" strokeDasharray="2 6" />

          <text x={12} y={244} className="mt-t-lbl">{b.afterHead}</text>
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <circle cx={24} cy={266 + i * 28} r="6" fill="var(--sage-100)" stroke="var(--sage-500)" />
              <line x1={32} y1={266 + i * 28} x2={86} y2={310} className="mt-line" />
            </g>
          ))}
          <rect x={90} y={286} width="150" height="52" rx="3" fill="var(--sage-50)" stroke="var(--sage-500)" />
          <text x={165} y={310} textAnchor="middle" className="mt-t-node">정점 버퍼 1개</text>
          <text x={165} y={328} textAnchor="middle" className="mt-t-sub">LateUpdate 에 다시 채움</text>
          <line x1={240} y1={312} x2={264} y2={312} className="mt-line" markerEnd="url(#mt-batch-arrow)" />
          <rect x={268} y={294} width="60" height="36" rx="3" fill="var(--sage-100)" stroke="var(--sage-700)" />
          <text x={298} y={317} textAnchor="middle" className="mt-t-node">제출 1</text>

          <text x={12} y={404} className="mt-t-lbl">{b.keyLabel}</text>
          <text x={12} y={432} className="mt-t-cut">{b.result}</text>
          <text x={12} y={458} className="mt-t-sub">요청자 4개는 그림용 — 실제 수와 무관하다</text>
        </svg>
      </MTFigure>
    );
  }

  // 총폭: after 오프셋 500 + 416 = 916 < 960 ✓
  return (
    <MTFigure kicker={b.title} caption={b.caption} label={label}>
      <svg viewBox="0 0 960 288" className="mt-svg">
        {defs}
        {before(16, 28)}
        <line x1="470" x2="470" y1="20" y2="230" stroke="var(--rule)" strokeDasharray="2 6" />
        {after(500, 28)}
        <line x1="16" x2="944" y1="248" y2="248" stroke="var(--rule)" />
        <text x={16} y={272} className="mt-t-lbl">{b.keyLabel}</text>
        <text x={944} y={272} textAnchor="end" className="mt-t-cut">{b.result}</text>
      </svg>
    </MTFigure>
  );
}
window.MTPageBatch = MTPageBatch;

/* ─── 04 디스패치 행렬 ────────────────────────────────────
   상자에 글자를 넣은 그림이 아니다 — 칸의 위치가 (바디 모양, 질의 모양) 조합이고
   칸의 내용이 그 조합에서 실제로 불리는 커널이다. 마지막 열이 비어 있지 않고
   "캡슐 열 반복"인 것이 곧 "질의 4종인데 모양은 3종"의 증거다. */
function MTPageMatrix({ matrix }) {
  return (
    <MTFigure kicker={matrix.title} caption={matrix.caption} className="mt-fig-plain"
      label="바디 모양과 질의 모양 조합별로 호출되는 기하 커널 행렬">
      <div className="mt-matrixwrap">
        <table className="mt-matrix">
          <thead>
            <tr>
              <th scope="col"><span className="mt-matrix-corner">{matrix.bodyHead} ↓ / {matrix.queryHead} →</span></th>
              {matrix.queries.map((q) => <th scope="col" key={q}>{q}</th>)}
            </tr>
          </thead>
          <tbody>
            {matrix.bodies.map((body, r) => (
              <tr key={body}>
                <th scope="row">{body}</th>
                {matrix.cells[r].map((cell, c) => (
                  <td key={c} className={c === matrix.cells[r].length - 1 ? 'reuse' : ''}><code>{cell}</code></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-matrix-foot">{window.renderInline(matrix.helpers)}</p>
    </MTFigure>
  );
}
window.MTPageMatrix = MTPageMatrix;

/* ─── Hero 3칸 ───────────────────────────────────────────
   큰 숫자 밴드가 아니다. 개선 전후를 비교할 계측본이 없어 히어로에 올릴 성과 수치가 없다.
   세 칸은 만든 것을 적고 아래 절로 가는 앵커 역할을 한다. */
function MTBuilt({ items }) {
  return (
    <div className="mt-built">
      {items.map(it => {
        const Tag = it.href ? 'a' : 'div';
        return (
          <Tag className="mt-built-cell" key={it.title} href={it.href}>
            <div className="mt-built-kind">{it.kind}</div>
            <div className="mt-built-t">{window.renderInline(it.title)}</div>
            <div className="mt-built-s">{window.renderInline(it.sub)}</div>
          </Tag>
        );
      })}
    </div>
  );
}
window.MTBuilt = MTBuilt;

/* ══ 덱 전용 레거시 ═══════════════════════════════════════
   pages/deck/motelet.js 가 vizComponent 이름으로 참조한다. 페이지는 안 쓴다. */

function MTGeoArchViz({ caption }) {
  const W = 760, H = 262;
  const cols = [
    { x: 16,  w: 140, t: '호출자',       items: ['블레이드 매 프레임', '대시 스윕 1회', '장판 · 밀대', '스폰 · 배치'] },
    { x: 186, w: 170, t: '질의 4종',      items: ['원', '캡슐', '회전 사각', '캡슐 다발'] },
    { x: 386, w: 150, t: '모양 디스패치', items: ['바디 = 원', '바디 = 캡슐', '× 질의 모양', '→ 커널 선택'] },
    { x: 566, w: 178, t: '수학 커널 7',   items: ['원-원 · 원-캡슐', '원-사각 · 캡슐-캡슐', '캡슐-사각', '선분 · 점 거리'] },
  ];
  const top = 44, boxH = 176;

  return (
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

function MTGoldDecompViz() {
  const W = 760, H = 268;
  const box = (x, y, w, h, t, s, tone) => (
    <g key={t}>
      <rect x={x} y={y} width={w} height={h} rx="3"
            fill={tone === 'root' ? 'var(--sage-100)' : tone === 'mid' ? 'var(--paper-2)' : 'var(--paper)'}
            stroke={tone === 'root' ? 'var(--sage-500)' : 'var(--rule-2)'}
            strokeWidth={tone === 'root' ? 1.8 : 1} />
      <text x={x + w / 2} y={y + (s ? 22 : h / 2 + 5)} textAnchor="middle"
            className={tone === 'root' ? 'mt-svg-lbl root' : 'mt-svg-lbl'}>{t}</text>
      {s && <text x={x + w / 2} y={y + 39} textAnchor="middle" className="mt-svg-sub">{s}</text>}
    </g>
  );
  const elbow = (x1, y1, x2, y2, mid) => (
    <polyline key={`${x1}${y1}${y2}`} points={`${x1},${y1} ${mid},${y1} ${mid},${y2} ${x2},${y2}`}
              fill="none" stroke="var(--rule-2)" />
  );
  const op = (x, y, t) => (
    <g key={`op${x}${y}`}>
      <circle cx={x} cy={y} r="11" fill="var(--paper)" stroke="var(--sage-500)" />
      <text x={x} y={y + 5} textAnchor="middle" className="mt-svg-op">{t}</text>
    </g>
  );

  return (
    <figure className="mt-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-svg" role="img"
           aria-label="한 판의 골드는 처치 수와 처치당 골드의 곱이고, 처치 수는 처치율과 버틴 시간의 곱이며, 처치율은 공격력 항과 스폰 항 중 작은 쪽이다">
        {elbow(156, 146, 206, 76, 181)}
        {elbow(156, 146, 206, 216, 181)}
        {elbow(356, 76, 406, 44, 381)}
        {elbow(356, 76, 406, 110, 381)}
        {elbow(546, 44, 596, 28, 571)}
        {elbow(546, 44, 596, 74, 571)}
        {op(181, 146, '×')}
        {op(381, 76, '×')}
        <text x={571} y={48} textAnchor="middle" className="mt-svg-op">min</text>
        {box(16, 118, 140, 56, '한 판의 골드', null, 'root')}
        {box(206, 52, 150, 48, '처치 수', null, 'mid')}
        {box(206, 192, 150, 48, '처치당 골드', '적 분포의 기대값', 'leaf')}
        {box(406, 22, 140, 44, '처치율', null, 'mid')}
        {box(406, 88, 140, 44, '버틴 시간', '스태미나 ÷ 소모', 'leaf')}
        {box(596, 8, 148, 40, '공격력 항', null, 'leaf')}
        {box(596, 54, 148, 40, '스폰 항', null, 'leaf')}
      </svg>
      <figcaption className="mt-figcap">
        스킬이 무엇을 올리든 <b>이 잎 중 하나를 움직인다.</b> 그래서 노드 하나의 값을 같은 단위로 잰다.
        <br />공격력 항 = Σ(발동빈도 × 동시타격 수 × 치사율) · 스폰 항 = 공급량 ÷ 스폰 간격.
        둘 중 <b>작은 쪽</b>이 그 레벨의 병목이다.
      </figcaption>
    </figure>
  );
}
window.MTGoldDecompViz = MTGoldDecompViz;
