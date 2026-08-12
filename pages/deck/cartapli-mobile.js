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
//   summary(단계 비교표) · layerCurve(레이어 곡선) · verify.rows(측정 대조표)
//   → 감소폭은 §01 워터폴이 이미 다 말한다. 표는 면접에서 꺼낸다.
//   cycles[*].results · callout · next → 같은 이유.
// verify.tests(오라클 대조 400/200/16)는 §04 로 되살렸다 — DX11 '검증 범위' 장이
//   "Cartapli Mobile 에서 확보" 라고 주장하는데 정작 근거가 덱에 없었다.

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
  // did 에 code.intro 를 넣지 않는다 — CodeBlock 이 code.title 과 code.intro 를 이미
  // 그리므로 같은 문장이 한 화면에 위아래로 두 번 나온다.
  const cycleCode = (c, title) => ({
    layout: 'step',
    section: c.no,
    no: c.tag,
    title,
    step: { problem: c.howTitle, code: c.code, points: [] },
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

      // ─── 성과와 측정 조건. 원래 두 장이었다 ───
      // "수치를 앞세웠으면 조건을 바로 대야 한다" — 그 '바로' 는 다음 장이 아니라 같은 장이다.
      // 결과 장은 큰 수치 셋 + 막대뿐이었고 조건 장은 지표 셋뿐이라, 둘 다 반 장짜리였다.
      {
        layout: 'stats',
        section: '01 결과',
        title: '성능 개선 결과와 측정 조건',
        bigs: C.bigs,
        vizComponent: 'CMWaterfall',
        // data 의 막대 이름(레이어 삭제 · 메시 병합 · Burst 잡 + 네이티브)과
        // 사이클 슬라이드 제목이 서로 달라 대응이 안 잡혔다. 덱 안에서 한 이름으로 맞춘다.
        vizProps: {
          steps: C.waterfall.map((w, i) => Object.assign({}, w,
            { label: ['기준선', '레이어 제거', '렌더러 감축', '프레임 할당 제거'][i] || w.label })),
          unit: 'ms',
        },
        pairs: C.context.measure.metrics.rows,
        pairCols: 3,
        // note 는 하나만 둔다. 막대 라벨이 감소폭을 이미 다 적고 있어 waterfallNote 가
        // 먼저 버릴 것이고, 조건 장의 담당 범위는 표지 pills 가 대신한다.
        // 남기는 것은 측정 조건 자체 — 수치를 앞세운 장이 반드시 달아야 하는 줄이다.
        note: C.context.measure.body.split('. ').slice(0, 3).join('. ') + '.',
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
        // 카드 넷을 2x2 로 넣으면 산문 700자가 19px 로 눌린다 — 덱에서 코드 없이 가장 빽빽했다.
        // 둘째(로그가 89.8%)와 셋째(그래서 −27% 철회)는 한 사건의 원인과 결과다. 한 칸으로 합치면
        // 3칸이 되어 글자가 제 크기로 돌아오고 실린 사실은 그대로다.
        colCount: 3,
        // 기각·철회는 무엇을 버렸나(terra), 재측정은 무엇을 다시 쟀나(wheat)
        // 제목은 명사구로 덮고 본문은 원문 그대로. 수치는 전부 body 에 있는 값이다.
        cols: [
          { kind: C.rigor.cards[0].badge, tone: 'terra',
            title: '스파이크 원인 오진 2회', sub: C.rigor.cards[0].body },
          { kind: '재측정 · 철회', tone: 'wheat',
            title: '`Debug.Log` 한 줄이 `Renderer.Sync` 의 89.8%',
            sub: C.rigor.cards[1].body + ' ' + C.rigor.cards[2].body },
          { kind: C.rigor.cards[3].badge, tone: 'terra',
            title: '기각한 지표 2종 — 회차 시간 · Median/Max', sub: C.rigor.cards[3].body },
        ],
      },

      // ─── 검증과 남은 것 ───
      // 한계 셋을 pairCols 1 로 두면 큰 글씨 세 줄이 한 장을 삼분해 먹는다.
      // 같은 지면에 verify.tests 를 나란히 세운다 — DX11 '검증 범위' 장이
      // "Cartapli Mobile 에서 구현 간 오라클 대조를 확보" 라고 주장하는데,
      // 정작 CM 절 어디에도 그 근거가 없었다. 400 / 200 / 16 케이스가 그 근거다.
      {
        layout: 'columns',
        section: '04 검증 · 남은 것',
        title: '오라클 대조와 남은 과제',
        colCount: 2,
        cols: [
          { kind: 'VERIFIED', mark: '✓', tone: 'sage', title: C.verify.tests.title,
            pairs: C.verify.tests.rows.map((r) => [r[0], r[1] + ' · ' + r[2]]) },
          { kind: 'REMAINING', mark: '✗', tone: 'terra', title: '남은 과제 · 한계',
            pairs: C.limits },
        ],
        note: C.verify.tests.note,
      },
    ],
  };
})();
