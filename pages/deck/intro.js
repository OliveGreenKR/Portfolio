// pages/deck/intro.js
// 문서 표제지 — 프로젝트 표지가 아니라 이 문서 전체의 첫 장이다.
//
// ⚠️ 사실을 만들지 않는다. about/data.js 와 각 프로젝트 meta 를 참조만 한다.
//
// 한 장으로 압축한다. 소개에 세 장을 쓸 만큼 설명할 게 없고,
// 항목마다 해당 사실 한 줄이면 족하다.
//
// 2026-08-12 정리 (사용자 판단):
//   - 대표 수치 넉 칸(137 · −93.8% · 02 · 05)을 뺐다. 표제지의 세로를 두 덩이가 나눠 먹어
//     이력 격자가 눌렸고, 어차피 각 프로젝트 장이 같은 수치를 제 자리에서 다시 낸다.
//   - '지원 직무' 줄을 뺐다. 표지 · 크롬 · 파일명이 이미 직무를 말한다.
//   - '출시' · '외주' 를 **이력** 한 항목으로 합쳤다. 종류로 가르면 항목이 늘 뿐,
//     읽는 쪽은 "무엇을 언제 어느 규모로 했나" 만 본다.
//   - Labs 줄을 뺐다. 이 덱에 Labs 본문이 없으므로 이력에만 이름을 올리면 확인할 길이 없다.
//   - 값이 여럿인 줄은 가운뎃점 대신 **줄바꿈**으로 낸다 (뷰가 배열을 받는다).
//
// 본문 장이 있는 프로젝트(cm · dx11 · cartapli · motelet)는 이력에서 되풀이하지 않는다 —
// 단, Cartapli 는 출시 사실 자체가 이력이라 남긴다.

(function buildIntro() {
  const A = window.ABOUT_DATA;
  const L = window.LANDING_DATA;
  const C = window.CARTAPLI_DATA;
  const W = window.WOBBLE_DATA;
  const E = window.EDU_GAMIFICATION_DATA;
  const M = window.MOTELET_DATA;

  const fact = (k) => (A.facts.find((f) => f[0] === k) || [k, ''])[1];
  // about/data.js 의 값은 가운뎃점으로 이어진 한 줄이다. 줄바꿈으로 가른다.
  const lines = (k) => fact(k).split(' · ');

  // 표기만 기계적으로 맞춘다. data.js 는 페이지 배지용이라 '13 weeks' · '4 인' 인데,
  // 한글 한 줄 안에 섞이면 눈에 걸린다. 값을 바꾸는 게 아니라 단위 표기만 바꾼다.
  const ko = (s) => String(s).replace(/\s*weeks?$/i, '주').replace(/(\d)\s+인/, '$1인');
  // platform 은 '(글로벌, 2026.02)' 처럼 날짜를 물고 있는데, 뒤에 기간을 또 적으므로 뗀다.
  const where = (m) => m.platform.replace(/\s*\(([^,)]+)[^)]*\)/, ' $1');
  const shipped = (m) => m.title
    + ' (' + where(m) + ' · ' + m.period + ' · ' + ko(m.weeks) + ' · ' + ko(m.team) + ')';

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.intro = {
    proj: 'JCH Portfolio',
    slides: [
      {
        layout: 'title',
        section: 'Portfolio · 2026',
        photo: '../assets/profile-glasses.png',
        headline: L.identity.headline,
        headlineMark: L.identity.headlineMarkSecondLine,
        stance: L.identity.stance,
        facts: [
          ['이름', fact('이름')],
          ['학력', lines('학력')],
          // 최신이 맨 위다 (시작 시점 기준 내림차순):
          //   Motelet 2026.05~ · 외주 2026.05–07 · Wobble 2026.03–04 · Cartapli 2025.11–2026.02
          ['이력', [
            // 진행 중이라 shipped() 를 못 쓴다 — 출시 플랫폼·주차·마감이 아직 없다.
            // 스토어 페이지는 공개돼 있으므로 그 사실만 적고 링크는 아래 links 가 진다.
            M.meta.title + ' (Steam 스토어 공개 · ' + M.meta.period + ' · ' + M.meta.team + ')',
            // 제목에 이미 '(외주)' 가 있고 period 도 괄호를 물고 있다 — 그대로 이으면 괄호가 겹친다.
            E.meta.title.replace(/\s*\(외주\)\s*$/, '')
              + ' (외주 · ' + E.meta.period.replace(/\s*\((.+)\)$/, ' · $1') + ')',
            shipped(W.meta),
            shipped(C.meta),
          ]],
          // 엔진 · 언어는 한 줄로 둔다. 항목이 짧아 줄바꿈해도 읽기가 나아지지 않고,
          // 넷을 쪼개면 표제지 세로가 그만큼 늘어 본문(이력)이 밀려난다 — 실측 104% 초과.
          ['엔진', fact('엔진')],
          ['언어', fact('언어')],
        ],
        // 이력 줄은 텍스트라 링크를 못 건다(renderInline 이 링크를 안 만든다).
        // 출시가 둘이므로 about 의 Steam 한 줄을 게임별 두 줄로 바꿔 단다.
        links: A.links.items
          .filter((l) => l.label !== 'Steam')
          .map((l) => Object.assign({}, l, { tone: l.label === 'GitHub' ? 'blue' : undefined }))
          // 스토어는 셋이다. 이력 줄과 같은 순서(최신 먼저)로 낸다.
          // Motelet 은 출시 전이지만 스토어 페이지가 공개돼 있어 확인 가능한 링크다.
          .concat([
            { label: 'Steam', v: M.meta.title + ' (개발 중)', href: M.meta.steam, tone: 'sage' },
            { label: 'Steam', v: W.meta.title, href: W.meta.steam, tone: 'sage' },
            { label: 'Steam', v: C.meta.title, href: C.meta.steam, tone: 'sage' },
          ]),
      },
    ],
  };
})();
