// pages/wobble-wobble/cover.jsx
// Wobble Wobble 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/wobble-wobble/data.js 를 참조만 한다.
//
// 이 표지의 주장은 **두 번째 출시를 5주에 끝냈다** 이다. 근거가 수치라서 Cartapli 표지와
// 같은 배치를 쓴다 — 위에 무슨 게임인지와 역할, 아래에 큰 숫자 넷.
// 다만 Cartapli 의 숫자가 시장 반응이라면 이쪽은 **운영 처리량**이다. 5주 · 테스트 84 ·
// 14언어 · 컨택 200 은 "혼자서 이만큼을 돌렸다" 를 말한다.

(function buildWobbleCover() {
  const W = window.WOBBLE_DATA;
  const fact = (k) => (W.facts.find((f) => f[0] === k) || [])[1];

  // 배지는 프로젝트 사실만. 수치는 큰 칸이 이미 말한다.
  // 기간 fact 의 괄호("(5주: 출시 준비 4주 + 출시 1주)")는 뗀다 — 큰 숫자 첫 칸이
  // 같은 구성을 이미 말한다.
  const pills = [
    { kind: 'accent', text: fact('기간').split(' (')[0] },
    { text: W.meta.team },
    { kind: 'accent', text: W.meta.platform },
  ];

  window.COVERS = window.COVERS || {};
  window.COVERS['wobble-wobble'] = {
    toc: {
      title: W.meta.title,
      period: W.meta.period,
      tags: ['5주 압축 출시', '자동화 인프라 자율 도입', W.meta.stack.slice(0, 4).join(' · ')],
    },

    render: ({ density }) => (
      <window.CoverStack>
        <window.CoverSplit
          main={
            <React.Fragment>
              <window.Eyebrow>{fact('장르') + ' · ' + fact('가격')}</window.Eyebrow>
              <window.CoverTitle>{W.meta.title}</window.CoverTitle>
              <window.Lede>{W.meta.oneLine}</window.Lede>
              {/* 5인 팀이라 역할 경계를 표지에서 밝힌다. 숫자 넷만 두면
                  "이걸 혼자 했나" 가 남는다. */}
              <window.RoleLine label={W.meta.role}>
                {' — ' + W.roles.mine.split(' · ')[0]}
              </window.RoleLine>
              <window.Pills items={pills} />
              <window.LinkRow links={[
                { label: 'Steam', v: '글로벌', href: W.meta.steam, tone: 'sage' },
                { label: 'STOVE', v: '한국', href: W.meta.stove, tone: 'blue' },
              ]} />
            </React.Fragment>
          }
          art={<window.Art img={W.heroImage} alt={W.meta.title} />}
        />

        {/* 출시와 운영. data.js 의 heroMetrics 를 그대로 쓴다. */}
        <window.BigStats items={W.heroMetrics} />
      </window.CoverStack>
    ),
  };
})();
