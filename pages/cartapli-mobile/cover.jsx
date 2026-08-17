// pages/cartapli-mobile/cover.jsx
// Cartapli Mobile 표지. 덱 · 랜딩 캐러셀 · 상세 페이지 히어로가 같은 것을 쓴다.
//
// ⚠️ 사실을 만들지 않는다. pages/cartapli-mobile/data.js 를 참조만 한다.
//
// 이 표지는 공용 부품을 거의 쓰지 않는다 — 큰 퍼센트 셋이 **서로 다른 측정축**이라
// 값 옆에 전후(detail)와 조건(note)이 같이 있어야 오독이 안 난다. 공용 Metrics 로
// 접으면 그 층이 사라진다. 양식을 맞추는 것보다 오독을 막는 게 먼저다.

(function buildCmCover() {
  const C = window.CM_DATA;
  const RI = (s) => (window.renderInline ? window.renderInline(s) : s);

  // 사이트 주소는 data.js 에 없다 — 자기 주소를 자기가 갖지 않는다.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/pages/cartapli-mobile.html';
  // 페이지 안 앵커(#architecture 등)는 표지에서 가리킬 곳이 없다 — 바깥 링크만 쓴다.
  const external = C.meta.links.filter((link) => link.external);
  const links = [{ label: '상세 페이지', href: SITE }].concat(external);

  window.COVERS = window.COVERS || {};
  window.COVERS['cartapli-mobile'] = {
    // 덱 목차가 세어 가는 것. 성과(계측 3축) 먼저, 기술 스택이 마지막 —
    // 세 프로젝트 공통 순서다.
    toc: {
      title: C.meta.title,
      period: C.meta.period,
      tags: C.meta.metrics.map((m) => m.value + ' · ' + m.label).concat([C.meta.stack.join(' · ')]),
    },

    render: ({ density }) => {
      const m = C.meta;
      return (
        <div className="cmd-cover">
          <div className="cmd-cover__top">
            <div className="cmd-cover__copy">
              {/* eyebrow 는 자리(덱 상단 크롬)가 이미 같은 문자열을 낸다. 여기 또 두지 않는다. */}
              <h1 className="cmd-cover__title">{m.title}</h1>
              <p className="cmd-cover__sub">{RI(m.subtitle)}</p>
              <p className="cmd-cover__core">{RI(m.core)}</p>
              <div className="cmd-links">
                {links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener">
                    {l.label}<span aria-hidden="true"> ↗</span>
                  </a>
                ))}
              </div>
            </div>
            <figure className="cmd-cover__media">
              <img src={m.media.src} alt={m.media.alt} />
              <figcaption>{RI(m.media.caption)}</figcaption>
            </figure>
          </div>

          {/* 랜딩 카드에서는 각주를 뺀다 — 카드는 미리보기고, 축 주의와 측정 환경은
              덱·상세 페이지가 받는다. 이 표지가 여섯 중 가장 높아서 줄 전체 높이를 정한다. */}
          {density !== 'card' && (
            <p className="cmd-axisnote">
              <b>서로 다른 측정축 3개</b> · 각 퍼센트는 같은 카드 안의 전후 값만 비교
            </p>
          )}
          <div className="cmd-metrics">
            {m.metrics.map((metric) => (
              <article className="cmd-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <b>{metric.detail}</b>
                <small>{metric.note}</small>
              </article>
            ))}
          </div>

          {/* 표지에 "Android" 는 네 번 나오는데 측정 환경은 한 번도 안 나왔다.
              큰 %가 Android 실기기 성능으로 읽힌다 — claims.yaml CM-PERF-001 의 금지 추론이다.
              data.js result.conditions 원문을 그대로 한 줄로 붙인다. */}
          {density !== 'card' && C.result.conditions && (
            <p className="cmd-measure">
              <b>측정</b>{C.result.conditions.map(([, value]) => value).map((v, i) => (
                <React.Fragment key={i}>{i ? ' · ' : ' '}{RI(v)}</React.Fragment>
              ))}
            </p>
          )}
          <p className="cmd-boundary">{RI(m.boundary)}</p>
          {/* 기간이 맨 앞, 기술 스택이 맨 뒤다 — 다른 두 프로젝트 표지와 같은 순서.
              facts 에 이미 있는 스택 조각('Unity 6.3 · URP 17.3')은 합친 줄에 흡수되므로 뺀다. */}
          <div className="cmd-pills">
            {[m.period]
              .concat(m.facts.filter((f) => !m.stack.join(' · ').includes(f)))
              .concat([m.stack.join(' · ')])
              .map((f) => <span key={f}>{f}</span>)}
          </div>
        </div>
      );
    },
  };
})();
