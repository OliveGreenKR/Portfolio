// pages/labs/sound-system/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 계측본이 하나도 없다.
//         셋 다 원리도다 — 옮겨 온 시점의 모양 · 요청 하나가 지나는 길 · 사본 둘과 두 번 간 수정.
//         눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.sd-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 sd-svg-note 를 붙인다 — 900px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         그 내용은 figcaption 이 미리 받아 둔다. 라벨과 짝인 기호(✕ 등)는 같은 g 로 묶는다 —
//         라벨만 숨기면 뜻 없는 기호가 남는다.
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
  const BOX = { x: 40, w: 680 }; // 매니저 상자 40..720
  // 칩은 둘만 둔다. 다섯을 늘어놓으면 페이지가 다시 쓰지 않는 이름 넷이 히어로에 남는다.
  // 안쪽 칩 2개: 2×320 + 1×28 = 668, 시작 46 → 46..714 < 720 ✓
  const CH = { w: 320, gap: 28, y: 86, h: 46 };
  const chipX = i => 46 + i * (CH.w + CH.gap);
  const inner = ['재생 정책 — 풀 · 믹서 · 크로스페이드', '클립 취득'];

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
        상자가 하나라 <b>클립 취득</b>이 재생 정책과 같은 자리에 있고,
        아래 여섯은 쓰이는 시점도 크기도 다른데 줄이 하나뿐이라 전부 같은 대우를 받는다.
      </figcaption>
    </figure>
  );
}
window.SDBeforeViz = SDBeforeViz;

/* ─── V2 · 요청 하나가 지나는 길 ─────────────────────── */
/* §02 의 b(즉시 재생)와 c(구간 수명)가 한 경로 위 어디에 놓이는지를 보인다.
   a(로드 방식 축)는 데이터 선택이라 경로 그림에 놓을 자리가 없어 넣지 않았다.
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
        아래로 한 번 돈 클립은 <b>점선</b>을 타고 위 갈래로 올라와 그다음부터 기다리는 쪽에 서지 않고,
        아래 띠는 참조가 끊긴 뒤에도 곧바로 버리지 않아 되돌아올 자리를 남긴다.
      </figcaption>
    </figure>
  );
}
window.SDPathViz = SDPathViz;

/* ─── V3 · 복제본 둘과 두 번 간 수정 ─────────────────── */
/* §04 의 결론. 처음에는 아래 칸을 한 덩이로 그렸다가 실코드에 반증당했다 —
   두 어셈블리는 서로를 참조하지 않고 공유 코드가 0줄이다. 사본 둘로 다시 그린다.
   이 그림의 몫은 "고침 화살표가 두 개"라는 것 하나다. */
function SDReuseViz() {
  const W = 760, H = 340;
  // 좌 40..340, 우 420..720 / 하단 고침 띠 40..720 — 가운데 80 이 라벨 자리 < 760 ✓
  const Lx = 40, Rx = 420, CW = 300;
  const mid = (Lx + CW + Rx) / 2; // 380

  const stack = (x, title, rows) => (
    <g>
      <text x={x + 4} y="28" className="sd-svg-lbl root">{title}</text>
      <rect x={x} y="40" width={CW} height="110" rx="4"
            fill="var(--paper-2)" stroke="var(--rule-2)" />
      <text x={x + 14} y="62" className="sd-svg-tag">재생 정책 — 따로 짰다</text>
      {/* 항목 나열은 아래 표가 진다. 그림에는 한 줄만 둔다. */}
      <text x={x + 14} y="94" className="sd-svg-sub">{rows}</text>
      <rect x={x} y="162" width={CW} height="62" rx="4"
            fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
      <text x={x + 14} y="184" className="sd-svg-lbl ok">리소스 관리 — 사본</text>
      <text x={x + 14} y="206" className="sd-svg-sub">참조 수 · 지연 해제 · 합류 · 취소</text>
    </g>
  );

  return (
    <figure className="sd-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="sd-svg" role="img"
           aria-label="두 시스템은 리소스 관리 코드를 공유하지 않고 각자 사본을 들고 있어, 같은 수정이 양쪽에 각각 들어갔다">
        {stack(Lx, '사운드', '로드 방식 · 핸들 · 풀을 각자 정했다')}
        {stack(Rx, '이펙트', '로드 방식 · 핸들 · 풀을 각자 정했다')}

        {/* 사본 둘 사이 — 참조가 없다.
            ✕ 와 라벨을 한 g 로 묶는다. 라벨만 숨기면 폰에서 뜻 없는 ✕ 만 남는다. */}
        <line x1={Lx + CW + 8} x2={Rx - 8} y1="193" y2="193"
              stroke="var(--rule-2)" strokeWidth="1.3" strokeDasharray="4 4" />
        <g className="sd-svg-note">
          <text x={mid} y="188" textAnchor="middle" className="sd-svg-lbl accent">✕</text>
          <text x={mid} y="212" textAnchor="middle" className="sd-svg-tag">참조 없음</text>
        </g>

        {/* 한 달 뒤 같은 수정이 각각 */}
        <line x1={Lx} x2={Rx + CW} y1="252" y2="252" stroke="var(--rule)" />
        <rect x={mid - 118} y="266" width="236" height="30" rx="3"
              fill="var(--terra-50)" stroke="var(--terra-400)" strokeWidth="1.5" />
        <text x={mid} y="286" textAnchor="middle" className="sd-svg-lbl accent">취소 토큰 수정 — 커밋 하나</text>
        <path d={`M${mid - 118} 281 L${Lx + CW / 2} 281 L${Lx + CW / 2} 232`}
              fill="none" stroke="var(--terra-400)" strokeWidth="1.5" />
        <polygon points={`${Lx + CW / 2},226 ${Lx + CW / 2 - 5},235 ${Lx + CW / 2 + 5},235`} fill="var(--terra-400)" />
        <path d={`M${mid + 118} 281 L${Rx + CW / 2} 281 L${Rx + CW / 2} 232`}
              fill="none" stroke="var(--terra-400)" strokeWidth="1.5" />
        <polygon points={`${Rx + CW / 2},226 ${Rx + CW / 2 - 5},235 ${Rx + CW / 2 + 5},235`} fill="var(--terra-400)" />
      </svg>
      <figcaption className="sd-figcap">
        아래 두 칸은 <b>같은 코드가 아니라 사본 둘</b>이다. 한 달 뒤 취소 토큰 수정이
        양쪽으로 갈라져 들어간 것이 그 증거다 — 설계는 리소스 종류를 안 탔지만, 코드는 한 벌이 아니었다.
      </figcaption>
    </figure>
  );
}
window.SDReuseViz = SDReuseViz;
