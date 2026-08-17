// Cartapli Mobile 제출용 덱 매니페스트.
// 사실 SSOT: pages/cartapli-mobile/data.js (Final Gate 통과본)
// 이 파일은 절 선택·순서·제목만 소유한다. 새 수치·새 사실은 만들지 않는다.
// 레이아웃은 deck/cm-slides.jsx, 그림은 페이지가 그린 CMPage* 를 그대로 마운트한다.
//
// ─── 8장 ───────────────────────────────────────────────────────────────────
//  1 표지        실측 화면 + 측정축 3개 카드 + 역할·환경
//  2 계측 결과    단계별 개선 곡선 + 계측 정정 + 조건표 + 축별 중간값
//  3 실행 구조    Variable → Fixed → Presentation 호출 흐름 + 판단 3건
//  4 S1-1        원본 참조 재사용        그림 + before/after 코드
//  5 S1-2        파묻힌 조각 제거        그림 + before/after 코드
//  6 S2-a        앞·뒤 두 메시 병합      그림 + before/after 코드
//  7 S2-b        NativeArray·Job·Burst   그림 + before/after 코드
//  8 검증 범위    적용 범위와 다음 검증
//
// ─── 이전 판(10장)을 버린 이유 ──────────────────────────────────────────────
// 공용 4레이아웃(cover/diagram/step/columns)에 맞추다 보니 한 주제가 [그림 장 + 코드 장]
// 두 장으로 갈라졌다. 그 결과 (a) 코드 장의 왼쪽 열이 앞 장 문장의 복사본이 되고,
// (b) 정작 개선 방식 장에는 코드가 없고, (c) 장당 밀도가 떨어져 한 주제가 길어졌다.
// 단계당 한 장으로 접고 그림·코드·측정·트레이드오프를 같은 화면에 둔다.
//
// 그림도 바꿨다. 이전 판은 legacy CMStageChart(막대 행)·CMBeforeAfter(상자 나열)를 썼는데,
// 같은 저장소의 사이트 페이지에 이미 이 프로젝트 전용으로 그린 것이 있다 —
// 단계별 개선 **곡선**, 실제 호출 순서 **흐름도**, 방식마다 다른 **before/after 삽화**
// (겹친 종이 더미 · 레이어별 GameObject 제출 · worker execution window · NativeArray 버퍼).
// 덱이 사이트보다 못한 그림을 새로 그릴 이유가 없다. 읽기 재사용한다.
//
// ─── 뺀 것 ─────────────────────────────────────────────────────────────────
// - 클래스 책임 관계도(CMPageArchitectureDiagram): 실행 순서 흐름도와 주장이 겹친다.
//   호출 순서 쪽이 뒤의 네 단계와 직접 이어지므로 그쪽만 남긴다.
// - Confirm transaction(A/B/C): 흐름도의 Presentation 구간이 같은 경계를 말한다.
// - 새 수치·새 사실·PDF: 만들지 않는다.

(function buildCartapliMobileDeck() {
  const C = window.CM_DATA;
  const SITE = 'https://olivegreenkr.github.io/Portfolio/pages/cartapli-mobile.html';
  const external = C.meta.links.filter((link) => link.external);
  const byId = (id) => C.methods.find((method) => method.id === id);

  // 단계 장은 전부 같은 틀이다 — data.js 의 method 하나를 통째로 넘긴다.
  // 제목·번호·종류·그림·코드·측정·범위가 모두 그 안에 있어 매니페스트가 고를 것이 없다.
  const methodSlide = (id) => {
    const method = byId(id);
    return { cls: 'cm', layout: 'cmMethod', section: method.stage + ' · ' + method.kind, method };
  };

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cm = {
    proj: C.meta.title,
    slides: [
      {
        cls: 'cm',
        layout: 'cmCover',
        section: C.meta.eyebrow,
        title: C.meta.title,
        meta: C.meta,
        conditions: C.result.conditions,
        // 표지 pill 은 목차 태그로도 쓰인다(engine.js). 짧게 유지한다.
        pills: C.meta.metrics.map((metric) => ({ text: metric.value + ' · ' + metric.label })),
        links: [
          { label: '상세 페이지', href: SITE },
          { label: external[0].label, href: external[0].href },
          { label: external[1].label, href: external[1].href },
        ],
      },

      {
        cls: 'cm',
        layout: 'cmResult',
        section: '계측 결과',
        no: '02',
        title: '다섯 단계로 나눠 본 최적화 방식별 개선 결과',
        kind: 'S0 → S2-b · MEASURED',
        result: C.result,
      },

      {
        cls: 'cm',
        layout: 'cmFlow',
        section: '실행 구조',
        no: '01',
        title: '종이접기 전투의 핵심 시뮬레이션 실행 경로',
        kind: 'ARCHITECTURE',
        architecture: C.architecture,
      },

      methodSlide('reuse'),
      methodSlide('prune'),
      methodSlide('merge'),
      methodSlide('native'),

      {
        cls: 'cm',
        layout: 'cmValidation',
        section: '검증 범위',
        no: '07',
        title: 'Editor 상대 비교의 적용 범위와 다음 검증',
        kind: 'SCOPE',
        validation: C.validation,
        note: '측정 범위 — 동일 결정론적 16회 입력 · Windows PC · Unity Editor PlayMode 상대 비교',
      },
    ],
  };
})();
