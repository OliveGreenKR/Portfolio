// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//
// 2026-08-12: 한 장짜리 요약에서 **메인급**으로 올렸다. 이 덱의 다른 세 프로젝트는
// "구조를 나눴다 / 재서 고쳤다" 축인데, Motelet 만 **게임을 식으로 옮겨 계산으로 판단한**
// 축이다. 한 장으로 누르면 그 축이 통째로 사라진다.
//
// 서사 순서: 모델(무엇을 계산으로 바꿨나) → 도구(그 식으로 무엇을 봤나) → 런타임(직접 짠 것).
//   02   모델 — 최종식 한 벌 + 항별 분해 (원래 '용어 넷' 과 '실제 식' 두 장이었다)
//   03   모델의 사정거리 — 읽는 것 / 안 읽는 것 / 재지 않은 것
//   04   도구 — 에디터 통합 화면 + 시뮬이 읽어 낸 다섯
//   05   자동 수치 탐색기 — 만들고 결정에는 안 씀
//   06   배틀 런타임 다섯
//
// ⚠️ 밀도는 지면을 채우는 게 아니라 **내용**이다 (2026-08-12 사용자 지적).
//    항목 넷을 큰 글씨로 늘려 한 장을 채우면 채움률만 오르고 읽을 것은 그대로다.
//    같은 주제를 두 장에 나눠 담고 있으면 합쳐서 한 장에 사실을 두 배로 싣는다.
//
// 뺀 것:
//   model.handoff · tool.handoff — 롱스크롤에서 다음 절로 넘기는 이음말. 덱에는 이을 대상이 없다
//   model.body — 첫 문장은 제목·gist 와 같은 말이고, 뒷 문장은 gist 에 붙였다
//   tool.shots[1] (곡선 그림) — 에디터 화면 한 장이 도구를 이미 보인다. 두 장 쓸 일이 아니다
//   runtime.steps[*].code · viz — 다섯을 한 장에 목록으로 낸다. 코드까지 실으면 다섯 장이 되고,
//     런타임은 이 프로젝트의 주장(계산으로 판단했다)의 곁가지다. 상세는 사이트에 있다
//   limits[2..3] — 모델 사정거리 장의 '재지 않은 것' 칸이 limits[0..1] 로 이미 정면에서 말한다

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  // 덱에 없는 것을 가리키는 지시어를 지운다. 페이지에서는 맞는 말이다.
  const deref = (text, from, to) => text.replace(from, to);

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 표지 ───
      {
        layout: 'cover',
        section: 'Main · In progress',
        // eyebrow 는 "MAIN · 02 ─ …" 로 시작한다 — 사이트 색인 번호다. 덱에서 Motelet 은
        // 04 번이라 번호가 충돌하고, 다른 표지들은 이 자리에 프로젝트명이 온다.
        subtitle: M.meta.subtitle,
        // data.js 제목("스킬 트리 밸런싱을 계산으로")은 조사로 끝나 헤딩 자리에서 문장이
        // 잘린 것처럼 읽힌다. 이 프로젝트가 한 일을 명사구로 그대로 옮긴다.
        title: '수학적 모델링을 통한 밸런싱',
        hook: M.hook,
        pills: M.meta.pills,
        // 원문 캡션("배틀 화면. 광역 능력 두 개가 적이 몰린 지점에서 열린다.")은 사이트에서
        // 능력 발동 위치 절을 받는 말이다. 표지에는 그 절이 없어 가리킬 대상이 없다.
        hero: { img: M.hero.img, caption: '인게임 화면' },
      },

      // ─── 02 모델 — 최종식 한 벌과 항별 분해 ───
      // 원래 '용어 넷'(list) 과 '실제 식'(code) 두 장이었다. 둘 다 같은 식을 말하는데
      // 한쪽은 항의 뜻만, 한쪽은 식만 실어 장마다 읽을 것이 절반이었다.
      // 식을 오른쪽에 두고 왼쪽에 항을 풀면 한 장에서 식과 뜻이 서로를 받는다.
      {
        layout: 'step',
        section: '02 모델',
        no: 'a',
        title: '한 판의 골드 — 최종식과 항별 분해',
        gist: M.model.gist + ' ' + M.model.body.split('. ').slice(1).join('. '),
        // 코드 블록이 formula.title · intro 를 제 안에서 그리므로 lead 에 되풀이하지 않는다.
        // 대신 lead 자리에는 코드가 안 말하는 것 — 값을 어디서 읽어 오는지 — 를 둔다.
        // 원문의 "위의 계산" 은 롱스크롤에서 식이 위에 있던 흔적이다 (여기서는 오른쪽).
        step: {
          problem: M.model.source.title + ' — '
            + deref(M.model.source.body, '위의 계산은', '이 식은'),
          code: M.model.formula,
          points: [],
        },
        points: M.model.terms.concat([['공격력의 자리', M.model.formula.result]]),
      },

      // ─── 03 모델 — 사정거리 ───
      // 도구를 자랑하는 장 사이에 **안 읽는 것**을 먼저 박는다. 모델을 파는 사람과
      // 모델의 한계를 아는 사람은 다르게 읽힌다.
      {
        layout: 'columns',
        section: '02 모델',
        no: 'b',
        // 원제('이 모델의 사정거리')는 비유다 — 무엇의 범위를 말하는지가 제목만 보고 안 잡힌다.
        // 사이트 제목은 그대로 두고 덱에서만 덮는다.
        title: '모델이 다루는 범위와 한계',
        gist: M.model.scope.lead,
        cols: [
          { kind: 'READS', mark: '✓', tone: 'sage', title: '이 모델이 읽는 것', items: M.model.scope.reads },
          { kind: 'SKIPS', mark: '✗', tone: 'terra', title: '읽지 않는 것', items: M.model.scope.skips },
          // 셋째 칸. scope 는 모델의 **입력** 범위만 말하는데, 안 잰 것은 그것 말고 또 있다.
          // limits 에 이미 적혀 있는 것을 여기로 끌어온다 — 두 장 쓸 일이 아니다.
          { kind: 'UNVERIFIED', mark: '✗', tone: 'terra', title: '재지 않은 것',
            pairs: [M.limits[0], M.limits[1]] },
        ],
        colCount: 3,
        // why 는 두 문장 170자다. 앞 문장("환산 계수는 손으로 정했다")은 새 셋째 칸이
        // 이미 말하므로, 그래서 어떻게 쓰느냐는 결론 문장만 남긴다.
        note: M.model.scope.why.split('. ').slice(1).join('. '),
      },

      // ─── 04 도구 — 에디터 통합 화면 + 읽어 낸 것 다섯 ───
      // 원래 화면 한 장 + 목록 한 장이었다. 목록 장은 항목 다섯을 큰 글씨로 벌려
      // 지면만 채웠고(실측 79%) 화면 장은 요점이 둘뿐이었다. 합치면 한 장에서
      // "이렇게 생겼고, 이걸 읽는다" 가 같이 선다.
      {
        layout: 'diagram',
        section: '03 도구',
        // '얹은 시뮬 — 읽은 것' 은 줄여 쓴 말이라 처음 보면 안 잡힌다. 풀어 쓴다.
        title: '스킬트리 에디터에 붙인 시뮬레이터 — 화면에서 읽는 값',
        lead: M.tool.loopBody,
        step: { img: M.tool.shots[0] },
        points: M.tool.read,
        // 원문 라벨은 의문형이고, 끝 문장("밸런싱은 이 결과를 참고해 손으로 했다")은
        // 도구가 답을 정하지 않았다는 이 장의 결론이라 노트로 받는다.
        note: M.tool.purpose.body,
      },

      // ─── 04 그 외 만든 것 — 자동 탐색기와 배틀 런타임 ───
      // 원래 두 장이었다. 둘 다 pairs 다섯짜리 목록 하나뿐인 반 장이었고, 성격도 같다 —
      // 이 절의 주장(계산으로 판단했다)에 직접 쓰이지는 않은 구현물이다.
      // 탐색기는 만들고 결정에 안 썼고, 런타임은 엔진이 안 정해 주는 것을 직접 정한 것이다.
      // 두 칸으로 세우면 한 장에 열 쌍이 들어간다.
      {
        layout: 'columns',
        section: '04 그 외',
        title: '그 외 만든 것 — 자동 탐색기 · 배틀 런타임',
        colCount: 2,
        cols: [
          { kind: 'SEARCH', mark: '✗', tone: 'terra',
            title: '자동 수치 탐색기 — 만들고 결정에는 안 씀',
            // 원문 라벨은 의문형이라 sub 로 내리며 서술문으로 받는다.
            sub: M.search.notUsed.body,
            // 원문 마지막 항목은 "…아래 이유와 겹친다" 로 끝난다 — 페이지에서는 notUsed 절이
            // 아래에 있지만 이 카드에서는 sub 로 **위에** 있다. 가리킬 아래가 없다.
            pairs: M.search.built.map((p) => [p[0], deref(p[1], '이고, 아래 이유와 겹친다.', '이다.')]) },
          { kind: 'RUNTIME', mark: '✓', tone: 'sage',
            title: '배틀 런타임 — 엔진이 안 정해 주는 것 다섯',
            sub: M.runtime.gist,
            pairs: M.runtime.steps.map((s) => [s.title, s.did]) },
        ],
        // 원문은 "…기반은 **팀원 작업**이다" 로 끝난다. 앞에 라벨을 붙이면 한 줄에 두 번이다.
        note: '팀원 — ' + M.context.roles.others.replace('은 **팀원 작업**이다 ', ' '),
      },
    ],
  };
})();
