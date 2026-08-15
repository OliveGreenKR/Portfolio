// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//
// 2026-08-15 전면 재조립. 페이지가 갈아엎히면서 이 파일이 참조하던 키
// (model · tool · runtime · limits · context)가 통째로 사라졌다 — 덱이 깨져 있었다.
//
// ■ 왜 다시 잘랐나
//   구판 덱의 축은 "게임을 식으로 옮겨 계산으로 판단했다" 였다. 그건 페이지의 옛 순서
//   (모델 → 시뮬 → 탐색 → 런타임)를 그대로 물려받은 것이고, 그 순서는 페이지 스스로
//   "절끼리 인과가 없다" 고 적어 놓은 배치였다.
//   새 축 = CORE: **무엇이 정답인지부터 정의하고, 정확해가 필요한 자리와 근사로 충분한
//   자리를 갈라 비용을 그쪽에만 냈다.** 이건 런타임에서 세 번, 도구에서 한 번 반복된다.
//
// ■ 5장의 일 (표지 포함)
//   01 표지     — CORE 한 문장
//   02 정의     — 정답을 두 번 다시 정의했다 (물리 기각 / 상한을 면적으로)
//   03 가름     — 정확해가 필요한 자리 vs 근사로 충분한 자리 (코드는 한 벌 — 아래 ⚠️)
//   04 도구     — 같은 순서를 런타임 밖에서 (체감의 정의 → 미분 없음 → 근사 탐색)
//   05 대가     — 갈라서 낸 값
//
// ■ 밀도는 지면을 채우는 게 아니라 내용이다 (2026-08-12 사용자 지적).
//   항목 넷을 큰 글씨로 벌려 한 장을 채우면 채움률만 오르고 읽을 것은 그대로다.
//
// ■ 뺀 것
//   §01 경계 절 전체 — 표를 덱 한 장에 넣으면 숫자만 남고 판단이 안 보인다.
//     역할 경계는 05 장 note 한 줄로 받는다(빼면 안 되는 제약이라 자리는 유지).
//   geo.problem · cap.recall — hero 로 되짚는 문장이다. 덱에는 되짚을 스크롤이 없다.
//   define.formula / search.fold — 정의식과 목적함수 4항. 03·04 장이 이미 꽉 찼다.
//   bridge 6개 — 다음 절로 넘기는 이음말. 덱에는 이을 대상이 없다.
//   에디터 전체 창 컷 — 확대 컷 하나가 코드-차트 대응을 더 잘 보인다(덱은 폭이 좁다).
//   여유 질의 코드 — columns 가 code 를 안 그려 step 한 장으로 눌렀고, 코드는 한 벌만 들어간다.

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  // 덱에 없는 것을 가리키는 지시어를 지운다. 페이지에서는 맞는 말이다.
  const deref = (text, from, to) => text.replace(from, to);

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 01 표지 ───
      {
        layout: 'cover',
        section: 'Main · In progress',
        subtitle: M.meta.subtitle,
        title: M.meta.title,
        // hook 은 "**그 가름을** 기하 판정에서 한 번…" 으로 시작한다. 페이지에서는 바로 위
        // 제목이 선행사이고 덱 표지도 같은 배치라 그대로 둔다.
        hook: M.hook,
        // ⚠️ 표지 pills 는 덱 로컬이다. 페이지에서는 바로 아래 built 카드 3장과 같은 말이라
        //    뺐는데(05 렌즈2), 표지에는 그 카드가 없어 중복이 아니다.
        //    공유 Cover 렌더러가 pills 를 무조건 map 한다 — 없으면 덱 전체가 깨진다.
        pills: [
          { text: '배틀 런타임', kind: 'accent' },
          { text: '기하 판정' },
          { text: '공간 질의' },
          { text: '밸런싱 모델' },
          { text: '에디터 도구' },
        ],
        // 이 그림은 장식이 아니라 04 장이 답하는 질문이다. 캡션이 그 질문을 그대로 진다.
        hero: { img: M.hero.img, caption: M.hero.caption },
      },

      // ─── 02 정의 — 정답을 두 번 다시 정의했다 ───
      // 구판에는 없던 장이다. CORE 의 전반부("정답을 먼저 정의")를 런타임 사례 둘로 세운다.
      // 물리 기각은 "무엇을 안 쓰기로 했나" 형이고, 스폰 상한은 "정답 자체를 다시 정의" 형이라
      // 둘을 나란히 놓아야 두 번째가 무엇이 다른지 보인다.
      {
        layout: 'columns',
        section: '02 정의',
        title: '정답을 먼저 정의한다 — 런타임에서 두 번',
        gist: M.geo.gist,
        colCount: 2,
        cols: [
          { kind: 'REJECT', mark: '✗', tone: 'terra',
            title: '물리 엔진을 안 쓴다',
            sub: M.geo.decision,
            pairs: M.geo.points },
          { kind: 'REDEFINE', mark: '✓', tone: 'sage',
            title: '상한을 개수가 아니라 면적으로',
            sub: M.cap.decision,
            pairs: M.cap.points },
        ],
        note: M.queries.pattern,
      },

      // ─── 03 가름 — 정확해 / 근사 ───
      // 이 덱에서 CORE 의 양쪽 절반이 한 화면에서 대비되는 유일한 장이다.
      // ⚠️ columns 레이아웃은 code 를 안 그린다(공유 렌더러 SlideDeck.jsx — 수정 금지 대상).
      //    그래서 step 으로 세우고 코드는 한 벌만 싣는다. 고른 것은 밀집 질의 쪽 —
      //    "근사가 아니다" 가 이 장에서 유일하게 증명이 필요한 주장이고,
      //    루프 범위(-1..1)가 그 주장의 증거 전부다. 여유 질의의 "최대를 안 고른다" 는
      //    문장으로 전달된다(코드가 없어도 반박당하지 않는다).
      {
        layout: 'step',
        section: '03 가름',
        title: '정확해가 필요한 자리와 근사로 충분한 자리',
        gist: M.queries.vizCaption,
        step: {
          problem: M.queries.left.tag + ' — ' + M.queries.left.how,
          code: M.queries.left.code,
          points: [],
        },
        points: [
          [M.queries.left.title + ' · 물러설 자리', M.queries.left.fallback],
          [M.queries.right.tag + ' — ' + M.queries.right.title, M.queries.right.how],
          [M.queries.right.title + ' · 물러설 자리', M.queries.right.fallback],
        ],
      },

      // ─── 04 도구 — 같은 순서를 런타임 밖에서 ───
      // 페이지의 §05+§06 을 한 장으로 누른다. 둘을 쪼개면 "정의 → 미분 없음 → 근사 탐색"
      // 이라는 사슬이 장 경계에서 끊긴다 — 이 장의 값어치가 정확히 그 사슬이다.
      // 그림은 확대 컷 하나만 쓴다. 전체 창은 덱 폭에서 아무것도 안 읽힌다.
      {
        layout: 'diagram',
        section: '04 도구',
        title: '같은 순서를 도구에서 한 번 더',
        lead: M.define.gist + ' ' + M.search.gist,
        step: { img: { src: M.search.shot.zoom, caption: M.search.shot.zoomCaption } },
        points: [
          ['DPS 를 기준으로 안 삼았다',
            deref(M.define.whyNotDps.split('. ').slice(1).join('. '),
                  '그래서 모델이 두 항 중 **작은 쪽**을 취하고,',
                  '모델이 두 항 중 **작은 쪽**을 취하고,')],
          ['곡선은 구매 정책의 함수다', M.define.policy.body.split('. ')[0] + '.'],
        ].concat(M.search.points),
        note: M.search.shot.note,
      },

      // ─── 05 대가 ───
      // 구판은 한계를 '모델 사정거리' 장에 섞어 넣었다. 이번엔 독립 장이다 —
      // 이 페이지·덱에 성능 수치가 하나도 없다는 것을 듣는 쪽이 눈치채기 전에 먼저 말한다.
      {
        layout: 'columns',
        section: '05 대가',
        title: '갈라서 낸 대가',
        gist: M.cost.gist,
        colCount: 3,
        cols: M.cost.groups.map((g, i) => ({
          kind: ['STRUCT', 'MODEL', 'UNMEASURED'][i],
          mark: '✗',
          tone: 'terra',
          title: g.head,
          pairs: g.items,
        })),
        // 역할 경계는 덱에서 뺄 수 없는 제약이다. 표를 실을 자리가 없으므로 한 줄로 받는다.
        note: '역할 경계 — ' + M.boundary.gist.replace(/\*\*/g, '')
              + ' 담당 경계는 디렉터리별 커밋 표로 사이트에 있다.',
      },
    ],
  };
})();
