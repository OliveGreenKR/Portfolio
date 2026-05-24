// pages/labs/staring-fire/data.js
// LAB · 05 — Staring Fire. 3일 / 29 커밋 PoC. GPU Stable Fluids + Blackbody Radiation 으로 *반응하는 불* 을 *불멍* 경험으로.
// Source: uploads/staring-fire.md. Schema 는 다른 Lab 과 동일.
// classDef 는 5 swatch (sage / terra / wheat / dusty / plum) 만.

window.STARING_FIRE_DATA = {
  meta: {
    eyebrow: 'LAB · 05 ─ PoC / GPU Fluid + 발광',
    code: 'LAB · 05',
    title: 'Staring Fire — 반응하는 불의 불멍 PoC',
    oneLine: '마우스로 불을 피우고 장작을 태우는 *불멍* 경험을 GPU fluid sim + blackbody 발광 + 게임 인터랙션 레이어로 3일에 구현한 PoC.',
    period: '2026.04.27 – 2026.04.29 (3 일)',
    weeks: '3 일 · 29 커밋',
    team: '1 인 개인 PoC',
    role: '디자인 + 클라이언트 (전 영역 본인)',
    platform: 'Unity 6000.3.10f1 (6.3 LTS) · URP 17.3',
    stack: ['Unity 6.3 LTS', 'URP 17.3', 'Compute Shader', 'HLSL', 'Stable Fluids', 'Vorticity Confinement', 'Blackbody Radiation', 'HDR Bloom', 'Unity 2D Physics'],
  },

  // 4 hero metrics
  heroMetrics: [
    { n: '3 일',   label: '29 커밋 PoC',           sub: 'GPU fluid + 발광 + 게임 레이어' },
    { n: '60 Hz',  label: '256² grid · 안정',      sub: 'N 번째 클릭까지 발산 없음 (open boundary)' },
    { n: '~47',    label: 'Dispatch / frame',      sub: '10 unique kernels (Jacobi 40 포함)' },
    { n: '2',      label: '레이어 · 2 채널 통신',  sub: 'Game ↔ Sim — QueueInjection + RT 폴링' },
  ],

  facts: [
    ['한 줄 정의', '*반응하는 불* — 마우스로 불 피우고 장작 태우는 *불멍* 을 GPU fluid sim + blackbody 발광 + 게임 인터랙션 레이어로 구현'],
    ['기간',     '2026.04.27 – 2026.04.29 (3 일)'],
    ['커밋',     '29'],
    ['팀 구성',   '1 인 개인 PoC'],
    ['본인 역할', '디자인 + 클라이언트 (전 영역 본인)'],
    ['스택',     'Unity 6.3 LTS · URP 17.3 · Compute Shader · HLSL · Stable Fluids · Vorticity Confinement · Blackbody · HDR Bloom · Unity 2D Physics'],
    ['기술 태그', 'GPU Fluid Sim · Blackbody Radiation · Vorticity Confinement · Open Boundary · Interface Decoupling · HDR + ACES'],
    ['산출물',   'C# 16 파일 / ~3,300 LoC + Compute 1 + Shader 3 + HLSL 1 · 단독 빌드'],
    ['외부 참고', 'zubetto/BlackBodyRadiation (MIT) · Stam Stable Fluids · Fedkiw Vorticity · Nguyen Combustion · Bridson CFL'],
  ],

  roles: {
    mine:
      '전 영역 본인. **GPU Stable Fluids 파이프라인** (10 kernels · ~47 dispatch/frame · Jacobi 40 압력 투영) · ' +
      '**Vorticity Confinement + 비선형 flame gate** (cold region 노이즈 차단 + flame edge 디테일 보존) · ' +
      '**Blackbody Radiation 발광 모델** (T(K) → linear sRGB radiance, MIT 인용) · ' +
      '**Open Boundary** (천장 outflow + top ambient lerp — closed → open) · ' +
      '**IIgnitable 인터페이스 한 줄 계약** 으로 게임 ↔ 시뮬 결합 차단 · ' +
      '**6 MB 게임 시스템** (Campfire · Log · Igniter · IgniteDetector · LogFireEmitter · FireTemperatureProbe) · ' +
      '**HDR + ACES Tonemap** 합성.',
    others:
      '1 인 개인 PoC 로 외부 협업 없음. ' +
      '외부 자산 / 라이선스 명시 — **zubetto/BlackBodyRadiation** (MIT, `blackbody.hlsl` 인용). ' +
      '학술 자료 — **Stam Stable Fluids · Fedkiw Vorticity · Nguyen Combustion · Bridson CFL**. ' +
      '엔진 의존 — Unity 6.3 LTS · URP 17.3 · Unity 2D Physics · Canvas + TMPro.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 2-Layer 구조 + 2 채널 통신 ─────────────────── */
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '2-Layer 구조 — *시뮬* 과 *게임* 을 *두 채널뿐* 으로 끊다',
      lede: 'GPU Fluid Sim (Layer 1) 과 Game Layer (Layer 2) 를 *2 채널* 로만 묶는다 — *게임→시뮬* `QueueInjection` 단일 write / *시뮬→게임* RT read-only 폴링.',
      problem:
        '*시뮬* 과 *게임* 이 *양방향 직접 참조* 로 묶이면 — ' +
        '한쪽 변경이 *다른 쪽 코드* 까지 파급되고, *가연물 한 종 추가* 시 시뮬 측 코드를 *건드려야* 한다. ' +
        '또한 *시뮬은 GPU 비동기 RT*, *게임은 CPU 동기 MB* — *통신 경로가 모호하면* 동기화 버그가 잠복.',
      decision:
        '**2 채널뿐** — ' +
        '*게임 → 시뮬*: `FireSimulation.QueueInjection(uv, fuel, temp, force)` *단일 write*. ' +
        '*시뮬 → 게임*: RT (Temperature / Velocity) *read-only 폴링*. ' +
        '*양방향 참조 0*. 게임 측 *6 MB* (Campfire / Log / Igniter / IgniteDetector / LogFireEmitter / FireTemperatureProbe) 가 *모두* 이 두 채널만 사용. ' +
        'Sim 측은 *Combustion · Vorticity · Advect · Jacobi 40 압력 투영 · Gradient Subtract* 의 *고정 파이프라인* 만 안다.',
      results: [
        '*가연물 추가* 시 시뮬 코드 *0 줄 수정* — 게임 측 MB 만 추가',
        '*시뮬 파이프라인* 이 *고정* 되어 GPU 최적화에 집중 가능',
        '*RT 폴링* 은 *read-only* — 동기화 버그 잠복 차단',
        '게임 측 *6 MB* 가 *시뮬을 직접 참조하지 않음* — *단위 테스트 가능 구조*',
      ],
      stack: [
        'Game: CampfireMB · LogMB · IgniterMB · IgniteDetectorMB · LogFireEmitterMB · FireTemperatureProbeMB · RoomThermalStateMB',
        'Sim: FireSim.compute (10 kernels · ~47 dispatch/frame · Jacobi 40)',
        'Pipeline: ApplyInjections → AddForces → Combustion → Vorticity → VorticityForce → AdvectVelocity → AdvectScalars → Divergence → Jacobi×40 → GradientSubtract',
        'Render: FireMaterial.shader + blackbody.hlsl · HDR (R16G16B16A16) + URP Bloom + ACES Tonemap',
        '채널 1: QueueInjection (uv, fuel, temp, force) — 단일 write',
        '채널 2: RT Temperature / Velocity — read-only 폴링',
      ],
      mermaid: `graph TB
    subgraph GAME["🎮 Layer 2 — Game (CPU)"]
        CAMP["CampfireMB<br/>(자식 LogMB 집계 · FireStrength)"]
        LOG["LogMB ─implements─ IIgnitable"]
        LFE["LogFireEmitterMB<br/>──QueueInjection──►"]
        IGN["IgniterMB<br/>(주변 IIgnitable → TryIgnite)"]
        IGD["IgniteDetectorMB<br/>(FireSim RT 폴링 → 자기 점화)"]
        ROOM["RoomThermalStateMB<br/>→ IRoomTemperatureSource"]
        HUD["RoomTemperatureHUDMB"]
        CAMP --> LOG --> LFE
        CAMP --> IGN
        CAMP --> IGD
        ROOM --> HUD
    end

    subgraph SIM["⚙ Layer 1 — GPU Fluid Sim"]
        FS["FireSim.compute<br/>10 kernels · ~47 dispatch/frame"]
        PIPE["ApplyInjections → AddForces<br/>→ Combustion → Vorticity<br/>→ VorticityForce → AdvectVelocity<br/>→ AdvectScalars → Divergence<br/>→ Jacobi×40 → GradientSubtract"]
        MAT["FireMaterial + blackbody.hlsl<br/>T(K) → linear sRGB radiance<br/>+ URP Bloom + ACES Tonemap"]
        FS --> PIPE --> MAT
    end

    GAME -.->|"단일 write · QueueInjection(uv, fuel, temp, force)"| SIM
    SIM -.->|"단방향 read · RT (Temperature / Velocity)"| GAME

    classDef game fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef sim  fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef pipe fill:#f6ddd2,stroke:#c97a5f,color:#3a1f15
    class CAMP,LOG,LFE,IGN,IGD,ROOM,HUD game
    class FS sim
    class PIPE,MAT pipe`,
      fsmTrail: ['Inject', 'Force + Combust', 'Vorticity', 'Advect', 'Pressure (Jacobi 40)', 'Gradient Sub', 'Render'],
    },

    /* ─── 3.2 Vorticity Confinement + flame gate ───────── */
    {
      no: '3.2',
      kind: 'PHYSICS',
      title: 'Vorticity Confinement 에 *비선형 flame gate* 를 얹다',
      lede: '표준 Vorticity Confinement (Fedkiw 2001) 는 *cold region 노이즈* 까지 살림. ε 조정만으로는 *flame edge wisp 까지* 죽는다 — *비례 감쇠의 한계*.',
      problem:
        '표준 *Vorticity Confinement* 를 켜면 *flame edge 디테일* 이 살아나지만 ' +
        '*빈 격자 (cold region)* 까지 *작은 노이즈 ω* 가 *증폭* 되며 *그리드 전체* 가 더러워진다. ' +
        '*ε 만 낮추는* 건 *비례 감쇠* — flame edge 의 *wisp 까지 같이 죽는다*. ' +
        '*화염 vorticity 는 공간적으로 편재* 한다 (`Tnorm` 이 *공간적으로 sparse*) 는 특성을 *이용해야* 한다.',
      decision:
        '**비선형 flame gate** — `smoothstep(0.08, 0.12, Tnorm)` 으로 *공간 가중치* 를 곱한다. ' +
        '*cold region* 에서는 *0 으로 차단*, *flame edge* 에서는 *살아남는다*. ' +
        '추가로 *작은 노이즈 ω* 는 *ω 의 제곱항* 으로 *제곱 감쇠*. ' +
        '*ε 자체* 는 *flame edge wisp* 가 살 만한 값으로 유지.',
      results: [
        'cold region *0 차단* — 빈 격자 깨끗',
        '작은 노이즈 ω *제곱 감쇠* — 잡티 자연 소멸',
        'flame edge wisp *살아남음* — 디테일 보존',
        '*비례 감쇠의 한계* 를 *비선형 게이트* 로 우회',
      ],
      stack: [
        'smoothstep(0.08, 0.12, Tnorm) — flame gate',
        'ε · |ω| · (N.y·ω, -N.x·ω) — 표준 Vorticity Confinement',
        '× vcWeight — 공간 가중치',
        'cold region 0 · flame edge 1',
      ],
      ascii: {
        title: '보조 — flame gate 의 모양 (HLSL)',
        intro:
          '*비선형 게이트* 는 *공간적으로 편재* 하는 *온도장* 의 `smoothstep` 을 *가중치* 로 곱하는 형태. ' +
          '*ε* 자체는 *flame edge wisp* 가 살 만한 값으로 유지하고, *cold region* 만 *0* 으로 게이트한다.',
        code: `// FireSim.compute — Vorticity Force kernel (요약)
float  Tnorm    = saturate(_TemperatureRT[id]);
float  vcWeight = smoothstep(0.08, 0.12, Tnorm);     // ← flame gate

float2 N        = SafeNormalize(gradMagOmega.xy);
float  omega    = _CurlRT[id];

float2 fConf =
    _Epsilon
    * float2( N.y * omega, -N.x * omega )
    * abs(omega)         // 작은 노이즈 ω 를 ω² 로 감쇠
    * vcWeight;          // cold region 에서 0

_VelocityRT[id] += fConf * _dt;`,
        result: '*cold region* 깨끗 + *flame edge wisp* 보존. *ε* 단일 슬라이더가 *flame edge* 와 *cold region* 두 곳에 동시에 작용하는 *결합* 을 *공간 가중치* 로 분리.',
      },
    },

    /* ─── 3.3 닫힌 계의 폭발 — 튜닝이 아닌 구조 ─────────── */
    {
      no: '3.3',
      kind: 'PHYSICS',
      title: '닫힌 계의 폭발 — *튜닝* 이 아닌 *구조* 로',
      lede: '두 번째 마우스 클릭에서 격자 전체 폭발. *dissipation / clamp* 강화로는 *N+1 번째* 에서 재발. *튜닝* 으론 못 막는 *구조 문제*.',
      problem:
        '*두 번째 마우스 클릭* 에서 *격자 전체가 폭발* (속도장 / 온도장 발산). ' +
        '*dissipation* 키우거나 *velocity clamp* 강화하면 그 클릭은 막혀도 ' +
        '*N+1 번째 클릭* 에서 *동일 패턴 재발*. ' +
        '*튜닝* 이 한 발 한 발 가져가는 *모래성 빌드*. ' +
        '*원인 진단* — 누적 에너지가 *사방 no-slip 경계* 에 부딪혀 *나갈 곳이 없다*.',
      decision:
        '**경계 구조를 바꾼다** — *튜닝이 아니라 구조*. ' +
        '*천장만 outflow* (`vel.y ≥ 0` 만 허용) + *top 8% 영역* 에서 *T → ambient lerp*. ' +
        '*한 줄 변경* 으로 *closed → open*. ' +
        '*dissipation / clamp* 는 *flame edge 디테일* 을 살리는 값으로 *되돌림*.',
      results: [
        'N 번째 클릭까지 *발산 없음* (open boundary 적용 후)',
        '*dissipation / clamp 되돌림* — flame edge 디테일 회복',
        '*튜닝 모래성* 이 *구조 한 줄 변경* 으로 해체',
        '"*튜닝이 아니라 구조* " 라는 디버그 휴리스틱 확립',
      ],
      stack: [
        '천장 outflow — vel.y ≥ 0 만 허용',
        'top 8% 영역 — T → ambient lerp',
        'closed → open boundary',
        'dissipation / clamp 되돌림',
      ],
    },

    /* ─── 3.4 IIgnitable — 인터페이스 한 줄 계약 ────────── */
    {
      no: '3.4',
      kind: 'SYSTEM',
      title: 'IIgnitable — 인터페이스 *한 줄 계약* 으로 가연물 시스템 분리',
      lede: '4 시간 안에 장작 점화 시스템 구축. *직접 참조* 면 빠르지만 *강결합*. *시뮬은 시뮬, 게임은 게임* 만 알도록 *누적형 한 줄 계약*.',
      problem:
        '*4 시간 안* 에 장작 점화 시스템을 구축해야 했다. *직접 참조* 면 빠르지만 ' +
        '*시뮬* 과 *게임* 이 *강결합* 되어 *다른 가연물 추가* (모닥불 / 양초 / 깃발 등) 시 *시뮬 측 코드를 매번 건드려야* 한다. ' +
        '*PoC 단계의 단축경* 이 *이후 모든 가연물 추가 비용* 에 *복리 이자* 로 돌아온다.',
      decision:
        '**`IIgnitable.TryIgnite(energy)` 한 줄 계약**. *누적형* — *에너지 임계치* 를 누적으로 받아 *내부 상태* 가 *점화 / 미점화* 를 결정. ' +
        '*시뮬은 시뮬만* (RT 폴링 / Inject) · *게임은 게임만* (IIgnitable 구현체 추가). ' +
        '*다른 가연물* (모닥불 LogMB / 양초 / 깃발 …) 은 *같은 계약만 구현* 하면 *결합 비용 0*.',
      results: [
        '게임 측 6 MB 가 *시뮬을 직접 참조하지 않음*',
        '*다른 가연물 추가* 시 *같은 계약만 구현* — 결합 비용 0',
        '*PoC 4 시간* 안에 *장작 점화 시스템* 구축',
        '*누적형 계약* 으로 *에너지 임계치 튜닝* 만으로 점화 난이도 조정 가능',
      ],
      stack: [
        'IIgnitable.TryIgnite(energy) — 한 줄 계약',
        '누적형 — 에너지 임계치 누적',
        'LogMB implements IIgnitable',
        'IgniterMB — 주변 IIgnitable → TryIgnite',
        'IgniteDetectorMB — FireSim RT 폴링 → 자기 점화',
      ],
    },
  ],

  // ─── Evidence — 이전 / 이후 ─────────────────────────
  metrics: {
    title: '결과 — *가상의 직결합 / 튜닝 baseline* vs 채택 구조',
    headers: ['지표', '직결합 / 튜닝 baseline (가상)', '채택 구조'],
    rows: [
      ['시뮬 ↔ 게임 결합',  '직접 참조 — 가연물 추가 시 시뮬 코드 수정',  '2 채널 (`QueueInjection` + RT 폴링) — 시뮬 코드 *0 줄*'],
      ['Vorticity Confinement', 'ε 만 조정 → flame edge 와 cold region 동시 죽음', '*flame gate* `smoothstep(0.08, 0.12, Tnorm)` — *공간 분리*'],
      ['닫힌 계 폭발',       'dissipation / clamp 강화 → N+1 번째 재발',     '*천장 outflow* + *top ambient lerp* — *한 줄 구조 변경*'],
      ['가연물 추가',        '시뮬 측 코드 매번 수정',                       '`IIgnitable.TryIgnite(energy)` *한 줄 계약* — 결합 비용 0'],
      ['Pipeline dispatch',  '미상',                                         '*~47 / frame* (10 unique kernels · Jacobi 40)'],
      ['렌더',               'SDR + 단순 텍스처',                            'HDR R16G16B16A16 + URP Bloom + ACES Tonemap + blackbody radiance'],
      ['안정성',             '두 번째 클릭에서 폭발',                        'N 번째 클릭까지 발산 없음'],
    ],
  },

  // 실 자산 — hero 는 기본 발광 (G: 불). screen-1 ~ 4 는 4 시각화 모드.
  heroImage: 'staring-fire/assets/hero.png',
  screenshots: [
    { src: 'staring-fire/assets/screen-1-default.png', tag: 'DEFAULT',  caption: '기본 발광 — blackbody radiance + URP Bloom + ACES. 좌측 HUD Room 207°C / comfort band. 우측 입력 가이드 (G 불 · 우클릭 바람 · 좌클릭 물건). 장작이 화염 가까이서 점화 대기.' },
    { src: 'staring-fire/assets/screen-2-temp.png',     tag: 'TEMP',     caption: '온도장 시각화 — *jet 컬러맵* 으로 `_TemperatureRT` 노출. 화염 코어가 *빨강 → 노랑 → 청* 으로 감쇠하는 분포 확인. Room 482°C.' },
    { src: 'staring-fire/assets/screen-3-velocity.png', tag: 'VELOCITY', caption: '속도장 시각화 — `_VelocityRT` 의 *|v|* 와 *상대각* 노출. *천장 outflow* 적용 결과 — 상승 흐름이 *위로 빠져나가는* 패턴.' },
    { src: 'staring-fire/assets/screen-4-smoke.png',    tag: 'SMOKE',    caption: '연기장 시각화 — `_SmokeRT` (불완전연소 부산물). 화염 위로 *연기 plume* 이 *Vorticity Force* 로 *wisp* 디테일을 살리며 상승.' },
  ],
};
