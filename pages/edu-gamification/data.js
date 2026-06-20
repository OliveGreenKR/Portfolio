// pages/edu-gamification/data.js
// 교육용 게이미피케이션 (외주) — 게임 client + 웹 서비스. 본인 프리랜서.
// ⚠️ 외주 기밀: 클라이언트명 · 제품명 · 코드네임(Pioneer/Kway) · 시크릿 노출 금지. 코드는 전부 익명화.
// Schema mirrors DX11_DATA. hero = mermaid(전체 구조). 자산 없음.
// 코드 근거: knowledge_base/projects/pioneer/code_analysis/{game_narrative,web_service}.md

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
    { n: '1-click', label: '비개발자 배포 콘솔', sub: 'Node/Python/Terraform sha256 격리 설치 → Electron' },
    { n: '101',   label: 'API 라우트',         sub: '단일 라우트 테이블 · 16 모듈 · 9 NoSQL 테이블' },
  ],

  facts: [
    ['한 줄 정의',  '교육용 게이미피케이션 — 스토리 분기 게임 + 운영 / 데이터 웹 서비스 (외주)'],
    ['기간',       '2026.05 – 진행 중 (웹 ≈3주)'],
    ['형태',       '외주 · 본인 프리랜서'],
    ['본인 역할',   '게임: 내러티브 시스템 · 웹 연동 계층 설계(팀) / 웹: 주 개발(백엔드 · 배포 · 인프라)'],
    ['게임 스택',   'Unity 6.1 · C# 10 · UniTask · UnityWebRequest + JSON'],
    ['웹 스택',    'React 19 · TS · Vite / Python Lambda · DynamoDB · Terraform · Electron'],
    ['규모',       '프론트 ~10.8K LOC · 백엔드 ~8.7K LOC · 9 NoSQL 테이블 · 101 API 라우트'],
  ],

  roles: {
    mine:
      '게임 client — 내러티브를 자유 구성하는 `ISegment` 3단계 생명주기 시스템 + 데이터 그래프, ' +
      '웹 서버 연동 계층(인터페이스 분리 · 토큰 자동 갱신 · 체크포인트 큐) 설계. ' +
      '웹 서비스 — 스키마리스 NoSQL 데이터 레이어, 서버리스 인프라(IaC), 비개발자용 원터치 배포 콘솔, Lambda 라우팅 주 개발.',
    others:
      '게임 client 는 팀 프로젝트로 리드 · 다수 기여자 별도 — 본인은 내러티브 / 연동 계층 설계에 기여. ' +
      '웹 서비스도 팀원 보조가 있으나 본인이 주도(최다 기여).',
  },

  systems: [
    /* ─── 5.1 내러티브 ──────────────────────────────────── */
    {
      no: '5.1',
      kind: 'ARCHITECTURE',
      title: '내러티브 시스템 — ISegment 3단계 + 데이터 그래프',
      lede: '내러티브 한 단위를 Enter/Run/Exit 생명주기로 추상화. 분기는 코드가 아니라 데이터 그래프 · 채널로 — 기획자가 코드 0으로 구성.',
      problem:
        '스토리 분기 게임에서 내러티브를 코드에 하드코딩하면 순서 변경·분기 추가마다 코드를 만져야 하고, 리소스 로드·정리가 실행 로직과 뒤섞인다.',
      decision:
        '내러티브 한 단위를 `ISegment` **3단계 생명주기**(Enter→Run→Exit) + `IsPassThrough`로 추상화. ' +
        '흐름은 ScriptableObject **데이터 그래프**(`[SerializeReference]` 노드 + edges) + **채널 분기**(선택지 = 채널 문자열). ' +
        '`StoryNode`는 카드 선택지 수에서 출력 포트를 **데이터로 생성** → 기획자가 GraphView에서 임의 분기 구성. ' +
        'ISegment는 데이터/오케스트레이터를 모르고, 그래프는 세그먼트를 모른다(3-레이어 분리).',
      results: [
        '분기 하드코딩 0 — 기획자가 데이터로 내러티브 구성 (코드 변경 없이)',
        '세그먼트 5종을 같은 인터페이스로 재사용 · 재배치 · 교체',
        '겹침 전환(다음 Enter 선로드 → 현재 Exit)으로 검은 화면 없는 UX',
      ],
      stack: ['ISegment (Enter/Run/Exit + IsPassThrough)', 'GraphAsset ([SerializeReference] 다형 노드)', 'RuntimeGraph ((노드,채널)→타깃)', 'GameFlowController (런 루프)', 'SegmentNodeBase<T> (타입 안전 Apply)'],
      mermaid: `graph LR
    GA["GraphAsset (SO)<br/>노드 + 엣지"]
    RG["RuntimeGraph<br/>(노드,채널)→타깃"]
    GFC["GameFlowController<br/>런 루프"]
    SEG["ISegment<br/>Enter→Run→Exit"]
    NEXT["다음 노드<br/>(선택지 = 채널)"]

    GA -->|1회 빌드| RG --> GFC
    GFC -->|pool.Get + Apply| SEG
    SEG -->|결과 + 선택| GFC
    GFC -->|NextNode| NEXT -->|채널| RG

    classDef a fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef b fill:#e6efdf,stroke:#7ea571,color:#283825
    class GA,RG,NEXT a
    class GFC,SEG b`,
      ascii: {
        title: 'ISegment + 채널 분기 + 데이터 포트',
        intro: '생명주기 계약, (노드,채널)→타깃 라우팅, 카드에서 파생되는 출력 포트.',
        code: `public interface ISegment {
    UniTask EnterAsync(CancellationToken ct);   // 제어 넘기기 전 준비
    UniTask RunAsync(CancellationToken ct);     // 제어 소유, 자체 루프
    UniTask ExitAsync(CancellationToken ct);    // 제어 반환 후 정리
    bool IsPassThrough => false;
}
// 채널 분기 — 미연결 = Empty(자연 종료)
public Guid NextNode(Guid src, string channel) =>
    _channelMap.TryGetValue((src, channel), out var dst) ? dst : Guid.Empty;

// 자유 구성 — 포트를 카드 데이터에서 생성
for (int i = 0; i < choices.Count; i++)
    ports[i] = new OutputPort($"choice_{i}", $"Choice {i + 1}");`,
        result: '채널 문자열("next"/"choice_{i}")만이 그래프↔플로우 결합 — 나머지는 순수 데이터.',
      },
    },

    /* ─── 5.2 웹 연동 ───────────────────────────────────── */
    {
      no: '5.2',
      kind: 'SYSTEM',
      title: '웹 연동 — 경계 인터페이스 + 체크포인트 큐 (무중복)',
      lede: '구현(클라우드)과 게임 로직을 인터페이스로 분리. 점수 델타를 버퍼링했다 체크포인트 저장 경계에서 비영속 큐로 전송 → 복원 시 중복 집계 0.',
      problem:
        '게임이 서버에 선택을 기록하는데, 매 선택마다 즉시 전송하면 크래시·새로고침 시 "서버는 받았지만 세이브엔 없는" 점수가 생겨 복원 시 중복 집계된다.',
      decision:
        '`IAuth`/`IBackend`/`ISaveStore`로 구현(클라우드)과 로직 분리. HTTP는 **상태→예외 매핑 + 지수 백오프 재시도**, 401은 **토큰 자동 갱신 후 1회 재시도**. ' +
        '핵심: 선택 점수 델타를 **즉시 보내지 않고 버퍼** → **체크포인트 저장 직전** 비영속 **단일 소비자 FIFO 큐**로 flush. ' +
        '큐 손실과 저장 손실을 의도적으로 동조 → 크래시 시 둘 다 날아가 마지막 체크포인트부터 재개하면 서버가 못 받은 만큼만 재생.',
      results: [
        '복원 시 점수 중복 집계 0 (저장 경계 = 전송 경계)',
        '401 자동 토큰 갱신 + 5xx/timeout 지수 백오프 — 전송/큐/갱신 3중 회복 책임 분리',
        '큐 순서 보장(head 실패 시 FATAL) + 게임플레이 논블로킹(enqueue 즉시 반환)',
      ],
      stack: ['IAuth / IBackend / ISaveStore (경계)', 'HTTP 클라이언트 (상태→예외 + 백오프)', '전송 큐 (단일 소비자 FIFO · OnFatal)', '체크포인트 동기화'],
      mermaid: `graph LR
    GFC["GameFlowController<br/>선택 델타 버퍼링"]
    CKPT["체크포인트<br/>Flush 직후 Save"]
    Q["전송 큐<br/>단일 소비자 FIFO"]
    HTTP["HTTP 클라이언트<br/>지수 백오프"]
    AUTH["401 → 토큰 자동 갱신"]
    SRV["서버"]

    GFC -->|버퍼| GFC
    GFC -->|체크포인트| CKPT --> Q
    Q --> HTTP --> SRV
    HTTP -.401.-> AUTH -.재시도.-> HTTP

    classDef a fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef b fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class GFC,CKPT a
    class Q b
    class HTTP,AUTH,SRV c`,
      ascii: {
        title: '401 자동 갱신 + 백오프 + 큐 순서 (익명화)',
        intro: '전송 계층 백오프 / 도메인 401 갱신 / 런타임 큐 순서 — 세 회복 책임 분리.',
        code: `// 401 → 토큰 자동 갱신 후 1회 재시도
catch (UnauthorizedException) {
    var refreshed = await _auth.RefreshAsync(ct);
    await Http.PostJsonAsync<TReq, TRes>(url, body, refreshed.AccessToken, ...);
}
// HTTP 백오프 — 5xx/timeout만 재시도
catch (NetworkException) when (attempt < maxRetries)
    await Delay(backoff * Pow(2, attempt));     // 지수 백오프

// 큐 워커 — 순서 보장, head 실패 시 FATAL
while (reader.TryRead(out var item))
    if (!await TrySend(item, ct)) { RaiseFatal(item.Label); return; }`,
        result: '버퍼 → 체크포인트 경계 flush → 비영속 순서 큐 = 복원 일관성(무중복).',
      },
    },

    /* ─── 5.3 NoSQL 데이터 레이어 ───────────────────────── */
    {
      no: '5.3',
      kind: 'SYSTEM',
      title: 'NoSQL 데이터 레이어 — 스키마리스 + 단일 테이블',
      lede: '확정되지 않은 요구가 일 단위로 바뀐다. 스키마 마이그레이션 비용이 큰 RDB 대신 스키마리스 DynamoDB + 임의 dict 기반 동적 쓰기로 변화를 흡수.',
      problem:
        '요구사항이 클라이언트 측에서도 확정되지 않아 일 단위로 바뀌었다. 고정 스키마(RDB)는 매 변경마다 마이그레이션 비용이 발생한다.',
      decision:
        '**스키마리스 DynamoDB** + 단일 게이트웨이 모듈(다른 곳 boto3 직접 호출 금지). ' +
        '**임의 dict 기반 동적 `UpdateExpression`** 빌더로 어떤 필드든 마이그레이션 없이 쓰기. ' +
        '러닝허브는 **단일 테이블 + 복합 SK**(`QUESTION#`/`POLL#`/`ANSWER#…`)로 묶고, GSI로 접근 패턴 충족. ' +
        '용량 가드 `transact_write_items`로 다중 테이블 원자성(NoSQL에서 일관성) 확보.',
      results: [
        '요구사항 변화를 마이그레이션 0으로 흡수 (alias 키 투영으로 스키마 드리프트 허용)',
        '단일 테이블 복합 SK + GSI 5개 (유저별 세션 역인덱스 · 크기 무관 글로벌 피드)',
        'pay-per-request + PITR — 규모(3,000명) 대비 운영 부담 최소',
      ],
      stack: ['DynamoDB (스키마리스 · 9 테이블)', '동적 UpdateExpression 빌더', '단일 테이블 + 복합 SK', 'GSI 5개', 'transact_write_items (원자성)'],
      tableTitle: '단일 테이블 설계 — SK / GSI 역할',
      table: {
        headers: ['요소', '패턴', '용도'],
        rows: [
          ['복합 SK',       'QUESTION# / POLL# / ANSWER#…', '한 테이블에 다종 레코드 (session 파티션)'],
          ['email/oid GSI', 'SSO 신원 + 이메일 변경 폴백',   '로그인 조회'],
          ['역 PK/SK GSI',  'user_id → session_id',         '유저별 전체 세션'],
          ['단일 버킷 GSI', 'gsi_pk="ALL" + ISO8601',        '테이블 크기 무관 글로벌 피드'],
        ],
      },
      ascii: {
        title: '스키마리스 동적 update 빌더 (익명화)',
        intro: '임의 dict를 받아 UpdateExpression을 동적 생성 → 새 필드도 코드/마이그레이션 없이 쓰기.',
        code: `def _set_updates(table, key, updates):
    exprs, names, values = [], {}, {}
    for i, (k, v) in enumerate(updates.items()):
        exprs.append(f"#n{i} = :v{i}")
        names[f"#n{i}"] = k            # 임의 속성명 → placeholder
        values[f":v{i}"] = v
    return get_table(table).update_item(
        Key=key, UpdateExpression="SET " + ", ".join(exprs),
        ExpressionAttributeNames=names, ExpressionAttributeValues=values,
        ReturnValues="ALL_NEW")["Attributes"]`,
        result: '미확정·급변 요구 → 스키마리스로 흡수. 마이그레이션 0.',
      },
    },

    /* ─── 5.4 원터치 배포 콘솔 ──────────────────────────── */
    {
      no: '5.4',
      kind: 'TOOL',
      title: '원터치 배포 콘솔 — 비개발자용 (핵심 차별점)',
      lede: '직접 CI/CD 불가 + 클라이언트 내부 배포 스펙 비공개. 비개발자가 베어 PC에서 더블클릭 한 번으로 환경 구축부터 AWS 배포까지.',
      problem:
        '직접 CI/CD를 구축할 수 없었고(클라이언트 내부 배포 스펙 비공개) 운영을 비개발자가 해야 했다. npm·python·terraform·시크릿을 비개발자가 직접 다루는 건 불가능에 가깝다.',
      decision:
        '`설치 실행` 더블클릭 → 부트스트랩이 **Node·Python·Terraform을 sha256 검증 후 로컬에 격리 설치**(시스템 PATH/레지스트리 무변경), **마커로 완료 단계 스킵**(재개 가능) → **Electron 콘솔** 기동. ' +
        '운영자는 AWS 키만 입력(gitignored), 상태 게이트 해제 후 Deploy 클릭 → `terraform apply → 프론트 빌드 → S3 sync → CloudFront 무효화` 파이프라인이 라이브 로그로.',
      results: [
        '운영자가 npm/python/terraform/시크릿을 직접 만지지 않고 더블클릭 → 탭 클릭으로 배포',
        '시스템 오염 0 — 폴더 삭제 = 완전 제거 (격리 툴체인 + 캐시 리다이렉트)',
        '멱등 state 버킷 자동 생성 + 배포 모드(full/infra/frontend/plan) — 인프라~UX 풀스택 소유',
      ],
      stack: ['bootstrap.ps1 (sha256 격리 설치 · 재개)', 'Electron 콘솔 (24 ipcMain · 스트리밍 로그)', 'ops/deploy.py (terraform→build→S3→CloudFront)', 'tools.json (버전 핀)'],
      mermaid: `graph LR
    BAT["설치 실행<br/>(더블클릭)"]
    BOOT["부트스트랩<br/>Node·Python·Terraform 격리 설치(sha256)"]
    CON["Electron 콘솔"]
    TF["terraform apply"]
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
      ascii: {
        title: '재개 가능 격리 설치 (익명화)',
        intro: '버전 마커로 완료 단계 스킵 + 캐시 리다이렉트로 시스템 무오염.',
        code: `# 완료 단계 스킵 (재개 가능)
function Test-Tool($name, $cfg) {
  if (-not (Test-Path (Join-Path $ToolsDir $cfg.probe))) { return $false }
  return (Get-Marker $name) -eq $cfg.version
}
# 격리 캐시 — 프로세스+자식만, 시스템 PATH 무변경
$env:npm_config_cache    = Join-Path $CacheDir 'npm'
$env:TF_PLUGIN_CACHE_DIR = Join-Path $CacheDir 'tf'
$env:Path = (Join-Path $ToolsDir 'node') + ';' + $env:Path`,
        result: 'Node 22.22 · Python 3.12 · Terraform 1.10 sha256 핀 · 6단계 재개.',
      },
    },

    /* ─── 5.5 Lambda 라우팅 ─────────────────────────────── */
    {
      no: '5.5',
      kind: 'ARCHITECTURE',
      title: 'Lambda 라우팅 — 단일 라우트 테이블 + arity 디스패치',
      lede: '101개 라우트를 한 테이블에 선언하고, regex named-group으로 콜드스타트 1회 컴파일. 핸들러는 필요한 인자만 받는 arity 디스패치.',
      problem:
        '60+(실측 101)개 엔드포인트를 프레임워크 없이 Lambda 핸들러 하나에서 깔끔히 분기해야 했다.',
      decision:
        '`(method, path, handler, require_auth)` **튜플 테이블**로 전 라우트 선언. `{param}`을 regex named group으로 변환해 **콜드스타트 1회 컴파일**, 첫 매치 디스패치. ' +
        '핸들러 시그니처(2/3/4 파라미터)를 검사해 `(event, [path_params], [user], context)`를 **arity 기반 주입** → 핸들러가 필요한 것만 받는다.',
      results: [
        '101 라우트(GET 43 / POST 29 / DELETE 12 / PUT 11 / PATCH 6) · 16 모듈',
        '콜드스타트 1회 컴파일 — 요청마다 regex 재컴파일 없음',
        '명시 라우트(overview)를 파라미터 라우트보다 먼저 — 매칭 우선순위 제어',
      ],
      stack: ['ROUTES 튜플 테이블', 'regex named-group 컴파일', 'arity 기반 핸들러 주입', '16 라우트 모듈'],
      ascii: {
        title: '라우트 테이블 + 컴파일 (익명화)',
        intro: '선언적 라우트 + 콜드스타트 1회 컴파일.',
        code: `ROUTES = [
    ("POST",  "/api/auth/login",        auth.login,        False),
    ("GET",   "/api/users",              users.list_users,  True),
    ("PATCH", "/api/users/{userId}",     users.update_user, True),
    ("GET",   "/api/sessions/overview",  sessions.overview, True),  # {id}보다 먼저
    # ... 101개
]
# {param} → 정규식 named group, 콜드스타트 1회 컴파일
regex = re.sub(r"\\{(\\w+)\\}", r"(?P<\\1>[^/]+)", pattern) + "$"`,
        result: '프레임워크 없이 101 라우트를 선언적으로 — arity로 핸들러 결합 최소화.',
      },
    },
  ],

  metrics: {
    title: '요구사항 / 제약 → 기술 결정 (종합)',
    headers: ['제약 / 요구', '결정', '효과'],
    rows: [
      ['요구사항 미확정 · 급변',      '스키마리스 NoSQL (DynamoDB) + 동적 UpdateExpression', '마이그레이션 0으로 변화 흡수'],
      ['저비용 · 소규모 운영',        '서버리스 (Lambda · pay-per-request)',  '유휴 비용 최소'],
      ['3,000명 규모',               '정적 CDN + DynamoDB 자동 확장',         '규모 대비 안정 응답'],
      ['비개발 운영 + 배포스펙 비공개', '격리 부트스트랩 + Electron 콘솔',       '더블클릭 → 탭 클릭 배포 · 무오염'],
      ['복원 시 점수 중복',           '버퍼 → 체크포인트 경계 flush → 순서 큐', '무중복 (저장=전송 경계)'],
      ['일 단위 변경 / 첫 풀스택',     '빠른 학습 + AI 활용 + 외부 지정 스택',   '주 75+ 커밋으로 흡수'],
    ],
  },
};
