// pages/landing/data.js
// 랜딩 페이지 콘텐츠. uploads/landing.md + master.md + 각 메인 페이지 data.js 에서 발췌.
// 카드 한 장에 들어가는 사실만 옮긴다 — 본문 시스템 디테일은 상세 페이지가 따로.

window.LANDING_DATA = {
  // 정체성 한 줄 — 임시 카피 (SESSION_MEMORY §7 — 사용자 확정 대기)
  identity: {
    eyebrow: 'Identity ─ Systems / Tools / Sims',
    headline: ['사용은 단순하게,', '구조는 확장에 유연하게.'],
    headlineMarkSecondLine: '확장에 유연하게', // 두 번째 줄의 형광펜 부분
    lede:
      '게임 개발자 1인 · 정철. **시스템 아키텍처 결정 사례**, ' +
      '**장기 프로젝트 + 출시 운영**, **PoC 사고 사이클** — 세 결이 같이 있는 포트폴리오.',
    stats: [
      { n: '09', label: 'projects',       sub: '메인 3 · Labs 6' },
      { n: '02', label: 'Steam 글로벌 출시', sub: 'Cartapli · Wobble' },
      { n: '16w', label: 'solo engine',    sub: 'DX11 · 7 모듈 · 147 파일' },
      { n: '06', label: 'PoC labs',        sub: '1–8 주 단위 실험' },
    ],
  },

  // ─── 메인 그리드 — 카드 3 ─────────────────────────────────
  main: [
    {
      idx: '01',
      code: 'MAIN · 01',
      slug: 'cartapli',
      href: '../pages/cartapli.html',
      title: 'Cartapli: Fold Quest',
      oneLine: '종이를 접어 싸우는 로그라이크. 11개 싱글톤이 동시에 도는 배틀씬을 시스템 간 직접 참조 0 으로.',
      meta: [
        { kind: 'accent', text: '13주 · 4인 · Steam 출시' },
        { kind: 'role',   text: 'PM 30% + 클라이언트 70%' },
      ],
      thumb: '../pages/cartapli/assets/hero.png',
      metrics: [
        { n: '98%',     label: 'Steam 매우 긍정 (155/157)' },
        { n: '26,269',  label: 'lifetime unique users' },
        { n: '0',       label: '시스템 추가 시 기존 코드 변경 (줄)' },
      ],
    },
    {
      idx: '02',
      code: 'MAIN · 02',
      slug: 'wobble-wobble',
      href: '../pages/wobble-wobble.html',
      title: 'Wobble Wobble',
      oneLine: '게임랩 빌드를 5주 안에 Steam 글로벌 출시까지 압축. 다중 워크스트림 · 자동화 인프라 자율 도입.',
      meta: [
        { kind: 'accent', text: '5주 · 5인 · Steam + STOVE' },
        { kind: 'role',   text: 'PM + 개발 + 자동화 엔지니어' },
      ],
      thumb: '../pages/wobble-wobble/assets/hero.png',
      metrics: [
        { n: '84',   label: '사운드 시스템 테스트 (데이터 13 + 런타임 29 + 구조 42)' },
        { n: '14',   label: '자동 번역 언어 (MCP 자율 도입)' },
        { n: '~200', label: '컨택 캠페인 (스트리머 · 미디어 · 큐레이터)' },
      ],
    },
    {
      idx: '03',
      code: 'MAIN · 03',
      slug: 'dx11-engine',
      href: '../pages/dx11-engine.html',
      title: 'DX11 Custom Engine',
      oneLine: 'C++17 + DirectX 11 로 1인 풀스택 게임 엔진을 16주 동안 직접 구현한 학습 프로젝트.',
      meta: [
        { kind: 'accent', text: '16주 · 1인 · Windows / D3D11' },
        { kind: 'role',   text: '엔진 프로그래머 (전 영역)' },
      ],
      thumb: '../pages/dx11-engine/assets/hero.png',
      metrics: [
        { n: '147 / 7', label: '소스 파일 / 모듈 (물리 · 충돌 · 렌더 · 코어 · 메모리 · 리소스 · 입력)' },
        { n: '15 → 60', label: 'fps (좁은 공간 다수 충돌체)' },
        { n: 'O(n²) → O(n log n)', label: '충돌 감지 · 60↔30fps 결정론' },
      ],
    },
  ],

  // ─── Labs 그리드 — 카드 6 ────────────────────────────────
  // 렌더 시점에 date desc 로 정렬됨 (LandingPage.jsx 의 LabsSection). 데이터 순서는 idx (L.01..L.06) 기준 그대로 둔다.
  // date: 정렬 키 (ISO `YYYY-MM-DD`). 기간 있는 경우 종료일. 미상은 빈 문자열 — 가장 뒤로 밀림.
  labs: [
    {
      idx: 'L.01',
      title: 'UE5 Action',
      slug: 'ue5-action',
      href: 'labs/ue5-action.html',
      tag: 'UE5 · C++',
      duration: '8주 · 1인',
      date: '2024-11-30',
      line: 'UE5 + C++ 데이터 기반 스킬 · 콤보 시스템. 디자이너가 코드 없이 분기 편집.',
    },
    {
      idx: 'L.02',
      title: 'Ring Dash',
      slug: 'ring-dash',
      href: 'labs/ring-dash.html',
      tag: 'Design / Variant',
      duration: '6일 · 3 디자인 테스트',
      date: '2026-05-12',
      line: 'dash 메커닉의 핵심 경험을 3안으로 분기 — *변형 워크플로우* 자체가 산출물.',
    },
    {
      idx: 'L.03',
      title: 'Multi-Leg Creature',
      slug: 'multi-leg-creature',
      href: 'labs/multi-leg-creature.html',
      tag: 'IK / Procedural',
      duration: '1일',
      date: '2026-05-04',
      line: '협동 다족류 IK + 다리 사이 힘 합벡터로 자연스러운 보행 생성.',
    },
    {
      idx: 'L.04',
      title: 'BBQ Master',
      slug: 'bbq-master',
      href: 'labs/bbq-master.html',
      tag: 'Voxel Sim',
      duration: '3일',
      date: '2026-05-02',
      line: '32³ 볼류메트릭 시뮬레이션. *내부 상태* 를 외부 시각으로 가시화하는 PoC.',
    },
    {
      idx: 'L.05',
      title: 'Staring Fire',
      slug: 'staring-fire',
      href: 'labs/staring-fire.html',
      tag: 'GPU / Shader',
      duration: '3일',
      date: '2026-04-29',
      line: 'GPU Stable Fluids + Blackbody. *불멍* 인터랙션을 위한 셰이더 PoC.',
    },
    {
      idx: 'L.06',
      title: '1000 Kittens',
      slug: '1000-kittens',
      href: 'labs/1000-kittens.html',
      tag: 'Editor Tool',
      duration: '게임잼',
      date: '2026-04-15', // 게임잼 — UE5 Action(2024-11) 보다 최근 · Staring Fire(2026-04-29) 보다 과거
      line: 'Odin Inspector 로 분기 흐름 시각화 · 검증 도구. 기획자 입력의 누락 즉시 표시.',
    },
  ],

  // ─── Footer
  footer: {
    left: 'JCH · 2026 · last update 2026.05.22',
    right: ['about', 'contact'],
  },
};
