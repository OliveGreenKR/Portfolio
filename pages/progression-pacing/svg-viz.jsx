// pages/progression-pacing/svg-viz.jsx
//
// SVG 도표 7종 — Flow(워크플로우) · Goal(성장 주기) · Progress(진행도 축) ·
//                F02(레벨 사다리) · Sim(시뮬레이션 구조) · F05(유효 피해) ·
//                F06(공간 적중) · F11(도구 배치와 권한)
//
// ⚠️ 문장을 여기 박지 않는다. 모든 문자열과 수치는 data.js(window.PACING_DATA)에서 온다.
// ⚠️ SVG 글자는 .mp-t-head(22) · .mp-t-value(20) · .mp-t-label(17) · .mp-t-axis(16) 클래스로만.
//    인라인 fontSize 금지, 16 미만 금지. 크기는 page.css 가 소유한다.
// ⚠️ 좌표는 숫자 리터럴. x={170} ✅ / x="170" ❌ — 후자는 x + w/2 가 문자열 연결이 된다.
// ⚠️ marker · pattern · clipPath 의 id 는 그림별 prefix(mp-f05w-…). 한 문서에 SVG 가 여러 개다.
//
// 색 규약(페이지 전체 불변): terra = 버리는 것·문제·비용 / sage = 채택·유효 출력·본인 기여
//                            ink-3 = 중립·귀속 불가
//
// wide viewBox 폭 960 고정 · narrow viewBox 폭 340 고정. 스왑은 page.css 의 display 가 한다.
//
// ── 2026-09-06 5절 재구성에서 뺀 것 ──────────────────────────────
//   F01(런 경계 타임라인) · F03(티어 겹침 행렬) · F08(HP 교집합) · F10(검사 대응).
//   같은 관계를 두 번 그리거나, 절이 말하려는 것보다 세부가 앞선 자료들이다.
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

  /* ══ F02 — 레벨 사다리 ═══════════════════════════════════════
     전달할 관계: 변화 + 비교. 레벨이 오를수록 체력과 보상의 격차가 벌어진다.
     ⚠️ 2026-09-06: 하단 「체력당 보상」 막대 패널을 뺐다. 같은 결론(격차가 벌어진다)을
        두 번 말했고, 이 절이 필요로 하는 것은 «급수적으로 커진다» 하나다.
     wide 960×400 / narrow 340×530 (90° 전치 — 행 = 레벨) */

  function PacingF02() {
    // ── wide 배치 상수 ──
    // x = 150 + i*150 → 150 … 900 ; 격자선 140..940 < 960 ✓ ; 배율 캡슐 770 + 174 = 944 ✓
    const LX = (i) => 150 + i * 150;
    const YT0 = 112, YT1 = 330;
    const yT = (v) => YT1 - (log10(v) / 8) * (YT1 - YT0);
    const LEGX = [150, 250, 470, 600];

    const wide = (
      <Svg w={960} h={400} label={L.axisNote + ' — ' + L.xAxisLabel}>
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
        <text x={30} y={330} className="mp-t-axis" fill="var(--ink-3)"
              transform="rotate(-90 30 330)">{L.panelTop}</text>

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

        {/* 데이터 라벨 — 첫 점과 끝 점에만 */}
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

        {L.axisLevels.map((lab, i) => (
          <text key={lab} x={LX(i)} y={352} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{lab}</text>
        ))}
        <line x1={20} y1={370} x2={940} y2={370} stroke="var(--rule-2)" strokeWidth={1} />
        <text x={20} y={392} className="mp-t-label" fill="var(--ink)">{L.gap}</text>
      </Svg>
    );

    // ── narrow 배치 상수 — 90° 전치. 레벨이 위→아래 6행, 값이 왼→오른쪽 로그 축.
    const nX = (v) => 76 + (log10(v) / 8) * 240;      // 76 … 316 < 340 ✓
    const nRow = (i) => 108 + i * 58;                 // 108 … 398
    const NT = [L.ticks[2], L.ticks[4]];

    const narrow = (
      <Svg narrow w={340} h={530} label={L.axisNote + ' — ' + L.xAxisLabel}>
        <Marks p="mp-f02n" />

        <text x={6} y={30} className="mp-t-axis" fill="var(--ink-3)">{L.panelTop}</text>
        <text x={6} y={52} className="mp-t-axis" fill="var(--ink-3)">{L.axisNote}</text>

        {L.ticks.map((t) => (
          <line key={t.v} x1={nX(t.v)} y1={94} x2={nX(t.v)} y2={416} stroke="var(--rule)" strokeWidth={1} />
        ))}
        {NT.map((t) => (
          <text key={t.v} x={nX(t.v)} y={80} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{t.label}</text>
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
        <text x={nX(T[5].gold)} y={nRow(5) + 26} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{T[5].goldL}</text>
        <text x={nX(LVS[5].required)} y={nRow(5) - 14} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{LVS[5].requiredL}</text>
        <text x={nX(T[5].score)} y={nRow(5) + 26} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{T[5].scoreL}</text>

        <text x={6} y={444} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.combat}</text>
        <text x={176} y={444} className="mp-t-axis" fill="var(--ink-3)">{L.groupLabels.progress}</text>
        {SERIES.map((s, i) => {
          const lx = i < 2 ? 6 : 176;
          const ly = i % 2 === 0 ? 466 : 490;
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
            <rect x={i === 0 ? 6 : 166} y={504} width={i === 0 ? 150 : 168} height={24} rx={12}
                  fill={i === 0 ? 'var(--terra-50)' : 'var(--sage-50)'}
                  stroke={i === 0 ? 'var(--terra-400)' : 'var(--sage-500)'} strokeWidth={1.5} />
            <text x={i === 0 ? 81 : 250} y={521} className="mp-t-axis" textAnchor="middle"
                  fill={i === 0 ? 'var(--terra-500)' : 'var(--sage-700)'}>{m.series + ' ' + m.value}</text>
          </g>
        ))}
      </Svg>
    );

    return <Fig cls="mp-f02" title={L.ladderTitle} caption={L.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ Progress — 따로 움직이는 조건을 한 축으로 ═══════════════
     전달할 관계: 수렴 + 순서 + 결측.
     위 = 네 조건이 하나로 모인다(수렴선이 그것을 말한다)
     아래 = 그 축 위에서 네 사건이 서로 다른 시점에 일어난다
     ⚠️ 마커의 축상 위치는 「서로 다른 시점」만 말한다. 수치 라벨을 붙이지 않는다.
     wide 960×540 / narrow 340×880 (가로 축 → 세로 축) */

  const PRG_P = [0.35, 1.6, 2.8, 4.4];
  const PRG_MISS = [3, 4];                            // 미관측 구간 — 0으로 채우지 않는다

  function PacingProgress() {
    const F = P.progress;

    // ── wide 배치 상수 ── 입력 4열 210폭: 20 · 250 · 480 · 710+210=920 < 960 ✓
    const IX = [20, 250, 480, 710], IW = 210;
    const pX = (p) => 130 + p * 160;                  // 130 … 930 < 960 ✓
    const ROWS = [[276, 294], [318, 336], [360, 378], [402, 420]];

    const wide = (
      <Svg w={960} h={540} label={F.title}>
        <Marks p="mp-prgw" />

        <text x={20} y={22} className="mp-t-axis" fill="var(--ink-3)">{F.inputsLabel}</text>
        {F.inputs.map((n, i) => (
          <g key={n.t}>
            <rect x={IX[i]} y={32} width={IW} height={70} rx={4} fill="var(--paper-2)"
                  stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={IX[i] + 14} y={58} className="mp-t-label" fill="var(--ink)">{n.t}</text>
            <Lines x={IX[i] + 14} y={82} dy={18} lines={wrapW(n.d, 16, IW - 28)} cls="mp-t-axis" />
            <line x1={IX[i] + IW / 2} y1={102} x2={480} y2={126} stroke="var(--sage-700)"
                  strokeWidth={1.6} markerEnd="url(#mp-prgw-sage)" />
          </g>
        ))}

        <rect x={360} y={132} width={240} height={46} rx={23} fill="var(--sage-50)"
              stroke="var(--sage-500)" strokeWidth={2} />
        <text x={480} y={162} className="mp-t-head" textAnchor="middle" fill="var(--sage-700)">{F.axisTitle}</text>
        <text x={480} y={202} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.axisFormula}</text>
        <line x1={20} y1={224} x2={940} y2={224} stroke="var(--rule-2)" strokeWidth={1} />

        <text x={20} y={252} className="mp-t-axis" fill="var(--ink-3)">{F.eventsLabel}</text>

        {/* 축 */}
        <line x1={pX(0)} y1={448} x2={pX(5) + 20} y2={448} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-prgw-ink)" />
        {L.axisLevels.map((lab, i) => (
          <g key={lab}>
            <line x1={pX(i)} y1={440} x2={pX(i)} y2={458} stroke="var(--ink)" strokeWidth={2} />
            <text x={pX(i)} y={476} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{lab}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((seg) => [1, 2, 3, 4].map((k) => (
          <line key={seg + '-' + k} x1={pX(seg + k / 5)} y1={443} x2={pX(seg + k / 5)} y2={448}
                stroke="var(--rule-2)" strokeWidth={1} />
        )))}

        <rect x={pX(PRG_MISS[0])} y={434} width={pX(PRG_MISS[1]) - pX(PRG_MISS[0])} height={28}
              fill="url(#mp-prgw-hatch-ink)" stroke="var(--ink-3)" strokeWidth={1.2} />
        <line x1={pX(3.5)} y1={464} x2={pX(3.5)} y2={498} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 4" />
        <text x={pX(3.5)} y={518} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.missing}</text>

        {F.events.map((e, i) => {
          const x = pX(PRG_P[i]);
          const end = i === F.events.length - 1;
          return (
            <g key={e.name}>
              <line x1={x} y1={ROWS[i][1] + 8} x2={x} y2={442} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="3 4" />
              <Mk shape={e.mark} x={x} y={448} r={7} fill="var(--ink-2)" />
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

    // ── narrow 배치 상수 ── 입력 4행 → 축은 세로, 아래→위.
    const nY = (p) => 812 - p * 78;                   // p 0..5 → 812 … 422

    const narrow = (
      <Svg narrow w={340} h={880} label={F.title}>
        <Marks p="mp-prgn" />

        <text x={20} y={20} className="mp-t-axis" fill="var(--ink-3)">{F.inputsLabel}</text>
        {F.inputs.map((n, i) => (
          <g key={n.t}>
            <rect x={20} y={30 + i * 62} width={300} height={54} rx={4} fill="var(--paper-2)"
                  stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={34} y={54 + i * 62} className="mp-t-label" fill="var(--ink)">{n.t}</text>
            <text x={34} y={76 + i * 62} className="mp-t-axis" fill="var(--ink-3)">{n.d}</text>
          </g>
        ))}
        <line x1={170} y1={282} x2={170} y2={304} stroke="var(--sage-700)" strokeWidth={2}
              markerEnd="url(#mp-prgn-sage)" />
        <rect x={60} y={310} width={220} height={44} rx={22} fill="var(--sage-50)"
              stroke="var(--sage-500)" strokeWidth={2} />
        <text x={170} y={339} className="mp-t-head" textAnchor="middle" fill="var(--sage-700)">{F.axisTitle}</text>
        <Lines x={20} y={378} dy={20} lines={wrapW(F.axisFormula, 16, 300)} cls="mp-t-axis" />

        <line x1={76} y1={nY(0)} x2={76} y2={nY(5) - 20} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-prgn-ink)" />
        {L.axisLevels.map((lab, i) => (
          <g key={lab}>
            <line x1={68} y1={nY(i)} x2={84} y2={nY(i)} stroke="var(--ink)" strokeWidth={2} />
            <text x={62} y={nY(i) + 6} className="mp-t-axis" textAnchor="end" fill="var(--ink-2)">{lab}</text>
          </g>
        ))}
        <rect x={66} y={nY(PRG_MISS[1])} width={20} height={nY(PRG_MISS[0]) - nY(PRG_MISS[1])}
              fill="url(#mp-prgn-hatch-ink)" stroke="var(--ink-3)" strokeWidth={1.2} />
        <Lines x={96} y={nY(3.5)} dy={20} lines={wrapW(F.missing, 16, 224)} cls="mp-t-axis" />

        {F.events.map((e, i) => {
          const y = nY(PRG_P[i]);
          return (
            <g key={e.name}>
              <Mk shape={e.mark} x={76} y={y} r={7} fill="var(--ink-2)" />
              <text x={96} y={y - 4} className="mp-t-label" fill="var(--ink)">{e.name}</text>
              <Lines x={96} y={y + 16} dy={20} lines={wrapW(e.q, 16, 224)} cls="mp-t-axis" />
            </g>
          );
        })}
      </Svg>
    );

    return <Fig cls="mp-f09" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ Sim — 가상 전장과 한 틱의 갱신 순서 ═════════════════════
     전달할 관계: 구조(무엇을 들고 있는가) + 순서(무엇을 어떤 차례로 갱신하는가).
     왼쪽 = 좌표를 가진 전장. 플레이어·몬스터·스킬 기하가 실제로 그려져야
     「가상 공간을 그대로 돌린다」가 글이 아니라 그림이 된다.
     오른쪽 = 그 위에서 반복되는 틱. 되돌아가는 화살표가 «루프» 를 말한다.
     wide 960×470 / narrow 340×880 */

  // 전장 좌표계 440×250. 몬스터 배치는 F06 과 별개다(여기는 «공간이 있다» 만 말한다).
  const SIM_MON = [[196, 92], [246, 70], [290, 112], [222, 140], [286, 166], [340, 96], [330, 150], [252, 196]];
  const SIM_PLAYER = [120, 168];
  const SIM_DASH = [366, 74];

  function PacingSim() {
    const F = P.sim;

    function Arena({ x, y, w, h, s, p }) {
      const grid = [];
      for (let gx = 55; gx < 440; gx += 55) grid.push(<line key={'v' + gx} x1={gx} y1={0} x2={gx} y2={250} stroke="var(--rule)" strokeWidth={1} />);
      for (let gy = 50; gy < 250; gy += 50) grid.push(<line key={'h' + gy} x1={0} y1={gy} x2={440} y2={gy} stroke="var(--rule)" strokeWidth={1} />);
      const px = SIM_PLAYER[0], py = SIM_PLAYER[1];
      // ⚠️ 사거리 원이 전장 사각형을 넘어 범례 글자를 관통한다 — 클립한다(실측).
      const clip = p + '-arena';
      return (
        <g>
          <defs>
            <clipPath id={clip} clipPathUnits="userSpaceOnUse">
              <rect x={0} y={0} width={440} height={250} />
            </clipPath>
          </defs>
          <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.2} />
          <g transform={'translate(' + x + ',' + y + ') scale(' + s + ')'} clipPath={'url(#' + clip + ')'}>
            {grid}
            {/* 돌진 경로 — 선분과 판정 반경 */}
            <line x1={px} y1={py} x2={SIM_DASH[0]} y2={SIM_DASH[1]} stroke="var(--terra-400)"
                  strokeWidth={26} strokeLinecap="round" opacity={0.28} />
            <line x1={px} y1={py} x2={SIM_DASH[0]} y2={SIM_DASH[1]} stroke="var(--terra-500)"
                  strokeWidth={2} markerEnd={'url(#' + p + '-terra)'} />
            {/* 연쇄 — 사거리와 이어지는 대상 */}
            <circle cx={px} cy={py} r={132} fill="none" stroke="var(--terra-400)" strokeWidth={1.6} strokeDasharray="8 6" />
            <polyline fill="none" stroke="var(--terra-500)" strokeWidth={2}
                      points={[SIM_MON[3], SIM_MON[0], SIM_MON[2]].map((m) => m[0] + ',' + m[1]).join(' ')} />
            {/* 몸통 접촉 반경 */}
            <circle cx={px} cy={py} r={34} fill="none" stroke="var(--terra-400)" strokeWidth={2} />
            {SIM_MON.map((m, i) => (
              <circle key={'m' + i} cx={m[0]} cy={m[1]} r={9} fill="var(--ink-3)" opacity={0.55} />
            ))}
            <polygon points={px + ',' + (py - 13) + ' ' + (px + 12) + ',' + (py + 9) + ' ' + (px - 12) + ',' + (py + 9)}
                     fill="var(--sage-700)" />
          </g>
        </g>
      );
    }

    // ── wide 배치 상수 ── 전장 20..460 · 단계 490..940
    const SX = 490, SW = 450, PH = 40;
    const stepY = (i) => 84 + i * 54;                 // 84 … 354 ; 354 + 40 = 394 < 470 ✓
    const AXY = (i) => 322 + i * 50;                  // 322 · 372 · 422 ; 422 + 22 = 444 < 470 ✓
    const AXC = { player: 'var(--sage-700)', monster: 'var(--ink-3)', skill: 'var(--terra-500)' };

    const wide = (
      <Svg w={960} h={470} label={F.title}>
        <Marks p="mp-simw" />

        <text x={20} y={26} className="mp-t-axis" fill="var(--ink-3)">{F.axesLabel}</text>
        <Arena x={20} y={38} w={440} h={250} s={1} p="mp-simw" />

        {F.axes.map((a, i) => (
          <g key={a.id}>
            <circle cx={30} cy={AXY(i) - 5} r={6} fill={AXC[a.id]} />
            <text x={46} y={AXY(i)} className="mp-t-label" fill="var(--ink)">{a.t}</text>
            <text x={46} y={AXY(i) + 22} className="mp-t-axis" fill="var(--ink-3)">{a.d}</text>
          </g>
        ))}

        <text x={SX} y={26} className="mp-t-axis" fill="var(--ink-3)">{F.stepLabel}</text>
        <line x1={SX} y1={52} x2={SX + 60} y2={52} stroke="var(--ink-2)" strokeWidth={1.6}
              markerStart="url(#mp-simw-ink)" markerEnd="url(#mp-simw-ink)" />
        <text x={SX + 74} y={58} className="mp-t-axis" fill="var(--ink-2)">{F.dt}</text>

        {F.steps.map((s, i) => (
          <g key={s}>
            <rect x={SX} y={stepY(i)} width={SW} height={PH} rx={20} fill="var(--paper-2)"
                  stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={SX + 22} y={stepY(i) + 26} className="mp-t-label" fill="var(--ink)">{s}</text>
            {i < F.steps.length - 1 && (
              <line x1={SX + 24} y1={stepY(i) + PH + 1} x2={SX + 24} y2={stepY(i + 1) - 3}
                    stroke="var(--ink-3)" strokeWidth={1.6} markerEnd="url(#mp-simw-ink)" />
            )}
          </g>
        ))}

        {/* 되돌아가는 화살표 — 이것이 «게임 루프» 다 */}
        <path d="M 800 396 V 418 H 950 V 68 H 800 V 80" fill="none" stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-simw-ink)" />
        <Lines x={SX} y={442} dy={20} lines={wrapW(F.levelSwitch, 16, 400)} cls="mp-t-axis" />
      </Svg>
    );

    // ── narrow 배치 상수 ── 전장을 먼저, 단계를 아래로. 관계는 그대로.
    const NS = 300 / 440;

    const narrow = (
      <Svg narrow w={340} h={880} label={F.title}>
        <Marks p="mp-simn" />

        <text x={20} y={20} className="mp-t-axis" fill="var(--ink-3)">{F.axesLabel}</text>
        <Arena x={20} y={30} w={300} h={250 * NS} s={NS} p="mp-simn" />

        {F.axes.map((a, i) => (
          <g key={a.id}>
            <circle cx={26} cy={236 + i * 68} r={6} fill={AXC[a.id]} />
            <text x={42} y={242 + i * 68} className="mp-t-label" fill="var(--ink)">{a.t}</text>
            <Lines x={42} y={264 + i * 68} dy={20} lines={wrapW(a.d, 16, 278)} cls="mp-t-axis" />
          </g>
        ))}

        <text x={20} y={464} className="mp-t-axis" fill="var(--ink-3)">{F.stepLabel}</text>
        <line x1={20} y1={490} x2={70} y2={490} stroke="var(--ink-2)" strokeWidth={1.6}
              markerStart="url(#mp-simn-ink)" markerEnd="url(#mp-simn-ink)" />
        <text x={82} y={496} className="mp-t-axis" fill="var(--ink-2)">{F.dt}</text>

        {F.steps.map((s, i) => (
          <g key={s}>
            <rect x={20} y={514 + i * 50} width={288} height={38} rx={19} fill="var(--paper-2)"
                  stroke="var(--rule-2)" strokeWidth={1.4} />
            <text x={38} y={539 + i * 50} className="mp-t-label" fill="var(--ink)">{s}</text>
            {i < F.steps.length - 1 && (
              <line x1={40} y1={553 + i * 50} x2={40} y2={561 + i * 50}
                    stroke="var(--ink-3)" strokeWidth={1.6} markerEnd="url(#mp-simn-ink)" />
            )}
          </g>
        ))}

        <path d="M 250 814 V 830 H 328 V 500 H 250 V 510" fill="none" stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-simn-ink)" />
        <Lines x={20} y={856} dy={20} lines={wrapW(F.levelSwitch, 16, 300)} cls="mp-t-axis" />
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


  /* ══ F06 — 같은 배치, 공격마다 갈리는 적중 ═══════════════════
     전달할 관계: 비교. 비교되지 않는 변수(배치)를 고정해 세 칸에 같은 좌표를 반복한다.
     ⚠️ 2026-09-06: 「경로 밖 배치」 행을 뺐다. 세 칸으로도 «적중 조건이 다르다» 는
        증명되고, 경로를 벗어나면 0 이 된다는 사실은 그림 아래 한 줄이 갖는다.
     wide 960×340 / narrow 340×720 (3열 → 3행) */

  // 셀 기준 좌표계 290×170.
  const F6_MON = [[92, 55], [126, 42], [150, 68], [110, 83], [146, 98], [178, 57], [172, 87], [126, 113]];
  const F6_PLAYER = [72, 80];
  const F6_BAND = 28, F6_CONTACT = 34, F6_RANGE = 120;
  const F6_HIT = { linear: [0, 2, 3, 4, 5, 6], chain: [0, 3, 4], contact: [0] };

  function PacingF06() {
    const F = P.f06;

    function CellArt({ x, y, w, h, s, colId, p }) {
      const px = F6_PLAYER[0], py = F6_PLAYER[1];
      const hit = F6_HIT[colId];
      const offY = (h - 170 * s) / 2;
      const grid = [];
      for (let gx = 48; gx < 290; gx += 48) grid.push(<line key={'v' + gx} x1={gx} y1={0} x2={gx} y2={170} stroke="var(--rule)" strokeWidth={1} />);
      for (let gy = 42; gy < 170; gy += 42) grid.push(<line key={'h' + gy} x1={0} y1={gy} x2={290} y2={gy} stroke="var(--rule)" strokeWidth={1} />);
      // ⚠️ 연쇄 사거리 원(r 120)은 셀 좌표계 290×170 을 넘는다. 클립하지 않으면
      //    옆 칸과 라벨 위로 원호가 지나가 «같은 배치» 비교가 깨진다(실측).
      const clip = p + '-clip-' + colId;
      return (
        <g>
          <defs>
            <clipPath id={clip} clipPathUnits="userSpaceOnUse">
              <rect x={0} y={0} width={290} height={170} />
            </clipPath>
          </defs>
          <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth={1.2} />
          <g transform={'translate(' + x + ',' + (y + offY) + ') scale(' + s + ')'} clipPath={'url(#' + clip + ')'}>
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

    const wide = (
      <Svg w={960} h={340} label={F.title}>
        <Marks p="mp-f06w" />
        {F.cols.map((c, i) => (
          <g key={c.id}>
            <text x={colX(i) + CW / 2} y={30} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{c.name}</text>
            <text x={colX(i) + CW / 2} y={52} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{c.cond}</text>
            <CellArt x={colX(i)} y={66} w={CW} h={170} s={1} colId={c.id} p="mp-f06w" />
            <text x={colX(i) + CW / 2} y={262} className="mp-t-value" textAnchor="middle" fill="var(--ink)">{c.hit}</text>
            {c.id === 'chain' && (
              <text x={colX(i) + 12} y={90} className="mp-t-axis" fill="var(--terra-500)">{F.excluded}</text>
            )}
          </g>
        ))}
        <Lines x={CX0} y={302} dy={22} lines={wrapW(F.offPath, 17, 900)} cls="mp-t-label" />
      </Svg>
    );

    // ── narrow 배치 상수 ── 3행. 같은 좌표를 세로로 반복해도 「배치는 같다」는 유지된다.
    const NW = 290, NH = 170;
    const nY = (i) => 60 + i * 216;                   // 60 · 276 · 492 ; 492 + 170 + 26 = 688 < 720 ✓

    const narrow = (
      <Svg narrow w={340} h={800} label={F.title}>
        <Marks p="mp-f06n" />
        {F.cols.map((c, i) => (
          <g key={c.id}>
            <text x={24} y={nY(i) - 26} className="mp-t-label" fill="var(--ink)">{c.name}</text>
            <text x={24} y={nY(i) - 6} className="mp-t-axis" fill="var(--ink-3)">{c.cond}</text>
            <CellArt x={24} y={nY(i)} w={NW} h={NH} s={1} colId={c.id} p="mp-f06n" />
            <text x={300} y={nY(i) + 158} className="mp-t-value" textAnchor="end" fill="var(--ink)">{c.hit}</text>
          </g>
        ))}
        <Lines x={24} y={696} dy={20} lines={wrapW(F.offPath, 16, 292)} cls="mp-t-axis" />
      </Svg>
    );

    return <Fig cls="mp-f06" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ F11 — 공유 계산 소스와 권한 경계 ═══════════════════════
     전달할 관계: 구조(무엇을 함께 읽는가) + 대비(누가 무엇을 바꿀 수 있는가).
     ⚠️ 2026-09-06 정정: 이전 판은 「노드 추가·삭제·선행 연결 변경은 표현 자체가 불가능」
        이라고만 그려 도구 전체가 못 하는 것처럼 읽혔다. 못 하는 것은 **AI 요청**이고,
        사람이 쓰는 에디터는 그 셋을 다 한다. 그래서 경계 상자 하나가 아니라
        **두 열의 대비 행렬**로 바꿨다 — ✓/✗ 가 같은 행에서 갈리는 것이 이 절의 사실이다.
     wide 960×580 / narrow 340×900 */

  function PacingF11() {
    const F = P.f11;
    const M = F.matrix;

    const Yes = ({ x, y }) => (
      <path d={'M ' + (x - 9) + ' ' + y + ' L ' + (x - 2) + ' ' + (y + 8) + ' L ' + (x + 10) + ' ' + (y - 9)}
            fill="none" stroke="var(--sage-700)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    );
    const No = ({ x, y }) => (
      <path d={'M ' + (x - 8) + ' ' + (y - 8) + ' L ' + (x + 8) + ' ' + (y + 8) +
               ' M ' + (x + 8) + ' ' + (y - 8) + ' L ' + (x - 8) + ' ' + (y + 8)}
            fill="none" stroke="var(--terra-500)" strokeWidth={3} strokeLinecap="round" />
    );

    // ── wide 배치 상수 ── 소스 20..230 · 에디터 300..480 · CLI 640..820
    const CA = 600, CB = 830;                          // 행렬 두 열의 중심
    const mRow = (i) => 350 + i * 44;                  // 350 · 394 · 438

    const wide = (
      <Svg w={960} h={580} label={F.title}>
        <Marks p="mp-f11w" />

        {/* 공유 소스 하나에서 두 소비자로 */}
        <rect x={20} y={50} width={210} height={72} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <Lines x={34} y={80} dy={24} lines={wrapW(F.sourceNode, 17, 190)} cls="mp-t-label" />
        <text x={20} y={144} className="mp-t-axis" fill="var(--sage-700)">{F.sourceNote}</text>

        <line x1={230} y1={80} x2={292} y2={80} stroke="var(--sage-700)" strokeWidth={2}
              markerEnd="url(#mp-f11w-sage)" />
        <path d="M 230 104 V 28 H 730 V 46" fill="none" stroke="var(--sage-700)" strokeWidth={2}
              strokeDasharray="7 5" markerEnd="url(#mp-f11w-sage)" />

        <rect x={300} y={54} width={180} height={54} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <text x={390} y={86} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.consumers[0]}</text>

        <rect x={640} y={54} width={180} height={54} rx={6} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={730} y={80} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.cliNode}</text>
        <text x={730} y={100} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.cliNote}</text>

        <line x1={480} y1={80} x2={632} y2={80} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f11w-ink)" />
        <text x={556} y={66} className="mp-t-axis" textAnchor="middle" fill="var(--ink-2)">{F.inputs[0].label}</text>
        <text x={556} y={102} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.inputs[0].from}</text>

        <text x={470} y={176} className="mp-t-label" fill="var(--ink-2)">{F.inputs[1].label}</text>
        <text x={470} y={198} className="mp-t-axis" fill="var(--ink-3)">{F.inputs[1].from}</text>
        <line x1={566} y1={168} x2={628} y2={102} stroke="var(--ink-3)" strokeWidth={1.8}
              strokeDasharray="2 5" markerEnd="url(#mp-f11w-ink)" />

        <Lines x={640} y={136} dy={20} lines={wrapW(F.runtimeNote, 16, 200)} cls="mp-t-axis" />

        <line x1={820} y1={80} x2={846} y2={80} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f11w-ink)" />
        <Lines x={854} y={74} dy={20} lines={wrapW(F.output, 16, 100)} cls="mp-t-label" />
        <Lines x={854} y={126} dy={20} lines={wrapW(F.outputNote, 16, 100)} cls="mp-t-axis" />

        <line x1={20} y1={232} x2={940} y2={232} stroke="var(--rule-2)" strokeWidth={1} />

        {/* 권한 대비 행렬 */}
        <text x={20} y={266} className="mp-t-label" fill="var(--ink)">{M.title}</text>
        <text x={CA} y={310} className="mp-t-label" textAnchor="middle" fill="var(--sage-700)">{M.cols[0]}</text>
        <text x={CB} y={310} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{M.cols[1]}</text>
        <line x1={20} y1={324} x2={940} y2={324} stroke="var(--ink-3)" strokeWidth={1.5} />

        {M.rows.map((r, i) => (
          <g key={r.k}>
            <text x={20} y={mRow(i) + 6} className="mp-t-label" fill="var(--ink)">{r.k}</text>
            {r.human ? <Yes x={CA} y={mRow(i)} /> : <No x={CA} y={mRow(i)} />}
            {r.ai ? <Yes x={CB} y={mRow(i)} /> : <No x={CB} y={mRow(i)} />}
            <line x1={20} y1={mRow(i) + 22} x2={940} y2={mRow(i) + 22} stroke="var(--rule)" strokeWidth={1} />
          </g>
        ))}

        <text x={20} y={490} className="mp-t-label" fill="var(--ink-2)">{M.writeLabel}</text>
        {M.writes.map((w, i) => (
          <Lines key={w} x={i === 0 ? CA : CB} y={490} dy={20}
                 lines={wrapW(w, 16, 200)} cls="mp-t-axis" anchor="middle" />
        ))}
        <Lines x={20} y={556} dy={20} lines={wrapW(M.note, 16, 920)} cls="mp-t-axis" />
      </Svg>
    );

    // ── narrow 배치 상수 ── 공유는 세로 3단, 행렬은 열 폭을 좁혀 그대로 유지한다.
    const nCA = 190, nCB = 288;
    const nRow = (i) => 606 + i * 62;                  // 606 · 668 · 730

    const narrow = (
      <Svg narrow w={340} h={900} label={F.title}>
        <Marks p="mp-f11n" />

        <rect x={20} y={20} width={300} height={62} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <Lines x={34} y={46} dy={24} lines={wrapW(F.sourceNode, 17, 272)} cls="mp-t-label" />
        <text x={20} y={104} className="mp-t-axis" fill="var(--sage-700)">{F.sourceNote}</text>

        <path d="M 110 86 L 90 118 M 230 86 L 250 118" fill="none" stroke="var(--sage-700)"
              strokeWidth={2} markerEnd="url(#mp-f11n-sage)" />

        <rect x={20} y={124} width={140} height={50} rx={6} fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth={2} />
        <text x={90} y={154} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.consumers[0]}</text>
        <rect x={180} y={124} width={140} height={50} rx={6} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={250} y={148} className="mp-t-label" textAnchor="middle" fill="var(--ink)">{F.cliNode}</text>
        <text x={250} y={168} className="mp-t-axis" textAnchor="middle" fill="var(--ink-3)">{F.cliNote}</text>

        {F.inputs.map((inp, i) => (
          <g key={inp.id}>
            <text x={20} y={210 + i * 48} className="mp-t-label" fill="var(--ink-2)">{inp.label}</text>
            <text x={20} y={232 + i * 48} className="mp-t-axis" fill="var(--ink-3)">{inp.from}</text>
            <line x1={i === 0 ? 160 : 150} y1={204 + i * 48} x2={i === 0 ? 240 : 246} y2={180}
                  stroke="var(--ink-3)" strokeWidth={1.8} strokeDasharray={i === 0 ? '9 5' : '2 5'}
                  markerEnd="url(#mp-f11n-ink)" />
          </g>
        ))}
        <Lines x={20} y={310} dy={20} lines={wrapW(F.runtimeNote, 16, 300)} cls="mp-t-axis" />
        <line x1={250} y1={174} x2={250} y2={366} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-f11n-ink)" />
        <Lines x={20} y={392} dy={20} lines={wrapW(F.output, 16, 300)} cls="mp-t-label" />
        <Lines x={20} y={434} dy={20} lines={wrapW(F.outputNote, 16, 300)} cls="mp-t-axis" />

        <line x1={20} y1={470} x2={320} y2={470} stroke="var(--rule-2)" strokeWidth={1} />
        <Lines x={20} y={500} dy={22} lines={wrapW(M.title, 17, 300)} cls="mp-t-label" />
        <text x={nCA} y={556} className="mp-t-axis" textAnchor="middle" fill="var(--sage-700)">{M.cols[0]}</text>
        <text x={nCB} y={556} className="mp-t-axis" textAnchor="middle" fill="var(--ink)">{M.cols[1]}</text>
        <line x1={20} y1={570} x2={320} y2={570} stroke="var(--ink-3)" strokeWidth={1.5} />

        {M.rows.map((r, i) => (
          <g key={r.k}>
            <Lines x={20} y={nRow(i) - 6} dy={20} lines={wrapW(r.k, 16, 130)} cls="mp-t-axis" />
            {r.human ? <Yes x={nCA} y={nRow(i) - 4} /> : <No x={nCA} y={nRow(i) - 4} />}
            {r.ai ? <Yes x={nCB} y={nRow(i) - 4} /> : <No x={nCB} y={nRow(i) - 4} />}
            <line x1={20} y1={nRow(i) + 34} x2={320} y2={nRow(i) + 34} stroke="var(--rule)" strokeWidth={1} />
          </g>
        ))}

        <text x={20} y={820} className="mp-t-axis" fill="var(--ink-2)">{M.writeLabel}</text>
        {M.writes.map((w, i) => (
          <Lines key={w} x={110} y={820 + i * 40} dy={18} lines={wrapW(w, 16, 210)} cls="mp-t-axis" />
        ))}
      </Svg>
    );

    return <Fig cls="mp-f11" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }

  /* ══ Flow — 밸런싱 한 바퀴 ═══════════════════════════════════
     전달할 관계: 순환 + 담당. 자산을 읽어 → CLI 가 자동으로 후보를 돌리고 →
     에디터에서 사람이 관찰·플레이로 확인하고 → 다시 자산에 쓴다.
     레인의 색이 담당을 말한다: ink = 자동, sage = 사람.
     레인을 좌우로 놓지 않고 위아래로 쌓는다 — 사이의 두 화살표(결과 / 다음 후보 조건)에
     라벨을 놓을 전용 공간이 좌우 배치에서는 나오지 않는다(실측 68px).
     wide 960×560 / narrow 340×900 */

  function PacingFlow() {
    const F = P.flow;

    const Step = (s, x, y, w, h, human, key) => (
      <g key={key}>
        <rect x={x} y={y} width={w} height={h} rx={4}
              fill={human ? 'var(--sage-50)' : 'var(--paper)'}
              stroke={human ? 'var(--sage-500)' : 'var(--rule-2)'} strokeWidth={1.6} />
        <text x={x + 16} y={y + 30} className="mp-t-label" fill="var(--ink)">{s.t}</text>
        <Lines x={x + 16} y={y + 56} dy={20} lines={wrapW(s.d, 16, w - 32)} cls="mp-t-axis" />
      </g>
    );

    // ── wide 배치 상수 ── 레인 20..940 · 안쪽 상자 두 개 36..466 / 490..920
    const LX = 20, LW = 920, BX = [36, 490], BW = 430, BH = 78;
    const laneY = (i) => 160 + i * 172;               // 160 · 332 ; 332 + 120 = 452 < 560 ✓

    const wide = (
      <Svg w={960} h={560} label={F.title}>
        <Marks p="mp-floww" />

        {/* 위 — 밸런스 대상 */}
        <rect x={LX} y={26} width={LW} height={72} rx={4} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={36} y={52} className="mp-t-axis" fill="var(--ink-3)">{F.assetLabel}</text>
        <text x={36} y={82} className="mp-t-label" fill="var(--ink)">{F.asset}</text>

        {/* ① 읽는다 */}
        <line x1={120} y1={98} x2={120} y2={152} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-floww-ink)" />
        <text x={136} y={124} className="mp-t-label" fill="var(--ink)">{F.readLabel}</text>
        <text x={136} y={146} className="mp-t-axis" fill="var(--ink-3)">{F.readNote}</text>

        {/* ⑤ 반영한다 — 오른쪽 여백(940..960)을 타고 자산으로 돌아간다 */}
        <path d="M 830 452 V 496 H 950 V 116 H 844 V 96" fill="none" stroke="var(--sage-700)"
              strokeWidth={2} markerEnd="url(#mp-floww-sage)" />
        <text x={812} y={484} className="mp-t-label" textAnchor="end" fill="var(--sage-700)">{F.applyLabel}</text>
        <text x={812} y={506} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{F.applyNote}</text>

        {/* 두 레인 */}
        {F.lanes.map((lane, li) => {
          const human = lane.id === 'human';
          const y0 = laneY(li);
          return (
            <g key={lane.id}>
              <rect x={LX} y={y0} width={LW} height={120} rx={5} fill="none"
                    stroke={human ? 'var(--sage-400)' : 'var(--rule-2)'}
                    strokeWidth={1.5} strokeDasharray="6 5" />
              <text x={36} y={y0 + 24} className="mp-t-label"
                    fill={human ? 'var(--sage-700)' : 'var(--ink)'}>{lane.label}</text>
              <text x={924} y={y0 + 24} className="mp-t-axis" textAnchor="end" fill="var(--ink-3)">{lane.actor}</text>
              {lane.steps.map((s, si) => Step(s, BX[si], y0 + 36, BW, BH, human, lane.id + si))}
              <line x1={BX[0] + BW + 2} y1={y0 + 75} x2={BX[1] - 10} y2={y0 + 75}
                    stroke={human ? 'var(--sage-700)' : 'var(--ink-3)'} strokeWidth={2}
                    markerEnd={human ? 'url(#mp-floww-sage)' : 'url(#mp-floww-ink)'} />
            </g>
          );
        })}

        {/* 레인 사이 — 아래로 결과, 위로 다음 후보 조건 */}
        <line x1={600} y1={282} x2={600} y2={326} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-floww-ink)" />
        <text x={614} y={310} className="mp-t-axis" fill="var(--ink-2)">{F.linkOut}</text>
        <line x1={200} y1={330} x2={200} y2={286} stroke="var(--sage-700)" strokeWidth={2}
              markerEnd="url(#mp-floww-sage)" />
        <text x={214} y={310} className="mp-t-axis" fill="var(--sage-700)">{F.linkBack}</text>

        {/* 두 레인이 같은 계산 소스를 쓴다 */}
        <line x1={LX} y1={528} x2={760} y2={528} stroke="var(--sage-500)" strokeWidth={1.5} strokeDasharray="7 5" />
        <text x={LX} y={552} className="mp-t-axis" fill="var(--sage-700)">{F.sameSource}</text>
      </Svg>
    );

    // ── narrow 배치 상수 ── 세로 한 줄. 관계(순환 · 두 담당)는 그대로 둔다.
    const NX = 20, NWD = 300;
    const nLaneY = (i) => 190 + i * 288;              // 190 · 478 ; 478 + 264 = 742 < 900 ✓

    const narrow = (
      <Svg narrow w={340} h={900} label={F.title}>
        <Marks p="mp-flown" />

        <rect x={NX} y={20} width={NWD} height={94} rx={4} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={2} />
        <text x={NX + 14} y={46} className="mp-t-axis" fill="var(--ink-3)">{F.assetLabel}</text>
        <Lines x={NX + 14} y={72} dy={20} lines={wrapW(F.asset, 16, NWD - 28)} cls="mp-t-label" />

        <line x1={60} y1={114} x2={60} y2={182} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-flown-ink)" />
        <text x={74} y={140} className="mp-t-label" fill="var(--ink)">{F.readLabel}</text>
        <Lines x={74} y={162} dy={20} lines={wrapW(F.readNote, 16, 240)} cls="mp-t-axis" />

        {F.lanes.map((lane, li) => {
          const human = lane.id === 'human';
          const y0 = nLaneY(li);
          return (
            <g key={lane.id}>
              <rect x={NX} y={y0} width={NWD} height={264} rx={5} fill="none"
                    stroke={human ? 'var(--sage-400)' : 'var(--rule-2)'}
                    strokeWidth={1.5} strokeDasharray="6 5" />
              <text x={NX + 14} y={y0 + 26} className="mp-t-label"
                    fill={human ? 'var(--sage-700)' : 'var(--ink)'}>{lane.label}</text>
              <text x={NX + 14} y={y0 + 48} className="mp-t-axis" fill="var(--ink-3)">{lane.actor}</text>
              {lane.steps.map((s, si) => Step(s, NX + 14, y0 + 62 + si * 98, NWD - 28, 86, human, lane.id + 'n' + si))}
              <line x1={170} y1={y0 + 150} x2={170} y2={y0 + 158} stroke="var(--ink-3)" strokeWidth={2}
                    markerEnd={human ? 'url(#mp-flown-sage)' : 'url(#mp-flown-ink)'} />
            </g>
          );
        })}

        {/* 레인 사이 */}
        <line x1={240} y1={456} x2={240} y2={472} stroke="var(--ink)" strokeWidth={2}
              markerEnd="url(#mp-flown-ink)" />
        <text x={232} y={468} className="mp-t-axis" textAnchor="end" fill="var(--ink-2)">{F.linkOut}</text>
        <path d="M 20 500 H 8 V 300 H 16" fill="none" stroke="var(--sage-700)" strokeWidth={2}
              markerEnd="url(#mp-flown-sage)" />
        <text x={22} y={766} className="mp-t-axis" fill="var(--sage-700)">{F.linkBack}</text>

        {/* ⑤ 반영 — 오른쪽 여백을 타고 자산으로 */}
        <path d="M 320 742 H 332 V 66 H 322" fill="none" stroke="var(--sage-700)" strokeWidth={2}
              markerEnd="url(#mp-flown-sage)" />
        <text x={314} y={766} className="mp-t-label" textAnchor="end" fill="var(--sage-700)">{F.applyLabel}</text>
        <Lines x={40} y={796} dy={20} lines={wrapW(F.applyNote, 16, 274)} cls="mp-t-axis" />

        <line x1={NX} y1={834} x2={320} y2={834} stroke="var(--sage-500)" strokeWidth={1.5} strokeDasharray="7 5" />
        <Lines x={NX} y={858} dy={20} lines={wrapW(F.sameSource, 16, 300)} cls="mp-t-axis" />
      </Svg>
    );

    return <Fig cls="mp-f00" title={F.title} caption={F.caption}>{wide}{narrow}</Fig>;
  }
  /* == Goal 목표 주기 ============================================
     3단이 닫힌 고리로 돌아온다는 것이 도형으로 보여야 한다.
     원문 박자는 고리 «밖» 에 둔다 - 안에 넣으면 겹친다. */

  function PacingGoal() {
    const G = P.goal;
    const tone = {
      resist: { s: 'var(--terra-300)', f: 'var(--terra-50)', t: 'var(--terra-700)' },
      fast: { s: 'var(--sage-500)', f: 'var(--sage-50)', t: 'var(--sage-700)' },
      slow: { s: 'var(--sage-300)', f: 'var(--paper-2)', t: 'var(--sage-700)' },
    };

    const Phase = (ph, x, y, w, h) => {
      const c = tone[ph.id];
      return (
        <g key={ph.id}>
          <rect x={x} y={y} width={w} height={h} rx={3} fill={c.f} stroke={c.s} strokeWidth={2} />
          <text x={x + 16} y={y + 34} className="mp-t-head" fill={c.t}>{ph.name}</text>
          <Lines x={x + 16} y={y + 62} dy={20} lines={wrapW(ph.d, 16, w - 32)} cls="mp-t-axis" />
        </g>
      );
    };

    // 박자 한 줄 - 출처 태그 + 원문
    const Beat = (ph, k, x, y, w) => (
      <g key={ph.id + 'b' + k}>
        <text x={x} y={y} className="mp-t-axis" fill="var(--ink-3)">{G.beatSources[k]}</text>
        <Lines x={x + 48} y={y} dy={19} lines={wrapW(ph.beats[k], 16, w - 48)} cls="mp-t-axis" />
      </g>
    );

    // wide - 20 + 3*280 + 2*40 = 940 < 960 OK
    const BX = [20, 340, 660], BW = 280, BY = 92, BH = 108;

    const wide = (
      <Svg w={960} h={366} label={G.figTitle}>
        <Marks p="mp-goalw" />
        {/* 고리를 닫는 귀환선 - «반복» 을 글자가 아니라 도형이 말한다 */}
        <path d="M 940 146 H 952 V 54 H 160 V 86" fill="none" stroke="var(--terra-400)" strokeWidth={2}
              markerEnd="url(#mp-goalw-terra)" />
        <text x={556} y={46} className="mp-t-label" fill="var(--terra-500)" textAnchor="middle">{G.repeat}</text>

        {G.cycle.map((ph, i) => Phase(ph, BX[i], BY, BW, BH))}
        {[0, 1].map(i => (
          <line key={'ba' + i} x1={BX[i] + BW} y1={146} x2={BX[i + 1] - 8} y2={146}
                stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#mp-goalw-ink)" />
        ))}

        {/* 원문 박자 - 고리 밖, 각 구간 아래 */}
        {G.cycle.map((ph, i) => (
          <g key={'bt' + ph.id}>
            <line x1={BX[i]} y1={224} x2={BX[i] + BW} y2={224} stroke="var(--rule)" strokeWidth={1} />
            {Beat(ph, 0, BX[i], 250, BW)}
            {Beat(ph, 1, BX[i], 312, BW)}
          </g>
        ))}
      </Svg>
    );

    // narrow - 20 + 300 = 320 < 340 OK
    const NX = 20, NW = 300, NBH = 112;   // 제목 34 + 설명 3줄(62·82·102) + 여백
    const py = (i) => 56 + i * 240;       // 56 296 536 · 한 구간 = 상자 112 + 박자 98 = 210 < 240 OK

    const narrow = (
      <Svg narrow w={340} h={800} label={G.figTitle}>
        <Marks p="mp-goaln" />
        <text x={176} y={30} className="mp-t-label" fill="var(--terra-500)" textAnchor="middle">{G.repeat}</text>
        {/* 왼쪽 여백을 따라 올라가 고리를 닫는다 */}
        <path d="M 20 760 H 8 V 80 H 16" fill="none" stroke="var(--terra-400)" strokeWidth={2}
              markerEnd="url(#mp-goaln-terra)" />

        {G.cycle.map((ph, i) => (
          <g key={'np' + ph.id}>
            {Phase(ph, NX, py(i), NW, NBH)}
            {Beat(ph, 0, NX, py(i) + NBH + 26, NW)}
            {Beat(ph, 1, NX, py(i) + NBH + 68, NW)}
            {i < 2 && (
              <line x1={176} y1={py(i) + 214} x2={176} y2={py(i + 1) - 8}
                    stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#mp-goaln-ink)" />
            )}
          </g>
        ))}
      </Svg>
    );

    return <Fig cls="mp-f0g" title={G.figTitle} caption={G.sourceNote}>{wide}{narrow}</Fig>;
  }

  Object.assign(window, {
    PacingFlow, PacingGoal, PacingProgress,
    PacingF02, PacingSim, PacingF05, PacingF06, PacingF11
  });
})();
