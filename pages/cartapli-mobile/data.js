(function defineCartapliMobileData() {
  const editor = 'Windows PC · Unity Editor PlayMode';

  window.CM_DATA = {
    meta: {
      eyebrow: 'ANDROID TECH PROTOTYPE · 2026',
      title: 'Cartapli Mobile',
      oneLine: 'Steam 출시 원작의 종이접기 전투를 Android 대상으로 별도 저장소에서 재구성한 기술 프로토타입',
      role: '시뮬레이션 실행 순서 · 종이접기 파이프라인 · 표면/이동/기하 월드 · 계측 인프라 직접 구현',
      scope: '활성 빌드 장면은 PaperBench 1개. Android 빌드·기기 계측은 아직 수행하지 않았다.',
      period: '2026.07–08',
      platform: 'Unity 6 · URP · C# · Burst · Jobs · NativeArray',
      links: [
        { label: 'Steam 원작', href: 'https://store.steampowered.com/app/4314560/', external: true },
      ],
    },

    hero: {
      image: 'cartapli-mobile/assets/fold-manual.gif',
      imageAlt: 'PaperBench에서 종이를 수동으로 접고 디버그 오버레이로 측정 입력을 확인하는 장면',
      imageCaption: 'PaperBench의 측정 자극과 디버그 오버레이. 완성 Battle gameplay 화면이 아니다.',
      lede: '종이 구조의 작업량과 렌더 구조를 먼저 줄이고, Native 데이터 경로를 정리한 뒤, 일의 크기와 한 틱 지연 가능성에 맞춰 실행 위치까지 다시 골랐다.',
      metrics: [
        {
          value: '−96.0%',
          label: '종이 프레임 경로 측정 비용',
          detail: '0.643 → 0.026 ms',
          mobileNote: '동일 입력 16회 · Bounds/워커 실행 제외',
          condition: `${editor} · 동일 임의 접기 16회 · Bounds/워커 실행 제외`,
        },
        {
          value: '−99.7%',
          label: '드로우콜 델타',
          detail: '+298 → +1',
          mobileNote: '정지 대조군 · 16회차',
          condition: `${editor} · 종이 16회 접기 뒤 · 정지 대조군 대비`,
        },
        {
          value: '−99.4%',
          label: '렌더 오브젝트',
          detail: '337 → 2',
          mobileNote: '종이 16회 접기 뒤',
          condition: `${editor} · 종이 16회 접기 뒤`,
        },
      ],
      metricConditions: [
        '프레임 경로 · 동일 입력 16회 Average · Renderer.Sync + Split + Compose · Bounds/워커 실행 제외',
        '렌더 구조 · 종이 16회 접기 뒤 · 드로우콜만 정지 대조군 대비 델타',
      ],
      facts: [
        ['목적', 'Android용 종이접기 전투 재구성'],
        ['직접 기여', 'Mobile 저장소의 실행 순서·Paper/Surface/Movement/Geometry World·계측'],
        ['현재 장면', 'PaperBench 1개'],
        ['검증 경계', 'Android 빌드·기기 CPU/GPU/FPS 미측정'],
      ],
    },

    architecture: {
      intro: '종이를 접으면 전투 공간 자체가 바뀌고, 그 위의 표면 좌표를 다시 해석한 뒤 이동·기하·판정을 수행한다. `BattleSimulation`이 이 순서를 한 프레임 안에서 통제한다.',
      premise: '접을 수 있는 종이가 곧 전투 공간이다.',
      components: [
        { id: 'battle', name: 'BattleSimulation', role: '가변 프레임과 고정 스텝의 호출 순서 소유', tone: 'controller' },
        { id: 'paper', name: 'Paper World', role: '입력된 접기를 확정 상태로 반영', tone: 'paper' },
        { id: 'surface', name: 'Surface World', role: '접힌 종이 위 위치를 UV로 다시 계산', tone: 'world' },
        { id: 'movement', name: 'Movement World', role: '이동 정책을 적용하고 위치를 적분', tone: 'world' },
        { id: 'geometry', name: 'Geometry World', role: '현재 위치에서 기하 관계와 판정을 질의', tone: 'world' },
        { id: 'link', name: 'WorldLink', role: 'IWorld 사이 위치 Pull · Push', tone: 'link' },
      ],
      frameSteps: [
        { no: '01', lane: '가변 프레임', title: '접기와 위치 재해석', items: ['접기 확정', '표면 위치 재해석'] },
        { no: '02', lane: '고정 스텝 0~3회', title: '이동과 판정', items: ['이동 정책', '위치 적분', '기하 질의', '판정'] },
      ],
      execution: {
        variable: ['Paper 접기 확정', 'Surface 위치 재해석'],
        fixed: ['Geometry Sync', 'WorldLink Pull', 'Movement Step · Integrate', 'WorldLink Push', 'Judge'],
      },
      paperPipeline: {
        title: '종이 한 번의 상태 순환과 두 실행 흐름',
        intro: '접기 확정은 메인에서 Split 완료·Bake·Rebind를 마친다. 그 뒤 Buried 판정만 워커에 예약하고, 이후 시뮬레이션 틱은 끝난 결과만 수확한다.',
        main: [
          { key: 'snapshot', tag: '기준', title: '확정 Snapshot', detail: '접기 전 정점·UV·조각' },
          { key: 'split', tag: '계산', title: 'Burst Split', detail: '접는 선 분할·반사' },
          { key: 'compose', tag: '정리', title: '쌓임 순서·Bounds 계산', detail: '조각 순서와 화면 경계 출력' },
          { key: 'upload', tag: '전송', title: 'Native 메시 업로드', detail: '앞·뒤 두 메시 버퍼로 직접 전송' },
          { key: 'render', tag: '표현', title: '상태 렌더링', detail: '현재 종이 상태를 화면에 표시' },
          { key: 'confirm', tag: '입력', title: '접기 확정 요청', detail: '현재 결과를 새 Snapshot에 저장' },
        ],
        worker: [
          { tag: '예약', title: '파묻힘 판정 예약', detail: '새 Snapshot을 읽는 Burst 잡 출발' },
          { tag: '병렬 실행', title: '가려진 조각 판정', detail: '완전히 덮인 조각을 워커에서 계산' },
          { tag: '이후 틱', title: '완료 결과 수확·압축', detail: '끝났을 때만 다음 입력에서 제거' },
        ],
      },
      // 현재 제출용 덱의 read-only 소비 필드. 페이지 본문은 위의 새 구조를 사용한다.
      gist: '`BattleSimulation`이 가변 프레임과 고정 스텝 호출 순서를 소유하고 WorldLink가 IWorld 위치를 연결한다.',
      foldRule: '확정 상태와 프레임 표현을 분리하고, 각 작업을 결과가 필요한 시점에 맞춰 배치했다.',
      clock: ['variable frame', 'presentation'],
      lanes: [
        { note: '손가락 추종 · 가변 dt', items: [['01', 'Paper fold', '접기 계산'], ['02', 'Surface resolve', '앵커 재해석'], ['03', 'Preview', '접기 미리보기']] },
        { note: '고정 1/60 · 프레임당 0~3회', items: [['04', 'Transit', '종이 반출입'], ['05', 'Geo sync', '기하 갱신'], ['06', 'WorldLink Pull', '구속 결과 흡수'], ['07', 'Motion step', '이동 정책'], ['08', 'Integrate', '적분'], ['09', 'WorldLink Push', '종이 구속'], ['10', 'Judge', '위치 확정 뒤 판단']] },
        { note: '완결본만 소비', items: [['11', 'Publish', '종이 발행'], ['12', 'Render', '앞·뒤 두 메시']] },
      ],
      systems: [
        { tag: 'PAPER', title: 'PaperSnapshot · Split pipeline', body: '확정 상태와 프레임 분할 결과' },
        { tag: 'SURFACE', title: 'Surface World', body: 'UV 기반 종이 표면 좌표' },
        { tag: 'WORLD BRIDGE', title: 'WorldLink', body: 'IWorld 위치 Pull · Push' },
        { tag: 'SIM WORLDS', title: 'Movement · Geometry World', body: '고정 스텝 이동과 질의' },
        { tag: 'SCREEN OUTPUT', title: 'Front / back meshes', body: 'Native 버퍼를 두 메시로 직접 업로드' },
      ],
      decisions: [
        ['order', '순서를 아는 지점을 BattleSimulation 한 곳으로 고정했다.'],
        ['contract', 'World는 서로를 모르고 IWorld의 위치 계약만 외부 링크가 연결한다.'],
      ],
      codes: [
        {
          title: 'FRAME ORDER · ca09945',
          source: `public void SimTick()\n{\n    _paper.TickSimulation();\n    _world.Resolve(_paper.Confirmed);\n\n    while (_clock.TryConsume(out float stepSeconds))\n        RunFixedStep(stepSeconds);\n\n    _paper.PublishPresentation();\n}\n\nprivate void RunFixedStep(float stepSeconds)\n{\n    _carrier.Step();\n    _geo.Sync();\n    for (int i = 0; i < _links.Length; i++) _links[i].Pull();\n    _motion.Step(stepSeconds);\n    _motion.Integrate(stepSeconds);\n    for (int i = 0; i < _links.Length; i++) _links[i].Push();\n    for (int i = 0; i < _judgeList.Count; i++) _judgeList[i].Judge(stepSeconds);\n}`,
          caption: 'BattleSimulation — 가변 프레임에서 접기·위치 재해석을 먼저 처리하고, 고정 스텝은 Geometry → Pull → Movement → Push → Judge 순서로 반복한다.',
        },
        {
          title: 'CONFIRM + LATER HARVEST · ca09945',
          source: `public void ConfirmFold()\n{\n    Vector2 localA = _animator.PointA;\n    Vector2 localB = _animator.CurrentPointB;\n\n    if ((localB - localA).sqrMagnitude\n        < PaperGeometry.MinFoldLineLength * PaperGeometry.MinFoldLineLength)\n        return;\n\n    UpdateFoldLineCache(localA, localB);\n    ScheduleSplit(localA, localB);\n    _pipeline.CompleteForMarshal(_allowFullFlip);\n\n    if (!_pipeline.HasConfirmResult)\n    {\n        _pipeline.PresentBase();\n        _animator.ClearFoldLine();\n        ResetFoldLineCache();\n        return;\n    }\n\n    PaperSnapshot next = _ring.Advance(localA, localB);\n    _pipeline.BakeConfirmed(next);\n    RebindBase();\n    _pipeline.ScheduleBuried();\n}\n\npublic void TickSimulation()\n{\n    if (_animator == null || _paperRenderer == null || _pipeline == null) return;\n    _pipeline.TryHarvestBuried();\n}`,
          caption: 'PaperController 원문 발췌 — 접기 선·결과 guard를 통과하면 메인에서 새 Snapshot을 저장·재연결하고 Buried 판정만 예약한다. 이후 틱은 완료된 결과만 수확한다.',
        },
      ],
    },

    measurement: {
      benchmark: {
        intro: '완성 전투 장면이 아니라 PaperBench에서 동일한 접기 자극을 반복했다. 프레임마다 반복되는 종이 경로와 접기 확정 때만 발생하는 판정을 다른 축으로 기록했다.',
        facts: [
          ['테스트 장면', 'PaperBench 1개'],
          ['측정 자극', 'fold-manual.gif · seed 12345 · 임의 접기 16회'],
          ['측정 환경', editor],
          ['해석 경계', '완성 Battle gameplay 아님 · Android 빌드·기기 미측정'],
        ],
        axes: [
          { label: '프레임 경로', target: 'Split + Compose + Renderer.Sync', method: '동일 임의 접기 16회 · 프레임당 Average' },
          { label: '확정 이벤트', target: 'Worker vs Main Run', method: '같은 세션 A B A B A B · 첫 접기 제외 · 2~16회 45표본' },
          { label: '렌더 구조', target: '레이어·정점·오브젝트·드로우콜', method: 'PaperBench 16회차 종단값 · 드로우콜만 정지 대조군 대비 델타' },
        ],
      },
      markerCode: `public void Schedule(float2 midPoint, float2 lineNormal, float2 foldAxis)\n{\n    using ProfilerMarker.AutoScope scope = SplitMarker.Auto();\n    // Split Run / Schedule\n}\n\nprivate bool CompleteIntoWorking(bool allowFullFlip)\n{\n    using (ComposeMarker.Auto())\n        BuildSplitPieces(allowFullFlip);\n}\n\nprivate void SelectPresentedBounds()\n{\n    using ProfilerMarker.AutoScope scope = BoundsMarker.Auto();\n    // select precomputed bounds\n}\n\npublic void Sync(in PaperFoldResultView view)\n{\n    using ProfilerMarker.AutoScope scope = SyncMarker.Auto();\n    Fill(view);\n    UploadMesh(...);\n}`,
      markerCodeCaption: 'PaperFoldSplitPipeline + PaperRenderer — 각 마커는 분할, 쌓임 구성, Bounds 선택, 렌더 버퍼 구성·업로드의 실제 코드 경계를 감싼다.',
      headline: {
        value: '−96.0%',
        detail: '0.643 → 0.026 ms',
        label: '종이 프레임 경로 측정 비용',
        condition: `${editor} · PaperBench · seed 12345 · 임의 접기 16회 · 프레임당 Average · Renderer.Sync + Split + Compose · Bounds·워커 본문 제외 · 전체 CPU/frame time 아님`,
      },
      intro: '프레임당 `Debug.Log`가 최초 계측을 오염시킨 것을 확인했다. 옛 시리즈를 폐기하고 seed 12345의 동일 임의 접기 16회로 기준선부터 Native+Burst 도입까지 전부 다시 측정했다.',
      markerMap: {
        title: '주요 측정 마커와 종이 프레임 경로의 위치',
        path: [
          { key: 'snapshot', title: 'Snapshot', markers: [] },
          { key: 'split', title: 'Split', markers: ['Split'] },
          { key: 'compose', title: '쌓임 순서', markers: ['Compose'] },
          { key: 'bounds', title: 'Bounds 발행', markers: ['Bounds · 별도 진단'] },
          { key: 'upload', title: 'Native 업로드', markers: ['Renderer.Sync'] },
          { key: 'render', title: '상태 렌더링', markers: [] },
        ],
        items: [
          { marker: 'Paper.FoldOperation.Split', position: 'Split', detail: '접는 선 분할·반사와 결과 축약' },
          { marker: 'Paper.FoldOperation.Compose', position: '쌓임 순서', detail: '제자리·넘어간 조각을 렌더 순서로 구성' },
          { marker: 'Paper.Publish.Bounds', position: 'Bounds 발행', detail: '이미 계산된 결과 경계 선택' },
          { marker: 'Paper.Renderer.Sync', position: 'Native 업로드', detail: '앞·뒤 버퍼 채우기와 두 메시 업로드' },
        ],
      },
      validationFlow: [
        { no: '01', title: '오염 발견', detail: 'Renderer.Sync 안의 프레임 로그가 측정값을 지배' },
        { no: '02', title: '옛 시리즈 폐기', detail: '로그 포함 결과와 퇴화 벤치를 공개 근거에서 제외' },
        { no: '03', title: '동일 입력 재측정', detail: '기준선~Native+Burst · seed 12345 · 임의 접기 16회 · Average' },
        { no: '04', title: '후기 축 분리', detail: '프레임 경로와 확정 이벤트를 별도 A/B로 해석' },
      ],
      stages: [
        { stage: 'S0', label: '기준선', axis: ['기준선'], value: 0.643 },
        { stage: 'S1-1', label: '재사용 누적 상태', axis: ['재사용', '누적 상태'], value: 0.373 },
        { stage: 'S1-2', label: '컬링 누적 상태', axis: ['컬링', '누적 상태'], value: 0.165 },
        { stage: 'S2-a', label: '2메시 누적 상태', axis: ['2메시', '누적 상태'], value: 0.062 },
        { stage: 'S2-b', label: 'Native 전환 상태', axis: ['Native', '전환 상태'], value: 0.040 },
        { stage: 'S2-c~g', label: '후기 기록 구간', axis: ['후기 기록', '구간 묶음'], value: 0.033, displayValue: '0.033~0.034' },
        { stage: 'S2-h', label: '최저 측정 상태', axis: ['최저 측정', '상태'], value: 0.023, kind: 'minimum' },
        { stage: 'S2-i', label: '최종 채택 상태', axis: ['최종 채택', '상태'], value: 0.026, kind: 'final' },
      ],
      changeMap: [
        { no: '01', key: 'reuse', title: '변하지 않은 레이어 통과', detail: '원본 참조 유지 · 동일 참조 메시 재생성 생략', result: '재생성 생략' },
        { no: '02', key: 'cull', title: '가려진 레이어 컬링', detail: '접기 확정 뒤 완전히 가려진 레이어를 다음 입력에서 제외', result: '337→57 layers' },
        { no: '03', key: 'batch', title: '앞·뒤 2메시 렌더 배칭', detail: '레이어별 렌더 오브젝트를 앞·뒤 메시로 통합', result: '77→2 objects · +71→+1' },
        { no: '04', key: 'native', title: 'NativeArray 기반 단일 파이프라인', detail: 'Persistent 입력 · Bounds 출력 · 메시 직접 업로드', result: '0.062→0.040ms' },
        { no: '05', key: 'placement', title: '메인·워커 실행 위치 분배', detail: '즉시 필요한 Split은 메인 · 미룰 수 있는 판정은 워커', result: 'Split −54% · 확정 프레임 29.4 vs 156.1µs' },
      ],
      stageNote: '각 점은 변경 하나의 단독 효과가 아니라, 해당 시점까지 누적된 시스템 상태다. 변화가 없던 후기 기록은 0.033~0.034ms 한 점으로 묶었다.',
      condition: `${editor} · PaperBench 임의 접기 · seed 12345 · 16 folds · 프레임당 Average · Renderer.Sync + FoldOperation.Split + FoldOperation.Compose`,
      exclusion: '이 값은 전체 CPU나 전체 frame time이 아니다. Paper.Publish.Bounds와 워커 실행 시간은 포함하지 않는다.',
      confirmInset: {
        before: '160.3µs',
        after: '29.9µs',
        title: '접기 확정 처리 중앙값',
        condition: `${editor} · 동기 처리↔비동기 처리 같은 세션 A/B · 첫 접기 워밍업 제외 · 2~16회`,
        note: '비동기 전환의 추가 성과는 접기 확정 순간의 지연 감소다. 같은 세션의 일반 프레임 경로 −1.2%는 노이즈 범위다.',
      },
      gist: '0.643→0.026ms의 전체 변화를 대표 전환점으로 먼저 보고, 아래에서 구조 축소와 실행 위치 선택의 구현을 분해한다.',
      scope: {
        environment: [
          ['환경', editor],
          ['입력', 'PaperBench · seed 12345 · 임의 접기 16회'],
          ['통계', '선택한 마커의 프레임당 Average'],
          ['비교', '기준선→최종 상태 · 단계별 기록 세션'],
        ],
        limits: [
          '전체 CPU·전체 frame time·GPU 시간을 뜻하지 않음',
          'Paper.Publish.Bounds와 워커 본문 실행 시간은 0.643→0.026ms 값에서 제외',
          'Android 빌드·기기 CPU/GPU/FPS 결과로 확장하지 않음',
        ],
      },
      bars: [
        ['S0', 0.643], ['S1-1', 0.373], ['S1-2', 0.165], ['S2-a', 0.062], ['S2-b', 0.040],
        ['S2-c', 0.033], ['S2-e', 0.034], ['S2-f', 0.033], ['S2-g', 0.033], ['S2-h', 0.023], ['S2-i', 0.026],
      ],
      correction: {
        title: '프레임 Debug.Log 오염 발견 → 옛 계측 폐기',
        body: '동일 seed 12345 임의 접기 16회로 S0~S2-b를 다시 측정하고 후기 이벤트 축은 별도 A/B로 분리했다.',
      },
      conditions: [
        ['환경', editor],
        ['입력', 'PaperBench · seed 12345 · 임의 접기 16회'],
        ['지표', 'Renderer.Sync + Split + Compose 프레임당 Average'],
        ['제외', 'Bounds · 워커 실행 시간'],
      ],
      axes: [
        ['공식 3마커', '0.643→0.026ms', 'S0→S2-i · −96.0%'],
        ['렌더 오브젝트', '337→2', 'S0→S2-a'],
        ['드로우콜 델타', '+298→+1', '정지 대조군 대비'],
        ['확정 이벤트', '160.3→29.9µs', 'S2-h→S2-i 중앙값'],
      ],
    },

    structural: {
      intro: '재사용 → 가지치기 → 병합으로 입력과 렌더 구조를 먼저 줄였다. 이어 Persistent Native 입력, 잡 출력 Bounds, 메시 직접 업로드를 한 경로로 연결해 관리형 왕복과 발행 단계 재순회를 없앴다.',
      context: {
        title: '누적되는 입력과 객체를 세 지점에서 줄였다',
        problem: '접을 때마다 변하지 않은 레이어까지 다시 만들고, 완전히 가려진 조각과 레이어별 렌더 오브젝트가 다음 단계에 계속 남았다.',
        active: [
          { key: 'split', label: '재사용', detail: '교차하지 않는 레이어 통과' },
          { key: 'worker', label: '가지치기', detail: '가려진 조각을 판정해 다음 입력에서 제거', tone: 'worker' },
          { key: 'upload', label: '병합', detail: '레이어별 객체를 앞·뒤 두 메시로' },
        ],
      },
      steps: [
        {
          no: '01', key: 'REUSE', title: '변하지 않은 레이어는 통과',
          before: '매 프레임 메시 재생성', after: '원본 참조 유지 → 동일 참조면 재생성 생략',
          effect: '분할되지 않은 레이어를 다음 경로에 그대로 전달',
          code: `PaperGeometry.PolygonSide side =\n    PaperGeometry.ClassifyPolygon(\n        layer.Vertices, midPoint, abDirection);\n\nif (side == PaperGeometry.PolygonSide.Front)\n{\n    fixedLayers.Add(layer);\n    continue;\n}`,
          sourceLabel: 'HISTORICAL · MANAGED PATH',
          codeCaption: '이전 관리형 경로 — 교차하지 않는 레이어는 원본 인스턴스를 통과시켰다. 현재 활성 Native 파이프라인의 코드 증거가 아니다.',
        },
        {
          no: '02', key: 'PRUNE', title: '가려진 레이어를 입력에서 제거',
          before: '337 layers · 1348 vertices', after: '가지치기 직후 57 · 251 → 최종 38 · 163',
          effect: '확정 시 양쪽에서 완전히 가려진 조각을 후속 입력에서 제거',
          code: `internal int CompactByMask(NativeArray<bool> drop)\n{\n    int kept = 0;\n\n    for (int i = 0; i < _layerCount; i++)\n    {\n        if (drop[i]) continue;\n\n        if (kept != i)\n        {\n            _pieces[kept] = _pieces[i];\n            _surfaces[kept] = _surfaces[i];\n            _surfaceBounds[kept] = _surfaceBounds[i];\n            _pieceBounds[kept] = _pieceBounds[i];\n            _signs[kept] = _signs[i];\n        }\n\n        kept++;\n    }\n\n    int removed = _layerCount - kept;\n    if (removed == 0) return 0;\n\n    _layerCount = kept;\n    Touch();\n\n    return removed;\n}`,
          codeCaption: 'PaperSnapshot.CompactByMask() 원문 @ ca09945 — Buried 마스크를 건너뛰며 모든 병렬 Native 배열을 함께 당기고, 레이어 수와 변경 상태를 갱신한다.',
        },
        {
          no: '03', key: 'MERGE', title: '앞·뒤 2메시 렌더 배칭',
          before: '337 render objects · draw-call delta +298', after: '77 · +71 → front/back 2 · +1',
          effect: '쌓임 순서는 정점 z에 기록하고 앞·뒤 두 메시로 업로드',
          code: `float z = -i * _stackSpacing;\n\nif (piece.IsFolded)\n    AppendPiece(view, piece, z, _backVertices, ...);\nelse\n    AppendPiece(view, piece, z, _frontVertices, ...);`,
          codeCaption: 'PaperRenderer.Fill() @ ca09945 — 조각 인덱스를 z에 기록하고 접힘 상태로 앞·뒤 버퍼를 나눈다.',
        },
      ],
      headline: [
        { value: '337 → 2', label: '렌더 오브젝트', note: 'PaperBench 16회차' },
        { value: '+298 → +1', label: '드로우콜 델타', note: '정지 대조군 대비' },
        { value: '337 → 38', label: '16회차 레이어', note: '공식 단일 런 · 같은 빌드도 약 10% 변동' },
      ],
      condition: editor,
      warning: '337→57·1348→251은 가지치기 직후 단계값이다. 337→38·1348→163은 초기 기준선과 최종 상태의 16회차 공식 단일 런 종단값이며, 같은 빌드에서도 레이어 궤적은 약 10% 변동할 수 있다. 337→2와 +298→+1은 별도의 렌더 구조 축이다.',
    },

    nativeFrame: {
      intro: '분할을 Persistent `NativeArray`와 `IJobParallelFor` Burst 본문으로 옮겼다. 이후 잡 출력에서 경계상자를 만들고 Native 메시 버퍼에 직접 올려 관리형 왕복과 발행 단계 재순회를 없앴다.',
      context: {
        title: '줄어든 입력을 Split부터 렌더까지 Native로 잇다',
        problem: '분할 결과가 관리형 표현을 왕복하고, 발행 단계가 경계상자를 위해 정점을 다시 순회했다. 작은 Split 워커는 같은 프레임에 즉시 동기화돼 스케줄 비용도 남겼다.',
        active: [
          { key: 'snapshot', label: 'Native 기준', detail: 'Persistent Snapshot' },
          { key: 'split', label: 'Burst Split', detail: '동일 본문·실행 위치 선택' },
          { key: 'compose', label: 'Bounds 출력', detail: '잡 출력에서 함께 계산' },
          { key: 'upload', label: '직접 업로드', detail: '관리형 변환 없이 메시 API로' },
        ],
      },
      flow: [
        { title: 'Persistent input', detail: '관리형 왕복 제거 → PaperSnapshot · vertices · UV · pieces' },
        { title: 'Burst Split', detail: '동일 IJobParallelFor 본문' },
        { title: 'Bounds output', detail: '발행 재순회 제거 → 조각별 출력 · reduce' },
        { title: 'Native upload', detail: '관리형 변환 제거 → SetVertexBufferData' },
        { title: 'Render', detail: 'front / back 2 meshes' },
      ],
      unification: [
        { subject: '분할 입력', before: '관리형 표현 왕복', after: 'Persistent NativeArray' },
        { subject: 'Bounds', before: '발행 단계 정점 재순회', after: '잡 출력에서 계산·축약' },
        { subject: '메시 업로드', before: '관리형 버퍼 변환', after: 'Native 버퍼 직접 업로드' },
      ],
      sequences: [
        { mode: '이전 Split 워커 경로 · 같은 프레임 동기', steps: ['Schedule', 'Resolve / FixedStep', 'Complete에서 대기', 'Render'], result: '0.0182ms', tone: 'before' },
        { mode: '현재 Split 메인 경로', steps: ['Burst Run', 'Render'], result: '0.0083ms', tone: 'after' },
      ],
      split: {
        before: 0.0182,
        after: 0.0083,
        delta: '−54%',
        condition: `${editor} · 임의 접기 16회 · 조건별 3런 Average · 가지치기 뒤 약 40레이어 · 동일 IJobParallelFor Burst 본문`,
        resultCondition: '임의 접기 16회 · 조건별 3런 Average · 가지치기 뒤 약 40레이어 · 동일 Burst 본문',
      },
      diagnostics: [
        { label: 'Native mesh upload 중앙값', before: '11.5µs', after: '6.3µs' },
        { label: '발행 경계상자 계산 중앙값', before: '6.55µs', after: '0.10µs' },
      ],
      condition: `${editor} · Diagnostics 보간 프레임 중앙값`,
      codes: [
        {
          title: 'PERSISTENT INPUT · ca09945',
          source: `private NativeArray<float2> _vertices;\nprivate NativeArray<float2> _uvs;\nprivate NativeArray<PaperPiece> _pieces;\n\nprivate static void Grow<T>(ref NativeArray<T> array, int required, int minimum)\n    where T : unmanaged\n{\n    if (array.IsCreated && array.Length >= required) return;\n    if (array.IsCreated) array.Dispose();\n    array = new NativeArray<T>(math.max(required, minimum) * 2,\n        Allocator.Persistent, NativeArrayOptions.UninitializedMemory);\n}`,
          caption: 'PaperSnapshot — 정점·UV·조각을 Persistent NativeArray 한 표현으로 유지하고 용량이 부족할 때만 다시 잡는다.',
        },
        {
          title: 'BOUNDS OUTPUT · ca09945',
          source: `PaperSplitLayersJob job = new PaperSplitLayersJob\n{\n    OutFixedBounds = _outFixedBounds,\n    OutFlippedBounds = _outFlippedBounds,\n};\nPaperBoundsReduceJob reduce = new PaperBoundsReduceJob\n{\n    FixedBounds = _outFixedBounds,\n    FlippedBounds = _outFlippedBounds,\n    Result = _boundsResult,\n};\n\n_presentedBoundsMin = _presented.BoundsMin;\n_presentedBoundsMax = _presented.BoundsMax;`,
          caption: 'PaperFoldSplitPipeline — Split 출력에서 조각별 Bounds를 만들고 reduce한 뒤, 발행 단계는 계산된 경계를 선택만 한다.',
        },
        {
          title: 'NATIVE MESH UPLOAD · ca09945',
          source: `mesh.SetVertexBufferData(vertices, 0, 0, vertexCount, 0, UploadFlags);\nmesh.SetIndexBufferData(indices, 0, 0, indexCount, UploadFlags);\nmesh.SetSubMesh(0, new SubMeshDescriptor(0, indexCount, MeshTopology.Triangles)\n{\n    firstVertex = 0,\n    vertexCount = vertexCount,\n    bounds = bounds\n}, UploadFlags);\nmesh.bounds = bounds;`,
          caption: 'PaperRenderer — Native 버퍼를 관리형 변환 없이 메시로 직접 올리고, 잡 출력 Bounds를 재계산 없이 사용한다.',
        },
      ],
      uploadCode: `UploadMesh(_frontMesh, _frontVertices,\n    _frontVertexCount, _frontIndices,\n    _frontIndexCount, _frontBounds);\nUploadMesh(_backMesh, _backVertices,\n    _backVertexCount, _backIndices,\n    _backIndexCount, _backBounds);\n\nmesh.SetVertexBufferData(vertices, 0, 0, vertexCount);\nmesh.SetIndexBufferData(indices, 0, 0, indexCount);`,
      uploadCodeCaption: 'PaperRenderer.Sync() @ ca09945 — 앞·뒤 Native 버퍼를 관리형 변환 없이 두 메시로 직접 업로드한다.',
      code: `if (RunSplitOnMain)\n{\n    job.Run(_baseLayerCount);\n    reduce.Run();\n}\nelse\n{\n    _handle = job.Schedule(_baseLayerCount, InnerLoopBatchCount);\n    _handle = reduce.Schedule(_handle);\n    JobHandle.ScheduleBatchedJobs();\n}`,
      codeCaption: 'PaperFoldSplitPipeline.Schedule() @ ca09945 — NativeArray와 Burst 본문은 유지하고 실행 위치만 선택한다.',
      conclusion: 'Mono 회귀가 아니다. 현재도 NativeArray·IJobParallelFor·Burst를 유지한다. 약 40레이어의 Editor 조건에서 스케줄·즉시 동기화 상수가 병렬 이득보다 커 메인 `Run()`을 채택했다.',
      headline: {
        value: '−54%', detail: '0.0182 → 0.0083 ms', label: 'Split Average',
        condition: editor,
      },
    },

    placement: {
      intro: '구조 축소 뒤에도 NativeArray와 Burst는 유지했다. 결과가 같은 프레임에 필요한 작은 Split은 메인 `Run()`으로, 크고 한 틱 미룰 수 있는 파묻힘 판정은 워커로 보내 실행 위치를 나눴다.',
      title: '결과가 필요한 시점과 작업 크기로 실행 위치를 나눴다',
      condition: editor,
      main: {
        eyebrow: 'MAIN · 즉시 필요',
        result: '−54%',
        detail: 'Split Average · 0.0182→0.0083ms',
        condition: `${editor} · 임의 접기 16회 · 조건별 3런 Average · 가지치기 뒤 약 40레이어`,
        steps: [
          { title: 'Snapshot', detail: 'Persistent Native 입력' },
          { title: 'Burst Split Run', detail: '같은 프레임에 즉시 실행', result: '−54%' },
          { title: '쌓임·Bounds', detail: '잡 출력에서 함께 계산' },
          { title: 'Native 업로드', detail: '관리형 왕복 없이 전송' },
          { title: '상태 렌더링', detail: '앞·뒤 두 메시' },
        ],
      },
      worker: {
        eyebrow: 'WORKER · 한 틱 지연 가능',
        result: '29.4µs',
        detail: 'vs Main Run 156.1µs · 확정 프레임 중앙값',
        condition: `${editor} · 같은 세션 A B A B A B · 첫 접기 제외 · 2~16회 45표본`,
        steps: [
          { title: '접기 확정 요청', detail: '새 Snapshot 저장' },
          { title: '파묻힘 판정 예약', detail: '기다리지 않고 메인 반환' },
          { title: '워커 병렬 판정', detail: '가려진 조각 계산' },
          { title: '완료된 틱에서 수확', detail: '미완료면 즉시 반환', result: '23~44µs' },
          { title: '다음 Snapshot 입력', detail: '완료 마스크로 압축' },
        ],
      },
      caption: '작은 Split은 스케줄·즉시 동기화 비용을 없애고, 큰 파묻힘 판정은 메인이 기다리지 않게 했다. 두 경로 모두 NativeArray와 Burst 본문을 유지한다.',
    },

    asyncConfirm: {
      intro: '반대로 파묻힘 판정은 크고, 확정 직후 화면에 결과가 필요하지 않다. 확정 상태의 수명을 한 곳으로 모은 뒤 판정만 워커에 예약하고 다음 `TickSimulation`에서 완료된 결과를 수확한다.',
      context: {
        title: '접기 확정 뒤, 다음 입력을 줄이는 판정만 워커로 보냈다',
        problem: '파묻힘 판정을 접기 확정과 같은 메인 흐름에서 즉시 실행하면 조각 수가 늘수록 확정 순간의 지연이 함께 커졌다.',
        active: [
          { key: 'confirm', label: '접기 확정', detail: '새 Snapshot 저장·예약 후 반환' },
          { key: 'worker', label: '워커 판정', detail: '완전히 가려진 조각 계산' },
          { key: 'snapshot', label: '다음 입력', detail: '완료 결과만 수확·압축' },
        ],
      },
      ownership: [
        { title: 'PaperSnapshotRing', detail: '고정 이력 슬롯과 해제 수명 단독 소유', relation: 'owns' },
        { title: 'PaperSnapshot', detail: '확정 상태의 네이티브 단일 표현', relation: 'contains' },
        { title: 'Split pipeline', detail: '현재 슬롯의 Snapshot을 빌려 읽음', relation: 'borrows' },
      ],
      timeline: [
        { tick: '접기 확정 · 현재 틱', steps: ['확정 모양 Bake', '새 Snapshot을 기준으로 연결', '파묻힘 판정 워커 예약·배치 출발', '완료를 기다리지 않고 반환'] },
        { tick: '시뮬레이션 · 이후 틱', steps: ['워커 완료 여부 확인', '미완료면 기다리지 않고 반환', '완료됐으면 결과 수확', '제자리 압축·기준 재연결'] },
      ],
      flow: {
        title: '예약하고 돌아온 뒤, 완료된 틱에서만 결과를 거둔다',
        steps: [
          { tag: '접기 확정', title: '새 기준 저장 · 워커 예약', detail: '접기 결과를 Snapshot에 저장하고 파묻힘 판정을 예약한 뒤 기다리지 않고 반환' },
          { tag: '워커', title: '가려진 조각 병렬 판정', detail: '확정 Snapshot을 읽어 완전히 덮인 조각을 동일 Burst 본문으로 판정' },
          { tag: '이후 시뮬레이션 틱', title: '완료 확인 · 수확', detail: '미완료면 즉시 반환하고, 완료됐을 때만 압축한 뒤 새 기준에 다시 연결' },
        ],
        ownership: '고정 이력 링이 Snapshot 수명을 소유하고, 파이프라인은 현재 슬롯을 빌려 읽는다.',
      },
      comparison: [
        { label: '확정 프레임 중앙값', worker: 29.4, main: 156.1, unit: 'µs' },
        { label: '확정 프레임 최대', worker: 44.0, main: 492.3, unit: 'µs' },
        { label: '비확정 프레임', worker: 20.5, main: 20.2, unit: 'µs' },
      ],
      profile: [
        { round: '2회', worker: 29.4, main: 26.0 },
        { round: '5회', worker: 25.5, main: 101.6 },
        { round: '8회', worker: 27.3, main: 163.6 },
        { round: '10회', worker: 29.4, main: 371.7 },
        { round: '12회', worker: 36.4, main: 270.6 },
        { round: '14회', worker: 32.2, main: 387.9 },
        { round: '16회', worker: 36.4, main: 447.9 },
      ],
      profileSummary: '회차별 3런 중앙값은 Worker 예약안 25.5~36.4µs, Main 즉시 실행 대조군 26.0~447.9µs다. 45표본 전체는 중앙값 29.4 vs 156.1µs, 최대 44.0 vs 492.3µs였다.',
      condition: `${editor} · 임의 접기 16회 · 같은 세션 A B A B A B 교대 6런 · r1 워밍업 제외 · r2~16 45표본 · 동일 Burst 본문·입출력·수확 경로`,
      proof: [
        { label: '접기 확정 처리 · 동기→비동기', value: '160.3→29.9µs', note: '같은 세션 중앙값' },
        { label: '16회차 확정 프레임 관리형 할당', value: '+12,750→+70 B', note: '직전 정지 프레임 대비' },
        { label: '16회차 할당 객체', value: '+213→+2', note: '모든 프레임/GC pause 결론 아님' },
      ],
      proofTitle: '이전 동기 확정 경로 → 현재 확정 경로 · 복합 전환',
      proofCondition: `${editor} · 같은 세션 이전/현재 경로 A/B · r1 워밍업 제외 · r2~16 · PaperSnapshot 네이티브화와 Buried 비동기화를 함께 포함 · Worker 배치 단독 효과 아님`,
      boundary: '아래 값은 워커 본문까지 합산한 총 CPU가 아니라, 확정 순간 메인 스레드가 붙잡힌 시간이다. 비확정 프레임은 동률이다. PaperSnapshot과 고정 링은 비동기화의 구조적 전제이지 독립 성능 헤드라인이 아니다.',
      measurementBoundary: '이 그래프는 접기 확정 순간 메인 스레드가 붙잡힌 시간을 비교한다. 선의 점은 회차별 3런 중앙값이며 워커 본문을 더한 전체 CPU가 아니다. 비확정 프레임은 20.5 vs 20.2µs로 동률이다.',
      prerequisite: 'PaperSnapshot 한 표현과 고정 이력 링이 확정 상태의 수명을 보장했기 때문에, 워커는 같은 입력을 안전하게 읽고 완료된 이후 틱에 결과를 돌려줄 수 있었다.',
      headline: {
        worker: '29.4',
        main: '156.1',
        unit: 'µs',
        label: '확정 프레임 중앙값 · Worker vs Main Run',
        secondary: '최대 · Worker 44.0µs / Main Run 492.3µs',
        condition: editor,
        resultCondition: '같은 세션 A B A B A B · 첫 접기 제외 · 2~16회 45표본 · 동일 Burst 본문·입출력·수확 경로 · 메인 확정 지연 · 워커 포함 전체 CPU 아님',
      },
      code: `public bool TryHarvestBuried()\n{\n    if (!_buriedSolver.IsScheduled) return false;\n    if (!_buriedSolver.IsSolveCompleted) return false;\n\n    FlushBuried();\n    return true;\n}\n\npublic int FlushBuried()\n{\n    if (!_buriedSolver.IsScheduled) return 0;\n\n    using ProfilerMarker.AutoScope scope = PruneMarker.Auto();\n\n    NativeArray<bool> buried = _buriedSolver.CompleteSolve();\n    int removed = _base.CompactByMask(buried);\n    if (removed == 0) return 0;\n\n    SetBase(_base);\n    return removed;\n}`,
      codeCaption: 'PaperFoldSplitPipeline 원문 발췌 @ ca09945 — 예약·완료를 먼저 확인해 미완료면 기다리지 않고, 완료됐을 때만 결과를 수확·압축하고 기준을 다시 연결한다.',
    },

    validation: {
      intro: '현재 결론은 같은 입력을 사용한 Windows PC Unity Editor PlayMode 상대 비교다. Android 성능으로 확장하지 않고, 기기에서는 실행 위치 A/B부터 다시 판단한다.',
      summary: 'Windows PC · Unity Editor 상대 비교까지 확인. Android 빌드·기기 CPU/GPU/FPS와 워커 본문까지 합산한 총 CPU 작업량은 다음 측정 범위다.',
      columns: [
        {
          key: 'verified', title: '확인됨',
          items: ['종이 프레임 경로 초기 기준선→최종 상태 비교', '렌더 오브젝트와 정지 대조군 드로우콜 델타', '분할 메인/워커 및 파묻힘 판정 워커/메인 Editor A/B'],
        },
        {
          key: 'outside', title: '측정 범위 밖',
          items: ['Android 빌드·기기 CPU/GPU/FPS', '전체 frame time', '워커 본문까지 합산한 총 CPU 작업량', '현재 Test Runner PASS'],
        },
        {
          key: 'retest', title: '실기에서 재판정',
          items: ['약 40레이어 Split의 Main Run 선택', '한 틱 지연 Buried worker 선택', '렌더 드로우콜·GPU·오버드로우'],
        },
      ],
      notes: [
        '종이 프레임 경로 대표값 = Renderer.Sync + FoldOperation.Split + FoldOperation.Compose. Bounds와 워커 실행 제외.',
        'fold-manual.gif = PaperBench 측정 자극. 완성 Battle gameplay가 아님.',
        '후기 단계의 작은 인접 차이는 세션 차이 때문에 개별 코드 효과로 귀속하지 않음.',
      ],
    },

    // 현재 제출용 덱이 읽는 필드명은 유지한다. 페이지는 아래 호환 필드를 렌더하지 않는다.
    result: null,
    methods: [
      {
        id: 'reuse', no: '04-A', stage: 'S1-1', kind: 'REUSE', title: '변하지 않은 레이어는 통과',
        gist: '접는 선에 걸치지 않은 레이어는 원본 참조를 통과시켜 재생성 대상에서 제외했다.',
        metric: { value: '0.643→0.373ms', detail: '−41.9%', label: '공식 3마커 합' },
        visual: { before: '매 프레임 재생성', after: '원본 참조 유지' },
        code: {
          before: { title: 'BEFORE', code: '// every layer\nRebuildMesh(layer);', result: '변하지 않은 레이어도 재생성' },
          after: { title: 'AFTER', code: '// unchanged layer\nreturn originalLayer;', result: '원본 참조 통과' },
        },
        note: '이 단계의 뷰 스킵은 병합 렌더러에서 폐기됐지만 Split의 원본 반환은 계산량 절약으로 유지된다.',
        scope: `${editor} · 동일 임의 접기 16회 · 로그 배제 재측정`,
      },
      {
        id: 'prune', no: '04-B', stage: 'S1-2', kind: 'PRUNE', title: '보이지 않는 입력 제거',
        gist: '확정 때 양쪽에서 완전히 가려진 조각을 제거해 다음 프레임의 분할 입력을 줄였다.',
        metric: { value: '337→57', detail: 'layers', label: 'S1-2 16회차 단계값' },
        visual: { before: '337 layers · 1348 vertices', after: '57 · 251' },
        code: {
          before: { title: 'BEFORE', code: '// keep every confirmed layer\nconfirmed.Add(layer);', result: '가려진 조각도 누적' },
          after: { title: 'AFTER', code: '// discard only fully buried pieces\nCompactByMask(buried);', result: '후속 입력에서 제거' },
        },
        note: '전체 S2-i 종단값은 38 layers · 163 vertices이며 S1-2 단계값과 구분한다.',
        scope: `${editor} · 동일 임의 접기 16회차`,
      },
      {
        id: 'merge', no: '04-C', stage: 'S2-a', kind: 'MERGE', title: '레이어별 객체를 앞·뒤 두 메시로',
        gist: '모든 조각을 앞·뒤 두 메시로 합치고 쌓임 순서를 정점 z에 기록했다.',
        metric: { value: '337→2', detail: 'objects', label: 'end-to-end 렌더 구조' },
        visual: { before: '337 render objects · +298', after: '2 meshes · +1' },
        code: {
          before: { title: 'BEFORE', code: '// one renderer per layer\nviews[i].Sync(layer);', result: '객체 수가 레이어와 함께 증가' },
          after: { title: 'AFTER', code: '// z stores stack order\nvertex.Position.z = -index * spacing;', result: 'front / back 두 메시' },
        },
        note: '드로우콜은 정지 대조군 대비 델타이며 GPU 시간 감소로 확장하지 않는다.',
        scope: `${editor} · PaperBench 16회차 · 정지 대조군 대비`,
      },
      {
        id: 'native', no: '04-D', stage: 'S2-b→h', kind: 'NATIVE', title: '같은 Burst Split을 메인 Run으로',
        gist: 'NativeArray·Burst 본문을 유지한 채 약 40레이어의 실행 위치만 워커 Schedule에서 메인 Run으로 바꿨다.',
        metric: { value: '0.0182→0.0083ms', detail: '−54%', label: 'Split Average' },
        visual: { before: 'Schedule → Complete', after: 'Run → Render' },
        code: {
          before: { title: 'WORKER', code: '_handle = job.Schedule(count, batch);\n_handle.Complete();', result: '같은 프레임 즉시 동기화' },
          after: { title: 'MAIN', code: 'job.Run(count);\nreduce.Run();', result: '동일 Burst 본문 실행' },
        },
        note: 'Mono 회귀가 아니다. 실기나 더 큰 레이어 규모에서는 같은 A/B로 다시 판단한다.',
        scope: `${editor} · 임의 접기 16회 · 조건별 3런 Average · 약 40레이어`,
      },
    ],
  };

  window.CM_DATA.result = window.CM_DATA.measurement;
})();
