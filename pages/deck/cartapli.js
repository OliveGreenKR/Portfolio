// pages/deck/cartapli.js
// 슬라이드 덱 매니페스트 — Cartapli: Fold Quest (PC · Steam 출시작).
//
// ⚠️ 사실을 만들지 않는다. pages/cartapli/data.js 를 참조만 한다.
//
// 이 프로젝트는 또 다른 모양이다 — meta 에 pills 가 없고(개별 필드), 요점이
// [라벨, 본문] 쌍이 아니라 문자열이며, 그림 대신 mermaid 다이어그램을 쓴다.
// 뷰는 그대로 두고 매니페스트가 맞춘다:
//   meta 개별 필드 -> pills / problem -> why / decision -> did / results -> points
//
// 뺀 것 (지면 경쟁에서 밀린 것):
//   systems 3.3 생명주기 · 3.5 SO+DB · 3.6 배틀 FSM · 3.7 데미지 분리
//     -> 셋 다 "책임을 나눈다" 는 같은 주장의 변주다. 3.1 이 그 주장의 최강 사례고,
//        3.2(확장성) · 3.4(이벤트 순서)가 서로 다른 각도를 더한다
//   metrics 표 · screenshots · systems[].table -> 표는 면접에서 꺼낸다

(function buildCartapliDeck() {
  const C = window.CARTAPLI_DATA;
  const sys = (no) => C.systems.find((s) => s.no === no);

  const system = (no, pick) => {
    const s = sys(no);
    return {
      layout: 'step',
      section: s.kind,
      no: s.no,
      title: s.title,
      step: { problem: s.problem, did: s.decision, mermaid: s.mermaid, points: [] },
      points: pick ? pick.map((i) => s.results[i]) : s.results,
    };
  };

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cartapli = {
    proj: 'Cartapli: Fold Quest',
    slides: [
      // ─── 표지. meta 에 pills 배열이 없어 개별 필드로 만든다 ───
      {
        layout: 'cover',
        section: 'Main · Shipped',
        subtitle: C.meta.title,
        title: C.meta.oneLine,
        hook: C.roles.mine,
        pills: [
          { kind: 'accent', text: C.meta.period + ' · ' + C.meta.weeks },
          { kind: 'plain', text: C.meta.team },
          { kind: 'plain', text: C.meta.stack.slice(0, 4).join(' · ') },
          { kind: 'accent', text: C.meta.role },
        ],
        links: [{ label: 'Steam', v: C.meta.platform, href: C.meta.steam, tone: 'sage' }],
        hero: { img: C.heroImage, caption: C.meta.title + ' — ' + C.meta.oneLine },
      },

      // ─── 출시 결과. 이 프로젝트는 "끝까지 갔다" 가 주장이다 ───
      {
        layout: 'stats',
        section: '01 출시',
        title: '글로벌 출시하고 운영했다',
        bigs: C.heroMetrics,
        note: '평가는 2026-02 누적, 나머지 셋은 2026-05 둘째주 기준이다.',
      },

      // ─── 역할 경계. 출시작이라 팀 작업이고, 무엇이 내 것인지 먼저 밝힌다 ───
      {
        layout: 'columns',
        section: '02 범위',
        title: '내가 한 것과 팀원이 한 것',
        cols: [
          { kind: 'MINE', tone: 'sage', title: '본인', sub: C.roles.mine },
          { kind: 'TEAM', title: '팀원 · 원 입안자', sub: C.roles.others },
        ],
      },

      // ─── 시스템 셋. 같은 "책임을 나눈다" 주장의 서로 다른 각도 ───
      system('3.1'),          // 배틀씬 3계층 — 직접 참조 0
      system('3.2', [0, 1, 2]), // 스킬 시스템 — 확장성
      system('3.4'),          // Pre / On 2단계 이벤트
    ],
  };
})();
