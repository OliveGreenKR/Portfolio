// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//
// **한 장짜리 프로젝트**다. 덱의 앞 세 프로젝트(CM · DX11 · Cartapli)가 31장을 쓰는데
// 같은 밀도로 나머지를 넣으면 문서가 100장을 넘는다. 엔진 직군 기준으로 이 프로젝트의
// 몫은 "런타임을 직접 짰고, 밸런싱을 계산으로 했다" 한 줄이고, 그건 한 장에 들어간다.
// 상세는 공개 사이트에 있고 outro 장이 링크를 준다.
//
// 뺀 것: model 의 식 · tool 의 읽는 법 · search(만든 것과 쓴 것) · runtime 다섯 · limits
//   -> built 셋이 그 넷의 머리다. 머리만 싣고 몸통은 사이트에 둔다.
//
// cover 가 아니라 columns 인 이유: cover 는 표지라 뒤에 본문이 따라올 것을 전제한다.
// 뒤가 없는 한 장짜리에 표지를 쓰면 "내용이 빠진 장"으로 읽힌다.

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;
  const fact = (k) => (M.context.facts.find((f) => f[0] === k) || [])[1];

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      {
        layout: 'columns',
        section: 'Main · In progress',
        // data.js 제목("스킬 트리 밸런싱을 계산으로")은 조사로 끝나 헤딩 자리에서 문장이
        // 잘린 것처럼 읽힌다. 명사구로 덮되 이 장이 실제로 다루는 두 축을 다 넣는다.
        title: M.meta.subtitle + ' — 밸런싱 계산과 배틀 런타임',
        // hook 은 두 문장이다. 둘째 문장이 아래 TOOL · RUNTIME 카드와 글자까지 겹치므로
        // 문제를 세우는 첫 문장만 쓴다.
        gist: M.hook.split('. ')[0] + '.',
        // 만든 것 셋 + 경계 하나. 2x2 로 접힌다 (cols 4 > colCount 2).
        // 경계 칸을 빼면 팀원이 만든 기반까지 본인 것으로 읽힌다 — Cartapli 장과 같은 이유다.
        colCount: 2,
        cols: M.built
          .map((b, i) => ({ kind: b.kind, tone: ['wheat', 'blue', 'sage'][i], title: b.title, sub: b.sub }))
          // 제목이 '팀원 작업' 이면 배지(TEAM) · 제목 · 본문에 같은 말이 세 번이다.
          // Cartapli 의 '팀원 — 종이접기 PoC 입안자' 와 같은 꼴로, 무엇이 팀원 몫인지를 제목에 둔다.
          .concat([{ kind: 'TEAM', title: '팀원 — 스킬 데이터 · 그래프 에디터 기반',
                     sub: M.context.roles.others }]),
        note: [fact('기간'), fact('팀'), fact('환경')].filter(Boolean).join(' · '),
      },
    ],
  };
})();
