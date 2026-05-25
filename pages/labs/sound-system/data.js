// pages/labs/sound-system/data.js
// LAB · 07 — Sound System (Chul.SoundSystem). 키 기반 사운드 god-class에서 취득 책임만
// 인터페이스로 분리하고 로드 방식을 직교 데이터 축(LoadMode)으로 빼낸 재사용 패키지.
// Wobble Wobble(BadeulBadeul.SoundSystem) → CursorBlade 이식·async 개선.
// 시각 자산 없음 — HERO 는 저수준 모듈 아키텍처 다이어그램(heroMermaid). Schema 는 다른 Lab 과 동일.

window.SOUND_SYSTEM_DATA = {
  // Evidence(메트릭)를 Context 바로 뒤(§02)로 끌어올림. 기본 페이지는 미설정 → 현행 순서 유지.
  evidenceFirst: true,

  meta: {
    eyebrow: 'LAB · 07 ─ System / Reusable Package',
    code: 'LAB · 07',
    date: '2026.05',
    title: 'Sound System — 취득 책임만 떼어낸 재사용 사운드 패키지',
    oneLine:
      '키 기반 사운드 god-class에서 클립 취득(load/release) 책임만 인터페이스로 분리하고, ' +
      '로드 방식을 카테고리와 직교하는 `LoadMode` 축으로 데이터화 — ' +
      'SFX 동기 응답성을 보존한 채 BGM async 로드/해제 + 엔진 교체 seam 을 동시에 확보.',
    weeks: '재사용 패키지 · 이식 + async 개선',
    team: '1 인 (전 영역 본인)',
    role: '설계 + 구현 + 테스트',
    platform: 'Unity 6.1 LTS · URP · C# 10',
  },

  // HERO — 저수준 모듈 아키텍처 (클래스/파일 단위 의존)
  heroMermaid: `graph LR
    subgraph CONTENT["컨텐츠 트리거 (불변)"]
        ST["SoundTrigger"]
        STB["SoundTriggerForBGM"]
        STN["SoundTriggerForButton"]
        SCT["SoundCollisionTriggerAdvanced"]
    end
    subgraph CORE["SoundManager (싱글턴)"]
        SM["SoundManager"]
        GATE["CanPlay<br/>cooldown · maxConcurrent"]
        POOL["ObjectPool&lt;AudioSource&gt;"]
        BGM["BGM Source A / B<br/>크로스페이드"]
    end
    subgraph RES["취득 seam (신규)"]
        IF["ISoundResourceManager<br/>TryGetClip · LoadAsync · Release"]
        IMPL["AddressablesSoundResourceManager"]
        HD["Handle<br/>Op · Clip · RefCount · IdleCts"]
    end
    subgraph DATA["데이터 (SO / 직렬화)"]
        LIB["SoundLibrarySO"]
        ENT["SoundEntry<br/>key · category · 정책"]
        CLIP["SoundClip<br/>loadMode · directClip · assetRef"]
        ENUM["enums<br/>LoadMode · SoundMode · SoundCategory"]
    end
    ST --> SM
    STB --> SM
    STN --> SM
    SCT --> SM
    SM --> GATE
    SM --> POOL
    SM --> BGM
    SM -->|위임| IF
    IF -. implements .- IMPL
    IMPL --> HD
    SM --> LIB
    LIB --> ENT
    ENT --> CLIP
    CLIP --> ENUM
    IMPL -->|loadMode 분기| CLIP
    classDef content fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef core fill:#e6efdf,stroke:#7ea571,color:#1f3a18
    classDef res fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef data fill:#f6ddd2,stroke:#c97a5f,color:#3a1f15
    class ST,STB,STN,SCT content
    class SM,GATE,POOL,BGM core
    class IF,IMPL,HD res
    class LIB,ENT,CLIP,ENUM data`,

  heroMetrics: [
    { n: '1',     label: '신규 인터페이스 seam',      sub: 'ISoundResourceManager — sync/async 은닉' },
    { n: '2',     label: '직교 LoadMode',             sub: 'Direct 동기 상주 · Addressable async' },
    { n: '30 s',  label: 'idle 지연 해제',            sub: 'ref==0 후 재요청 시 재로드 회피' },
    { n: '84 +3', label: '테스트 (구 84 + Addr 3)',   sub: '구조 계약 + async 로드 경로' },
  ],

  facts: [
    ['한 줄 정의', '키 기반 사운드 시스템에서 취득 책임만 인터페이스(`ISoundResourceManager`)로 분리 + 로드 방식 `LoadMode` 직교 데이터화'],
    ['계보',     'Wobble Wobble `BadeulBadeul.SoundSystem` (Direct 전용, 84 테스트) → CursorBlade `Chul.SoundSystem` 이식 + async 개선'],
    ['엔진',     'Unity 6.1 LTS · URP · C# 10'],
    ['의존',     'UniTask · Unity.Addressables 2.9.1 · UniTask.Addressables (엔진 비종속 독립 패키지)'],
    ['팀 구성',   '1 인 — 프로젝트 간 재사용 패키지'],
    ['본인 역할', '전 영역 (설계 + 구현 + 테스트)'],
    ['기술 태그', 'Interface Seam · Async Loading · Ref-Count Lifetime · Data-Oriented · Migration-Safe'],
    ['산출물',   '신규 인터페이스 1 + 구현체 1 + `LoadMode` 데이터 축 + Addressable PlayMode 테스트 3'],
  ],

  roles: {
    mine:
      '전 영역 본인. ISoundResourceManager 취득 seam (god-class에서 load/release 책임만 추출) · ' +
      'LoadMode 직교 데이터화 (`SoundClip` 에 loadMode/directClip/assetRef) · ' +
      'AddressablesSoundResourceManager (async 로드 + ref-count + idle 30s 지연 해제 + 취소) · ' +
      'BGM 경로 async 화 (코루틴 → UniTask, 최신 요청 우선) · ' +
      'SFX 동기 응답성 보존 (TryGetClip 동프레임 / 미로드 Addressable 만 폴백) · ' +
      '무손실 마이그레이션 (`[FormerlySerializedAs("clip")]`) · ' +
      'Addressable PlayMode 테스트 3 신규.',
    others:
      '외부 라이브러리 — UniTask (Cysharp, MIT) · Unity Addressables / ResourceManager (Unity). ' +
      '재생 정책·풀·믹서·SoundMode 등 코어 골격은 구버전(Wobble Wobble) 에서 본인이 구축한 것이며, ' +
      '본 페이지는 그 위에 얹은 취득 분리 + async 개선분에 집중한다.',
  },

  systems: [
    /* ─── 3.1 취득 책임 분리 (seam) ─────────────────────────── */
    {
      no: '3.1',
      kind: 'ARCHITECTURE',
      title: '취득 책임만 인터페이스 뒤로 — SoundManager 는 sync/async 를 모른다',
      lede:
        '재생 정책(크로스페이드 · 게이트 · 풀)과 클립 취득(load/release)은 변하는 이유가 다르다. ' +
        '취득만 `ISoundResourceManager` 뒤로 숨기면 정책 코드는 AudioClip 을 어떻게 얻는지 알 필요가 없다.',
      problem:
        '구버전은 모든 AudioClip 을 메모리 상주(Direct) 시키는 god-class 였다. ' +
        'SFX 응답성은 좋지만 대용량 BGM 까지 상주해 메모리 압박. ' +
        '다음 프로젝트에서 SFX 는 동프레임 즉시 재생(상주) · BGM 은 필요 시 async 로드/해제 두 요구가 충돌. ' +
        '카테고리로 "BGM=async" 묶으면 정책과 취득이 다시 강결합 된다.',
      decision:
        '취득(load/release)만 POCO 인터페이스 `ISoundResourceManager` 로 추출. ' +
        'SoundManager 는 `TryGetClip` (동기 시도) → 실패 시 `LoadAsync` (폴백) 로 위임만 하고 ' +
        'sync/async 여부를 알지 못한다. ' +
        '미래 엔진 리소스매니저 도입 시 다른 구현체로 교체 — 인터페이스 불변.',
      results: [
        'SoundManager 가 취득 방식과 무관 — 재생 정책 코드 변경 0',
        '엔진 리소스매니저 교체 seam 확보 (구현체만 교체)',
        'SFX 동기 / BGM async 를 한 코드 경로(`AcquireClipAsync`)로 처리',
        '구버전 재생 정책 · 풀 · 믹서 · 크로스페이드 전부 불변',
      ],
      stack: [
        'ISoundResourceManager : TryGetClip / LoadAsync / Release / ReleaseAll',
        'SoundManager → resMgr 위임 (sync/async 은닉)',
        'AcquireClipAsync: TryGetClip → 실패 시 LoadAsync',
        '구현체: AddressablesSoundResourceManager',
      ],
    },

    /* ─── 3.2 LoadMode 직교 데이터화 ────────────────────────── */
    {
      no: '3.2',
      kind: 'SYSTEM',
      title: 'LoadMode — 로드 방식을 카테고리와 직교하는 데이터 축으로',
      lede:
        '"BGM=async, SFX=sync" 로 카테고리에 묶으면 정책과 취득이 재결합 된다. ' +
        '로드 방식을 클립 고유 속성으로 빼면 둘은 독립적으로 변한다.',
      problem:
        '취득 방식을 카테고리로 결정하면 — 작은 BGM 도 강제 async, 큰 SFX 도 강제 상주. ' +
        '정책(카테고리)과 취득(로드 방식)이 한 축에 묶여 한쪽 변경이 다른 쪽을 끌고 간다.',
      decision:
        '`LoadMode{Direct, Addressable}` 를 SoundClip 고유 필드로 분리 — 카테고리와 직교. ' +
        '`directClip` (Direct) · `assetRef : AssetReferenceT<AudioClip>` (Addressable) 를 함께 두고 ' +
        '`HasClip` 으로 모드별 취득 가능성 판정. ' +
        '→ BGM 도 작으면 Direct, SFX 도 크면 Addressable 자유 조합.',
      results: [
        '정책 ↔ 취득 결합 제거 — 카테고리와 로드 방식 독립',
        '클립 단위로 Direct / Addressable 자유 선택',
        '`HasClip` 이 모드별 취득 가능성 판정 — 무음 안전',
        '데이터(인스펙터)만으로 로드 전략 전환 — 코드 변경 0',
      ],
      stack: [
        'enum LoadMode { Direct, Addressable }  // SoundCategory.cs',
        'SoundClip.loadMode / directClip / assetRef',
        'HasClip => Direct ? directClip!=null : assetRef.RuntimeKeyIsValid()',
        'SoundEntry 정책 필드(cooldown/maxConcurrent/spatial) 불변',
      ],
    },

    /* ─── 3.3 ref-count + idle 지연 해제 ────────────────────── */
    {
      no: '3.3',
      kind: 'SYSTEM',
      title: 'ref-count + idle 지연 해제 — 해제 타이밍 ≠ 참조 종료',
      lede:
        'Addressable 클립을 ref==0 즉시 해제 하면 BGM 왕복 같은 잦은 재요청 마다 재로드 비용. ' +
        '참조 종료 와 실제 해제 를 분리한다.',
      problem:
        'async 로드한 클립을 참조 0 이 되는 순간 해제 하면, ' +
        '메뉴↔전투 BGM 왕복처럼 짧은 간격 재요청 에서 매번 재로드 — load hitch 반복. ' +
        '반대로 해제를 안 하면 메모리가 다시 쌓인다.',
      decision:
        'ref-count + idle 30 초 지연 해제. `Release` 는 ref-- 만, 0 도달 시 즉시 해제하지 않고 ' +
        '`UniTask.Delay(30s, UnscaledDeltaTime)` 대기 후 `Addressables.Release`. ' +
        '대기 중 재요청 되면 타이머 취소 + ref++ 재사용 (재로드 회피). ' +
        '종료 시 `ReleaseAll` 이 전 핸들 정리.',
      results: [
        '잦은 BGM 왕복 에서 재로드 0 (idle 윈도우 내 캐시 재사용)',
        'idle 만료 + ref==0 → 실제 해제 로 메모리 회수',
        '취소 안전 — lifetime 토큰 linked CTS, 파괴 시 ReleaseAll 위임',
        '해제 타이밍을 정책화 — 참조 종료와 분리',
      ],
      stack: [
        'Release: refCount-- → 0 이면 StartIdleRelease().Forget()',
        'StartIdleRelease: UniTask.Delay(30s) → Addressables.Release',
        'CancelIdle + refCount++ : 대기 중 재요청 시 재사용',
        'ReleaseAll: 종료 시 전 핸들 즉시 해제',
      ],
      ascii: {
        title: '보조 — idle 지연 해제 (C#)',
        intro:
          '참조 종료(`Release`)와 실제 해제(`Addressables.Release`)를 30 초 윈도우로 분리. ' +
          '대기 중 재요청은 타이머 취소 + ref++ 로 흡수해 재로드를 막는다.',
        code: `// AddressablesSoundResourceManager (요약)
public void Release(SoundClip clip) {
    if (clip.loadMode == LoadMode.Direct) return;     // Direct 무동작
    if (!_handleByClip.TryGetValue(clip, out var h)) return;
    if (--h.RefCount > 0) return;                      // 아직 참조 중
    StartIdleRelease(clip, h).Forget();               // ref==0 → idle 대기
}

async UniTaskVoid StartIdleRelease(SoundClip clip, Handle h) {
    h.IdleCts = LinkedCts(_lifetimeToken);
    try { await UniTask.Delay(30s, UnscaledDeltaTime, h.IdleCts.Token); }
    catch (OperationCanceledException) { return; }     // 재요청/종료 → 유지
    if (h.RefCount > 0) return;                        // 대기 중 재사용됨
    Addressables.Release(h.Op);                        // 실제 해제
    _handleByClip.Remove(clip);
}`,
        result: 'BGM 왕복 같은 짧은 재요청은 idle 윈도우 안에서 재로드 없이 재사용, 진짜 안 쓰면 30 초 뒤 회수.',
      },
    },

    /* ─── 3.4 이중 경로 + 무손실 마이그레이션 ──────────────── */
    {
      no: '3.4',
      kind: 'SYSTEM',
      title: '동기/비동기 이중 경로 + 기존 에셋 무손실 마이그레이션',
      lede:
        'SFX 가 Addressable 이어도 동프레임 재생 이 깨지면 안 된다. ' +
        '그리고 기존 SO 에셋 의 클립 할당이 필드명 변경으로 유실되면 안 된다.',
      problem:
        'async 를 도입하면 모든 재생이 await 로 한 프레임 밀릴 위험 — SFX 타격감 저하. ' +
        '또한 `clip` → `directClip` 필드명 변경 시 구버전 SO 에셋의 인스펙터 할당이 0 으로 역직렬화 되어 무음 발생.',
      decision:
        '이중 경로 — `TryGetClip` 동기 성공(Direct/캐시) 이면 동프레임 재생, ' +
        '미로드 Addressable 만 `LoadAsync` 폴백. 첫 로드 후엔 캐시 hit 로 다시 동기. ' +
        '`[FormerlySerializedAs("clip")]` 로 구 `clip` 직렬화를 `directClip` 으로 무손실 승계. ' +
        '신규 Addressable PlayMode 테스트 3 으로 로드/전환/캐시 검증.',
      results: [
        'SFX 동프레임 재생 보존 — 첫 로드만 async, 이후 캐시 동기',
        '구버전 SO 에셋 재할당 0 — `[FormerlySerializedAs]` 무손실 승계',
        'BGM 전환 중 취소/실패 시 미커밋 클립 ref 환원 — 누수 차단',
        '구 84 테스트 유지 + Addressable PlayMode 3 신규',
      ],
      stack: [
        'PlayPooled: TryGetClip(동기) ? Immediate : PlayPooledAsync(폴백)',
        'PlayBgmAsync → AcquireClipAsync: TryGetClip → LoadAsync',
        '[FormerlySerializedAs("clip")] public AudioClip directClip',
        'AddressableSoundTests: 로드+재생 / Addr→Direct 전환 / LoadAsync→캐시hit',
      ],
    },
  ],

  metrics: {
    title: '결과 — 구버전(Direct 전용 god-class) vs 개선판',
    headers: ['지표', '구버전 (BadeulBadeul.SoundSystem)', '개선판 (Chul.SoundSystem)'],
    rows: [
      ['클립 취득',        'SoundManager 내부 directClip 직접 사용',        '`ISoundResourceManager` 위임 (sync/async 은닉 seam)'],
      ['로드 방식',        '전부 메모리 상주 (Direct only)',               '`LoadMode` 직교 축 — Direct / Addressable 클립 단위 선택'],
      ['BGM',             '코루틴 크로스페이드',                          'UniTask async 로드 + 크로스페이드 (최신 요청 우선)'],
      ['수명 관리',        '없음 (전부 상주)',                            'ref-count + idle 30s 지연 해제 + 캐시 재사용'],
      ['SFX 응답성',       '동프레임 (상주)',                             '동프레임 보존 (TryGetClip 캐시, 첫 로드만 폴백)'],
      ['에셋 마이그레이션', '-',                                          '`[FormerlySerializedAs]` 무손실 승계'],
      ['패키지 경계',      '게임 종속',                                   'UniTask/Addressables 참조, 엔진 비종속'],
      ['테스트',          '84 (데이터 13 · 런타임 29 · 구조 42)',         '84 + Addressable PlayMode 3 (로드/전환/캐시)'],
    ],
  },
};
