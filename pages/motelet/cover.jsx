// pages/motelet/cover.jsx
// Motelet 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//
// 탑다운 요약이다 — 큰 글자는 **이름**을 말하고, 그 아래에서 절 전체가 한 번에 요약된다.
//   무슨 게임인가(hook) · 어디까지가 내 것인가(role) · 무엇을 만들었나(specs)
// 뒤의 세 장은 그중 셋을 펼친 것이다.

(function buildMoteletCover() {
  const M = window.MOTELET_DATA;

  // 사이트 주소는 data.js 에 없다 — 자기 주소를 자기가 갖지 않는다.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/';

  // 앞 n 문장만 꺼낸다. 문단 전체를 표지에 실으면 뒤 장이 할 말이 없어진다.
  // 마침표 뒤가 별표(**로 닫는 문장)여도 경계로 본다 — '. ' 만 보면
  // '상대 순위다.**' 에서 조용히 실패해 두 문장이 통째로 남는다(실측).
  const S = (t, n) => String(t).split(/(?<=\.\**)\s+/).slice(0, n).join(' ');

  // 만든 것 셋(성과) 먼저, 기간이 맨 앞, 기술 스택이 마지막 — 세 프로젝트 공통 순서다.
  const pills = [{ text: M.meta.period }]
    .concat(M.built.map((b) => ({ text: b.title, tone: 'sage' })))
    .concat([{ text: M.meta.stack.join(' · ') }]);

  window.COVERS = window.COVERS || {};
  window.COVERS['motelet'] = {
    toc: { title: M.meta.title, period: M.meta.period, tags: pills.map((p) => p.text) },

    render: ({ density }) => (
      <window.CoverSplit
        main={
          <React.Fragment>
            <window.Eyebrow>{M.meta.subtitle}</window.Eyebrow>
            <window.CoverTitle>{M.meta.title}</window.CoverTitle>
            {/* 게임 한 줄 + 이 프로젝트의 주장. what 의 둘째 문장(한 판 규칙)은 2장이 받는다. */}
            <window.Lede>{S(M.what, 1) + ' ' + M.hook}</window.Lede>
            {/* 상세 페이지는 세로가 안 막힌 자리다 — 한 판 규칙(what 둘째 문장)까지 낸다.
                덱·카드에서는 뒤 장이 그 말을 받으므로 뺀다. */}
            {density === 'hero' && M.what.split(/(?<=\.\**)\s+/)[1] && (
              <window.Lede>{M.what.split(/(?<=\.\**)\s+/).slice(1).join(' ')}</window.Lede>
            )}
            {/* 심사자가 가장 먼저 찾는 줄 — 스펙 목록 안에 두면 Unity 버전과 같은 무게가 된다.
                ⚠️ 라벨과 본문이 붙어 나오므로 본문 앞에 구분자를 넣는다. */}
            <window.RoleLine label="PM 겸 배틀씬 프로그래머">
              {' — ' + S(M.meta.boundary, 1)}
            </window.RoleLine>
            <window.Pills items={pills} />
            {/* 만든 것 셋. 2·3·4 장이 각각 이 줄 하나씩을 펼친다.
                카드에서는 뺀다 — 배지가 같은 셋을 이름으로 이미 말한다. */}
            {density !== 'card' && (
              <window.Specs items={M.built.map((b) => '**' + b.title + '** — ' + b.sub)} />
            )}
            <window.LinkRow links={[
              { label: '상세 페이지', v: '전체 서술 · 코드 · 다이어그램',
                href: SITE + 'pages/motelet.html', tone: 'sage' },
              { label: 'Steam', v: M.meta.title + ' (개발 중)', href: M.meta.steam, tone: 'blue' },
            ]} />
          </React.Fragment>
        }
        art={<window.Art img={M.hero.img} caption={M.hero.caption} />}
      />
    ),
  };
})();
