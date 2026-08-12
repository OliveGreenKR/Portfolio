// pages/landing/data.js
// 랜딩 페이지 콘텐츠. uploads/landing.md + master.md + 각 메인 페이지 data.js 에서 발췌.
// 카드 한 장에 들어가는 사실만 옮긴다 — 본문 시스템 디테일은 상세 페이지가 따로.

window.LANDING_DATA = {
  // 정체성 (2026-08-11 확정). 세 층이 각각 다른 일을 한다 —
  //   headline = 어떤 개발자인가 (현재형, 판단 순서)
  //   stance   = 어떤 기준으로 개발하는가 (현재형, 안 하는 것을 적어 기준선을 세운다)
  //   lede     = 그래서 무엇을 했는가 (과거형, 이력)
  // headline 4행은 사고방식 선언이지 프로젝트 배열 규칙이 아니다.
  // 프로젝트 순서는 "핵심 강점이면서 보여줄 게 많은 것" 순 — main[] 이 따로 정한다.
  identity: {
    eyebrow: 'Identity ─ Systems / Tools / Sims',
    headline: ['코드를 짜기 전에 구조를 봅니다.', '만든 뒤에는 숫자를 봅니다.'],
    headlineMarkSecondLine: '숫자를', // 두 번째 줄의 형광펜 부분
    // 2행이 "숫자" 로 끝나 3행(최적화)이 바로 받고, 4행(설계)이 1행(구조)을 회수한다.
    // 순서를 설계→최적화로 바꾸면 이 맞물림이 풀린다. 바꾸지 말 것.
    stance: [
      '왜 느린지 모른 채 최적화하지 않습니다.',
      '왜 필요한지 모른 채 설계하지 않습니다.',
    ],
    lede: '게임 개발자 정철. 엔진부터 게임까지 직접 만들고, 측정하고, 개선했습니다.',
    // ⚠️ 98% 는 Cartapli 것이다. 출시 2종 전체에 붙이지 않는다.
    stats: [
      { n: '137', label: 'DirectX 11 엔진',  sub: '1인 8개월 · C++17 · 커밋 586' },
      { n: '−94.9%', label: '모바일 CPU 개선', sub: '0.643 → 0.033 ms · 드로우콜 298 → 1' },
      { n: '02', label: 'Steam 글로벌 출시',  sub: 'Cartapli 매우 긍정 98% · Wobble Wobble' },
      { n: '05', label: 'PoC labs',          sub: '1일 ~ 8주 · GPU 유체 · 볼류메트릭 · 재사용 시스템' },
    ],
  },

  // ─── 메인 그리드 — 카드 6 (순서: Cartapli Mobile · Motelet · 외주 · Cartapli · Wobble · DX11) ───
  main: [
    {
      idx: '01',
      code: 'MAIN · 01',
      date: '2026.07 – 08',
      slug: 'cartapli-mobile',
      href: '../pages/cartapli-mobile.html',
      title: 'Cartapli Mobile — 종이접기 최적화',
      oneLine: 'PC 출시작의 종이접기 코어를 모바일로 이식하며 네 사이클로 나눠 고치고 단계마다 따로 측정. "DOTS 를 쓰면 빨라진다" 가 아니라 구조로 얼마 · DOTS 로 얼마를 갈라 말한다.',
      meta: [
        { kind: 'accent', text: '진행 중 · 모바일 이식 + 리메이크' },
        { kind: 'role',   text: '구조 · 렌더링 · 성능 전부' },
      ],
      thumb: null,
      metrics: [
        { n: '−94.9%', label: '프레임당 CPU (0.643 → 0.033 ms)' },
        { n: '298 → 1', label: '드로우콜 — 앞/뒤 2메시 병합' },
        { n: '−97.6%', label: '확정 프레임 할당 — 범용 폴리곤 불리언을 걷어냄' },
      ],
    },
    {
      idx: '02',
      code: 'MAIN · 02',
      date: '2026.06',
      slug: 'motelet',
      href: '../pages/motelet.html',
      title: 'Motelet',
      oneLine: '청소 로봇이 먼지 정령을 쓸어담는 인크레멘탈(개발 중). 성장이 잘 느껴지는지는 플레이해서 판단하고, 그 판단이 못 짚는 "어느 구간이 왜 과한가" 를 런타임 공식을 옮겨 적은 계산 모델로 짚었다.',
      meta: [
        { kind: 'accent', text: '개발 중 · 3인 · Steam 예정' },
        { kind: 'role',   text: 'PM + 배틀씬 프로그래머' },
      ],
      thumb: '../pages/motelet/assets/title.png',
      // 성과 수치가 아니라 만든 것 — 이 프로젝트에는 개선 전후를 비교할 계측본이 없다.
      metrics: [
        { n: '모델',   label: '스킬이 바꾸는 스탯을 한 판의 기대 골드로 환원하는 수학 모델' },
        { n: '시뮬',   label: '인크레멘탈 루프를 돌려 판 사이 성장 기울기 곡선 + 구간별 기여 분해' },
        { n: '런타임', label: '물리 엔진 없이 겹침 판정 · 능력 발동 지점 · 화면 점유 기반 스폰 상한' },
      ],
    },
    {
      idx: '03',
      code: 'MAIN · 03',
      date: '2026.07',
      slug: 'edu-gamification',
      href: '../pages/edu-gamification.html',
      title: '교육용 게이미피케이션 (외주)',
      oneLine: '일(日) 단위로 바뀌는 요구사항을 스키마리스 NoSQL · 서버리스로 흡수. 비개발자용 원터치 배포 콘솔과, 우회가 물리적으로 불가능한 단일 인가 게이트까지 직접 구축.',
      meta: [
        { kind: 'accent', text: '외주 · 프리랜서 · 납품 완료' },
        { kind: 'role',   text: '웹 주개발 (+ 게임 초기 설계)' },
      ],
      thumb: null,
      metrics: [
        { n: '3,000',   label: '대상 규모 · 서버리스 자동 확장 (동시 ~50)' },
        { n: '1-click', label: '비개발자 배포 콘솔 (격리 부트스트랩 → Electron)' },
        { n: '3-layer', label: '감사 · 추적 — 앱을 우회한 직접 쓰기까지 포착' },
      ],
    },
    {
      idx: '04',
      code: 'MAIN · 04',
      date: '2026.02',
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
      idx: '05',
      code: 'MAIN · 05',
      date: '2026.04',
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
      idx: '06',
      code: 'MAIN · 06',
      date: '2025.08',
      slug: 'dx11-engine',
      href: '../pages/dx11-engine.html',
      // metrics 는 성과 수치가 아니라 만든 것이다 — 이 프로젝트에는 계측본이 없다.
      // 버린 것: '15 → 60 fps'(영상 기억) · '60↔30fps 결정론'(검증 코드 없음) · '147 파일'(실제 137).
      title: 'DX11 Custom Engine',
      oneLine: 'C++17 + DirectX 11 로 1인 엔진을 직접 구현. 물리 데이터 소유권을 게임 객체에서 떼어내 중앙 배열로 옮겼다.',
      meta: [
        { kind: 'accent', text: '2025.01 – 2025.08 · 1인 · D3D11' },
        { kind: 'role',   text: '엔진 프로그래머 (전 영역)' },
      ],
      thumb: '../pages/dx11-engine/assets/hero.png',
      metrics: [
        { n: '게임 ↔ 물리', label: '통로 넷 — 입력 동기화 · Job 큐 · 결과 · 충돌 이벤트' },
        { n: '슬롯 ID', label: '컴포넌트를 보지 않는 충돌 파이프라인' },
        { n: '137', label: '소스 파일 (헤더 86 · 구현 46 · HLSL 5) · 커밋 586' },
      ],
    },
  ],

  // ─── Labs 그리드 — 카드 5 ────────────────────────────────
  // 렌더 시점에 date desc 로 정렬됨 (LandingPage.jsx 의 LabsSection).
  // idx 는 표시용 라벨 — **보이는 순서와 어긋나지 않게 date desc 순으로 부여한다.**
  //   2026-08-02 재부여: Ring Dash(L.02) · 1000 Kittens(L.06) 제거로 비었던 번호를 닫고
  //   L.01~L.05 로 다시 매겼다. 데이터 배열 순서도 idx 와 같게 맞춰 둔다.
  //   각 페이지의 `meta.eyebrow` · html `<title>` · `data-screen-label` 도 같은 번호다.
  // date: 정렬 키 (ISO `YYYY-MM-DD`). 기간 있는 경우 종료일. 미상은 빈 문자열 — 가장 뒤로 밀림.
  labs: [
    {
      idx: 'L.01',
      title: '리소스 관리 모듈 — Sound / VFX',
      slug: 'sound-system',
      href: 'labs/sound-system.html',
      tag: 'System / Reusable Module',
      duration: '모듈 하나 · 시스템 둘',
      date: '2026-05-20',
      // 페이지 §02·§04 와 어긋나지 않게 유지할 것. "god-class 해체" 는 쓰지 않는다 —
      // 매니저 파일은 오히려 커졌다 (labs/sound-system/data.js 머리 주석 참조).
      line: '리소스를 언제 올리고 내릴지 판단하는 일만 재생 정책에서 떼어 냈고, 같은 경계로 이펙트 리소스 시스템을 하루에 세웠다.',
    },
    {
      idx: 'L.02',
      title: 'Multi-Leg Creature',
      slug: 'multi-leg-creature',
      href: 'labs/multi-leg-creature.html',
      tag: 'IK / Procedural',
      duration: '1일',
      date: '2026-05-04',
      // "보행 생성" 은 쓰지 않는다 — gait 생성기가 없다. 어느 다리를 언제 쓸지는 사람이 정한다.
      line: '다리를 하나씩 골라 붙잡고 당긴다 — 몸통에는 이동 입력이 없고, 다리들이 낸 힘의 합만으로 움직인다.',
    },
    {
      idx: 'L.03',
      title: 'BBQ Master',
      slug: 'bbq-master',
      href: 'labs/bbq-master.html',
      tag: 'Voxel Sim',
      duration: '3일',
      date: '2026-05-02',
      // 페이지 §02·§03 과 같은 말을 쓴다. "가시화" 는 페이지가 안 쓰는 낱말이라 뺐다.
      line: '고기 안쪽 상태를 32³ 격자로 겉모양과 따로 굴리고, 겉면 색과 잘린 단면으로만 보여 준다.',
    },
    {
      idx: 'L.04',
      title: 'Staring Fire',
      slug: 'staring-fire',
      href: 'labs/staring-fire.html',
      tag: 'GPU / Shader',
      duration: '3일',
      date: '2026-04-29',
      // 표준 기법 이름(Stable Fluids · Blackbody)을 앞세우지 않는다 — 페이지가 한 일로 쓴다.
      line: '불을 그리지 않고 굴렸다 — 격자 위에서 온도와 속도를 계산하고, 그 온도를 그대로 빛으로 옮긴다.',
    },
    {
      idx: 'L.05',
      title: 'UE5 Action',
      slug: 'ue5-action',
      href: 'labs/ue5-action.html',
      tag: 'UE5 · C++',
      duration: '8주 · 1인',
      date: '2024-11-30',
      // "디자이너가 코드 없이" 는 쓰지 않는다 — 8주 1인 프로젝트라 디자이너가 없었다.
      line: '스킬이 무엇을 하고 어디로 이어지는지는 데이터에 두고, 코드에는 언제 실행할지만 남겼다.',
    },
  ],

  // ─── Footer
  footer: {
    left: 'JCH · 2026 · last update 2026.05.22',
    right: ['about', 'contact'],
  },
};
