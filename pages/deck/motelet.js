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
//   02~04  모델 — 용어 넷 · 실제 식 · 이 모델이 안 읽는 것
//   05~07  도구 — 에디터 통합 화면 · 시뮬레이터가 읽은 것 · 자동 탐색기(만들고 안 씀)
//   08     배틀 런타임 다섯
//
// 뺀 것:
//   model.handoff · tool.handoff — 롱스크롤에서 다음 절로 넘기는 이음말. 덱에는 이을 대상이 없다
//   runtime.steps[*].code · viz — 다섯을 한 장에 목록으로 낸다. 코드까지 실으면 다섯 장이 되고,
//     런타임은 이 프로젝트의 주장(계산으로 판단했다)의 곁가지다. 상세는 사이트에 있다
//   limits 4 — 한계는 모델 사정거리 장(04)이 이미 "안 읽는 것"으로 정면에서 말한다

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  // 라벨만 명사구로 덮는다 (DX11 · CM 매니페스트와 같은 장치). 본문은 원문 그대로 —
  // 사이트는 노트 톤이라 서술형 라벨이 맞지만, 슬라이드 라벨이 종결형·의문형이면 스캔이 끊긴다.
  const relabel = (pair, label) => [label, pair[1]];
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
        title: M.meta.title,
        hook: M.hook,
        pills: M.meta.pills,
        hero: M.hero,
      },

      // ─── 02 모델 — 무엇을 계산으로 바꿨나 ───
      // "성장이 잘 느껴지나" 는 못 재니까 잴 수 있는 것으로 바꾼다. 그 환산이 이 장이다.
      {
        layout: 'list',
        section: '02 모델',
        no: 'a',
        title: '한 판의 골드로 환원',
        gist: M.model.gist,
        pairs: M.model.terms,
        pairCols: 2,
        // body 첫 문장은 제목 · gist 와 같은 말이다("한 판의 골드로 환원"이 한 장에 세 번).
        // 뒷 문장만 남긴다 — 이게 이 장에서 유일하게 새로운 사실이다.
        note: M.model.body.split('. ').slice(1).join('. '),
      },

      // ─── 03 모델 — 실제 식 ───
      // 코드 장이므로 lead 를 안 준다 (CodeBlock 이 formula.title · intro 를 이미 그린다).
      // 요점 자리에는 "값을 어디서 가져오나" 와 "그래서 무엇이 드러났나" 를 둔다.
      {
        layout: 'step',
        section: '02 모델',
        no: 'b',
        title: '레벨 단위로 쪼개 누적',
        step: { code: M.model.formula, points: [] },
        points: [
          // 원문 라벨은 종결형 서술문이고, 본문의 "위의 계산" 은 롱스크롤에서 식이 위에
          // 있던 흔적이다 — 이 레이아웃에서 식은 오른쪽이라 가리킬 대상이 없다.
          ['값의 출처 — 게임 데이터 그대로',
            deref(M.model.source.body, '위의 계산은', '이 식은')],
          ['공격력의 자리', M.model.formula.result],
        ],
      },

      // ─── 04 모델 — 사정거리 ───
      // 도구를 자랑하는 장 사이에 **안 읽는 것**을 먼저 박는다. 모델을 파는 사람과
      // 모델의 한계를 아는 사람은 다르게 읽힌다.
      {
        layout: 'columns',
        section: '02 모델',
        no: 'c',
        title: M.model.scope.title,
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

      // ─── 05 도구 — 에디터 통합 화면 ───
      // 도구는 글로 설명하면 안 보인다. 화면 한 장이 "팀원 에디터 위에 얹었다" 를 바로 보인다.
      {
        layout: 'diagram',
        section: '03 도구',
        no: 'a',
        title: '스킬트리 에디터에 얹은 시뮬',
        lead: M.tool.gist,
        step: { img: M.tool.shots[0] },
        points: [
          ['반복하는 루프', M.tool.loopBody],
          // 원문 라벨은 의문형이고, 본문 끝 문장("밸런싱은 이 결과를 참고해 손으로 했다")은
          // 이 장의 lead 와 같은 말이다.
          relabel([null, M.tool.purpose.body.split('. ')[0] + '.'], '만든 목적'),
        ],
      },

      // ─── 06 도구 — 무엇을 읽었나 ───
      {
        layout: 'list',
        section: '03 도구',
        no: 'b',
        title: M.tool.readTitle + ' — 곡선과 노드 기여',
        // gist 를 안 쓴다. 후보였던 shots[1].caption 은 **그림 설명**인데 이 장은 목록형이라
        // 그림이 없다 — "성장률 곡선" 이라고 써 놓고 곡선이 없는 유령 참조가 된다.
        // 곡선 그림은 앞 장(에디터 화면)이 이미 보였다.
        pairs: M.tool.read,
        pairCols: 2,
      },

      // ─── 07 도구 — 자동 탐색기 ───
      // "만들었는데 결정에는 안 썼다" 를 그대로 낸다. 만든 것만 적으면 과장이 된다.
      {
        layout: 'list',
        section: '03 도구',
        no: 'c',
        title: '자동 수치 탐색기 — ' + M.search.builtTitle,
        // 원문 gist("만든 것과 실제로 쓴 것을 갈라 적는다")는 문서가 스스로를 설명하는
        // 롱스크롤 어투다. 슬라이드에서는 이 장이 무엇인지를 바로 말한다.
        gist: '만들었지만 결정에는 쓰지 않은 도구다.',
        pairs: M.search.built,
        pairCols: 2,
        // 원문 라벨은 의문형이고, 이어 붙이면 한 줄에 대시가 둘이 된다.
        note: '결정에 쓰지 않은 이유 — ' + M.search.notUsed.body,
      },

      // ─── 08 런타임 ───
      // 다섯을 한 장에. 코드까지 실으면 다섯 장이 되고 이 프로젝트의 주장이 흐려진다.
      {
        layout: 'list',
        section: '04 런타임',
        title: '엔진이 안 정해 주는 것 다섯',
        // gist 를 안 쓴다 — runtime.gist 가 제목과 같은 문장이다.
        pairs: M.runtime.steps.map((s) => [s.title, s.did]),
        pairCols: 2,
        // 원문은 "…기반은 **팀원 작업**이다" 로 끝난다. 앞에 라벨을 붙이면 한 줄에 두 번이다.
        note: '팀원 — ' + M.context.roles.others.replace('은 **팀원 작업**이다 ', ' '),
      },
    ],
  };
})();
