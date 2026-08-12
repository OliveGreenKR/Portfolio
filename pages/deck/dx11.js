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

  // 라벨만 명사구로 덮는다. 본문은 원문 그대로.
  // 사이트는 노트 톤이라 서술형 라벨이 맞지만, 슬라이드 라벨이 종결형이면 스캔이 끊긴다.
  const relabel = (pair, label) => [label, pair[1]];
  // 덱에 없는 것을 가리키는 지시어를 지운다 ("아래 셋" · "이 반복").
  // 페이지에서는 맞는 말이지만 슬라이드에는 가리킬 대상이 없다.
  const deref = (text, from, to) => text.replace(from, to);

  // 코드가 오른쪽에 오는 장은 lead 를 **아예 안 준다** — codeOf 와 같은 규칙이다.
  // did 한 줄만 남겨 두었더니 그 장들이 덱에서 가장 긴 두 장이 됐는데(실측 1187 · 1039자)
  // 사실은 셋넷뿐이었다. 남은 did 는 셋 다 요점이나 code.intro 가 이미 말한다:
  //   배치 순회   — points[0](중력→힘→…) + 코드의 batchStart += BatchSize
  //   충돌 응답   — points[0](제약 셋 분리) + code.intro(반발과 위치 보정이 목표 속도로)
  //   바인딩 캐시 — points[0] + 코드의 CurrentVB 비교 분기
  // 34px 짜리 lead 한 줄이 빠진 자리에 사실을 더 싣는다.
  const step = (section, st, over) => Object.assign(
    { layout: 'step', section, no: st.no,
      step: st.code && !st.viz ? Object.assign({}, st, { problem: null, did: null }) : st },
    over);
  // 그림이 주인공인 장. step 의 좌우 2단은 그림에 절반 폭·절반 세로밖에 못 준다.
  const diagram = (section, st, over) => Object.assign({ layout: 'diagram', section, no: st.no, step: st }, over);
  // 코드 장. 그림 장과 나눈 이유는 한 장에 그림 + 코드 + 요점을 다 넣으면 셋 다 작아지고,
  // 무엇보다 **설계 설명만 있고 코드가 없는 장**이 남기 때문이다.
  //
  // lead(problem/did)를 안 준다. 코드 블록이 제 제목(code.title)과 소개(code.intro)를
  // 이미 그리므로, 여기 넣으면 같은 문장이 한 화면에 위아래로 두 번 나온다.
  const codeOf = (section, st, title, points) => ({
    layout: 'step', section, no: st.no, title,
    step: { code: st.code, points: [] },
    points,
  });

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

      // ─── 구성과 범위. 원래 두 장이었는데 각각 67% · 65% 로 헐거웠다 ───
      // 장을 키운다고 밀도가 오르지 않는다. 둘 다 "이 엔진이 무엇으로 되어 있나" 한 질문의
      // 서로 다른 답(무엇을 만들었나 / 어디까지가 내 것인가)이라 한 장에 다섯 칸으로 접는다.
      // 위 줄 셋 = 만든 것, 아래 줄 둘 = 직접 짠 것 / 가져다 쓴 것.
      {
        layout: 'columns',
        section: '00 구성',
        title: '엔진 구성과 구현 범위',
        // 제목·라벨은 슬라이드 어법으로 바꾼다. data.js 의 "무엇을 직접 짰고 무엇을
        // 가져다 썼나" 는 노트 톤이라 웹 본문에서는 맞지만, 스캔하는 매체에서는
        // 명사구여야 한다. 바꾸는 것은 제목뿐이고 항목(reads/skips)은 원문 그대로다.
        gist: deref(D.context.scope.lead, '아래 셋은 가져다 썼다', '가져다 쓴 것은 셋뿐이다'),
        colCount: 3,
        // 세 축은 서로 다른 영역이라 색으로 갈라 둔다
        cols: D.built
          .map((b, i) => ({ kind: b.kind, tone: ['sage', 'wheat', 'blue'][i],
                            title: b.title, sub: b.sub }))
          .concat([
            // reads[0] 의 앞 세 낱말(물리 · 충돌 · 렌더 파이프라인)은 같은 격자의
            // BOUNDARY · COLLISION · RENDER 카드가 이미 세운다. 나머지만 남긴다.
            { kind: 'BUILT', mark: '✓', tone: 'sage', title: '자체 구현',
              items: D.context.scope.reads.map((t, i) => (i === 0
                ? t.replace(/^물리 · 충돌 · 렌더 파이프라인 · /, '') : t)) },
            { kind: 'EXTERNAL', mark: '✗', title: '외부 라이브러리 · API', items: D.context.scope.skips },
          ]),
      },

      // ─── §01 경계 — 이 페이지에서 유일하게 진짜 인과가 있는 절 ───
      // 그림이 주인공인 장은 요점을 둘만 남긴다 — 그림이 이미 말하는 것을 글로 또 쓰지 않는다.
      // own: 그림이 소유권 이전을 보이므로, 배열 형태(SoA)와 그래서 열린 것만 남긴다
      // '상태 배열' 코드 장을 없앴다. 그 코드는 C++ **선언** 22줄인데, 나열하는 배열 이름이
      // 이 장 points[0] 이 한국어로 주는 목록과 같았다 — 같은 목록을 두 장에 두 언어로 적고 있었다.
      // 게다가 코드 주석의 PrevWorldPosition 줄은 덱에서 뺀 절(collision.ccd)을 가리킨다.
      // 고아가 된 사실 하나(충돌 형상도 배열에)를 이 장이 받는다 —
      // 13번 COLLISION 카드("슬롯 ID 와 형상 데이터만 본다")의 유일한 근거다.
      diagram('01 경계', D.boundary.steps[0], { title: '소유권 이전',
        points: [D.boundary.steps[0].points[0],
                 relabel(D.boundary.steps[0].points[1], '객체의 배열 직접 접근 차단'),
                 relabel(D.boundary.steps[0].points[3], '충돌 형상도 같은 배열에'),
                 relabel(D.boundary.steps[0].points[4], '이전으로 열린 것')] }),
      step('01 경계', D.boundary.steps[3], { title: '배치 순회',
        points: D.boundary.steps[3].points.map((p, i) => (i === 2 ? relabel(p, '정적 객체 필터는 루프 안') : p)),
        // CodeBlock 은 code.result 를 안 그린다 — 코드 장의 마무리 사실이 공짜로 버려지고 있었다.
        note: D.boundary.steps[3].code.result }),
      // compact: 요점 넷을 전부 싣는다. 원래 이 장(셋) + '무결성 규칙' 코드 장(둘)으로
      // 나눠 뒀는데, 코드 장의 요점 하나가 이 장과 같은 문장이었고(points[2] ID 재사용 시한)
      // 코드 블록은 구현이 아니라 헤더 주석 넉 줄 + 선언 둘이었다. 장 하나를 없애고
      // 이 장이 넷을 다 받는 쪽이 실린 사실이 더 많다.
      diagram('01 경계', D.boundary.steps[4], { title: '슬롯 압축과 무결성',
        points: [relabel(D.boundary.steps[4].points[0], '양방향 매핑'),
                 relabel(D.boundary.steps[4].points[1], '지연 압축'),
                 relabel(D.boundary.steps[4].points[2], 'ID 재사용 시한'),
                 relabel(D.boundary.steps[4].points[3], 'generation 필드 없음')],
        note: D.boundary.steps[4].code.result }),

      // ─── §02 프레임 — 통로 넷이 서브스텝 반복 바깥에 있다 ───
      // 이 장은 제목이 「통로 넷의 위치」인데 목록 어디에도 통로 넷을 대지 않고 있었다.
      // 덱은 "통로 넷" 을 세 번 주장하면서(표지 hook · 13번 BOUNDARY 카드 · 이 제목)
      // 넷이 무엇인지는 한 번도 말하지 않았다 — frame.code 주석에 ①②③④ 가 박혀 있고,
      // 반복 바깥이라는 위치까지 코드가 직접 보인다. 이걸 실으면 매니페스트가 recv/send 를
      // 뺄 때 댄 이유("§frame 한 장이 통로 전체를 대신한다")도 그제야 참이 된다.
      //
      // pairs 는 넷만 남긴다. 뺀 셋(속도·힘 상한 / 쓰기 직전 검사 / 값은 설정에서)은 같은 주제이고
      // 숫자가 하나도 없다. '쓰기 직전 검사' 는 배치 순회 장의 code.result 가 같은 말을 한다.
      {
        layout: 'step',
        section: '02 프레임',
        title: '통로 넷의 위치',
        gist: deref(D.frame.gist, '이 반복', '서브스텝 반복'),
        step: { code: D.frame.code, points: [] },
        points: D.frame.points.slice(0, 4)
          .map((p) => [p[0], deref(p[1], '아래의 최소 시간 하한', '최소 시간 하한')]),
        note: D.frame.code.result,
      },

      // ─── §03 충돌 ───
      // '브로드페이즈' 그림 장을 없앴다. 지면은 그림이 채웠지만 글로 실린 사실 셋 중 둘이
      // 교과서였다 — 삽입 위치를 표면적 비용으로(SAH) · 높이차가 벌어지면 회전.
      // data.js 자신의 규칙이 "표준 기법은 쓴 이유와 이 프로젝트에서 정한 것만 적는다" 인데,
      // 이 프로젝트가 정한 것(여유 밖으로 나갈 때만 재삽입)은 "그림이 보인다" 며 빼 뒀었다.
      // 꽉 찼는데 내용이 없는 장의 표본이다. 트리의 실물은 표지 hero 캡션이 이미 보인다
      // (리프 33 · 노드 65). 네 단계로 나눴다는 고지는 아래 gist 가 승계한다.
      step('03 충돌', D.collision.steps[3], { title: '충돌 응답',
        gist: D.collision.gist,
        points: [relabel(D.collision.steps[3].points[0], '제약 셋 분리'),
                 relabel(D.collision.steps[3].points[1], '누적 충격량 승계'),
                 relabel(D.collision.steps[3].points[2], '마찰 한계 = 법선 누적값'),
                 relabel(D.collision.steps[3].points[3], '얕은 침투 무보정'),
                 relabel(D.collision.steps[3].points[4], '깊게 물리면 위치도 민다')],
        // 자기 진단이라 §05(검증 · 한계)와 같은 급이다. 면접에서 가장 값이 나가는 종류다.
        note: D.collision.steps[3].code.result }),

      // ─── §04 렌더 ───
      // 렌더 다섯 중 하나만 싣는다 — gist 가 나머지 넷의 이름을 대 준다.
      //
      // 아레나(steps[3]) 대신 바인딩 캐시(steps[4])를 고른다. 아레나의 코드는 AllocateRenderJob 의
      // **템플릿 시그니처**라 요점 셋 중 하나("타입은 빌드 단에서 거른다")만 보이고 나머지 둘
      // (포인터 이동 · 소멸자 역순)은 코드에 안 나온다 — 구현이 아니라 선언이다.
      // 바인딩 캐시는 CurrentVB 비교로 실제 분기를 보이고, 무엇보다 §05 가 이미 실은
      // 결함(바인딩 캐시 초기화 경로 부재)과 인과가 닿는다. 지금 덱은 그 캐시를 결함으로만
      // 언급하고 정작 무엇인지는 말하지 않았다.
      // points[1]('비우는 경로가 없다')은 §05 가 같은 사실을 이미 싣는다 — 여기서는 뺀다.
      step('04 렌더', D.render.steps[4], { title: '바인딩 캐시', gist: D.render.gist,
        points: [D.render.steps[4].points[0], D.render.steps[4].points[2]],
        note: D.render.steps[4].code.result }),

      // ─── §05·06 — 헤드라인("만든 뒤에는 숫자를 봅니다")과 직결되는 장.
      //     글 목록이 아니라 카드로 간다 — 슬라이드는 읽는 매체가 아니라 스캔하는 매체다.
      //
      // 원래 '검증 범위' 와 '결함과 한계' 두 장이었다. 둘 다 D.limits 한 배열에서 뽑은
      // 같은 주제라 나눌 축이 없었고, 각각 카드 둘셋짜리 반 장이었다. 2x2 한 장에 아홉 쌍을 다 싣는다.
      //
      // '이후 프로젝트 — Cartapli Mobile 에서 확보' 칸은 뺐다. DX11 한계 장에서 열 장 앞
      // 프로젝트의 성과를 다시 말하는 자리였다. 그 사실의 제자리는 CM 절의 §04 검증 장이고,
      // 거기에 verify.tests(400 / 200 / 16 케이스)를 실어 뒀다.
      {
        layout: 'columns',
        section: '05 검증 · 한계',
        title: '검증 범위와 한계',
        gist: '코드로 참·거짓이 갈리는 것만 앞에서 다뤘다. 재지 못한 것과 남은 결함은 이 장에 모았다.',
        colCount: 2,
        cols: [
          { mark: '✗', tone: 'terra', kind: '계측', title: '측정 도구 없음',
            pairs: [D.limits[0], D.limits[1]] },
          { mark: '✗', tone: 'terra', kind: '검사', title: '자동 검증 없음',
            pairs: [D.limits[3], D.limits[7]] },
          { kind: '결함', tone: 'terra', title: '코드에 남은 결함',
            pairs: [relabel(D.limits[2], '누적 시간 처리 결함'),
                    relabel(D.limits[6], '바인딩 캐시 초기화 경로 부재')] },
          { kind: '범위 배제', title: '범위 밖',
            pairs: [relabel(D.limits[4], '볼록 형상 미지원 — 상자 · 구만'),
                    relabel(D.limits[5], '멀티스레드 구조만'),
                    relabel(D.limits[8], '렌더 경로 Forward 하나')] },
        ],
      },
    ],
  };
})();
