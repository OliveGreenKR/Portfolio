// DX11 document deck manifest.
// Facts stay in pages/dx11-engine/data.js. This file selects and relabels only.
//
// 구성 원칙 — **구조 → 흐름 → 세부**를 두 번 반복한다.
// 이 절만 한 파트가 아니라 엔진의 여러 파트를 설명한다. 세부부터 늘어놓으면 심사자가
// 지금 보는 그림이 엔진의 어디인지 모른 채 읽는다. 그래서 층을 고정한다:
//
//   01 엔진   구조(무엇이 무엇을 소유하나) → 흐름(한 프레임의 순서)
//   02 물리   구조(소유물과 네 통로)       → 흐름(한 틱의 순서) → 세부(통로 ① · 충돌)
//   03 렌더   구조와 흐름 한 장            → 세부(드로우 콜 조립)
//
// 절 라벨에 `— 구조 / — 흐름 / — 세부` 를 적는다. 상단 크롬만 봐도 지금이 어느 층인지 보인다.
//
// 12 slides:
// cover → 범위·근거·한계
//       → [엔진 구조] → [엔진 흐름]
//       → [물리 구조] → [물리 흐름] → 흐름 code → 통로① 3계층 → 통로① code → 충돌
//       → [렌더 구조·흐름] → 세부 code
//
// Removed:
// - DXEngineOverviewViz: 엔진 구조 장(정적)과 흐름 장(동적)으로 갈랐다. 셋을 다 두면
//   같은 Claim 조각이 세 장에 흩어진다.
// - DXFoundationViz('코어·인프라의 공통 규칙'): 제목은 규칙을 약속하는데 그림은 네 칸짜리
//   구조도였고, 그 네 칸(4단 트리 · Hash+LRU · Delegate · Arena)이 전부 엔진 구조 장에
//   이미 들어 있었다. 페이지에는 그대로 남는다 — 덱에서만 뺀다.
// - measured performance claims: no reproducible benchmark exists

(function buildDX11Deck() {
  const D = window.DX11_DATA;
  const diagram = (section, title, item, component, extra) => Object.assign({
    layout: 'diagram',
    section,
    title,
    lead: item.body,
    step: { viz: 'custom' },
    vizComponent: component,
  }, extra || {});
  const codeSlide = (section, title, item) => ({
    layout: 'step',
    section,
    title,
    points: item.points,
    step: { code: Object.assign({}, item, { title: item.source }) },
    note: item.result,
  });

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.dx11 = {
    proj: 'DX11 엔진 제작',
    slides: [
      {
        layout: 'cover',
        section: 'Main · Engine',
        subtitle: D.meta.subtitle,
        title: D.meta.title,
        hook: D.hook,
        pills: D.meta.pills,
        links: [
          { label: 'Repo', v: D.repo.label, href: D.repo.href, tone: 'blue' },
          { label: 'Demo', v: D.youtube.label, href: D.youtube.href, tone: 'terra' },
        ],
        hero: D.hero,
      },

      // ─── 결론 먼저 ───────────────────────────────────────────────────
      {
        layout: 'columns',
        section: '00 요약',
        title: '구현 범위와 검증 근거, 적용 한계',
        gist: '소유권과 호출 경로를 코드로 대조하고, 실행 중에는 Debug Draw·ImGui·D3D 바인딩 검사로 상태를 확인했다.',
        // 공용 .sl-cols 는 한 줄짜리 격자를 세로 가운데에 세운다(align-content: center).
        // 세 칸뿐인 이 장에서는 그 규칙이 제목 아래에 빈 띠를 만든다 — 이 장에서만 위로 붙인다.
        cls: 'dx11sum',
        colCount: 3,
        cols: [
          {
            kind: 'SCOPE', tone: 'sage',
            title: '직접 만든 범위',
            pairs: D.overview.facts,
          },
          {
            kind: 'VERIFIED', mark: '✓', tone: 'sage',
            title: '확인 가능한 근거',
            pairs: [
              D.evidence.verified[0],
              D.evidence.verified[1],
            ],
          },
          {
            kind: 'LIMITS', mark: '✗', tone: 'terra',
            title: '적용 범위 · 개선 과제',
            pairs: D.evidence.limits,
          },
        ],
      },

      // ─── 01 엔진 · 구조 → 흐름 ───────────────────────────────────────
      // 요점을 안 붙인다. 그림이 층·클래스·관계를 다 말하고 규모는 캡션이 받는다.
      // 요점 넉 줄을 더하면 1920×1200 에서 세로가 넘친다(실측 127px).
      diagram('01 엔진 — 구조', '엔진 전체 아키텍처와 클래스 소유 관계',
        D.overview.architecture, 'DXArchitectureViz'),

      diagram('01 엔진 — 흐름', '한 프레임이 지나가는 순서',
        D.overview.frame, 'DXFrameFlowViz'),

      // ─── 02 물리 · 구조 → 흐름 → 세부 ────────────────────────────────
      // 리드를 두 줄로 줄인다. 세 줄이면 그림 칸이 그만큼 낮아지고, SVG 가 높이에 맞춰
      // 줄면서 글자가 판독선 아래로 떨어진다(실측 배율 0.825 → 14.9px).
      // 페이지 문장에서 사실을 빼지 않는다 — 남는 절(소유물 목록)은 그림이 대신 말한다.
      diagram('02 물리 — 구조', '물리가 소유한 것과 게임과의 네 통로',
        D.physics.boundary, 'DXBoundaryViz', {
          lead: '게임 객체가 소유하던 시뮬레이션 상태를 `FPhysicsStateArrays`의 속성 배열 23개로 옮기고, 두 영역의 왕복은 네 통로로만 열어 뒀다.',
        }),

      diagram('02 물리 — 흐름', '한 틱이 도는 순서',
        D.physics.tick, 'DXTickViz'),

      codeSlide('02 물리 — 흐름 · CODE', '틱의 여닫는 지점을 만든 두 함수', D.code.tick),

      diagram('02 물리 — 세부 · 통로 ①', '입력 통로를 갱신 빈도로 나눈 3계층',
        D.physics.sync, 'DXSyncTierViz'),

      codeSlide('02 물리 — 세부 · 통로 ① · CODE', '더티 플래그로 거른 계층별 복사', D.code.sync),

      diagram('02 물리 — 세부 · 서브스텝', '서브스텝 안에서 도는 충돌 파이프라인',
        D.physics.collision, 'DXCollisionPipelineViz'),

      // ─── 03 렌더링 · 구조/흐름 → 세부 ────────────────────────────────
      diagram('03 렌더링 — 구조 · 흐름', '렌더링 파이프라인 전체',
        D.systems.render, 'DXRenderPipelineViz'),

      codeSlide('03 렌더링 — 세부 · CODE', 'IRenderData를 드로우 콜로 조립', D.code.renderCache),
    ],
  };
})();
