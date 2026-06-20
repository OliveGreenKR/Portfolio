// pages/motelet/data.js
// Motelet (개발 코드명 CursorBlade) — 개발 중 · 미출시 인크레멘탈 게임. 본인 = PM 겸 배틀씬 프로그래머.
// Schema mirrors DX11_DATA (NotebookPage 렌더 계약). hero = 밸런싱 루프 mermaid, gallery = 게임/에디터 스크린샷.
// 스크린샷 파일은 pages/motelet/assets/ 에 저장 (title.png · gameplay.png · skill-tree-editor.png · balance-sim.png).

window.MOTELET_DATA = {
  meta: {
    code: 'MAIN · 01',
    eyebrow: 'MAIN · 01 ─ 개발 중 · 미출시 (팀 3인)',
    date: '2026.05 – 진행 중',
    title: 'Motelet — 인크레멘탈 배틀 + 밸런싱 시뮬레이터',
    oneLine:
      '청소 로봇이 먼지 몬스터를 쓸어담는 **인크레멘탈** (Steam 출시 준비 중). ' +
      '수백 이펙트를 비동기 풀로, 물리 엔진 없이 자체 기하로 결정론 판정. ' +
      '스킬 성장을 **골드 수급량**으로 정량화해 시뮬레이터로 밸런싱.',
    period: '2026.05 – 진행 중',
    weeks: '진행 중 · 5주+',
    team: '3 인',
    role: 'PM · 배틀씬 프로그래머',
    platform: 'Unity 6.0 · PC (Steam 예정)',
    stack: ['Unity 6.0 LTS', 'C# 10', 'Addressables', 'UniTask', 'UIElements / GraphView', 'IMGUI', 'Odin Inspector', 'Evolution Strategy(자체)'],
  },

  // 히어로 = 타이틀 아트 (다른 메인 프로젝트와 동일하게 이미지 히어로)
  heroImage: 'motelet/assets/title.png',

  heroMetrics: [
    { n: '5종',  label: '공격원 모델',      sub: '평타 · 대시 · 블랙홀 · 직선청소 · 연쇄번개 → 처치율 분해' },
    { n: '수백', label: '동시 이펙트',       sub: 'Addressables + UniTask 비동기 · 단위/전역 풀' },
    { n: '0',    label: '물리 엔진 의존',     sub: '자체 2D 원 기하 · 결정론 피격 판정' },
    { n: '≈375', label: '본인 커밋 / 585',   sub: 'skillTreePreset 브랜치 주도' },
  ],

  // 게임 + 에디터 실제 스크린샷 (assets/ 에 저장). 타이틀은 히어로로 사용.
  screenshots: [
    { src: 'motelet/assets/gameplay.png',         tag: 'BATTLE', caption: '배틀씬 — 블랙홀 · 연쇄번개 · 직선청소 등 수십 이펙트 동시 · 자체 2D 기하 피격 판정' },
    { src: 'motelet/assets/skill-tree-editor.png', tag: 'TOOL',  caption: '스킬트리 노드 에디터 — 그래프 편집 + 밸런싱 수치(Config · RewardCatalog) 역직렬화 + 시뮬 통합 + 연결 검증' },
    { src: 'motelet/assets/balance-sim.png',      tag: 'SIM',   caption: '밸런싱 시뮬레이터 — eGold 성장률(Δln) 곡선 · ΔGold 폭등 지점 분석 · ES 자동 수치 탐색(runs 90 · λ128)' },
  ],

  facts: [
    ['한 줄 정의',  '청소 로봇이 먼지 몬스터를 쓸어담는 인크레멘탈 게임의 배틀씬 + 스킬 밸런싱 도구'],
    ['개발 상태',   'Motelet (개발 중 · 미출시, Steam 출시 준비)'],
    ['기간',       '2026.05 – 진행 중 (~5주)'],
    ['팀 구성',     '3 인 (본인 = PM 겸 배틀씬 프로그래머)'],
    ['본인 역할',   '배틀 런타임(이펙트 · 판정) + 밸런싱 시뮬레이터 / 에디터'],
    ['스택',       'Unity 6.0 · C# 10 · Addressables · UniTask · GraphView · Odin Inspector · ES'],
    ['규모',       '에디터 확장 모듈 39 파일(에디터 24 + 시뮬 8 + 프록시 7) · 전체 285'],
    ['외부 협업',   '스킬 시스템 · DB · 그래프 에디터 *기반* 은 팀원 작업 — 그 위에 개선 · 시뮬 추가'],
  ],

  roles: {
    mine:
      '배틀 런타임 전반 — 대량 이펙트 비동기 자원관리(Addressables + UniTask + 단위/전역 풀), ' +
      '물리 엔진 없는 자체 2D 원 기하 결정론 피격 판정. ' +
      '밸런싱 — 골드 수급량 수학 모델(처치율 × 처치당 골드) + 런 단위 성장 시뮬레이터 + ΔGold 폭등 분석 + ES 자동 수치 탐색. ' +
      '그래프 에디터 개선 — 사용성(복사/삭제 단축키) + 밸런싱 수치 역직렬화 + 시뮬레이션 통합 + write-back.',
    others:
      '스킬 데이터 · DB · 런타임 적용 프레임워크와 그래프 에디터의 *기반(base)* 은 팀원 작업. ' +
      '본인은 그 위에 기능을 추가 · 개선했다. 게임 코어 일부도 팀 분담.',
  },

  systems: [
    /* ─── 4.1 배틀 런타임 ───────────────────────────────── */
    {
      no: '4.1',
      kind: 'SYSTEM',
      title: '배틀 런타임 — 대량 이펙트 비동기 풀 + 자체 기하 판정',
      lede: '인크레멘탈 특성상 화면에 수백 이펙트 · 다수 객체가 동시에 돈다. 자원은 비동기 풀로, 판정은 물리 엔진 없이 자체 2D 기하로.',
      problem:
        '인크레멘탈 게임은 화면에 수백 개의 이펙트 · 사운드가 동시에 터지고 다수 객체가 동시에 움직인다. ' +
        '(1) 동기 로드 · 즉시 생성은 끊김과 메모리 스파이크를 만든다. ' +
        '(2) Unity 물리 엔진은 이 규모에서 오버헤드가 크고, 내부 상태에 의존해 결과가 비결정적이다.',
      decision:
        '(1) 기존 VFX · Sound 시스템을 `Addressables` + `UniTask` 기반 **비동기 로드/해제** 로 재구성하고, ' +
        '**단위별 풀 + 전역 풀** 로 재사용 — 필요한 만큼만 비동기로 확보하고 반환. ' +
        '(2) 게임 특성상 **정밀 판정이 불필요** 하다고 판단해 물리 엔진을 버리고 **2차원 원(circle) 타입 기하 월드** 를 직접 구성, ' +
        '**빠른 쿼리** 로 피격 판정.',
      results: [
        '대량 이펙트 동시 사용에도 끊김 없이 안정적 운영',
        '물리 엔진 의존 0 — 다수 객체 동시 이동에도 결정론적 · 안정적 피격 판정',
        '프레임률 · 물리 엔진 내부 상태에 흔들리지 않는 판정',
      ],
      stack: ['Addressables (비동기 로드/해제)', 'UniTask', '단위 풀 + 전역 풀', '자체 2D 원 기하 월드', '공간 쿼리'],
      tableTitle: '두 축 — 자원관리 / 판정',
      table: {
        headers: ['축', '문제', '해결'],
        rows: [
          ['이펙트 · 사운드', '수백 개 동시 = 끊김 · 메모리 스파이크', 'Addressables + UniTask 비동기 + 단위/전역 풀'],
          ['피격 판정',       '물리 엔진 오버헤드 · 비결정성',        '자체 2D 원 기하 + 빠른 쿼리 (정밀도 trade-off)'],
        ],
      },
    },

    /* ─── 4.2 밸런싱 수학 모델 ──────────────────────────── */
    {
      no: '4.2',
      kind: 'SIMULATION',
      title: '밸런싱 수학 모델 — 골드 수급량의 단계적 추상화',
      lede: '"성장"과 "성장 체감"을 골드 수급량으로 정량화. 처치율 × 처치당 골드로 분해해, 노드 수치 변경이 성장 곡선에 즉시 환원되도록.',
      problem:
        '데모 밸런싱은 보통 "감" 으로 수치를 넣고 플레이로 확인한다 — 반복 비용이 크고 근거가 약하다. ' +
        '무엇보다 "성장이 잘 느껴지는가" 는 주관적이라 측정 지표가 없었다.',
      decision:
        '**성장 = 런(run)당 골드 수급량**, **성장 체감 = 스킬 투자 1회당 골드 수급량의 증가분(ΔGold)** 으로 정량화. ' +
        '골드 수급량을 게임 시스템 단위로 분해해 런타임 공식을 에디터에서 미러링한 시뮬레이터를 구현 (`BalanceSimCore`).',
      results: [
        '스킬 노드가 바꾸는 스탯 → 분해식 → 골드 수급량 / 성장 곡선으로 환원',
        '수치 변경이 곡선에 즉시 반영 — 플레이 없이 검증',
        '5종 공격원(평타 · 대시 · 블랙홀 · 직선청소 · 연쇄번개)별 골드 기여 분리',
        '레벨 진행(levelCap 20) · 적 동시 상한(reachCap 500) 등 런타임 노브를 그대로 미러링',
      ],
      stack: ['BalanceSimCore (런타임 공식 미러링)', 'GrowthSimulator (런 단위 곡선)', 'ROI / 최저가 구매 정책'],
      ascii: {
        title: '골드 수급량 분해식',
        intro: '노드가 바꾸는 스탯이 아래 식을 타고 골드 수급량 → 성장 곡선으로 환원된다.',
        code: `런당 기대 골드
  E = Σ_level  killRate(level) × kills(level) × goldPerKill(level)

처치율 (kills/sec)
  killRate(h) = Σ_source  freq × reach × min(1, dmg / h)
  reach       = max(1, range^exp × hitWeight)   // 화면 내 적 수로 상한
  source ∈ { 평타, 대시, 블랙홀, 직선청소, 연쇄번개 }

스탯 해석 (런타임 미러링)
  stat = (base + Σ add×level) × (1 + Σ mul×level)`,
        result: '"골드 = 골드 리소스 × 리소스 획득량" 직관을, 처치율 × 처치당 골드라는 측정 가능한 식으로 구체화.',
      },
    },

    /* ─── 4.3 스킬트리 에디터 ───────────────────────────── */
    {
      no: '4.3',
      kind: 'TOOL',
      title: '스킬트리 에디터 — 시뮬레이션 통합 + ΔGold 분석 + 자동 탐색',
      lede: '팀원의 그래프 에디터 위에 사용성 · 수치 역직렬화 · 시뮬레이션을 추가. ΔGold 폭등 분석으로 초기 과성장을 잡고, ES 로 목표 곡선을 자동 추종.',
      problem:
        '편집 도구(그래프 에디터)는 있었지만 밸런싱 수치를 불러오거나 결과를 시뮬레이션할 수단이 없었다. ' +
        '또 초기 빌드는 성장이 과했는데, 어느 구간이 과한지 짚을 방법이 없었다.',
      decision:
        '팀원의 그래프 에디터에 **사용성 개선**(노드 복사/삭제 단축키 등) + ' +
        '**밸런싱 수치 역직렬화**(`BaseConfig` · `RewardCatalog` 등을 시뮬 입력으로) + ' +
        '**시뮬레이션 통합**(성장 곡선 · 노드 기여 히트맵 · write-back) 을 추가. ' +
        '**ΔGold 폭등 지점 분석**(런별 골드 증가량 · Δln 시각화)으로 과성장 구간을 식별. ' +
        '목표 곡선을 주면 노드 파라미터를 **진화 전략(μ+λ ES)** 으로 자동 튜닝(runs 90 · iterations 64 · λ128).',
      results: [
        '성장 곡선을 *부드럽게* 가 아니라 **급등 포인트 몇 개**를 둔 형태로 의도적 설계',
        'ΔGold 폭등 분석으로 초기 과성장 식별 → 밸런싱 → "훨씬 좋아졌다" 평',
        '편집 결과를 SkillData SO · Config 로 write-back → 인게임 즉시 반영',
        'ES 자동 수치 탐색 — 목표 곡선 추종을 최적화로 자동화 (범위/한계효용/기여비율 페널티)',
      ],
      stack: ['UIElements / GraphView', 'Odin Inspector', '수치 역직렬화 (Config / RewardCatalog)', 'ΔGold 히트맵', 'EvolutionStrategyOptimizer (μ+λ)'],
      mermaid: `graph LR
    TGT["목표 성장 곡선"]
    POP["후보 파라미터 집단<br/>(BaseCost · 스탯 모드)"]
    EVAL["시뮬레이션 평가<br/>RMSE + 범위/한계효용/기여비율 페널티"]
    SEL["선택 · 변이<br/>(μ+λ) ES"]
    OUT["튜닝된 노드 수치"]

    TGT --> EVAL
    POP --> EVAL --> SEL --> POP
    SEL -->|수렴| OUT

    classDef a fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef b fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class TGT,OUT a
    class POP b
    class EVAL,SEL c`,
    },
  ],

  metrics: {
    title: '결과 — 접근 / 효과',
    headers: ['항목', '내용'],
    rows: [
      ['성장 정량화',     '성장 = 런당 골드 수급량 · 성장 체감 = ΔGold (투자 1회당 증가분)'],
      ['성장 곡선 설계',   '부드러운 곡선 ❌ → 급등 포인트 몇 개를 의도적으로 배치'],
      ['초기 과성장 수정', 'ΔGold 폭등 지점 분석(런별 골드 증가량 · Δln)으로 식별 → 밸런싱 → "훨씬 좋아졌다" 평'],
      ['대량 이펙트',     'Addressables + UniTask 비동기 + 단위/전역 풀 → 끊김 없이 수백 동시'],
      ['피격 판정',       '물리 엔진 0 · 자체 2D 원 기하 빠른 쿼리 → 다수 객체 결정론 안정'],
      ['수치 자동 탐색',   '목표 곡선 → ES(μ+λ, runs 90 · λ128) 로 노드 파라미터 자동 튜닝'],
    ],
  },
};
