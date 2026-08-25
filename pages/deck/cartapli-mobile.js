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
  const structuralCodes = [C.structural.steps[1], C.structural.steps[2]].map((step) => ({
    title: `${step.key} · ca09945`,
    code: step.code,
    result: step.codeCaption,
  }));
  const nativeCodes = [C.nativeFrame.codes[1], C.nativeFrame.codes[2]].map((code) => ({
    title: code.title,
    code: code.source,
    result: code.caption,
  }));

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
        title: '오염된 계측을 폐기한 동일 입력 재측정', kind: 'MEASUREMENT INTEGRITY',
        claim: 'CM-MEASURE-001',
        measurement: C.measurement,
      },
      {
        cls: 'cm', layout: 'cmOutcome', section: '전체 결과',
        title: '구조 축소에서 실행 위치 선택까지의 96% 감소', kind: 'MEASURED RESULT',
        claim: 'CM-PERF-E2E-001',
        measurement: C.measurement,
        phases: [
          ['구조 축소', C.structural.context.active.map((item) => item.label).join(' · ')],
          ['Native 단일 경로', C.nativeFrame.flow.map((item) => item.title).join(' → ')],
          ['실행 위치 선택', `${C.placement.main.eyebrow} / ${C.placement.worker.eyebrow}`],
        ],
      },
      {
        cls: 'cm', layout: 'cmStructural', section: '문제 해결 1 · 구조',
        title: '늘어나는 입력과 렌더 객체의 구조적 축소', kind: 'REDUCE FIRST',
        claim: 'structural.context · structural.headline',
        structural: C.structural,
      },
      {
        cls: 'cm', layout: 'cmCodeEvidence', section: '문제 해결 1 · 구현',
        title: '가려진 입력 제거와 두 메시 병합의 구현', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-PRUNE-001 · CM-MERGE-001',
        gist: '후속 계산에 필요 없는 조각은 Native 배열에서 압축하고, 남은 조각의 쌓임 순서는 정점 z에 기록해 앞·뒤 두 메시로 보냈다.',
        codes: structuralCodes,
        note: C.structural.warning,
      },
      {
        cls: 'cm', layout: 'cmNative', section: '문제 해결 2 · 데이터 경로',
        title: 'Split부터 Render까지 이어진 Native 단일 경로', kind: 'DATA FLOW',
        claim: 'nativeFrame.flow · nativeFrame.unification',
        nativeFrame: C.nativeFrame,
      },
      {
        cls: 'cm', layout: 'cmCodeEvidence', section: '문제 해결 2 · 구현',
        title: '관리형 왕복과 Bounds 재순회를 없앤 구현', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-BOUNDS-001 · CM-NATIVE-MESH-001',
        gist: 'Split 출력에서 Bounds를 함께 계산·축약하고, Native 정점·인덱스 버퍼를 관리형 변환 없이 메시 API로 직접 올렸다.',
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
        title: '작업 크기와 결과 마감에 따른 Main·Worker 배치', kind: 'EXECUTION PLACEMENT',
        claim: 'placement.title',
        placement: C.placement,
      },
      {
        cls: 'cm', layout: 'cmSplit', section: '문제 해결 3 · 작은 작업',
        title: '약 40레이어 Split의 Burst Main Run 선택', kind: 'SAME CODE · DIFFERENT PLACEMENT',
        claim: 'CM-SPLIT-RUN-001',
        nativeFrame: C.nativeFrame,
      },
      {
        cls: 'cm', layout: 'cmBuriedDecision', section: '문제 해결 3 · 큰 작업',
        title: '한 틱 지연 가능한 Buried의 Worker 예약', kind: 'ASYNC DECISION',
        claim: 'CM-PRUNE-003 · CM-PRUNE-SCALE-001',
        asyncConfirm: C.asyncConfirm,
      },
      {
        cls: 'cm', layout: 'cmBuriedCode', section: '문제 해결 3 · 비차단 구현',
        title: '완료된 틱에서만 수확하는 비차단 구현', kind: 'IMPLEMENTATION EVIDENCE',
        claim: 'CM-PRUNE-002',
        asyncConfirm: C.asyncConfirm,
      },
    ],
  };
})();
