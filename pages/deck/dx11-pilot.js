// pages/deck/dx11-pilot.js
// 슬라이드 덱 매니페스트 — DX11 파일럿.
//
// ⚠️ 이 파일은 사실을 만들지 않는다. pages/dx11-engine/data.js 를 참조만 한다.
//    문장을 여기 복사해 넣으면 사이트와 덱이 갈라진다. 고쳐야 하면 data.js 를 고친다.
//
// 하는 일은 둘뿐이다 — (1) 어떤 순서로 놓을지, (2) 각 절에서 무엇을 뽑을지.
//
// 뺀 것 (지면 경쟁에서 밀린 것이지 약해서가 아니다):
//   boundary.recv / boundary.send — 통로 넷의 세부. §frame 한 장이 통로 전체를 대신한다
//   collision.ccd / collision.narrow — 스윕 부피 · 분리축 15개. 그래픽스·수학 축은
//     Labs(GPU 유체 · 볼류메트릭)가 더 강하게 덮으므로 엔진 덱에서는 뺀다
//   render.refl / render.debug / render.queue — 셰이더 리플렉션 · 바인딩 디버거 · 상태 버킷
//   core — 컴포넌트 수명 · 메모리/리소스/입력. 앞 절들과 인과가 없어 덱에서 자른다

(function buildDeck() {
  const D = window.DX11_DATA;

  const step = (section, st, over) => Object.assign({ layout: 'step', section, no: st.no, step: st }, over);

  window.DECK_DX11 = {
    name: 'DX11 Custom Engine',
    slides: [
      // ─── 표지 ───
      {
        layout: 'cover',
        section: 'Main · Engine',
        subtitle: D.meta.subtitle,
        title: D.meta.title,
        hook: D.hook,
        pills: D.meta.pills,
        hero: D.hero,
      },

      // ─── 역할 경계. 규모보다 먼저 온다 — 뭘 직접 짰는지가 안 서면 나머지가 안 읽힌다 ───
      {
        layout: 'columns',
        section: '00 범위',
        // 제목·라벨은 슬라이드 어법으로 바꾼다. data.js 의 "무엇을 직접 짰고 무엇을
        // 가져다 썼나" 는 노트 톤이라 웹 본문에서는 맞지만, 스캔하는 매체에서는
        // 명사구여야 한다. 바꾸는 것은 제목뿐이고 항목(reads/skips)은 원문 그대로다.
        title: '자체 구현과 외부 의존',
        gist: D.context.scope.lead,
        cols: [
          { kind: 'BUILT', title: '자체 구현', items: D.context.scope.reads },
          { kind: 'EXTERNAL', title: '외부 라이브러리 · API', items: D.context.scope.skips },
        ],
      },

      // ─── 만든 것 3칸 ───
      {
        layout: 'columns',
        section: '00 구성',
        title: '엔진을 이루는 세 축',
        cols: D.built.map((b) => ({ kind: b.kind, title: b.title, sub: b.sub })),
      },

      // ─── §01 경계 — 이 페이지에서 유일하게 진짜 인과가 있는 절 ───
      // 요점 5개는 그림과 나란히 두면 넘친다. '충돌 형상도 같이'는 §03 충돌이 따로 말하므로 뺀다
      step('01 경계', D.boundary.steps[0], { gist: D.boundary.gist, points: D.boundary.steps[0].points.filter((_, i) => i !== 3) }),
      step('01 경계', D.boundary.steps[3]), // batch  · code
      step('01 경계', D.boundary.steps[4]), // compact· viz compact

      // ─── §02 프레임 — 통로 넷이 서브스텝 반복 바깥에 있다 ───
      {
        layout: 'list',
        section: '02 프레임',
        title: '통로 넷은 서브스텝 바깥에 있다',
        gist: D.frame.gist,
        pairs: D.frame.points,
        pairCols: 2,
      },

      // ─── §03 충돌 ───
      step('03 충돌', D.collision.steps[0], { gist: D.collision.gist }), // tree · viz fat
      // 응답 단계는 요점이 6개라 한 장에 안 들어간다 — 솔버 자체를 말하는 앞 4개만 남긴다
      step('03 충돌', D.collision.steps[3], { points: D.collision.steps[3].points.slice(0, 4) }),

      // ─── §04 렌더 ───
      step('04 렌더', D.render.steps[3], { gist: D.render.gist }), // arena · code

      // ─── §07 남은 것 — 헤드라인("만든 뒤에는 숫자를 봅니다")과 직결되는 장이다.
      //     재지 못한 것을 재지 못했다고 적는 것이 그 주장의 증거다 ───
      {
        layout: 'list',
        section: '05 남은 것',
        title: '측정하지 못한 것과 남은 결함',
        pairs: [D.limits[0], D.limits[1], D.limits[2], D.limits[3], D.limits[5], D.limits[7]],
        pairCols: 2,
      },
    ],
  };
})();
