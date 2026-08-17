// pages/cartapli/cover.jsx
// Cartapli: Fold Quest 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/cartapli/data.js 를 참조만 한다.
//
// 이 표지의 주장은 **시장에서 통했다** 이다 (2026-08 사용자 판단).
// 기술적 판단은 이 프로젝트에도 있지만 가장 오래된 작업이라 지금의 실력을 대변하지
// 못한다 — 구조 이야기는 상세 페이지가 받고, 표지는 출시 결과만 말한다.
// 그래서 큰 숫자 넷이 화면의 아래 절반을 차지하고, 위쪽은 무슨 게임인지와
// 어디까지가 본인 몫인지 두 줄로 끝낸다.

(function buildCartapliCover() {
  const C = window.CARTAPLI_DATA;
  const fact = (k) => (C.facts.find((f) => f[0] === k) || [])[1];

  // 표지 배지는 프로젝트 사실이다 — 수치는 이미 큰 숫자 칸이 말한다.
  const pills = [
    { kind: 'accent', text: fact('기간') },
    { text: fact('팀 구성') },
    { kind: 'accent', text: C.meta.platform },
  ];

  window.COVERS = window.COVERS || {};
  window.COVERS['cartapli'] = {
    // 목차 태그는 배지와 다르다. 목차에서 이 프로젝트를 가리키는 것은 기간·팀이 아니라
    // 출시 결과다 — 계약이 둘을 갈라 둔 덕에 표지 배치와 목차가 서로 안 끌려간다.
    toc: {
      title: C.meta.title,
      period: C.meta.period,
      tags: ['Steam 매우 긍정 98%', '누적 순 사용자 26,269', C.meta.stack.slice(0, 4).join(' · ')],
    },

    render: ({ density }) => (
      <window.CoverStack>
        <window.CoverSplit
          main={
            <React.Fragment>
              <window.Eyebrow>{C.meta.title}</window.Eyebrow>
              <window.CoverTitle>{C.meta.oneLine}</window.CoverTitle>
              {/* 4인 팀이라 역할 경계를 표지에서 밝힌다. 숫자 넷만 두면
                  "이걸 혼자 했나" 가 남는다. */}
              <window.RoleLine label={C.meta.role}>
                {' — ' + C.roles.mine.split(' · ')[0]}
              </window.RoleLine>
              <window.Pills items={pills} />
              <window.LinkRow links={[
                { label: 'Steam', v: C.meta.platform.replace(/^Steam\s*\(?/, '').replace(/\)$/, ''),
                  href: C.meta.steam, tone: 'sage' },
              ]} />
            </React.Fragment>
          }
          art={<window.Art img={C.heroImage} alt={C.meta.title} />}
        />

        {/* 출시 결과. data.js 의 heroMetrics 를 그대로 쓴다 — 고르거나 다시 쓰지 않는다.
            기준일(sub)을 값마다 붙인다: Steam 평가만 2026-02 누적이고 나머지 셋은
            2026-05 둘째주라, 한 줄로 묶으면 어느 날짜가 어느 수치의 것인지 못 가른다. */}
        <window.BigStats items={C.heroMetrics} />
      </window.CoverStack>
    ),
  };
})();
