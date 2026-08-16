// Cartapli Mobile 제출용 덱 매니페스트.
// 사실 SSOT: pages/cartapli-mobile/data.js
// 이 파일은 절 선택, 순서, 제목·라벨 매핑만 담당한다.
//
// 선택한 10장
// 1 표지 — 프로젝트 정체성·직접 구현·대표 결과
// 2 시스템 — BattleSimulation이 소유하는 책임 경계
// 3 실행 — Variable / Fixed / Presentation의 완성 흐름
// 4 결과 — S0부터 S2-b까지의 단계별 계측
// 5 구조 — 확정 순간 파묻힌 조각 제거
// 6 렌더 구조 — 레이어별 뷰를 앞·뒤 두 메시로 병합
// 7 렌더 코드 — 두 메시 병합의 직접 구현 근거
// 8 네이티브 구조 — 관리형 미리보기를 재사용 버퍼와 Job으로 교체
// 9 네이티브 코드 — Schedule과 화면 반영을 분리한 직접 구현 근거
// 10 범위 — 측정 해석과 다음 검증
//
// 제외
// - S1-1 전용 장: 결과 그래프에는 남긴다. 중간 진단 단계이고, S1-2·S2-a·S2-b가
//   판단과 직접 구현을 더 짧게 증명하므로 별도 Before/After·코드는 사이트에서만 유지한다.
// - S1-2 코드 장: 제거 시점과 되돌리기 경계는 구조 그림과 요점으로 전달된다. 코드까지
//   넣으면 강한 구현 증거인 S2-a·S2-b 코드와 경쟁한다.
// - Confirm transaction 전용 장: 실행 단계의 핵심은 Job 예약과 화면 반영의 분리다.
//   확정 트랜잭션은 사이트에서 전체 흐름과 함께 유지한다.
// - 전체 검증 appendix: 공개 결과·현재 한계·다음 산출물만 마지막 장에 재선택한다.
// - 새 수치·새 사실·PDF: 만들지 않는다.

(function buildCartapliMobileDeck() {
  const C = window.CM_DATA;
  const SITE = 'https://olivegreenkr.github.io/Portfolio/pages/cartapli-mobile.html';
  const byId = (id) => C.methods.find((item) => item.id === id);
  const prune = byId('prune');
  const merge = byId('merge');
  const native = byId('native');
  const external = C.meta.links.filter((link) => link.external);
  const tones = ['sage', 'wheat', 'blue'];

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cm = {
    proj: C.meta.title,
    slides: [
      {
        layout: 'cover',
        section: '프로젝트',
        subtitle: C.meta.subtitle,
        title: C.meta.title,
        hook: C.meta.boundary,
        pills: C.meta.metrics.map((metric, index) => ({
          text: metric.value + ' · ' + metric.label,
          tone: tones[index],
          kind: index === 0 ? 'accent' : null,
        })),
        links: [
          { label: '상세 페이지', v: '전체 흐름 · 코드 · 계측', href: SITE, tone: 'sage', hero: true },
          { label: external[0].label, href: external[0].href, tone: 'blue' },
          { label: external[1].label, href: external[1].href, tone: 'wheat' },
        ],
        hero: { img: C.meta.media.src, caption: C.meta.media.caption },
      },
      {
        layout: 'diagram',
        section: '아키텍처',
        title: 'BattleSimulation 중심의 시스템 책임 경계',
        lead: C.architecture.gist,
        step: { viz: 'system-map' },
        vizComponent: 'CMSystemMap',
        vizProps: { systems: C.architecture.systems },
      },
      {
        layout: 'diagram',
        section: '실행 흐름',
        title: '계산과 화면 반영이 분리된 시뮬레이션 실행 단계',
        lead: C.architecture.body,
        step: { viz: 'simulation-flow' },
        vizComponent: 'CMSimulationFlow',
        vizProps: { lanes: C.architecture.lanes, clock: C.architecture.clock },
      },
      {
        layout: 'diagram',
        section: '계측 결과',
        title: '같은 입력으로 분리한 다섯 단계 최적화 결과',
        lead: C.result.gist,
        step: { viz: 'stage-chart' },
        vizComponent: 'CMStageChart',
        vizProps: { bars: C.result.bars },
        points: C.meta.metrics.map((metric) => [
          metric.label,
          metric.value + ' · ' + metric.detail,
        ]),
        note: C.result.conditions[3][1],
      },
      {
        layout: 'diagram',
        section: prune.stage,
        title: '확정 순간의 파묻힌 조각 제거',
        lead: prune.gist,
        step: { viz: 'before-after' },
        vizComponent: 'CMBeforeAfter',
        vizProps: { before: prune.before, after: prune.after, stage: prune.stage },
        points: [
          [prune.metric.value, prune.metric.detail + ' · ' + prune.metric.label],
        ],
        note: prune.scope,
      },
      {
        layout: 'diagram',
        section: merge.stage,
        title: '레이어별 뷰를 대체한 앞·뒤 두 메시',
        lead: merge.gist,
        step: { viz: 'before-after' },
        vizComponent: 'CMBeforeAfter',
        vizProps: { before: merge.before, after: merge.after, stage: merge.stage },
        points: [
          [merge.metric.value, merge.metric.detail + ' · ' + merge.metric.label],
        ],
        note: merge.scope,
      },
      {
        layout: 'step',
        section: merge.stage + ' · 구현 근거',
        title: '앞·뒤 두 메시 병합의 구현 근거',
        step: { code: Object.assign({ lang: 'csharp' }, merge.code.after) },
        points: [
          ['판단', merge.gist],
          ['결과', merge.code.after.result],
          ['측정', merge.metric.detail + ' · ' + merge.metric.value],
        ],
        note: merge.scope,
      },
      {
        layout: 'diagram',
        section: native.stage,
        title: '관리형 미리보기를 대체한 재사용 네이티브 분할 경로',
        lead: native.gist,
        step: { viz: 'before-after' },
        vizComponent: 'CMBeforeAfter',
        vizProps: { before: native.before, after: native.after, stage: native.stage },
        points: [
          [native.metric.value, native.metric.detail + ' · ' + native.metric.label],
        ],
        note: native.scope,
      },
      {
        layout: 'step',
        section: native.stage + ' · 구현 근거',
        title: '분할 Job 예약과 화면 반영의 구현 경계',
        step: { code: Object.assign({ lang: 'csharp' }, native.code.after) },
        points: [
          ['계산 단계', C.architecture.lanes[0].items[0][2]],
          ['화면 반영', C.architecture.lanes[2].items[0][2]],
          ['결과', native.code.after.result],
        ],
        note: native.scope,
      },
      {
        layout: 'columns',
        section: '검증 범위',
        title: '측정 해석과 다음 검증 범위',
        gist: C.validation.intro,
        colCount: 3,
        cols: C.validation.columns.map((column, index) => ({
          kind: index === 0 ? 'CONFIRMED' : index === 1 ? 'MEASUREMENT SCOPE' : 'NEXT ARTIFACTS',
          tone: tones[index],
          title: column.title,
          items: column.items,
        })),
        note: C.result.correction.title + ' — ' + C.result.correction.body,
      },
    ],
  };
})();
