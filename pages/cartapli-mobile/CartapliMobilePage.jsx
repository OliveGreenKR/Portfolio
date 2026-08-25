(function defineCartapliMobilePage() {
  const { useEffect, useState } = React;
  const D = window.CM_DATA;
  const RI = (value) => window.renderInline ? window.renderInline(value) : value;

  const sections = [
    ['scope', 'Scope & next'],
    ['architecture', 'Architecture'],
    ['benchmark', 'Benchmark setup'],
    ['measurement', 'Result'],
    ['structural', 'Structural'],
    ['native-frame', 'Native frame path'],
    ['execution-placement', 'Execution placement'],
  ];

  function CMHeader() {
    return (
      <header className="nb-header">
        <a className="nb-brand" href="landing.html"><span className="nb-brand-mark"></span>JCH / PORTFOLIO</a>
        <div className="nb-crumbs">
          <a href="landing.html">index</a><span className="sep">/</span><span className="cur">cartapli mobile</span>
        </div>
        <nav className="nb-nav" aria-label="주요 섹션">
          <a href="#architecture">Architecture</a>
          <a href="#measurement">Result</a>
          <a href="#scope">Scope</a>
        </nav>
      </header>
    );
  }

  function CMRail() {
    const [active, setActive] = useState('hero');

    useEffect(() => {
      const targets = ['hero', ...sections.map(([id]) => id)]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      const observer = new IntersectionObserver(() => {
        const passed = targets
          .map((target) => ({ target, top: target.getBoundingClientRect().top }))
          .filter(({ top }) => top <= 110)
          .sort((a, b) => b.top - a.top);
        setActive((passed[0] || { target: targets[0] }).target.id);
      }, { rootMargin: '-88px 0px -62% 0px', threshold: [0, 0.2, 0.5] });
      targets.forEach((target) => observer.observe(target));
      return () => observer.disconnect();
    }, []);

    const Link = ({ id, children }) => <a href={`#${id}`} className={active === id ? 'active' : ''}>{children}</a>;
    return (
      <aside className="nb-rail cm-rail" aria-label="페이지 목차">
        <span className="nb-rail-section">project</span>
        <Link id="hero">Overview</Link>
        <span className="nb-rail-section">deep dive</span>
        {sections.map(([id, label]) => <Link id={id} key={id}>{label}</Link>)}
      </aside>
    );
  }

  function CMSection({ id, no, title, kind, lede, children }) {
    return (
      <section id={id} className="nb-section cm-section">
        <div className="nb-section-head">
          <span className="nb-section-no">§ {no}</span>
          <h2 className="nb-section-title">{title}</h2>
          <span className="nb-section-kind">{kind}</span>
        </div>
        <p className="cm-section-lede">{RI(lede)}</p>
        {children}
      </section>
    );
  }

  function CMCode({ source, caption, title = 'SOURCE · ca09945' }) {
    return (
      <div className="cm-code-evidence">
        <window.AsciiBlock title={title} intro={caption} code={source} lang="csharp" />
      </div>
    );
  }

  function CMCodeGroup({ items }) {
    return (
      <div className="cm-code-group">
        {items.map((item) => <CMCode key={item.title} source={item.source} caption={item.caption} title={item.title} />)}
      </div>
    );
  }

  function CMSectionCondition({ children }) {
    return <p className="cm-section-condition">{children}</p>;
  }

  function CMOutcome({ data }) {
    return (
      <aside className="cm-outcome" aria-label={`${data.label} ${data.value}`}>
        <div>
          <strong className={data.value.includes(' vs ') ? 'is-comparison' : ''}>{data.value}</strong>
          <span>{data.label}</span>
          <b>{data.detail}</b>
          {data.secondary && <em>{data.secondary}</em>}
        </div>
        <p>{data.condition}</p>
      </aside>
    );
  }

  function CMOutcomeStrip({ items, condition }) {
    return (
      <aside className="cm-outcome-strip" aria-label="구조 최적화 최종 결과">
        {items.map((item) => <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span>{item.note && <small>{item.note}</small>}</article>)}
        <p>{condition}</p>
      </aside>
    );
  }

  function CMScopeDetails() {
    return (
      <section id="scope" className="cm-scope-section">
        <div className="cm-scope-strip">
          <header><span>SCOPE · NEXT</span><strong>검증 범위와 다음 측정</strong></header>
          <ul>
            <li><b>확인</b> Windows PC · Unity Editor PlayMode 상대 비교</li>
            <li><b>미측정</b> Android 기기 CPU · GPU · FPS · 전체 frame time</li>
            <li><b>다음</b> Android 기기에서 Main Run ↔ Worker 실행 위치 A/B 재판정</li>
          </ul>
        </div>
      </section>
    );
  }

  function CMAsyncOutcome({ data }) {
    return (
      <aside className="cm-async-outcome" aria-label={`${data.label} Worker ${data.worker}${data.unit}, Main ${data.main}${data.unit}`}>
        <header><span>{data.label}</span><b>{data.secondary}</b></header>
        <div>
          <article className="is-worker"><span>WORKER · 지연 실행</span><strong>{data.worker}<em>{data.unit}</em></strong></article>
          <i aria-hidden="true">vs</i>
          <article className="is-main"><span>MAIN · 즉시 실행</span><strong>{data.main}<em>{data.unit}</em></strong></article>
        </div>
        <p>{data.condition}</p>
      </aside>
    );
  }

  function CartapliMobilePage() {
    return (
      <div className="nb-page cm-page">
        <CMHeader />
        <div className="nb-body">
          <CMRail />
          <main>
            <window.CoverHero slug="cartapli-mobile" />

            <CMScopeDetails />

            <CMSection
              id="architecture" no="01" kind="GAME LOOP · RESPONSIBILITY · ORDER"
              title="종이를 접으면 전투 공간과 그 위의 좌표가 함께 바뀐다"
              lede={D.architecture.intro}
            >
              <window.CMArchitectureMap data={D.architecture} />
              <window.CMPaperPipeline data={D.architecture.paperPipeline} />
              <CMCodeGroup items={D.architecture.codes} />
            </CMSection>

            <section id="benchmark" className="cm-benchmark-section" aria-labelledby="cm-benchmark-title">
              <header>
                <span>BENCHMARK FOUNDATION</span>
                <h2 id="cm-benchmark-title">PaperBench에서 반복 입력과 측정 축을 먼저 고정했다</h2>
                <p>{D.measurement.benchmark.intro}</p>
              </header>
              <window.CMBenchmarkOverview data={D.measurement.benchmark} />
              <window.CMMarkerMap data={D.measurement.markerMap} />
              <CMCode source={D.measurement.markerCode} caption={D.measurement.markerCodeCaption} title="PROFILER MARKERS · ca09945" />
              <window.CMValidationFlow steps={D.measurement.validationFlow} />
              <window.CMMeasurementScope data={D.measurement.scope} />
            </section>

            <CMSection
              id="measurement" no="02" kind="MEASUREMENT · RESULT"
              title="종이 프레임 경로 측정 비용 96% 감소 — 기준선부터 최종 상태까지"
              lede={D.measurement.gist}
            >
              <window.CMStageChart
                stages={D.measurement.stages}
                headline={D.measurement.headline}
                stageNote={D.measurement.stageNote}
              />
              <window.CMChangeMap items={D.measurement.changeMap} />
            </CMSection>

            <CMSection
              id="structural" no="03" kind="REUSE · PRUNE · MERGE"
              title="재사용·가지치기·병합으로 입력과 렌더 구조를 줄이다"
              lede={D.structural.intro}
            >
              <CMOutcomeStrip items={D.structural.headline} condition={D.structural.condition} />
              <div className="cm-structural-details">
                {D.structural.steps.map((step) => (
                  <section className={`cm-structural-detail is-${step.key.toLowerCase()}`} key={step.key}>
                    <window.CMStructuralModel steps={[step]} />
                    <CMCode source={step.code} caption={step.codeCaption} title={step.sourceLabel || 'SOURCE · ca09945'} />
                  </section>
                ))}
              </div>
              <div className="cm-stage-clarifier"><b>가지치기 직후</b><span>337→57 layers · 1348→251 vertices</span><i aria-hidden="true">→</i><b>최종 상태</b><span>337→38 layers · 1348→163 vertices</span></div>
            </CMSection>

            <CMSection
              id="native-frame" no="04" kind="NATIVEARRAY · BOUNDS · MESH UPLOAD"
              title="Split부터 Bounds·메시 업로드까지 Native 경로로 잇다"
              lede={D.nativeFrame.intro}
            >
              <CMSectionCondition>{D.nativeFrame.condition}</CMSectionCondition>
              <window.CMDiagnostics items={D.nativeFrame.diagnostics} />
              <window.CMNativeFlow items={D.nativeFrame.flow} />
              <CMCodeGroup items={D.nativeFrame.codes} />
            </CMSection>

            <CMSection
              id="execution-placement" no="05" kind="MAIN · WORKER · PLACEMENT"
              title="작고 즉시 필요한 일은 메인, 크고 미룰 수 있는 일은 워커"
              lede={D.placement.intro}
            >
              <CMSectionCondition>{D.placement.condition}</CMSectionCondition>
              <window.CMPlacementResults split={D.nativeFrame.split} buried={D.asyncConfirm.headline} />
              <window.CMPlacementTimeline data={D.placement} />
              <section className="cm-placement-story is-main" aria-labelledby="cm-placement-main-title">
                <div className="cm-placement-main-result">
                  <window.CMPairedBars
                    title="같은 Burst Split · 실행 위치 A/B"
                    before={D.nativeFrame.split.before}
                    after={D.nativeFrame.split.after}
                    delta={D.nativeFrame.split.delta}
                  />
                  <window.CMSplitSequence sequences={D.nativeFrame.sequences} />
                </div>
                <div className="cm-placement-story__main-grid">
                  <header>
                    <span>05-A · MAIN THREAD</span>
                    <h3 id="cm-placement-main-title">작아진 Split은 같은 Burst 본문을 메인에서 바로 실행</h3>
                    <p>{D.nativeFrame.conclusion}</p>
                  </header>
                  <CMCode source={D.nativeFrame.code} caption={D.nativeFrame.codeCaption} />
                </div>
              </section>

              <section className="cm-placement-story is-worker" aria-labelledby="cm-placement-worker-title">
                <header>
                    <span>05-B · WORKER THREAD</span>
                  <h3 id="cm-placement-worker-title">큰 파묻힘 판정은 예약하고, 끝난 틱에서만 수확</h3>
                  <p>{D.asyncConfirm.intro}</p>
                </header>
                <div className="cm-worker-evidence">
                  <window.CMBuriedProfile points={D.asyncConfirm.profile} summary={D.asyncConfirm.profileSummary} />
                </div>
                <div className="cm-worker-implementation">
                  <CMCode source={D.asyncConfirm.code} caption={D.asyncConfirm.codeCaption} />
                  <aside className="cm-prerequisite-note"><span>STRUCTURAL PREREQUISITE</span><strong>PaperSnapshot · fixed history ring</strong><p>확정 상태의 수명을 고정한 뒤, Buried 판정만 워커가 빌려 읽는다.</p></aside>
                </div>
              </section>
            </CMSection>

            <footer className="nb-footer">
              <span>JCH · 2026 · Cartapli Mobile</span>
              <span>Android 기술 프로토타입 · Editor 검증</span>
            </footer>
          </main>
          <div aria-hidden="true"></div>
        </div>
      </div>
    );
  }

  window.CartapliMobilePage = CartapliMobilePage;
})();
