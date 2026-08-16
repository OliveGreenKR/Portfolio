// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//
// 2026-08-15 재조립(2차). 페이지 비중이 8:2 로 잡히면서 덱도 같이 뒤집었다.
//   주제 = 주관이던 "성장 체감" 을 계산으로 바꿔 밸런싱을 판단으로 만들었다.
//   02 = 밸런싱(정의 + 곡선), 03 = 도구 화면, 04 = 런타임 한 장, 05 = 남은 것.
//
// ■ 뺀 것
//   §01 범위 표 — 덱 한 장에 넣으면 숫자만 남고 판단이 안 보인다. 05 note 한 줄로 받는다.
//   기하 월드 구조도 — 04 는 요점 목록 + 코드로 충분하다. 그림은 밸런싱 쪽에 쓴다.
//   목적함수 4항 접기 · 정의식 블록 — 03 이 이미 꽉 찼다.
//   bridge 5개 — 다음 절로 넘기는 이음말. 덱에는 이을 대상이 없다.

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 01 표지 ───
      {
        layout: 'cover',
        section: 'Main · In progress',
        subtitle: M.meta.subtitle,
        title: M.meta.title,
        hook: M.hook,
        // ⚠️ 공유 Cover 렌더러가 pills 를 무조건 map 한다 — 없으면 덱 전체가 깨진다.
        pills: [
          { text: '밸런싱 수학 모델', kind: 'accent' },
          { text: '성장 곡선 시뮬' },
          { text: '수치 자동 탐색' },
          { text: '에디터 도구' },
          { text: '배틀 런타임' },
        ],
        hero: { img: M.hero.img, caption: M.hero.caption },
      },

      // ─── 02 정의와 곡선 ───
      // 정의만으로는 곡선이 안 나온다는 것이 이 장의 요점이라 둘을 붙인다.
      {
        layout: 'columns',
        section: '02 밸런싱',
        no: 'a',
        title: '성장 체감을 계산으로',
        gist: M.model.gist,
        colCount: 2,
        cols: [
          { kind: 'DEFINE', mark: '✓', tone: 'sage',
            title: '무엇을 재기로 했나',
            sub: M.model.problem,
            pairs: M.model.formula.lines.concat(
              M.model.minTable.rows.map(r => [r[0], r[1] + ' → ' + r[2]])) },
          { kind: 'CURVE', mark: '✓', tone: 'sage',
            title: '곡선은 구매 정책의 함수다',
            sub: M.sim.loop.note,
            pairs: M.sim.split.rows.map(r => [r[0], r[1]]) },
        ],
        note: M.sim.splitNote,
      },

      // ─── 03 도구 화면 ───
      // 히트맵 색 · 소스/가정 config 분리 · 구간 분석이 한 화면에 다 있다.
      {
        layout: 'diagram',
        section: '02 밸런싱',
        no: 'b',
        title: '절대값이 아니라 노드 간 상대 순위',
        lead: M.sim.gist + ' ' + M.sim.splitNote,
        step: { img: { src: M.sim.shot.img, caption: M.sim.shot.caption } },
        points: M.sim.points,
        note: M.sim.shot.note,
      },

      // ─── 04 런타임 한 장 ───
      // 비중 2. 밸런싱의 근거가 아니라 병렬 작업이라 한 장으로 누른다.
      {
        layout: 'step',
        section: '03 런타임',
        title: '자체 2D 기하 쿼리',
        gist: M.runtime.gist,
        step: {
          problem: M.runtime.whyNote,
          code: M.runtime.code,
          points: [],
        },
        points: M.runtime.points,
      },

      // ─── 05 남은 것 ───
      {
        layout: 'columns',
        section: '04 남은 것',
        title: '남은 것 — 근사인 자리와 안 잰 것',
        gist: M.cost.gist,
        colCount: 3,
        cols: M.cost.groups.map((g, i) => ({
          kind: ['STRUCT', 'MODEL', 'UNMEASURED'][i],
          mark: '✗',
          tone: 'terra',
          title: g.head,
          pairs: g.items,
        })),
        note: '역할 경계 — ' + M.scope.gist.replace(/\*\*/g, ''),
      },
    ],
  };
})();
