// pages/internal-web-service/cover.jsx
// 사내 학습 웹 서비스 (외주) 표지. 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/internal-web-service/data.js 를 참조만 한다.
// ⚠️ 공개 경계는 data.js 머리 주석이 갖는다. 표지에 그림 · 화면 · 발주처를 올리지 않는다.
//
// 공개 가능한 시각 자산이 없어 그림 자리 없이 글과 공개 허용 수치만 사용한다.
// CoverSplit 은 art 를 안 주면 글 칸이 전폭을 쓴다(src/views/cover-parts.jsx).

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
                {' — 저장소 커밋 작성자별 집계 기준 338/520건(65%)'}
              </window.RoleLine>
              <window.Pills items={pills} />
              <window.LinkRow links={[
                { label: '상세 페이지', v: '제약 → 기술 선택 → 판단 근거', tone: 'sage',
                  href: SITE + 'pages/internal-web-service.html' },
              ]} />
            </React.Fragment>
          }
        />

        {/* 성과 요약. 시장 지표가 아니라 납품과 작업 기록이다. */}
        <window.BigStats items={D.heroMetrics} />
      </div>
    ),
  };
})();
