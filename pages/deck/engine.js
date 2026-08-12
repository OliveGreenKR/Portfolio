// pages/deck/engine.js
// 직무별 덱 조립 — 엔진 프로그래머.
//
// 이 파일이 하는 일은 **순서와 목차**뿐이다. 어떤 절을 뽑을지는 프로젝트별 매니페스트
// (deck/{project}.js)가 갖고, 사실은 pages/{project}/data.js 가 갖는다.
// 직무가 바뀌면 이 파일만 하나 더 만든다 — 데이터도 뷰도 안 건드린다.
//
// 순서 원칙: **최신이면서 내용의 질이 좋은 것부터.** 직무 적합도만으로 정하지 않는다 —
// 오래된 작업은 직무에 맞아도 지금의 실력을 대변하지 못한다.
//   cm       — 가장 최신. 계측된 개선이고, 사이트 전체에서 before/after 측정본이 있는 유일한 것
//   dx11     — 프로젝트 자체는 엔진 직군에 가장 맞지만 가장 오래됐다. 내용의 질이 cm 에 못 미친다
//   cartapli — 출시와 시스템 설계. 팀 작업이라 역할 경계를 먼저 밝힌다
//   motelet  — 수학 모델 → 도구 → 런타임. 계산으로 밸런싱을 판단한 과정이 이 덱의 다른 축이다
//
// 덱에 **안 넣는 것** (2026-08-12 사용자 판단):
//   Wobble Wobble · 교육용 게이미피케이션(외주) · Labs 5종
//   -> 한 장짜리 요약 넉 장을 뒀었지만, 장당 정보 밀도가 낮아 분량만 늘렸다.
//      대신 표제지 이력에 **한 줄씩** 적고 출시작은 스토어 링크로 연결한다 (deck/intro.js).
//      매니페스트 파일(deck/wobble.js · edu.js · labs.js)은 지우지 않고 남겨 둔다 —
//      클라이언트 · 서버 직무 덱에서는 되살릴 값어치가 있다. 지금은 로드하지 않는다.

(function buildEngineDeck() {
  const P = window.DECK_PARTS || {};
  const FULL = ['intro', 'cm', 'dx11', 'cartapli', 'motelet', 'outro'];

  // 프로젝트 하나만 검토할 때 — deck.html?only=cm  (여러 개면 쉼표)
  // 별도 HTML 을 프로젝트마다 만들지 않는 이유: 최종 산출물이 PDF 한 개라
  // 조립본이 반드시 필요하고, 개별본을 따로 두면 두 벌이 갈라진다.
  const only = new URLSearchParams(location.search).get('only');
  const ORDER = only ? only.split(',').map((x) => x.trim()) : FULL;

  const ROLE = '게임 클라이언트 · 엔진 프로그래머';

  // ─── 조립 ───
  const slides = [];
  const spans = [];
  ORDER.forEach((key) => {
    const part = P[key];
    if (!part) return;
    const start = slides.length;
    part.slides.forEach((s) => slides.push(Object.assign({ proj: part.proj }, s)));
    spans.push({ key, part, start, end: slides.length - 1 });
  });

  // ─── 목차 ───
  // 표제지 바로 뒤(2쪽)에 한 장. 프로젝트 단위로만 낸다 — 장 단위로 늘어놓으면
  // 목차가 두 장이 되고, 그러면 목차가 아니라 색인이다.
  //
  // 태그·쪽수는 여기서 **세어서** 만든다. 손으로 적으면 슬라이드를 하나 넣고 뺄 때마다
  // 어긋나고, 어긋난 목차는 목차가 없는 것보다 나쁘다.
  // 태그의 출처는 각 프로젝트 표지의 pills — 매니페스트가 이미 고른 것이라 여기서 안 고른다.
  if (spans.length && spans[0].key === 'intro') {
    const TOC_AT = 1;
    // 표기만 맞춘다 (값은 안 건드린다). data.js 의 pills 는 페이지 배지용이라
    // '13 weeks' · '4 인' 인데, 표제지 이력 줄은 '13주' · '4인' 으로 낸다.
    // 두 장이 붙어 있어 표기가 갈리면 바로 보인다.
    // '역할 — ' 접두사도 뗀다 — 네 프로젝트 중 CM 만 붙어 있어 칸의 축이 어긋난다.
    const tag = (t) => String(t)
      .replace(/(\d)\s*weeks?\b/i, '$1주')
      // 한글 뒤에는 \b 가 안 걸린다 (JS 의 \b 는 ASCII 기준) — 경계를 쓰지 않는다.
      .replace(/(\d)\s+인/, '$1인')
      .replace(/^역할\s*[—-]\s*/, '');
    // 목차를 끼우면 그 뒤 슬라이드가 한 칸씩 밀린다. 1-기반 쪽 번호로 바꿔 준다.
    const page = (i) => (i >= TOC_AT ? i + 1 : i) + 1;

    const entries = spans
      .filter((sp) => sp.key !== 'intro' && sp.key !== 'outro')
      .map((sp, i) => {
        const cover = sp.part.slides[0] || {};
        return {
          no: String(i + 1).padStart(2, '0'),
          title: sp.part.proj,
          // 표지 제목은 프로젝트명이 아니라 그 프로젝트의 한 줄 주장이다 — 부제로 쓴다.
          sub: cover.title && cover.title !== sp.part.proj ? cover.title : null,
          tags: (cover.pills || []).map((p) => tag(p.text)),
          from: page(sp.start),
          to: page(sp.end),
          href: '#s' + page(sp.start),
        };
      });

    slides.splice(TOC_AT, 0, {
      layout: 'toc',
      proj: 'JCH Portfolio',
      section: 'Contents',
      title: '목차',
      entries,
      note: '각 줄을 누르면 그 프로젝트의 첫 장으로 간다. 오른쪽 숫자는 쪽 범위다.',
    });
  }

  // 표제지의 지원 직무는 이 덱이 정한다 — about/data.js 의 "클라이언트 프로그래머" 는
  // 사이트의 사실이고, 지원 직무는 덱마다 다르다. 매니페스트 로드 순서와 무관하게
  // 조립 시점에 덮는다 (intro.js 가 engine.js 보다 먼저 실행된다).
  slides.forEach((s) => {
    if (s.layout !== 'title' || !s.facts) return;
    s.facts = s.facts.map((f) => (f[0] === '지원 직무' ? ['지원 직무', ROLE] : f));
  });

  window.DECK_ENGINE = { name: 'JCH · 엔진 프로그래머', role: ROLE, slides };
})();
