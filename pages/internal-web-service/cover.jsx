// pages/internal-web-service/cover.jsx
// 사내 학습 웹 서비스 (외주) 표지. 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/internal-web-service/data.js 를 참조만 한다.
// ⚠️ 공개 경계는 data.js 머리 주석이 갖는다. 표지에 그림 · 화면 · 발주처를 올리지 않는다.
//
// 이 표지가 다른 다섯과 다른 점: **그림 자리를 비운다.**
//   이전 판은 이 자리에 납품물의 구조도를 올렸는데, 그 도식이 계약상
//   «비밀정보» 의 설계·도면에 정면으로 걸린다. 그림을 다른 것으로
//   바꾸는 대신 **아예 두지 않는다** — 이 프로젝트에서 공개 가능한 그림은 없다.
//   CoverSplit 은 art 를 안 주면 글 칸이 전폭을 쓴다(src/views/cover-parts.jsx).

(function buildInternalWebServiceCover() {
  const D = window.INTERNAL_WEB_SERVICE_DATA;
  const fact = (k) => (D.facts.find((f) => f[0] === k) || [])[1];

  // 사이트 주소는 data.js 에 없다 — 자기 주소를 자기가 갖지 않는다.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/';

  // oneLine 은 네 문장인데 표지는 **앞 두 문장만** 쓴다. 나머지는 본문이 받는다.
  const S = (t, n) => String(t).split(/(?<=\.\**)\s+/).slice(0, n).join(' ');

  const pills = [
    { kind: 'accent', text: D.meta.period.replace(/\s*\(.*\)$/, '') },
    { text: D.meta.team },
    { text: 'DynamoDB · Terraform · Electron' },
    // 경계를 배지로 먼저 말한다 — 본문까지 읽어야 알게 두지 않는다.
    { tone: 'terra', text: '구현 구조 비공개 (계약 비밀유지)' },
  ];

  window.COVERS = window.COVERS || {};
  window.COVERS['internal-web-service'] = {
    toc: {
      title: '사내 학습 웹 서비스',
      period: '2026.05 – 2026.07',
      tags: ['스키마리스 NoSQL', '서버리스', '비개발자 운영 콘솔'],
    },

    render: ({ density }) => (
      <div className="cv-stack">
        <window.CoverSplit
          main={
            <React.Fragment>
              <window.Eyebrow>{fact('형태') + ' · 납품 완료'}</window.Eyebrow>
              <window.CoverTitle>사내 학습 웹 서비스</window.CoverTitle>
              <window.Lede>{S(D.meta.oneLine, 2)}</window.Lede>
              <window.RoleLine label={D.meta.role}>
                {' — 웹 서비스 전체 520 커밋 중 본인 338 (65%) · 최다 기여'}
              </window.RoleLine>
              <window.Pills items={pills} />
              <window.LinkRow links={[
                { label: '상세 페이지', v: '제약 → 기술 선택 → 이유', tone: 'sage',
                  href: SITE + 'pages/internal-web-service.html' },
              ]} />
            </React.Fragment>
          }
        />

        {/* 성과 요약. 시장 지표가 아니라 납품 규모와 기여량이다. */}
        <window.BigStats items={D.heroMetrics} />
      </div>
    ),
  };
})();
