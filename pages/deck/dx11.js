// pages/deck/dx11.js
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
  // 그림이 주인공인 장. step 의 좌우 2단은 그림에 절반 폭·절반 세로밖에 못 준다.
  const diagram = (section, st, over) => Object.assign({ layout: 'diagram', section, no: st.no, step: st }, over);

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.dx11 = {
    proj: 'DX11 Custom Engine',
    slides: [
      // ─── 표지 ───
      {
        layout: 'cover',
        section: 'Main · Engine',
        subtitle: D.meta.subtitle,
        title: D.meta.title,
        hook: D.hook,
        pills: D.meta.pills,
        // 표지에서 바로 눌리는 링크. data.js 에 있는 것만 쓴다 —
        // CM 처럼 링크가 없는 프로젝트는 이 줄이 없고, LinkRow 가 알아서 안 그린다.
        links: [
          { label: 'Repo', v: D.repo.label.replace('github.com/', ''), href: D.repo.href, tone: 'blue' },
          { label: 'Demo', v: '데모 영상', href: D.youtube.href, tone: 'terra' },
        ],
        hero: D.hero,
      },

      // ─── 역할 경계. 규모보다 먼저 온다 — 뭘 직접 짰는지가 안 서면 나머지가 안 읽힌다 ───
      {
        layout: 'columns',
        section: '00 범위',
        // 제목·라벨은 슬라이드 어법으로 바꾼다. data.js 의 "무엇을 직접 짰고 무엇을
        // 가져다 썼나" 는 노트 톤이라 웹 본문에서는 맞지만, 스캔하는 매체에서는
        // 명사구여야 한다. 바꾸는 것은 제목뿐이고 항목(reads/skips)은 원문 그대로다.
        title: '구현 범위',
        gist: D.context.scope.lead,
        cols: [
          { kind: 'BUILT', tone: 'sage', title: '자체 구현', items: D.context.scope.reads },
          { kind: 'EXTERNAL', title: '외부 라이브러리 · API', items: D.context.scope.skips },
        ],
      },

      // ─── 만든 것 3칸 ───
      {
        layout: 'columns',
        section: '00 구성',
        title: '엔진 구성',
        // 세 축은 서로 다른 영역이라 색으로 갈라 둔다
        cols: D.built.map((b, i) => ({ kind: b.kind, tone: ['sage', 'wheat', 'blue'][i],
                                       title: b.title, sub: b.sub })),
      },

      // ─── §01 경계 — 이 페이지에서 유일하게 진짜 인과가 있는 절 ───
      // 그림이 주인공인 장은 요점을 둘만 남긴다 — 그림이 이미 말하는 것을 글로 또 쓰지 않는다.
      // own: 그림이 소유권 이전을 보이므로, 배열 형태(SoA)와 그래서 열린 것만 남긴다
      diagram('01 경계', D.boundary.steps[0], { title: '소유권 이전',
        points: [D.boundary.steps[0].points[0], D.boundary.steps[0].points[1], D.boundary.steps[0].points[4]] }),
      step('01 경계', D.boundary.steps[3], { title: '배치 순회' }), // batch · code
      // compact: 그림이 당겨 채우기와 ID 유지를 보이므로, 그림에 없는 정책 둘만
      diagram('01 경계', D.boundary.steps[4], { title: '슬롯 압축',
        points: [D.boundary.steps[4].points[1], D.boundary.steps[4].points[2], D.boundary.steps[4].points[3]] }),

      // ─── §02 프레임 — 통로 넷이 서브스텝 반복 바깥에 있다 ───
      {
        layout: 'list',
        section: '02 프레임',
        title: '통로 넷의 위치',
        gist: D.frame.gist,
        pairs: D.frame.points,
        pairCols: 2,
      },

      // ─── §03 충돌 ───
      // tree: 그림이 여유 폭(fat bounds)을 보이므로 '여유 밖으로 나갈 때만' 은 중복이다
      diagram('03 충돌', D.collision.steps[0], { title: '브로드페이즈', points: D.collision.steps[0].points.slice(0, 3) }),
      // 응답 단계는 요점이 6개라 한 장에 안 들어간다 — 솔버 자체를 말하는 앞 4개만 남긴다
      step('03 충돌', D.collision.steps[3], { title: '충돌 응답', points: D.collision.steps[3].points.slice(0, 4) }),

      // ─── §04 렌더 ───
      step('04 렌더', D.render.steps[3], { title: '프레임 아레나' }), // arena · code

      // ─── §05·06 — 헤드라인("만든 뒤에는 숫자를 봅니다")과 직결되는 두 장.
      //     글 목록이 아니라 카드로 간다 — 슬라이드는 읽는 매체가 아니라 스캔하는 매체다.
      //     카드 제목만 훑어도 성격이 갈려야 한다.
      {
        layout: 'columns',
        section: '05 검증',
        title: '검증 범위',
        gist: '코드로 참·거짓이 갈리는 것만 본문에 실었다. 눈과 화면 카운터로만 본 것은 여기 모은다.',
        cols: [
          { mark: '✗', tone: 'terra', kind: '계측', title: '측정 도구 없음',
            pairs: [D.limits[0], D.limits[1]] },
          { mark: '✗', tone: 'terra', kind: '검사', title: '자동 검증 없음',
            pairs: [D.limits[3], D.limits[7]] },
          // 지어낸 계획이 아니라 실제로 한 것이다. 출처 = pages/cartapli-mobile/data.js
          // (프레임당 CPU 0.643 → 0.040 ms 를 3사이클로 분리 측정 · 측정 조건 명시 ·
          //  네이티브 구현을 관리형 구현과 오라클로 대조).
          { mark: '✓', tone: 'sage', kind: '이후 프로젝트', title: 'Cartapli Mobile 에서 확보',
            pairs: [
              ['측정 조건을 남긴다', '기기 · 씬 · 로그 배제 여부를 적고 프레임당 CPU 를 세 사이클로 갈라 잰다 — 구조로 얼마, Burst 로 얼마.'],
              ['구현끼리 대조한다', '네이티브 구현이 관리형 구현과 같은 답을 내는지 오라클로 확인하고, 쌓임 순서는 파이프라인 테스트로 따로 본다.'],
            ] },
        ],
      },
      {
        layout: 'columns',
        section: '06 한계',
        title: '결함과 한계',
        cols: [
          { kind: '결함', tone: 'terra', title: '재현 가능',
            pairs: [D.limits[2], D.limits[6]] },
          { kind: '범위 배제', title: '애초에 넣지 않음',
            pairs: [D.limits[4], D.limits[5], D.limits[8]] },
        ],
      },
    ],
  };
})();
