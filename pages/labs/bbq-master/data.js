// pages/labs/bbq-master/data.js
// LAB · 04 — BBQ Master. 3일 / 30 커밋 PoC. 볼류메트릭 고기 굽기 — 외형과 분리된 32³ Internal Field.
// Source: uploads/bbq-master.md. Schema 는 UE5 Action / Ring Dash / Multi-Leg 와 동일.
// classDef 는 5 swatch (sage / terra / wheat / dusty / plum) 만.

window.BBQ_MASTER_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    eyebrow: 'LAB · 04 ─ PoC / 볼류메트릭 시뮬',
    code: 'LAB · 04',
    date: '2026.05',
    title: 'BBQ Master — 볼류메트릭 고기 굽기',
    oneLine: '3D Mesh 외형과 분리된 32³ Internal Field 로 고기 내부 온도·익힘을 누적 시뮬레이션하고, 표면 vertex color + 단면 텍스처로 내부 상태를 외부로 가시화한 3일 PoC.',
    period: '2026.04.30 – 2026.05.02 (3 일)',
    weeks: '3 일 · 30 커밋',
    team: '1 인 개인 PoC',
    role: '디자인 + 클라이언트 (전 영역 본인)',
    platform: 'Unity 6.3 LTS · URP',
    stack: ['Unity 6.3 LTS', 'URP', 'Voxel Field 32³', 'Heat Conduction (6-neighbor)', 'Vertex Color Shader', 'Procedural Mesh', 'Mesh Cutting', 'HLSL', 'ScriptableObject Config', 'Game Phase FSM'],
  },

  // 4 hero metrics
  heroMetrics: [
    { n: '3 일',   label: '30 커밋 PoC',           sub: '볼류메트릭 시뮬 + 메커닉 + 가시화' },
    { n: '32³',    label: 'Internal Field',        sub: '32K voxels · 1D managed array · FixedUpdate' },
    { n: '3-class',label: 'Voxel 분류',            sub: 'Air / Surface / Interior · bake 1 회' },
    { n: '3',      label: '핵심 판단',             sub: '좌표계 분리 · Surface 우선 샘플러 · 상태 vs 해석' },
  ],

  facts: [
    ['한 줄 정의', '3D Mesh 외형과 분리된 32³ Internal Field로 내부 온도·익힘을 누적 시뮬, 표면 색 + 단면 텍스처로 내부 상태를 외부로 가시화'],
    ['기간',     '2026.04.30 – 2026.05.02 (3 일)'],
    ['커밋',     '30'],
    ['팀 구성',   '1 인 개인 PoC'],
    ['본인 역할', '디자인 + 클라이언트 (전 영역 본인)'],
    ['스택',     'Unity 6.3 LTS · URP · Voxel Field · Heat Conduction · Vertex Color Shader · Procedural Mesh · Mesh Cutting · HLSL · SO Config · Phase FSM'],
    ['기술 태그', 'Voxel Field · Heat Conduction · Vertex Color · Mesh Cutting · 4-Layer Architecture · State vs Interpretation'],
    ['산출물',   'C# 36 파일 / ~6,600 LoC + Shader 2 (Vertex Color Only / Multiply) · 단독 빌드'],
  ],

  roles: {
    mine:
      '전 영역 본인. 4-Layer 아키텍처 (Phase / Meat / Heat / Cutting) · ' +
      '32³ Internal Field (POCO · 1D managed · mesh-local invariant) · ' +
      '3-class Voxel bake + Air-aware Surface 우선 샘플러 · ' +
      'Mesh Cutting + Vertex Color Rebuilder + 단면 Texture2D · ' +
      '자동 화력 변동 (Sin + Noise) + 미래 예측 곡선 HUD · ' +
      '3 Phase FSM (Cooking → Resting carryover → Sliced).',
    others:
      '1 인 개인 PoC 로 외부 협업 없음. 외부 의존: ' +
      'Unity 6.3 LTS · URP · Mesh / Material API · ScriptableObject · Test Framework — 엔진 / 기본 패키지만 사용. ' +
      'HLSL 셰이더 2 종 (Vertex Color Only / Multiply) 자체 작성.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 4-Layer 구조 + 단방향 결합 ────────────────── */
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '4-Layer 구조 — 외형 과 내부 상태 의 좌표계 분리',
      lede: 'Phase / Meat / Heat / Cutting 4 레이어. Mesh transform 변화는 시각 에만 영향, 시뮬에는 무영향. Phase → Meat 는 명시 메서드 호출만.',
      problem:
        '회전·이동·뒤집기를 자유롭게 해도 익은 부분의 내부 상태가 유지 되어야 한다. ' +
        '만약 Field 가 world 좌표계 라면 회전 시 voxel 격자와 mesh 가 어긋나며 익힘 분포가 망가진다. ' +
        '또한 Phase Controller 와 Meat 가 이벤트로 양방향 통신 하면 진행 단계 (Cooking → Resting → Sliced) 의 흐름이 불투명해진다.',
      decision:
        'Field 는 mesh-local 좌표계로 1회 bake 후 고정 — transform 변화는 시각에만 영향. ' +
        '`InternalField` 는 POCO 클래스 로 두고 `MeatController` 가 소유. ' +
        'Phase → Meat 는 명시 메서드 호출만 — 이벤트 의존 X. ' +
        '표면 시각화 · 단면 텍스처 · 점수 평가는 모두 `InternalField` 의 Air-aware sampling API 한 종류 를 통과. ' +
        '4 레이어: Phase (FSM · Score) / Meat (Field · Tick · Mesh 갱신) / Heat (열원 · HUD) / Cutting (Mesh 분할 · 단면 텍스처).',
      results: [
        '회전 / 뒤집기 자유 — 익힘 분포가 정확히 따라옴 (mesh-local invariant)',
        'bake 비용 1 회 — 이후 FixedUpdate tick 만',
        'Phase 변경 (목표 등급 / 점수 기준) 이 시뮬 코드 0 줄 수정',
        '향후 `NativeArray<MeatSample>` 전환 비용 최소 — 1D index 유지',
      ],
      stack: [
        'Phase: BBQPhaseController · CookingSubmitController · RestingFlowController · ScoreEvaluator + ResultHUD',
        'Meat: MeatController (FixedUpdate · 시뮬 명시 호출) · InternalField (POCO · 32³ MeatSample[1D])',
        'Meat 시각: MeatMotionController · MeatSurfaceGridMeshBuilder · MeatSurfaceRenderer (vertex color 갱신) · CutPlanePreview',
        'Heat: HeatSourceController (Sin + Noise · Y축 falloff) · HeatHUD (현재 + 5s 예측 곡선)',
        'Cutting: CuttingPhaseController · LocalPlaneMeshCutter · MeatPieceFactory + MeatPiece · VertexColorRebuilder · MeatSectionTextureBuilder',
      ],
      mermaid: `graph TB
    subgraph PHASE["🎬 Phase Layer"]
        PC["BBQPhaseController<br/>(Cooking → Resting → Sliced)"]
        CSC["CookingSubmitController"]
        RFC["RestingFlowController<br/>(carryover · 자르기 → Sliced)"]
        SE["ScoreEvaluator + ResultHUD"]
        PC --> CSC
        PC --> RFC
        PC --> SE
    end

    subgraph MEAT["🥩 Meat Layer (mesh-local invariant)"]
        MC["MeatController<br/>(FixedUpdate · 시뮬 명시 호출)"]
        IF["InternalField (POCO)<br/>32³ MeatSample[1D]"]
        BAKE["bake: VoxelKind 3-class<br/>(Air / Surface / Interior)"]
        TICK["Tick — Heat Absorption +<br/>Conduction 6-neighbor (2-pass) +<br/>Surface ambient loss"]
        SAMPLE["Sampling API<br/>Trilinear (일반) / Surface 우선"]
        MM["MotionController + GridMeshBuilder<br/>+ SurfaceRenderer (vertex color)<br/>+ CutPlanePreview (단면 Tex)"]
        MC --> IF
        IF --> BAKE
        IF --> TICK
        IF --> SAMPLE
        MC --> MM
    end

    subgraph HEAT["🔥 Heat Layer"]
        HSC["HeatSourceController<br/>Sin + Noise · Y축 falloff"]
        HHUD["HeatHUD — 현재 + 5s 예측"]
    end

    subgraph CUT["✂ Cutting Layer (Mesh 분할)"]
        CPC["CuttingPhaseController"]
        LPMC["LocalPlaneMeshCutter (mesh-local)"]
        MPF["MeatPieceFactory + MeatPiece"]
        VCR["VertexColorRebuilder<br/>(분할 직후 양쪽 색 보정)"]
        MST["MeatSectionTextureBuilder<br/>(단면 Texture2D)"]
        CPC --> LPMC
        CPC --> MPF
        CPC --> VCR
        CPC --> MST
    end

    PHASE -.->|"명시 메서드 호출"| MEAT
    HEAT -.->|"열원 → 고기"| MEAT
    PHASE -.-> CUT

    classDef phase fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef meat  fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef heat  fill:#f6ddd2,stroke:#c97a5f,color:#3a1f15
    classDef cut   fill:#e6efdf,stroke:#7ea571,color:#283825
    class PC,CSC,RFC,SE phase
    class MC,IF,BAKE,TICK,SAMPLE,MM meat
    class HSC,HHUD heat
    class CPC,LPMC,MPF,VCR,MST cut`,
      fsmTrail: ['Cooking', 'Resting (carryover)', 'Sliced (결과)'],
    },

    /* ─── 3.2 3-class Voxel + Surface 우선 샘플러 ──────── */
    {
      no: '3.2',
      kind: 'PHYSICS',
      title: '3-class Voxel bake + Surface 우선 샘플러 — 표면 색을 즉시 반응 하게',
      lede: '표면 색은 겉면 가열 에 즉시 반응해야 하는데, 일반 trilinear 는 Interior 의 낮은 MaxT 와 평균돼 늦게 보인다. 샘플링 API 를 2 종류로 분리.',
      problem:
        '표면 vertex color 가 겉면 가열 에 즉시 반응해야 시각적 피드백 이 살아난다. ' +
        '하지만 일반 trilinear 샘플링은 8 corner 중 Interior 의 낮은 MaxT 와 평균화되어 ' +
        '표면 색이 느릿느릿 따라온다. ' +
        '반대로 단면은 깊이 분포 가 자연스럽게 보여야 하므로 trilinear 그 자체 가 필요. ' +
        '또한 mesh 바깥 (Air 8-corner) 케이스를 조용히 무시 하면 시각적 오류가 감춰진다.',
      decision:
        'bake 시 VoxelKind 3-class 분류 — `Air` / `Surface` / `Interior`. ' +
        '`Surface` = `Interior` 후보 중 Chebyshev radius 안에 `Air` 가 1 개 이상 있는 것 (한 번에 분류). ' +
        '샘플링 API 2 종 분리 — ' +
        '`TrySampleMaxTemperatureTrilinear` (일반 · Air-aware) / ' +
        '`TrySampleSurfaceMaxTemperature` (Surface 우선 — Air 와 Interior 의 영향 제거). ' +
        'Air 8-corner 케이스는 **`_outsideFieldColor` (magenta) 로 *오류 가시화*** — 조용히 무시하지 않는다.',
      results: [
        '표면 색이 즉시 반응 — 겉면 가열 직후 vertex color 변화 가시',
        '단면 텍스처는 깊이 분포 가 자연스럽게 보임',
        'mesh 바깥 케이스가 magenta 로 즉시 보임 — 디버그 비용↓',
        'bake 1 회 + 1D index 유지로 NativeArray 전환 비용 최소',
      ],
      stack: [
        'VoxelKind { Air, Surface, Interior }',
        'bake — Chebyshev radius 안 Air 검사',
        'TrySampleMaxTemperatureTrilinear (Air-aware)',
        'TrySampleSurfaceMaxTemperature (Surface 우선)',
        'MeatSurfaceRenderer — Surface 우선 샘플러 호출',
        '_outsideFieldColor = magenta — 오류 가시화',
      ],
      tableTitle: '샘플링 API 의 2 갈래',
      table: {
        headers: ['용도', '샘플러', '대상 voxel', '특성'],
        rows: [
          ['표면 vertex color',  '`TrySampleSurfaceMaxTemperature`', 'Surface 만',          '겉면 가열에 즉시 반응'],
          ['단면 텍스처 (자른 후)', '`TrySampleMaxTemperatureTrilinear`', 'Surface + Interior (Air-aware)', '깊이 분포 자연스럽게'],
          ['점수 평가',          '`TrySampleMaxTemperatureTrilinear`', '전 격자',             '비율 derive (Raw / Rare / … / Burnt)'],
          ['mesh 바깥 (Air 8-corner)', '— ',                            'Air 만',              'magenta 로 오류 가시화'],
        ],
      },
    },

    /* ─── 3.3 상태 vs 해석 분리 ────────────────────────── */
    {
      no: '3.3',
      kind: 'DATA-DRIVEN',
      title: '상태(state) 와 해석(interpretation) 분리 — voxel 에는 시뮬 진리값 만',
      lede: '굽기 등급 · 정규화값 · 점수는 해석. voxel 에 원본 상태 만 저장하고 나머지는 lazy derive. 게임 룰 변경이 시뮬을 안 건드리게.',
      problem:
        '굽기 등급 (Raw / Rare / Medium / WellDone / Burnt) · `Doneness01` · `Burn01` 같은 해석값 을 voxel 에 직접 저장 하면 ' +
        '게임 룰 변경 (목표 등급 / 임계 온도 / 점수 기준) 마다 32³ 격자 갱신 이 필요하고, ' +
        '시뮬 코드와 게임 룰이 한 데이터 모델 에 섞여 의존 방향이 무너진다. ' +
        '목표 굽기 같은 게임 룰 도 `MeatSample` 안에 들어가면 모델 책임 이 불분명해진다.',
      decision:
        '**voxel 에 저장하는 것은 원본 상태 만** — ' +
        '`Temperature` · `MaxTemperature` · `ThermalConductivity` · `Kind` · `VolumeWeight`. ' +
        '등급 · 정규화값 · 점수 · 색 은 해석 이므로 별도 단계 (Score · Renderer) 에서 lazy derive. ' +
        '목표 굽기 는 `MeatSample` 소유 아님 — 게임 룰 영역 (`ScoreEvaluator` 가 보유).',
      results: [
        'voxel 데이터 모델이 시뮬 진리값 으로 깔끔하게 좁혀짐',
        '게임 룰 변경 (목표 등급 / 점수 기준) 이 시뮬 코드 0 줄 수정',
        '`MaxTemperature` 단방향 누적 — 회전 · 이동 · 꺼내기 후에도 익힘 보존 (비가역성)',
        '시각 · 점수 · 단면 텍스처가 같은 진리값 을 다른 해석으로 사용',
      ],
      stack: [
        'MeatSample — Temperature / MaxTemperature / ThermalCond / Kind / VolumeWeight',
        'ScoreEvaluator — 비율 derive (Raw / Rare / … / Burnt)',
        'MeatSurfaceRenderer — Surface MaxT → vertex color',
        'MeatSectionTextureBuilder — trilinear MaxT → 단면 Texture',
        '목표 등급 / 점수 기준 — 게임 룰 영역 (시뮬 모델 외부)',
      ],
    },
  ],

  // ─── Evidence — 이전/이후 질적 비교 ─────────────────────
  metrics: {
    title: '결과 — 가상의 통합 / 결합 baseline vs 채택 구조',
    headers: ['지표', '통합 / 결합 baseline (가상)', '채택 구조'],
    rows: [
      ['Field 좌표계',       'world 좌표계 — 회전 시 격자 어긋남',     'mesh-local — transform 무관 · bake 1 회'],
      ['Phase ↔ Meat',       '양방향 이벤트',                         '명시 메서드 호출만 — 흐름 명료'],
      ['표면 색 반응 속도',   'trilinear 평균 — Interior 가 끌어내림',  'Surface 우선 샘플러 — 즉시 반응'],
      ['mesh 바깥 케이스',   '조용히 무시 → 시각적 오류 잠복',         '`_outsideFieldColor` = magenta — 오류 가시화'],
      ['voxel 데이터 모델',   '등급 / 정규화값 / 점수까지 저장',         '원본 상태 만 — 해석은 lazy derive'],
      ['게임 룰 변경 비용',   '시뮬 코드 + 32³ 격자 갱신',              '시뮬 코드 0 줄 — Score / Renderer 만'],
      ['회전 / 이동 후 익힘', '격자 어긋남 → 분포 망가짐',              '`MaxTemperature` 단방향 누적 — 비가역 보존'],
      ['단면 텍스처',         '별도 정적 텍스처',                       '`VertexColorRebuilder` + Section Texture — 분할 직후 즉시 보정'],
    ],
  },

  // 실 자산 — hero = Doneness Result 화면 (5 등급 % 표시).
  // screen-2-cooking 은 자르기 phase 의 mid-cut 화면 (Cuts 2/3).
  heroImage: 'bbq-master/assets/hero.png',
  screenshots: [
    { src: 'bbq-master/assets/hero.png',            tag: 'RESULT',  caption: 'Doneness Result — 5 등급 비율 / 색 그라데이션 / Restart. Heat 게이지 + Forecast 5s 예측 곡선이 위쪽 HUD 에 상시.' },
    { src: 'bbq-master/assets/screen-2-cooking.png', tag: 'SLICED', caption: 'Sliced phase mid-cut (Cuts 2/3) — Mesh 분할 + `VertexColorRebuilder` 가 분할 직후 양쪽 색을 보정. Finish 로 점수 평가.' },
  ],
};
