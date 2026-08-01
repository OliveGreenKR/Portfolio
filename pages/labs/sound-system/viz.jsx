// pages/labs/sound-system/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 계측본이 하나도 없다.
//         셋 다 원리도다 — 옮겨 온 시점의 모양 · 요청 하나가 지나는 길 · 두 시스템의 갈린 자리.
//         눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.sd-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 sd-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         그 내용은 figcaption 이 미리 받아 둔다.
// 규칙 5: 앞선 그림이 뒤 절의 개념을 미리 그리지 않는다.
//         V1(히어로)은 "가르기 전"만 보인다 — 어디를 어떻게 가를지는 §02·§03 이 말한다.

/* ─── 만든 것 3칸 ────────────────────────────────────── */
function SDBuilt({ items }) {
  const ri = window.renderInline;
  return (
    <div className="sd-built">
      {items.map(it => (
        <div className="sd-built-cell" key={it.title}>
          <div className="sd-built-kind">{it.kind}</div>
          <div className="sd-built-t">{ri(it.title)}</div>
          <div className="sd-built-s">{ri(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.SDBuilt = SDBuilt;

/* ─── V1 · 옮겨 온 시점의 모양 ───────────────────────── */
/* 히어로 그림. 클립을 손에 넣는 일이 나머지와 같은 상자 안에 있고,
   클립 쪽에는 선택지가 없다는 것만 보인다. 어디를 가를지는 그리지 않는다. */
function SDBeforeViz() {
  const W = 760, H = 292;
  // 매니저 상자 40..720. 안쪽 칩 5개: 5×124 + 4×12 = 668, 시작 46 → 46..714 < 720 ✓
  const BOX = { x: 40, w: 680 };
  const CH = { w: 124, gap: 12, y: 86, h: 46 };
  const chipX = i => 46 + i * (CH.w + CH.gap);
  const inner = ['키로 찾기', '정책 게이트', '소스 풀', '크로스페이드', '클립 취득'];

  // 클립 띠 40..720. 안쪽 6개: 6×100 + 5×10 = 650, 시작 55 → 55..705 ✓
  const CL = { w: 100, gap: 10, y: 216, h: 34 };
  const clipX = i => 55 + i * (CL.w + CL.gap);
  const clips = ['타격음', '발소리', 'UI 클릭', '전투 BGM', '메뉴 BGM', '보스 BGM'];

  return (
    <figure className="sd-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sd-svg" role="img"
           aria-label="옮겨 온 시점에는 클립 취득이 재생 정책과 같은 상자 안에 있었고 모든 클립이 메모리에 상주했다">
        <text x={BOX.x + 4} y="30" className="sd-svg-lbl root">사운드 매니저 — 한 덩이</text>
        <rect x={BOX.x} y="44" width={BOX.w} height="112" rx="4"
              fill="var(--paper-2)" stroke="var(--rule-2)" />
        {inner.map((t, i) => {
          const last = i === inner.length - 1;
          return (
            <g key={t}>
              <rect x={chipX(i)} y={CH.y} width={CH.w} height={CH.h} rx="3"
                    fill={last ? 'var(--terra-50)' : 'var(--paper)'}
                    stroke={last ? 'var(--terra-400)' : 'var(--rule-2)'}
                    strokeWidth={last ? 1.6 : 1} />
              <text x={chipX(i) + CH.w / 2} y={CH.y + 28} textAnchor="middle"
                    className={last ? 'sd-svg-lbl accent' : 'sd-svg-sub'}>{t}</text>
            </g>
          );
        })}

        <line x1={BOX.x + BOX.w / 2} x2={BOX.x + BOX.w / 2} y1="164" y2="184"
              stroke="var(--rule-2)" />
        <polygon points={`${BOX.x + BOX.w / 2},188 ${BOX.x + BOX.w / 2 - 5},180 ${BOX.x + BOX.w / 2 + 5},180`}
                 fill="var(--rule-2)" />

        <rect x={BOX.x} y="198" width={BOX.w} height="70" rx="4"
              fill="var(--paper)" stroke="var(--rule)" strokeDasharray="5 4" />
        {clips.map((t, i) => (
          <g key={t}>
            <rect x={clipX(i)} y={CL.y} width={CL.w} height={CL.h} rx="3"
                  fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={clipX(i) + CL.w / 2} y={CL.y + 22} textAnchor="middle" className="sd-svg-sub">{t}</text>
          </g>
        ))}
        <text x={BOX.x + BOX.w / 2} y="262" textAnchor="middle" className="sd-svg-tag sd-svg-note">
          전부 메모리에 올라와 있다 — 클립마다 다르게 할 방법이 없다
        </text>
      </svg>
      <figcaption className="sd-figcap">
        상자가 하나라 <b>클립을 손에 넣는 일</b>이 재생 정책과 같은 자리에 있다.
        아래 여섯은 쓰이는 시점도 크기도 다르지만 줄이 하나뿐이라 전부 같은 대우를 받는다.
      </figcaption>
    </figure>
  );
}
window.SDBeforeViz = SDBeforeViz;

/* ─── V2 · 요청 하나가 지나는 길 ─────────────────────── */
/* §02 의 셋(로드 방식 선택 · 즉시 재생 · 구간 수명)이 한 경로 위 어디에 놓이는지를 보인다.
   본문은 순서를 말하고, 그림은 두 갈래가 되돌아 합쳐지는 지점을 말한다. */
function SDPathViz() {
  const W = 760, H = 344;
  // 상단 갈래 최대 x = 430 + 130 = 560. 하단 갈래 최대 x = 560 + 130 = 690 < 760 ✓
  const box = (x, y, w, h, t, tone) => (
    <g key={t + x}>
      <rect x={x} y={y} width={w} height={h} rx="3"
            fill={tone === 'hit' ? 'var(--sage-50)' : tone === 'ask' ? 'var(--paper-3)' : 'var(--paper)'}
            stroke={tone === 'hit' ? 'var(--sage-500)' : tone === 'ask' ? 'var(--ink-3)' : 'var(--rule-2)'}
            strokeWidth={tone === 'hit' || tone === 'ask' ? 1.6 : 1} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle"
            className={tone === 'hit' ? 'sd-svg-lbl ok' : 'sd-svg-lbl'}>{t}</text>
    </g>
  );
  const arrow = (x1, x2, y, tone) => (
    <g key={`a${x1}-${y}`}>
      <line x1={x1} x2={x2 - 8} y1={y} y2={y} stroke={tone || 'var(--rule-2)'} strokeWidth="1.5" />
      <polygon points={`${x2},${y} ${x2 - 9},${y - 5} ${x2 - 9},${y + 5}`} fill={tone || 'var(--rule-2)'} />
    </g>
  );

  // 해제 띠: 3×212 + 2×16 = 668, 시작 20 → 20..688 < 760 ✓
  const REL = { w: 212, gap: 16, y: 292, h: 36 };
  const relX = i => 20 + i * (REL.w + REL.gap);
  const rel = ['재생이 끝나면 참조를 하나 뺀다', '0이 되어도 바로 안 버린다', '그 사이 다시 부르면 그대로 쓴다'];

  return (
    <figure className="sd-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sd-svg" role="img"
           aria-label="재생 요청은 먼저 동기로 물어보고, 있으면 같은 프레임에 재생하며, 없을 때만 비동기로 올린 뒤 다음 요청부터 동기 경로로 돌아온다">
        {box(20, 138, 104, 46, '재생 요청')}
        {arrow(124, 160, 161)}
        {box(160, 130, 150, 62, '있는지 먼저 묻는다', 'ask')}

        {/* 위 갈래 — 있으면 그 프레임에 */}
        <path d="M310 150 L370 150 L370 90 L422 90" fill="none" stroke="var(--sage-500)" strokeWidth="1.6" />
        <polygon points="430,90 421,85 421,95" fill="var(--sage-500)" />
        <text x="376" y="78" className="sd-svg-tag ok">있다</text>
        {box(430, 66, 130, 48, '그 프레임에 재생', 'hit')}

        {/* 아래 갈래 — 없으면 올린다 */}
        <path d="M310 172 L340 172 L340 228 L372 228" fill="none" stroke="var(--terra-400)" strokeWidth="1.6" />
        <polygon points="380,228 371,223 371,233" fill="var(--terra-400)" />
        <text x="346" y="216" className="sd-svg-tag">없다</text>
        {box(380, 204, 140, 48, '올리고 기다린다')}
        {arrow(520, 560, 228)}
        {box(560, 204, 130, 48, '재생')}

        {/* 되돌아오는 점선 — 한 번 올라오면 위 경로로 */}
        <path d="M450 204 L450 118 L235 118 L235 196" fill="none"
              stroke="var(--sage-500)" strokeWidth="1.3" strokeDasharray="5 4" />
        <polygon points="235,192 230,201 240,201" fill="var(--sage-500)" />
        <text x="342" y="112" textAnchor="middle" className="sd-svg-sub sd-svg-note">
          한 번 올라오면 다음 요청은 위로 간다
        </text>

        {/* 해제 띠 */}
        <line x1="20" x2="740" y1="272" y2="272" stroke="var(--rule)" />
        {rel.map((t, i) => (
          <g key={t}>
            <rect x={relX(i)} y={REL.y} width={REL.w} height={REL.h} rx="3"
                  fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={relX(i) + REL.w / 2} y={REL.y + 23} textAnchor="middle" className="sd-svg-sub">{t}</text>
          </g>
        ))}
      </svg>
      <figcaption className="sd-figcap">
        두 갈래는 <b>같은 물음</b> 하나에서 갈린다. 아래로 한 번 돈 클립은 점선을 타고 위 갈래로 올라와,
        그다음부터는 기다리는 쪽에 서지 않는다. 아래 띠가 그 반대 방향 — 참조가 끊긴 뒤에도
        곧바로 버리지 않아 되돌아올 자리를 남긴다.
      </figcaption>
    </figure>
  );
}
window.SDPathViz = SDPathViz;

/* ─── V3 · 모듈 하나 위에 선 두 시스템 ───────────────── */
/* §04 의 결론. 새로 짠 것과 그대로 쓴 것의 경계를 위치로 보인다.
   모듈 칸은 좌우로 나누지 않고 하나로 그린다 — 같은 것을 두 번 그리면 "둘" 로 읽힌다. */
function SDReuseViz() {
  const W = 760, H = 330;
  // 좌 40..340, 우 420..720 / 모듈 띠 40..720 — 가운데 80 이 라벨 자리 < 760 ✓
  const Lx = 40, Rx = 420, CW = 300;
  const mid = (Lx + CW + Rx) / 2; // 380

  const policy = (x, title, rows) => (
    <g>
      <text x={x + 4} y="30" className="sd-svg-lbl root">{title}</text>
      <rect x={x} y="44" width={CW} height="128" rx="4"
            fill="var(--paper-2)" stroke="var(--rule-2)" />
      <text x={x + 14} y="68" className="sd-svg-tag">재생 정책 — 새로 짰다</text>
      {rows.map((t, i) => (
        <text key={t} x={x + 14} y={98 + i * 24} className="sd-svg-sub">{t}</text>
      ))}
      {/* 정책 → 모듈 : 둘 다 같은 것을 부른다 */}
      <line x1={x + CW / 2} x2={x + CW / 2} y1="172" y2="204" stroke="var(--sage-500)" strokeWidth="1.5" />
      <polygon points={`${x + CW / 2},210 ${x + CW / 2 - 5},201 ${x + CW / 2 + 5},201`} fill="var(--sage-500)" />
    </g>
  );

  return (
    <figure className="sd-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sd-svg" role="img"
           aria-label="사운드와 이펙트는 재생 정책만 각각 새로 짰고, 그 아래 리소스 관리 모듈은 하나를 함께 쓴다">
        {policy(Lx, '사운드', ['로드 방식 둘', '핸들 없음 — 틀면 끝', '소스 풀 하나'])}
        {policy(Rx, '이펙트', ['로드 방식 셋', '재생마다 핸들', '프리팹마다 풀'])}

        <text x={mid} y="104" textAnchor="middle" className="sd-svg-lbl accent">≠</text>
        <text x={mid} y="126" textAnchor="middle" className="sd-svg-tag sd-svg-note">겹치는 코드 없음</text>

        {/* 모듈 — 하나만 그린다 */}
        <rect x={Lx} y="212" width={Rx + CW - Lx} height="86" rx="4"
              fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x={Lx + 16} y="238" className="sd-svg-lbl ok">리소스 관리 모듈 — 그대로 썼다</text>
        <text x={Lx + 16} y="264" className="sd-svg-sub">언제 올릴지 · 언제 내릴지 · 참조 수 · 동시 요청 합류 · 지연 해제 · 취소</text>
        <text x={Lx + 16} y="286" className="sd-svg-sub sd-svg-note">
          클립 자리에 프리팹을 넣었을 뿐 — 식별자를 맞춰 대조하면 남는 차이는 셋뿐이다
        </text>
      </svg>
      <figcaption className="sd-figcap">
        새로 짠 것은 <b>위 두 칸</b>뿐이다. 위가 서로 이만큼 다른데도 아래를 한 덩이로 그릴 수 있다는 것이,
        모듈이 자원 종류를 타지 않는다는 증거다 — 세 번째 종류가 와도 늘어나는 것은 위 칸 하나다.
      </figcaption>
    </figure>
  );
}
window.SDReuseViz = SDReuseViz;
