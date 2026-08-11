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
  const cycle = (c, vizComponent, pickHow) => ({
    layout: 'step',
    section: c.no,
    no: c.tag,
    vizComponent,
    title: c.title,
    step: { problem: c.observe, did: c.cause, viz: c.viz, points: [] },
    points: pickHow.map((i) => c.how[i]),
  });

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cm = {
    proj: 'Cartapli Mobile',
    slides: [
      // ─── 표지 ───
      {
        layout: 'cover',
        section: 'Main · Optimization',
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
        title: '세 사이클로 나눠 재고 줄였다',
        bigs: C.bigs,
        vizComponent: 'CMWaterfall',
        vizProps: { steps: C.waterfall, unit: 'ms' },
        note: C.waterfallNote,
      },

      // ─── 측정 조건. 수치를 앞세웠으면 조건을 바로 대야 한다 ───
      {
        layout: 'list',
        section: '02 측정',
        title: C.context.measure.title,
        gist: C.context.measure.body,
        pairs: C.context.measure.metrics.rows,
        pairCols: 1,
        note: '내 범위 — ' + C.context.roles.mine,
      },

      // ─── 사이클 셋 ───
      cycle(C.cycles[0], 'CMBuriedViz', [0, 3]),
      cycle(C.cycles[1], 'CMRendererViz', [0, 1]),
      cycle(C.cycles[2], 'CMJobViz', [0, 1]),

      // ─── 검증 태도. 이 덱에서 가장 희소한 장이다 —
      //     틀린 것을 스스로 찾아 철회한 기록이라 "잰다"는 주장의 증거가 된다 ───
      {
        layout: 'columns',
        section: '03 검증',
        title: '틀린 것을 스스로 걷어낸 기록',
        gist: C.rigor.gist,
        colCount: 2,   // 카드 4장을 한 줄에 넣으면 본문이 잘린다 — 2x2
        cols: C.rigor.cards.map((c) => ({ kind: c.badge, title: c.title, sub: c.body })),
      },

      // ─── 남은 것 ───
      {
        layout: 'list',
        section: '04 남은 것',
        title: '아직 재지 못한 것',
        pairs: C.limits,
        pairCols: 1,
      },
    ],
  };
})();
