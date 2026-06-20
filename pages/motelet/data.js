// pages/motelet/data.js
// Motelet (개발 코드명 CursorBlade) — 개발 중 · 미출시 인크레멘탈 게임. 본인 = PM 겸 배틀씬 프로그래머.
// Schema mirrors DX11_DATA. hero = 타이틀 아트, gallery = 게임/에디터 스크린샷.
// 스크린샷: pages/motelet/assets/ (title.png · gameplay.png · skill-tree-editor.png · balance-sim.png)
// 코드 근거: knowledge_base/projects/cursorblade/code_analysis/battle_runtime.md + labs/sound-system

window.MOTELET_DATA = {
  meta: {
    code: 'MAIN · 01',
    eyebrow: 'MAIN · 01 ─ 개발 중 · 미출시 (팀 3인)',
    date: '2026.05 – 진행 중',
    title: 'Motelet — 인크레멘탈 배틀 + 밸런싱 시뮬레이터',
    oneLine:
      '청소 로봇이 먼지 몬스터를 쓸어담는 **인크레멘탈** (Steam 출시 준비 중). ' +
      '수백 이펙트를 async 풀로, 물리 엔진 없이 자체 2D 기하로 결정론 판정. ' +
      '스킬 성장을 **골드 수급량**으로 정량화해 시뮬레이터로 밸런싱.',
    period: '2026.05 – 진행 중',
    weeks: '진행 중 · 5주+',
    team: '3 인',
    role: 'PM · 배틀씬 프로그래머',
    platform: 'Unity 6.0 · PC (Steam 예정)',
    stack: ['Unity 6.0 LTS', 'C# 10', 'Addressables', 'UniTask', 'UIElements / GraphView', 'IMGUI', 'Odin Inspector', 'Evolution Strategy(자체)'],
  },

  heroImage: 'motelet/assets/title.png',

  heroMetrics: [
    { n: '수백', label: '동시 이펙트',     sub: 'async 풀 + ref-count seam · 핫패스 할당 0 · 풀 cap 32 · idle 30s' },
    { n: '0',    label: '물리 엔진 의존',   sub: '자체 2D 원 기하 · 제곱거리 + AABB 브로드페이즈 · 결정론' },
    { n: '5종',  label: '공격원 모델',     sub: '평타 · 대시 · 블랙홀 · 직선청소 · 연쇄번개 → 처치율 분해' },
    { n: '≈375', label: '본인 커밋 / 585', sub: 'skillTreePreset 브랜치 주도' },
  ],

  screenshots: [
    { src: 'motelet/assets/gameplay.png',          tag: 'BATTLE', caption: '배틀씬 — 블랙홀 · 연쇄번개 · 직선청소 등 수십 이펙트 동시 · 자체 2D 기하 피격 판정' },
    { src: 'motelet/assets/skill-tree-editor.png', tag: 'TOOL',   caption: '스킬트리 노드 에디터 — 그래프 편집 + 밸런싱 수치(Config · RewardCatalog) 역직렬화 + 시뮬 통합 + 연결 검증' },
    { src: 'motelet/assets/balance-sim.png',       tag: 'SIM',    caption: '밸런싱 시뮬레이터 — eGold 성장률(Δln) 곡선 · ΔGold 폭등 지점 분석 · ES 자동 수치 탐색(runs 90 · λ128)' },
  ],

  facts: [
    ['한 줄 정의',  '청소 로봇이 먼지 몬스터를 쓸어담는 인크레멘탈 게임의 배틀씬 + 스킬 밸런싱 도구'],
    ['개발 상태',   'Motelet (개발 중 · 미출시, Steam 출시 준비)'],
    ['기간',       '2026.05 – 진행 중 (~5주)'],
    ['팀 구성',     '3 인 (본인 = PM 겸 배틀씬 프로그래머)'],
    ['본인 역할',   '배틀 런타임(VFX · 사운드 · 판정) + 밸런싱 시뮬레이터 / 에디터'],
    ['스택',       'Unity 6.0 · C# 10 · Addressables · UniTask · GraphView · Odin Inspector · ES'],
    ['규모',       '에디터 확장 모듈 39 파일(에디터 24 + 시뮬 8 + 프록시 7) · 전체 285'],
    ['외부 협업',   '스킬 시스템 · DB · 그래프 에디터 *기반* 은 팀원 작업 — 그 위에 개선 · 시뮬 추가'],
  ],

  roles: {
    mine:
      '배틀 런타임 전반 — VFX(`Chul.VFXSystem`) · 사운드(`Chul.SoundSystem`)를 Addressables async 풀 + 취득 seam(ref-count·idle release)으로, ' +
      '물리 엔진 없는 자체 2D 원 기하(`CursorBlade.Geo`) 결정론 피격 판정. ' +
      '밸런싱 — 골드 수급량 수학 모델(`BalanceSimCore`) + 런 단위 시뮬레이터 + ΔGold 폭등 분석 + ES 자동 수치 탐색. ' +
      '그래프 에디터 개선 — 사용성 + 밸런싱 수치 역직렬화 + 시뮬레이션 통합 + write-back.',
    others:
      '스킬 데이터 · DB · 런타임 적용 프레임워크와 그래프 에디터의 *기반(base)* 은 팀원(LBC) 작업. ' +
      '본인은 그 위에 기능을 추가 · 개선했다. 게임 코어 일부도 팀 분담.',
  },

  systems: [
    /* ─── 4.1 VFX ───────────────────────────────────────── */
    {
      no: '4.1',
      kind: 'SYSTEM',
      title: 'VFX 시스템 — 대량 이펙트 async 풀 + 취득 seam',
      lede: '화면에 수백 이펙트가 동시에 터진다. 프리팹 취득(load/release)만 인터페이스로 분리(ref-count + idle release)하고, id별 풀로 핫패스 할당을 0으로.',
      problem:
        '인크레멘탈은 한 화면에 수백 개의 이펙트가 동시에 생멸한다. 동기 로드·매번 `Instantiate`는 끊김과 메모리 스파이크를 만들고, ' +
        '메모리에 전부 상주시키면 메모리가 터진다.',
      decision:
        '취득+수명을 `IVFXResourceManager` seam으로 분리(sync/async 은닉) — 구현 `AddressablesVFXResourceManager`가 **async 로드 + ref-count + idle release(30s) + in-flight 합류**. ' +
        '`VFXManager`는 **id별 `ObjectPool<VFXInstance>`** + 재생 게이트(cooldown/maxConcurrent)만 담당. ' +
        '풀 미준비 시 **pre-issued 핸들**을 즉시 발급하고 async 로드 → 게임플레이가 블록되지 않는다. ' +
        '이 seam 패턴을 **사운드(§4.2)에도 동일 적용**.',
      results: [
        '핫패스 `Instantiate` 0 — resident prewarm + 프레임 분산 prewarm(2/프레임)',
        '대량 이펙트 동시 사용에도 끊김 없음 (async off-thread 로드 + per-id 동시수 캡)',
        '구간 단위 그룹 Preload/Release(ref-count) — 같은 클립 동시 요청도 핸들 1개(in-flight 합류)',
      ],
      stack: ['VFXManager (per-id ObjectPool)', 'IVFXResourceManager (취득 seam)', 'AddressablesVFXResourceManager (ref-count + idle 30s)', 'VFXInstance (자기 반환)', 'VFXHandle (id-only)'],
      mermaid: `graph LR
    HIT["피격<br/>Health.OnDamaged"]
    MGR["VFXManager<br/>CanPlay 게이트"]
    POOL["per-id ObjectPool"]
    INST["VFXInstance<br/>입자 종료→자기 반환"]
    RES["IVFXResourceManager"]
    ADDR["Addressables<br/>async · ref-count · idle 30s"]

    HIT -->|PlayOneShot| MGR
    MGR -->|pool.Get| POOL --> INST
    MGR -.TryGet / LoadAsync.-> RES --> ADDR
    INST -->|종료| POOL

    classDef a fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef b fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class HIT,INST a
    class MGR,POOL b
    class RES,ADDR c`,
      ascii: {
        title: 'async 로드 — 캐시/in-flight 합류',
        intro: '재로드 회피 + 중복 로드 방지. 풀 미준비 시에도 게임플레이는 블록되지 않음.',
        code: `// 캐시 hit → idle 취소 + ref++ (재로드 회피)
if (_handleByEntry.TryGetValue(entry, out var cached) && cached.Prefab != null) {
    CancelIdle(cached); cached.RefCount++; return cached.Prefab;
}
// 진행 중 로드가 있으면 합류 (중복 op 방지, 핸들 1개)
if (!_inFlightByEntry.TryGetValue(entry, out var loadTask)) {
    loadTask = LoadAndStore(entry, ct).Preserve();
    _inFlightByEntry[entry] = loadTask;
}
GameObject loaded = await loadTask;`,
        result: '풀 cap 32 · idle release 30s · poolWarmup 4 · prewarm 2/프레임.',
      },
    },

    /* ─── 4.2 Sound ─────────────────────────────────────── */
    {
      no: '4.2',
      kind: 'SYSTEM',
      title: '사운드 시스템 — VFX와 동일 seam (취득 책임 분리)',
      lede: '키 기반 사운드 god-class에서 취득 책임만 인터페이스로 분리하고, 로드 방식을 카테고리와 직교하는 LoadMode 데이터 축으로. SFX 동기 응답성 보존 + BGM async.',
      problem:
        '구버전은 모든 클립을 메모리 상주(Direct only)하는 god-class였다. BGM까지 상주하면 메모리 낭비, ' +
        '그렇다고 전부 async로 바꾸면 SFX의 동프레임 응답성이 깨진다.',
      decision:
        '취득(load/release) 책임만 `ISoundResourceManager`로 분리하고, 로드 방식을 카테고리와 **직교**하는 `LoadMode{Direct, Addressable}` 축으로 데이터화. ' +
        'Direct=동기 메모리 상주(SFX), Addressable=async 로드+해제(BGM, ref-count + idle 30s). ' +
        'SoundManager는 sync/async 여부를 모른 채 인터페이스에 위임 — VFX와 같은 설계 원칙.',
      results: [
        'SFX 동프레임 응답성 보존(TryGetClip 캐시 hit) + BGM async 로드/해제로 메모리 절약',
        '`[FormerlySerializedAs]`로 기존 SO 직렬화 무손실 마이그레이션 + 신규 PlayMode 테스트',
        '엔진 비종속 독립 패키지(asmdef) — 미래 엔진 리소스매니저 교체 seam 확보',
      ],
      stack: ['ISoundResourceManager (취득 seam)', 'LoadMode{Direct, Addressable} (직교 축)', 'UniTask BGM 크로스페이드(취소 가능)', 'ref-count + idle 30s'],
      ascii: {
        title: 'ISoundResourceManager — 취득 + 수명 seam',
        intro: 'SoundManager는 sync/async를 모르고 인터페이스에 위임. (VFX의 IVFXResourceManager와 동형)',
        code: `public interface ISoundResourceManager {
    bool TryGetClip(SoundClip c, out AudioClip clip);          // Direct/캐시 → 동기 true
    UniTask<AudioClip> LoadAsync(SoundClip c, CancellationToken ct); // Addressable → async(ref++)
    void Release(SoundClip c);      // ref-- → 0이면 idle 30s 후 해제
    void ForceUnload(SoundClip c);  // 누수 복구 최후수단
    void ReleaseAll();
}`,
        result: '"변하는 이유가 다른 책임은 가른다" — 재생 정책 vs 클립 취득. VFX·Sound에 일관 적용.',
      },
    },

    /* ─── 4.3 Geometry ──────────────────────────────────── */
    {
      no: '4.3',
      kind: 'SYSTEM',
      title: '자체 2D 기하 판정 — 물리 엔진 0, 결정론',
      lede: '정밀 판정이 불필요한 게임 특성을 trade-off 판단. Unity 물리 엔진을 버리고 원/캡슐 기하 + 제곱거리 + I-Frame으로 결정론적 무중복 판정.',
      problem:
        'Unity 물리 엔진은 다수 객체 시나리오에서 오버헤드가 크고, 내부 상태에 의존해 프레임률이 흔들리면 결과가 달라진다(비결정성). ' +
        '하지만 이 게임은 정밀 충돌이 중요치 않다.',
      decision:
        '물리 엔진을 쓰지 않고 **2D 원(circle) 기하 월드**(`GeoWorldRegistry`)를 직접 구성. 적은 `OnEnable/OnDisable`에 자기 등록. ' +
        '매프레임 블레이드 원은 `OverlapCircle`, 대시는 시작→끝 **캡슐 1회 스윕**(같은 적 무중복), 능력은 광역 원. ' +
        '판정은 `Geo2D` 순수 수학(제곱거리, sqrt 없음), 무중복은 `Health`의 **I-Frame self-throttle**로 — resolver별 부기 없이 보장.',
      results: [
        '물리 엔진 의존 0 — 다수 객체 동시 이동에도 결정론적 · GC-free(버퍼 preallocated)',
        '대시 캡슐 스윕 1회로 같은 적 무중복, I-Frame으로 프레임 간 무중복',
        '⚠️ 현재는 평면 선형 스캔 O(n) + 제곱거리 + (스윕 한정) AABB 브로드페이즈 — 그리드/쿼드트리 아님(향후 과제)',
      ],
      stack: ['Geo2D (원-원 / 원-캡슐 / 점-선분, 제곱거리)', 'GeoWorldRegistry (HashSet, GC-free)', 'OverlapCircle / OverlapCapsuleBundle(+AABB)', 'Health I-Frame (결정론 무중복)'],
      mermaid: `graph TB
    BODY["GeoBodyMB<br/>OnEnable/Disable 자기 등록"]
    WORLD["GeoWorldRegistry<br/>선형 스캔 + 제곱거리 + AABB 브로드페이즈"]
    GEO["Geo2D (순수 수학)"]
    BLADE["BodyContact<br/>매프레임 원"]
    DASH["DashSweep<br/>대시 캡슐 1회"]
    BH["BlackHole<br/>광역 원"]
    HP["Health<br/>I-Frame 무중복"]

    BODY -->|등록| WORLD
    BLADE -->|OverlapCircle| WORLD
    DASH -->|OverlapCapsuleBundle| WORLD
    BH -->|OverlapCircle| WORLD
    WORLD --> GEO
    WORLD -->|hits| HP
    HP -.I-Frame 게이트.-> BLADE

    classDef a fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef b fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class BODY,WORLD b
    class BLADE,DASH,BH a
    class GEO,HP c`,
      ascii: {
        title: '제곱거리 판정 + I-Frame 결정론',
        intro: 'sqrt 없는 원-원 판정, 부기 없는 무중복.',
        code: `// 원-원 — 제곱거리(sqrt 없음)
public static bool CircleOverlap(Vector2 c1, float r1, Vector2 c2, float r2) {
    float dx = c1.x - c2.x, dy = c1.y - c2.y, rs = r1 + r2;
    return (dx*dx + dy*dy) <= (rs*rs);
}
// I-Frame — resolver별 부기 없이 무중복
if (_iFrameRemaining > 0f) return false;
_iFrameRemaining = _iFrameDuration;`,
        result: 'hitRadius 0.5 · 버퍼 64/128 preallocated(GC-free) · DefaultExecutionOrder(20).',
      },
    },

    /* ─── 4.4 밸런싱 수학 모델 ──────────────────────────── */
    {
      no: '4.4',
      kind: 'SIMULATION',
      title: '밸런싱 수학 모델 — 골드 수급량의 단계적 추상화',
      lede: '"성장"과 "성장 체감"을 골드 수급량으로 정량화. 처치율 × 처치당 골드로 분해해, 노드 수치 변경이 성장 곡선에 즉시 환원되도록.',
      problem:
        '데모 밸런싱은 "감"으로 수치를 넣고 플레이로 확인 — 반복 비용이 크고 근거가 약하다. "성장이 잘 느껴지는가"는 주관적이라 측정 지표가 없었다.',
      decision:
        '**성장 = 런당 골드 수급량**, **성장 체감 = 스킬 투자 1회당 골드 증가분(ΔGold)** 으로 정량화. ' +
        '런타임 공식을 에디터에서 미러링한 시뮬레이터(`BalanceSimCore`)로 분해.',
      results: [
        '스킬 노드가 바꾸는 스탯 → 분해식 → 골드 수급량 / 성장 곡선으로 환원 (플레이 없이 검증)',
        '5종 공격원별 골드 기여 분리 · 레벨 진행(levelCap 20) · 적 동시 상한(reachCap 500) 미러링',
      ],
      stack: ['BalanceSimCore (런타임 공식 미러링)', 'GrowthSimulator (런 단위 곡선)', 'ROI / 최저가 구매 정책'],
      ascii: {
        title: '골드 수급량 분해식',
        intro: '노드가 바꾸는 스탯이 아래 식을 타고 골드 수급량 → 성장 곡선으로 환원.',
        code: `런당 기대 골드
  E = Σ_level  killRate(level) × kills(level) × goldPerKill(level)

처치율 (kills/sec)
  killRate(h) = Σ_source  freq × reach × min(1, dmg / h)
  reach       = max(1, range^exp × hitWeight)   // 화면 내 적 수로 상한
  source ∈ { 평타, 대시, 블랙홀, 직선청소, 연쇄번개 }

스탯 해석 (런타임 미러링)
  stat = (base + Σ add×level) × (1 + Σ mul×level)`,
        result: '"골드 = 골드 리소스 × 리소스 획득량" 직관을 처치율 × 처치당 골드로 구체화.',
      },
    },

    /* ─── 4.5 스킬트리 에디터 + ES ──────────────────────── */
    {
      no: '4.5',
      kind: 'TOOL',
      title: '스킬트리 에디터 — 시뮬 통합 + ΔGold 분석 + 자동 탐색',
      lede: '팀원의 그래프 에디터 위에 사용성 · 수치 역직렬화 · 시뮬레이션을 추가. ΔGold 폭등 분석으로 초기 과성장을 잡고, ES로 목표 곡선을 자동 추종.',
      problem:
        '편집 도구(그래프 에디터)는 있었지만 밸런싱 수치를 불러오거나 결과를 시뮬레이션할 수단이 없었다. 초기 빌드는 성장이 과했는데 어느 구간이 과한지 짚을 방법이 없었다.',
      decision:
        '팀원 그래프 에디터에 **사용성 개선**(복사/삭제 단축키) + **밸런싱 수치 역직렬화**(`BaseConfig`·`RewardCatalog`를 시뮬 입력으로) + ' +
        '**시뮬 통합**(성장 곡선 · 노드 기여 히트맵 · write-back). **ΔGold 폭등 지점 분석**(런별 골드 증가량 · Δln)으로 과성장 식별. ' +
        '목표 곡선을 주면 노드 파라미터를 **진화 전략(μ+λ ES, runs 90 · iterations 64 · λ128)** 으로 자동 튜닝.',
      results: [
        '성장 곡선을 *부드럽게* 가 아니라 **급등 포인트 몇 개**를 둔 형태로 의도적 설계',
        'ΔGold 폭등 분석으로 초기 과성장 식별 → 밸런싱 → "훨씬 좋아졌다" 평',
        '편집 결과를 SkillData SO · Config로 write-back → 인게임 즉시 반영',
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
      ['대량 이펙트',     'async 풀 + 취득 seam(ref-count·idle 30s·in-flight 합류) → 핫패스 할당 0, 끊김 없음'],
      ['설계 일관성',     '동일 seam 패턴을 VFX·Sound 양쪽에 (취득 책임 분리 + LoadMode 직교)'],
      ['피격 판정',       '물리 엔진 0 · 자체 2D 원 기하 · 제곱거리 + AABB 브로드페이즈 · I-Frame 결정론'],
      ['성장 정량화',     '성장 = 런당 골드 수급량 · 성장 체감 = ΔGold (투자 1회당 증가분)'],
      ['초기 과성장 수정', 'ΔGold 폭등 지점 분석(런별 골드 증가량 · Δln)으로 식별 → 밸런싱 → "훨씬 좋아졌다" 평'],
      ['수치 자동 탐색',   '목표 곡선 → ES(μ+λ, runs 90 · λ128)로 노드 파라미터 자동 튜닝'],
    ],
  },
};
