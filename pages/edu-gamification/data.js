// pages/edu-gamification/data.js
// 교육용 게이미피케이션 (외주) — 게임 client + 웹 서비스. 본인 프리랜서.
// ⚠️ 외주 기밀: 클라이언트명 · 제품명 · 도메인 세부 · 콘텐츠 노출 금지. 익명 + 기술 구조만.
// Schema mirrors DX11_DATA (NotebookPage 렌더 계약). 자산 미보유 → heroMermaid 사용.

window.EDU_GAMIFICATION_DATA = {
  meta: {
    code: 'MAIN · 02',
    eyebrow: 'MAIN · 02 ─ 외주 · 진행 중',
    date: '2026.05 – 진행 중',
    title: '교육용 게이미피케이션 — 게임 + 웹 서비스 (외주)',
    oneLine:
      '미확정 · **일(日) 단위로 바뀌는 요구사항**을 스키마리스 NoSQL과 서버리스로 흡수. ' +
      '비개발자 운영자를 위한 **원터치 배포 콘솔**까지 직접 구축.',
    period: '2026.05 – 진행 중',
    weeks: '웹 ≈3주 · 진행 중',
    team: '외주 · 프리랜서',
    role: '게임 설계 · 웹 주개발',
    platform: 'Unity 6.1 · React · AWS Serverless',
    stack: ['Unity 6.1', 'UniTask', 'React 19', 'TypeScript', 'Python (Lambda)', 'DynamoDB', 'Terraform', 'Electron'],
  },

  // 전체 구조 — 게임 client / 서버리스 백엔드 / 운영 콘솔 3 영역
  heroMermaid: `graph LR
    subgraph CLIENT["게임 client (Unity)"]
        SEG["ISegment 그래프<br/>내러티브 자유 구성"]
        LINK["연동 계층<br/>IAuth · IBackend · ISaveStore"]
        SEG --> LINK
    end
    subgraph CLOUD["서버리스 백엔드 (AWS)"]
        GW["API Gateway"]
        FN["Lambda (Python)"]
        DB["DynamoDB<br/>스키마리스 9 테이블"]
        GW --> FN --> DB
    end
    subgraph OPS["운영 콘솔 (Electron)"]
        BOOT["격리 부트스트랩<br/>Node · Python · Terraform"]
        DEPLOY["Terraform 배포 UI"]
        BOOT --> DEPLOY
    end

    LINK -->|REST · JSON| GW
    DEPLOY -.->|1-click 배포| CLOUD

    classDef c fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef s fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    classDef o fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    class SEG,LINK c
    class GW,FN,DB s
    class BOOT,DEPLOY o`,

  heroMetrics: [
    { n: '3,000', label: '대상 사용자 규모',   sub: '동시 ~50 · 서버리스 자동 확장' },
    { n: '日',    label: '단위로 바뀌는 요구',  sub: '주 75+ 본인 커밋 · 중간 대규모 rebuild 흡수' },
    { n: '1-click', label: '비개발자 배포 콘솔', sub: 'Node/Python/Terraform 격리 설치 → Electron' },
    { n: 'NoSQL', label: '미확정 요구 흡수',     sub: '스키마리스 · 마이그레이션 0' },
  ],

  facts: [
    ['한 줄 정의',  '교육용 게이미피케이션 — 스토리 분기 게임 + 운영 / 데이터 웹 서비스 (외주)'],
    ['기간',       '2026.05 – 진행 중 (웹 ≈3주)'],
    ['형태',       '외주 · 본인 프리랜서'],
    ['본인 역할',   '게임: 내러티브 시스템 · 웹 연동 계층 설계(팀) / 웹: 주 개발(백엔드 · 배포 · 인프라)'],
    ['게임 스택',   'Unity 6.1 · UniTask · HTTP(UnityWebRequest + JSON)'],
    ['웹 스택',    'React 19 · TS · Vite / Python Lambda · DynamoDB · Terraform · Electron'],
    ['규모 (웹)',   '~31K LOC · 9 NoSQL 테이블 · 60+ API 라우트'],
  ],

  roles: {
    mine:
      '게임 client — 내러티브를 자유 구성하는 `ISegment` 3단계 생명주기 시스템 + 데이터 그래프, ' +
      '웹 서버 연동 계층(인터페이스 분리 · 토큰 자동 갱신 · 체크포인트 동기화) 설계. ' +
      '웹 서비스 — 스키마리스 NoSQL 백엔드, 서버리스 인프라(IaC), 비개발자용 원터치 배포 콘솔 주 개발.',
    others:
      '게임 client 는 팀 프로젝트로 리드 · 다수 기여자 별도 — 본인은 내러티브 / 연동 계층 설계에 기여. ' +
      '웹 서비스도 팀원 보조가 있으나 본인이 주도(최다 기여).',
  },

  systems: [
    /* ─── 5.1 내러티브 시스템 ───────────────────────────── */
    {
      no: '5.1',
      kind: 'ARCHITECTURE',
      title: '내러티브 시스템 — ISegment 3단계 생명주기 + 데이터 그래프',
      lede: '내러티브 한 단위를 Enter/Run/Exit 생명주기로 추상화. 분기는 코드가 아니라 데이터 그래프 · 채널로 — 기획자가 에디터에서 구성.',
      problem:
        '스토리 분기 게임에서 내러티브를 코드에 하드코딩하면, 순서 변경 · 분기 추가마다 코드를 만져야 하고 ' +
        '리소스 로드 · 정리 로직이 실행 로직과 뒤섞인다.',
      decision:
        '내러티브 한 단위를 `ISegment` **3단계 생명주기**(`EnterAsync` 로드 → `RunAsync` 상호작용 → `ExitAsync` 해제) + ' +
        '`IsPassThrough` 로 추상화. 흐름은 ScriptableObject **데이터 그래프** + **채널 분기**(선택지 = 채널)로 — ' +
        '코드에 분기 없음, 기획자가 에디터에서 구성. 다음 세그먼트를 미리 로드하며 현재를 정리하는 **겹침 전환**.',
      results: [
        '세그먼트 재사용 · 재배치 · 교체 자유 (구현체 5종을 같은 인터페이스로)',
        '분기 하드코딩 0 — 기획자가 데이터로 내러티브 구성',
        '겹침 전환으로 검은 화면 없는 전환 UX',
      ],
      stack: ['ISegment (Enter/Run/Exit + IsPassThrough)', 'ScriptableObject 그래프', '채널 분기', 'UniTask + CancellationToken'],
      mermaid: `graph LR
    G["데이터 그래프<br/>(ScriptableObject)"]
    C["커서 순회<br/>채널 분기"]
    S["ISegment"]
    E1["EnterAsync<br/>리소스 로드"]
    R["RunAsync<br/>사용자 상호작용"]
    X["ExitAsync<br/>해제"]
    N["다음 노드<br/>(선택지 = 채널)"]

    G --> C --> S
    S --> E1 --> R --> X --> N
    N -->|채널| C

    classDef a fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef b fill:#e6efdf,stroke:#7ea571,color:#283825
    class G,C,N a
    class S,E1,R,X b`,
    },

    /* ─── 5.2 제약 → 기술 결정 ──────────────────────────── */
    {
      no: '5.2',
      kind: 'SYSTEM',
      title: '제약 → 기술 결정 — NoSQL · 서버리스 · 빠른 흡수',
      lede: '확정되지 않은 요구사항 · 촉박한 기한 · 저비용 · 3,000명 규모. 각 제약을 푸는 기술 선택을 했다.',
      problem:
        '요구사항이 클라이언트 측에서도 확정되지 않아 **일 단위로 바뀌었고**, 기한은 촉박했으며, ' +
        '저비용으로 ~3,000명(동시 ~50)을 감당해야 했다.',
      decision:
        '(1) 미확정 · 급변 → 스키마 고정 비용이 큰 RDB 대신 **스키마리스 DynamoDB** (마이그레이션 없이 변화 흡수, 단일 테이블 · GSI · TTL). ' +
        '(2) 저비용 → **서버리스**(Lambda + pay-per-request + 정적 S3/CloudFront) — 유휴 비용 최소. ' +
        '(3) 3,000명 → CDN + DynamoDB 자동 확장. ' +
        '(4) 일 단위 변경 + 첫 풀스택 → 빠른 학습 + AI 활용 + 외부 지정 스택 준수.',
      results: [
        '요구사항 변화를 마이그레이션 0 으로 흡수',
        '유휴 시 비용 최소 · 운영 부담 낮은 서버리스',
        '주 75+ 본인 커밋 · 중간 대규모 rebuild 로 급변 요구 흡수 (git 기준)',
      ],
      stack: ['DynamoDB (스키마리스 · GSI · TTL)', 'AWS Lambda (Python)', 'API Gateway', 'S3 + CloudFront', 'Terraform IaC'],
      tableTitle: '요구사항 / 제약 → 기술 결정 → 효과',
      table: {
        headers: ['제약 / 요구', '결정', '효과'],
        rows: [
          ['요구사항 미확정 · 급변',       '스키마리스 NoSQL (DynamoDB)',          '마이그레이션 없이 변화 흡수'],
          ['저비용 · 소규모 운영',         '서버리스 (Lambda · pay-per-request)',  '유휴 비용 최소'],
          ['3,000명 규모',                '정적 CDN + DynamoDB 자동 확장',         '규모 대비 안정 응답'],
          ['일 단위 변경 / 첫 풀스택',      '빠른 학습 + AI 활용 + 외부 지정 스택',  '주 75+ 커밋으로 흡수'],
        ],
      },
    },

    /* ─── 5.3 원터치 배포 콘솔 ──────────────────────────── */
    {
      no: '5.3',
      kind: 'TOOL',
      title: '원터치 배포 콘솔 — 비개발자 운영자를 위한 자동화',
      lede: '직접 CI/CD 불가 + 클라이언트 내부 배포 스펙 비공개. 비개발자가 더블클릭 한 번으로 환경 구축부터 배포까지 하도록 직접 구축.',
      problem:
        '직접 CI/CD 를 구축할 수 없었고(클라이언트 내부 배포 스펙 비공개), 운영을 **비개발자가** 해야 했다. ' +
        'npm · python · terraform · 시크릿을 비개발자가 직접 다루는 것은 불가능에 가깝다.',
      decision:
        '`설치 실행` 더블클릭 → 부트스트랩 스크립트가 **Node · Python · Terraform 을 시스템 오염 없이 격리 설치** ' +
        '(단계별 마커로 재개 가능) → **Electron 운영 콘솔** 기동. ' +
        '콘솔 탭: 배포(Terraform plan/apply UI) · 관리자 · 콘텐츠(CSV) · 배포 전 테스트 · 설정. ' +
        '배포 파이프라인 = terraform → 프론트 빌드 → S3 sync → CloudFront 무효화.',
      results: [
        '운영자가 npm/python/terraform/시크릿을 직접 만지지 않고 더블클릭 → 탭 클릭으로 배포',
        '시스템 오염 0 — 폴더 삭제 = 완전 제거',
        '배포 전 스모크 테스트 · 콘텐츠 업서트까지 콘솔에서',
      ],
      stack: ['Electron', '부트스트랩 (격리 설치 · 재개 가능)', 'Terraform plan/apply UI', 'S3 sync + CloudFront invalidation'],
      mermaid: `graph LR
    BAT["설치 실행<br/>(더블클릭)"]
    BOOT["부트스트랩<br/>Node · Python · Terraform 격리 설치"]
    CON["Electron 콘솔"]
    TF["Terraform plan / apply"]
    BLD["프론트 빌드 → S3 sync"]
    CF["CloudFront 무효화"]

    BAT --> BOOT --> CON
    CON --> TF --> BLD --> CF

    classDef a fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef b fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class BAT,BOOT a
    class CON b
    class TF,BLD,CF c`,
    },
  ],

  metrics: {
    title: '요구사항 / 제약 → 기술 결정 (종합)',
    headers: ['제약 / 요구', '결정', '효과'],
    rows: [
      ['요구사항 미확정 · 급변',      '스키마리스 NoSQL (DynamoDB)',          '마이그레이션 없이 변화 흡수'],
      ['저비용 · 소규모 운영',        '서버리스 (Lambda · pay-per-request)',  '유휴 비용 최소'],
      ['3,000명 규모',               '정적 CDN + DynamoDB 자동 확장',         '규모 대비 안정 응답'],
      ['비개발 운영 + 배포스펙 비공개', '격리 부트스트랩 + Electron 콘솔',       '더블클릭 → 탭 클릭 배포 · 무오염'],
      ['일 단위 변경 / 첫 풀스택',     '빠른 학습 + AI 활용 + 외부 지정 스택',   '주 75+ 커밋으로 흡수'],
    ],
  },
};
