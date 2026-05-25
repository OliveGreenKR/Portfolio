// pages/dx11-engine/data.js
// DX11 Engine — 16주 1인 풀스택 학습 엔진 (C++17 / DirectX 11 / HLSL).
// Source: uploads/dx11-engine.md. Schema mirrors CARTAPLI_DATA / WOBBLE_DATA — see SESSION_MEMORY.md §3.
// Mermaid classDef 는 Notebook 토큰 팔레트 안에서 5 swatch (sage / terra / wheat / dusty / plum) 로만.

window.DX11_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    code: 'MAIN · 03',
    title: 'DX11 Custom Engine',
    oneLine: 'C++17 + DirectX 11 로 1인 풀스택 게임 엔진을 16주 동안 직접 구현한 학습 프로젝트.',
    period: '2025.02 – 2025.06',
    weeks: '16 weeks',
    team: '1 인',
    role: '엔진 프로그래머 (전 영역 본인)',
    platform: 'Windows · C++17 · D3D11',
    stack: ['C++17', 'DirectX 11', 'HLSL', 'STL', 'Visual Studio 2022', 'ImGui', 'DirectXMath (SIMD)'],
    youtube: 'https://youtube.com/playlist?list=PLfrpeRcTLBefJ5Q5JjjfeNhooDylaNgUC',
  },

  // 4 hero metrics — 페이지 임팩트 직결되는 4개 (학습량 · 정량 결과)
  heroMetrics: [
    { n: '16 주',         label: '1인 풀스택 학습 엔진', sub: '주 30시간 이상 투입 · 147 소스 파일' },
    { n: '7',             label: '직접 설계·구현 모듈', sub: '물리 · 충돌 · 렌더링 · 엔진 코어 · 메모리 · 리소스 · 입력' },
    { n: '15 → 60',        label: 'fps (영상 기준)',     sub: '좁은 공간 다수 충돌체 시나리오' },
    { n: '0',             label: '렌더링 동적 할당',     sub: '프레임 단위 ArenaMemoryPool 8MB' },
  ],

  facts: [
    ['한 줄 정의',  'C++17 + DirectX 11 로 1인 풀스택 엔진을 16주 동안 직접 구현한 학습 프로젝트'],
    ['기간',       '2025.02 – 2025.06 (16주)'],
    ['팀 구성',     '1 인 개인 프로젝트'],
    ['본인 역할',   '엔진 프로그래머 (전 영역 본인)'],
    ['스택',       'C++17 · DirectX 11 · HLSL · STL · Visual Studio 2022 · ImGui · DirectXMath(SIMD)'],
    ['규모',       '147 소스 파일 · 7 모듈 · 주 30시간 이상 투입'],
    ['외부 라이브러리', 'DirectX 11 API · DirectXMath(SIMD) · ImGui(디버그 UI) — 그 외 엔진 아키텍처는 본인 직접 설계·구현'],
    ['산출물',     'C++ 소스 코드 · 프리미티브 기반 데모(메시 레이 · 입방체 · 평면)'],
  ],

  roles: {
    mine: '전 영역 본인. 물리 시스템(SoA + 결정론 루프) · 충돌(동적 AABB 트리 + Sequential Impulse + CCD) · 렌더링(상태 큐 + Arena 풀 + D3D 바인딩 캐시 + 셰이더 리플렉션) · 엔진 코어(4단 컴포넌트 + 멀티캐스트 델리게이트 + Transform 전파) · 인프라(4종 메모리 · 리소스 · 입력 · 디버거) 직접 설계·구현.',
    others: '엔진 아키텍처에 외부 코드 차용 없음. 외부 의존: DirectX 11 API · DirectXMath(SIMD 연산) · ImGui(디버그 UI) 만 사용.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 물리 시스템 ──────────────────────────────────── */
    {
      no: '3.1',
      kind: 'PHYSICS',
      title: '물리 시스템 — 데이터 소유권 분리 + SoA + 결정론적 루프',
      lede: '게임 객체에서 물리 데이터 소유권을 떼어내 중앙 SoA 저장소로 이전. 결정론 7-레이어로 60↔30fps 동일 결과.',
      problem: '초기 설계는 `RigidBody` 가 물리 속성(위치·속도·질량) 을 직접 소유하는 AoS 구조. 단일 객체 접근은 자연스럽지만 배치 연산이 불가능 하고 게임 로직과 물리 시뮬레이션이 강하게 결합된다. 또한 오일러 적분은 `dt` 변동에 민감해 fps 가 흔들리면 시뮬레이션 결과가 달라지고 NaN/Inf 진입 위험이 상존한다.',
      decision: '데이터 소유권을 게임 객체에서 떼어내 `PhysicsStateSoA` 중앙 저장소 로 이전. 게임 객체는 `PhysicsID` 핸들로 간접 참조 (`uint32_t index + generation`, `IdToIdx/IdxToId` 이중 매핑). `PhysicsStateSoA` 는 `std::vector<XMVECTOR>` 9개 배열 로 속성별 분리 저장하여 SIMD 4-way 배치 연산 적용. 게임↔물리 통신은 Dirty Flag 3단계 (High/Mid/Low) + Job Queue 비동기 명령. 결정론은 7 레이어 로 방어 — 고정 타임스텝 · 적응적 서브스텝 (`MaxSubSteps=5`) · 잔여 시간 보간 · 속도/각속도 클램핑 · `IsValidForce()` NaN/Inf 차단 · 침투 Slop · 반발 임계값.',
      results: [
        '물리 시뮬레이션이 게임 로직과 독립 동작 — 멀티스레드 확장 가능 구조 확보',
        '동일 타입 데이터 연속 메모리로 캐시 히트율 향상 · SIMD 4-way 배치 가능',
        '60fps ↔ 30fps 동일 결과 · NaN/Inf 진입 원천 방지',
        '배열 재배치/압축 후에도 외부 `PhysicsID` 안정 (`generation` 으로 재사용 슬롯 감지)',
      ],
      stack: ['PhysicsStateSoA (XMVECTOR × 9)', 'PhysicsID (index + generation)', 'IdToIdx / IdxToId 이중 매핑', 'BatchApplyGravity / BatchApplyForces (SIMD)', 'FixedTimeStep 1/60s', 'Dirty Flag (High/Mid/Low)', 'Job Queue'],
      mermaid: `graph LR
    subgraph BEFORE["⛔ Before — AoS · 강결합"]
        RB["RigidBody (각 객체가 속성 직접 소유)<br/>위치 · 속도 · 질량 · …"]
        GO1["GameObject"]
        GO1 -->|직접 소유| RB
    end

    subgraph AFTER["✅ After — SoA · 핸들 간접 참조"]
        GO2["GameObject"]
        PID["PhysicsID<br/>(index + generation, uint32)"]
        MAP["IdToIdx / IdxToId<br/>이중 매핑"]
        SOA["PhysicsStateSoA<br/>std::vector&lt;XMVECTOR&gt; × 9"]
        BATCH["SIMD 4-way 배치 연산<br/>BatchApplyGravity / Forces / Clamp"]
        GO2 -->|핸들| PID
        PID --> MAP --> SOA
        SOA --> BATCH
    end

    BEFORE ==>|데이터 소유권 이전| AFTER

    classDef bad   fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef good  fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef data  fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef link  fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    class RB,GO1 bad
    class GO2,BATCH good
    class SOA,PID data
    class MAP link`,
      fsmTrail: ['Tick 시작', 'AccumulatedTime += dt', '서브스텝 N 회 (≤5)', 'Job Queue 처리', 'SIMD 배치 적분', 'Dirty Flag 동기화', '잔여 시간 보간 → 렌더'],
      tableTitle: '결정론 — 7 방어 레이어',
      table: {
        headers: ['레이어', '메커니즘', '기준값'],
        rows: [
          ['고정 타임스텝',      'Euler 적분 오차 제한',                 '1/60s (16.6ms)'],
          ['적응적 서브스텝',    '필요 횟수 = AccumTime / FixedStep',    'MaxSubSteps = 5 (죽음의 나선 방지)'],
          ['잔여 시간 보간',     'step 사이 그래픽 부드럽게',            '0 ≤ alpha < 1'],
          ['속도 클램핑',        '발산 차단',                            'Max 1000 / 100 (lin/ang)'],
          ['유효성 검증',        'IsValidForce / IsValidTorque',         'NaN · Inf 차단'],
          ['침투 Slop',          '미세 진동 억제',                       '0.001 f'],
          ['반발 임계값',        '저속 충돌 바운스 억제',                '0.02 f'],
        ],
      },
    },

    /* ─── 3.2 충돌 시스템 ─────────────────────────────────── */
    {
      no: '3.2',
      kind: 'PHYSICS',
      title: '충돌 시스템 — 동적 AABB 트리 + Sequential Impulse + CCD',
      lede: '브로드페이즈는 SAH 기반 Fat AABB 트리, 응답은 야코비안 + Warm Starting. 터널링은 Swept AABB 로 봉쇄.',
      problem: 'O(n²) 무차별 충돌 검사로는 다수 객체 시나리오에서 즉시 프레임이 무너진다. 고속 객체는 한 프레임에 충돌체를 건너뛰어 (터널링) 벽을 통과한다. Sequential Impulse 반복도 수렴 속도가 느리면 충돌이 불안정 해 객체가 튀거나 침투 후 폭주한다.',
      decision: '브로드페이즈 — SAH(Surface Area Heuristic) 기반 동적 이진 AABB 트리 + Fat AABB 10% 여유공간 으로 트리 변경 빈도 최소화 (지연 압축). 고속 객체는 CCD (Swept AABB + 이분 탐색), 속도 임계값 `10 m/s` 기반 CCD/DCD 자동 전환. 내로우페이즈/응답 — Sequential Impulse 로 법선 + 접선 마찰 + 비틀림 마찰 3개 제약 분리, Warm Starting (이전 프레임 누적 충격량을 초기값 재사용) 으로 1–2 회 반복만으로 수렴. Baumgarte 위치 보정 + 이벤트 상태 추적 (Enter/Stay/Exit).',
      results: [
        '충돌 감지 복잡도 O(n²) → O(n log n)',
        '터널링 안전 속도 5 m/s → 25 m/s (CCD 도입)',
        '영상 기준 좁은 공간 다수 충돌체 시 15 → 60 fps',
        '객체가 벽을 뚫거나 튕기지 않는 안정 응답 (Warm Starting + Baumgarte)',
        '`FDynamicAABBTree` 자료구조 단위 테스트 — 모듈/시스템은 테스트 씬 직접 플레이로 검증',
      ],
      stack: ['FDynamicAABBTree (SAH · Fat AABB 10%)', 'FCollisionDetector (SAT / 거리)', 'FCollisionResponseCalculator (Sequential Impulse)', 'FVelocityConstraint (Warm Starting)', 'FCollisionPositionCorrectionCalculator (Baumgarte)', 'FCollisionEventCalculator (Enter/Stay/Exit)', 'CCD: Swept AABB + 이분 탐색'],
      mermaid: `graph TB
    subgraph BROAD["🌐 브로드페이즈 — O(n log n)"]
        T["FDynamicAABBTree<br/>SAH · Fat AABB 10%"]
        VEL{"속도 ≥ 10 m/s ?"}
        DCD["DCD<br/>(Discrete)"]
        CCD["CCD<br/>Swept AABB + 이분탐색"]
        T --> VEL
        VEL -->|아니오| DCD
        VEL -->|예| CCD
    end

    subgraph NARROW["🎯 내로우페이즈 — Manifold 생성"]
        DET["FCollisionDetector<br/>(SAT / 거리)"]
        MAN["ContactManifold<br/>법선 · 접점 · 침투깊이"]
        DET --> MAN
    end

    subgraph RESP["⚡ 응답 — Sequential Impulse"]
        VC["FVelocityConstraint<br/>(법선 · 접선마찰 · 비틀림마찰)"]
        WS["Warm Starting<br/>(이전 Lambda 재사용)"]
        BAU["Baumgarte 위치 보정<br/>(침투 깊이 비례 바이어스)"]
        EVT["FCollisionEventCalculator<br/>Enter / Stay / Exit"]
        VC --> WS --> BAU --> EVT
    end

    BROAD ==>|페어 후보| NARROW
    NARROW ==>|충돌 데이터| RESP

    classDef broad fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef narrow fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef resp  fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef gate  fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    class T,DCD,CCD broad
    class DET,MAN narrow
    class VC,WS,BAU,EVT resp
    class VEL gate`,
      ascii: {
        title: '보조 — Warm Starting 수렴 비교',
        intro: '동일 충돌 시나리오에서 Warm Start 유무에 따른 Sequential Impulse 반복 수렴.',
        code: `// Cold Start (기존)
iter 1: residual = 1.000
iter 2: residual = 0.420
iter 3: residual = 0.180
iter 4: residual = 0.077  ← 수렴

// Warm Start (도입)
iter 1: residual = 0.180   // 이전 프레임 Lambda 재사용
iter 2: residual = 0.022   ← 수렴`,
        result: '반복 4 → 2 회. 동일 안정도에서 응답 계산 비용 감소.',
      },
    },

    /* ─── 3.3 렌더링 파이프라인 ─────────────────────────── */
    {
      no: '3.3',
      kind: 'ARCHITECTURE',
      title: '렌더링 파이프라인 — 상태 큐 + Arena 풀 + 바인딩 캐시 + 셰이더 리플렉션',
      lede: '렌더 명령을 상태로 분류·정렬한 뒤 일괄 제출. 동적 할당 0, 중복 D3D11 호출 0, HLSL/C++ 불일치 0.',
      problem: '(1) 매 객체마다 셰이더/래스터라이저/블렌드 상태를 바꿔 `Set` 하면 GPU 파이프라인 플러시 가 발생. (2) 프레임마다 `new`/`delete` 가 있으면 GC 가 없는 C++ 에서도 힙 단편화 와 캐시 미스가 누적. (3) 같은 셰이더/같은 SRV 를 매 호출마다 다시 바인딩하면 D3D11 API 호출이 불필요하게 누적. (4) HLSL 입력 시맨틱이나 cbuffer 가 바뀔 때마다 C++ `D3D11_INPUT_ELEMENT_DESC` 와 cbuffer 구조체를 수작업으로 동기화* 하면 HLSL/C++ 불일치 버그가 자주 난다.',
      decision: '(1) 상태 기반 렌더 큐 — `SubmitRenderJob()` 시 상태(Solid/Wireframe) 로 자동 분류, 정렬 후 일괄 렌더링. (2) `FArenaMemoryPool` 8MB — 프레임 단위 O(1) 선형 할당 → `Reset()` 일괄 해제. (3) `FRenderContext` 바인딩 캐시 — `CurrentVB/IB · VS/PS · InputLayout · SRVs[16]` 캐시 후 `Bind` 메서드에서 동일 시 `Set` 호출 건너뛰기. (4) 셰이더 리플렉션 자동화 — `D3DReflect()` 로 컴파일된 바이트코드에서 InputLayout · cbuffer · 리소스 바인딩을 자동 추출하여 C++ 측 디스크립터를 생성.',
      results: [
        'GPU 파이프라인 플러시 감소 (상태 일괄 정렬)',
        '렌더링 동적 할당 0 (프레임 단위 Arena Reset)',
        '동일 바인딩 시 D3D11 `Set*` API 호출 건너뜀',
        '셰이더 추가 시 C++ 코드 수정 불필요 — HLSL 만 작성',
        'HLSL/C++ 불일치 버그 원천 차단',
      ],
      stack: ['URenderer (상태 기반 큐)', 'FRenderContext (바인딩 캐시)', 'IRenderState (Solid/Wireframe)', 'FArenaMemoryPool (8MB)', 'D3DShader + D3DReflect()', 'CreateInputLayoutFromReflection()', 'ExtractAndCreateConstantBuffers()'],
      mermaid: `graph LR
    GO["GameObject<br/>SubmitRenderJob()"]
    AP["FArenaMemoryPool 8MB<br/>O(1) 선형 할당"]
    Q["상태 기반 렌더 큐<br/>Solid · Wireframe 분류"]
    SORT["상태별 정렬"]
    RC["FRenderContext 바인딩 캐시<br/>VB/IB · VS/PS · InputLayout · SRV[16]"]
    SH["D3DShader<br/>D3DReflect()"]
    GPU["D3D11 디바이스"]
    RST["FrameEnd → Arena Reset()"]

    GO -->|RenderData 할당| AP
    GO --> Q
    Q --> SORT --> RC
    SH -.->|자동 추출 InputLayout / cbuffer| RC
    RC -->|중복 Set* skip| GPU
    GPU --> RST -.->|0 동적 할당| AP

    classDef alloc fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef queue fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef cache fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef refl  fill:#e6dded,stroke:#b9a3c7,color:#3a2840
    classDef sink  fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    class AP,RST alloc
    class Q,SORT queue
    class RC cache
    class SH refl
    class GO,GPU sink`,
      ascii: {
        title: '보조 — 셰이더 리플렉션 자동화',
        intro: 'HLSL 만 작성, C++ 디스크립터는 컴파일된 바이트코드에서 자동 추출.',
        code: `// HLSL — 작성만 함
struct VSIn  { float3 pos : POSITION; float3 nrm : NORMAL; };
cbuffer FrameCB : register(b0) { float4x4 vp; float t; };
Texture2D    gAlbedo : register(t0);
SamplerState gSamp   : register(s0);

// C++ — 자동 생성
D3DReflect(bytecode, …, &refl);
CreateInputLayoutFromReflection(refl);    // POSITION/NORMAL → D3D11_INPUT_ELEMENT_DESC
ExtractAndCreateConstantBuffers(refl);    // FrameCB → GPU 버퍼 + 오프셋 맵
ExtractResourceBindings(refl);            // gAlbedo(t0) · gSamp(s0)`,
        result: '셰이더 추가/수정 = HLSL 1 파일. C++ 측 변경 0.',
      },
    },

    /* ─── 3.4 엔진 코어 ──────────────────────────────────── */
    {
      no: '3.4',
      kind: 'ARCHITECTURE',
      title: '엔진 코어 — 4단 컴포넌트 + 멀티캐스트 델리게이트 + Transform 전파',
      lede: '팩토리 + `shared_ptr` 로 수명 일관, SFINAE 로 잘못된 타입은 컴파일 단에서 차단. 댕글링 포인터 0.',
      problem: '컴포넌트 시스템에서 직접 생성 (`new` / `make_shared`) 을 허용하면 소유자 설정이 일관되지 않고, 콜백 바인딩 후 바인더가 먼저 소멸 하면 댕글링 포인터로 즉시 크래시. Transform 을 자식이 자체 캐싱하면 부모 변경 시 전파 누락 으로 렌더링과 물리가 어긋난다.',
      decision: '4단 계층 — `UObject → UActorComponent(트리) → USceneComponent(Transform) → UPrimitiveComponent(렌더)`. 팩토리 패턴 — `UGameObject::Create<T>()` 템플릿 + `protected` 생성자 + `ConstructorAccess<T>` 트릭 + `OwnerToken` 으로 직접 생성 금지. `TDelegate<Args...>` + `IBindable` — 소멸 시 등록된 모든 콜백을 자동 실행해 댕글링 포인터 원천 차단. SFINAE 로 `IBindable` 구현 타입만 컴파일 타임에 바인딩 허용. Transform — `LocalTransform` (부모 기준) + `WorldTransform` (캐싱) 분리, `PropagateWorldTransformToChildren()` 재귀 전파 + `bIsUpdatingFromParent` 로 순환 차단.',
      results: [
        '댕글링 포인터 원천 차단 — 소멸 시 자동 언바인딩',
        '잘못된 타입은 컴파일 타임 에 발견 — 런타임 오버헤드 0',
        '렌더링·물리·로직이 일관된 트랜스폼 공유',
        '`UGameObject` 만 소유자 설정 가능 — 접근 경계 명확',
      ],
      stack: ['UObject → UActorComponent → USceneComponent → UPrimitiveComponent', 'UGameObject::Create<T> (팩토리)', 'ConstructorAccess<T> · OwnerToken', 'TDelegate<Args...> (가변 템플릿)', 'IBindable + DeletionCallback', 'FStringHash (FNV-1a 64bit · 중복 바인딩 방지)', 'PropagateWorldTransformToChildren()'],
      mermaid: `graph TB
    UO["UObject"]
    AC["UActorComponent<br/>(트리 · weak_ptr 부모)"]
    SC["USceneComponent<br/>Local + World Transform"]
    PC["UPrimitiveComponent<br/>(렌더 데이터)"]
    GO["UGameObject<br/>Create&lt;T&gt;() 팩토리"]
    OT["OwnerToken<br/>(소유자 설정 경계)"]
    CA["ConstructorAccess&lt;T&gt;<br/>(make_shared 우회)"]

    UO --> AC --> SC --> PC
    GO -.->|"Create<T>()"| CA -.->|"protected ctor"| AC
    GO ==>|"소유자 설정"| OT

    subgraph DEL["델리게이트 · 자동 언바인딩"]
        TD["TDelegate&lt;Args...&gt;<br/>멀티캐스트"]
        IB["IBindable<br/>(소멸 시 DeletionCallback)"]
        SH["FStringHash<br/>중복 바인딩 방지"]
        TD --> IB
        TD --> SH
    end

    AC -.->|"SFINAE: IsBindable<T> 만"| TD

    classDef base   fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    classDef ctor   fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef del    fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef trans  fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class UO,AC base
    class GO,OT,CA ctor
    class TD,IB,SH del
    class SC,PC trans`,
      ascii: {
        title: '보조 — Create<T> 팩토리 + SFINAE',
        intro: '직접 생성 금지 · 잘못된 타입은 컴파일 타임에 차단.',
        code: `// protected 생성자 + ConstructorAccess 트릭
template <typename T, typename... Args>
static std::shared_ptr<T> UGameObject::Create(Args&&... args) {
    static_assert(std::is_base_of_v<UGameObject, T>,
                  "T must derive from UGameObject");          // ← 컴파일 타임
    auto obj = std::make_shared<ConstructorAccess<T>>(
                  std::forward<Args>(args)...);                // protected 우회
    obj->SetOwner(OwnerToken{});                               // 토큰 패턴
    return obj;
}

// 델리게이트 바인딩 — IBindable 구현 타입만
template <typename T,
          typename = std::enable_if_t<IsBindable<T>::value>>
void TDelegate<Args...>::Bind(T* self, MemFn fn) { /* … */ }`,
        result: '잘못된 타입은 런타임이 아니라 빌드 단에서 실패. 오버헤드 0.',
      },
    },

    /* ─── 3.5 인프라 시스템 ──────────────────────────────── */
    {
      no: '3.5',
      kind: 'SYSTEM',
      title: '인프라 시스템 — 메모리 · 리소스 · 입력 · 디버거 · DI',
      lede: '깊이 있는 4대 영역 외, 엔진 운영에 필요한 인프라 5종.',
      problem: '엔진은 본체 시스템만으로 동작하지 않는다. 프레임 단위 와 수명 단위 가 다른 데이터를 같은 할당기로 다루면 단편화가 누적, 문자열 키 를 매 프레임 비교하면 성능이 무너지며, 입력은 컨텍스트 우선순위 가 없으면 UI 와 게임이 같은 키를 동시에 받는다. PIX/RenderDoc 없이는 상수 버퍼 값 한 줄도 못 본다.',
      decision: '메모리 4종 — `FArenaMemoryPool`(프레임 단위) · `TFixedObjectPool<T,N>`(고정 크기, bitset+이중 연결 리스트로 활성 객체만 O(1) 순회) · `TCircularQueue<T>`(FIFO) · `FStringHash`(FNV-1a 64bit). 리소스 — `FResourceHandle` 8 바이트 해시 + `UResourceManager` LRU 캐시 + 5분 미사용 자동 해제, 핸들 기반 간접 참조로 캐시 교체 후에도 유효. 입력 — `UInputManager` 우선순위 컨텍스트 정렬, `KeyToActionMap` 역방향으로 O(1) 액션 조회, 물리 키 ↔ 논리 액션 분리. 디버거 — `FD3DContextDebugger` 가 VS/PS/CB/SRV/Sampler/RTV/DSV 전체 캡처 + `ValidateAllBindings()` + `GetBufferData<T>()` GPU→CPU Hex 덤프. DI — `UPhysicsSystem` 이 3개 인터페이스 (`IPhysicsStateInternal` / `ICollisionShapeInternal` / `IPhysicsEventDispatcher`) 구현, `FCollisionProcessor` 는 인터페이스만 알고 구체 구현 모름 → Mock 주입 가능.',
      results: [
        '프레임당 동적 할당 0 (Arena Reset 일괄 해제)',
        '리소스 캐시 교체 후에도 외부 핸들 유효',
        'UI 입력 우선 — 입력 소비 시 하위 차단',
        'PIX/RenderDoc 없이 상수 버퍼 값 직접 확인 가능 (자체 디버거)',
        '`FCollisionProcessor` 단위 테스트 시 Mock 주입 가능 (DI)',
      ],
      stack: ['FArenaMemoryPool', 'TFixedObjectPool<T,N>', 'TCircularQueue<T>', 'FStringHash (FNV-1a 64bit)', 'FResourceHandle + UResourceManager (LRU)', 'UInputManager + KeyToActionMap', 'FD3DContextDebugger'],
      tableTitle: '메모리 4종 — 수명/할당 방식 기준 분리',
      table: {
        headers: ['패턴', '수명 / 할당', '용도'],
        rows: [
          ['FArenaMemoryPool',         '프레임 단위 · O(1) 선형 · Reset() 일괄 해제', '렌더 데이터 · 임시 버퍼'],
          ['TFixedObjectPool<T, N>',   '고정 크기 · bitset + 이중 연결 리스트',       '풀링 객체 (활성만 O(1) 순회)'],
          ['TCircularQueue<T>',        'FIFO · 고정 크기 링 버퍼',                    '명령 큐 · 이벤트 큐'],
          ['FStringHash',              'FNV-1a 64bit · 8 byte',                       '문자열 키 O(1) 비교 · 자원 핸들'],
        ],
      },
    },

    /* ─── 3.6 전체 모듈 의존성 ─────────────────────────── */
    {
      no: '3.6',
      kind: 'ARCHITECTURE',
      title: '전체 모듈 의존성 — 7 모듈 통합',
      lede: '7개 모듈이 어떻게 묶이는지의 한 장. 노드 30+ / 서브그래프 7개 — `⤢ 확대` 로 풀스크린 권장.',
      problem: '7 모듈 · 147 소스 파일 규모에서는 시스템 간 결합 이 어디서 어떻게 들어가는지가 가장 큰 질문. 어떤 모듈을 빼면 무엇이 무너지는지를 한 장으로 보여야 변경 영향 범위가 산정된다.',
      decision: '모듈을 7개 서브그래프 (Input · Physics · Collision · Rendering · Resource · GameObject · Debug) 로 묶고, 각 모듈 내부의 핵심 클래스만 노출. 모듈 간 의존은 단일 화살표 또는 인터페이스 (점선) 로만 그린다. 싱글톤 · 인터페이스 · 데이터 클래스 세 종류의 노드를 색으로 구분 — sage / terra / wheat.',
      results: [
        '7 모듈 · 30+ 노드를 단일 다이어그램으로 통합',
        '인터페이스(점선) 와 소유 관계(실선) 구분 — 변경 영향 범위 시각화',
        '모듈 외부에 노출되는 진입점이 인터페이스/싱글톤 으로 제한됨이 명확',
      ],
      mermaid: `graph TD
    subgraph 입력["🎮 Input / Delegate"]
        IM["UInputManager<br/>(싱글톤 · 우선순위 컨텍스트)"]
        IC["UInputContext<br/>(액션 매핑 · 키→해시)"]
        TD["TDelegate&lt;Args...&gt;<br/>(가변 템플릿 델리게이트)"]
        IB["IBindable<br/>(수명 안전 바인딩)"]

        IM -->|"우선순위 정렬"| IC
        IC -->|"이벤트 디스패치"| TD
        TD -->|"DeletionCallback"| IB
    end

    subgraph 물리["⚙️ Physics"]
        PS["UPhysicsSystem<br/>(싱글톤 · 고정 타임스텝)"]
        SoA["FPhysicsStateSoA<br/>(SoA 연속 메모리)"]
        JOB["FPhysicsJob<br/>(Arena 풀 할당)"]
        DF["FPhysicsDataDirtyFlags<br/>(High/Mid/Low)"]

        PS -->|"소유"| SoA
        PS -->|"Job 큐"| JOB
        PS -->|"동기화"| DF
    end

    subgraph 충돌["💥 Collision"]
        CP["FCollisionProcessor<br/>(PhysicsID 기반)"]
        AABB["FDynamicAABBTree<br/>(Fat AABB · SAH)"]
        DET["FCollisionDetector<br/>(SAT / 거리)"]
        RESP["FCollisionResponseCalculator<br/>(Sequential Impulse)"]
        EVT["FCollisionEventCalculator<br/>(Enter/Stay/Exit)"]
        POS["FCollisionPositionCorrectionCalculator"]
        VC["FVelocityConstraint<br/>(Warm Starting)"]

        CP -->|"브로드"| AABB
        CP -->|"내로우"| DET
        CP -->|"응답"| RESP
        CP -->|"이벤트"| EVT
        CP -->|"위치 보정"| POS
        RESP -->|"제약"| VC
    end

    subgraph 렌더링["🖥️ Rendering"]
        REN["URenderer<br/>(상태 큐)"]
        RC["FRenderContext<br/>(바인딩 캐시)"]
        RS["IRenderState<br/>(Solid/Wireframe)"]
        AP["FArenaMemoryPool<br/>(8MB 프레임)"]
        SH["D3DShader<br/>(ShaderReflection)"]

        REN -->|"명령"| RC
        REN -->|"상태"| RS
        REN -->|"RenderData"| AP
        RC -->|"셰이더 바인딩"| SH
    end

    subgraph 리소스["📦 Resource"]
        RM["UResourceManager<br/>(싱글톤 · LRU)"]
        RH["FResourceHandle<br/>(불투명 핸들)"]
        SHH["FStringHash<br/>(FNV-1a 64bit)"]

        RM -->|"해시 조회"| RH
        RH -->|"키"| SHH
    end

    subgraph 게임오브젝트["🎯 GameObject / Scene"]
        GO["UGameObject<br/>(Create&lt;T&gt; 팩토리)"]
        ACx["UActorComponent<br/>(트리 · weak_ptr)"]
        SC["USceneComponent<br/>(Transform 전파)"]
        PC["UPrimitiveComponent<br/>(렌더 데이터)"]
        SM["USceneManager<br/>(씬 전환)"]
        TR["FTransform<br/>(Quaternion · 4-Case)"]

        GO -->|"루트"| SC
        ACx -->|"부모/자식"| ACx
        SC -.->|"상속"| ACx
        PC -.->|"상속"| SC
        SM -->|"활성 씬"| GO
        SC -->|"로컬↔월드"| TR
    end

    subgraph 디버그["🔧 UI / Debug"]
        UI["UUIManager<br/>(ImGui)"]
        CM["UConsoleManager<br/>(64KB 링)"]
        DD["UDebugDrawManager"]
        CD["FD3DContextDebugger"]
        FP["UFramePoolManager<br/>(4MB 프레임 풀)"]
    end

    PS -->|"서브시스템"| CP
    PS -.->|"IPhysicsStateInternal"| CP
    CP -.->|"이벤트"| PS
    GO -->|"물리 등록"| PS
    GO -->|"렌더 Submit"| REN
    PC -->|"모델/머티리얼"| RM
    SM -->|"Tick"| GO
    SM -->|"SubmitRender"| REN
    IM -->|"WinMsg"| GO
    TD -->|"충돌 이벤트"| GO
    REN -->|"D3D11 디바이스"| RM
    UI -->|"오버레이"| REN
    DD -->|"디버그 드로우"| REN
    FP -->|"프레임 리셋"| AP

    classDef singleton fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef interface fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef data      fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef extra     fill:#e6dded,stroke:#b9a3c7,color:#3a2840
    classDef misc      fill:#ebe6da,stroke:#807a6e,color:#1f1d1a

    class PS,RM,IM,SM,UI,CM,FP singleton
    class IB,TD,RS interface
    class SoA,DF,TR,SHH,RH data
    class CD,DD,JOB,POS extra
    class AP,SH,RC,REN,CP,AABB,DET,RESP,EVT,VC,GO,ACx,SC,PC misc`,
    },
  ],

  // ─── Evidence — 정량 결과 (비교 표) ──────────────────────
  metrics: {
    title: '결과 메트릭 — 이전 vs 이후',
    headers: ['지표', '이전', '이후'],
    rows: [
      ['충돌 감지 복잡도',         'O(n²)',           'O(n log n) — 동적 AABB 트리'],
      ['터널링 안전 속도',          '5 m/s',           '25 m/s — CCD (Swept AABB) 도입'],
      ['데모 영상 프레임률',         '15 fps',          '60 fps — 좁은 공간 다수 충돌체 (영상 기준)'],
      ['프레임률 독립성',           '60↔30fps 결과 어긋남', '동일 (결정론 7 레이어)'],
      ['렌더링 동적 할당 / 프레임',  '매 객체 할당',     '0 (ArenaMemoryPool 8MB)'],
      ['Sequential Impulse 반복',   '4 회 수렴',        '2 회 수렴 — Warm Starting'],
      ['셰이더 추가 시 C++ 수정',     'InputLayout · cbuffer 수작업 동기화', '0 — D3DReflect() 자동 추출'],
      ['중복 D3D11 Set* 호출',        '매 객체마다',     'skip — FRenderContext 바인딩 캐시'],
    ],
  },

  // 실 자산 — 다수 충돌체 데모 (메인) + 기본 충돌 디버그 (ImGui). 영상은 facts dl 의 YouTube 링크에서.
  heroImage: 'dx11-engine/assets/hero.png',
  screenshots: [
    { src: 'dx11-engine/assets/screen-2-multi.png',     tag: 'DEMO',  caption: '다수 충돌체 시나리오 — ElasticBodies 스폰 · 좌측 ImGui 제어판 · 프레임률 123 fps' },
    { src: 'dx11-engine/assets/screen-1-collision.png', tag: 'DEBUG', caption: '기본 충돌 데모 + ImGui 디버그 UI — Character / Camera · Position · ColliWorldPosition · CompTree' },
  ],
};
