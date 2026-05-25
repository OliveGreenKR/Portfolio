// pages/labs/ue5-action/data.js
// LAB · 01 — UE5 + Unreal C++ 8주 1인. 데이터 기반 스킬 + 콤보 + 피격 반응.
// Source: uploads/ue5-action.md. Schema 는 메인 페이지와 동일 (SESSION_MEMORY §3). Labs 압축 패턴 정립 페이지.
// classDef 팔레트는 Notebook 5 swatch (sage / terra / wheat / dusty / plum) 만.

window.UE5_ACTION_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    eyebrow: 'LAB · 01 ─ PoC / 실험',
    code: 'LAB · 01',
    title: 'UE5 Action — 데이터 기반 스킬 · 콤보',
    oneLine: 'UE5 + Unreal C++ 로 데이터 기반 스킬 시스템과 콤보 시스템을 직접 설계·구현한 8주 1인 개인 프로젝트.',
    period: '2024.09 – 2024.11',
    weeks: '8 weeks',
    team: '1 인',
    role: '클라이언트 프로그래머 (전 영역 본인)',
    platform: 'UE5.4 · Unreal C++',
    stack: ['Unreal Engine 5.4', 'Unreal C++', '애니메이션 몽타주', '델리게이트 시스템', 'DataAsset'],
  },

  // 4 hero metrics — Labs 카드 임팩트
  heroMetrics: [
    { n: '8 주',  label: '1인 개인 프로젝트', sub: 'UE5 + Unreal C++ · Unity 외 엔진 학습' },
    { n: '3',     label: '레이어 분리 아키텍처', sub: 'Game · Middleware · Data — 컴파일 의존성 분리' },
    { n: '3',     label: '직접 설계·구현 시스템', sub: '스킬 · 콤보 · 피격 반응' },
    { n: '360°',  label: '자동 방향 전환', sub: '선입력 + 마지막 입력 방향 = 공격 방향' },
  ],

  facts: [
    ['한 줄 정의', 'UE5 + Unreal C++ 로 데이터 기반 스킬 · 콤보 시스템을 직접 설계·구현한 8주 1인 개인 프로젝트'],
    ['기간',     '2024.09 – 2024.11 (8 주)'],
    ['팀 구성',   '1 인 개인 프로젝트'],
    ['본인 역할', '클라이언트 프로그래머 (전 영역 본인)'],
    ['스택',     'Unreal Engine 5.4 · Unreal C++ · 애니메이션 몽타주 · 델리게이트 시스템 · DataAsset'],
    ['산출물',   '액션 게임 데모 (3인칭 캐릭터 + 스킬 + 콤보 + 피격)'],
    ['작업 분배', '데이터 기반 스킬 시스템 (3주) · 레이어 분리 아키텍처 (1주) · 콤보 · 스킬 생명주기 (3주) · 피격 반응 (1주)'],
  ],

  roles: {
    mine:
      '전 영역 본인. **데이터 기반 확장형 스킬 시스템** (3레이어 분리 · 인터페이스 기반 의존성 분리) · ' +
      '**콤보 시스템** (선입력 + 마지막 입력 방향 = 공격 방향 + 세분화된 델리게이트) · ' +
      '**확장 가능한 피격 반응 시스템** 직접 설계·구현.',
    others:
      '1인 개인 프로젝트로 외부 협업 없음. 외부 의존: ' +
      '**Unreal Engine 5.4 · Unreal C++ · 애니메이션 몽타주 · 델리게이트 시스템** — 엔진 제공 기능만 사용.',
  },

  // ─── Systems (§3) ──────────────────────────────────────────
  systems: [
    /* ─── 3.1 데이터 기반 스킬 시스템 ───────────────────────── */
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '데이터 기반 확장형 스킬 시스템 — 3레이어 분리',
      lede: '스킬을 *코드 컴파일* 이 아니라 *DataAsset 편집* 으로 추가. Game / Middleware / Data 3레이어 + 인터페이스 추상화.',
      problem:
        '액션 게임의 스킬 컴포넌트는 *기본 엔진 제공 이상의 확장성* 이 필요. 스킬을 추가할 때마다 ' +
        '*코드를 매번 컴파일* 하면 기획 반복 속도가 떨어진다. 또한 스킬 컴포넌트가 다른 시스템 (전투 · UI 등) 의 ' +
        '*구체 타입을 직접 참조* 하면 어느 한 시스템 변경이 스킬 코드 전체에 파급된다.',
      decision:
        '**3레이어 분리** + **인터페이스 기반 의존성 분리**. ' +
        '`Game` 레이어는 캐릭터·컨트롤러·스킬 컴포넌트만 알고, ' +
        '`Middleware` 레이어는 스킬 실행 로직 · 몽타주 생명주기 동기화 · `IInterface` 추상화 로 외부 시스템 결합을 차단. ' +
        '`Data` 레이어는 **스킬 파라미터 구조체 (DataAsset)** 와 **콤보 연계 조건 / 최대 콤보 수** 만 보유. ' +
        '새 스킬 = `DataAsset` 추가 + 파라미터 입력 — **C++ 컴파일 0**.',
      results: [
        '**스킬 추가 시 컴파일 의존성 최소화** — 데이터만 추가하면 신규 스킬 작동',
        '기획 변경 빠른 대응 — 파라미터 / 콤보 연계 조건은 DataAsset 편집만으로 수정',
        '다른 시스템과 약한 결합 — 스킬 컴포넌트 단위 테스트 · 재사용 가능 구조',
        '몽타주 생명주기와 스킬 로직 동기화 — 애니메이션 몽타주 델리게이트로 시작 / 종료 / 시퀀스 이벤트 수신',
      ],
      stack: [
        'Game: Character · Controller · SkillComponent',
        'Middleware: 스킬 실행 · 몽타주 생명주기 · IInterface',
        'Data: 스킬 파라미터 구조체 (DataAsset)',
        'Data: 콤보 연계 조건 / 최대 콤보 수',
        '델리게이트 (몽타주 이벤트)',
      ],
      mermaid: `graph TB
    subgraph GAME["🎮 Game 레이어"]
        CHAR["Character / Controller"]
        SKILL_COMP["SkillComponent<br/>(외부 의존도 최소화)"]
    end

    subgraph MID["⚙ Middleware 레이어"]
        EXEC["스킬 실행 로직"]
        LIFECYCLE["몽타주 생명주기 동기화<br/>(델리게이트)"]
        IF["IInterface 추상화<br/>(외부 시스템 결합 차단)"]
    end

    subgraph DATA["📦 Data 레이어"]
        PARAM["스킬 파라미터 구조체<br/>(DataAsset 기반)"]
        TABLE["콤보 연계 조건 / 최대 콤보 수"]
    end

    CHAR --> SKILL_COMP
    SKILL_COMP --> EXEC
    EXEC --> LIFECYCLE
    EXEC -.->|"인터페이스만 알고 구체 모름"| IF
    DATA -.->|"데이터 주입"| EXEC

    classDef game fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef mid  fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef data fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    class CHAR,SKILL_COMP game
    class EXEC,LIFECYCLE,IF mid
    class PARAM,TABLE data`,
      tableTitle: '3레이어 책임 분리',
      table: {
        headers: ['레이어', '책임', '예'],
        rows: [
          ['Game',       '캐릭터 · 컨트롤러 · 스킬 컴포넌트', 'Character · Controller · SkillComponent'],
          ['Middleware', '스킬 실행 로직 · 몽타주 생명주기 · 인터페이스 추상화', 'IInterface · 델리게이트 동기화'],
          ['Data',       '스킬 파라미터 · 콤보 조건', 'DataAsset (스킬당 1) · 연계 테이블'],
        ],
      },
    },

    /* ─── 3.2 콤보 시스템 ─────────────────────────────────── */
    {
      no: '3.2',
      kind: 'EVENT',
      title: '콤보 시스템 — 선입력 + 360° 자동 방향 전환',
      lede: '*"버튼을 눌렀을 때 캐릭터가 의도한 대로 반응한다"* 를 조작감의 핵심으로 정의. 마지막 순간까지 방향 결정 가능.',
      problem:
        '액션 게임의 조작감은 *플레이어 의도와 캐릭터 반응의 일치* 로 결정된다. ' +
        '콤보 입력 시점이 *고정* 되면 플레이어는 다음 방향을 *미리* 결정해야 하고, ' +
        '그 결과 빠른 상황 변화에서 *의도와 다른 방향* 으로 공격이 나간다.',
      decision:
        '**콤보 선입력 기간** 을 데이터로 설정 / 관리 (스킬별 가변). ' +
        '선입력 기간 동안 입력 방향을 **매 프레임 추적** 하고, **마지막 입력 방향을 공격 방향으로 채택** — 360° 자동 방향 전환. ' +
        '스킬별 최대 콤보 수 · 연계 조건은 데이터로 관리. ' +
        '**세분화된 델리게이트** — 스킬 실행 / 종료, 시퀀스별 시작 / 종료 를 모두 별도 이벤트로 분리하여 ' +
        '`Anim Notify` · 사운드 · 카메라 · VFX 가 각자 필요한 타이밍만 구독.',
      results: [
        '플레이어 의도와 캐릭터 반응의 높은 일치감',
        '콤보 연계 — 원하는 조작이 *생각대로* 발생',
        '콤보 중단 — 의도한 타이밍에 즉시 중단',
        '방향 전환 — 입력 방향대로 자연스럽게 전환',
      ],
      stack: [
        '선입력 버퍼 (스킬별 기간 데이터)',
        '입력 방향 지속 추적 (매 프레임)',
        '마지막 입력 방향 채택 = 공격 방향',
        '콤보 연계 조건 (DataAsset)',
        '세분화된 델리게이트 (실행 · 종료 · 시퀀스)',
      ],
      mermaid: `graph LR
    INPUT["플레이어 입력<br/>(공격 버튼 + 방향)"]
    BUFFER["선입력 버퍼<br/>(스킬별 기간 데이터)"]
    TRACK["입력 방향 지속 추적<br/>(매 프레임)"]
    FINAL["마지막 입력 방향 채택<br/>= 공격 방향"]
    NEXT["콤보 연계 조건 검사<br/>(데이터 기반)"]
    EXEC["다음 스킬 실행"]

    INPUT --> BUFFER --> TRACK --> FINAL --> NEXT --> EXEC

    classDef input fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef logic fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef data  fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    class INPUT input
    class BUFFER,TRACK,FINAL logic
    class NEXT,EXEC data`,
      fsmTrail: ['입력', '선입력 버퍼', '방향 추적', '마지막 방향 채택', '연계 조건 검사', '다음 스킬 실행'],
    },

    /* ─── 3.3 피격 반응 시스템 ──────────────────────────── */
    {
      no: '3.3',
      kind: 'DATA-DRIVEN',
      title: '확장 가능한 피격 반응 시스템',
      lede: '피격 종류 · 강도 · 방향에 따라 다른 반응을 *데이터* 로 분기. 데미지 · 상태 · 이펙트가 각자 독립.',
      problem:
        '피격 반응을 코드에서 *조건문* 으로 분기하면 새 반응 추가 시마다 *기존 코드를 수정* 해야 하고, ' +
        '데미지 적용 · 상태 변경 · 이펙트 트리거가 *한 함수에 뭉쳐* 있으면 한쪽 변경이 다른쪽에 파급된다.',
      decision:
        '피격 반응을 **데이터 기반** 으로 분기 — 피격 종류 / 강도 / 방향을 키로 반응 데이터를 조회. ' +
        '인터페이스로 외부 시스템에 노출 — **데미지 적용 · 상태 변경 · 이펙트 트리거가 각자 독립**.',
      results: [
        '새 피격 반응 추가 시 *기존 코드 수정 최소화*',
        '데미지 · 상태 · 이펙트 시스템이 서로 영향 없이 확장 가능',
      ],
      stack: ['피격 반응 데이터 (종류 · 강도 · 방향)', 'IInterface (외부 노출)', '데미지 · 상태 · 이펙트 분리'],
    },
  ],

  // ─── Evidence — 정량 결과 (질적 비교 표) ─────────────────
  metrics: {
    title: '결과 — 이전 vs 이후',
    headers: ['지표', '이전', '이후'],
    rows: [
      ['스킬 추가 시 컴파일',     '매번 (C++)',                   '0 — DataAsset 추가 / 파라미터 입력'],
      ['콤보 연계 / 최대 콤보',   '코드 하드코드',                'DataAsset 편집만'],
      ['시스템 간 결합',          '구체 타입 직접 참조',          '인터페이스만 — 단위 테스트 / 재사용 가능'],
      ['콤보 방향 결정',          '입력 시점 고정',               '마지막 입력 방향 = 공격 방향 (360°)'],
      ['피격 반응 추가',          '기존 코드 수정',               '반응 데이터 행 추가만'],
      ['이벤트 구독',             '한 함수에 뭉쳐 있음',          '세분화된 델리게이트 — 시스템별 필요 시점만 구독'],
    ],
  },

  // 실 자산 — hero = 액션 컴포넌트 디버그 뷰 (캡슐 콜라이더 + 구형 탐지 영역 + HP 바).
  // CursorBlade 캡처는 별개의 2D 탑다운 PoC (ring-dash 변종 중 하나) — UE5 액션 자산 아님.
  heroImage: 'ue5-action/assets/hero.png',
};
