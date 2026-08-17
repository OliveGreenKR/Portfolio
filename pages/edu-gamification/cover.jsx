// pages/edu-gamification/cover.jsx
// 교육용 게이미피케이션 (외주) 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/edu-gamification/data.js 를 참조만 한다.
// ⚠️ 외주 · 정보보호 서약 대상. 고객사 이름 · 화면 · 데이터는 표지에 올리지 않는다.
//
// 이 표지가 다른 다섯과 다른 점: **보여줄 화면이 없다.** 스크린샷도 스토어 링크도
// 없어서, 이 일에서 남은 공개 가능한 산출물은 구조 그 자체다. 그래서 그림 자리를
// 구조도가 갖고 글 칸을 좁힌다 (cover.css).

(function buildEduCover() {
  const E = window.EDU_GAMIFICATION_DATA;
  const fact = (k) => (E.facts.find((f) => f[0] === k) || [])[1];

  // 사이트 주소는 data.js 에 없다 — 자기 주소를 자기가 갖지 않는다.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/';

  // 문장 단위로 자른다. oneLine 은 세 문장인데 표지는 **첫 문장 하나만** 쓴다 —
  // 글 칸이 560px 이라 34px 문장 하나가 네 줄을 먹는다. 두 문장을 실었더니 글 칸이
  // 885px 이 되어 큰 숫자 칸과 겹쳤다(실측 · 가용 702px). 나머지 둘은 본문이 받는다.
  const S = (t, n) => String(t).split(/(?<=\.\**)\s+/).slice(0, n).join(' ');

  // 배지는 프로젝트 사실만. 수치는 큰 칸이 이미 말한다.
  // 배지 세 개가 한 줄에 들어가야 한다 — 두 줄이 되면 글 칸이 큰 숫자 칸을 밀어낸다(실측).
  // 기간의 '(납품 완료)' 는 뗀다: 바로 위 eyebrow 가 같은 말을 한다.
  // 스택도 넷 → 셋. 나머지는 상세 페이지 facts 가 전부 갖는다.
  const pills = [
    { kind: 'accent', text: E.meta.period.replace(/\s*\(.*\)$/, '') },
    { text: E.meta.team },
    { text: E.meta.stack.slice(2, 5).join(' · ') },
  ];

  window.COVERS = window.COVERS || {};
  window.COVERS['edu-gamification'] = {
    toc: {
      title: '교육용 게이미피케이션',
      period: '2026.05 – 2026.07',
      tags: ['단일 인가 게이트', '원터치 배포 콘솔', E.meta.stack.slice(2, 5).join(' · ')],
    },

    render: ({ density }) => (
      <div className="edu-cover cv-stack">
        <window.CoverSplit
          main={
            <React.Fragment>
              <window.Eyebrow>{fact('형태') + ' · 납품 완료'}</window.Eyebrow>
              {/* 자리(섹션 라벨)가 이미 외주라고 말한다 — 제목에서 뗀다. */}
              <window.CoverTitle>교육용 게이미피케이션</window.CoverTitle>
              <window.Lede>{S(E.meta.oneLine, 1).replace(/^미확정 · /, '')}</window.Lede>
              <window.RoleLine label={E.meta.role}>
                {' — ' + fact('기여')}
              </window.RoleLine>
              <window.Pills items={pills} />
              <window.LinkRow links={[
                { label: '상세 페이지', v: '요구 → 설계 → 구조', tone: 'sage',
                  href: SITE + 'pages/edu-gamification.html' },
              ]} />
            </React.Fragment>
          }
          art={<window.EduArchViz />}
        />

        {/* 성과 요약. 상세 페이지의 네 칸을 그대로 쓴다 — 시장 지표가 아니라
            납품 규모다. */}
        <window.BigStats items={E.heroMetrics} />
      </div>
    ),
  };
})();
