// pages/progression-pacing/svg-viz.jsx
//
// SVG 도표 9종 — F01 · F02 · F03 · F04 · F05 · F06 · F08 · F09 · F11.
// (F07 · F10 · F12 는 DOM 도표라 viz.jsx 가 갖는다. 여기서 그리지 않는다.)
//
// ⚠️ 문장을 여기 박지 않는다. 모든 문자열과 수치는 data.js(window.PACING_DATA)에서 온다.
// ⚠️ SVG 글자는 .mp-t-head(22) · .mp-t-value(20) · .mp-t-label(17) · .mp-t-axis(16) 클래스로만.
//    인라인 fontSize 금지, 16 미만 금지. 크기는 page.css 가 소유한다.
// ⚠️ 좌표는 숫자 리터럴. x={170} ✅ / x="170" ❌ — 후자는 x + w/2 가 문자열 연결이 된다.
// ⚠️ marker · pattern · clipPath 의 id 는 그림별 prefix(mp-f02w-…). 한 문서에 SVG 가 18개다.
//
// 색 규약(페이지 전체 불변): terra = 버리는 것·문제·비용 / sage = 채택·유효 출력·본인 기여
//                            ink-3 = 중립·귀속 불가
//
// wide viewBox 폭 960 고정 · narrow viewBox 폭 340 고정. 스왑은 page.css 의 display 가 한다.

(function definePacingSvgVisuals() {
  const P = window.PACING_DATA;
  const RI = window.renderInline;
  const L = P.ladder;

  /* ── 공통 껍데기 ──────────────────────────────────────────── */

  function Fig({ cls, title, caption, children }) {
    return (
      <figure className={'mp-fig ' + cls} data-audit-protected>
        <h3 className="mp-fig-title">{title}</h3>
        {children}
        <figcaption>{RI(caption)}</figcaption>
      </figure>
    );
  }

  // wide/narrow 두 SVG 를 항상 DOM 에 둔다(audit count 고정). 보이는 쪽은 CSS 가 고른다.
  function Svg({ narrow, w, h, label, children }) {
    return (
      <svg className={narrow ? 'mp-svg-narrow' : 'mp-svg-wide'}
           viewBox={'0 0 ' + w + ' ' + h}
           width="100%" style={{ height: 'auto' }}
           preserveAspectRatio="xMidYMid meet"
           role="img" aria-label={label}
           xmlns="http://www.w3.org/2000/svg">
        <title>{label}</title>
        {children}
      </svg>
    );
  }

  // 화살촉 · 빗금. p 는 그림+폭별 prefix(mp-f05w 처럼) — 같은 그림의 wide/narrow 도 서로 다르다.
  function Marks({ p }) {
    return (
      <defs>
        <marker id={p + '-ink'} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
        </marker>
        <marker id={p + '-sage'} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--sage-700)" />
        </marker>
        <marker id={p + '-terra'} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--terra-500)" />
        </marker>
        <pattern id={p + '-hatch'} width={10} height={10}
                 patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill="var(--terra-50)" />
          <line x1={0} y1={0} x2={0} y2={10} stroke="var(--terra-400)" strokeWidth={3.5} />
        </pattern>
        <pattern id={p + '-hatch-ink'} width={10} height={10}
                 patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill="var(--paper-2)" />
          <line x1={0} y1={0} x2={0} y2={10} stroke="var(--ink-3)" strokeWidth={2.5} />
        </pattern>
      </defs>
    );
  }

  /* ── 글자 폭 추정과 줄바꿈 ────────────────────────────────────
     한글은 대략 1em, 라틴은 0.56em, 공백은 0.32em. 상자 폭·줄바꿈 판단에만 쓴다. */

  function textW(s, size) {
    let w = 0;
    const str = String(s);
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c > 0x2e80) w += size;
      else if (str[i] === ' ') w += size * 0.32;
      else w += size * 0.56;
    }
    return w;
  }

  // 폭 기준 그리디 줄바꿈. 공백이 없는 긴 토큰은 강제로 자른다.
  function wrapW(s, size, maxW) {
    const words = String(s).split(' ');
    const lines = [];
    let cur = '';
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      while (textW(word, size) > maxW) {
        const keep = Math.max(1, Math.floor(word.length * maxW / textW(word, size)));
        if (cur) { lines.push(cur); cur = ''; }
        lines.push(word.slice(0, keep));
        word = word.slice(keep);
      }
      const next = cur ? cur + ' ' + word : word;
      if (cur && textW(next, size) > maxW) { lines.push(cur); cur = word; }
      else cur = next;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function Lines({ x, y, dy, lines, cls, anchor }) {
    return lines.map((ln, i) => (
      <text key={i} x={x} y={y + i * dy} className={cls} textAnchor={anchor || 'start'}>{ln}</text>
    ));
  }

  /* ── 계열 마커 모양 ──────────────────────────────────────── */

  function Mk({ shape, x, y, fill, r, cls }) {
    const s = r || 6;
    if (shape === 'circle') return <circle className={cls} cx={x} cy={y} r={s} fill={fill} />;
    if (shape === 'square') return <rect className={cls} x={x - s} y={y - s} width={s * 2} height={s * 2} fill={fill} />;
    if (shape === 'triangle') {
      return <polygon className={cls} fill={fill}
                      points={x + ',' + (y - s) + ' ' + (x + s) + ',' + (y + s * 0.85) + ' ' + (x - s) + ',' + (y + s * 0.85)} />;
    }
    return <polygon className={cls} fill={fill}
                    points={x + ',' + (y - s - 1) + ' ' + (x + s) + ',' + y + ' ' + x + ',' + (y + s + 1) + ' ' + (x - s) + ',' + y} />;
  }

  const log10 = (v) => Math.log(v) / Math.LN10;

  /* ══ F01 — 런 경계 타임라인 ══════════════════════════════════
     전달할 관계: 순서 + 경계 통과. 두 자원 중 골드만 런 경계를 넘는다.
     wide 960×300 / narrow 340×520 (시간축을 90° 세로로 세운다) */

  function PacingF01() {
    const F = P.f01;
    // wide 가로 배치 — 150(레인 시작) · 600(경계) · 930(오른쪽 끝)
    // 150 + 450 = 600 (런 N) ; 600 + 330 = 930 < 960 ✓
    const X0 = 150, XB = 600, X1 = 930;

    const wide = (
      <Svg w={960} h={300} label={F.title}>
        <Marks p="mp-f01w" />

        {/* 경계 */}
        <text x={XB} y={22} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.boundary}</text>
        <line x1={XB} y1={34} x2={XB} y2={252} stroke="var(--ink)" strokeWidth={2.5} strokeDasharray="9 7" />

        <text x={X0} y={54} className="mp-t-head" fill="var(--ink)">{F.runA}</text>
        <text x={XB + 12} y={54} className="mp-t-head" fill="var(--ink)">{F.runB}</text>

        {/* 스태미나 — 자원이 아니라 조건이라 레인과 두께로 구분한다 */}
        <text x={X0} y={72} className="mp-t-axis" fill="var(--ink-3)">{F.stamina}</text>
        <polygon points={X0 + ',78 ' + XB + ',96 ' + XB + ',102 ' + X0 + ',102'}
                 fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth={1.2} />
        <text x={XB + 12} y={102} className="mp-t-axis" fill="var(--terra-500)">{F.staminaEnd}</text>

        {/* 레인 1 — 처치 점수. 경계에서 끊긴다 */}
        <text x={138} y={138} className="mp-t-label" textAnchor="end" fill="var(--ink-2)">{F.laneScore}</text>
        <line x1={X0} y1={132} x2={576} y2={132} stroke="var(--ink-3)" strokeWidth={3} />
        {F.laneScoreNodes.map((n, i) => (
          <g key={i}>
            <circle cx={300 + i * 120} cy={132} r={8} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={2.5} />
            <text x={300 + i * 120} y={116} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{n}</text>
          </g>
        ))}
        <g className="lane-score-end">
          <line x1={576} y1={116} x2={576} y2={148} stroke="var(--ink)" strokeWidth={3} />
          <text x={568} y={162} className="mp-t-axis" textAnchor="end" fill="var(--ink)">{F.laneScoreEnd}</text>
        </g>

        {/* 레인 2 — 골드. 경계를 관통해 다음 런의 시작 조건이 된다 */}
        <text x={138} y={202} className="mp-t-label" textAnchor="end" fill="var(--ink-2)">{F.laneGold}</text>
        <g className="lane-gold-cross">
          <path d={'M ' + X0 + ' 196 H 800 V 172'} fill="none" stroke="var(--sage-700)" strokeWidth={3}
                markerEnd="url(#mp-f01w-sage)" />
        </g>
        <rect x={681} y={189} width={14} height={14} fill="var(--sage-700)" />
        <text x={688} y={224} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{F.laneGoldNode}</text>
        <text x={800} y={160} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{F.laneGoldEnter}</text>

        {/* 확대 표기 — 이 한 칸의 안쪽이 §03(F04)이다 */}
        <path d="M 200 236 V 246 H 380 V 236" fill="none" stroke="var(--ink-3)" strokeWidth={1.6} strokeDasharray="5 4" />
        <path d="M 200 246 L 152 272 M 380 246 L 560 272" fill="none" stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />
        <line x1={152} y1={272} x2={560} y2={272} stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />
        <text x={356} y={292} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.zoom}</text>
        <line x1={X1 - 4} y1={132} x2={X1} y2={132} stroke="var(--paper)" strokeWidth={0.5} />
      </Svg>
    );

    // narrow — 시간이 위→아래. 두 레인이 좌우 두 열. 경계는 가로 파선.
    // 130(점수 열) · 236(골드 열) · 304(스태미나 띠 중심) ; 304 + 12 = 316 < 340 ✓
    const NS = 130, NG = 236, NT = 304;
    const narrow = (
      <Svg narrow w={340} h={520} label={F.title}>
        <Marks p="mp-f01n" />

        <text x={14} y={26} className="mp-t-axis" fill="var(--ink-3)">{F.zoom}</text>
        <path d="M 92 34 V 74 H 118 V 108" fill="none" stroke="var(--ink-3)" strokeWidth={1.4}
              strokeDasharray="5 4" markerEnd="url(#mp-f01n-ink)" />
        <rect x={104} y={116} width={54} height={70} fill="none" stroke="var(--ink-3)"
              strokeWidth={1.4} strokeDasharray="5 4" rx={6} />

        <text x={14} y={62} className="mp-t-head" fill="var(--ink)">{F.runA}</text>
        <text x={NS} y={98} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.laneScore}</text>
        <text x={NG} y={98} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.laneGold}</text>
        <text x={NT} y={98} className="mp-t-axis" textAnchor="middle" fill="var(--terra-500)">{F.stamina.split(' — ')[0]}</text>

        <polygon points="294,112 314,112 314,292 309,292"
                 fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth={1.2} />
        <text x={286} y={306} className="mp-t-axis" textAnchor="end" fill="var(--terra-500)">{F.staminaEnd}</text>

        <line x1={NS} y1={110} x2={NS} y2={284} stroke="var(--ink-3)" strokeWidth={3} />
        {F.laneScoreNodes.map((n, i) => (
          <g key={i}>
            <circle cx={NS} cy={142 + i * 50} r={7} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={2.5} />
            <text x={NS + 14} y={147 + i * 50} className="mp-t-axis" fill="var(--ink-3)">{n}</text>
          </g>
        ))}
        <g className="lane-score-end">
          <line x1={NS - 16} y1={284} x2={NS + 16} y2={284} stroke="var(--ink)" strokeWidth={3} />
          <text x={NS} y={302} className="mp-t-axis" textAnchor="middle" fill="var(--ink)">{F.laneScoreEnd}</text>
        </g>

        <line x1={20} y1={312} x2={326} y2={312} stroke="var(--ink)" strokeWidth={2.5} strokeDasharray="9 7" />
        <text x={170} y={334} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.boundary}</text>

        <g className="lane-gold-cross">
          <path d={'M ' + NG + ' 110 V 360 V 392 H ' + NS + ' V 412'} fill="none"
                stroke="var(--sage-700)" strokeWidth={3} markerEnd="url(#mp-f01n-sage)" />
        </g>
        <rect x={NG - 7} y={345} width={14} height={14} fill="var(--sage-700)" />
        <text x={222} y={378} className="mp-t-label" textAnchor="end" fill="var(--sage-700)">{F.laneGoldNode}</text>

        <text x={14} y={372} className="mp-t-head" fill="var(--ink)">{F.runB}</text>
        <rect x={86} y={418} width={88} height={28} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={1.5} />
        <text x={NS} y={437} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{F.laneGoldEnter}</text>

        <line x1={NS - 16} y1={456} x2={NS + 16} y2={456} stroke="var(--ink-3)" strokeWidth={3} />
        <line x1={NS} y1={456} x2={NS} y2={486} stroke="var(--ink-3)" strokeWidth={3} />
        <text x={14} y={506} className="mp-t-axis" fill="var(--ink-3)">{F.stamina}</text>
      </Svg>
    );

    return <Fig cls="mp-f01" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ F02 — 레벨 사다리 ═══════════════════════════════════════
     전달할 관계: 변화 + 비교. 레벨이 오를수록 저항과 보상의 격차가 벌어진다.
     로그축 상단(절대값 4계열) + 선형 하단(체력당 보상 6막대), x축 공유.
     wide 960×560 / narrow 340×620 (90° 전치 — 행 = 레벨) */

  const T = L.tiers;
  const LVS = L.levels;

  // 계열 4개. 전투 축 2개만 브랜드 색, 진행 축 2개는 무채색 + 파선/점선(위계로 가른다).
  const SERIES = [
    { k: 'hp', vals: T.map((t) => t.hp), label: L.series.hp.label,
      color: 'var(--terra-500)', dash: null, shape: 'circle', tag: 'hp' },
    { k: 'gold', vals: T.map((t) => t.gold), label: L.series.gold.label,
      color: 'var(--sage-700)', dash: null, shape: 'square', tag: 'gold' },
    { k: 'score', vals: T.map((t) => t.score), label: L.series.score.label,
      color: 'var(--ink-3)', dash: '8 5', shape: 'triangle', tag: 'score' },
    { k: 'required', vals: LVS.map((l) => l.required), label: L.series.required.label,
      color: 'var(--ink-3)', dash: '2 5', shape: 'diamond', tag: 'req' }
  ];

  function PacingF02() {
    // ── wide 배치 상수 ──
    // x = 150 + i*150 → 150 · 300 · 450 · 600 · 750 · 900  (F03 이 같은 값을 계승한다)
    // 150 + 5*150 = 900 ; 격자선 140..940 < 960 ✓ ; 배율 캡슐 770 + 174 = 944 < 960 ✓
    const LX = (i) => 150 + i * 150;
    const YT0 = 112, YT1 = 330;                      // 상단 패널(로그) 위·아래
    // YT0 을 112 로 내린 이유: 96 이면 1억 데이터 라벨이 축 설명 줄(y 75..94)과 겹친다(실측)
    const yT = (v) => YT1 - (log10(v) / 8) * (YT1 - YT0);
    const YB1 = 536, BH = 116;                       // 하단 패널(선형) 바닥과 높이
    const yB = (r) => YB1 - (r / 10.5) * BH;
    const LEGX = [150, 250, 470, 600];               // 600 + 34 + 8 + 80 = 722 < 960 ✓

    const wide = (
      <Svg w={960} h={560} label={L.axisNote + ' — ' + L.xAxisLabel}>
        <Marks p="mp-f02w" />

        {/* 범례 — 두 그룹으로 갈라, 색이 아니라 위계로 읽게 한다 */}
        <text x={150} y={44} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.combat}</text>
        <text x={470} y={44} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.progress}</text>
        {SERIES.map((s, i) => (
          <g key={s.k}>
            <line x1={LEGX[i]} y1={64} x2={LEGX[i] + 34} y2={64} stroke={s.color}
                  strokeWidth={s.dash ? 2 : 3} strokeDasharray={s.dash || undefined} />
            <Mk shape={s.shape} x={LEGX[i] + 17} y={64} r={5} fill={s.color} />
            <text x={LEGX[i] + 42} y={70} className="mp-t-axis" fill="var(--ink-2)">{s.label}</text>
          </g>
        ))}

        <text x={150} y={90} className="mp-t-axis" fill="var(--ink-3)">{L.axisNote}</text>
        <text x={940} y={90} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{L.xAxisLabel}</text>

        {/* 축 종류 — 두 패널의 y 가 다르다는 것을 명시하지 않으면 오독한다 */}
        <text x={30} y={330} className="mp-t-axis" fill="var(--ink-3)"
              transform="rotate(-90 30 330)">{L.panelTop}</text>
        <text x={30} y={536} className="mp-t-axis" fill="var(--ink-3)"
              transform="rotate(-90 30 536)">{L.panelBottom}</text>

        {/* 상단 패널 — 축선을 그리지 않고 격자선이 눈금 역할을 한다 */}
        {L.ticks.map((t) => (
          <g key={t.v}>
            <line x1={140} y1={yT(t.v)} x2={940} y2={yT(t.v)} stroke="var(--rule)" strokeWidth={1} />
            <text x={124} y={yT(t.v) + 5} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{t.label}</text>
          </g>
        ))}
        {SERIES.map((s) => (
          <polyline key={s.k} fill="none" stroke={s.color} strokeWidth={s.dash ? 2 : 3}
                    strokeDasharray={s.dash || undefined}
                    points={s.vals.map((v, i) => LX(i) + ',' + yT(v)).join(' ')} />
        ))}
        {SERIES.map((s) => s.vals.map((v, i) => (
          <Mk key={s.k + i} shape={s.shape} x={LX(i)} y={yT(v)} r={6} fill={s.color}
              cls={i === 0 ? s.tag + '-first' : i === s.vals.length - 1 ? s.tag + '-last' : undefined} />
        )))}

        {/* 데이터 라벨 — 첫 점과 끝 점에만. 24개는 16 단위로 들어가지 않는다 */}
        <text x={150} y={yT(T[0].hp) - 14} className="mp-t-label" textAnchor="middle" fill="var(--terra-500)">{T[0].hpL}</text>
        <text x={150} y={yT(T[0].gold) + 26} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{T[0].goldL}</text>
        <text x={150} y={yT(LVS[0].required) - 12} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{LVS[0].requiredL}</text>
        <text x={150} y={yT(T[0].score) - 12} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{T[0].scoreL}</text>
        <text x={886} y={yT(T[5].hp) + 5} className="mp-t-label" textAnchor="end" fill="var(--terra-500)">{T[5].hpL}</text>
        <text x={886} y={yT(T[5].gold) + 5} className="mp-t-label" textAnchor="end" fill="var(--sage-700)">{T[5].goldL}</text>
        <text x={886} y={yT(LVS[5].required) + 5} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{LVS[5].requiredL}</text>
        <text x={886} y={yT(T[5].score) + 5} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{T[5].scoreL}</text>

        {/* 배율 캡슐 — 기울기를 읽지 않고도 결론 수치를 얻는다 */}
        {L.multiples.map((m, i) => (
          <g key={m.series}>
            <rect x={770} y={272 + i * 32} width={174} height={28} rx={14}
                  fill={i === 0 ? 'var(--terra-50)' : 'var(--sage-50)'}
                  stroke={i === 0 ? 'var(--terra-400)' : 'var(--sage-500)'} strokeWidth={1.5} />
            <text x={857} y={291 + i * 32} className="mp-t-label" textAnchor="middle"
                  fill={i === 0 ? 'var(--terra-500)' : 'var(--sage-700)'}>{m.series + ' ' + m.value}</text>
          </g>
        ))}

        {/* 공유 x 눈금 */}
        {L.axisLevels.map((lab, i) => (
          <text key={lab} x={LX(i)} y={352} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{lab}</text>
        ))}
        <line x1={20} y1={372} x2={940} y2={372} stroke="var(--rule-2)" strokeWidth={1} />

        {/* 하단 패널 — 상단의 결론. x 를 공유하므로 위아래로 즉시 대조된다 */}
        <text x={140} y={396} className="mp-t-label" fill="var(--ink-2)">{L.ratioTitle}</text>
        {[0, 5, 10].map((r) => (
          <g key={r}>
            <line x1={140} y1={yB(r)} x2={940} y2={yB(r)} stroke="var(--rule)" strokeWidth={1} />
            <text x={124} y={yB(r) + 5} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{String(r)}</text>
          </g>
        ))}
        {T.map((t, i) => (
          <g key={t.id}>
            <rect x={LX(i) - 28} y={yB(t.ratio)} width={56} height={YB1 - yB(t.ratio)}
                  fill={i === 3 ? 'var(--sage-200)' : 'var(--terra-200)'}
                  stroke={i === 3 ? 'var(--sage-500)' : 'var(--terra-400)'} strokeWidth={1.5} />
            <text x={LX(i)} y={yB(t.ratio) - 8} className="mp-t-label" textAnchor="middle"
                  fill={i === 3 ? 'var(--sage-700)' : 'var(--terra-500)'}>{t.ratio.toFixed(1)}</text>
          </g>
        ))}
        <text x={LX(3)} y={556} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{L.ratioEase}</text>
      </Svg>
    );

    // ── narrow 배치 상수 — 90° 전치. 레벨이 위→아래 6행, 값이 왼→오른쪽 로그 축.
    // 로그 축 76..262 · 비율 막대 274..318 ; 274 + 44 = 318 < 340 ✓
    const nX = (v) => 76 + (log10(v) / 8) * 186;
    const nRow = (i) => 118 + i * 66;                 // 118 … 448 ; 448 + 30 = 478 < 620 ✓
    const NT = [L.ticks[2], L.ticks[4]];              // 340 폭에 5개는 겹친다 — 1만 · 1억만 라벨

    const narrow = (
      <Svg narrow w={340} h={620} label={L.axisNote + ' — ' + L.xAxisLabel}>
        <Marks p="mp-f02n" />

        <text x={6} y={30} className="mp-t-axis" fill="var(--ink-3)">{L.panelTop}</text>
        <text x={6} y={52} className="mp-t-axis" fill="var(--ink-3)">{L.axisNote}</text>
        <text x={332} y={48} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{L.panelBottom}</text>

        {L.ticks.map((t) => (
          <line key={t.v} x1={nX(t.v)} y1={104} x2={nX(t.v)} y2={470} stroke="var(--rule)" strokeWidth={1} />
        ))}
        {NT.map((t) => (
          <text key={t.v} x={nX(t.v)} y={86} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{t.label}</text>
        ))}
        {L.axisLevels.map((lab, i) => (
          <text key={lab} x={6} y={nRow(i) + 5} className="mp-t-axis" fill="var(--ink-2)">{lab}</text>
        ))}

        {/* HP 마커와 골드 마커의 가로 간격이 행을 내려갈수록 벌어진다
            — 데스크톱에서 두 선이 벌어지는 것과 같은 관계, 같은 변화 형태다 */}
        {SERIES.map((s) => s.vals.map((v, i) => (
          <Mk key={s.k + i} shape={s.shape} x={nX(v)} y={nRow(i)} r={5} fill={s.color}
              cls={i === 0 ? s.tag + '-first' : i === s.vals.length - 1 ? s.tag + '-last' : undefined} />
        )))}

        <text x={nX(T[0].hp)} y={nRow(0) - 14} className="mp-t-axis" textAnchor="middle" fill="var(--terra-500)">{T[0].hpL}</text>
        <text x={nX(T[0].gold)} y={nRow(0) + 26} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{T[0].goldL}</text>
        <text x={nX(LVS[0].required)} y={nRow(0) - 14} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{LVS[0].requiredL}</text>
        <text x={nX(T[0].score)} y={nRow(0) + 26} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{T[0].scoreL}</text>
        <text x={nX(T[5].hp)} y={nRow(5) - 14} className="mp-t-axis" textAnchor="middle" fill="var(--terra-500)">{T[5].hpL}</text>
        <text x={nX(T[5].gold)} y={nRow(5) + 28} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{T[5].goldL}</text>
        <text x={nX(LVS[5].required)} y={nRow(5) - 14} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{LVS[5].requiredL}</text>
        <text x={nX(T[5].score)} y={nRow(5) + 28} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{T[5].scoreL}</text>

        {/* 하단 패널 = 각 행 오른쪽 끝의 짧은 가로 막대. 같은 행 = 같은 레벨 */}
        {T.map((t, i) => (
          <rect key={t.id} x={274} y={nRow(i) - 8} width={(t.ratio / 10.5) * 44} height={16}
                fill={i === 3 ? 'var(--sage-200)' : 'var(--terra-200)'}
                stroke={i === 3 ? 'var(--sage-500)' : 'var(--terra-400)'} strokeWidth={1.2} />
        ))}
        <text x={332} y={nRow(3) + 32} className="mp-t-axis" textAnchor="end" fill="var(--sage-700)">{L.ratioEase}</text>

        <text x={6} y={496} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.combat}</text>
        <text x={6} y={542} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.progress}</text>
        {SERIES.map((s, i) => {
          const lx = i % 2 === 0 ? 6 : 156;
          const ly = i < 2 ? 518 : 564;
          return (
            <g key={s.k}>
              <line x1={lx} y1={ly - 5} x2={lx + 28} y2={ly - 5} stroke={s.color}
                    strokeWidth={s.dash ? 2 : 3} strokeDasharray={s.dash || undefined} />
              <Mk shape={s.shape} x={lx + 14} y={ly - 5} r={5} fill={s.color} />
              <text x={lx + 34} y={ly} className="mp-t-axis" fill="var(--ink-2)">{s.label}</text>
            </g>
          );
        })}
        {L.multiples.map((m, i) => (
          <g key={m.series}>
            <rect x={i === 0 ? 6 : 166} y={584} width={i === 0 ? 150 : 168} height={28} rx={14}
                  fill={i === 0 ? 'var(--terra-50)' : 'var(--sage-50)'}
                  stroke={i === 0 ? 'var(--terra-400)' : 'var(--sage-500)'} strokeWidth={1.5} />
            <text x={i === 0 ? 81 : 250} y={603} className="mp-t-axis" textAnchor="middle"
                  fill={i === 0 ? 'var(--terra-500)' : 'var(--sage-700)'}>{m.series + ' ' + m.value}</text>
          </g>
        ))}
      </Svg>
    );

    return (
      <Fig cls="mp-f02" title={L.ladderTitle || L.tierTableTitle}
           caption={L.ratioNote + ' ' + L.caption}>{wide}{narrow}</Fig>
    );
  }

  /* ══ F03 — 티어 겹침 행렬 ════════════════════════════════════
     전달할 관계: 구조(겹침) + 순서(밀림). 레벨 3부터 세 티어가 겹쳐 등장하고
     Level 4 부터는 같은 창(0.3 / 0.4 / 0.3)이 한 칸씩 오른쪽으로 미끄러진다.
     wide 960×480 / narrow 340×600 (창 오프셋 방식으로 재구성) */

  const TIER_IX = {};
  T.forEach((t, i) => { TIER_IX[t.id] = i; });
  // 각 레벨의 등장 티어 인덱스 — 자산 값에서 파생한다(손으로 적지 않는다)
  const ROW_COLS = LVS.map((l) => l.weights.map((w) => TIER_IX[w.id]).sort((a, b) => a - b));
  const ROW_LO = ROW_COLS.map((c) => c[0]);
  const ROW_HI = ROW_COLS.map((c) => c[c.length - 1]);
  const ROW_W = LVS.map((l) => {
    const m = {};
    l.weights.forEach((w) => { m[TIER_IX[w.id]] = w.w; });
    return m;
  });
  // 채움 3단 — 0.2·0.3 옅음 / 0.4 중간 / 0.7·1.0 진함
  const tone = (w) => (w >= 0.7 ? 'var(--sage-400)' : w >= 0.4 ? 'var(--sage-200)' : 'var(--sage-100)');
  const toneLine = (w) => (w >= 0.7 ? 'var(--sage-700)' : 'var(--sage-500)');
  // 창 라벨은 오른쪽에서부터 N · N−1 · N−2 로 붙는다(칸이 3개보다 적은 행도 맞는다)
  const winLabel = (k, j) => L.windowLabels[L.windowLabels.length - k + j];

  function PacingF03() {
    // ── wide 배치 상수 ── 열 x 는 F02 와 같은 값을 쓴다(좌표계 계승)
    // 셀 폭 110 → 마지막 셀 900 + 55 = 955 < 960 ✓ ; 행 6개 × 52 = 312, 76 + 312 = 388 ✓
    const CX = (i) => 150 + i * 150;
    const cellL = (i) => CX(i) - 55;
    const cellR = (i) => CX(i) + 55;
    const bTop = (r) => 76 + r * 52;
    const bBot = (r) => 76 + r * 52 + 52;

    // 대각 밴드 윤곽 — 채워진 칸의 바깥 경계를 잇는 폴리라인 하나
    const band = [[cellL(ROW_LO[0]), bTop(0)], [cellR(ROW_HI[0]), bTop(0)]];
    for (let r = 1; r < ROW_HI.length; r++) {
      band.push([cellR(ROW_HI[r - 1]), bTop(r)]);
      band.push([cellR(ROW_HI[r]), bTop(r)]);
    }
    const last = ROW_HI.length - 1;
    band.push([cellR(ROW_HI[last]), bBot(last)]);
    band.push([cellL(ROW_LO[last]), bBot(last)]);
    for (let r = last; r >= 1; r--) {
      band.push([cellL(ROW_LO[r]), bTop(r)]);
      band.push([cellL(ROW_LO[r - 1]), bTop(r)]);
    }
    const lv3NoteLines = wrapW(L.lv3Note, 16, 210);

    const wide = (
      <Svg w={960} h={480} label={L.overlapTitle}>
        <Marks p="mp-f03w" />

        {T.map((t, i) => (
          <g key={t.id}>
            <text x={CX(i)} y={34} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{'T' + t.tier}</text>
            <text x={CX(i)} y={58} className="mp-t-label" textAnchor="middle" fill="var(--ink-2)">{t.name}</text>
          </g>
        ))}

        {/* 빈 칸은 헤어라인만 — 비어 있음이 정보다 */}
        {LVS.map((lv, r) => (
          <g key={lv.lv}>
            <text x={92} y={bTop(r) + 22} className="mp-t-axis" textAnchor="end" fill="var(--ink-2)">{L.axisLevels[r]}</text>
            <text x={92} y={bTop(r) + 42} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{lv.requiredL}</text>
            {T.map((t, c) => {
              const w = ROW_W[r][c];
              if (w === undefined) {
                return <rect key={t.id} x={cellL(c)} y={bTop(r) + 4} width={110} height={44}
                             fill="none" stroke="var(--rule)" strokeWidth={1} strokeDasharray="2 5" />;
              }
              return (
                <g key={t.id} className="mp-f03-cell">
                  <rect x={cellL(c)} y={bTop(r) + 4} width={110} height={44} rx={3}
                        fill={tone(w)} stroke={toneLine(w)} strokeWidth={1.2} />
                  <text x={CX(c)} y={bTop(r) + 33} className="mp-t-value" textAnchor="middle"
                        fill="var(--sage-900)">{w.toFixed(1)}</text>
                </g>
              );
            })}
          </g>
        ))}

        <polygon points={band.map((p) => p[0] + ',' + p[1]).join(' ')}
                 fill="none" stroke="var(--terra-500)" strokeWidth={2.5} />

        {/* 창 구성 — 마지막 행의 세 칸 아래에 별도 행으로 둔다(셀 위에 얹지 않는다) */}
        <text x={8} y={418} className="mp-t-axis" fill="var(--ink-3)">{L.windowColumn}</text>
        {ROW_COLS[last].map((c, j) => (
          <g key={c}>
            <line x1={CX(c)} y1={bBot(last)} x2={CX(c)} y2={400} stroke="var(--ink-3)"
                  strokeWidth={1.2} strokeDasharray="4 4" />
            <text x={CX(c)} y={418} className="mp-t-label" textAnchor="middle"
                  fill="var(--ink-2)">{winLabel(ROW_COLS[last].length, j)}</text>
          </g>
        ))}

        {/* Lv3 주석과 몬스터 아트는 SVG 밖 DOM 스트립으로 뺐다.
            격자 안에 두면 «비어 있음이 정보» 인 칸 위에 글자가 얹혀 그 칸이 채워진 것처럼 읽힌다
            (실측: T4·Lv4 셀과 충돌). 아트도 44px 로는 무엇인지 안 보인다. */}
      </Svg>
    );

    // ── narrow 배치 상수 — 등장 티어만 미니 스트립으로 그리고
    //    스트립의 x 시작 위치를 티어 인덱스에 비례해 오프셋한다.
    //    행을 내려갈수록 스트립이 오른쪽으로 이동 → 「한 칸씩 밀려 올라간다」가 보존된다.
    // 20 + 3*40 = 140 (최대 오프셋) ; 140 + 3*56 + 2*4 = 316 < 340 ✓
    // 창 라벨은 셀 안이 아니라 행 라벨 줄 오른쪽에 한 덩이로 둔다 —
    // 340 폭에서 셀 안에 3줄(창·가중치·이름)을 넣으면 줄이 서로 겹친다(실측).
    const CW = 56, GAP = 4, UNIT = 40;
    const nY = (r) => 88 + r * 72;                    // 88 … 448 ; 448 + 58 = 506 < 600 ✓
    const nStart = (r) => 20 + ROW_LO[r] * UNIT;
    const nCellX = (r, j) => nStart(r) + j * (CW + GAP);
    const nWindow = (r) => ROW_COLS[r].map((c, j) => winLabel(ROW_COLS[r].length, j)).join(' · ');

    const stair = [];
    for (let r = 0; r < ROW_LO.length; r++) {
      stair.push([nStart(r), nY(r) + 6]);
      stair.push([nStart(r), nY(r) + 58]);
      if (r < ROW_LO.length - 1) stair.push([nStart(r + 1), nY(r) + 58]);
    }

    const narrow = (
      <Svg narrow w={340} h={600} label={L.overlapTitle}>
        <Marks p="mp-f03n" />
        <text x={8} y={40} className="mp-t-axis" fill="var(--ink-3)">{L.windowColumn}</text>

        {LVS.map((lv, r) => (
          <g key={lv.lv}>
            <text x={8} y={nY(r)} className="mp-t-axis" fill="var(--ink-2)">{L.axisLevels[r] + ' · ' + lv.requiredL}</text>
            <text x={332} y={nY(r)} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{nWindow(r)}</text>
            {ROW_COLS[r].map((c, j) => {
              const w = ROW_W[r][c];
              const x = nCellX(r, j);
              return (
                <g key={c} className="mp-f03-cell">
                  <rect x={x} y={nY(r) + 6} width={CW} height={52} rx={3}
                        fill={tone(w)} stroke={toneLine(w)} strokeWidth={1.2} />
                  <text x={x + CW / 2} y={nY(r) + 26} className="mp-t-label" textAnchor="middle"
                        fill="var(--sage-900)">{w.toFixed(1)}</text>
                  <text x={x + CW / 2} y={nY(r) + 50} className="mp-t-axis" textAnchor="middle"
                        fill="var(--ink-2)">{T[c].name}</text>
                </g>
              );
            })}
          </g>
        ))}

        <polyline points={stair.map((p) => p[0] + ',' + p[1]).join(' ')}
                  fill="none" stroke="var(--terra-500)" strokeWidth={2.5} />


      </Svg>
    );

    return (
      <Fig cls="mp-f03" title={L.overlapTitle}
           caption={L.overlapCaption + ' ' + L.overlapNote + ' ' + L.knobs}>
        {wide}{narrow}
        {/* Lv3 의 «같은 화면에 같이 있다» — 격자 밖에서 실물로 보인다 */}
        <div className="mp-f03-lv3">
          <span className="mp-f03-lv3-tag">Lv 3</span>
          <div className="mp-f03-lv3-art">
            {L.lv3Art.map(a => (
              <figure key={a.id}><img src={a.image} alt={a.name} /><figcaption>{a.name}</figcaption></figure>
            ))}
          </div>
          <p>{L.lv3Note}</p>
        </div>
      </Fig>
    );
  }

  /* ══ F04 — 한 틱의 안쪽 (F01 의 확대) ════════════════════════
     전달할 관계: 순서. 고정 간격 안에서 무엇이 어떤 순서로 갱신되는가.
     「고정」을 글자가 아니라 눈금의 등간격으로 말한다.
     wide 960×320 / narrow 340×420 (축약 — 틱 8 → 5, 갱신 5단계는 전부 유지) */

  // 마릿수는 도식이다(측정값 아님). 레벨 전환이 걸린 틱에서 마커가 전부 사라지고 새로 찍힌다.
  const F04_COUNT_W = [3, 4, 5, 6, 7, 3, 4, 5];
  const F04_SWITCH_W = 5;
  const F04_COUNT_N = [3, 4, 5, 3, 4];
  const F04_SWITCH_N = 3;

  function PacingF04() {
    const F = P.f04;

    function Ticks({ x0, pitch, n, y0, y1, counts, switchAt, dotY }) {
      const out = [];
      for (let i = 0; i < n; i++) {
        const x = x0 + i * pitch;
        out.push(<line key={'t' + i} x1={x} y1={y0} x2={x} y2={y1}
                       stroke={i === switchAt ? 'var(--terra-500)' : 'var(--ink-3)'}
                       strokeWidth={i === switchAt ? 3 : 1.5} />);
        for (let d = 0; d < counts[i]; d++) {
          out.push(<circle key={'d' + i + '-' + d} cx={x + 10 + d * ((pitch - 18) / Math.max(1, counts[i]))}
                           cy={dotY} r={4} fill={i >= switchAt ? 'var(--terra-400)' : 'var(--ink-3)'} />);
        }
      }
      return out;
    }

    // ── wide 배치 상수 ── 등간격 눈금 8개, 피치 96
    // 150 + 7*96 = 822 ; 축 끝 822 + 96 = 918 < 960 ✓ ; 알약 48 + 804 = 852 < 960 ✓
    const X0 = 150, PITCH = 96, XEND = 918, SW = X0 + F04_SWITCH_W * PITCH;
    const PW = F.steps.map((s) => textW(s, 17) + 30);
    let acc = 48;
    const PX = PW.map((w) => { const at = acc; acc += w + 14; return at; });

    const wide = (
      <Svg w={960} h={320} label={F.title}>
        <Marks p="mp-f04w" />

        <text x={SW} y={26} className="mp-t-axis" textAnchor="middle" fill="var(--terra-500)">{F.levelSwitch}</text>
        <text x={8} y={44} className="mp-t-axis" fill="var(--ink-3)">{F.energyRow}</text>
        <polyline fill="none" stroke="var(--terra-500)" strokeWidth={2.5}
                  points={F04_COUNT_W.map((c, i) => (X0 + i * PITCH) + ',' + (56 + i * 3.4) + ' ' + (X0 + (i + 1) * PITCH) + ',' + (56 + i * 3.4)).join(' ')} />
        <text x={8} y={98} className="mp-t-axis" fill="var(--ink-3)">{F.monsterRow}</text>
        <Ticks x0={X0} pitch={PITCH} n={8} y0={134} y1={176} counts={F04_COUNT_W}
               switchAt={F04_SWITCH_W} dotY={114} />
        <line x1={X0} y1={176} x2={XEND} y2={176} stroke="var(--ink)" strokeWidth={2} />

        <line x1={X0 + PITCH} y1={168} x2={X0 + PITCH * 2} y2={168} stroke="var(--ink-2)" strokeWidth={1.6}
              markerStart="url(#mp-f04w-ink)" markerEnd="url(#mp-f04w-ink)" />
        <text x={X0 + PITCH * 1.5} y={160} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.dt}</text>

        {/* 이 한 칸의 안쪽을 아래로 편다 */}
        <path d={'M ' + (X0 + PITCH) + ' 178 L 48 230 M ' + (X0 + PITCH * 2) + ' 178 L 870 230'}
              fill="none" stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />
        <line x1={48} y1={230} x2={870} y2={230} stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />

        {F.steps.map((s, i) => (
          <g key={s}>
            <rect x={PX[i]} y={244} width={PW[i]} height={44} rx={22}
                  fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={PX[i] + PW[i] / 2} y={272} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{s}</text>
            {i < F.steps.length - 1 && (
              <line x1={PX[i] + PW[i] + 2} y1={266} x2={PX[i] + PW[i] + 12} y2={266}
                    stroke="var(--ink-3)" strokeWidth={1.6} markerEnd="url(#mp-f04w-ink)" />
            )}
          </g>
        ))}
      </Svg>
    );

    // ── narrow 배치 상수 ── 눈금 5개, 피치 56. 방향(왼→오른쪽 시간)은 그대로 두고
    //    줄이는 것은 관계가 아니라 반복 횟수다.
    // 40 + 4*56 = 264 ; 축 끝 264 + 56 = 320 < 340 ✓
    const NX0 = 40, NPITCH = 56;

    const narrow = (
      <Svg narrow w={340} h={420} label={F.title}>
        <Marks p="mp-f04n" />

        <Lines x={8} y={22} dy={20} lines={wrapW(F.levelSwitch, 16, 320)} cls="mp-t-axis" />
        <text x={8} y={66} className="mp-t-axis" fill="var(--ink-3)">{F.energyRow}</text>
        <polyline fill="none" stroke="var(--terra-500)" strokeWidth={2.5}
                  points={F04_COUNT_N.map((c, i) => (NX0 + i * NPITCH) + ',' + (76 + i * 5) + ' ' + (NX0 + (i + 1) * NPITCH) + ',' + (76 + i * 5)).join(' ')} />
        <text x={8} y={114} className="mp-t-axis" fill="var(--ink-3)">{F.monsterRow}</text>
        <Ticks x0={NX0} pitch={NPITCH} n={5} y0={148} y1={184} counts={F04_COUNT_N}
               switchAt={F04_SWITCH_N} dotY={130} />
        <line x1={NX0} y1={184} x2={320} y2={184} stroke="var(--ink)" strokeWidth={2} />

        <line x1={NX0 + NPITCH} y1={176} x2={NX0 + NPITCH * 2} y2={176} stroke="var(--ink-2)" strokeWidth={1.6}
              markerStart="url(#mp-f04n-ink)" markerEnd="url(#mp-f04n-ink)" />
        <text x={NX0 + NPITCH * 1.5} y={168} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.dt}</text>

        <path d={'M ' + (NX0 + NPITCH) + ' 186 L 16 214 M ' + (NX0 + NPITCH * 2) + ' 186 L 324 214'}
              fill="none" stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />
        <line x1={16} y1={214} x2={324} y2={214} stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 4" />

        {F.steps.map((s, i) => (
          <g key={s}>
            <rect x={16} y={232 + i * 36} width={308} height={28} rx={14}
                  fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={30} y={251 + i * 36} className="mp-t-label" fill="var(--ink)">{s}</text>
            {i < F.steps.length - 1 && (
              <line x1={170} y1={262 + i * 36} x2={170} y2={270 + i * 36}
                    stroke="var(--ink-3)" strokeWidth={1.6} markerEnd="url(#mp-f04n-ink)" />
            )}
          </g>
        ))}
      </Svg>
    );

    return <Fig cls="mp-f04" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ F05 — 유효 피해와 두 원장 ═══════════════════════════════
     전달할 관계: 비교 + 분배. 원래 피해와 실제로 깎인 HP 는 다르고,
     처치 여부에 따라 다른 원장으로 간다.
     ⚠️ F08 과 형태가 닮지 않게: 여기는 「막대의 절단 + terra 빗금 + 값 있음」.
     wide 960×260 / narrow 340×460 (가로 막대 → 세로 스택) */

  function PacingF05() {
    const F = P.f05;
    // ── wide 배치 상수 ── HP 막대 150..470 · 초과분 470..570 · 원장 640..948
    // 640 + 308 = 948 < 960 ✓
    const BX = 150, HPR = 470, INR = 570;

    const wide = (
      <Svg w={960} h={260} label={F.title}>
        <Marks p="mp-f05w" />

        <text x={INR - 50} y={76} className="mp-t-label" textAnchor="middle" fill="var(--terra-500)">{F.wasted}</text>
        <rect x={BX} y={84} width={HPR - BX} height={38} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.5} />
        <rect x={HPR} y={84} width={INR - HPR} height={38} fill="url(#mp-f05w-hatch)" stroke="var(--terra-400)" strokeWidth={1.5} />
        <text x={138} y={108} className="mp-t-label" textAnchor="end" fill="var(--ink-2)">{F.incoming}</text>

        <rect x={BX} y={140} width={HPR - BX} height={38} fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth={1.5} />
        <text x={138} y={164} className="mp-t-label" textAnchor="end" fill="var(--ink-2)">{F.remaining}</text>

        <line x1={HPR} y1={78} x2={HPR} y2={196} stroke="var(--terra-500)" strokeWidth={2} strokeDasharray="6 5" />
        <path d={'M ' + BX + ' 186 V 196 H ' + HPR + ' V 186'} fill="none" stroke="var(--ink-2)" strokeWidth={1.6} />
        <text x={(BX + HPR) / 2} y={218} className="mp-t-value" textAnchor="middle" fill="var(--ink)">{F.effective}</text>

        <path d={'M ' + HPR + ' 159 H 600 M 600 159 V 106 H 634 M 600 159 V 196 H 634'}
              fill="none" stroke="var(--ink-3)" strokeWidth={1.8} markerEnd="url(#mp-f05w-ink)" />

        <rect x={640} y={68} width={308} height={76} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={1.5} />
        <text x={652} y={94} className="mp-t-label" fill="var(--sage-700)">{F.killed}</text>
        <Lines x={652} y={118} dy={20} lines={wrapW(F.killedNote, 16, 284)} cls="mp-t-axis" />

        <rect x={640} y={158} width={308} height={76} rx={6} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.5} />
        <text x={652} y={184} className="mp-t-label" fill="var(--ink-2)">{F.pending}</text>
        <Lines x={652} y={208} dy={20} lines={wrapW(F.pendingNote, 16, 284)} cls="mp-t-axis" />
      </Svg>
    );

    // ── narrow 배치 상수 ── 막대를 세로로 세우고 초과분은 위쪽으로. 두 원장은 아래 좌우.
    // 174 + 158 = 332 < 340 ✓
    const narrow = (
      <Svg narrow w={340} h={460} label={F.title}>
        <Marks p="mp-f05n" />

        <text x={160} y={76} className="mp-t-axis" textAnchor="middle" fill="var(--terra-500)">{F.wasted}</text>
        <rect x={120} y={90} width={80} height={80} fill="url(#mp-f05n-hatch)" stroke="var(--terra-400)" strokeWidth={1.5} />
        <rect x={120} y={170} width={80} height={130} fill="var(--terra-100)" stroke="var(--terra-400)" strokeWidth={1.5} />
        <line x1={110} y1={170} x2={210} y2={170} stroke="var(--terra-500)" strokeWidth={2} strokeDasharray="6 5" />
        <text x={208} y={120} className="mp-t-label" fill="var(--ink-2)">{F.incoming}</text>
        <text x={208} y={240} className="mp-t-label" fill="var(--ink-2)">{F.remaining}</text>

        <path d="M 114 300 V 310 H 206 V 300" fill="none" stroke="var(--ink-2)" strokeWidth={1.6} />
        <text x={160} y={330} className="mp-t-value" textAnchor="middle" fill="var(--ink)">{F.effective}</text>
        <path d="M 160 336 L 96 344 M 160 336 L 244 344" fill="none" stroke="var(--ink-3)"
              strokeWidth={1.8} markerEnd="url(#mp-f05n-ink)" />

        <rect x={8} y={350} width={158} height={102} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={1.5} />
        <text x={18} y={374} className="mp-t-label" fill="var(--sage-700)">{F.killed}</text>
        <Lines x={18} y={396} dy={18} lines={wrapW(F.killedNote, 16, 138)} cls="mp-t-axis" />

        <rect x={174} y={350} width={158} height={102} rx={6} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.5} />
        <text x={184} y={374} className="mp-t-label" fill="var(--ink-2)">{F.pending}</text>
        <Lines x={184} y={396} dy={18} lines={wrapW(F.pendingNote, 16, 138)} cls="mp-t-axis" />
      </Svg>
    );

    return <Fig cls="mp-f05" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ F06 — 배치 × 공격 격자 (small multiples) ═════════════════
     전달할 관계: 비교. 비교되지 않는 변수(배치)를 고정해 6칸에 같은 좌표를 반복한다.
     같은 좌표가 6번 반복되므로 「배치는 같다」가 공간으로 증명된다.
     wide 960×520 / narrow 340×620 (전치 — 3행 공격 × 2열 배치) */

  // 셀 기준 좌표계 290×170. 두 행의 몬스터 좌표는 동일하고 플레이어 위치만 다르다.
  const F6_MON = [[92, 55], [126, 42], [150, 68], [110, 83], [146, 98], [178, 57], [172, 87], [126, 113]];
  const F6_PLAYER = { 'on-path': [72, 80], 'off-path': [72, 144] };
  const F6_BAND = 28, F6_CONTACT = 34, F6_RANGE = 120;
  // 적중 개체 — space.cases 의 확정값(경로 위 관통 6 · 연쇄 3 / 경로 밖 관통 0 · 연쇄 3)과 일치한다
  const F6_HIT = {
    'on-path': { linear: [0, 2, 3, 4, 5, 6], chain: [0, 3, 4], contact: [0] },
    'off-path': { linear: [], chain: [7, 3, 4], contact: [] }
  };

  function PacingF06() {
    const F = P.f06;

    // 셀 안의 기하는 통째로 scale 한다. 글자는 이 안에 넣지 않는다(16 아래로 떨어진다).
    function CellArt({ x, y, w, h, s, rowId, colId }) {
      const px = F6_PLAYER[rowId][0], py = F6_PLAYER[rowId][1];
      const hit = F6_HIT[rowId][colId];
      const offY = (h - 170 * s) / 2;
      const grid = [];
      for (let gx = 48; gx < 290; gx += 48) grid.push(<line key={'v' + gx} x1={gx} y1={0} x2={gx} y2={170} stroke="var(--rule)" strokeWidth={1} />);
      for (let gy = 42; gy < 170; gy += 42) grid.push(<line key={'h' + gy} x1={0} y1={gy} x2={290} y2={gy} stroke="var(--rule)" strokeWidth={1} />);
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.2} />
          <g transform={'translate(' + x + ',' + (y + offY) + ') scale(' + s + ')'}>
            {grid}
            {colId === 'linear' && (
              <rect x={px} y={py - F6_BAND} width={290 - px} height={F6_BAND * 2}
                    fill="var(--terra-50)" stroke="var(--terra-400)" strokeWidth={2} />
            )}
            {colId === 'chain' && (
              <g>
                <circle cx={px} cy={py} r={F6_RANGE} fill="none" stroke="var(--terra-400)"
                        strokeWidth={2} strokeDasharray="8 6" />
                <polyline fill="none" stroke="var(--terra-400)" strokeWidth={2.5}
                          points={(px + ',' + py + ' ') + hit.map((i) => F6_MON[i][0] + ',' + F6_MON[i][1]).join(' ')} />
              </g>
            )}
            {colId === 'contact' && (
              <circle cx={px} cy={py} r={F6_CONTACT} fill="var(--terra-50)" stroke="var(--terra-400)" strokeWidth={2} />
            )}
            {F6_MON.map((m, i) => (
              <circle key={'m' + i} cx={m[0]} cy={m[1]} r={7}
                      fill={hit.indexOf(i) >= 0 ? 'var(--ink-2)' : 'var(--ink-3)'}
                      opacity={hit.indexOf(i) >= 0 ? 1 : 0.35} />
            ))}
            {hit.map((i) => (
              <circle key={'r' + i} cx={F6_MON[i][0]} cy={F6_MON[i][1]} r={12}
                      fill="none" stroke="var(--terra-500)" strokeWidth={2.5} />
            ))}
            <polygon points={px + ',' + (py - 11) + ' ' + (px + 10) + ',' + (py + 8) + ' ' + (px - 10) + ',' + (py + 8)}
                     fill="var(--sage-700)" />
          </g>
        </g>
      );
    }

    // ── wide 배치 상수 ── 3열 × 290 + 2 간격 × 15 = 900 ; 40 + 900 = 940 < 960 ✓
    const CW = 290, CGAP = 15, CX0 = 40;
    const colX = (c) => CX0 + c * (CW + CGAP);
    const rowHead = (r) => 66 + r * 230;              // 66 · 296 ; 296 + 12 + 170 + 22 = 500 < 520 ✓
    const rowCellY = (r) => rowHead(r) + 10;

    const wide = (
      <Svg w={960} h={520} label={F.title}>
        <Marks p="mp-f06w" />
        {F.cols.map((c, i) => (
          <text key={c.id} x={colX(i) + CW / 2} y={34} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{c.name}</text>
        ))}
        {F.rows.map((r, ri) => (
          <g key={r.id}>
            <text x={CX0} y={rowHead(ri)} className="mp-t-label" fill="var(--ink-2)">{r.name}</text>
            {F.cols.map((c, ci) => (
              <g key={c.id}>
                <CellArt x={colX(ci)} y={rowCellY(ri)} w={CW} h={170} s={1} rowId={r.id} colId={c.id} />
                <text x={colX(ci) + CW / 2} y={rowCellY(ri) + 192} className="mp-t-value" textAnchor="middle"
                      fill="var(--ink)">{F.hits[r.id][c.id]}</text>
                {ci === 1 && ri === 0 && (
                  <text x={colX(ci) + 12} y={rowCellY(ri) + 24} className="mp-t-axis" fill="var(--terra-500)">{F.excluded}</text>
                )}
              </g>
            ))}
          </g>
        ))}
      </Svg>
    );

    // ── narrow 배치 상수 ── 전치. 1열로 내리면 「같은 배치」가 세로로 떨어져 비교가 깨진다.
    // 24 + 150 = 174 ; 182 + 150 = 332 < 340 ✓
    const NW = 150, NH = 130, NS = NW / CW;           // 균일 축소 — 원이 타원이 되지 않게
    const nColX = (c) => 24 + c * 158;
    const nHead = (r) => 58 + r * 186;                // 58 · 244 · 430 ; 430 + 12 + 130 + 18 = 590 < 620 ✓

    const narrow = (
      <Svg narrow w={340} h={620} label={F.title}>
        <Marks p="mp-f06n" />
        {F.rows.map((r, ri) => (
          <Lines key={r.id} x={nColX(ri) + NW / 2} y={18} dy={18}
                 lines={wrapW(r.name, 16, 150)} cls="mp-t-axis" anchor="middle" />
        ))}
        {F.cols.map((c, ci) => (
          <g key={c.id}>
            <text x={24} y={nHead(ci)} className="mp-t-label" fill="var(--ink)">{c.name}</text>
            {F.rows.map((r, ri) => (
              <g key={r.id}>
                <CellArt x={nColX(ri)} y={nHead(ci) + 12} w={NW} h={NH} s={NS} rowId={r.id} colId={c.id} />
                <text x={nColX(ri) + NW / 2} y={nHead(ci) + 160} className="mp-t-label" textAnchor="middle"
                      fill="var(--ink)">{F.hits[r.id][c.id]}</text>
              </g>
            ))}
            {ci === 1 && (
              <text x={24 + textW(c.name, 17) + 14} y={nHead(ci)} className="mp-t-axis" fill="var(--terra-500)">{F.excluded}</text>
            )}
          </g>
        ))}
      </Svg>
    );

    return <Fig cls="mp-f06" title={F.title} caption={F.caption + ' ' + F.contactRef}>{wide}{narrow}</Fig>;
  }

  /* ══ F08 — 두 조건의 교집합 ══════════════════════════════════
     전달할 관계: 겹침. HP 값 하나가 두 조건을 동시에 만족해야 한다.
     ⚠️ 축 눈금을 그리지 않는다 — 이 절의 근거는 측정값이 아니라 판단 방법이다.
        눈금을 그리는 순간 「측정된 범위」로 오독된다.
     ⚠️ F05 와 도형 언어를 가른다: 여기는 「두 막대의 겹침 + sage 채움 + 값 없음」.
     wide 960×300 / narrow 340×520 (좌우 2상태 → 상하 2상태) */

  function PacingF08() {
    const F = P.intersection;

    // ── wide 배치 상수 ── 두 상태를 나란히. 가운데 480 에 구분선.
    // 왼쪽 30..430 · 오른쪽 540..910 ; 910 < 960 ✓
    const wide = (
      <Svg w={960} h={300} label={F.title}>
        <Marks p="mp-f08w" />

        <rect x={30} y={20} width={24} height={14} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.2} />
        <text x={62} y={32} className="mp-t-axis" fill="var(--ink-2)">{F.barTop}</text>
        <rect x={300} y={20} width={24} height={14} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.2} />
        <text x={332} y={32} className="mp-t-axis" fill="var(--ink-2)">{F.barBottom}</text>
        <line x1={480} y1={50} x2={480} y2={282} stroke="var(--rule-2)" strokeWidth={1} />

        <g className="mp-f08-ok">
          <text x={250} y={64} className="mp-t-head" textAnchor="middle" fill="var(--ink)">{F.okLabel}</text>
          <rect x={230} y={86} width={100} height={80} fill="var(--sage-100)" />
          <rect x={80} y={90} width={250} height={26} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.5} />
          <rect x={230} y={136} width={200} height={26} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.5} />
          <line x1={230} y1={82} x2={230} y2={178} stroke="var(--sage-700)" strokeWidth={1.6} strokeDasharray="5 4" />
          <line x1={330} y1={82} x2={330} y2={178} stroke="var(--sage-700)" strokeWidth={1.6} strokeDasharray="5 4" />
          <text x={280} y={196} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{F.okResult}</text>
          <line x1={50} y1={252} x2={450} y2={252} stroke="var(--ink-3)" strokeWidth={1.4}
                markerStart="url(#mp-f08w-ink)" markerEnd="url(#mp-f08w-ink)" />
          <text x={250} y={274} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.axis}</text>
        </g>

        <g className="mp-f08-no">
          <text x={710} y={64} className="mp-t-head" textAnchor="middle" fill="var(--ink)">{F.noLabel}</text>
          <rect x={540} y={90} width={220} height={26} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.5} />
          <rect x={800} y={136} width={110} height={26} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.5} />
          <line x1={760} y1={82} x2={760} y2={178} stroke="var(--ink-3)" strokeWidth={1.6} strokeDasharray="5 4" />
          <line x1={800} y1={82} x2={800} y2={178} stroke="var(--ink-3)" strokeWidth={1.6} strokeDasharray="5 4" />
          <path d="M 770 118 L 790 138 M 790 118 L 770 138" stroke="var(--terra-500)" strokeWidth={2.5} />
          <Lines x={710} y={196} dy={22} lines={wrapW(F.noResult, 16, 400)} cls="mp-t-axis" anchor="middle" />
          <line x1={510} y1={252} x2={910} y2={252} stroke="var(--ink-3)" strokeWidth={1.4}
                markerStart="url(#mp-f08w-ink)" markerEnd="url(#mp-f08w-ink)" />
          <text x={710} y={274} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.axis}</text>
        </g>

        <text x={480} y={294} className="mp-t-label" textAnchor="middle" fill="var(--ink-2)">{F.htk}</text>
      </Svg>
    );

    // ── narrow 배치 상수 ── 상하 2상태. 두 상태 모두 접근 가능해야 한다.
    // 206 + 110 = 316 < 340 ✓
    const narrow = (
      <Svg narrow w={340} h={520} label={F.title}>
        <Marks p="mp-f08n" />

        <rect x={8} y={14} width={20} height={12} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.2} />
        <text x={34} y={26} className="mp-t-axis" fill="var(--ink-2)">{F.barTop}</text>
        <rect x={8} y={36} width={20} height={12} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.2} />
        <text x={34} y={48} className="mp-t-axis" fill="var(--ink-2)">{F.barBottom}</text>

        <g className="mp-f08-ok">
          <text x={170} y={84} className="mp-t-head" textAnchor="middle" fill="var(--ink)">{F.okLabel}</text>
          <rect x={130} y={98} width={80} height={74} fill="var(--sage-100)" />
          <rect x={30} y={102} width={180} height={24} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.5} />
          <rect x={130} y={144} width={160} height={24} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.5} />
          <line x1={130} y1={94} x2={130} y2={180} stroke="var(--sage-700)" strokeWidth={1.6} strokeDasharray="5 4" />
          <line x1={210} y1={94} x2={210} y2={180} stroke="var(--sage-700)" strokeWidth={1.6} strokeDasharray="5 4" />
          <text x={170} y={198} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{F.okResult}</text>
          <line x1={20} y1={220} x2={320} y2={220} stroke="var(--ink-3)" strokeWidth={1.4}
                markerStart="url(#mp-f08n-ink)" markerEnd="url(#mp-f08n-ink)" />
          <text x={170} y={240} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.axis}</text>
        </g>

        <g className="mp-f08-no">
          <text x={170} y={288} className="mp-t-head" textAnchor="middle" fill="var(--ink)">{F.noLabel}</text>
          <rect x={30} y={302} width={150} height={24} fill="var(--terra-200)" stroke="var(--terra-400)" strokeWidth={1.5} />
          <rect x={206} y={344} width={110} height={24} fill="var(--sage-200)" stroke="var(--sage-500)" strokeWidth={1.5} />
          <line x1={180} y1={296} x2={180} y2={380} stroke="var(--ink-3)" strokeWidth={1.6} strokeDasharray="5 4" />
          <line x1={206} y1={296} x2={206} y2={380} stroke="var(--ink-3)" strokeWidth={1.6} strokeDasharray="5 4" />
          <path d="M 186 326 L 200 344 M 200 326 L 186 344" stroke="var(--terra-500)" strokeWidth={2.5} />
          <Lines x={170} y={400} dy={20} lines={wrapW(F.noResult, 16, 300)} cls="mp-t-axis" anchor="middle" />
          <line x1={20} y1={468} x2={320} y2={468} stroke="var(--ink-3)" strokeWidth={1.4}
                markerStart="url(#mp-f08n-ink)" markerEnd="url(#mp-f08n-ink)" />
          <text x={170} y={488} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.axis}</text>
        </g>

        <text x={170} y={512} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.htk}</text>
      </Svg>
    );

    return <Fig cls="mp-f08" title={F.title} caption={F.caption + ' ' + F.htkNote}>{wide}{narrow}</Fig>;
  }

  /* ══ F09 — 진행도 축과 네 사건 (F02 축의 연속화) ══════════════
     전달할 관계: 순서 + 결측. 정수 눈금은 F02 와 같은 문자열(ladder.axisLevels)이다.
     ⚠️ 마커의 축상 위치는 「네 사건이 서로 다른 시점에 일어난다」만 말한다.
        구체 수치 라벨을 붙이지 않는다 — 궤적 데이터가 없다.
     wide 960×300 / narrow 340×560 (가로 축 → 세로 축) */

  const F09_P = [0.35, 1.6, 2.8, 4.4];
  const F09_MISS = [3, 4];                            // 미관측 구간 — 0으로 채우지 않는다

  function PacingF09() {
    const F = P.f09;

    // ── wide 배치 상수 ── 정수 눈금 6개, 간격 160. 130 + 5*160 = 930 < 960 ✓
    const pX = (p) => 130 + p * 160;
    const ROWS = [[44, 62], [86, 104], [128, 146], [170, 188]];

    const wide = (
      <Svg w={960} h={300} label={F.title}>
        <Marks p="mp-f09w" />

        <line x1={pX(0)} y1={210} x2={pX(5) + 20} y2={210} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f09w-ink)" />
        {L.axisLevels.map((lab, i) => (
          <g key={lab}>
            <line x1={pX(i)} y1={202} x2={pX(i)} y2={220} stroke="var(--ink)" strokeWidth={2} />
            <text x={pX(i)} y={238} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{lab}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((seg) => [1, 2, 3, 4].map((k) => (
          <line key={seg + '-' + k} x1={pX(seg + k / 5)} y1={205} x2={pX(seg + k / 5)} y2={210}
                stroke="var(--rule-2)" strokeWidth={1} />
        )))}

        <rect x={pX(F09_MISS[0])} y={196} width={pX(F09_MISS[1]) - pX(F09_MISS[0])} height={28}
              fill="url(#mp-f09w-hatch-ink)" stroke="var(--ink-3)" strokeWidth={1.2} />
        <line x1={pX(3.5)} y1={226} x2={pX(3.5)} y2={272} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 4" />
        <text x={pX(3.5)} y={290} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.missing}</text>
        <text x={130} y={268} className="mp-t-axis" fill="var(--ink-3)">{F.axisFormula}</text>

        {F.events.map((e, i) => {
          const x = pX(F09_P[i]);
          const end = i === F.events.length - 1;
          return (
            <g key={e.name}>
              <line x1={x} y1={ROWS[i][1] + 8} x2={x} y2={204} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="3 4" />
              <Mk shape={e.mark} x={x} y={210} r={7} fill="var(--ink-2)" />
              <Mk shape={e.mark} x={end ? x - 10 : x + 10} y={ROWS[i][0] - 6} r={6} fill="var(--ink-2)" />
              <text x={end ? x - 22 : x + 22} y={ROWS[i][0]} className="mp-t-label"
                    textAnchor={end ? 'end' : 'start'} fill="var(--ink)">{e.name}</text>
              <text x={end ? x - 22 : x + 22} y={ROWS[i][1]} className="mp-t-axis"
                    textAnchor={end ? 'end' : 'start'} fill="var(--ink-3)">{e.q}</text>
            </g>
          );
        })}
      </Svg>
    );

    // ── narrow 배치 상수 ── 세로 축, 아래→위. 마커는 축 오른쪽 계단식.
    // 라벨 x 96 + 224 = 320 < 340 ✓
    const nY = (p) => 470 - p * 80;                   // p 0..5 → 470 … 70

    const narrow = (
      <Svg narrow w={340} h={560} label={F.title}>
        <Marks p="mp-f09n" />

        <line x1={76} y1={nY(0)} x2={76} y2={nY(5) - 20} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f09n-ink)" />
        {L.axisLevels.map((lab, i) => (
          <g key={lab}>
            <line x1={68} y1={nY(i)} x2={84} y2={nY(i)} stroke="var(--ink)" strokeWidth={2} />
            <text x={62} y={nY(i) + 6} className="mp-t-axis" textAnchor="end" fill="var(--ink-2)">{lab}</text>
          </g>
        ))}
        <rect x={66} y={nY(F09_MISS[1])} width={20} height={nY(F09_MISS[0]) - nY(F09_MISS[1])}
              fill="url(#mp-f09n-hatch-ink)" stroke="var(--ink-3)" strokeWidth={1.2} />
        <Lines x={96} y={186} dy={20} lines={wrapW(F.missing, 16, 224)} cls="mp-t-axis" />

        {F.events.map((e, i) => {
          const y = nY(F09_P[i]);
          return (
            <g key={e.name}>
              <Mk shape={e.mark} x={76} y={y} r={7} fill="var(--ink-2)" />
              <text x={96} y={y - 4} className="mp-t-label" fill="var(--ink)">{e.name}</text>
              <Lines x={96} y={y + 16} dy={20} lines={wrapW(e.q, 16, 224)} cls="mp-t-axis" />
            </g>
          );
        })}
        <Lines x={8} y={512} dy={22} lines={wrapW(F.axisFormula, 16, 320)} cls="mp-t-axis" />
      </Svg>
    );

    return <Fig cls="mp-f09" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ F11 — 공유 계산 소스와 요청 경계 ═══════════════════════
     전달할 관계: 구조. 왼쪽 = 무엇을 함께 읽는가(공유), 오른쪽 = 무엇을 받아들이는가(경계).
     ⚠️ 사본 노드가 존재하지 않는다 — 단일 소스에서 화살표 두 개가 나간다. 그게 그림의 사실.
     ⚠️ 경계 밖 항목의 화살표는 상자에 부딪혀 꺾여 되돌아온다(거부).
     wide 960×440 / narrow 340×700 (가로 3단 → 세로 3단) */

  function PacingF11() {
    const F = P.f11;

    // 거부 표시 — 경계에 부딪혀 꺾여 되돌아오는 화살표 한 벌
    function Reject({ x, y, wall, p }) {
      return (
        <g>
          <line x1={x} y1={y} x2={wall + 6} y2={y} stroke="var(--terra-500)" strokeWidth={1.8} />
          <line x1={wall + 6} y1={y} x2={wall + 20} y2={y - 14} stroke="var(--terra-500)" strokeWidth={1.8}
                markerEnd={'url(#' + p + '-terra)'} />
          <path d={'M ' + (wall - 6) + ' ' + (y - 6) + ' L ' + (wall + 4) + ' ' + (y + 4) +
                   ' M ' + (wall + 4) + ' ' + (y - 6) + ' L ' + (wall - 6) + ' ' + (y + 4)}
                stroke="var(--terra-500)" strokeWidth={2} />
        </g>
      );
    }

    // ── wide 배치 상수 ── 공유 24..234 · CLI 280..450 · 경계 500..800 · 밖 830..950
    // 560 + 380 = 940 < 960 ✓
    const wide = (
      <Svg w={960} h={440} label={F.title}>
        <Marks p="mp-f11w" />

        {/* 왼쪽 — 단일 소스 하나에서 화살표 두 개가 나간다 */}
        <rect x={24} y={150} width={210} height={76} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <Lines x={34} y={180} dy={24} lines={wrapW(F.sourceNode, 17, 190)} cls="mp-t-label" />
        <text x={34} y={248} className="mp-t-axis" fill="var(--sage-700)">{F.sourceNote}</text>
        <path d="M 234 178 L 274 113 M 234 198 L 274 261" fill="none" stroke="var(--sage-700)"
              strokeWidth={2} markerEnd="url(#mp-f11w-sage)" />

        <rect x={280} y={86} width={170} height={54} rx={6} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.5} />
        <text x={365} y={118} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.consumers[0]}</text>

        <rect x={280} y={236} width={170} height={54} rx={6} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={365} y={262} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.cliNode}</text>
        <text x={365} y={282} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.cliNote}</text>
        <Lines x={280} y={314} dy={20} lines={wrapW(F.runtimeNote, 16, 180)} cls="mp-t-axis" />

        {/* 입력 두 갈래 — 서로 다른 대시 패턴 */}
        {F.inputs.map((inp, i) => (
          <g key={inp.id}>
            <text x={24} y={326 + i * 60} className="mp-t-label" fill="var(--ink-2)">{inp.label}</text>
            <text x={24} y={348 + i * 60} className="mp-t-axis" fill="var(--ink-3)">{inp.from}</text>
            <line x1={i === 0 ? 150 : 128} y1={332 + i * 60} x2={274} y2={i === 0 ? 288 : 292}
                  stroke="var(--ink-3)" strokeWidth={1.8} strokeDasharray={i === 0 ? '9 5' : '2 5'}
                  markerEnd="url(#mp-f11w-ink)" />
          </g>
        ))}

        <line x1={450} y1={258} x2={496} y2={182} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#mp-f11w-ink)" />

        {/* 오른쪽 — 경계 상자. 안은 허용, 밖은 표현 자체가 불가능하다 */}
        <rect x={500} y={60} width={300} height={200} rx={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} />
        <text x={650} y={90} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.boundaryTitle}</text>
        {F.inside.map((it, i) => (
          <text key={it} x={650} y={140 + i * 24} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{it}</text>
        ))}
        <Lines x={650} y={180} dy={22} lines={wrapW(F.insideNote, 16, 280)} cls="mp-t-axis" anchor="middle" />

        {F.outside.map((it, i) => (
          <g key={it}>
            <text x={830} y={92 + i * 42} className="mp-t-label" fill="var(--terra-500)">{it}</text>
            <Reject x={826} y={86 + i * 42} wall={800} p="mp-f11w" />
          </g>
        ))}
        <Lines x={830} y={262} dy={20} lines={wrapW(F.outsideNote, 16, 118)} cls="mp-t-axis" />

        <line x1={650} y1={260} x2={650} y2={298} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#mp-f11w-ink)" />
        <text x={650} y={322} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.output}</text>
        <text x={650} y={344} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.outputNote}</text>

        {/* 도구가 하지 않는 것 — 경계 상자 바깥에 둔다 */}
        <rect x={560} y={372} width={380} height={52} rx={6} fill="none" stroke="var(--rule-2)"
              strokeWidth={1.5} strokeDasharray="6 5" />
        <Lines x={750} y={396} dy={20} lines={wrapW(F.human, 16, 356)} cls="mp-t-axis" anchor="middle" />
      </Svg>
    );

    // ── narrow 배치 상수 ── 세로 3단. 경계의 안/밖과 되돌아오는 거부 화살표는 그대로 유지한다.
    // 12 + 190 = 202 (경계 상자 오른쪽 벽) ; 218 + 112 = 330 < 340 ✓
    const narrow = (
      <Svg narrow w={340} h={700} label={F.title}>
        <Marks p="mp-f11n" />

        <rect x={20} y={20} width={300} height={62} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <Lines x={34} y={46} dy={24} lines={wrapW(F.sourceNode, 17, 272)} cls="mp-t-label" />
        <text x={20} y={104} className="mp-t-axis" fill="var(--sage-700)">{F.sourceNote}</text>
        <path d="M 110 86 L 90 118 M 230 86 L 250 118" fill="none" stroke="var(--sage-700)"
              strokeWidth={2} markerEnd="url(#mp-f11n-sage)" />

        <rect x={20} y={124} width={140} height={50} rx={6} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.5} />
        <text x={90} y={154} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.consumers[0]}</text>
        <rect x={180} y={124} width={140} height={50} rx={6} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={250} y={148} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.cliNode}</text>
        <text x={250} y={168} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.cliNote}</text>

        {F.inputs.map((inp, i) => (
          <g key={inp.id}>
            <text x={20} y={204 + i * 48} className="mp-t-label" fill="var(--ink-2)">{inp.label}</text>
            <text x={20} y={224 + i * 48} className="mp-t-axis" fill="var(--ink-3)">{inp.from}</text>
            <line x1={i === 0 ? 150 : 130} y1={198 + i * 48} x2={i === 0 ? 240 : 246} y2={i === 0 ? 178 : 180}
                  stroke="var(--ink-3)" strokeWidth={1.8} strokeDasharray={i === 0 ? '9 5' : '2 5'}
                  markerEnd="url(#mp-f11n-ink)" />
          </g>
        ))}
        <Lines x={20} y={300} dy={20} lines={wrapW(F.runtimeNote, 16, 300)} cls="mp-t-axis" />

        <path d="M 300 176 V 348 H 107 V 360" fill="none" stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f11n-ink)" />

        <rect x={12} y={366} width={190} height={190} rx={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} />
        <text x={107} y={394} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.boundaryTitle}</text>
        {F.inside.map((it, i) => (
          <text key={it} x={107} y={438 + i * 24} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{it}</text>
        ))}
        <Lines x={107} y={474} dy={22} lines={wrapW(F.insideNote, 16, 172)} cls="mp-t-axis" anchor="middle" />

        {F.outside.map((it, i) => (
          <g key={it}>
            <text x={218} y={396 + i * 36} className="mp-t-axis" fill="var(--terra-500)">{it}</text>
            <Reject x={214} y={391 + i * 36} wall={202} p="mp-f11n" />
          </g>
        ))}
        <Lines x={218} y={548} dy={20} lines={wrapW(F.outsideNote, 16, 112)} cls="mp-t-axis" />

        <line x1={107} y1={556} x2={107} y2={580} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#mp-f11n-ink)" />
        <text x={107} y={602} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.output}</text>
        <text x={107} y={624} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.outputNote}</text>

        <rect x={12} y={640} width={316} height={52} rx={6} fill="none" stroke="var(--rule-2)"
              strokeWidth={1.5} strokeDasharray="6 5" />
        <Lines x={170} y={662} dy={20} lines={wrapW(F.human, 16, 292)} cls="mp-t-axis" anchor="middle" />
      </Svg>
    );

    return <Fig cls="mp-f11" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  Object.assign(window, {
    PacingF01, PacingF02, PacingF03, PacingF04,
    PacingF05, PacingF06, PacingF08, PacingF09, PacingF11
  });
})();
