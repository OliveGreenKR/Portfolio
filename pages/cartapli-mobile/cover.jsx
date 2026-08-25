(function defineCartapliMobileCover() {
  const D = window.CM_DATA;
  const {
    CoverSplit, CoverStack, Eyebrow, CoverTitle, Lede, RoleLine, Pills, LinkRow,
  } = window;

  function CMMedia() {
    return (
      <figure className="cm-cover-media">
        <div className="cm-cover-media__frame">
          <img src={D.hero.image} alt={D.hero.imageAlt} />
          <span className="cm-cover-media__badge">PAPERBENCH · MEASUREMENT INPUT</span>
        </div>
        <figcaption>{D.hero.imageCaption}</figcaption>
      </figure>
    );
  }

  function CMFacts() {
    return (
      <dl className="cm-cover-facts">
        {D.hero.facts.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    );
  }

  function CMMetrics({ density }) {
    return (
      <section className={`cm-cover-metrics is-${density || 'hero'}`} aria-label="대표 성과 세 가지">
        <p className="cm-cover-metrics__scope">
          <b>Windows PC · Unity Editor PlayMode</b>
          <span>동일 카드의 전후 값만 비교 · PaperBench 측정</span>
        </p>
        <div className="cm-cover-metrics__grid">
          {D.hero.metrics.map((metric) => (
            <article className="cm-cover-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <b>{metric.detail}</b>
            </article>
          ))}
        </div>
        {density !== 'card' && <ul className="cm-cover-metrics__conditions">{D.hero.metricConditions.map((item) => <li key={item}>{item}</li>)}</ul>}
      </section>
    );
  }

  function CMExecutionDecision() {
    return (
      <aside className="cm-cover-decision" aria-label="최적화 판단 흐름">
        <span>핵심 판단 흐름</span>
        <div><b>01</b><i aria-hidden="true">→</i><strong>구조 축소</strong><small>재사용 · 컬링 · 2메시</small></div>
        <div><b>02</b><i aria-hidden="true">→</i><strong>Native 단일 경로</strong><small>입력 · Bounds · 업로드</small></div>
        <div><b>03</b><i aria-hidden="true">→</i><strong>실행 위치 선택</strong><small>작은 Split은 Main · 큰 Buried는 Worker</small></div>
      </aside>
    );
  }

  window.COVERS = window.COVERS || {};
  window.COVERS['cartapli-mobile'] = {
    render: ({ density }) => (
      <CoverStack>
        <CoverSplit
          main={
            <div className="cm-cover-copy">
              <Eyebrow>{D.meta.eyebrow}</Eyebrow>
              <CoverTitle>{D.meta.title}</CoverTitle>
              <Lede>Android용 종이접기 전투를 위해 <strong>보이지 않는 작업을 줄이고 계산과 표현의 실행 구조를 다시 설계</strong>했다.</Lede>
              <Pills items={[
                { text: 'Android target', tone: 'sage', kind: 'accent' },
                { text: 'technical prototype', tone: 'wheat' },
                { text: 'Unity 6 · Burst · Jobs', tone: 'blue' },
              ]} />
              <RoleLine label="직접 기여">{` — ${D.meta.role}`}</RoleLine>
              {density !== 'card' && <LinkRow links={D.meta.links.map((link) => ({ ...link, v: '원작 보기', tone: 'blue' }))} />}
            </div>
          }
          art={<CMMedia />}
        />
        <CMMetrics density={density} />
        {density === 'hero' && <CMExecutionDecision />}
        {density !== 'card' && <CMFacts />}
      </CoverStack>
    ),
    toc: {
      title: 'Cartapli Mobile',
      period: D.meta.period,
      tags: ['Android', 'Unity', 'Burst/Jobs', 'Measurement'],
    },
  };
})();
