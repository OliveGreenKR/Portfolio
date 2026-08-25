// Cartapli Mobile 제출용 덱 매니페스트.
// 사실 SSOT: pages/cartapli-mobile/data.js (Final Gate 통과본)
// 선택·순서·슬라이드 제목만 소유한다. 새 사실·수치·코드·시각자료는 만들지 않는다.
//
// 제목 서사:
// 정체성 → 계측 신뢰 회복 → 전체 결과 → 구조 축소 → 구조 구현 → Native 경로 →
// Native 구현 → 실행 위치 판단 → 작은 Split의 Main 선택 → 큰 Buried의 Worker 선택 → 비차단 수확 구현
//
// 제외:
// - BattleSimulation·WorldLink 상세: 사실이지만 이번 30초 문제해결 서사의 중심이 아니다.
// - methods 호환 필드: 이전 페이지 기준 덱용 골격이라 확정 전략으로 사용하지 않는다.
// - 별도 검증 범위 장: 표지와 계측 장에서 환경·한계를 한 번 정의한다.
// - Snapshot·링·allocation 독립 헤드라인: 비동기화의 전제·보조 증거로만 사용한다.

(function buildCartapliMobileDeck() {
  const C = window.CM_DATA;
  const structuralCodeCaptions = [
    '제거 대상으로 표시된 항목을 건너뛰고, 병렬 Native 배열을 같은 인덱스로 압축한 뒤 레이어 수와 변경 상태를 갱신한다.',
    '조각 인덱스를 정점 z에 기록하고 접힘 상태에 따라 앞·뒤 버퍼로 나눈다.',
  ];
  const structuralCodes = [C.structural.steps[1], C.structural.steps[2]].map((step, index) => ({
    title: `${step.key} · ca09945`,
    code: step.code,
    result: structuralCodeCaptions[index],
  }));
  const nativeCodeCaptions = [
    '분할 결과에서 조각별 경계상자를 계산하고 축약한다. 발행 단계는 계산이 끝난 경계만 선택한다.',
    'Native 버퍼를 관리형 변환 없이 메시 API에 직접 업로드하고, 잡 출력 경계상자를 재계산 없이 사용한다.',
  ];
  const nativeCodes = [C.nativeFrame.codes[1], C.nativeFrame.codes[2]].map((code, index) => ({
    title: code.title,
    code: code.source,
    result: nativeCodeCaptions[index],
  }));
  const measurement = {
    ...C.measurement,
    intro: '`Renderer.Sync` 안에서 프레임마다 호출된 `Debug.Log`가 최초 측정값을 지배했다. 해당 결과를 공개 근거에서 제외하고, seed 12345의 동일한 임의 접기 16회 입력으로 기준선부터 Native+Burst 도입 구간까지 다시 측정했다.',
    validationCaption: '측정 오염을 발견한 뒤 해당 결과를 제외하고 동일 입력으로 다시 측정했으며, 프레임 경로와 확정 이벤트를 각각 비교했다.',
    benchmark: {
      ...C.measurement.benchmark,
      facts: C.measurement.benchmark.facts.map(([label, value], index) => [
        label,
        index === 3 ? 'PaperBench 측정 장면 · Android 빌드·기기 미측정' : value,
      ]),
      axes: C.measurement.benchmark.axes.map((axis, index) => ({
        ...axis,
        target: index === 1 ? '워커 예약 / 메인 즉시 실행' : axis.target,
      })),
    },
    validationFlow: C.measurement.validationFlow.map((step, index) => ({
      ...step,
      title: index === 1 ? '오염 결과 제외' : index === 3 ? '측정 축 분리' : step.title,
    })),
  };
  const outcomeMeasurement = {
    ...measurement,
    stages: measurement.stages.map((stage, index) => index === 5
      ? { ...stage, label: '기록 구간', axis: ['기록 구간', '묶음'] }
      : stage),
    exclusion: '이 값은 전체 CPU 시간이나 전체 프레임 시간을 뜻하지 않는다. Paper.Publish.Bounds와 워커 실행 시간은 포함하지 않는다.',
    stageNote: '각 점은 변경 하나의 단독 효과가 아니라, 해당 시점까지 누적된 시스템 상태다. 변화가 없던 기록 구간은 0.033~0.034ms 한 점으로 묶었다.',
    chartCaption: 'Windows PC · Unity Editor PlayMode · Split + Compose + Renderer.Sync · 경계상자와 워커 본문 제외',
  };
  const placement = {
    ...C.placement,
    intro: '같은 프레임에 결과가 필요한 약 40레이어 Split은 메인에서 실행하고, 한 틱 미룰 수 있는 큰 파묻힘 판정은 워커에 예약했다.',
    caption: '작은 Split은 메인에서 즉시 실행해 스케줄과 동기화 단계를 제거했고, 큰 파묻힘 판정은 워커에 예약해 확정 흐름이 기다리지 않도록 했다. 두 경로 모두 NativeArray와 Burst 본문을 사용한다.',
    main: {
      ...C.placement.main,
      eyebrow: '메인 · 즉시 필요',
      steps: C.placement.main.steps.map((step, index) => ({
        ...step,
        title: ['Snapshot', 'Burst 분할 즉시 실행', '쌓임·경계상자', 'Native 업로드', '상태 렌더링'][index],
      })),
    },
    worker: {
      ...C.placement.worker,
      eyebrow: '워커 · 한 틱 지연 가능',
      detail: '메인 즉시 실행 156.1µs 대비 · 확정 프레임 중앙값',
    },
  };
  const nativeFrame = {
    ...C.nativeFrame,
    flow: C.nativeFrame.flow.map((item, index) => ({
      ...item,
      title: ['Persistent Native 입력', 'Burst 분할', '경계상자 출력', 'Native 직접 업로드', '렌더링'][index],
      detail: index === 4 ? '앞·뒤 메시 2개' : item.detail,
    })),
    unification: C.nativeFrame.unification.map((row) => row.subject === 'Bounds'
      ? { ...row, subject: '경계상자' }
      : row),
    diagnostics: C.nativeFrame.diagnostics.map((item) => ({
      ...item,
      label: item.label === 'Native mesh upload 중앙값' ? 'Native 메시 업로드 중앙값' : item.label,
    })),
  };
  const splitSequences = nativeFrame.sequences.map((sequence, index) => ({
    ...sequence,
    mode: index === 0 ? '이전 분할 워커 경로 · 같은 프레임 동기' : '현재 분할 메인 경로',
    steps: sequence.steps.map((step) => ({
      Schedule: '워커 예약',
      'Burst Run': 'Burst 즉시 실행',
      Render: '렌더링',
    }[step] || step)),
  }));
  const asyncConfirm = {
    ...C.asyncConfirm,
    flow: {
      ...C.asyncConfirm.flow,
      title: '예약 후 반환하고, 완료된 이후 틱에서만 결과를 수확한다',
    },
    profileSummary: '회차별 3런 중앙값은 워커 예약안 25.5~36.4µs, 메인 즉시 실행 대조군 26.0~447.9µs다. 45표본 전체는 중앙값 29.4 대 156.1µs, 최대 44.0 대 492.3µs였다.',
  };

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cm = {
    proj: C.meta.title,
    slides: [
      {
        cls: 'cm',
        layout: 'projectCover',
        section: C.meta.eyebrow,
        slug: 'cartapli-mobile',
        claim: 'CM-IDENTITY-001 · CM-ROLE-001 · CM-PERF-E2E-001 · CM-RENDER-E2E-001',
      },
      {
        cls: 'cm', layout: 'cmMeasure', section: '문제 정의 · 계측',
        title: '계측 오염 발견과 동일 입력 재측정', kind: 'MEASUREMENT INTEGRITY',
        claim: 'CM-MEASURE-001',
        measurement,
      },
      {
        cls: 'cm', layout: 'cmOutcome', section: '전체 결과',
        title: '단계별 재측정으로 확인한 종이 프레임 경로 96% 감소', kind: 'MEASURED RESULT',
        claim: 'CM-PERF-E2E-001',
        measurement: outcomeMeasurement,
        phases: [
          ['구조 축소', C.structural.context.active.map((item) => item.label).join(' · ')],
          ['Native 데이터 경로', nativeFrame.flow.map((item) => item.title).join(' → ')],
          ['실행 위치 선택', `${placement.main.eyebrow} / ${placement.worker.eyebrow}`],
        ],
      },
      {
        cls: 'cm', layout: 'cmStructural', section: '문제 해결 1 · 구조',
        title: '누적되는 레이어와 렌더 객체의 구조 축소', kind: 'REDUCE FIRST',
        claim: 'structural.context · structural.headline',
        structural: C.structural,
        copy: {
          problem: '접을 때마다 변하지 않은 레이어도 다시 만들었고, 완전히 가려진 조각과 레이어별 렌더 오브젝트도 다음 단계에 누적됐다.',
          decision: '변하지 않은 레이어는 재사용하고, 완전히 가려진 조각은 다음 입력에서 제거한 뒤, 남은 조각은 앞·뒤 두 메시로 병합했다.',
          caption: '각 단계의 출력이 다음 단계의 입력을 줄였다.',
        },
      },
      {
        cls: 'cm', layout: 'cmCodeEvidence', section: '문제 해결 1 · 구현',
        title: '가려진 레이어 제거와 앞·뒤 두 메시 병합', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-PRUNE-001 · CM-MERGE-001',
        gist: '완전히 가려진 조각은 Native 배열에서 제외하고, 남은 조각은 정점 z에 쌓임 순서를 기록해 앞·뒤 버퍼로 나눴다.',
        codes: structuralCodes,
        note: '57개 레이어·251개 정점은 가지치기 직후, 38개·163개는 최종 상태의 16회차 종단값이다. 같은 빌드에서도 레이어 수는 약 10% 변동할 수 있다. 렌더 오브젝트와 드로우콜은 별도 렌더 구조 지표다.',
      },
      {
        cls: 'cm', layout: 'cmNative', section: '문제 해결 2 · 데이터 경로',
        title: '분할부터 렌더링까지 연결한 Native 데이터 경로', kind: 'DATA FLOW',
        claim: 'nativeFrame.flow · nativeFrame.unification',
        nativeFrame,
        copy: {
          problem: '분할 결과는 관리형 표현을 왕복했고, 발행 단계는 경계상자를 계산하기 위해 정점을 다시 순회했다.',
          caption: 'Persistent Native 입력을 Burst로 분할하고 경계상자를 함께 출력한 뒤, 결과를 Native 메시 버퍼에 직접 업로드한다.',
        },
      },
      {
        cls: 'cm', layout: 'cmCodeEvidence', section: '문제 해결 2 · 구현',
        title: '경계상자 동시 계산과 Native 메시 직접 업로드', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-BOUNDS-001 · CM-NATIVE-MESH-001',
        gist: '분할 결과와 함께 경계상자를 계산·축약하고, Native 정점·인덱스 버퍼를 관리형 변환 없이 메시 API로 직접 업로드했다.',
        codes: nativeCodes,
        metrics: C.nativeFrame.diagnostics.map((item) => ({
          value: `${item.before} → ${item.after}`,
          label: item.label,
          note: 'Diagnostics 보간 프레임 중앙값',
        })),
        note: C.nativeFrame.condition,
      },
      {
        cls: 'cm', layout: 'cmPlacement', section: '문제 해결 3 · 판단',
        title: '실행 위치 선택 기준: 작업 크기와 결과 필요 시점', kind: 'EXECUTION PLACEMENT',
        claim: 'placement.title',
        placement,
      },
      {
        cls: 'cm', layout: 'cmSplit', section: '문제 해결 3 · 작은 작업',
        title: '같은 Burst Split에서 메인 실행을 선택한 근거', kind: 'SAME CODE · DIFFERENT PLACEMENT',
        claim: 'CM-SPLIT-RUN-001',
        nativeFrame,
        sequences: splitSequences,
        copy: {
          problem: '작은 Split을 워커에 예약해도 같은 프레임의 렌더링 전에 완료를 기다려야 해 스케줄·동기화 비용이 남았다.',
          conclusion: '동일한 NativeArray·IJobParallelFor·Burst 본문을 두 실행 위치에서 비교했다. 가지치기 뒤 약 40레이어인 Editor 조건에서는 메인 즉시 실행의 Split Average가 더 짧아 이를 채택했다.',
          sequenceCaption: '워커 경로도 Split 결과가 같은 프레임의 렌더링에 필요해 `Complete`에서 기다렸다. 비교에서는 Burst 본문을 유지하고 실행 위치만 바꿨다.',
        },
      },
      {
        cls: 'cm', layout: 'cmBuriedDecision', section: '문제 해결 3 · 큰 작업',
        title: '한 틱 미룰 수 있는 파묻힘 판정의 워커 예약', kind: 'ASYNC DECISION',
        claim: 'CM-PRUNE-003 · CM-PRUNE-SCALE-001',
        asyncConfirm,
        copy: {
          problemLabel: '확정 순간의 지연',
          metricLabel: '확정 프레임 메인 지연 중앙값 · 워커 예약 / 메인 즉시 실행',
          metricNote: '최대 · 워커 44.0µs / 메인 즉시 실행 492.3µs',
          profileCaption: '회차별 3런 중앙값이다. 비확정 프레임 20.5µs와 20.2µs는 노이즈 범위였으며, 그래프는 워커 본문을 합산한 전체 CPU가 아니라 확정 순간의 메인 지연을 비교한다.',
          boundary: '이 그래프는 접기 확정 순간 메인 스레드가 붙잡힌 시간을 비교한다. 선의 점은 회차별 3런 중앙값이며 워커 본문을 더한 전체 CPU가 아니다. 비확정 프레임의 20.5µs와 20.2µs 차이는 노이즈 범위였다.',
        },
      },
      {
        cls: 'cm', layout: 'cmBuriedCode', section: '문제 해결 3 · 비차단 구현',
        title: '완료된 결과만 수확하는 비차단 구현', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-PRUNE-002',
        asyncConfirm,
        copy: {
          prerequisite: '확정 상태를 하나의 PaperSnapshot으로 관리하고 고정 이력 링이 그 수명을 보장했다. 워커는 해당 Snapshot을 읽고, 완료된 이후 틱에 결과를 반환했다.',
          rule: '예약되지 않았거나 작업이 끝나지 않았으면 즉시 반환한다. 완료된 경우에만 결과를 수확해 기준 Snapshot을 압축한다.',
          codeCaption: '예약 여부와 완료 상태를 먼저 확인한다. 작업이 끝나지 않았으면 반환하고, 완료된 경우에만 결과를 수확·압축해 기준 Snapshot을 다시 연결한다.',
          proofCondition: '이전 동기 확정 경로와 현재 경로의 복합 비교이며, PaperSnapshot 네이티브화와 Buried 비동기화를 함께 포함한다. 워커 배치만의 단독 효과가 아니다.',
          boundary: '비교 값은 워커 본문을 합산한 총 CPU 시간이 아니라, 접기 확정 순간 메인 스레드가 붙잡힌 시간이다. 비확정 프레임 차이는 노이즈 범위였다.',
        },
      },
    ],
  };
})();
