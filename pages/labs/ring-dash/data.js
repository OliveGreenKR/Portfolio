// pages/labs/ring-dash/data.js
// LAB · 02 — Ring Dash. 6일 / 34 커밋 PoC. 한 메커닉 → 3 디자인 테스트 → 채택안.
// Source: uploads/ring-dash.md. Schema 는 UE5 Action 과 동일. classDef 는 5 swatch (sage / terra / wheat / dusty / plum) 만.

window.RING_DASH_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    eyebrow: 'LAB · 02 ─ PoC / 디자인 분기',
    code: 'LAB · 02',
    title: 'Ring Dash — 한 메커닉 → 3 디자인 테스트',
    oneLine: '원형 링 안에서 dash · 반사 · 휩쓸기 한 메커닉을 두고 어떤 경험이 핵심인가 를 3 디자인 테스트로 직접 굴려본 6일 PoC.',
    period: '2026.05.07 – 2026.05.12',
    weeks: '6 일 · 34 커밋',
    team: '1 인 PoC',
    role: '디자인 + 클라이언트 (전 영역 본인)',
    platform: 'Unity 6.3 LTS (2D) · URP 2D',
    stack: ['Unity 6.3 LTS', 'URP 2D', 'Static Event Bus', 'Modifier Stack', 'Physics2D CircleCast', 'LineRenderer'],
  },

  // 4 hero metrics — PoC 임팩트
  heroMetrics: [
    { n: '6 일',  label: '34 커밋 PoC',           sub: 'baseline + 3 variant + 1 강화안' },
    { n: '4',     label: '디자인 테스트',          sub: 'Defense · Turn-Based · 분절 · CursorBlade' },
    { n: '2 → 1', label: '경험 후보 → 채택',       sub: '시각적 쾌감 ⭐ · 경로 고민 ✗' },
    { n: '1',     label: '정적 이벤트 외과적 승격', sub: 'PlayerController → PlayerLifecycleEvents' },
  ],

  facts: [
    ['한 줄 정의', '원형 링 + dash + 반사 한 메커닉을 두고 핵심 경험을 4 디자인 테스트로 분기·채택한 6일 PoC'],
    ['기간',     '2026.05.07 – 2026.05.12 (6 일)'],
    ['커밋',     '34'],
    ['팀 구성',   '1 인 개인 PoC'],
    ['본인 역할', '디자인 + 클라이언트 (전 영역 본인)'],
    ['스택',     'Unity 6.3 LTS (2D) · URP 2D · Static Event Bus · Modifier Stack · Physics2D CircleCast · LineRenderer'],
    ['기술 태그', 'Game Design Iteration · Variant Workflow · Static Event Refactor · TurnBased FSM · Modifier Stack Stat'],
    ['산출물',   '게임이 아니라 사고 과정 자체 — 4 디자인 테스트 + Variant Workflow 정책'],
  ],

  roles: {
    mine:
      '전 영역 본인. 두 경험 후보 (시각적 쾌감 vs 경로 고민) 발굴 · 공존 불가 진단 · ' +
      '4 variant 작업 (Defense Survivor · Turn-Based · 분절 · CursorBlade) · ' +
      '채택안 구조 설계 (`OnDashSegment` 정적 이벤트 분절 hook · LineRenderer trajectory preview) · ' +
      'Event Bus 외과적 승격 (`PlayerController` 호스팅 → `PlayerLifecycleEvents` 전용 버스) · ' +
      'Variant 격리 / Baseline 승격 정책 직접 운용.',
    others:
      '1 인 개인 PoC 로 외부 협업 없음. 외부 의존: Unity 6.3 LTS · URP 2D · Physics2D · LineRenderer — 엔진 제공 기능만 사용.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 두 경험 후보 발굴 ──────────────────────────── */
    {
      no: '3.1',
      kind: 'DESIGN',
      title: '한 메커닉 안의 두 경험 후보 — 공존 불가 진단',
      lede: 'dash · 반사 · 휩쓸기는 처음부터 두 경험을 동시에 품고 있었음. 어느 쪽에 베팅할지 가 게임의 결을 가른다.',
      problem:
        '같은 메커닉 안에 시각적 쾌감 과 경로 고민 이라는 두 결의 경험이 동시에 들어 있다. ' +
        '두 경험은 공존이 어렵다 — A 를 키우면 생각 없이 클릭, B 를 키우면 손이 멈추고 계산만. ' +
        '두 결을 둘 다 살리려 어중간하게 절충하면 비교 자체가 불가능 해진다.',
      decision:
        '두 후보를 먼저 명시화 — ' +
        '`후보 A · 시각적 쾌감 (운동/연출)` 키워드: 즉각성 · 반복 가능한 손맛 · 가벼움 · ' +
        '`후보 B · 경로 고민 (계산/전술)` 키워드: 사고 시간 · 신중함 · 퍼즐성. ' +
        '두 후보가 서로 깎아먹는 관계 임을 진단 후, 각 후보를 극단까지 밀어붙이는 variant 3개 를 동시에 굴려 비교.',
      results: [
        '두 후보가 공존 불가 임을 명시화 — 어느 variant 가 어느 쪽을 키우는 시도인지 흐려지지 않음',
        '각 후보를 극단까지 밀어붙임 — 절충이 아닌 그 후보의 끝 까지 가야 비교 가능',
        '메커닉 자체가 게임의 결을 결정하지 않음 — 경험의 정의 가 결정함',
      ],
      stack: ['후보 A — 시각적 쾌감 (즉각성 · 손맛 · 가벼움)', '후보 B — 경로 고민 (사고 · 신중함 · 퍼즐성)', '공존 불가 진단', 'variant 3 동시 운용'],
      tableTitle: '두 경험 후보 — 키워드 / 시간 / 손 / 사고',
      table: {
        headers: ['축', '후보 A · 시각적 쾌감', '후보 B · 경로 고민'],
        rows: [
          ['키워드',     '즉각성 · 손맛 · 가벼움',           '사고 · 신중함 · 퍼즐성'],
          ['시간',      '실시간 · 흐름',                    '잠시 멈춤 · 계산'],
          ['손',        '반복 가능 · 누적',                  '한 번 결정 · 무거움'],
          ['깎이는 축', '쿨다운 · 우선순위 계산',            'dash 즉각성 · 운동성'],
        ],
      },
    },

    /* ─── 3.2 3 디자인 테스트 ───────────────────────────── */
    {
      no: '3.2',
      kind: 'TIMELINE',
      title: '4 디자인 테스트 — Defense · Turn-Based · 분절 · CursorBlade',
      lede: 'B 강화 두 개를 극단 까지 / A 강화 두 갈래 (분절 · CursorBlade). 6일 안에서 baseline 격리 + 변종 비교 + 채택안 확정.',
      problem:
        '두 후보를 모두 극단까지 굴리려면 각 variant 가 서로의 잔재를 끌어안지 않는 것 이 가장 중요하다. ' +
        '또한 어느 variant 에서 발견된 보편적 hook 은 baseline 에 즉시 승격해야 하지만, ' +
        '변종 전용 로직 은 baseline 을 오염시키면 안 된다.',
      decision:
        'Variant 격리 워크플로우 — baseline 불변 + `Variants/{Name}/` 폴더 / asmdef / 씬 격리. ' +
        'Variant 1 · Defense Survivor (B 강화) — 정중앙 성채 + 시간 기반 연속 스폰 + 이동/자폭 적 + ' +
        '5-stat Modifier Stack (AttackPower / MoveSpeed / Frequency / Size / BounceCount) + 발사 쿨다운 게이트 + 레벨업 업그레이드. ' +
        'Variant 2 · Turn-Based (B 강화 극단) — 충돌 순차 해결 `TurnBasedDashSimulator` Planning / Executing FSM + 적 생존 시 그 자리에서 반사 + 플레이어 피격 + Plan 미리보기. ' +
        'Variant 3 · Baseline + 분절 (A 강화) — baseline `PlayerController` 에 `OnDashSegment` 정적 이벤트 (segment 별 발행) + segment 별 trajectory preview + 적 hit 카운트 표시. ' +
        '별도 variant 폴더 없이 baseline 측 외과적 hook 추가 만으로 완성. ' +
        'Variant 4 · CursorBlade (A 강화 발산) — dash 메커닉 자체를 제거 하고 마우스 = 칼날 끝 으로 교체. 마우스 이동 + 마우스 ↔ 플레이어 직선 blade 지속 추적 + 적 사정거리 원(황색) · 픽업(초록 다이아) + HP 표시. 동일 링 baseline 을 공유 하는 채택안과 직교 — 링이 아닌 지속 면 으로 즉각성 시험.',
      results: [
        'Variant 1 — 재미 < 부담 : 적 타입 차이로 어떤 적부터 칠지 고민하는 수가 늘긴 했으나 dash 의 즉각성이 쿨다운 + 우선순위 계산에 가려져 느려짐',
        'Variant 2 — 운동성 사망 : 신중한 사고 는 강해졌으나 한 dash 가 너무 무거워짐. 1턴 = 1결정의 무게가 반복 플레이의 가벼움을 죽임',
        'Variant 3 — ⭐ 채택 : dash 가 한 연속 운동 이 아니라 bounce 마다 punch 가 되면서 시각적으로 리듬 이 생김. 같은 메커닉인데 손맛이 누적 되는 감각',
        'Variant 4 · CursorBlade — 직교 발산 : dash 를 아예 제거하고 마우스 추적 blade 로 교체 — 링의 반사 계산 과 segment 분절 이 사라지고 지속되는 면 이 남음. 채택안과 직교되는 질감 — 이후 독립 PoC 로 분리 가능성',
      ],
      stack: [
        'Variants/{Name}/ 폴더 + asmdef + 씬 격리',
        'Variant 1 — 5-stat Modifier Stack · 쿨다운 게이트',
        'Variant 2 — TurnBasedDashSimulator (Planning/Executing FSM) · Plan 미리보기',
        'Variant 3 — OnDashSegment 정적 이벤트 · LineRenderer segment preview',
        'Variant 4 — CursorBlade · 마우스 추적 blade · 적 사정거리 원 · 픽업 다이아',
      ],
      mermaid: `graph TB
    BASE["베이스 메커닉<br/>(dash · 반사 · 휩쓸기)"]
    BASE --> CAND_A["후보 A<br/>시각적 쾌감"]
    BASE --> CAND_B["후보 B<br/>경로 고민"]

    CAND_B --> V1["Variant 1 — Defense Survivor<br/>(05-07~08)<br/>적 타입 · 쿨다운 · Modifier Stack<br/>→ 고민이 부담으로"]
    CAND_B --> V2["Variant 2 — Turn-Based<br/>(05-09)<br/>1턴 1결정 · Plan/Execute FSM<br/>→ 결정의 무게가 운동성 사망"]
    CAND_A --> V3["Variant 3 — Baseline + 분절<br/>(05-08 hook · 05-12 완성)<br/>OnDashSegment 정적 이벤트<br/>→ ⭐ 채택"]
    CAND_A --> V4["Variant 4 — CursorBlade<br/>(A 강화 발산)<br/>마우스 추적 blade · dash 제거<br/>→ 직교 · 독립 PoC 후보"]

    V3 --> CONCLUSION["채택: 시각적 쾌감 + 리듬감<br/>bounce 마다 punch — 손맛이 누적"]

    classDef base    fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    classDef cand    fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef variant fill:#e6dded,stroke:#b9a3c7,color:#3a2840
    classDef adopt   fill:#e6efdf,stroke:#7ea571,color:#283825
    class BASE base
    class CAND_A,CAND_B cand
    class V1,V2,V4 variant
    class V3,CONCLUSION adopt`,
      fsmTrail: ['baseline', 'V1 · Defense', 'V2 · Turn-Based', 'V3 · 분절', 'V4 · CursorBlade', '⭐ 채택 V3'],
    },

    /* ─── 3.3 채택안 구조 + Event Bus 외과적 승격 ────────── */
    {
      no: '3.3',
      kind: 'ARCHITECTURE',
      title: '채택안 구조 + Event Bus 외과적 승격',
      lede: 'segment 별 `OnDashSegment` 발행 + LineRenderer per-bounce preview. 정적 이벤트를 baseline 으로 외과적 분리.',
      problem:
        '분절 강화 는 dash 의 한 연속 운동 을 bounce 단위 로 쪼개는 결정. ' +
        '하지만 정적 이벤트를 `PlayerController` 클래스에 호스팅하면 ' +
        '다른 publisher (예: TurnBased variant) 가 같은 채널을 발행할 길이 없어진다.',
      decision:
        '분절 hook — Dash 실행 루프에서 segment 마다 `Physics2D.CircleCastAll` → `IDamageable.TakeDamage` 후 ' +
        '`OnDashSegment(index, from, to, hits)` 발행. ' +
        '`DashTrajectoryPreview` 가 Landed 시 마우스 위치 기반 LineRenderer 미리보기 + ' +
        'segment 별 색 / 굵기 / 적 hit 카운트 표시. ' +
        'Event Bus 외과적 승격 — TurnBased variant 가 같은 채널을 발행할 필요가 생기면서, ' +
        '정적 이벤트를 `PlayerController` 클래스 호스팅 → `PlayerLifecycleEvents` 전용 버스 로 외과적 승격. ' +
        'baseline 의 multi-publisher 전제 확정. ' +
        'Variant 격리 vs Baseline 승격 정책 — 변종 작업 중 보편적 hook 은 baseline 즉시 승격, 변종 전용 로직 은 `Variants/{Name}/` 격리.',
      results: [
        'dash 가 한 연속 운동 → bounce 마다 punch 로 시각적 분절',
        'multi-publisher 전제 확정 — TurnBased variant 도 같은 채널 발행 가능',
        'baseline 코드 베이스의 외부 의존 경계 명확 (`PlayerController` → `PlayerLifecycleEvents`)',
        'Variant Workflow 정책이 별도 산출물 — 다음 PoC 에 그대로 재사용 가능',
      ],
      stack: [
        'PlayerController (Landed → Dashing → Land FSM)',
        'PerformDashAttack (Physics2D.CircleCastAll → IDamageable)',
        'OnDashSegment(index, from, to, hits) — 분절 hook',
        'DashTrajectoryPreview (LineRenderer · segment 별 색 / 굵기)',
        'PlayerLifecycleEvents — 외과적 분리된 정적 이벤트 버스',
        'Enemy.OnEnemySpawned/Killed/HealthChanged · GameLifecycleEvents.OnGameOver',
      ],
      ascii: {
        title: '보조 — 채택안 실행 흐름',
        intro: 'Input → Dash 실행 → segment 마다 hit + 분절 이벤트 발행 → Land. 분절 hook 은 baseline 의 외과적 추가.',
        code: `// Input → PlayerController (Landed)
Mouse.leftButton → TryCalculateDashTarget
                 → ComputeWaypoints(반사 N회)
                 → StartDash

// Dash Execution (Dashing)
for each segment:
    PlayerCombat.PerformDashAttack(from, to)
        Physics2D.CircleCastAll → IDamageable.TakeDamage
    OnDashSegment(index, from, to, hits)   // ★ 분절 강화 hook
FixedUpdate: MoveTowards (segment 순차 진행)
Land → AdjustPositionToRingWall + RaisePlayerLanded

// Visualization
DashTrajectoryPreview (LineRenderer)
    - Landed 시 마우스 기반 미리보기
    - segment 별 색 / 굵기 / hit 카운트 표시

// Event Bus — 외과적 분리
PlayerLifecycleEvents (static)              ← baseline 으로 외과적 승격
    OnDashStarted / OnPlayerLanded / IsPlayerDashing
Enemy.OnEnemySpawned / Killed / HealthChanged
GameLifecycleEvents.OnGameOver`,
        result: 'bounce 마다 punch — 같은 메커닉 위에서 손맛이 누적되는 감각.',
      },
    },
  ],

  // ─── Evidence — 정량 결과 (질적 비교 표) ─────────────────
  metrics: {
    title: '결과 — baseline vs 채택안',
    headers: ['지표', 'baseline', '채택안 (Variant 3)'],
    rows: [
      ['dash 인식',          '한 연속 운동',                    'bounce 마다 punch — 리듬 분절'],
      ['segment 이벤트',      '전체 dash 단위',                  'OnDashSegment per-bounce 발행'],
      ['trajectory preview', '없음',                            'LineRenderer · segment 별 색 / 굵기 / hit 카운트'],
      ['정적 이벤트 호스팅',  'PlayerController 클래스',         'PlayerLifecycleEvents 전용 버스 (외과적 승격)'],
      ['multi-publisher',    '단일 publisher 전제',             'baseline 의 전제 확정 — TurnBased variant 도 발행 가능'],
      ['variant 작업',       'baseline 변경 위험',              'Variants/{Name}/ 폴더 + asmdef + 씬 격리'],
      ['사고 사이클 산출물',  '게임 1 개',                       '사고 과정 자체 + Variant Workflow 정책'],
    ],
  },

  // 실 자산 — hero = Turn-Based variant (Plan 미리보기 trajectory) / V1 V2 V4 캡처.
  heroImage: 'ring-dash/assets/hero.png',
  screenshots: [
    { src: 'ring-dash/assets/screen-2-billiard.png',             tag: 'V2 · TURN-BASED',  caption: 'Variant 2 — TurnBasedDashSimulator. Plan 미리보기 (cyan trajectory · 예상 피격 4) · 적 생존 시 반사 · 운동성 사망 사례' },
    { src: 'ring-dash/assets/screen-1-defense.png',              tag: 'V1 · DEFENSE',     caption: 'Variant 1 — Defense Survivor. 정중앙 성채 + 적 타입 · AOE · 5-stat Modifier Stack · 발사 쿨다운 게이트 (HP 70/100)' },
    { src: 'ring-dash/assets/screen-3-cursor-blade-base.png',    tag: 'V4 · CURSOR BLADE', caption: 'Variant 4 — CursorBlade. 마우스 ↔ 플레이어 직선 blade 지속 추적 · 적 사정거리 원(황색) · 픽업(초록 다이아) · HP 70/100. dash 메커닉 제거.' },
    { src: 'ring-dash/assets/screen-4-cursor-blade-floating.png', tag: 'V4 · FLOATING',   caption: 'Variant 4 — CursorBlade. 픽업만 떠있는 탐색 구간 — dash 의 반사 계산이 사라지고 지속되는 blade 면 만 남음.' },
  ],
};
