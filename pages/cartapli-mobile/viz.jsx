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
        {`막대 바로 위 = 남은 비용 (${unit}) · 그 위 큰 글씨 = 직전 대비 감소율`}
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
        {/* 축 제목을 padT−8 에 두면 맨 위 눈금 라벨(padT+4)과 사각형이 겹친다 — 한 줄 위로 뺀다 */}
        <text x={padL - 46} y={padT - 14} className="cm-svg-sub">{yLabel}</text>

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

/* ─── 가려진 레이어를 찾는 방법 ──────────────────────── */
/* 삭제 조건을 그림 하나로 — 위아래 레이어가 좌우로 더 넓어 완전히 포함할 때만 지운다.
   층을 4장으로 줄였다. 원리를 보여주는 데 필요한 최소 구성:
     · 완전히 포함된 레이어 1장 (삭제)
     · 가장자리가 삐져나와 위에서 보이는 레이어 1장 (유지)
     · 그 둘을 덮는 위/아래 레이어 */
function CMBuriedViz() {
  const W = 720, H = 236;
  const h = 22, gap = 18, ox = 24, oy = 62;
  // [x, w, buried] — 로컬 x 0..250. 아래 → 위 순서
  const layers = [
    [0,  250, false],   // 맨 아래
    [20, 210, false],   // 20~230 — 위 레이어들(30~200)보다 넓어 양끝이 보인다
    [50, 110, true],    // 50~160 — 위(30~200)·아래(20~230) 모두에 완전히 포함
    [30, 170, false],   // 맨 위
  ];
  const n = layers.length;
  const yOf = i => oy + (n - 1 - i) * (h + gap);
  const kept = layers.filter(l => !l[2]);
  const bi = layers.findIndex(l => l[2]);
  const bx1 = ox + layers[bi][0], bx2 = ox + layers[bi][0] + layers[bi][1];
  const ax = 292, rx = 512, rs = 0.62;

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="위아래 레이어에 완전히 포함된 레이어만 삭제한다">
        <text x={ox} y="22" className="cm-svg-lbl">종이 단면 — 옆에서 본 레이어 스택</text>
        <text x={ox} y="40" className="cm-svg-sub">아래에서 위로 쌓인다</text>

        {/* 포함 관계를 보여주는 세로 가이드 — 위/아래 레이어가 이 선 바깥까지 뻗어 있다 */}
        <line x1={bx1} x2={bx1} y1={yOf(n - 1)} y2={yOf(bi - 1) + h}
              stroke="var(--terra-400)" strokeDasharray="3 3" />
        <line x1={bx2} x2={bx2} y1={yOf(n - 1)} y2={yOf(bi - 1) + h}
              stroke="var(--terra-400)" strokeDasharray="3 3" />

        {layers.map((l, i) => {
          const y = yOf(i), b = l[2];
          return (
            <rect key={i} x={ox + l[0]} y={y} width={l[1]} height={h} rx="2"
                  fill={b ? 'var(--terra-100)' : 'var(--sage-100)'}
                  stroke={b ? 'var(--terra-500)' : 'var(--sage-500)'}
                  strokeWidth={b ? 1.6 : 1}
                  strokeDasharray={b ? '5 3' : ''} />
          );
        })}

        {/* 주석 두 개만 */}
        <text x={ax} y={yOf(bi) + 10} className="cm-svg-tag">위·아래가 좌우로 더 넓다</text>
        <text x={ax} y={yOf(bi) + 24} className="cm-svg-tag">→ 완전히 가려짐 · 삭제</text>
        <text x={ax} y={yOf(1) + 16} className="cm-svg-sub">양끝이 삐져나와 위에서 보인다 · 유지</text>

        <line x1={rx - 24} x2={rx - 24} y1="14" y2={yOf(0) + h} stroke="var(--rule)" strokeDasharray="4 4" />
        <text x={rx} y="22" className="cm-svg-lbl">삭제 후 — 화면 결과 동일</text>
        {kept.map((l, i) => (
          <rect key={i} x={rx + l[0] * rs} y={oy + (kept.length - 1 - i) * (h + gap)}
                width={l[1] * rs} height={h} rx="2" fill="var(--sage-100)" stroke="var(--sage-500)" />
        ))}
      </svg>
      <figcaption className="cm-figcap">
        위아래 레이어가 <b>좌우로 더 넓어 완전히 덮을 때만</b> 지운다.
        조금이라도 삐져나오면 접었을 때 그 부분이 드러나므로 남긴다.
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
          <div className="cm-rend-h">이전 — 레이어 1장마다 렌더러 1개</div>
          <div className="cm-rend-grid">
            {cells.map((_, i) => <span key={i} className="cm-rend-dot"></span>)}
            <span className="cm-rend-more">… 총 77개</span>
          </div>
          <div className="cm-rend-metric">드로우콜 <b>+71</b></div>
        </div>
        <div className="cm-rend-arrow">→</div>
        <div className="cm-rend-side to">
          <div className="cm-rend-h">현재 — 앞/뒤 메시 2개로 고정</div>
          <div className="cm-rend-two">
            <span className="cm-rend-mesh front">앞면 메시</span>
            <span className="cm-rend-mesh back">뒷면 메시</span>
          </div>
          <div className="cm-rend-metric ok">드로우콜 <b>+1</b></div>
        </div>
      </div>
      <figcaption className="cm-figcap">
        그리는 폴리곤 양은 그대로다. <b>바뀐 것은 몇 개의 렌더러로 나눠 보내느냐뿐이다.</b>
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
        <text x={x0} y="18" className="cm-svg-lbl">레이어별 독립 계산 — 병렬 실행, 완료 순서 보장 없음</text>
        {segs.map((s, i) => (
          <g key={s.n}>
            <rect x={s.xf} y="28" width={s.wf + s.wl} height="24" rx="3" fill="var(--paper-2)" stroke="var(--rule-2)" />
            <text x={s.xf + (s.wf + s.wl) / 2} y="44" textAnchor="middle" className="cm-svg-ax">레이어 {s.n}</text>
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
        <text x={x0} y={yBuf + hBuf + 22} className="cm-svg-lbl">NativeArray 출력 버퍼 — 레이어마다 슬롯이 사전 배정돼 있다</text>
      </svg>
      <figcaption className="cm-figcap">
        슬롯 폭이 레이어마다 다른 것은 정점 수가 다르기 때문이다.
        <b> 어느 레이어가 어디에 쓸지는 잡이 시작되기 전에 이미 정해져 있다.</b>
      </figcaption>
    </figure>
  );
}
window.CMJobViz = CMJobViz;

/* ─── 볼록 뺄셈 — 반평면 자르기 ──────────────────────── */
/* 대신하는 문장: "볼록 덮개를 빼는 일은 덮개의 변마다 한 조각씩 떼어내는 일이고,
   떼어낸 조각은 전부 다시 볼록이다."
   도형은 실제 알고리즘 그대로다 — 사각 조각에서 사각 덮개를 빼면 왼쪽·위·아래 세 조각이
   나오고, 덮개의 오른쪽 변은 조각 밖이라 아무것도 떼어내지 않는다. */
function CMConvexViz() {
  // ⚠️ 가로:세로 비가 이 그림의 실크기를 정한다. 덱은 그림에 폭 1,726px · 세로 300~460px 를
  //    주므로(비 4~6) 세로로 넉넉한 viewBox 는 세로에 갇혀 글자가 10px 로 찍힌다(실측).
  //    비 2.9 로 눕혀 두면 사이트·덱 양쪽에서 폭이 배율을 정한다.
  const W = 640, H = 222;
  const sq = 140, ay = 46;
  const ax = 40, bx = 440;              // 두 판의 왼쪽 x. bx + sq = 580 < 640
  const cl = 47, ct = 35, cb = 105;     // 덮개가 조각을 자르는 위치 (조각 좌상단 기준)
  const coverR = 186;                   // 덮개 오른쪽 — 조각(140) 밖이라 이 변은 아무것도 못 떼어낸다

  const piece = (x, y, w, h, n) => (
    <g key={n}>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="var(--sage-100)" stroke="var(--sage-500)" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="cm-svg-ax">{n}</text>
    </g>
  );

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="볼록 덮개를 빼면 덮개의 변마다 볼록 조각이 하나씩 떨어져 나온다">
        <text x={ax} y="18" className="cm-svg-lbl">조각에서 볼록 덮개를 뺀다</text>
        <text x={ax} y="35" className="cm-svg-sub">덮개는 반평면 네 개의 교집합</text>
        <text x={bx} y="18" className="cm-svg-lbl">변마다 한 조각씩 떨어져 나온다</text>
        <text x={bx} y="35" className="cm-svg-sub">떨어져 나온 조각은 전부 다시 볼록</text>

        {/* 왼쪽 — 조각과 덮개가 겹쳐 있는 상태 */}
        <rect x={ax} y={ay} width={sq} height={sq} rx="2" fill="var(--sage-50)" stroke="var(--sage-500)" />
        <rect x={ax + cl} y={ay + ct} width={coverR - cl} height={cb - ct} rx="2"
              fill="var(--terra-50)" stroke="var(--terra-400)" strokeDasharray="5 3" strokeWidth="1.6" />
        <text x={ax + 8} y={ay + 16} className="cm-svg-sub">조각</text>
        <text x={ax + coverR - 40} y={ay + ct - 6} className="cm-svg-tag">덮개</text>

        {/* 화살표 */}
        <line x1={ax + coverR + 20} x2={bx - 26} y1={ay + sq / 2} y2={ay + sq / 2}
              stroke="var(--ink-3)" strokeWidth="1.5" />
        <polygon points={`${bx - 26},${ay + sq / 2 - 5} ${bx - 26},${ay + sq / 2 + 5} ${bx - 14},${ay + sq / 2}`}
                 fill="var(--ink-3)" />

        {/* 오른쪽 — 남은 조각 세 개 + 덮인 부분 */}
        {piece(bx, ay, cl, sq, '1')}
        {piece(bx + cl, ay, sq - cl, ct, '2')}
        {piece(bx + cl, ay + cb, sq - cl, sq - cb, '3')}
        <rect x={bx + cl} y={ay + ct} width={sq - cl} height={cb - ct}
              fill="var(--terra-50)" stroke="var(--terra-400)" strokeDasharray="4 3" />
        <text x={bx + cl + (sq - cl) / 2} y={ay + ct + (cb - ct) / 2 + 4} textAnchor="middle"
              className="cm-svg-tag">덮였다</text>

        <text x={ax} y={ay + sq + 22} className="cm-svg-sub">남은 조각이 0이 되면 그 레이어는 빈틈없이 덮인 것이다 — 넓이를 재는 단계가 없다</text>
      </svg>
      <figcaption className="cm-figcap">
        덮개의 변을 하나씩 훑으며 <b>“이번 변 바깥”을 떼어낸다</b> — 떼어낸 조각이 전부 다시 볼록이라
        교차점을 구하거나 링을 조립하는 단계가 없다. 오른쪽 변은 조각 밖이라 아무것도 떼어내지 않으므로 조각은 3개다.
      </figcaption>
    </figure>
  );
}
window.CMConvexViz = CMConvexViz;

/* ─── 정책 비교 — 손익분기와 잃는 것 ─────────────────── */
/* 대신하는 문장: "두 정책의 승패는 접기 빈도가 정하고, 설계값은 손익분기보다 60~100배 뜸하다."
   두 패널이 한 결정의 두 축이다.
     왼쪽  프레임당 평균 비용을 접기 간격의 함수로. 두 선이 실제로 교차한다
     오른쪽 그래서 ②를 골랐을 때 회차별 레이어가 어떻게 되는가
   ⚠️ 이 그림이 성립하는 이유 — 마커는 드래그 중 **매 프레임**, 판정은 확정 **한 번**이다.
      성격이 다른 두 비용이라 한 칸에 더할 수 없고, 더하려면 빈도가 필요하다.
   ⚠️ 총폭 = pbX(424) + pbW(272) + 라벨 여유 = 710 < 760. */
function CMPolicyViz() {
  const W = 760, H = 232;

  // ── 왼쪽 — 손익분기 (16회차 실측에서 나온 두 상수) ──
  //   ② 38.3 µs/프레임 + 256 µs/확정   ③ 45.8 µs/프레임 + 114 µs/확정
  //   교차 N = 142 / 7.5 = 18.9 프레임
  const F2 = 38.3, J2 = 256, F3 = 45.8, J3 = 114;
  const c2 = (n) => F2 + J2 / n;
  const c3 = (n) => F3 + J3 / n;
  const N0 = 8, N1 = 2000, yTop = 75;
  const laX = 72, laW = 272, laY = 42, laH = 124;
  const lg = (v) => Math.log10(v);
  const nx = (n) => laX + ((lg(n) - lg(N0)) / (lg(N1) - lg(N0))) * laW;
  const vy = (v) => laY + laH - (Math.min(v, yTop) / yTop) * laH;
  const curve = (f) => Array.from({ length: 61 }, (_, i) => {
    const n = N0 * Math.pow(N1 / N0, i / 60);
    return `${nx(n)},${vy(f(n))}`;
  }).join(' ');
  const CROSS = 18.9, BENCH = 9.7, DESIGN = 1200;

  // ── 오른쪽 — 회차별 레이어 (docs/perf S2-c · S2-d CSV 의 Paper.LayerCount) ──
  const conv = [2, 4, 7, 10, 11, 13, 17, 21, 25, 29, 28, 35, 41, 42, 43, 41];
  const sing = [2, 4, 7, 10, 11, 16, 20, 27, 31, 43, 43, 51, 60, 60, 62, 57];
  const pbX = 424, pbW = 272, pbY = 52, pbH = 122, yMax = 70;
  const px = (i) => pbX + (i / 15) * pbW;
  const py = (v) => pbY + pbH - (v / yMax) * pbH;
  const poly = (a) => a.map((v, i) => `${px(i)},${py(v)}`).join(' ');

  return (
    <figure className="cm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="cm-svg" role="img"
           aria-label="접기 간격에 따른 두 정책의 프레임당 비용과 회차별 레이어 수">
        {/* ── 왼쪽 패널 ── */}
        <text x="30" y="18" className="cm-svg-lbl">프레임당 평균 비용 — 접기 간격의 함수 (16회차)</text>
        {[0, 25, 50, 75].map((t) => (
          <g key={t}>
            <line x1={laX} x2={laX + laW} y1={vy(t)} y2={vy(t)} stroke="var(--rule)" strokeDasharray={t ? '3 4' : ''} />
            <text x={laX - 8} y={vy(t) + 4} textAnchor="end" className="cm-svg-sub">{t}</text>
          </g>
        ))}
        <text x={laX - 46} y={laY - 8} className="cm-svg-sub">µs</text>
        {/* 손익분기 오른쪽 = ② 가 이기는 구간. 실제 설계가 여기 있다 */}
        <rect x={nx(CROSS)} y={laY} width={laX + laW - nx(CROSS)} height={laH} fill="var(--sage-100)" opacity="0.5" />
        <polyline points={curve(c3)} fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="5 3" />
        <polyline points={curve(c2)} fill="none" stroke="var(--sage-500)" strokeWidth="2.5" />
        <circle cx={nx(CROSS)} cy={vy(c2(CROSS))} r="4.5" fill="var(--paper)" stroke="var(--terra-500)" strokeWidth="2" />
        <text x={nx(CROSS) + 8} y={vy(c2(CROSS)) - 8} className="cm-svg-tag">손익분기 19프레임 · 0.32초</text>
        {[[BENCH, '벤치'], [DESIGN, '설계']].map(([n, lbl]) => (
          <g key={lbl}>
            <line x1={nx(n)} x2={nx(n)} y1={laY} y2={laY + laH} stroke="var(--terra-400)" strokeDasharray="2 3" />
            <text x={nx(n)} y={laY - 4} textAnchor="middle" className="cm-svg-tag">{lbl}</text>
          </g>
        ))}
        <text x={nx(1400)} y={vy(c2(1400)) + 16} textAnchor="end" className="cm-svg-end" fill="var(--sage-700)">② 38.5</text>
        <text x={nx(1400)} y={vy(c3(1400)) - 8} textAnchor="end" className="cm-svg-end" fill="var(--ink-3)">③ 45.9</text>
        {[[10, '0.17초'], [100, '1.7초'], [1000, '17초']].map(([n, s]) => (
          <text key={n} x={nx(n)} y={laY + laH + 16} textAnchor="middle" className="cm-svg-sub">{s}</text>
        ))}
        <text x={laX + laW / 2} y={laY + laH + 32} textAnchor="middle" className="cm-svg-sub">접기 간격 · 로그 축</text>

        <line x1="382" x2="382" y1="14" y2={H - 14} stroke="var(--rule)" strokeDasharray="4 4" />

        {/* ── 오른쪽 패널 ── */}
        <text x={pbX} y="18" className="cm-svg-lbl">회차별 레이어 — 두 정책이 갈라지는 자리</text>
        {[0, 35, 70].map((t) => (
          <g key={t}>
            <line x1={pbX} x2={pbX + pbW} y1={py(t)} y2={py(t)} stroke="var(--rule)" strokeDasharray={t ? '3 4' : ''} />
            <text x={pbX - 8} y={py(t) + 4} textAnchor="end" className="cm-svg-sub">{t}</text>
          </g>
        ))}
        {/* 1~5회차는 두 정책의 값이 같다 — 그 구간을 면으로 덮어 "여기까지는 같다" 를 보인다 */}
        <rect x={pbX} y={pbY} width={px(4) - pbX} height={pbH} fill="var(--sage-100)" opacity="0.55" />
        <text x={(pbX + px(4)) / 2} y={pbY + 14} textAnchor="middle" className="cm-svg-sub">한 장도 안 다름</text>
        <polyline points={poly(sing)} fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="5 3" />
        <polyline points={poly(conv)} fill="none" stroke="var(--sage-500)" strokeWidth="2.5" />
        <circle cx={px(5)} cy={py(sing[5])} r="4" fill="none" stroke="var(--terra-500)" strokeWidth="1.6" />
        <text x={px(5) + 8} y={py(sing[5]) - 6} className="cm-svg-tag">6회차부터 갈림</text>
        <text x={px(15) - 4} y={py(sing[15]) - 8} textAnchor="end" className="cm-svg-end" fill="var(--ink-3)">③ 57</text>
        <text x={px(15) - 4} y={py(conv[15]) + 16} textAnchor="end" className="cm-svg-end" fill="var(--sage-700)">② 41</text>
        {[1, 5, 10, 16].map((r) => (
          <text key={r} x={px(r - 1)} y={pbY + pbH + 16} textAnchor="middle" className="cm-svg-sub">{r}</text>
        ))}
        <text x={pbX + pbW / 2} y={pbY + pbH + 32} textAnchor="middle" className="cm-svg-sub">접기 회차</text>
      </svg>
      <figcaption className="cm-figcap">
        <b>② 볼록 뺄셈(채택)과 ③ 단일 덮개 — 승패는 접기가 얼마나 잦은가가 정한다.</b> ③이 아끼는 것은 확정 순간 한 프레임뿐이고,
        그 대가로 매 프레임 비용을 더 문다. 접기가 뜸할수록 불리해진다는 뜻이다. 벤치는 0.16초 간격이라 ③ 쪽에 서 있었고,
        실제 설계는 분당 2~3회 — 손익분기보다 60~100배 뜸하다. 대신 ②는 5회차까지 ③과 한 장도 다른 답을 내지 않는다.
      </figcaption>
    </figure>
  );
}
window.CMPolicyViz = CMPolicyViz;

/* ─── 큰 숫자 칸 ─────────────────────────────────────── */
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
