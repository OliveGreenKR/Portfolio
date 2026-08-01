// pages/labs/staring-fire/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 PoC 에는 계측본이 하나도 없다.
//         둘 다 원리도다 — 에너지가 어디로 나가나 · 무엇이 무엇에 닿나. 눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.sf-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 설명 문장에는 sf-svg-note 를 붙인다 — 720px 이하에서 숨겨진다.
// 규칙 5: 앞선 그림이 뒤 절의 개념을 미리 그리지 않는다.
//         V1(§03)은 경계만 말한다 — 게임과 시뮬의 경계는 §04 가 처음 꺼낸다.

/* ─── 만든 것 3칸 ────────────────────────────────────── */
function SFBuilt({ items }) {
  const ri = window.renderInline;
  return (
    <div className="sf-built">
      {items.map(it => (
        <div className="sf-built-cell" key={it.title}>
          <div className="sf-built-kind">{it.kind}</div>
          <div className="sf-built-t">{ri(it.title)}</div>
          <div className="sf-built-s">{ri(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.SFBuilt = SFBuilt;

/* ─── 캡처 넉 장을 한 줄로 ───────────────────────────── */
/* 네 장이 같은 순간이 아니라는 것을 한 곳에서 말해야 하므로 figure 하나로 묶는다. */
function SFGallery({ g }) {
  const ri = window.renderInline;
  return (
    <figure className="sf-gallery">
      <div className="sf-gallery-head">{g.title}</div>
      <div className="sf-gallery-grid">
        {g.shots.map(s => (
          <div className="sf-shot" key={s.src}>
            <div className="sf-shot-tag">{s.tag}</div>
            <img src={s.src} alt={`${s.tag} — ${s.cap}`} />
            <div className="sf-shot-cap">{ri(s.cap)}</div>
          </div>
        ))}
      </div>
      <figcaption className="sf-figcap">{ri(g.note)}</figcaption>
    </figure>
  );
}
window.SFGallery = SFGallery;

/* ─── V1 · 나갈 곳이 있느냐 ──────────────────────────── */
/* §03 두 번째 사고. 같은 상자에 같은 열을 넣었을 때, 닫힌 쪽은 갈 곳이 없다는 것만 보인다.
   "터진다" 를 그리지 않는다 — 발산한 화면의 캡처가 없으므로 결과가 아니라 조건을 그린다. */
function SFBoundaryViz() {
  const W = 760, H = 300;
  // 패널 두 장: 40..360 · 420..740 < 760 ✓
  const PW = 320, Lx = 40, Rx = 420;
  const BOX = { y: 66, h: 168, inset: 44 };   // 상자: x+44 .. x+PW-44 (폭 232)

  const box = (x, openTop) => {
    const bx = x + BOX.inset, bw = PW - BOX.inset * 2;
    const d = openTop
      ? `M${bx} ${BOX.y} L${bx} ${BOX.y + BOX.h} L${bx + bw} ${BOX.y + BOX.h} L${bx + bw} ${BOX.y}`
      : `M${bx} ${BOX.y} L${bx + bw} ${BOX.y} L${bx + bw} ${BOX.y + BOX.h} L${bx} ${BOX.y + BOX.h} Z`;
    return <path d={d} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="2" />;
  };

  // 위로 향하는 흐름 세 줄
  const plume = (x, escape) => {
    const cx = x + PW / 2;
    return [-38, 0, 38].map((dx, i) => {
      const sx = cx + dx * 0.55, ex = cx + dx;
      const topY = escape ? BOX.y - 24 : BOX.y + 16;
      return (
        <g key={i}>
          <path d={`M${sx} ${BOX.y + BOX.h - 20} C ${sx} ${BOX.y + 90}, ${ex} ${BOX.y + 60}, ${ex} ${topY + 10}`}
                fill="none" stroke="var(--terra-400)" strokeWidth="2.4" strokeLinecap="round" />
          <polygon points={`${ex},${topY} ${ex - 5},${topY + 11} ${ex + 5},${topY + 11}`} fill="var(--terra-400)" />
        </g>
      );
    });
  };

  // 닫힌 쪽 — 천장에 부딪혀 옆으로 도는 화살표
  const bounce = (x) => {
    const bx = x + BOX.inset, bw = PW - BOX.inset * 2;
    return (
      <g>
        <path d={`M${bx + 26} ${BOX.y + 30} C ${bx + 14} ${BOX.y + 80}, ${bx + 20} ${BOX.y + 130}, ${bx + 48} ${BOX.y + 140}`}
              fill="none" stroke="var(--rule-2)" strokeWidth="2" strokeDasharray="5 4" />
        <path d={`M${bx + bw - 26} ${BOX.y + 30} C ${bx + bw - 14} ${BOX.y + 80}, ${bx + bw - 20} ${BOX.y + 130}, ${bx + bw - 48} ${BOX.y + 140}`}
              fill="none" stroke="var(--rule-2)" strokeWidth="2" strokeDasharray="5 4" />
      </g>
    );
  };

  return (
    <figure className="sf-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sf-svg" role="img"
           aria-label="사방이 막힌 상자에서는 올라간 흐름이 천장에 막혀 되돌아오고, 천장을 열면 그대로 빠져나간다">
        {[[Lx, '사방이 막혀 있으면', false], [Rx, '천장을 열어 두면', true]].map(([x, t, open]) => (
          <g key={t}>
            <text x={x + BOX.inset} y="34" className="sf-svg-lbl root">{t}</text>
            {open && (
              <line x1={x + BOX.inset} x2={x + PW - BOX.inset} y1={BOX.y} y2={BOX.y}
                    stroke="var(--sage-500)" strokeWidth="2" strokeDasharray="6 5" />
            )}
            {box(x, open)}
            {!open && bounce(x)}
            {plume(x, open)}
            {/* 열원 */}
            <rect x={x + PW / 2 - 26} y={BOX.y + BOX.h - 16} width="52" height="12" rx="2"
                  fill="var(--terra-100)" stroke="var(--terra-400)" />
          </g>
        ))}

        <text x={Lx + PW / 2} y="264" textAnchor="middle" className="sf-svg-tag">
          되돌아와 안에 쌓인다
        </text>
        <text x={Rx + PW / 2} y="264" textAnchor="middle" className="sf-svg-tag ok">
          그대로 빠져나간다
        </text>
        <text x={W / 2} y="290" textAnchor="middle" className="sf-svg-sub sf-svg-note">
          넣는 열의 양은 양쪽이 같다 — 다른 것은 나갈 곳이 있느냐뿐이다
        </text>
      </svg>
      <figcaption className="sf-figcap">
        양쪽에 <b>같은 열</b>을 넣었다. 왼쪽에서 점선이 되돌아오는 자리가 문제의 지점이고,
        감쇠를 키우는 것은 그 되돌아옴을 느리게 할 뿐 없애지 못한다.
      </figcaption>
    </figure>
  );
}
window.SFBoundaryViz = SFBoundaryViz;

/* ─── V2 · 창구 둘 ───────────────────────────────────── */
/* §04. 화살표가 두 개뿐이고 한쪽은 되돌아오지 않는다는 것이 요지다. */
function SFSeamViz() {
  const W = 760, H = 292;
  // 게임 40..300 · 시뮬 460..720 · 가운데 160 이 창구 자리 ✓
  const GX = 40, SX = 460, CW = 260;

  const arrow = (x1, x2, y, tone, dash) => (
    <g>
      <line x1={x1} x2={x2 - 9} y1={y} y2={y} stroke={tone} strokeWidth="2" strokeDasharray={dash} />
      <polygon points={`${x2},${y} ${x2 - 10},${y - 5} ${x2 - 10},${y + 5}`} fill={tone} />
    </g>
  );

  const game = ['장작', '모닥불', '점화 판정', '방 온도 표시'];

  return (
    <figure className="sf-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sf-svg" role="img"
           aria-label="게임 쪽은 주입 하나로만 시뮬에 넣고, 시뮬이 만든 값은 읽기만 해 간다">
        <text x={GX} y="30" className="sf-svg-lbl root">게임 쪽</text>
        <text x={SX} y="30" className="sf-svg-lbl root">시뮬 쪽</text>

        <rect x={GX} y="44" width={CW} height="176" rx="4" fill="var(--paper-2)" stroke="var(--rule-2)" />
        {game.map((g, i) => (
          <g key={g}>
            <rect x={GX + 16} y={60 + i * 40} width={CW - 32} height="30" rx="3"
                  fill="var(--paper)" stroke="var(--rule)" />
            <text x={GX + 28} y={80 + i * 40} className="sf-svg-sub">{g}</text>
          </g>
        ))}

        <rect x={SX} y="44" width={CW} height="176" rx="4"
              fill="var(--terra-50)" stroke="var(--terra-400)" strokeWidth="1.6" />
        <text x={SX + 16} y="72" className="sf-svg-lbl accent">격자 위의 계산</text>
        <text x={SX + 16} y="98" className="sf-svg-sub">속도 · 온도 · 연기</text>
        <text x={SX + 16} y="122" className="sf-svg-sub">매 프레임 갱신</text>
        <line x1={SX + 16} x2={SX + CW - 16} y1="140" y2="140" stroke="var(--terra-200)" />
        <text x={SX + 16} y="164" className="sf-svg-sub">게임 쪽 이름을</text>
        <text x={SX + 16} y="184" className="sf-svg-sub">하나도 모른다</text>

        {/* 창구 둘 */}
        {arrow(GX + CW + 6, SX - 6, 96, 'var(--sage-700)')}
        <text x={(GX + CW + SX) / 2} y="86" textAnchor="middle" className="sf-svg-tag ok">여기에 이만큼 넣어라</text>

        {arrow(SX - 6, GX + CW + 6, 168, 'var(--ink-3)', '5 4')}
        <text x={(GX + CW + SX) / 2} y="158" textAnchor="middle" className="sf-svg-tag">값을 읽어만 간다</text>

        <text x={GX} y="256" className="sf-svg-sub sf-svg-note">
          이 둘 말고는 서로를 부르는 길이 없다 — 태울 것을 새로 만들어도 오른쪽은 그대로다
        </text>
      </svg>
      <figcaption className="sf-figcap">
        화살표가 <b>둘뿐</b>이고, 아래쪽 하나는 <b>읽기만</b> 한다.
        오른쪽 상자가 왼쪽 이름을 하나도 모르기 때문에, 태울 것을 새로 만들어도 시뮬은 손대지 않는다.
      </figcaption>
    </figure>
  );
}
window.SFSeamViz = SFSeamViz;
