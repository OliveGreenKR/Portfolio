// pages/landing/data.js
// 랜딩 페이지 콘텐츠.
//
// ⚠️ 여기에 **사실을 두지 않는다.** 카드에 보이는 제목 · 한 줄 · 수치 · 그림은 전부
//    표지(pages/{slug}/cover.jsx)가 낸다. 예전에는 같은 사실을 여기에도 한 벌 두었는데,
//    카드가 표지를 쓰게 되면서 아무도 안 읽는 사본이 되었다 — 사본은 갈라진다(2026-08 정리).
//    main[] 이 갖는 것은 **순서와 자리**뿐이다: idx · code · date · slug · href.

window.LANDING_DATA = {
  // 정체성 (2026-08-18 개편). 세 층이 각각 다른 일을 한다 —
  //   headline = 무엇을 하는 사람인가 (재미 → 구현 기준 → 구조·데이터)
  //   stance   = 어떤 순서로 일하는가 (「먼저 ↔ 만든 뒤에는」 시간 축 대구)
  //   lede     = 그래서 무엇을 했는가 (과거형, 이력)
  // 이전 판(2026-08-11)의 stance 는 부정형("~하지 않습니다")으로 기준선을 세웠고
  // headline 4행과 맞물려 있었다. 이번 판은 그 맞물림을 버리고
  // headline 이 정체성을, stance 가 공정 순서를 맡는다.
  // 프로젝트 순서는 "핵심 강점이면서 보여줄 게 많은 것" 순 — main[] 이 따로 정한다.
  identity: {
    // 영문 라벨은 문장이 아니라 분류 태그다 — 레일 · 섹션 라벨과 같은 계열이라
    // 여기서만 어휘를 바꾸면 사이트 전체 라벨 체계와 어긋난다. 정체성 서술은 headline 이 한다.
    eyebrow: 'Identity ─ Systems / Tools / Sims',
    // ⚠️ 직함을 headline 에 넣지 않는다 — 덱은 직무별로 조립되는데(deck/engine.js:109)
    //    headline 은 모든 직무 덱이 공유한다. 직함은 lede 가 진다.
    headline: ['재미를 구현의 기준으로 삼고,', '구조와 데이터로 지킵니다.'],
    headlineMarkSecondLine: '구조와 데이터로', // 두 번째 줄의 형광펜 부분
    // ⚠️ 랜딩 글칸은 424px 다(About 은 889px). stance 1행에 '코드를 짜기 전에' 를
    //    되살리면 '먼저' 와 같은 말이 겹치면서 3줄로 넘쳐 2행과의 대구가 깨진다 — 실측.
    stance: [
      '플레이어 경험과 시스템 구조를 먼저 봅니다.',
      '만든 뒤에는 플레이와 숫자로 검증합니다.',
    ],
    lede: '게임 프로그래머 정철. 엔진부터 게임플레이까지 직접 구현하고, 측정하고, 개선했습니다.',
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
    },
    {
      idx: '02',
      code: 'MAIN · 02',
      date: '2026.06',
      slug: 'motelet',
      href: '../pages/motelet.html',
    },
    {
      idx: '03',
      code: 'MAIN · 03',
      date: '2026.07',
      slug: 'edu-gamification',
      href: '../pages/edu-gamification.html',
    },
    {
      idx: '04',
      code: 'MAIN · 04',
      date: '2026.02',
      slug: 'cartapli',
      href: '../pages/cartapli.html',
    },
    {
      idx: '05',
      code: 'MAIN · 05',
      date: '2026.04',
      slug: 'wobble-wobble',
      href: '../pages/wobble-wobble.html',
    },
    {
      idx: '06',
      code: 'MAIN · 06',
      date: '2025.08',
      slug: 'dx11-engine',
      href: '../pages/dx11-engine.html',
      // metrics 는 성과 수치가 아니라 만든 것이다 — 이 프로젝트에는 계측본이 없다.
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
