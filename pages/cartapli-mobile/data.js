// pages/cartapli-mobile/data.js
// Public copy SSOT. Upstream: knowledge_base/projects/cartapli_mobile/research/portfolio-flow.md
// Scope: Windows PC · Unity Editor PlayMode · same deterministic 16-fold benchmark.

window.CM_DATA = {
  meta: {
    eyebrow: 'ANDROID TECHNICAL PROTOTYPE',
    title: 'Cartapli Mobile',
    subtitle: '종이접기 전투를 Android에서 검증하기 위해 시뮬레이션 실행 구조를 다시 설계한 기술 프로토타입',
    core: '같은 접기 입력을 반복 계측해 파묻힌 레이어를 제거하고, 렌더러를 두 메시로 합친 뒤, 분할 연산을 NativeArray·Job·Burst 경로로 옮겼다.',
    // 기간 · 스택은 덱(목차 · 표지 배지)이 읽는 필드다. 기간은 저장소 커밋 범위 실측
    // (첫 커밋 2026-07-22 · 마지막 2026-08-13), 스택은 아래 facts · boundary 에 이미 있는 것만 옮겼다.
    period: '2026.07 ~ 2026.08',
    stack: ['Unity 6.3', 'URP 17.3', 'Burst · Job', 'NativeArray'],
    links: [
      { label: 'Architecture', href: '#architecture' },
      { label: 'Optimization result', href: '#result' },
      { label: 'GitHub', href: 'https://github.com/OliveGreenKR/Cartapli_mobile', external: true },
      { label: 'Steam original', href: 'https://store.steampowered.com/app/4314560/', external: true },
    ],
    metrics: [
      { value: '−93.8%', label: '프레임당 CPU 마커 합', detail: '0.643 → 0.040 ms', note: '전체 개선 전 → Native 결합 후 · S0→S2-b' },
      { value: '−99.7%', label: '드로우콜 증분', detail: '+298 → +1', note: '초기 구조 → 2메시 병합 후 · 정지 대조군 대비' },
      { value: '−99.4%', label: '렌더 오브젝트', detail: '337 → 2', note: '초기 구조 → 2메시 병합 후 · 16회차' },
    ],
    media: {
      src: 'cartapli-mobile/assets/fold-manual.gif',
      width: 1308,
      height: 602,
      alt: 'PaperBench에서 접는 선을 움직여 종이를 접는 측정 입력',
      caption: 'PaperBench 측정 입력 · 실제 전투 화면이 아닌 접기 파이프라인 검증 장면',
    },
    facts: [
      'Mobile 저장소 단일 Git 저자',
      'Unity 6.3 · URP 17.3',
      'Android · Min SDK 25 · ARM64',
      'Android 빌드 테스트 전',
    ],
    boundary: '출시 원작과 별도 저장소다. Mobile에서 시뮬레이션 실행 순서 제어, 파묻힘 판정, 2메시 렌더러, NativeArray·Job·Burst 결합 경로와 계측 인프라를 구현했다.',
  },

  architecture: {
    gist: '`BattleSimulation`이 종이·표면·기하·이동·판단의 순서를 소유하고, 계산과 화면 반영을 서로 다른 프레임 단계에 둔다.',
    body: '가변 프레임은 접기 입력을 따라가고, 고정 스텝은 이동과 판정을 결정한다. 종이 분할 Job은 계산 단계에서 예약하고 화면 반영 단계에서 완료해, 그 사이를 작업 스레드의 실행 시간으로 사용한다.',
    systems: [
      { tag: 'ORDER OWNER', title: 'BattleSimulation', body: '`SimTick`의 단일 진입점. 하위 월드를 정해진 순서로 호출한다.', tone: 'owner' },
      { tag: 'FRAME PHASES', title: 'FrameLoop · TickSystems', body: '계산(`SimTick`)과 화면 반영(`RenderTick`)의 호출 시점을 고정한다.' },
      { tag: 'PAPER', title: 'PaperController', body: '확정 종이 상태, 접는 선 보간기, 분할 파이프라인을 조립한다.' },
      { tag: 'SURFACE', title: 'SurfaceWorld', body: '종이 위 부착 위치를 확정 상태와 접기 미리보기로 나눠 해석한다.' },
      { tag: 'WORLD BRIDGE', title: 'WorldLink', body: '`IWorld` 위치를 가져와 이동시킨 뒤 종이 위 구속에 되돌려 쓴다.' },
      { tag: 'SIM WORLDS', title: 'GeoWorld · MotionWorld', body: '충돌 질의 도형을 갱신하고 이동 규칙과 고정 간격 적분을 실행한다.' },
      { tag: 'SCREEN OUTPUT', title: 'PaperRenderer · PaperOutlineRenderer', body: '`PaperRenderer`는 앞면·뒷면 두 메시를, 별도 `PaperOutlineRenderer`는 외곽선을 그린다.' },
    ],
    lanes: [
      {
        tag: 'VARIABLE FRAME',
        note: '입력 추종 · 매 프레임 1회',
        items: [
          ['01', 'Paper.Tick', '접는 선 보간 · 분할 Job 예약'],
          ['02', 'Surface.Resolve', '확정 상태가 바뀌면 부착 위치 재해석'],
          ['03', 'Fold Preview', '확정 전 임시 위치 적용'],
        ],
      },
      {
        tag: 'FIXED STEP',
        note: '프레임당 0~3회',
        items: [
          ['04', 'PaperTransit', '종이 월드의 기준틀 이동'],
          ['05', 'Geo.Sync', '현재 위치·회전으로 질의 도형 갱신'],
          ['06', 'WorldLink.Pull', '종이 구속 결과를 이동 상태로 가져오기'],
          ['07', 'Motion.Step', '이동 규칙 순회'],
          ['08', 'Motion.Integrate', '고정 dt 적분'],
          ['09', 'WorldLink.Push', '이동 결과를 종이 위 위치에 반영'],
          ['10', 'Judge', '최종 위치로 충돌·규칙 판단'],
        ],
      },
      {
        tag: 'PRESENTATION',
        note: '늦은 계산 뒤 · 화면 렌더링 전',
        items: [
          ['11', 'Pipeline.Complete', '예약한 분할 Job 완료 · 조각 쌓임 순서 구성'],
          ['12', 'PaperController.RenderTick', '`PaperRenderer.Sync` 두 메시 · `PaperOutlineRenderer.Sync` 외곽선'],
        ],
      },
    ],
    foldRule: '접는 선을 축으로 정점을 반사하고 순서를 뒤집어 뒷면 조각을 만든다. 선에 걸치지 않은 레이어는 분할하지 않고 원본 참조를 통과시킨다.',
    clock: ['FIXED-STEP CLOCK', 'Accumulate(unscaledDeltaTime × timeScale)', 'TryConsume → 프레임당 0~3 fixed steps'],
    confirm: [
      ['A', 'NotifyFoldConfirmed', '접기 전 좌표가 필요한 대상에 먼저 알림'],
      ['B', 'Paper.ConfirmFold', '지금 보이는 선으로 확정 · 파묻힘 제거'],
      ['C', 'Surface.Resolve', '새 확정 상태 기준으로 부착 위치 재해석'],
    ],
    decisions: [
      ['순서 소유', '하위 시스템의 등록 순서 대신 중앙 제어기가 실행 순서를 소유한다.'],
      ['월드 결합', '각 월드는 상대 타입을 모르고 `IWorld`의 위치 읽기·쓰기 계약으로 연결된다.'],
      ['화면 반영 분리', '계산 단계는 Job을 예약하고 `RenderTick`이 완료 결과를 화면에 반영한다.'],
    ],
  },

  result: {
    gist: '기준선(S0)부터 Native 결합 단계(S2-b)까지, 고정 seed 12345로 만든 같은 임의 접기 16회를 반복해 각 변경의 효과를 분리했다.',
    bars: [
      { stage: 'S0', label: '전량 재생성', ms: 0.643, delta: 'baseline', group: 'base' },
      { stage: 'S1-1', label: '원본 참조 재사용', ms: 0.373, delta: '−41.9%', group: 'structure' },
      { stage: 'S1-2', label: '파묻힌 레이어 삭제', ms: 0.165, delta: '−55.9%', group: 'structure' },
      { stage: 'S2-a', label: '앞·뒤 2메시 병합', ms: 0.062, delta: '−62.0%', group: 'structure' },
      { stage: 'S2-b', label: 'NativeArray·Job·Burst 결합', ms: 0.040, delta: '−36.3%', group: 'native' },
    ],
    correction: {
      title: '처음 수치를 버리고 전 단계를 다시 측정했다',
      body: '`Debug.Log` 한 줄이 `Renderer.Sync` 측정의 약 90%를 차지했다. 로그를 가드하고 퇴화한 정렬 입력을 임의 입력으로 교체한 뒤 S0~S2-b를 모두 재측정했다.',
    },
    conditions: [
      ['환경', 'Windows PC · Unity Editor PlayMode'],
      ['입력', '정사각형 5 · seed 12345 · 임의 접기 16회'],
      ['채택값', '`Sync + Split + Compose` 프레임당 Average 합'],
      ['해석', '단계 간 상대 비교 · Android 절대 성능 아님'],
    ],
    axes: [
      ['레이어', '337 → 57', 'S0 → S1-2 · 파묻힘 삭제'],
      ['렌더 오브젝트', '337 → 77 → 2', 'S0 → S1-2 → S2-a'],
      ['드로우콜 증분', '+298 → +71 → +1', 'S0 → S1-2 → S2-a'],
      ['Split Average', '0.0403 → 0.0176 ms', 'S2-a → S2-b · −56.3%'],
    ],
  },

  methods: [
    {
      id: 'reuse', no: '03', stage: 'S1-1', kind: 'STRUCTURE 01',
      title: '변하지 않은 레이어를 다시 만들지 않는다',
      gist: '접는 선에 걸치지 않은 레이어는 새 객체로 복제하지 않고 원본 참조를 그대로 통과시켰다.',
      metric: { value: '−41.9%', detail: '0.643 → 0.373 ms', label: '프레임당 마커 합' },
      before: { title: '기존 · 전량 재생성', items: ['모든 레이어 분할 시도', '새 PaperLayer 생성', '모든 Mesh 재생성'], footer: '변하지 않은 입력도 새 결과처럼 처리' },
      after: { title: '개선 · 동일성 보존', items: ['선의 앞/뒤/교차 먼저 분류', '앞쪽은 원본 참조 반환', '같은 참조면 메시 생성 생략'], footer: '실제로 바뀐 레이어만 재생성' },
      code: {
        before: {
          title: 'Before · FoldOperation / PaperLayerView',
          intro: '분할 결과를 항상 새 레이어로 만들고, 뷰는 매번 메시를 갱신했다.',
          code: `PaperGeometry.SplitPolygonByLine(
    layer.Vertices, layer.UVs, ...);

fixedLayers.Add(new PaperLayer(
    polyA, uvsA, layer.IsFolded, i));

public void UpdateMesh(PaperLayer layer)
{
    RegenerateMesh(layer.Vertices, layer.UVs);
}`,
          result: '입력이 같아도 할당과 메시 생성 반복',
        },
        after: {
          title: 'After · 385fd68',
          intro: '교차 전에 위치를 분류하고, 변하지 않은 레이어의 참조를 보존했다.',
          code: `PaperGeometry.PolygonSide side =
    PaperGeometry.ClassifyPolygon(
    layer.Vertices, midPoint, abDirection);

if (side == PaperGeometry.PolygonSide.Front)
{
    fixedLayers.Add(layer);
    continue;
}

if (ReferenceEquals(_lastLayer, layer))
    return;`,
          result: '원본 참조가 뷰의 메시 생성 생략 근거가 됨',
        },
      },
      note: '이 단계의 레이어별 뷰 생략 경로는 S2-a의 2메시 병합에서 사라진다. 단계별 측정은 다음 병목이 레이어별 Unity Object임을 드러내는 역할을 했다.',
      scope: 'S0 → S1-1 · Windows PC · Unity Editor PlayMode · 동일 입력',
    },
    {
      id: 'prune', no: '04', stage: 'S1-2', kind: 'STRUCTURE 02',
      title: '확정 순간 파묻힌 조각을 제거한다',
      gist: '다른 조각에 앞·뒤 모두 가려져 다시 드러날 수 없는 조각은 확정 데이터로 옮기기 전에 버렸다.',
      metric: { value: '−55.9%', detail: '0.373 → 0.165 ms', label: '프레임당 마커 합' },
      before: { title: '기존 · 숨은 조각 유지', items: ['접을수록 레이어 누적', '16회차 레이어 337개', '정점 1,348개'], footer: '보이지 않아도 다음 분할 입력에 포함' },
      after: { title: '개선 · 확정 때 제거', items: ['앞·뒤 가려짐 판정', '파묻힌 조각 제거', '레이어 57개 · 정점 251개'], footer: '같은 접기를 5.9배 적은 레이어로 표현' },
      code: {
        before: {
          title: 'Before · 모든 결과를 관리형 상태로',
          intro: '분할된 조각을 가시성과 무관하게 전부 다음 확정 상태로 보존했다.',
          code: `FoldSplitResult split = FoldOperation.Split(
    source, localA, localB);

PaperData preview = FoldOperation.Compose(
    source, split, allowFullFlip);

_confirmed = preview;`,
          result: '파묻힌 조각도 다음 접기의 입력이 됨',
        },
        after: {
          title: 'After · PaperController 호출 지점 둘',
          intro: '매 프레임 경로는 분할만 예약한다. 파묻힘 판정은 접기 확정 경로에만 있다.',
          code: `// TickSimulation - 매 프레임
ScheduleSplit(_animator.PointA,
              _animator.CurrentPointB);
_needsSync = true;
// 판정 없음

// ConfirmFold - 접기 확정 때만
PushHistory(new FoldHistoryEntry(...));
ScheduleSplit(localA, localB);
_pipeline.Complete(_allowFullFlip);
_pipeline.PruneBuriedPieces();
_confirmed =
    _pipeline.MarshalToPaperData(_baseData);`,
          result: '판정이 매 프레임 경로에서 빠져 확정 프레임 한 곳으로 모임',
        },
      },
      // 왜 판정만 확정으로 옮겼나 — 두 연산의 단가가 다르다. 출처 docs/perf/S2-d-single-cover.md:81
      costs: [
        ['분할', '종이 한 장을 직선 하나로 자른다. 장당 독립이고 정점 수에 비례한다. 네이티브 버퍼를 재사용해 할당이 없다.', '13.4 µs', '매 프레임'],
        ['판정', '조각이 다른 조각들에 완전히 파묻혔는지 본다. 조각×조각 비교 뒤 볼록 뺄셈으로 조각을 분해한다.', '0.256 ms', '확정 1회'],
      ],
      // 1회 단가 비율이다. 총 CPU 분배가 아니다 — 주기가 달라 그렇게 섞으면 안 된다.
      costRatio: [['분할', 5], ['판정', 95]],
      costRatioLabel: '1회 단가 비율 · 판정 1회 = 분할 약 19회분',
      costScope: '16회차 · 같은 CSV 를 진행도 16등분한 중앙값 · 채택 판정 정책(볼록 뺄셈) 기준 · 주기가 달라 총 CPU 로 합산하지 않는다',
      note: '판정 비용은 매 프레임이 아니라 접기 확정 프레임으로 이동했다. 되돌리기는 제거 전 상태 사본이 담당한다.',
      scope: 'S1-1 → S1-2 · Windows PC · Unity Editor PlayMode · 레이어/정점은 16회차 종단값',
    },
    {
      id: 'merge', no: '05', stage: 'S2-a', kind: 'RENDER STRUCTURE',
      title: '레이어별 Unity Object를 앞·뒤 두 메시로 합친다',
      gist: '정점 수보다 객체 수가 병목이었다. 레이어별 GameObject·MeshRenderer·Mesh를 버리고 쌓임 순서를 정점 z에 구웠다.',
      metric: { value: '−98.6%', detail: '+71 → +1', label: 'S1-2 → S2-a 드로우콜 증분' },
      before: { title: '기존 · 레이어마다 뷰', items: ['GameObject + MeshFilter', 'MeshRenderer + Mesh', 'S1-2 최대 77개'], footer: '레이어 수만큼 드로우콜 제출' },
      after: { title: '개선 · 면별 병합 메시', items: ['앞면 버퍼 하나', '뒷면 버퍼 하나', '렌더 오브젝트 2개 고정'], footer: 'z-buffer가 조각 쌓임 순서 처리' },
      code: {
        before: {
          title: 'Before · PaperLayerView pool',
          intro: '보이는 레이어마다 뷰를 배정하고 각 Mesh를 따로 갱신했다.',
          code: `EnsureCapacity(CountVisible(data));

for (int i = 0; i < data.LayerCount; i++)
{
    PaperLayerView view = _views[viewIndex++];
    view.UpdateMesh(data.Layers[i]);
    view.SetMaterial(material);
    view.SetStackOrder(i, _stackSpacing);
}`,
          result: 'S1-2 렌더 오브젝트 77 · 드로우콜 증분 +71',
        },
        after: {
          title: 'After · PaperRenderer.Sync',
          intro: '조각을 면별 버퍼에 이어붙이고 두 Mesh만 업로드한다.',
          code: `for (int i = 0; i < view.PieceCount; i++)
{
    PaperPiece piece = view.Pieces[i];
    float z = -i * _stackSpacing;

    if (piece.IsFolded) AppendPiece(..., _backPositions);
    else AppendPiece(..., _frontPositions);
}

UploadMesh(_frontMesh, ...);
UploadMesh(_backMesh, ...);`,
          result: '렌더 오브젝트 2 · 드로우콜 증분 +1',
        },
      },
      note: '정점은 이미 251개뿐이어서 “보이는 면만” 다시 만드는 폴리곤 불리언은 선택하지 않았다. 이 단계는 적은 정점을 더 적은 Unity Object로 제출하는 문제에 집중했다.',
      scope: 'S1-2 → S2-a · Windows PC · Unity Editor PlayMode · 드로우콜은 정지 대조군 대비 증분 · 16회차',
    },
    {
      id: 'native', no: '06', stage: 'S2-b', kind: 'NATIVE / JOB / BURST',
      title: '매 프레임 관리형 조각 그래프를 만들지 않는다',
      gist: '폴드 기준 형상은 한 번만 NativeArray에 올리고, 매 프레임 바뀌는 접는 선 세 값만 Job에 전달했다.',
      metric: { value: '−56.3%', detail: '0.0403 → 0.0176 ms', label: 'Split Average' },
      before: { title: '기존 · 관리형 미리보기', items: ['매 프레임 PaperData', 'PaperLayer + List<Vector2>', '즉시 계산 후 화면 반영'], footer: '레이어 수에 비례해 임시 객체 생성' },
      after: { title: '개선 · 재사용 네이티브 버퍼', items: ['접기당 기준 1회 업로드', '매 프레임 선 3값 + Job', '화면 반영 단계에서 완료'], footer: '확정 순간에만 PaperData로 변환' },
      code: {
        before: {
          title: 'Before · managed FoldOperation.Preview',
          intro: '계산 단계에서 관리형 조각 그래프를 완성한 뒤 화면 반영 대상으로 넘겼다.',
          code: `UpdateFoldLineCache(pointA, pointB);

SetPresented(FoldOperation.Preview(
    _baseData,
    pointA,
    pointB,
    _allowFullFlip));

_paperRenderer.Sync(_presented);`,
          result: '분할·Compose·관리형 생성이 한 경로에 결합',
        },
        after: {
          title: 'After · PaperFoldSplitPipeline 버퍼 수명',
          intro: '버퍼는 접기 확정 때 한 번 잡는다. 매 프레임에는 같은 버퍼를 다시 가리키고 접는 선 세 값만 넘긴다.',
          code: `// SetBase - 접기 확정 때 한 번
EnsureCapacity(ref _baseVertices, vertexTotal);
// 이미 충분하면 재할당하지 않는다
_baseVertices[range.x + v] = ...;

// Schedule - 매 프레임
var job = new PaperSplitLayersJob {
    BaseVertices = _baseVertices,  // 같은 버퍼
    MidPoint  = midPoint,
    LineNormal = lineNormal,
    FoldAxis  = foldAxis
};
_handle = job.Schedule(_baseLayerCount, ...);`,
          result: '접기당 1회 확보 · 매 프레임은 선 3값만 · Persistent 로 드래그 내내 유지',
        },
      },
      note: 'S2-b는 NativeArray·Job·Burst를 함께 바꾼 결합 단계다. Compose는 조각 순회 때문에 0.0011→0.0016ms로 늘었지만 전체 합은 0.062→0.040ms로 감소했다.',
      scope: 'S2-a → S2-b 결합 변경 · Windows PC · Unity Editor PlayMode · 프레임당 Average',
    },
  ],

  validation: {
    intro: '공개 수치는 같은 Windows PC의 Unity Editor에서 단계 간 차이를 비교한 결과다.',
    columns: [
      { title: '확인한 것', items: ['고정 seed로 만든 동일 입력의 단계별 원본 CSV', '렌더 JSON의 오브젝트·드로우콜 증분', '실코드와 단계 커밋의 기존/개선 비교'] },
      { title: '적용 범위', items: ['Windows PC · Unity Editor PlayMode', 'CPU marker 상대 비교', 'PaperBench 16회 입력'] },
      { title: '다음 검증', items: ['Android 빌드와 기기 CPU/GPU 계측', '분할·가려짐·파이프라인 테스트 실행 결과 파일 보존', '대표 전투 화면 캡처'] },
    ],
  },
};
