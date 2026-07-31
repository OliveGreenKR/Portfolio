// pages/cartapli-mobile/data.js
// Cartapli Mobile — 종이접기 시뮬레이션 최적화 (진행 중, 모바일 이식 + 리메이크)
//
// 구성 순서 = 탑다운: 결과 → 어떻게 쟀나(파이프라인) → 무엇을 믿을지(지표) → 기준선 → 5단계 → 검증
// 출처: docs/perf/{README, bench-overlay, S0-baseline, S1-layer-reuse, S1-2-arbitrary,
//       S2-a-merge-renderer, S2-b-job-burst, remeasure-nolog, render-axis, summary}.md
//       + _specs/paper-refactor/C-design.md + Assets/Scripts/{Game/Paper, Bench, Tests}/**
// ⚠️ 수치 기준 = remeasure-nolog(로그 배제) 시리즈. 옛 로그 포함 시리즈 수치는 쓰지 않는다.
//
// 각 섹션·단계에 `gist` 한 줄 = 30초 안에 요지가 잡히도록 하는 장치. 본문보다 먼저 읽힌다.

window.CM_DATA = {
  meta: {
    eyebrow: 'MAIN · 01 ─ 진행 중 · 모바일 이식 + 리메이크',
    subtitle: 'Cartapli Mobile',
    title: '종이접기 시뮬레이션 최적화',
    pills: [
      { kind: 'accent', text: '진행 중 · 2026.07' },
      { kind: 'plain',  text: 'Unity 6.3 · URP · Orthographic' },
      { kind: 'plain',  text: 'C# 10 · Burst · Jobs · Collections' },
      { kind: 'accent', text: '역할 — 구조 · 렌더링 · 성능 · 측정 전부' },
    ],
  },

  hook:
    '접을수록 종이 레이어가 회차마다 1.5~1.6배씩 늘어난다. 16회차에 **5,041장.** ' +
    '먼저 **측정 파이프라인부터 자동화**하고, 그 위에서 5단계로 나눠 고치며 단계마다 따로 쟀다.',

  bigs: [
    { n: '−93.8%',  label: '프레임당 CPU', sub: '0.643 → 0.040 ms · 마커 3종 합 (Average)' },
    { n: '298 → 1', label: '드로우콜',      sub: '16회차 · 정지 대조군 대비 델타' },
    { n: '5.9×',    label: '레이어 감소',   sub: '337 → 57 장 · 정점 1,348 → 251' },
  ],

  waterfall: [
    { k: 'S0',   label: '기준선',        t: '0.643', d: null,      v: 0.643, kind: 'base' },
    { k: 'S1-1', label: '레이어 재사용',  t: '0.373', d: '−41.9%', v: 0.373, kind: 'struct' },
    { k: 'S1-2', label: '파묻힘 삭제',    t: '0.165', d: '−55.8%', v: 0.165, kind: 'struct' },
    { k: 'S2-a', label: '2메시 병합',     t: '0.062', d: '−62.4%', v: 0.062, kind: 'struct' },
    { k: 'S2-b', label: 'Burst 잡',      t: '0.040', d: '−35.5%', v: 0.040, kind: 'dots' },
  ],
  waterfallNote:
    '**구조 개선 3단계가 −90.3% 를 만들고, DOTS 가 나머지를 −93.8% 까지 밀었다.** ' +
    '"DOTS 를 쓰면 빨라진다" 가 아니라 **구조로 얼마 · DOTS 로 얼마**를 갈라 말하는 것이 이 작업의 목적이었다.',

  // 히어로 하단 — "이 수치는 이렇게 나왔다"
  pipelineMini: {
    lede: '위 수치는 전부 아래 파이프라인 한 줄에서 나온다. 사람이 손으로 옮긴 값은 없다.',
    steps: [
      { name: 'PaperBench 씬',  kind: 'run' },
      { name: 'PlayMode 테스트', kind: 'run' },
      { name: 'ProfilerMarker', kind: 'run' },
      { name: 'TestResults.xml', kind: 'auto' },
      { name: 'CSV', kind: 'auto' },
      { name: '단계 비교표', kind: 'out' },
    ],
  },

  // ─── §01 배경 ───────────────────────────────────────────
  context: {
    gist: 'PC 출시작의 종이접기 코어를 모바일로 옮기는 프로젝트. 이식이 곧 성능 문제였다.',
    lede:
      '모바일의 CPU·드로우콜 예산은 PC 의 몇 분의 일이고, 종이접기는 접을 때마다 레이어가 ' +
      '기하급수로 늘어나는 구조다. 그대로 옮기면 성립하지 않는다.',
    facts: [
      ['프로젝트',  'Cartapli Mobile — PC 출시작의 코어를 이식 + 게임 재제작 (진행 중)'],
      ['기간',     '2026.07 – 진행 중'],
      ['플랫폼',   'Unity 6000.3.20f1 (6.3) · URP · Orthographic · 모바일 타겟'],
      ['스택',     'C# 10 · Burst · Jobs (`IJobParallelFor`) · Collections (`NativeArray`) · Unity.Mathematics · Clipper2Lib · UniTask'],
      ['측정',     'Unity Performance Testing 3.5.0 (PlayMode) · `ProfilerMarker` · `TestResults.xml` → CSV → 비교표 자동 생성'],
      ['작업 범위', '책임 분리 리팩터 · 성능 5단계 · 측정 파이프라인 · 오라클 테스트 — 이 문서 범위 전부 본인'],
    ],
    roles: {
      mine:
        '종이접기 코어의 **책임 분리 리팩터**(데이터 / 연산 / 뷰), **성능 5단계 개선**, ' +
        '**측정 파이프라인**(결정론 벤치 · 마커 · CSV 자동 추출 · 비교표 생성 · 벤치 브랜치 관리), ' +
        '**오라클 테스트**(네이티브 구현 ↔ 관리형 구현 대조).',
      others:
        '원본 Cartapli(PC) 의 종이접기 핵심 수학 — 반사 좌표 · 메쉬 분할 · 점-다각형 판정 — 은 원 PoC 입안자 작업이다. ' +
        '이 프로젝트는 그 로직을 이식한 뒤 **구조 · 렌더링 · 성능을 재설계**한 것이며, 아래 5단계는 전부 그 재설계 범위다.',
    },
  },

  // ─── §02 측정 파이프라인 ────────────────────────────────
  pipeline: {
    gist: '5단계 × 브랜치 5개 × 재측정 2회. 손으로 재면 조건이 어긋난다 — 그래서 측정을 먼저 자동화했다.',
    lede:
      '개선 하나를 넣을 때마다 **다섯 엔진 버전을 같은 조건으로 다시 재야** 한다. ' +
      '실제로 시리즈를 두 번 통째로 다시 쟀다(벤치 교체 1회 · 로그 개편 1회). ' +
      '수동 측정이었으면 그때마다 조건이 어긋났을 것이다.',
    steps: [
      { name: 'PaperBench 씬',       kind: 'run',  sub: '정사각형 종이 · 디버그 도구 자동 비활성' },
      { name: 'PlayMode 테스트 2종',  kind: 'run',  sub: '회차 지표 / 마커 비용 — 한 런에 같이' },
      { name: 'FoldLinePlanner',     kind: 'run',  sub: 'hash(시드,회차) 결정론 접는 선' },
      { name: 'ProfilerMarker 3',    kind: 'run',  sub: 'Split · Compose · Renderer.Sync' },
      { name: 'TestResults.xml',     kind: 'auto', sub: '패키지가 결과 JSON 을 여기에 심는다' },
      { name: 'export_results.py',   kind: 'auto', sub: 'GUI Export CSV 대체 — 정규식으로 직접 파싱' },
      { name: 'S{N}-nolog-*.csv',    kind: 'auto', sub: '단계별 원본' },
      { name: 'summarize.py',        kind: 'out',  sub: '단계 추가 = STAGES 에 한 줄' },
      { name: 'summary.md · CSV',    kind: 'out',  sub: '사람용 표 + 기계용 원본. 손으로 안 고침' },
    ],
    blocks: [
      {
        title: '1 — 자극을 고정한다',
        body:
          '접는 선을 `hash(시드 12345, 회차)` 로 뽑는다. 각도 `[0,180°)` · 비율 `[0.20,0.45]` · 넘어가는 쪽까지 결정론. ' +
          '**0.5(정확히 반)는 구간에서 뺐다** — 조각이 정확히 포개지는 퇴화 패턴이라 파묻힘이 비현실적으로 커진다. ' +
          '입력이 `(시드, 회차, 경계상자)` 뿐이고 파묻힌 레이어를 지워도 경계상자가 안 변하므로, **다섯 버전이 같은 접는 선을 쓴다.**',
        code: {
          title: 'PaperFoldPerformanceTests — 회차 루프',
          intro: '벤치는 매 회차 접는 선 파라미터를 F6 정밀도로 남긴다. 버전 간 자극 동일성을 나중에 대조하기 위한 증거다.',
          code: `FoldLinePlanner.PlanRandom(min, max, RandomSeed, round, DragLengthUnits,
                           out Vector2 localA, out Vector2 localB,
                           out FoldLinePlanner.FoldPlanInfo info);

// 여러 버전에서 접는 선이 동일함을 실측 대조하는 증거 — bbox 가 같으면 자극이 같다
Debug.Log($"[Bench] round {round + 1}: bbox=({min.x:F6},{min.y:F6})~({max.x:F6},{max.y:F6}) " +
          $"angle={info.AngleDeg:F6} ratio={info.Ratio:F6} fwd={info.FoldForward}");

paper.StartFold(worldA, worldB);
yield return WaitForInterpolation(paper);   // 보간 상한 600프레임 — 무한 대기 차단
paper.ConfirmFold();

Measure.Custom(roundGroup,  elapsedMs);
Measure.Custom(layerGroup,  paper.LayerCount);
Measure.Custom(vertexGroup, paper.Confirmed.GetTotalVertexCount());`,
          result: '레이어 30,000 초과 시 중단 가드 — 사선 절단은 옛 버전에서 수만 장까지 가 OOM 을 낸다.',
        },
      },
      {
        title: '2 — 비용을 마커로 잰다',
        body:
          '`Measure.ProfilerMarkers` 로 세 마커를 한 런에 건다. **마커 이름은 단계 비교표의 열**이라 버전이 바뀌어도 유지한다 — ' +
          'S2-a 에서 `LayerView.RegenerateMesh` 가 폐기됐을 때도 이름을 바꾸지 않고 비용을 `Renderer.Sync` 에 흡수시켰다. ' +
          '측정에 섞이면 안 되는 디버그 도구는 **타입 이름으로 찾아 끈다** — 버전마다 패널 클래스가 달라 타입을 직접 참조하면 옛 브랜치에서 컴파일이 깨진다.',
        code: {
          title: 'Fold_RandomFolds_MarkerCost',
          code: `string[] markers = {
    "Paper.FoldOperation.Split",
    "Paper.FoldOperation.Compose",
    "Paper.Renderer.Sync",
};

using (Measure.ProfilerMarkers(markers)) {
    for (int round = 0; round < MaxFoldRounds; round++) { /* 같은 시퀀스 */ }
}

// 버전마다 씬에 붙은 도구가 달라 타입이 아니라 이름으로 찾는다
private static readonly string[] DebugToolTypeNames =
    { "FoldDebugPanel", "DebugOverlay", "PaperDragInput" };`,
          result: '벤치 파일 하나가 다섯 브랜치에 그대로 얹혀야 하므로, 옛 엔진에 없는 타입을 절대 참조하지 않는다.',
        },
      },
      {
        title: '3 — 추출과 비교표를 자동화한다',
        body:
          'Performance Test Report 창의 **Export CSV 를 손으로 누르지 않는다.** ' +
          '패키지가 결과 JSON 을 `TestResults.xml` 안에 `##performancetestresult2:` 로 심어두므로, 그걸 읽어 같은 형식의 CSV 로 다시 쓴다. ' +
          '비교표는 별도 스크립트가 CSV 에서 생성한다 — **손으로 고치지 않는다.** 새 단계를 추가할 때 하는 일은 `STAGES` 에 한 줄 넣는 것뿐이다. ' +
          '이 추출기는 다른 Unity 프로젝트에서도 쓰도록 **글로벌 스킬로 일반화**했다.',
        code: {
          title: 'export_results.py — GUI 없이 CSV',
          code: `RESULT_PATTERN = re.compile(r"##performancetestresult2?:(\\{.*?\\})\\s*\\n")
TEST_FILTER    = "Fold_RandomFolds"   # 폐기된 정렬 벤치·진단 테스트는 제외

# python docs/perf/export_results.py S2-b-nolog
#   -> docs/perf/S2-b-nolog-random-results.csv`,
          result: '⚠️ TestResults.xml 은 마지막 런만 담는다 — 측정 두 개를 돌린 직후에 뽑는다.',
        },
      },
    ],
    branch: {
      title: '4 — 브랜치를 얼리되, 인프라는 얼리지 않는다',
      body:
        '벤치 브랜치는 **엔진(종이 코드)은 옛 커밋 그대로, 인프라는 최신**이어야 한다. ' +
        '인프라가 갈라지면 부하 조건이 단계마다 달라져 비교가 깨진다 — **실제로 두 번 깨졌다.** ' +
        '그래서 인프라가 바뀔 때마다 `git checkout main -- <인프라 경로>` 로 전 브랜치에 다시 덮는다. 브랜치당 명령 세 줄이다.',
      branches: [
        { k: 'bench-s0',   commit: '608c1e3', note: '기준선' },
        { k: 'bench-s1-1', commit: '385fd68', note: '재사용' },
        { k: 'bench-s1-2', commit: '992c50a', note: '삭제' },
        { k: 'bench-s2-a', commit: '792bb3a', note: '병합' },
        { k: 'main',       commit: 'cafa4ae', note: 'Burst' },
      ],
      freeze: [
        ['얼어붙는 것', '`Assets/Scripts/Game/Paper/` 이하 전체', '측정 대상. **단계마다 다른 것이 이것뿐이어야 한다**'],
        ['안 얼어붙는 것', '`Framework` · `Bench` · `Tests`', '로깅 · 디버그UI · 생명주기. 계속 자란다 → 매번 오버레이'],
      ],
      breaks: [
        ['1차', '정렬 벤치 → 임의 벤치 전환', '퇴화 패턴이라 개선이 과장되고 3회차에서 측정이 끊겼다'],
        ['2차', '로그 개편', '프레임당 `Debug.Log` 하나가 `Renderer.Sync` 비용의 90% 였다'],
      ],
    },
  },

  // ─── §03 지표 설계 + 기준선 ─────────────────────────────
  metrics: {
    gist: '무엇을 믿을지 먼저 정했다 — 후보 셋 중 둘을 버리고 대조군 둘을 만들었다.',
    choice: [
      ['회차 시간', '**기각**', '접는 선이 `Time.deltaTime` 으로 움직인다 — 프레임이 싸지면 프레임 수가 늘어 총 시간이 유지된다. 프레임당 비용 −39.9% 일 때 회차 시간은 −1.9%.'],
      ['Median / Max', '**기각**', '코드가 한 줄도 안 바뀐 대조군(`Split`)의 Median 이 ±31%, Max 가 ±25% 흔들렸다. 에디터 재현 오차 안이다.'],
      ['Average (프레임당)', '**채택**', '단계마다 표본 수가 달라진다(프레임이 싸지면 보간이 잘게 쪼개져 프레임 수가 는다). 프레임당 평균만이 공정하다.'],
      ['레이어 / 정점 수', '**병기**', 'Average 는 초반 저부하 프레임에 희석돼 "레이어를 지우는 개선"을 과소표시한다. 메모리·객체 수를 직접 좌우하므로 따로 본다.'],
    ],
    controls: [
      {
        title: '대조군 A — 코드가 안 바뀐 마커',
        body: 'S2-a 에서 `FoldOperation.Split` 은 한 줄도 안 바뀌었다. 그 변화량이 곧 이 벤치의 재현 오차다 — Average ±3% / Median +31% / Max −25%. **Average 만 안정적**이라는 결론이 여기서 나왔다.',
      },
      {
        title: '대조군 B — 아무 일도 안 하는 프레임',
        body: '종이는 있고 접기는 하지 않는 프레임 20개를 넣었다. 거기서 나온 17,772 B / 372회는 전부 우리 밖의 것(에디터·테스트 하네스). 드로우콜에도 같은 방법을 썼다 — 에디터 UI 가 18~19 를 깔고 있어 절대값을 못 쓴다.',
      },
    ],
    baseline: {
      title: '기준선이 말한 것 — 예상이 틀렸다',
      was: '폴리곤 분할이 주범일 것이다',
      is: '렌더링 준비가 접기 연산보다 **8배** 비쌌다',
      body:
        '`Renderer.Sync` Median 0.636ms 대 `FoldOperation.Split` 0.083ms. ' +
        '접기 수학이 아니라 **CPU 가 화면에 보이지도 않을 레이어의 메시까지 매 프레임 새로 만드는 것**이 병목이었다. ' +
        'GPU 는 가려진 픽셀을 z-buffer 로 버리지만, CPU 는 그걸 모른 채 전부 만들고 있었다.',
      code: {
        title: 'PaperRenderer.Sync — S0',
        intro: '접기 한 번에 실제로 바뀌는 레이어는 일부인데 전부 다시 만든다.',
        code: `for (int i = 0; i < _views.Count; i++) {
    view.UpdateMesh(layer);          // 매번 Vector3[] / Vector2[] / int[] 신규 할당
    view.SetMaterial(...);
    view.SetStackOrder(...);
}`,
        result: '병목은 "무엇을 그리느냐" 가 아니라 "몇 개의 객체로, 몇 번 다시 만드느냐" 였다.',
      },
    },
  },

  // ─── §04 5단계 ──────────────────────────────────────────
  stages: [
    {
      no: 'S1-1',
      tag: '구조',
      tagKind: 'struct',
      title: '안 바뀐 레이어는 다시 만들지 않는다',
      gist: '"바뀌었는가" 를 물을 근거부터 만들었다 — 연산이 원본 인스턴스를 그대로 돌려주게 해서.',
      delta: '−41.9%',
      deltaSub: '직전 대비 · 합 0.643 → 0.373 ms',
      viz: 'frames',
      what:
        '매 프레임 전 레이어를 처음부터 다시 만들던 것을 **바뀐 레이어만** 다시 만들도록 바꿨다.',
      why:
        '문제는 판정 근거가 없었다는 것이다 — 접기 연산이 매번 새 객체를 뱉으니 뷰가 지난 프레임과 비교할 대상이 없었다. ' +
        '그래서 **연산 쪽을 먼저 고쳤다.** 통째로 남는 레이어는 원본 인스턴스를 그대로 통과시킨다(할당 0) → 뷰가 **참조 동일성**만으로 판정할 수 있다. ' +
        '`StackOrder` 필드는 지웠다 — 리스트 인덱스와 항상 같아 파생 가능했고, 그것 때문에 레이어당 객체가 프레임마다 두 번씩 새로 생기고 있었다.',
      results: [
        '`Compose` **−92%** — 레이어당 객체 할당 · 넓이 재계산이 사라진 몫',
        '`RegenerateMesh` Median **19.6배 감소** — 통째로 스킵된 프레임이 대량 생겼다',
        '재사용 버퍼 + `SetVertices` 로 프레임당 배열 신규 할당 0',
      ],
      table: {
        title: '위 그래프의 원본 — 프레임별 분류와 뷰 풀 크기 (입력 3,266장 → 확정 5,041장)',
        headers: ['프레임', '통과', '걸침', '결과 레이어', '뷰 풀', '프레임 간격'],
        rows: [
          ['1–5', '3,266', '0', '3,266', '4,186', '3~9 ms'],
          ['6',   '0', '**3,195**', '**6,461**', '4,186 → **6,461**', '**80.96 ms**'],
          ['7',   '0', '1,775', '5,041', '6,461', '17.75 ms'],
          ['8',   '0', '1,775', '5,041', '6,461', '~9 ms'],
        ],
      },
      tableNote:
        '**가장 비싼 프레임은 최종이 아니라 중간이다.** 접는 선이 종이 한가운데를 지날 때 걸치는 레이어가 최대(98%)가 되고, ' +
        '잠정 레이어가 **최종보다 28% 많아진다.** 그 프레임에서 뷰가 2,275세트 새로 생성된다. ' +
        '남은 비용의 85% 가 여기 있고 이 개선은 안 닿는다 → 다음은 **"가려진 레이어를 애초에 만들지 않기"** 로 정했다.',
    },

    {
      no: 'S1-2',
      tag: '구조',
      tagKind: 'struct',
      title: '파묻힌 레이어를 애초에 만들지 않는다',
      gist: '"보이는 면적" 과 "안 보이는 레이어 안 만들기" 는 같은 계산이다 — 한 곳에서 둘 다 낸다.',
      delta: '−55.8%',
      deltaSub: '직전 대비 · 누적 −74.4% · 레이어 337 → 57',
      viz: 'stack',
      what:
        '확정할 때 **다른 레이어에 완전히 가려진 레이어를 데이터에서 지운다.** ' +
        '위에서부터 폴리곤을 차례로 빼나가며(Clipper2 불리언) 보이는 레이어를 계산하고, 안 보이면 메시도 만들지 않는다.',
      why:
        '두 계산을 따로 만들면 같은 일을 두 번 짓는다. 그래서 `PaperVisibility` 한 곳에서 **보이는 넓이**와 **파묻힘**을 함께 낸다. ' +
        '검사 방향은 다르다 — 보이는 넓이는 위만, 파묻힘은 위·아래 양쪽. ' +
        '가시성은 레이어 하나만 봐서는 알 수 없으므로 `PaperLayer` 가 아니라 **스택 전체를 받는 곳**에 둔다.',
      results: [
        '**같은 접기를 5.9배 적은 레이어로 표현한다** — 337 → 57장, 정점 1,348 → 251개',
        '렌더 오브젝트 337 → 77 · 드로우콜 +298 → +71',
        '`RegenerateMesh` S0 대비 −81.5% (재사용 + 컬링의 합)',
      ],
      code: {
        title: 'PaperVisibility.Compute — 두 방향으로 한 번씩',
        code: `// 위에서 아래로 — 지나온 것들이 곧 "자기보다 위에 쌓인 것들" 이다
for (int i = count - 1; i >= 0; i--) {
    visibleAreas[i] = RemainingArea(paths[i], bounds[i], covered, coveredBounds, layers[i].Area);
    Accumulate(ref covered, ref coveredBounds, paths[i], bounds[i]);
}

// 아래에서 위로 — 위에서도 안 보이는 레이어만 확인하면 된다.
// 위에서 보이는 레이어는 파묻힘이 될 수 없으므로 차집합을 돌릴 이유가 없다.
for (int i = 0; i < count; i++) {
    if (visibleAreas[i] <= 0f) { /* 아래쪽도 덮였는지 확인 */ }
}`,
        result: '양쪽 모두 완전히 가려진 레이어만 삭제 대상.',
      },
      callout: {
        kind: 'ok',
        title: '자기 성과가 최대로 보이는 벤치를 버렸다',
        body:
          '기존 벤치는 **정렬 접기**였다. 조각이 정확히 포개지는 퇴화 패턴이라 파묻힘이 이론적 최대로 나온다. ' +
          'S1-2 를 넣자 16회차 5,041장이 **3회차 3장으로 수렴**해 벤치가 끊겼다. 증폭이 사라진 건 성과지만 두 가지가 문제였다 — ' +
          '**측정 불가**(곡선이 안 나온다)와 **과장**(실제 플레이에서 거의 안 일어난다). ' +
          '그래서 어긋나게 겹치는 **임의 접기 벤치**를 새로 만들고, 성과가 더 커 보이는 정렬 벤치는 폐기했다. ' +
          '임의 벤치에서도 337 → 57(5.9배)이 나와 정직한 수치로 성립했다.',
      },
    },

    {
      no: 'S2-a',
      tag: '구조',
      tagKind: 'struct',
      title: '레이어별 뷰를 버리고 앞/뒤 2메시로 병합',
      gist: '무거운 건 "무엇을 그리느냐" 가 아니라 "몇 개의 객체로 그리느냐" 였다 — 정점은 251개뿐이다.',
      delta: '−62.4%',
      deltaSub: '직전 대비 · 누적 −90.3% · 드로우콜 +71 → +1',
      viz: 'renderer',
      what:
        '레이어마다 GameObject + MeshFilter + MeshRenderer + Mesh 를 두던 것을 **전부 버렸다.** ' +
        '렌더러가 메시 **두 개**(앞면 · 뒷면)만 소유하고 전 레이어 폴리곤을 `IsFolded` 로 갈라 이어붙인다.',
      why:
        '쌓임 순서는 정점 z 에 구워 넣고 가림은 **z-buffer** 에 맡긴다. 앞/뒤 구분은 두 메시의 머티리얼로만 한다 ' +
        '(넘어간 조각도 winding 이 앞면으로 맞춰져 있어 컬링 문제가 없다). ' +
        '"보이는 면만 그리기"(폴리곤 불리언)는 **쓰지 않았다** — 정점이 251개뿐이라 계산이 이득보다 비싸다.',
      results: [
        '**렌더 오브젝트가 레이어 수와 무관하게 2개로 고정** — 77 → 2',
        '드로우콜 **+71 → +1** · `Renderer.Sync` **−81.2%** (0.1129 → 0.0212 ms)',
        '레이어당 뷰가 사라지며 `PaperLayerView` 와 그 마커도 함께 폐기',
      ],
      table: {
        title: '왜 드로우콜이 렌더러 수와 거의 1:1 이었나 — 배칭 3종 점검',
        headers: ['기법', '하는 일', '우리 경우'],
        rows: [
          ['SRP Batcher', '**드로우콜을 합치지 않는다.** 셰이더 variant 별로 상태를 묶어 `SetPass` 와 CPU 상태 설정을 줄인다', '켜짐 — draw 는 그대로 나감'],
          ['Dynamic Batching', '소형 메시를 실제로 합쳐 드로우콜을 줄인다', '**꺼져 있음**'],
          ['GPU Instancing', '같은 메시+머티리얼을 인스턴스로 묶는다', '**레이어마다 메시가 달라 적용 불가**'],
        ],
      },
      tableNote:
        'SetPass 는 전 단계 19~20 으로 평평했다(머티리얼 2종 + SRP Batcher). ' +
        '**즉 S0 의 부담은 SetPass 가 아니라 드로우콜 자체였다.** ' +
        '⚠️ 이 1:1 관계에 기대지 않는다 — 배칭 설정이나 콘텐츠가 바뀌면 깨지므로 렌더 오브젝트 수와 드로우콜을 **따로 재서 병기**한다.',
      callout: {
        kind: 'warn',
        title: '의식적으로 포기한 것 — `TransformAccessArray` 통로',
        body:
          '리팩터 설계 때 "이후 DOTS 단계에서 `TransformAccessArray` 를 적용할 자리" 로 레이어당 Transform 을 일부러 남겨뒀었다. ' +
          '병합이 그 자리를 없앤다. **그래도 병합을 택했다** — 원래 이득이 미미했고(z 쓰기는 이미 값 비교 가드가 있었다), 그건 성능이 아니라 **시연 소재**였다. ' +
          '드로우콜 298 → 1 과 바꿀 것이 못 된다.',
      },
    },

    {
      no: 'S2-b',
      tag: 'DOTS',
      tagKind: 'dots',
      title: '분할을 Burst 잡 + 네이티브 버퍼로',
      gist: '리팩터 때 남겨둔 모양(레이어별 독립 · 정점이 한 곳)이 그대로 잡 입력이 됐다.',
      delta: '−35.5%',
      deltaSub: '직전 대비 · 누적 −93.8% · `Split` −56.3%',
      viz: 'job',
      what:
        '보간 중 매 프레임 `PaperData` · `PaperLayer` · `List<Vector2>` 를 레이어 수만큼 새로 만들던 것을 버렸다. ' +
        '분할은 이제 **Burst 잡**이 `NativeArray` 위에서 하고, 결과를 관리형으로 옮기지 않는다. ' +
        '관리형 `FoldOperation` 은 런타임에서 빠지고 **테스트 오라클로만 남았다.**',
      why:
        '리팩터 단계에서 이 구조를 **일부러 남겨뒀다** — 레이어별로 완전히 독립적인 계산이고, 정점이 `PaperLayer` 한 곳에 모여 있어 ' +
        '`NativeArray<float2>` 전환 지점이 하나였다. 잡으로 옮기기에 모양이 이미 맞아 있었다.',
      designPoints: [
        ['기준은 폴드당 한 번만 업로드', '보간 중 기준 상태는 `StartFold`~`ConfirmFold` 내내 고정이다. 매 프레임 바뀌는 것은 접는 선 세 값(중점·법선·축)뿐 — 같은 입력 배열에 선만 바꿔 잡을 다시 돌린다.'],
        ['출력 자리를 미리 배정', '레이어 i 는 자기 몫의 두 칸에만 쓴다. 구간이 겹치지 않아 경쟁이 없고 **결과 순서가 스레드 속도와 무관하게 결정된다.** 쌓임 순서가 곧 종이의 앞뒤라 이 결정성이 필수다.'],
        ['Compose 는 자료구조가 아니라 순회 순서', '제자리 조각을 `i=0→n-1`, 넘어간 조각을 `i=n-1→0` 으로 훑으면 관리형과 같은 쌓임 순서가 나온다 — 복사가 한 번도 일어나지 않는다.'],
        ['버퍼는 `Persistent` 재사용', '부족하면 2배 성장. `TempJob` 은 4프레임 제한이라 수백 프레임짜리 드래그에 못 쓴다.'],
        ['렌더러는 항상 네이티브 뷰에서 그린다', '접는 선이 없으면 기준 버퍼를, 보간 중이면 잡 출력 버퍼를 가리킨다. 그리는 코드는 하나다. 확정 순간에만 `PaperData` 로 옮기므로 **눈에 보이던 모양과 저장되는 모양이 어긋날 수 없다.**'],
      ],
      results: [
        '`FoldOperation.Split` **−56.3%** (0.0403 → 0.0176 ms) — Burst 잡의 몫',
        '보간 프레임 관리형 할당 **−63.8% 바이트 / −87.1% 횟수** (에디터 바닥 차감 후, r13~16 중앙값)',
        '**할당이 레이어 수에 비례하지 않게 됐다** — 회차별 평균 할당 횟수 S2-a 747→960(증가) vs S2-b 469→443(평평)',
        '⚠️ **"접기의 GC 쓰레기를 없앴다" 고 말하면 거짓이다** — 없앤 것은 *보간 프레임*의 것. 확정 프레임의 1.74MB(`PruneBuried`)는 그대로다',
      ],
      code: {
        title: 'PaperSplitLayersJob — IJobParallelFor',
        intro: '자기 인덱스가 아니라 배정된 구간에 쓰므로 병렬 제약을 푼다. 구간이 레이어마다 분리돼 있어 겹쳐 쓸 일이 없다.',
        code: `[BurstCompile]
public struct PaperSplitLayersJob : IJobParallelFor
{
    [ReadOnly] public NativeArray<float2> BaseVertices;
    [ReadOnly] public NativeArray<int2>   BaseRanges;   // [i] = (정점 시작, 정점 수)
    [ReadOnly] public NativeArray<int>    SlotStarts;   // [i] = 출력 시작 위치

    [NativeDisableParallelForRestriction] public NativeArray<float2> OutVertices;
    public NativeArray<int2> OutFixed;    // 제자리 조각
    public NativeArray<int2> OutFlipped;  // 넘어간 조각

    public float2 MidPoint, LineNormal, FoldAxis;   // 매 프레임 바뀌는 유일한 입력

    public void Execute(int index) {
        int2 range        = BaseRanges[index];
        int  capacity     = range.y + SlotMargin;
        int  fixedStart   = SlotStarts[index];
        int  flippedStart = fixedStart + capacity;

        PaperGeometryNative.SplitConvex(..., out int fixedCount, out int flippedCount);

        OutFixed[index]   = new int2(fixedStart,   fixedCount);
        OutFlipped[index] = new int2(flippedStart, flippedCount);
    }
}`,
        result: '볼록을 직선으로 자르면 조각 정점은 n+1 을 넘지 않는다 — 칸 크기를 미리 정할 수 있는 근거이자 자리 배정이 성립하는 이유.',
      },
      mermaid: `graph LR
    START["StartFold<br/>기준 1회 업로드"]
    LINE["매 프레임<br/>접는 선 3값만 교체"]
    JOB["PaperSplitLayersJob<br/>Burst · IJobParallelFor"]
    OUT["NativeArray 출력<br/>자리 사전 배정 = 결정론"]
    VIEW["PaperFoldResultView<br/>기준 or 잡 출력"]
    REND["PaperRenderer<br/>앞/뒤 2메시"]
    CONF["ConfirmFold<br/>이때만 PaperData 로"]

    START --> JOB
    LINE --> JOB --> OUT --> VIEW --> REND
    OUT -.확정 순간.-> CONF

    classDef a fill:#e6efdf,stroke:#7ea571,color:#283825
    classDef b fill:#f6ecd2,stroke:#c19a4a,color:#3a2a10
    classDef c fill:#f5dcd2,stroke:#c8674f,color:#3a1810
    class START,LINE a
    class JOB,OUT b
    class VIEW,REND,CONF c`,
    },
  ],

  // 레이어 곡선 (§04 도입부)
  layerCurve: {
    caption: '회차별 레이어 수 — 같은 접는 선, 다른 엔진. S1-2 부터 곡선의 모양 자체가 바뀐다.',
    yMax: 350,
    series: [
      { k: 'S0/S1-1', color: 'var(--ink-3)',    endLabel: '337장', area: true,
        values: [2, 4, 7, 11, 19, 31, 53, 65, 75, 107, 107, 135, 183, 255, 265, 337] },
      { k: 'S1-2+',   color: 'var(--sage-500)', endLabel: '57장',  area: false,
        values: [2, 4, 7, 10, 12, 17, 23, 22, 26, 31, 28, 36, 44, 50, 53, 57] },
    ],
  },

  // ─── §05 정확성 ─────────────────────────────────────────
  correctness: {
    gist: '판단 기준을 순서대로 못박고 시작했다 — 1순위 정확성, 2순위 개선 효과, 3순위 DOTS 친화성.',
    lede: 'DOTS 로 가기 좋다는 이유로 부정확한 방식을 고르지 않는다.',
    sameStimulus: {
      title: '다섯 버전이 완전히 같은 결과를 내야 한다',
      body:
        '삭제 · 재사용 · 병합 · 잡은 **어떻게** 계산하고 그리느냐지 **무엇을** 접느냐가 아니다. ' +
        '논증으로 끝내지 않고 **실측으로 확인했다** — 회차마다 `bbox / angle / ratio` 를 F6 정밀도로 찍어 CSV 를 대조했고 전 회차 일치했다.',
      headers: ['', 'S0', 'S1-1', 'S1-2', 'S2-a', 'S2-b'],
      rows: [
        ['레이어 @16회차', '337', '337', '**57**', '57', '57'],
        ['정점 @16회차',   '1,348', '1,348', '**251**', '251', '251'],
      ],
      note: 'S0·S1-1 은 삭제가 없으므로 서로 완전히 같아야 하고, 실제로 같다. S1-2 부터 갈라지며, 그 뒤로는 렌더링·연산 방식만 바뀌었으므로 다시 완전히 같다.',
    },
    tests: {
      title: '네이티브 구현은 관리형 구현을 오라클로 검증한다',
      rows: [
        ['`PaperGeometryNativeTests`',    '폴리곤 한 장 분할 ↔ `PaperGeometry`', '임의 **400** 케이스'],
        ['`PaperFoldSplitPipelineTests`', '파이프라인 전체 ↔ `FoldOperation.Preview`', '임의 **200** 케이스'],
        ['`PaperVisibilityTests`',        '가시성 · 파묻힘 회귀', '**16** 케이스'],
      ],
      note:
        '파이프라인 테스트가 따로 필요한 이유 — 폴리곤 한 장짜리 오라클은 **쌓임 순서**를 검증하지 못한다. ' +
        '순서가 틀리면 화면에서는 색이 살짝 다른 정도로만 보여 눈으로 잡기 어렵다.',
    },
  },

  // ─── §06 측정 신뢰 ──────────────────────────────────────
  rigor: {
    gist: '성능 작업에서 가장 비싼 실수는 틀린 수치를 믿는 것이다 — 가설 2건 기각, 발표 수치 1건 철회.',
    cards: [
      {
        kind: 'kill', badge: '기각 01',
        title: '"10ms 스파이크는 뷰 풀 확장 때문이다"',
        body: 'S1-1 · S1-2 문서에 그렇게 적고 병합하면 사라질 것이라 예상했다. **GameObject 를 전부 없앤 S2-a 에서도 그대로 남았다**(10.06 → 9.84ms, 노이즈 안). 기각.',
      },
      {
        kind: 'kill', badge: '기각 02',
        title: '"그럼 GC 정지다"',
        body: '1회 실행의 상관관계로 단정했다가 3회차에서 반증. 할당이 **더 큰** 프레임(1.74MB / 24,102회)의 `Sync` 가 전부 정상(0.18ms)이었고, 재측정 한 번에서는 스파이크가 **아예 없었다**(최대 0.327ms).',
      },
      {
        kind: 'fix', badge: '재측정',
        title: '`Debug.Log` 한 줄이 `Renderer.Sync` 비용의 89.8% 였다',
        body: '`Sync` 229,300ns 중 Fill 8,800(3.8%) · Upload 12,900(5.6%) · **Log 205,900(89.8%).** 이 상수가 전 단계에 똑같이 얹혀 **개선률을 일관되게 과소표시**하고 있었다. 가드를 넣고 **5단계 전부 다시 쟀다** — 총 개선 −70.0% → **−93.8%**.',
      },
      {
        kind: 'fix', badge: '철회',
        title: '내가 발표한 "Sync −27%" 를 스스로 철회했다',
        body: 'S2-b 문서에 "`NativeArray` 직접 인덱싱 덕에 −27%" 라고 **[추론] 미검증** 표시와 함께 적었다. 로그를 걷어내고 재면 −3.3%, 노이즈 안이다. −27% 는 두 단계의 **로그 비용 차이**였다. **S2-b 에서 실재하는 개선은 Split −56.3% 다.**',
      },
    ],
    lesson: '**단일 이상치에 메커니즘을 붙이지 말 것.** 가설 두 개를 연속으로 기각하고 나서 남은 결론은, 재현성 확인이 가장 싸고 가장 결정적이었다는 것이다.',
  },

  // ─── §07 데이터 ─────────────────────────────────────────
  data: {
    gist: 'CPU 시간과 렌더링, 두 축을 병기한다 — 한 축만 보면 각 단계의 값어치를 잘못 읽는다.',
    bars: [
      {
        title: '프레임당 CPU 비용', unit: 'ms · 마커 3종 합 (Average)', accent: 'sage',
        rows: [
          { k: 'S0',   v: 0.643, t: '0.643', note: '기준선' },
          { k: 'S1-1', v: 0.373, t: '0.373', note: '' },
          { k: 'S1-2', v: 0.165, t: '0.165', note: '' },
          { k: 'S2-a', v: 0.062, t: '0.062', note: '' },
          { k: 'S2-b', v: 0.040, t: '0.040', note: 'S0 대비 −93.8%' },
        ],
      },
      {
        title: '드로우콜 (16회차)', unit: '개 · 정지 대조군 대비 델타', accent: 'terra',
        rows: [
          { k: 'S0',   v: 298, t: '+298', note: '레이어 1장 = 렌더러 1개' },
          { k: 'S1-1', v: 297, t: '+297', note: '' },
          { k: 'S1-2', v: 71,  t: '+71',  note: '' },
          { k: 'S2-a', v: 1,   t: '+1',   note: '앞/뒤 2메시 병합' },
          { k: 'S2-b', v: 1,   t: '+1',   note: '' },
        ],
      },
    ],
    axisNote:
      '**S2-a 는 CPU 축에서 −62.4%, 렌더링 축에서 +71 → +1 이다.** CPU 만 봤으면 이 단계의 값어치를 절반만 읽었을 것이다. ' +
      '반대로 S1-2 는 프레임당 Average 로는 작아 보이지만 레이어 수를 5.9배 줄여 메모리·객체 수를 직접 낮춘다.',
    tables: [
      {
        title: '프레임당 CPU 비용 (Average, ms) — 로그 배제 시리즈',
        headers: ['마커', 'S0', 'S1-1', 'S1-2', 'S2-a', 'S2-b'],
        rows: [
          ['`Renderer.Sync`',         '0.4525', '0.2759', '0.1129', '0.0212', '**0.0205**'],
          ['`FoldOperation.Split`',   '0.1700', '0.0951', '0.0503', '0.0403', '**0.0176**'],
          ['`FoldOperation.Compose`', '0.0201', '0.0023', '0.0014', '0.0011', '0.0016'],
          ['**합**',                  '**0.643**', '**0.373**', '**0.165**', '**0.062**', '**0.040**'],
          ['**S0 대비**',             '—', '−41.9%', '−74.4%', '−90.3%', '**−93.8%**'],
        ],
      },
      {
        title: '렌더링 축 — 렌더 오브젝트 수 / 드로우콜 (정지 대조군 대비 델타)',
        headers: ['회차', 'S0', 'S1-1', 'S1-2', 'S2-a', 'S2-b'],
        rows: [
          ['렌더러 @8',   '81',   '81',   '42',  '**2**',  '2'],
          ['렌더러 @16',  '337',  '337',  '77',  '**2**',  '2'],
          ['드로우콜 @8',  '+74',  '+71',  '+39', '**+1**', '+1'],
          ['드로우콜 @16', '+298', '+297', '+71', '**+1**', '+1'],
        ],
      },
    ],
    note:
      '표는 전부 `summarize.py` 가 `S{N}-nolog-random-results.csv` 에서 생성한다 — 손으로 고치지 않는다. ' +
      'CSV 는 `export_results.py` 가 `TestResults.xml` 에 심긴 결과를 직접 읽어 쓴다(GUI export 미사용).',
  },

  // ─── §08 한계 ───────────────────────────────────────────
  limitsGist: '에디터 측정만 있고 기기 실측은 없다. 남은 병목은 확정 프레임의 `PruneBuried` 하나로 좁혀져 있다.',
  limits: [
    ['기기 실측이 아직 없다', '측정은 전부 에디터 PlayMode 다. 정지 대조군 델타로 비교는 성립하지만 **기기에서의 절대 드로우콜·GPU 시간은 다른 이야기**다. development build 실측이 다음 과제.'],
    ['확정 프레임 할당은 그대로', '보간 프레임의 관리형 쓰레기는 −87% 로 줄었지만, 확정 프레임 최대 1.74MB / 24,102회는 거의 그대로다. 주인은 `PruneBuried`(Clipper2 폴리곤 불리언) — **다음 대상.**'],
    ['가시성 계산은 아직 관리형', '`PaperVisibility` 는 Clipper2 + `List` 기반이다. 네이티브 전환 여지가 남아 있고, 그게 위 항목과 같은 대상이다.'],
    ['규명하지 않은 잔량', 'S2-b 보간 프레임에 7,696B / 31회가 남는다. 레이어 수와 함께 늘지 않는 상수라 더 파지 않았다.'],
    ['`GC.CollectionCount` 미검증', '전 구간 0이었고 Reserved 1,581MB / Used 1,169MB 라 수집이 필요 없었다는 해석이 자연스럽다. 다만 **이 카운터가 이 환경에서 실제로 증가하는지 대조군을 돌려보지 않았다.**'],
  ],
};
