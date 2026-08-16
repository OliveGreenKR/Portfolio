// pages/motelet/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
// 색은 tokens.css 변수만 (sage = 유효/채택, terra = 막힘/제외, ink-3 = 중립).
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 계측본이 없으므로
//         "측정 결과처럼 보이는 그림" 을 만들지 않는다. 여기 있는 것은 원리도 하나다 —
//         기하 월드의 구성. 눈금도 값도 없다.
//         (밀집·여유 질의 그림 2장은 2026-08-15 제거 — 두 질의의 *차이* 를 설명하는 그림인데
//          §05 의 주제는 "N 객체 범위 질의를 감당했다" 라 축이 어긋난다.)
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.mt-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 mt-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         숨긴 내용은 figcaption 이 받는다.

/* ─── 물리 엔진 자리에 들어간 것의 범위 ──────────────── */
/* 이 그림의 일은 자랑이 아니라 한계 긋기다 — "물리 엔진을 직접 만들었다" 로
   읽히지 않게, 실제로 들어간 것이 네 겹뿐임을 보인다. */
function MTGeoArchViz({ caption }) {
  const W = 760, H = 262;
  // 총폭: 마지막 열 x=566 + w=178 = 744 < 760 ✓
  const cols = [
    { x: 16,  w: 140, t: '호출자',       items: ['블레이드 매 프레임', '대시 스윕 1회', '장판 · 밀대', '스폰 · 배치'] },
    { x: 186, w: 170, t: '질의 4종',      items: ['원', '캡슐', '회전 사각', '캡슐 다발'] },
    { x: 386, w: 150, t: '모양 디스패치', items: ['바디 = 원', '바디 = 캡슐', '× 질의 모양', '→ 커널 선택'] },
    { x: 566, w: 178, t: '수학 커널 7',   items: ['원-원 · 원-캡슐', '원-사각 · 캡슐-캡슐', '캡슐-사각', '선분 · 점 거리'] },
  ];
  const top = 44, boxH = 176;

  return (
    /* 좁은 폭 처리는 page.css 의 .mt-figure 가 공통으로 맡는다 —
       viewBox 를 폭에 맞춰 줄이면 글자가 3.2px 로 유실되므로 그림만 가로 스와이프. */
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


/* ─── 한 판의 골드를 무엇으로 쪼갰나 ─────────────────── */
/* 이 페이지에서 제일 먼저 보여야 하는 그림. 정의(두 줄)만으로는
   "그래서 무엇을 계산하나" 가 안 잡힌다 — 최종 분해를 먼저 세운다.
   숫자 없음. 구조만 말한다. */
function MTGoldDecompViz() {
  const W = 760, H = 268;
  // 총폭: 마지막 열 x=596 + w=148 = 744 < 760 ✓
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

/* ─── 만든 것 3칸 ────────────────────────────────────── */
/* 큰 숫자 밴드가 아니다. 이 페이지에는 개선 전후를 비교할 계측본이 없어
   히어로에 올릴 성과 수치가 없다. 규모·설정값을 숫자처럼 세우면 훅과 무관한
   장식이 되므로, 세 칸에 만든 것을 적고 kind 로 아래 섹션을 예고한다. */
function MTBuilt({ items }) {
  return (
    <div className="mt-built">
      {items.map(it => (
        <div className="mt-built-cell" key={it.title}>
          <div className="mt-built-kind">{it.kind}</div>
          <div className="mt-built-t">{window.renderInline(it.title)}</div>
          <div className="mt-built-s">{window.renderInline(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.MTBuilt = MTBuilt;
