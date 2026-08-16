// DX11 document deck manifest.
// Facts stay in pages/dx11-engine/data.js. This file selects and relabels only.
//
// 12 slides:
// cover → engine overview → physics boundary → sync tiers → sync code
//       → tick → tick code → collision → rendering → render code
//       → core/infra → evidence/limits
//
// Removed:
// - isolated implementation details: the page already compressed them into diagrams
// - measured performance claims: no reproducible benchmark exists

(function buildDX11Deck() {
  const D = window.DX11_DATA;
  const codeTerms = (items) => items.map((item) => '`' + item + '`');
  const diagram = (section, title, item, component, extra) => Object.assign({
    layout: 'diagram',
    section,
    title,
    lead: item.body,
    step: { viz: 'custom' },
    vizComponent: component,
  }, extra || {});
  const codeSlide = (section, item) => ({
    layout: 'step',
    section,
    title: item.title,
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

      {
        layout: 'diagram',
        section: '01 전체 구조',
        title: '엔진 전체 구조',
        lead: D.overview.gist,
        step: { viz: 'custom' },
        vizComponent: 'DXEngineOverviewViz',
        points: D.overview.facts,
      },

      diagram('02 물리', '게임과 물리의 데이터 경계',
        D.physics.boundary, 'DXBoundaryViz'),

      diagram('02 물리', '입력 동기화 3계층',
        D.physics.sync, 'DXSyncTierViz'),

      codeSlide('02 물리 · CODE', D.code.sync),

      diagram('02 물리', '물리 Tick 경계',
        D.physics.tick, 'DXTickViz'),

      codeSlide('02 물리 · CODE', D.code.tick),

      diagram('02 물리', '충돌 파이프라인',
        D.physics.collision, 'DXCollisionPipelineViz'),

      diagram('03 시스템', '렌더링 파이프라인',
        D.systems.render, 'DXRenderPipelineViz'),

      codeSlide('03 시스템 · CODE', D.code.renderCache),

      diagram('03 시스템', '코어 · 인프라의 공통 규칙',
        D.systems.foundation, 'DXFoundationViz', {
          lead: D.systems.gist,
        }),

      {
        layout: 'columns',
        section: '04 검증',
        title: '검증 결과와 적용 범위',
        gist: '소유권과 호출 경로를 코드로 대조하고, 실행 중에는 Debug Draw·ImGui·D3D 바인딩 검사로 상태를 확인했다.',
        colCount: 2,
        cols: [
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
    ],
  };
})();
