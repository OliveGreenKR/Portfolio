// pages/cartapli/data.js
// Cartapli page content — extracted as data so the JSX stays composition-only.
// Real content from uploads/cartapli.md. Values are factual (메트릭 등).

window.CARTAPLI_DATA = {
  meta: {
    code: 'MAIN · 01',
    title: 'Cartapli: Fold Quest',
    oneLine: '종이를 접어 싸우는 로그라이크',
    period: '2025.11 – 2026.02',
    weeks: '13 weeks',
    team: '4 인',
    role: 'PM 30% + 클라이언트 프로그래머 70%',
    platform: 'Steam (글로벌, 2026.02)',
    steam: 'https://store.steampowered.com/app/4314560?snr=5000_5100__',
    stack: ['Unity', 'C#', 'TopDownEngine', 'ScriptableObject', 'Odin Inspector', 'Steamworks', 'NUnit', 'Cinemachine', 'Clipper2Lib'],
  },

  // 4 hero metrics — the punchiest figures up top
  heroMetrics: [
    { n: '98%', label: 'Steam 매우 긍정', sub: '155 / 157 · 2026-02' },
    { n: '81,701', label: 'lifetime free licenses', sub: '2026-05 둘째주' },
    { n: '26,269', label: 'lifetime unique users', sub: '2026-05 둘째주' },
    { n: '412', label: '평균 활성 유저', sub: '2026-05 둘째주' },
  ],

  // Project facts ledger
  facts: [
    ['한 줄 정의', '종이를 접어 싸우는 로그라이크'],
    ['기간', '2025.11 – 2026.02 (13주)'],
    ['팀 구성', '4 인'],
    ['본인 역할', 'PM 30% + 클라이언트 프로그래머 70%'],
    ['스택', 'Unity · C# · TopDownEngine · ScriptableObject · Odin Inspector · Steamworks · NUnit · Cinemachine · Clipper2Lib'],
    ['규모', '111 C# 파일 · 20 디렉토리 · 본인 작성 싱글톤 13 · 디자인 패턴 12종 · 테스트 파일 11'],
    ['플랫폼', 'Steam 글로벌 (2026.02)'],
  ],

  // Role split — 본인 / 본인 작업 아님
  roles: {
    mine: '배틀씬 전체 시스템(턴 · 스킬 · AI · 스폰 · 데미지) · 종이접기 시스템의 3분할 리팩토링 · 텍스처링 · Z-order · FoldInputController 분리 · PaperPositionSyncher · 배틀씬 연동.',
    others: '종이접기 핵심 기하 로직 — SplitPolygonByLine, ReflectPointAcrossLine 등 GeometryUtility 는 PoC 입안자(다른 팀원) 작업.',
  },

  // ─── Systems (§3 · ACTION layer)
  // Each system follows PROBLEM → DECISION → RESULT internal pattern.
  // mermaid: source code, toggle-collapsed by default.
  systems: [
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '배틀씬 3계층 아키텍처',
      lede: '11개 싱글톤 · 10+ 시스템 · 15+ 이벤트가 동시 동작하지만 시스템 간 직접 참조 0.',
      problem: '로그라이크 배틀씬은 매 런마다 시스템 다수가 동시에 살아 움직여야 한다. 시스템 간 직접 참조로 묶이면 새 시스템 하나 추가가 *기존 코드 전부를 건드리는* 변경으로 번진다.',
      decision: 'Data / Entity / System 세 계층으로 분리. Data Layer 는 SO 중앙 레지스트리. Entity Layer 는 BattleSceneSingleton 오케스트레이터 + Character 컴포넌트 컨테이너 + UI. System Layer 는 BattleSceneSingleton 이벤트만 구독하고 Character 컴포넌트를 참조해 동작. Character 자체는 시스템이 아니라 *컴포넌트 컨테이너* — TurnActor / Health / StatMediator / PaperSyncTarget / AIBrain 등의 조합.',
      results: [
        '개발 중반 이후 스킬 시스템 · 업적 시스템 추가 시 기존 코드 변경 0줄로 통합',
        'Steamworks 업적 시스템을 OnBattleEnd 단일 이벤트 구독으로 통합 (전투 코드 수정 0)',
        '적 15종+, 챕터 2개를 Character 코드 수정 없이 운영',
      ],
      mermaid: `graph TB
    subgraph DL["Data Layer · 읽기 전용 데이터 공급"]
        DB_3T["DB Singleton<br/>(ScriptableObject 중앙 레지스트리)<br/>CharData · SkillDataSO · SpawnWaveDataSO"]
    end

    subgraph EL["Entity Layer · 오케스트레이션 + 컴포넌트 컨테이너"]
        BSS_3T["BattleSceneSingleton<br/>(오케스트레이터 · 7-State FSM · 15+ 이벤트)"]
        CE_3T["Character Entity<br/>(컴포넌트 컨테이너 — 시스템이 아님)<br/>TurnActor · Health · StatMediator · PaperSyncTarget · AIBrain"]
        UI_3T["UI<br/>(턴 순서 · HP · 스킬 쿨다운)"]
    end

    subgraph SL["System Layer · 독립 시스템 (이벤트 구독 + 컴포넌트 참조)"]
        S_AI["AI"]
        S_TURN["Turn"]
        S_DMG["Damage"]
        S_SKILL["Skill"]
        S_PAPER["Paper"]
        S_SPAWN["Spawn"]
        S_DEATH["DeathEcho"]
        S_STEAM["Steam"]
        S_LOG["Log"]
        S_INPUT["Input"]
    end

    DB_3T -.->|"읽기 전용"| EL
    DB_3T -.->|"읽기 전용"| SL
    BSS_3T ==>|"이벤트 발행"| SL
    SL -.->|"컴포넌트 참조"| CE_3T

    classDef data fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef entity fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef system fill:#e6efdf,stroke:#7ea571,color:#283825
    class DB_3T data
    class BSS_3T,CE_3T,UI_3T entity
    class S_AI,S_TURN,S_DMG,S_SKILL,S_PAPER,S_SPAWN,S_DEATH,S_STEAM,S_LOG,S_INPUT system`,
      // Extra: singleton table
      tableTitle: '본인 작성 싱글톤 13개 + ExecutionOrder',
      table: {
        headers: ['싱글톤', '역할', 'ExecutionOrder'],
        rows: [
          ['DB Singleton', 'ScriptableObject 중앙 레지스트리', '-1000'],
          ['LogRuntime', '로그 링버퍼 1000 · 비동기 CSV', '-45'],
          ['BattleSceneSingleton', '오케스트레이터 · 7-State FSM', '-35'],
          ['CharacterSpawner', '캐릭터 팩토리 · 오브젝트 풀', '-32'],
          ['PlayerPaperSingleton', '종이 보드 관리', '-32'],
          ['PlayerStateSingleton', '상태 이펙트 FIFO 큐', '-31'],
          ['PaperPositionSyncher', '접힌 면 기준 반사 좌표 동기화', '-20'],
          ['BattleTimeSingleton', 'Speed 기반 턴 스케줄링', '-15'],
          ['BattleSkillSingleton', '배틀 스킬 실행 트리거', '기본'],
          ['WeaponGemSkillSingleton', '무기 보석 스킬', '기본'],
          ['BattleDifficulty', '난이도 스케일링', '기본'],
          ['CharacterRangeRender', '범위 표시', '기본'],
          ['DeathEchoSingleton', '죽음 이펙트 풀', '기본'],
        ],
      },
    },

    {
      no: '3.2',
      kind: 'SYSTEM',
      title: '스킬 시스템 — 확장성 + 쉬운 사용성',
      lede: '관리와 구현을 분리하고, 구현 자체를 프리팹으로 데이터화.',
      problem: '플레이어 직접 사용 + 유물로 인한 자동 사용. 같은 기능이지만 스킬별 동작에 *약간씩 다른 차이* 가 필요하다. 한 클래스에 다 박으면 새 스킬마다 분기가 늘고, 분리하면 인스턴스별 차이를 데이터로 표현할 수단이 필요.',
      decision: '**관리와 구현의 분리** — 관리 데이터(쿨다운 · 사용 정책)와 구현 데이터(런타임 동작 · 프리팹)를 다른 계층에 둔다. 구현체는 *프리팹으로 데이터화* 하여 인스턴스별 차이를 표현. SkillExecutionContext 는 불변 구조체 + Fluent API — 새 인스턴스 반환으로 부작용 방지.',
      results: [
        '분신 스킬(MirrorImageExecutor) 추가 = OnExecute 오버라이드 1개 + 프리팹 조립 / 기존 시스템 수정 0',
        '6종 스킬 실행기 상호 영향 0',
        'SkillSystemContext 독립 생성으로 싱글톤 없는 단위 테스트 가능 (Immediate / Delayed / Failing 더미 3종)',
        '출시 시점 스킬 유물화 (스킬 → 보상 시스템 연동) 까지 확장 완료',
      ],
      mermaid: `graph LR
    subgraph DEV["스킬 개발 (구현 흐름)"]
        D1["구현 클래스 작성<br/>독립 동작<br/>Execute(SkillExecutionContext)"]
        D2["단위 테스트<br/>싱글톤 의존 없음"]
        D3["데이터화<br/>테스트 후 프리팹화"]
        D1 --> D2 --> D3
    end

    subgraph ADD["스킬 추가 (컨텐츠 흐름)"]
        A1["스킬 SO 생성<br/>쿨다운 등 관리 데이터"]
        A2["프리팹 연결<br/>ISkillExecutor 자동 검증"]
        A3["게임 등록<br/>컨텐츠 폴더 등록"]
        A1 --> A2 --> A3
    end

    D3 -.->|"구현체로 연결"| A2

    classDef dev fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef add fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class D1,D2,D3 dev
    class A1,A2,A3 add`,
      stack: ['GlobalSkillManager · 씬 간 슬롯/쿨다운', 'SkillSystemContext · 독립 생성 가능', 'SkillExecutorPool · 풀링', 'SkillExecutorBase · 템플릿 메서드 6종'],
    },

    {
      no: '3.3',
      kind: 'LIFECYCLE',
      title: '데이터 생명주기 — 같은 루프, 매번 다른 경험',
      lede: 'Permanent / Session / Scene 3계층. 하향 주입 + 상향 저장.',
      problem: '로그라이크의 데이터는 세 종류 — 런마다 초기화(적·난이도·보상) / 런을 넘어 누적(업적·통계·글로벌 스킬) / 씬 전환 시 유지(런 진행·세이브). 한 곳에 섞이면 씬 전환 한 번에 데이터 유실 또는 영구 오염.',
      decision: '**Permanent / Session / Scene** 3계층 분리. Permanent = DontDestroyOnLoad. Session = 한 런 = 시작~게임오버. Scene = 씬 로드~언로드. 하향 주입(Permanent → Session → Scene) + 상향 저장(Scene → Session → Permanent) 의 양방향 흐름 구축.',
      results: [
        '씬 전환 데이터 유실 0건',
        'Steamworks 업적 · 통계를 Permanent 에 배치해 전투 씬 코드 수정 없이 통합',
        '같은 BattleScene 코드로 매 런 다른 전투 경험',
      ],
      mermaid: `graph TB
    P["Permanent<br/>업적 · 통계 · 글로벌 스킬 매니저<br/>(프로그램 전체 생명주기)"]
    S["Session<br/>씬 전환 · 세이브/로드 · 런 진행 상태<br/>(한 런 = 시작~게임오버)"]
    SC["Scene<br/>배틀 / 상점 / 지도 / 보스<br/>(씬 로드~언로드)"]
    P ==>|"하향 주입"| S
    S ==>|"하향 주입"| SC
    SC -.->|"상향 저장"| S
    S -.->|"상향 저장"| P

    classDef tier fill:#f4f1ea,stroke:#d9d3c4,color:#1f1d1a
    class P,S,SC tier`,
    },

    {
      no: '3.4',
      kind: 'EVENT',
      title: 'Pre / On 2단계 이벤트 패턴',
      lede: '같은 프레임 충돌을 *1프레임 간격* 으로 풀어낸다.',
      problem: '같은 프레임에 다수 구독자가 *초기화* 와 *실행* 을 동시에 시도해 순서 충돌. 어느 구독자가 먼저 도느냐에 따라 결과가 달라짐.',
      decision: '이벤트를 **Pre / On 2단계** 로 분리 + `yield return null` 로 1프레임 간격 보장. Pre 단계 = 준비 (UI 갱신 · 상태 초기화) / On 단계 = 실제 실행 (액터 행동 시작 · 턴 완료 처리).',
      results: [
        '같은 프레임 충돌 해소',
        '업적 시스템을 OnBattleEnd 단일 이벤트로 통합 (전투 코드 수정 0)',
        '새 시스템 추가 시 *어느 이벤트의 Pre/On 어느 단계 구독* 즉시 결정 가능',
      ],
    },

    {
      no: '3.5',
      kind: 'DATA-DRIVEN',
      title: 'SO + DB 싱글톤 데이터 주도 설계',
      lede: '코드 변경 0 으로 적 · 챕터 · 웨이브 · 난이도를 운영.',
      problem: '데이터(적·웨이브·난이도)가 코드에 박히면 비프로그래머 팀원이 수치 조정만 해도 빌드가 필요. 직렬화·검증·일괄 편집 어느 것도 안 됨.',
      decision: '5종 SO(CharData · MD_SkillDataSO · MD_EnemySpawnWaveDataSO · MD_BattleWaveSetSO · MD_DeathEchoSO) + DB 싱글톤(ExecutionOrder=-1000) 이 중앙 레지스트리 — `DB.Get(Enemy.Wizard)` 형식 정적 접근. Resources 일괄 로드 + Dictionary 캐싱. Odin Inspector 의 [TabGroup] · [TableList] · [InlineEditor] 로 테이블 뷰 일괄 편집. Odin 직렬화 확장으로 Dictionary · 인터페이스 참조까지 SO 에 담음.',
      results: [
        '적 15종+, 챕터 2개, 웨이브, 난이도 모두 코드 변경 0 으로 SO 편집만 운영',
        '비프로그래머 팀원이 Odin 테이블에서 직접 수치 조정',
        'CSV Export 로 기획자와 데이터 교환',
      ],
    },

    {
      no: '3.6',
      kind: 'STATE-MACHINE',
      title: '7단계 배틀 FSM + 페이즈 분리',
      lede: 'Preparing → RoundStart → PlayerActionPhase → CharacterTurnPhase → RoundEnd → RewardPhase → BattleEnded.',
      problem: '한 배틀 안에 입력 처리 · 턴 스케줄링 · 보상 계산이 섞이면 각 단계의 책임 경계가 흐려진다. 페이즈 추가 / 변경 시 다른 페이즈 코드를 건드리는 변경이 발생.',
      decision: '**7단계 FSM** + 각 페이즈 단일 책임. PlayerActionPhase 는 FoldInputController 만 활성, CharacterTurnPhase 는 BattleTimeSingleton 턴 스케줄러만 동작. 페이즈 전환은 코루틴 기반(`DelayedBattleStartCoroutine`). 외부 시스템이 페이즈 종료를 알려주는 Command-Response 패턴 (`EndPlayerAction`, `EndCharacterPhase`).',
      results: [
        '분신 스킬(MirrorImage) 을 CharacterTurnPhase 에 액터 등록만으로 구현 / PlayerActionPhase 영향 0',
        '몬스터 패턴(CoordinateAttack) 추가 시 CharacterPhase 내 AIDecision/AIAction 만 추가 / 접기 입력 로직과 완전 독립',
        '보상 시스템을 RewardPhase 로 분리 / 전투 결과·보상 로직 변경 시 전투 코드 수정 불필요',
      ],
      // Visual FSM trail
      fsmTrail: ['Preparing', 'RoundStart', 'PlayerAction', 'CharacterTurn', 'RoundEnd', 'Reward', 'BattleEnded'],
    },

    {
      no: '3.7',
      kind: 'PHYSICS',
      title: '데미지 감지 / 적용 분리 (TopDownEngine 확장)',
      lede: 'TopDownEngine 의 DamageOnTouch 트리거 콜백을 비활성화하고 직접 Physics2D 쿼리로 교체.',
      problem: '폭발 범위 내 3~4 명 동시 피격 시 트리거 콜백 순서로 데미지 누락 · 중복이 발생. 고속 투사체는 한 프레임에 충돌체를 통과 (터널링).',
      decision: '감지(Overlap/Sweep) 와 적용(Health.Damage + 넉백) 을 분리. `MD_DamageOnOverlap2D` 는 매 프레임 OverlapBox/Circle 로 능동 감지. `MD_DamageOnSweep2D` 는 Open(예측 스윕) + Closed(실제 경로 추적) 모드로 터널링 차단. `MD_ExternalDamageApplicator` 는 Health.Damage() 와 넉백 처리. `MD_Projectile` 이 `ITrajectoryProvider` 구현 — 이전 프레임 위치 추적, 스윕 계산용 궤적 제공. 넉백 방향 전략 패턴 4종 (Owner / 방향 / 속도 / 스크립트).',
      results: [
        '폭발 범위 내 3~4 명 동시 피격 시 데미지 누락 · 중복 0',
        '예측 표시(LaserSight) 와 실제 판정 결과 일치',
        '고속 투사체 터널링 차단',
      ],
      // Boundary: double-buffered HashSet
      ascii: {
        title: '보조 — 더블 버퍼링 HashSet',
        intro: 'HashSet 2개를 미리 할당하고 매 프레임 참조만 swap. current 에 있고 prev 에 없으면 Enter, 양쪽이면 Stay, prev 에만 있으면 Exit. Physics2D.OverlapCircleNonAlloc 등 NonAlloc 변형 일관 사용.',
        code: `// per-frame, no allocations
temp     = prev;
prev     = current;
current  = temp;
current.Clear();

// Physics2D.OverlapCircleNonAlloc(..., current);

for (var c in current) {
    if (!prev.Contains(c))  OnEnter(c);  // 신규 진입
    else                    OnStay (c);  // 유지
}
for (var c in prev) {
    if (!current.Contains(c)) OnExit(c); // 이탈
}`,
        result: '프레임당 충돌 감지 GC 할당 0.',
      },
    },
  ],

  // Evidence — metrics
  metrics: {
    headers: ['지표', '값', '기준일'],
    rows: [
      ['Steam 평가', '매우 긍정 98% (155 / 157)', '2026-02 누적'],
      ['Lifetime free licenses', '81,701', '2026-05 둘째주'],
      ['Lifetime unique users', '26,269', '2026-05 둘째주'],
      ['위시리스트', '3,948', '2026-05 둘째주'],
      ['플레이타임 중간값', '48 분', '2026-05 둘째주'],
      ['평균 활성 유저', '412', '2026-05 둘째주'],
    ],
  },

  // Hero image — main visual key art
  heroImage: 'cartapli/assets/hero.png',

  // Screenshots carousel — Steam 페이지 링크가 있으니 영상/GIF 는 제외하고 정적 컷 6 장만.
  // 키보드 ←/→ 또는 화살표/썸네일로 넘김.
  screenshots: [
    { src: 'cartapli/assets/screen-1-battle.png', tag: 'BATTLE',  caption: '전투 — 스킬 사정거리와 적 턴 순서' },
    { src: 'cartapli/assets/screen-2-battle.png', tag: 'BATTLE',  caption: '전투 — 종이 분할과 발화 이펙트' },
    { src: 'cartapli/assets/screen-3-battle.png', tag: 'BATTLE',  caption: '전투 — 다수 적 동시 사정 라인' },
    { src: 'cartapli/assets/screen-4-shop.png',   tag: 'SHOP',    caption: '상점 — 유물 구매 (자본주의 패시브 등)' },
    { src: 'cartapli/assets/screen-5-rest.png',   tag: 'REST',    caption: '휴식 — 체력 회복 / 기본 스탯 강화' },
    { src: 'cartapli/assets/screen-6-map.png',    tag: 'MAP',     caption: '지도 — 노드 분기 (일반/엘리트/보스/보물/휴식/상점)' },
  ],
};
