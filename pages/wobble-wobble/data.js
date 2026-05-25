// pages/wobble-wobble/data.js
// Wobble Wobble — 5주 압축 출시 / 다축 프로젝트.
// Source: uploads/wobble-wobble.md. Schema mirrors CARTAPLI_DATA — see SESSION_MEMORY.md §3.
// Mermaid classDef 들은 Notebook 토큰 팔레트 안에서 5 swatch (sage / terra / wheat / dusty / plum) 로만 칠한다.

window.WOBBLE_DATA = {
  evidenceFirst: true, // Evidence(메트릭)를 Context 바로 뒤(§02)로
  meta: {
    code: 'MAIN · 02',
    date: '2026.04',
    title: 'Wobble Wobble',
    oneLine: '게임랩 빌드를 5주 안에 Steam 글로벌 출시까지 가져간 3D 물리 조작 퍼즐.',
    period: '2026.03 – 2026.04',
    weeks: '5 weeks',
    team: '5 인',
    role: 'PM + 개발 + 자동화 툴 엔지니어',
    platform: 'Steam + STOVE (글로벌, 2026.04)',
    steam: 'https://store.steampowered.com/app/4529820/_/',
    stove: 'https://store.onstove.com/games/104370',
    stack: ['Unity 6', 'C#', 'Claude Code', 'MCP', 'Google Apps Script', 'Google Sheets'],
  },

  // 4 hero metrics
  heroMetrics: [
    { n: '5 주',  label: '압축 출시',          sub: '준비 4주 + 출시 1주 · Day 7 업데이트 포함' },
    { n: '84',    label: '사운드 시스템 테스트', sub: '데이터 13 + 런타임 29 + 구조 42' },
    { n: '14',    label: '자동 번역 언어',      sub: '프레스킷 14언어 · MCP 자율 도입' },
    { n: '~200',  label: '컨택 캠페인',        sub: '스트리머 · 미디어 · 큐레이터 누적' },
  ],

  // Project facts ledger
  facts: [
    ['한 줄 정의', '게임랩 빌드를 5주 안에 Steam 글로벌 출시까지 가져간 자체 퍼블리싱 3D 물리 조작 퍼즐'],
    ['기간',      '2026.03 – 2026.04 (5주: 출시 준비 4주 + 출시 1주)'],
    ['팀 구성',    '5 인'],
    ['본인 역할',  'PM + 개발자 + 자동화 툴 엔지니어'],
    ['스택',      'Unity 6 · C# · Claude Code · MCP · Google Apps Script · Google Sheets'],
    ['장르',      '3D 물리 조작 퍼즐'],
    ['가격',      '$1.99'],
    ['출시 플랫폼','Steam (글로벌) + STOVE (한국)'],
    ['출시일',    '2026.04.10'],
  ],

  // Role split
  roles: {
    mine: 'PM 총괄 · 게임 재제작(스테이지 5종 직접 개발 — 툴박스 · 경복궁 · 키보드 · 남산타워 · 자유의 여신상) · 사운드 시스템 전체 · LogSystem · 자동화 툴 인프라 전체(번역 · SOP · 발송 · 트래킹) · 홍보 운영.',
    others: '본인 5종 외 스테이지 약 15종, 모델링·UI 일부는 팀 다른 4명 분담.',
  },

  // ─── Systems (§3)
  systems: [
    /* ─── 3.1 압축 출시 ──────────────────────────────────────── */
    {
      no: '3.1',
      kind: 'TIMELINE',
      title: '5주 압축 출시 — 다중 워크스트림 동시 운영',
      lede: '명확한 외부 마감(Steam 출시일)에 맞춰 5인 팀의 4개 이상 워크스트림을 동시 진행.',
      problem: '게임랩 종료 직후, 출시 준비 4주 + 출시 1주만 남은 일정에서 개발 · 모델링 · UI · 홍보가 동시 에 진행되어야 한다. 워크스트림이 서로 막히면 외부 마감이 그대로 깨진다.',
      decision: '본인이 PM 역할로 일정/태스크/이벤트 운영을 총괄. 게임랩 다주차의 PM 경험을 출시 운영 PM 으로 직접 연결. 본인은 동시에 개발(스테이지 4종 + 사운드 + Log) + 자동화 인프라 + 홍보 운영 다역 수행. 워크스트림 간 의존성은 사전 동기화 시점만 잡고 나머지는 병렬.',
      results: [
        '목표 출시일 정확히 출시 · Day 7 업데이트까지 5주 안에 완료',
        '4개 이상 워크스트림 (개발/모델링/UI/홍보) 동시 운영',
        '게임랩 PM 경험을 출시 운영 PM 으로 무손실 이전',
      ],
      mermaid: `gantt
    title 5주 압축 출시 타임라인
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 개발
    게임 재제작 (스테이지 4종 + UI/UX 개편)   :dev1, 2026-03-09, 28d
    사운드 시스템 / LogSystem                 :dev2, 2026-03-09, 21d
    section 자동화 인프라
    Claude Code + MCP 도입                    :auto1, 2026-03-09, 14d
    14언어 번역 파이프라인                     :auto2, 2026-03-16, 14d
    홍보 SOP→Skill / GAS+Sheets 발송 인프라    :auto3, 2026-03-16, 14d
    section 홍보
    Steam 상점 오픈 / ~200곳 컨택 캠페인      :promo1, 2026-03-23, 21d
    section 출시
    Steam 글로벌 출시                          :milestone, m1, 2026-04-10, 0d
    Day 7 업데이트                              :milestone, m2, 2026-04-17, 0d`,
    },

    /* ─── 3.2 게임 재제작 ─────────────────────────────────────── */
    {
      no: '3.2',
      kind: 'PRODUCT',
      title: '게임 재제작 — 스테이지 4종 + 핵심 재미 기준 폐기',
      lede: '게임랩 빌드(badulbadul2)에서 핵심 메카닉만 유지, 모델링·UI·UX 전면 개편으로 사실상 재제작.',
      problem: '게임랩 빌드의 모든 스테이지를 그대로 가져가면 핵심 재미 경험 이 옅어진다. 게임랩에서 도출한 원칙 — "핵심 재미 경험을 유지하지 못하는 확장은 게임을 악화시킨다" — 을 출시 빌드에도 적용해야 한다.',
      decision: '핵심 재미 경험을 "조작을 통해 스스로 유발한 긴장감 속에서 폭탄 제거" 로 정의. 이 기준 미달 스테이지는 폐기. 본인 직접 개발 스테이지 5종: 툴박스 · 경복궁 · 키보드 · 남산타워 · 자유의 여신상.',
      results: [
        '본인 개발 스테이지 5종 출시 빌드 포함',
        '모델링 / UI / UX 전면 개편',
        '핵심 재미 기준 미달 스테이지 폐기로 출시 빌드 밀도 보존',
      ],
      fsmTrail: ['게임랩 빌드', '핵심 메카닉 유지', '재미 기준 통과 스테이지', '재제작·전면 개편', '출시 빌드'],
    },

    /* ─── 3.3 사운드 시스템 ───────────────────────────────────── */
    {
      no: '3.3',
      kind: 'SYSTEM',
      title: '사운드 시스템 — 사용성 · 확장성 · 성능 3차원 동시 달성',
      lede: '본 프로젝트에서 가장 깊이 작업한 단일 시스템. 네임스페이스 `BadeulBadeul.SoundSystem`. 디자이너가 코드 0줄로 운영.',
      problem: '호출부가 `AudioSource` 를 직접 다루면 결합도가 오르고 GameObject 생성·파괴 비용이 든다. 버튼/BGM/충돌 등 트리거 패턴이 다양 해 일관 추상화가 필요. 동시 발음 제어 부재 시 충돌음·발소리가 폭주하고, 첫 재생에는 Instantiate 레이턴시가 보인다. 게다가 볼륨 저장 책임을 사운드 시스템 안에 두면 저장 방식 변경(PlayerPrefs → JSON → 서버) 시 사운드 코드 전체가 흔들린다.',
      decision: '3+1 레이어 로 책임을 분리. Data Layer (ScriptableObject 컨테이너 — SoundLibrarySO · SoundEntry · SoundClip) + Runtime Core (SoundManager 싱글톤 + Dictionary O(1) 캐시 + ObjectPool + BGM A/B 크로스페이드 + 정책 게이트) + Trigger Layer (디자이너용 SoundTrigger 4 종) + Unity AudioMixer/AudioSource. 정책(cooldown · maxConcurrent · MaxCountPolicy)을 데이터로 표현해 디자이너가 인스펙터에서 튜닝. 볼륨 저장/로드는 외부 `SettingsManager` 책임으로 분리.',
      results: [
        '디자이너 코드 0줄로 운영 — SoundLibrarySO 등록 + SoundTrigger 부착',
        '호출자가 AudioSource 직접 안 다룸. `Play("key")` 한 줄로 끝',
        'AudioSource Pre-warm 으로 첫 재생 Instantiate 부하 0',
        '풀 재사용으로 GameObject 생성·파괴 0. 풀 크기는 SoundLibrary 개수 무관, 동시 재생 수만큼만',
        '키 조회 O(1) · cooldown + maxConcurrent + MaxCountPolicy 로 발음 폭주 차단',
        '테스트 84개 — 데이터 무결성 13 + 런타임 동작 29 + 구조적 요구사항 42',
      ],
      stack: ['SoundLibrarySO · SoundEntry · SoundClip', 'SoundManager (DefaultExecutionOrder=-100)', 'ObjectPool<AudioSource>', 'BGM A/B 크로스페이드', 'AudioMixer (Master + 4 카테고리)', 'SoundTrigger / ForBGM / ForButton / CollisionAdvanced', 'Editor: SoundMixerSetup'],
      mermaid: `graph TB
    subgraph DATA["📦 데이터 레이어 — ScriptableObject"]
        SL["SoundLibrarySO<br/>(SoundEntry[] 컨테이너 · 복수 등록 가능)"]
        SE["SoundEntry<br/>키 · 카테고리 · 정책 · 공간 설정"]
        SC["SoundClip[]<br/>AudioClip + SoundMode 비트마스크"]
        SL --> SE --> SC
    end

    subgraph RUNTIME["⚙ 런타임 코어"]
        SM["SoundManager (싱글턴, DontDestroyOnLoad)<br/>DefaultExecutionOrder=-100"]
        DICT["Dictionary&lt;string, SoundEntry&gt; 캐시<br/>O(1) 조회"]
        POOL["ObjectPool&lt;AudioSource&gt;<br/>SFX/UI/Ambient · Pre-warm 8 / Max 16"]
        BGM["BGM Source A/B<br/>크로스페이드 (unscaledDeltaTime)"]
        POLICY["재생 정책 게이트<br/>cooldown · maxConcurrent · MaxCountPolicy"]
        SM --> DICT
        SM --> POOL
        SM --> BGM
        SM --> POLICY
    end

    subgraph TRIGGER["🎮 트리거 레이어 — 디자이너용"]
        T1["SoundTrigger (범용 · 6 종 트리거 타입)"]
        T2["SoundTriggerForBGM (크로스페이드 자동)"]
        T3["SoundTriggerForButton (UGUI Button.onClick 자동 연결)"]
        T4["SoundCollisionTriggerAdvanced (Impulse → 볼륨/피치 동적 변조)"]
    end

    subgraph MIXER["🔊 Unity Audio"]
        AM["AudioMixer (Master + BGM/SFX/UI/Ambient)<br/>Exposed Parameter (dB)"]
        AS["AudioSource"]
    end

    subgraph EDIT["🛠 에디터 도구"]
        ED["SoundMixerSetup<br/>(Tools > Sound > Validate AudioMixer)"]
    end

    DATA ==>|"로드"| RUNTIME
    TRIGGER ==>|"Play(key) / PlayOnSource"| RUNTIME
    RUNTIME ==> AM ==> AS
    ED -.->|"검증"| AM

    classDef data fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef core fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef trig fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef mix  fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    classDef ed   fill:#e6dded,stroke:#b9a3c7,color:#3a2840
    class SL,SE,SC data
    class SM,DICT,POOL,BGM,POLICY core
    class T1,T2,T3,T4 trig
    class AM,AS mix
    class ED ed`,
      tableTitle: '정책 (SoundEntry 필드 · 데이터로 표현)',
      table: {
        headers: ['필드', '효과', '예'],
        rows: [
          ['cooldownSeconds', '빠른 연타 방지. Time.unscaledTime 기준',         'UI 클릭 0.05s'],
          ['maxConcurrent',  '동시 재생 한도. -1 = 무제한',                     '폭발음 6'],
          ['maxCountPolicy', '한도 초과 시 동작',                                'Ignore · ReplaceOldest'],
          ['SoundMode',       '같은 키 · 상황별 다른 클립 (비트 플래그)',       'Normal · Streamer (저작권 회피)'],
        ],
      },
      ascii: {
        title: '보조 — 볼륨 아키텍처',
        intro: '책임 분리: SoundManager 는 볼륨 적용 만. 저장/로드는 외부 SettingsManager 책임. 저장 방식 변경 시 SoundManager 무수정.',
        code: `// linear 0~1 → dB
db = Log10(volume) * 20;
AudioMixer.SetFloat("Master_dB", db);

// 최종 출력 합성
finalVolume
  = AudioSource.volume
  = defaultVolume
  × volumeVariation_random
  × SoundClip_multiplier
  × external_caller_multiplier;

// AudioMixer dB × AudioSource.volume = 출력`,
        result: '저장 방식 변경 (PlayerPrefs → JSON → 서버) 시 SoundManager 무수정.',
      },
    },

    /* ─── 3.4 LogSystem ───────────────────────────────────────── */
    {
      no: '3.4',
      kind: 'OBSERVABILITY',
      title: 'LogSystem — 인터페이스 기반 출력 채널 추상화',
      lede: '출력 채널(파일/콘솔/원격)을 인터페이스 뒤로 숨겨 운영 중 채널 교체 무영향.',
      problem: '출시 후 운영 중에는 디버깅 채널이 바뀐다 — 로컬 파일 → 콘솔 → 원격 서버. 호출 코드가 채널을 직접 알면 매번 교체할 때마다 전체 호출부가 변경된다.',
      decision: '인터페이스 기반 으로 출력 채널 추상화 (`ILogChannel`). 호출자는 채널 종류를 모름. 단위 테스트 6종으로 동작 보장.',
      results: [
        '운영 중 채널 교체 시 호출 코드 무수정',
        '단위 테스트 6종 — 출시 후 디버깅·이슈 추적 신뢰도 확보',
      ],
    },

    /* ─── 3.5 자동화 인프라 ──────────────────────────────────── */
    {
      no: '3.5',
      kind: 'AUTOMATION',
      title: '자동화 인프라 — Claude Code + MCP 자율 도입',
      lede: '학습 자료 의존 없이 설계 단계부터 운영까지 혼자 끌고 감. 게임 코드 외 영역(번역·홍보·운영)에 적용.',
      problem: '5인 팀에 비기술 자동화 전담 인력이 없다. 5주 안에 14언어 번역 · 약 200곳 컨택 · 발송 트래킹 · 캠페인 운영을 수동으로 끌고 가는 건 불가능.',
      decision: 'Claude Code + MCP 자율 도입 — 학습 자료 없이 본인이 처음 도입. 번역 / 홍보 SOP / 발송 인프라 / 캠페인 운영 4영역에 적용. 홍보 메일 5단계 SOP 를 Claude Code Skill 4종으로 코드화. 발송은 Google Apps Script + Google Sheets 트래커. 출시 후, 만들어진 인프라를 `IndieGameAd` 별도 프로젝트로 분리 — 재사용 가능한 인디게임 출시 인프라 자산화.',
      results: [
        '비기술 자동화 전담 없이 자동화 인프라 4영역 구축',
        '5주 압축 일정 내 글로벌 첫 노출 확보',
        '매 캠페인마다 동일 프로세스를 Skill 호출로 재현 가능',
        '본 프로젝트 종속에서 분리된 독립 자산 확보 — 다음 인디게임 출시·홍보에 재사용',
      ],
      stack: ['sop-db-research', 'sop-group-contact', 'draft-mail', 'review-mail', 'send-mail.gs (GAS)', 'Google Sheets 트래커', 'IndieGameAd (분리 자산)'],
      mermaid: `graph LR
    subgraph TRANS["번역 파이프라인"]
        T1["원문 프레스킷"]
        T2["Claude Code + MCP<br/>14개 언어 번역"]
        T3["14언어 프레스킷"]
        T1 --> T2 --> T3
    end

    subgraph PROMO["홍보 메일 SOP (5 단계)"]
        P1["sop-db-research<br/>(컨택 DB 리서치)"]
        P2["sop-group-contact<br/>(그룹화)"]
        P3["draft-mail<br/>(초안 작성)"]
        P4["review-mail<br/>(리뷰)"]
        P5["발송 (Apps Script)"]
        P1 --> P2 --> P3 --> P4 --> P5
    end

    subgraph INFRA["발송·트래킹 인프라"]
        I1["send-mail.gs<br/>(Google Apps Script)"]
        I2["Google Sheets<br/>메일 트래커"]
        I1 --> I2
    end

    T3 -.->|"첨부"| P3
    P5 ==> I1

    subgraph CAMPAIGN["캠페인 운영 (이벤트 단위)"]
        C1["출시 직전"]
        C2["출시 직후"]
        C3["업데이트"]
    end

    I2 ==>|"~200 곳 컨택"| CAMPAIGN

    subgraph ASSET["자산화"]
        A1["IndieGameAd<br/>(별도 프로젝트로 분리 · 재사용 인프라)"]
    end

    INFRA -.->|"재사용 자산화"| A1
    PROMO -.->|"재사용 자산화"| A1

    classDef trans fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef promo fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef infra fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef camp  fill:#e6dded,stroke:#b9a3c7,color:#3a2840
    classDef asset fill:#ebe6da,stroke:#807a6e,color:#1f1d1a
    class T1,T2,T3 trans
    class P1,P2,P3,P4,P5 promo
    class I1,I2 infra
    class C1,C2,C3 camp
    class A1 asset`,
      tableTitle: '영역별 산출물',
      table: {
        headers: ['영역', '산출물', '수량'],
        rows: [
          ['번역 자동화', '프레스킷 자동 번역 파이프라인',     '14 언어'],
          ['홍보 메일 SOP', 'Claude Code Skill 4종으로 코드화', '5 단계 → 4 Skill'],
          ['발송 인프라',  'send-mail.gs + Sheets 트래커 연동',  '2 모듈'],
          ['수신처 규모',  '스트리머 · 미디어 · 큐레이터 DB',    '~200 컨택'],
          ['발송 운영',    '출시 직전 · 출시 직후 · 업데이트',    '이벤트 단위 캠페인'],
          ['자산화',       'IndieGameAd — 분리 인디게임 인프라',  '1 별도 프로젝트'],
        ],
      },
    },
  ],

  // Evidence — 정량 결과 (출시 시점 기준 정성 지표 + 인프라 산출물 합본)
  metrics: {
    title: '결과 메트릭 (출시 시점 기준 · 출시 후 지표는 사용자 제공 대기)',
    headers: ['지표', '값', '기준일'],
    rows: [
      ['출시 일정 준수',           '목표일 정확히 출시 + Day 7 업데이트',    '2026-04-17'],
      ['본인 개발 스테이지',        '5 종 (툴박스 · 경복궁 · 키보드 · 남산타워 · 자유의 여신상)', '2026-04-10'],
      ['사운드 시스템 테스트',      '84 (데이터 13 + 런타임 29 + 구조 42)',    '2026-04-10'],
      ['LogSystem 테스트',          '6 종',                                    '2026-04-10'],
      ['프레스킷 자동 번역 언어',   '14 (영·중간체·중번체·스페인·프랑스·브라질포·포·러·독·일·튀르키예·태국·이탈리아 + 한국)', '2026-04-10'],
      ['홍보 컨택 캠페인',          '~200 곳 (스트리머/미디어/큐레이터)',     '2026-04-17 누적'],
      ['자동화 SOP',                '5 단계 → Claude Code Skill 4 종',         '2026-04-10'],
    ],
  },

  // 실 자산 — 메인캡슐 + 6 스크린샷.
  heroImage: 'wobble-wobble/assets/hero.png',

  // Carousel 6 장. 한국 출시 + 게임 전반의 시각적 폭을 보여주는 컷.
  // (본인 직접 개발 4종 — 툴박스/경복궁/키보드/남산타워 — 의 스크린샷은 별도 첨부 시 교체.)
  screenshots: [
    { src: 'wobble-wobble/assets/screen-1-title.png',          tag: 'TITLE',  caption: '타이틀 화면 — 던져서 게임시작' },
    { src: 'wobble-wobble/assets/screen-2-stage-select.png',   tag: 'MAP',    caption: '스테이지 셀렉트 — 세계 명소를 폭탄으로 무너뜨린다' },
    { src: 'wobble-wobble/assets/screen-3-somacube.png',       tag: 'STAGE',  caption: '소마 큐브 — 조립 퍼즐을 3D 물리로 해체' },
    { src: 'wobble-wobble/assets/screen-4-parthenon.png',      tag: 'STAGE',  caption: '파르테논 신전' },
    { src: 'wobble-wobble/assets/screen-5-neuschwanstein.png', tag: 'STAGE',  caption: '노이슈반슈타인 성 — 폭탄 던지기 + 링 통과' },
    { src: 'wobble-wobble/assets/screen-6-colosseum.png',      tag: 'STAGE',  caption: '콜로세움' },
  ],
};
