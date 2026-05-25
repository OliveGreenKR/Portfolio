// pages/labs/multi-leg-creature/data.js
// LAB · 03 — Multi-Leg Creature. 1일 / 15 커밋 PoC. 다리 1개당 1명 협동 다족류의 물리적 성립 검증.
// Source: uploads/multi-leg-creature.md. Schema 는 UE5 Action / Ring Dash 와 동일.
// classDef 는 5 swatch (sage / terra / wheat / dusty / plum) 만 사용.

window.MULTI_LEG_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    eyebrow: 'LAB · 03 ─ PoC / 물리 합벡터',
    code: 'LAB · 03',
    date: '2026.05',
    title: 'Multi-Leg Creature — 협동형 다족류의 힘 합벡터',
    oneLine: '다리 1개당 1명이 조작하는 협동/방해 다족류의 핵심 — 각 다리의 힘이 몸통에 합벡터로 모이는 구조 를 단일 사용자로 먼저 검증한 1일 PoC.',
    period: '2026.05.04 (1 일)',
    weeks: '1 일 · 15 커밋',
    team: '1 인 개인 PoC',
    role: '디자인 + 클라이언트 (전 영역 본인)',
    platform: 'Unity 6.3 LTS (2D) · URP 2D',
    stack: ['Unity 6.3 LTS', 'URP 2D', 'FABRIK IK (2D · in-place solver)', 'Rigidbody2D', 'ScriptableObject', 'EditMode Tests'],
  },

  // 4 hero metrics — PoC 임팩트
  heroMetrics: [
    { n: '1 일',  label: '15 커밋 PoC',          sub: '협동 다족류의 물리적 성립 검증' },
    { n: '25',    label: 'C# 파일 / ~3,000 LoC', sub: 'EditMode 테스트 동반' },
    { n: '5 × 3', label: '관절 FABRIK · 다리 3', sub: 'in-place solver + SafeDir' },
    { n: '3',     label: '핵심 판단',            sub: '분산 구조 · 2-Force · 순수 함수' },
  ],

  facts: [
    ['한 줄 정의', '다리 1개당 1명 조작 협동/방해 다족류 — 5관절 IK 촉수 다리들의 힘 합벡터로 몸통이 움직이는 메커닉 토대'],
    ['기간',     '2026.05.04 (1 일)'],
    ['커밋',     '15'],
    ['팀 구성',   '1 인 개인 PoC'],
    ['본인 역할', '디자인 + 클라이언트 (전 영역 본인)'],
    ['스택',     'Unity 6.3 LTS (2D) · URP 2D · FABRIK IK · Rigidbody2D · ScriptableObject · EditMode Tests'],
    ['기술 태그', 'FABRIK IK · Procedural Animation · Force Composition · Component Architecture · ScriptableObject Tuning'],
    ['산출물',   'C# 25 파일 / ~3,000 LoC · 8 핵심 파라미터 SO · 단독 빌드'],
  ],

  roles: {
    mine:
      '전 영역 본인. 베이스 메커닉 설계 (5관절 촉수 × 3, 키 1/2/3 순차 조작, 마우스 추적 FABRIK, 좌클릭 grip, 우클릭 pull, 최대 길이 자동 당김) · ' +
      '구조 판단 3건 (다리 1개 = MB 1개 분산 · 2-Force 모델 분리 · IK / Force 순수 함수 + EditMode 테스트) · ' +
      'Input → Leg → Body 단방향 흐름 확립 · ' +
      '8 핵심 파라미터 ScriptableObject 인스펙터 실시간 노출 · ' +
      'FABRIK 2D in-place solver + SafeDir 처리.',
    others:
      '1 인 개인 PoC 로 외부 협업 없음. 외부 의존: Unity 6.3 LTS · URP 2D · Rigidbody2D · ScriptableObject · Test Framework (EditMode) — 엔진 / 기본 패키지만 사용.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 단방향 흐름 + 다리별 책임 분리 ─────────────── */
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '단방향 흐름 + 다리 1개 = MB 1개 — 분산 구조',
      lede: 'Input → Leg → Body 단방향. 다리는 자기 ForceVec 만 노출, 몸통은 합산만 한다. 멀티 본편 의 다리 1개 = 플레이어 1명 구조와 결이 같다.',
      problem:
        '다리 3개의 상태 / IK / Force 를 어떻게 관리할지. ' +
        '통합 LegSystem_MB 가 `LegRuntimeState[3]` 배열을 갖는 데이터 지향 이 깔끔하지만, ' +
        '멀티플레이 본편 에서 다리 1개당 플레이어 1명을 붙이는 구조와 어긋난다. ' +
        '또한 Update / FixedUpdate 가 섞인 입력·물리 경로에서 양방향 ad hoc 통신 이 생기면 디버깅이 무너진다.',
      decision:
        '다리 1개 = MB 1개 — `MLC_LegController_MB × 3`. ' +
        'Body 는 `Σ Leg.ForceVec` 만 합산 후 `ClampMagnitude → AddForce` 한 번 호출. ' +
        '단방향 흐름 — Input(Update) 에서 `InputSnapshot` 구조체 1프레임 캐시 생성 → 활성 다리만 소비 → 다리는 자기 ForceVec 만 노출 → Body 가 합산. ' +
        '다리끼리 직접 통신 없음. ' +
        'M2 멀티 확장 — Input 컨트롤러만 다리별로 분리하면 본 PoC 코드 재작성 없이 완성.',
      results: [
        '다리별 `ForceVec` 이 Inspector 에 직접 노출 — 튜닝 직관성↑',
        'Body 는 합산 + AddForce 1회 — FixedUpdate 경합 없음',
        'M2 멀티 확장 시 Leg / Body / IK / Force 코드 재작성 없음 — Input 컨트롤러만 다리별로 갈아끼우면 됨',
        '다리끼리 직접 의존이 없어 다리 N 으로 일반화 도 같은 구조',
      ],
      stack: [
        'MLC_InputController_MB (Update) → InputSnapshot { ActiveLegIndex, MouseWorld, LmbPressedThisFrame, RmbHeld, Time }',
        'MLC_LegController_MB × 3 — FSM (Idle / Reaching / Gripped / Pulling)',
        'MLC_LegTargetResolver_C (SmoothDamp + clamp + grip lock)',
        'MLC_LegVisualRenderer_MB (LineRenderer + widthCurve)',
        'MLC_BodyController_MB (Rigidbody2D Dynamic · FixedUpdate · ΣForceVec → ClampMagnitude → AddForce 1회)',
        'Grip — Transform parenting (정적 + 움직이는 플랫폼 추종)',
      ],
      mermaid: `graph TB
    subgraph INPUT["Input Layer · Update"]
        IC["MLC_InputController_MB"]
        SNAP["InputSnapshot (struct, per-frame)<br/>ActiveLegIndex · MouseWorld<br/>LmbPressedThisFrame · RmbHeld · Time"]
        IC --> SNAP
    end

    subgraph LEG["Per-Leg × 3 · FixedUpdate"]
        LC["MLC_LegController_MB<br/>FSM: Idle / Reaching / Gripped / Pulling"]
        TR["MLC_LegTargetResolver_C<br/>(SmoothDamp + clamp + grip lock)"]
        FK["MLC_FabrikSolver2D · static<br/>in-place solve + SafeDir"]
        FCALC["MLC_LegForceCalculator · static<br/>2-Force 모델"]
        GRIP["Grip — Transform parenting<br/>(플랫폼 추종)"]
        VIS["MLC_LegVisualRenderer_MB<br/>LineRenderer + widthCurve"]
        LC --> TR
        LC --> FK
        LC --> FCALC
        LC --> GRIP
        LC --> VIS
    end

    subgraph BODY["Body · FixedUpdate"]
        BC["MLC_BodyController_MB<br/>(Rigidbody2D Dynamic)"]
        SUM["ΣForceVec → ClampMagnitude<br/>→ AddForce (1회)"]
        BC --> SUM
    end

    WALLS["Walls — attachLayerMask"]

    SNAP -.->|"per-frame snapshot"| LEG
    LEG -.->|"ForceVec 노출"| BODY
    GRIP -.-> WALLS

    classDef input   fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef body    fill:#f6ddd2,stroke:#c97a5f,color:#3a1f15
    classDef leg     fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef wall    fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    class IC,SNAP input
    class BC,SUM body
    class LC,TR,FK,FCALC,GRIP,VIS leg
    class WALLS wall`,
      fsmTrail: ['Idle', 'Reaching', 'Gripped', 'Pulling'],
    },

    /* ─── 3.2 2-Force 모델 — 뉴턴 3법칙 의도적 분리 ─────── */
    {
      no: '3.2',
      kind: 'PHYSICS',
      title: '2-Force 모델 — 뉴턴 3법칙 의도적 분리',
      lede: '다리가 뻗는 힘 → 몸통 반작용 과 부착 후 당기는 힘 → 몸통 작용 을 동일 파라미터로 묶지 않는다. 물리 정합성보다 PoC 튜닝 실험성 우선.',
      problem:
        '뻗는 힘의 반작용 과 당기는 힘 을 동일 파라미터로 묶으면 디자인 의도를 슬라이더 하나로 만들 수 없다. ' +
        '예) "다리는 잘 뻗는데 몸통이 안 끌려옴" 같은 비물리적 의도 가 생기지 않는다. ' +
        '또한 부착 직후 명시적 당김 (`explicit_pull`) 과 최대 길이 도달 시 자동 당김 (`auto_pull`) 도 분리하지 않으면 ' +
        '우클릭 강도 와 최대 길이 자동 보정 의 결이 섞인다.',
      decision:
        '3 축 독립 튜닝 — `reach_reaction_coef` (반작용 전달 비율) ↔ `explicit_pull_force` (좌클릭 grip 후 우클릭) ↔ `auto_pull_force` (최대 길이 자동 당김). ' +
        '계산은 `MLC_LegForceCalculator` static 순수 함수 가 담당 — MB 와 의존성 없음. ' +
        '8 핵심 파라미터 를 단일 `ScriptableObject` 에 모아 인스펙터 실시간 노출. ' +
        'Play 중에도 슬라이더로 디자인 의도 를 즉시 조정.',
      results: [
        '다리는 잘 뻗는데 몸통이 안 끌려옴 같은 디자인 의도 가 슬라이더 1 개 로 만들어짐',
        '명시적 / 자동 당김 분리로 우클릭 무게감 과 최대 길이 보정 의 결을 따로 조정',
        'EditMode 테스트가 Force 계산 단독 으로 mock 입력에서 검증 가능 — MB 의존성 0',
        '8 파라미터 SO 한 장에 모여 튜닝 회기 가 짧음',
      ],
      stack: [
        'reach_reaction_coef — 뻗기 반작용 비율',
        'explicit_pull_force — grip 후 우클릭 당김',
        'auto_pull_force — 최대 길이 도달 자동 당김',
        'MLC_LegForceCalculator (static · 순수)',
        'TuningParams.asset — 8 핵심 파라미터 SO',
        'Inspector 실시간 노출 + Play 중 조정',
      ],
      tableTitle: '뻗기 / 당김 — 3 축의 결',
      table: {
        headers: ['축', '발화 조건', '디자인 의도', '파라미터'],
        rows: [
          ['뻗기 반작용', '활성 다리가 마우스로 reach', '뻗을수록 몸통이 반작용으로 살짝 밀림', '`reach_reaction_coef`'],
          ['명시적 당김', 'grip 상태 + 우클릭 hold',     '신중한 한 번의 당김 — 결정의 무게',         '`explicit_pull_force`'],
          ['자동 당김',   '최대 길이 도달',              '뻗다가 못 견디고 마우스 방향으로 끌려감',     '`auto_pull_force`'],
        ],
      },
    },

    /* ─── 3.3 IK / Force 순수 함수 + EditMode 테스트 ────── */
    {
      no: '3.3',
      kind: 'SYSTEM',
      title: 'IK Solver / Force Calculator — 순수 함수 + EditMode 테스트로 분리',
      lede: 'PoC 의 본질이 튜닝 / 알고리즘 실험 이라면, Play 모드 진입 비용 을 1슬라이스에 갚는다. 이후 13 슬라이스의 불안한 손 차단.',
      problem:
        'IK 와 Force 계산 이 MB 안에 결합되면 ' +
        '매 튜닝 실험마다 씬 로드 → 셋업 → 입력 → 결과 관찰의 반복. ' +
        'FABRIK 회귀 가 5관절 × 다리 3 × edge case 에서 발생하면 ' +
        'Play 가시 검증 만으로는 원인 격리 가 어렵다. ' +
        'PoC 단계에 EditMode 테스트 도입 비용을 나중에 갚을 수 있다고 가정하면 ' +
        '그 나중 이 언제나 안 옴.',
      decision:
        'static 순수 함수 분리 — `MLC_FabrikSolver2D` (in-place solve · SafeDir) / `MLC_LegForceCalculator` (2-Force 모델). ' +
        'MB 의존성 0 · GC alloc 0 · 입력만 받고 출력만 반환. ' +
        'EditMode 테스트 — `MLC_FabrikSolver2D_Tests` 가 5관절 / SafeDir / 최대 길이 edge 를 Play 없이 검증. ' +
        'Force 계산은 mock InputSnapshot + mock 다리 상태 로 단독 검증. ' +
        '도입 비용 1슬라이스 = 이후 13 슬라이스의 불안한 손 차단.',
      results: [
        'IK 정합성 회귀를 Play 없이 검증 — 씬 로드 / 셋업 비용 0',
        'Force 계산 단독 회귀를 mock 입력으로 검증',
        'in-place solve · SafeDir 덕분에 GC alloc 0 — FixedUpdate 60Hz × 다리 3 안전',
        'PoC 에 EditMode 테스트 라는 문화 자산 — 다음 PoC 에 그대로 재사용',
      ],
      stack: [
        'MLC_FabrikSolver2D (static · in-place · SafeDir)',
        'MLC_LegForceCalculator (static · 2-Force)',
        'MLC_FabrikSolver2D_Tests (EditMode)',
        'Force mock — InputSnapshot + 다리 상태 stub',
        'GC alloc 0 · FixedUpdate 60Hz × 3 다리 안전',
      ],
      ascii: {
        title: '보조 — FABRIK 2D in-place solver 의 모양',
        intro: 'static 순수 함수 + ref 출력 + SafeDir 처리. MB 와 의존성이 없어 EditMode 테스트에서 씬 없이 호출 가능.',
        code: `// MLC_FabrikSolver2D.cs (요약)
public static void Solve(
    Vector2[] joints,           // ref, in-place
    float[]    segmentLengths,
    Vector2    rootAnchor,
    Vector2    target,
    int        iterations = 8,
    float      epsilon    = 1e-4f)
{
    // 1) Forward — tip → root, target 부터 길이 보존 후퇴
    joints[N-1] = target;
    for (int i = N - 2; i >= 0; i--)
        joints[i] = MoveAlong(joints[i+1], joints[i], segmentLengths[i]);

    // 2) Backward — root → tip, rootAnchor 부터 길이 보존 전진
    joints[0] = rootAnchor;
    for (int i = 1; i < N; i++)
        joints[i] = MoveAlong(joints[i-1], joints[i], segmentLengths[i-1]);

    // 반복 — tip ↔ target 거리 ≤ epsilon 또는 iterations 소진
}

// SafeDir — 길이 0 이면 fallback 단위벡터
static Vector2 SafeDir(Vector2 from, Vector2 to)
    => (to - from).sqrMagnitude < 1e-8f ? Vector2.right : (to - from).normalized;

// EditMode 테스트 — Play 없이 호출
[Test] public void Solve_5Joints_Reaches_Within_Epsilon() { ... }
[Test] public void Solve_When_Target_Beyond_Reach_Extends_Straight() { ... }
[Test] public void Solve_When_Target_Equals_Root_Uses_SafeDir() { ... }`,
        result: '회귀가 Play 없이 잡힘 — PoC 1슬라이스 비용이 손의 불안 을 끝까지 막음.',
      },
    },
  ],

  // ─── Evidence — 정량 결과 (이전/이후 질적 비교) ─────────
  metrics: {
    title: '결과 — 가상의 통합 / 결합 baseline vs 채택 구조',
    headers: ['지표', '통합 / 결합 baseline (가상)', '채택 구조'],
    rows: [
      ['다리 관리',         '`LegSystem_MB` 가 `LegRuntimeState[3]` 배열 보유', '다리 1개 = `MLC_LegController_MB` 1개 — Inspector 직접 노출'],
      ['입력 → 힘 흐름',     'Update / FixedUpdate 사이 양방향 ad hoc',          'Input → Leg → Body 단방향 + InputSnapshot 프레임 캐시'],
      ['Body Force 적용',    '다리별 산발적 AddForce',                          'ΣForceVec → ClampMagnitude → AddForce 1 회'],
      ['IK / Force 결합',    'MB 안에 결합 — Play 모드 진입 필요',              'static 순수 함수 + EditMode 테스트 — Play 없이 검증'],
      ['뻗기 / 당김',        '단일 파라미터로 묶음',                            '`reach_reaction_coef` · `explicit_pull_force` · `auto_pull_force` 3 축 독립'],
      ['튜닝 회기',          'Play 진입 → 셋업 → 입력 → 관찰 반복',             'Inspector 실시간 + 8 핵심 파라미터 SO 한 장'],
      ['M2 멀티 확장',       '본 PoC 코드 재작성',                              'Input 컨트롤러만 다리별로 분리 — 본 코드 0 줄 수정'],
      ['GC alloc / Frame',  '미상',                                            'in-place solve + ref out — 0'],
    ],
  },

  // 실 자산 — hero 1 장 (튜토리얼 화면 — 다리 1·2·3 전환 + grip/pull 키 가이드)
  heroImage: 'multi-leg-creature/assets/hero.png',
  screenshots: [
    { src: 'multi-leg-creature/assets/hero.png', tag: 'TUTORIAL', caption: '튜토리얼 1 단계 — 5관절 IK 촉수 1 개 reach + grip + pull. 사용 안 한 다리는 PoC 단계에서 AI 가 자동 운용 (M2 멀티에선 다른 플레이어 자리)' },
  ],
};
