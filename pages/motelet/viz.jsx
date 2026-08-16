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
