// pages/deck/cartapli-mobile.js
// 슬라이드 덱 매니페스트 — Cartapli Mobile.
//
// ⚠️ 사실을 만들지 않는다. pages/cartapli-mobile/data.js 를 참조만 한다.
//
// DX11 과 데이터 모양이 다르다. 페이지는 "사이클"(관측 → 원인 → 해결 → 결과 → 다음)
// 구조라 step 의 problem/did/points 와 필드명이 안 맞는다.
// **뷰를 고치지 않고 매니페스트가 이름만 맞춘다** — 그래야 프로젝트가 늘어도
// SlideDeck 이 한 벌로 남는다.
//   observe(관측) → why      / cause(원인) → did
//   how[label,body] → points / tag(−74.4%) → 크롬 번호칸
//
// 뺀 것 (지면 경쟁에서 밀린 것):
//   summary(단계 비교표) · layerCurve(레이어 곡선) · verify(오라클 검증 표)
//   → 검증 서사는 rigor 카드 한 장이 더 세게 말한다. 표는 면접에서 꺼낸다.
//   cycles[*].results · callout · next → 감소폭은 §01 워터폴이 이미 다 말한다.

(function buildCartapliMobileDeck() {
  const C = window.CM_DATA;

  // 사이클 하나를 step 슬라이드로 옮긴다. viz 키는 프로젝트마다 겹칠 수 있어
  // 컴포넌트 이름을 직접 준다.
  // 라벨만 명사구로 덮는다. 본문은 원문 그대로 — 사이트는 노트 톤이라 서술형 라벨이
  // 맞지만, 슬라이드 라벨은 조사·종결형으로 끝나면 스캔이 끊긴다.
  const relabel = (pair, label) => [label, pair[1]];

  // 사이클 하나를 두 장으로 나눈다 — 그림 장과 코드 장.
  // 한 장에 그림 + 코드 + 요점을 다 넣으면 셋 다 작아진다. 나누면 각 장의 밀도가 오르고,
  // 무엇보다 **설계 설명만 있고 코드가 없는 장**이 사라진다.

  // 그림 장 — 무엇을 봤고(observe) 원인이 무엇이었나(cause), 그리고 그림.
  const cycleViz = (c, vizComponent, pickHow, title) => ({
    layout: 'diagram',
    section: c.no,
    no: c.tag,
    vizComponent,
    title: title || c.title,
    lead: c.cause,
    // 원문은 페이지의 레이어 곡선을 가리킨다. 덱에는 그 그림이 없다.
    // 없는 그림을 가리키는 참조는 담당자가 곧바로 발견한다.

    step: { problem: c.observe.replace(/\s*\(위 곡선\)/, ''), did: c.cause, viz: c.viz, points: [] },
    points: pickHow.map((i) => c.how[i]),
  });

  // 코드 장 — 실제로 무엇을 짰나. 요점 자리에는 그 결과를 둔다.
  const cycleCode = (c, title) => ({
    layout: 'step',
    section: c.no,
    no: c.tag,
    title,
    step: { problem: c.howTitle, did: c.code.intro || c.code.title, code: c.code, points: [] },
    points: c.results,
  });

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cm = {
    proj: 'Cartapli Mobile',
    slides: [
      // ─── 표지 ───
      {
        layout: 'cover',
        section: '메인 · 성능 최적화',
        subtitle: C.meta.subtitle,
        title: C.meta.title,
        hook: C.hook,
        pills: C.meta.pills,
        // hero 이미지는 페이지에 없다 — cover 가 이미지 없이도 서게 되어 있다
      },

      // ─── 성과. 이 프로젝트는 수치가 주장이므로 맨 앞에 온다 ───
      {
        layout: 'stats',
        section: '01 결과',
        title: '성능 개선 결과',
        bigs: C.bigs,
        vizComponent: 'CMWaterfall',
        // data 의 막대 이름(레이어 삭제 · 메시 병합 · Burst 잡 + 네이티브)과
        // 사이클 슬라이드 제목이 서로 달라 대응이 안 잡혔다. 덱 안에서 한 이름으로 맞춘다.
        vizProps: {
          steps: C.waterfall.map((w, i) => Object.assign({}, w,
            { label: ['기준선', '레이어 제거', '렌더러 감축', '프레임 할당 제거'][i] || w.label })),
          unit: 'ms',
        },
        note: C.waterfallNote,
      },

      // ─── 측정 조건. 수치를 앞세웠으면 조건을 바로 대야 한다 ───
      {
        layout: 'list',
        section: '02 측정',
        title: C.context.measure.title,
        // 원문 5문장은 슬라이드에서 텍스트 벽이 된다. 조건을 규정하는 앞 세 문장만 남기고
        // 나머지(스크립트 자동화 · 마커 3종)는 구두로 넘긴다. 문장을 새로 쓰지는 않는다.
        gist: C.context.measure.body.split('. ').slice(0, 3).join('. ') + '.',
        pairs: C.context.measure.metrics.rows,
        pairCols: 1,
        note: '담당 범위 — ' + C.context.roles.mine,
      },

      // ─── 사이클 셋 ───
      Object.assign(cycleViz(C.cycles[0], 'CMBuriedViz', [0, 1, 3], '레이어 제거'),
        { points: [relabel(C.cycles[0].how[0], '위 → 아래 합집합 누적'),
                   C.cycles[0].how[1], C.cycles[0].how[3]] }),
      cycleCode(C.cycles[0], '가시성 판정'),
      // 사이클 2 는 코드 블록이 없다 — 결과를 마무리 줄로 붙여 한 장을 채운다
      Object.assign(cycleViz(C.cycles[1], 'CMRendererViz', [0, 1, 2], '렌더러 감축'), {
        note: C.cycles[1].results[0],
        points: [relabel(C.cycles[1].how[0], '기준 상태 — 폴드당 1회 업로드'),
                 C.cycles[1].how[1], relabel(C.cycles[1].how[2], '쌓임 순서 = 정점 z')],
      }),
      cycleViz(C.cycles[2], 'CMJobViz', [0, 1, 2], '프레임 할당 제거'),
      cycleCode(C.cycles[2], '분할 잡'),

      // ─── 검증 태도. 이 덱에서 가장 희소한 장이다 —
      //     틀린 것을 스스로 찾아 철회한 기록이라 "잰다"는 주장의 증거가 된다 ───
      {
        layout: 'columns',
        section: '03 검증',
        title: '측정 신뢰 — 기각과 재측정',
        gist: C.rigor.gist,
        colCount: 2,   // 카드 4장을 한 줄에 넣으면 본문이 잘린다 — 2x2
        // 기각·철회는 무엇을 버렸나(terra), 재측정은 무엇을 다시 쟀나(wheat)
        // 제목은 명사구로 덮고 본문은 원문 그대로. 수치는 전부 body 에 있는 값이다.
        cols: C.rigor.cards.map((c, i) => ({
          kind: c.badge, tone: /기각|철회/.test(c.badge) ? 'terra' : 'wheat',
          title: ['스파이크 원인 오진 2회',
                  '`Renderer.Sync` 비용의 89.8% — `Debug.Log` 한 줄',
                  '자체 철회 — `Renderer.Sync` −27%',
                  '기각한 지표 2종 — 회차 시간 · Median/Max'][i] || c.title,
          sub: c.body,
        })),
      },

      // ─── 남은 것 ───
      {
        layout: 'list',
        section: '04 남은 것',
        title: '남은 과제 · 한계',
        pairs: C.limits,
        pairCols: 1,
      },
    ],
  };
})();
