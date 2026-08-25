// Cartapli Mobile 제출용 덱 레이아웃.
// 확정 페이지의 data.js와 viz.jsx만 읽고 1920×1200 회사 제출용 흐름으로 재배치한다.

(function defineCMSlides() {
  const RI = (value) => window.renderInline ? window.renderInline(value) : value;

  function Head({ title, kind }) {
    return (
      <div className="cmd-head">
        <h2 className="cmd-head__title">{RI(title)}</h2>
        {kind && <span className="cmd-head__kind">{kind}</span>}
      </div>
    );
  }

  function MetricStrip({ items, compact = false }) {
    return (
      <div className={'cmd-metrics' + (compact ? ' is-compact' : '')} style={{ '--metric-count': items.length }}>
        {items.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <b>{item.label}</b>
            {item.note && <small>{RI(item.note)}</small>}
          </article>
        ))}
      </div>
    );
  }

  function Boundary({ children }) {
    return <p className="cmd-boundary"><b>측정 경계</b><span>{RI(children)}</span></p>;
  }

  function CodeCard({ code }) {
    return <window.AsciiBlock title={code.title} code={code.code} result={code.result} lang="csharp" />;
  }

  function FigureLabel({ className, label, children }) {
    const root = React.useRef(null);
    React.useLayoutEffect(() => {
      const figure = root.current && root.current.querySelector('figure');
      if (!figure) return;
      figure.removeAttribute('aria-labelledby');
      figure.setAttribute('aria-label', label);
      const oldCaption = figure.querySelector(':scope > figcaption');
      if (oldCaption) oldCaption.setAttribute('aria-hidden', 'true');
    }, [label]);
    return <div className={className} ref={root}>{children}</div>;
  }

  function ValidationFlow({ steps }) {
    return (
      <figure className="cm-figure cm-validation-flow" aria-label="측정 결과를 검증한 순서">
        <header><span>MEASUREMENT HISTORY</span><strong>측정 결과를 믿을 수 있게 만든 순서</strong></header>
        <ol>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
              {index < steps.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
      </figure>
    );
  }

  function SplitSequence({ sequences, caption }) {
    return (
      <figure className="cm-figure cm-sequence" aria-label="분할 실행 위치 비교">
        {sequences.map((sequence) => (
          <div className={'cm-sequence__lane is-' + sequence.tone} key={sequence.mode}>
            <header><span>{sequence.mode}</span><strong>{sequence.result}</strong></header>
            <ol>
              {sequence.steps.map((step, index) => (
                <li key={step}><span>{step}</span>{index < sequence.steps.length - 1 && <i aria-hidden="true">→</i>}</li>
              ))}
            </ol>
          </div>
        ))}
        <div className="cm-sequence__shared">공통: NativeArray 입력 · 동일 IJobParallelFor Burst 본문</div>
        <figcaption>{RI(caption)}</figcaption>
      </figure>
    );
  }

  function PairedBars({ title, before, after, delta }) {
    const max = Math.max(before, after);
    const rows = [
      ['워커 예약', before, 'before'],
      ['메인 즉시 실행', after, 'after'],
    ];
    return (
      <figure className="cm-figure cm-paired" aria-label={title}>
        <header><h3>{title}</h3><strong>{delta}</strong></header>
        <div>
          {rows.map(([label, value, kind]) => (
            <div className={'cm-paired__row is-' + kind} key={label}>
              <span>{label}</span>
              <i aria-hidden="true" style={{ '--bar': `${value / max * 100}%` }}></i>
              <b>{value.toFixed(4)}ms</b>
            </div>
          ))}
        </div>
      </figure>
    );
  }

  function BuriedProfile({ points }) {
    const width = 900;
    const plot = { left: 72, right: 848, top: 38, bottom: 270 };
    const maxY = 500;
    const x = (index) => plot.left + ((plot.right - plot.left) / Math.max(1, points.length - 1)) * index;
    const y = (value) => plot.bottom - (value / maxY) * (plot.bottom - plot.top);
    const line = (key) => points.map((point, index) => `${x(index)},${y(point[key])}`).join(' ');
    const ticks = [500, 400, 300, 200, 100, 0];
    return (
      <figure className="cm-figure cm-buried-profile cmd-buried-profile-public" aria-label="접기 2회부터 16회까지 워커 예약안과 메인 즉시 실행 대조의 확정 순간 메인 스레드 지연 비교">
        <div className="cm-buried-profile__scroll">
          <svg viewBox={`0 0 ${width} 330`} role="img" aria-label="회차별 확정 순간 메인 스레드 지연">
            {ticks.map((tick) => <g key={tick}><line x1={plot.left} x2={plot.right} y1={y(tick)} y2={y(tick)} className="cm-profile-grid" /><text x={plot.left - 12} y={y(tick) + 4} className="cm-profile-axis" textAnchor="end">{tick}µs</text></g>)}
            <polyline points={line('main')} className="cm-profile-line is-main" />
            <polyline points={line('worker')} className="cm-profile-line is-worker" />
            {points.map((point, index) => (
              <g key={point.round}>
                <line x1={x(index)} x2={x(index)} y1={plot.top} y2={plot.bottom} className="cm-profile-stem" />
                <circle cx={x(index)} cy={y(point.main)} r="6" className="cm-profile-dot is-main" />
                <circle cx={x(index)} cy={y(point.worker)} r="6" className="cm-profile-dot is-worker" />
                <text x={x(index)} y={plot.bottom + 26} className="cm-profile-round" textAnchor="middle">{point.round}</text>
              </g>
            ))}
          </svg>
        </div>
      </figure>
    );
  }

  function CMDMeasure({ s }) {
    const m = s.measurement;
    return (
      <div className="sl-body cmd-measure">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>발견한 문제</b><span>{RI(m.intro)}</span></p>
        <div className="cmd-measure__overview"><window.CMBenchmarkOverview data={m.benchmark} /></div>
        <div className="cmd-measure__flow">
          <ValidationFlow steps={m.validationFlow} />
          <p className="cmd-validation-caption">{m.validationCaption}</p>
        </div>
        <Boundary>{m.scope.limits.join(' · ')}</Boundary>
      </div>
    );
  }

  function CMDOutcome({ s }) {
    const m = s.measurement;
    return (
      <div className="sl-body cmd-outcome">
        <Head title={s.title} kind={s.kind} />
        <div className="cmd-outcome__headline">
          <strong>{m.headline.value}</strong>
          <div><b>{m.headline.detail}</b><span>{m.headline.label}</span></div>
        </div>
        <FigureLabel className="cmd-outcome__chart" label={m.chartCaption}>
          <window.CMStageChart stages={m.stages} headline={m.headline} stageNote={m.stageNote} />
          <p className="cmd-outcome-chart-caption">{m.chartCaption}</p>
        </FigureLabel>
        <ol className="cmd-phases">
          {s.phases.map(([title, detail], index) => (
            <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><small>{detail}</small>{index < s.phases.length - 1 && <i aria-hidden="true">→</i>}</li>
          ))}
        </ol>
        <Boundary>{m.exclusion}</Boundary>
      </div>
    );
  }

  function CMDStructural({ s }) {
    const d = s.structural;
    return (
      <div className="sl-body cmd-structural-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>프로파일링에서 드러난 문제</b><span>{s.copy.problem}</span></p>
        <MetricStrip items={d.headline} compact />
        <div className="cmd-structural-slide__art">
          <window.CMStructuralModel steps={d.steps} condition={d.condition} />
          <p className="cmd-structural-caption">{s.copy.caption}</p>
        </div>
        <p className="cmd-decision"><b>판단</b><span>{s.copy.decision}</span></p>
      </div>
    );
  }

  function CMDCodeEvidence({ s }) {
    return (
      <div className="sl-body cmd-code-evidence">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(s.gist)}</p>
        {s.metrics && <MetricStrip items={s.metrics} compact />}
        <div className={'cmd-code-grid is-' + s.codes.length}>
          {s.codes.map((code) => <CodeCard key={code.title} code={code} />)}
        </div>
        <Boundary>{s.note}</Boundary>
      </div>
    );
  }

  function CMDNative({ s }) {
    const d = s.nativeFrame;
    return (
      <div className="sl-body cmd-native-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>남아 있던 비용</b><span>{s.copy.problem}</span></p>
        <div className="cmd-native-slide__flow">
          <window.CMNativeFlow items={d.flow} />
          <p className="cmd-native-flow-caption">{s.copy.caption}</p>
        </div>
        <div className="cmd-native-slide__bottom">
          <window.CMNativeUnification rows={d.unification} />
          <MetricStrip items={d.diagnostics.map((item) => ({ value: `${item.before} → ${item.after}`, label: item.label }))} compact />
        </div>
        <Boundary>{d.condition}</Boundary>
      </div>
    );
  }

  function CMDPlacement({ s }) {
    const d = s.placement;
    const lanes = [
      { key: 'main', data: d.main },
      { key: 'worker', data: d.worker },
    ];
    return (
      <div className="sl-body cmd-placement-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(d.intro)}</p>
        <figure className="sl-diagram__art cmd-placement-slide__figure">
          <div className="cmd-placement-slide__art">
            {lanes.map((lane) => (
              <article className={`cmd-placement-lane is-${lane.key}`} key={lane.key}>
                <header>
                  <span>{lane.data.eyebrow}</span>
                  <strong>{lane.data.steps[1].title}</strong>
                  <div><b>{lane.data.result}</b><small>{lane.data.detail}</small></div>
                </header>
                <ol>
                  {lane.data.steps.map((step, index) => (
                    <li key={step.title}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{step.title}</strong>
                      <small>{step.detail}</small>
                      {step.result && <em>{step.result}</em>}
                    </li>
                  ))}
                </ol>
                <p>{lane.data.condition}</p>
              </article>
            ))}
          </div>
          <figcaption className="cmd-placement-caption">{d.caption}</figcaption>
        </figure>
      </div>
    );
  }

  function CMDSplit({ s }) {
    const d = s.nativeFrame;
    return (
      <div className="sl-body cmd-split-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>문제</b><span>{s.copy.problem}</span></p>
        <div className="cmd-split-slide__result">
          <PairedBars title="분할 Average" before={d.split.before} after={d.split.after} delta={d.split.delta} />
          <SplitSequence sequences={s.sequences} caption={s.copy.sequenceCaption} />
        </div>
        <div className="cmd-split-slide__code">
          <CodeCard code={{ title: 'RUN OR SCHEDULE · ca09945', code: d.code, result: d.codeCaption }} />
          <p className="cmd-decision"><b>채택 근거</b><span>{RI(s.copy.conclusion)}</span></p>
        </div>
        <Boundary>{d.split.condition}</Boundary>
      </div>
    );
  }

  function CMDBuriedDecision({ s }) {
    const d = s.asyncConfirm;
    const metrics = [
      { value: `${d.headline.worker} vs ${d.headline.main}${d.headline.unit}`, label: s.copy.metricLabel, note: s.copy.metricNote },
    ];
    return (
      <div className="sl-body cmd-buried-decision">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>{s.copy.problemLabel}</b><span>{d.context.problem}</span></p>
        <MetricStrip items={metrics} compact />
        <div className="cmd-buried-decision__grid">
          <window.CMAsyncFlow data={d.flow} />
          <div className="cmd-profile-wrap">
            <header className="cmd-profile-head">
              <div><span>확정 이벤트 · 메인 스레드 지연</span><strong>접기 확정 순간 메인 지연</strong></div>
              <div><span className="is-worker">워커 예약 · 채택</span><span className="is-main">메인 즉시 실행 · 대조</span></div>
            </header>
            <BuriedProfile points={d.profile} />
            <p className="cmd-profile-caption">{s.copy.profileCaption}</p>
          </div>
        </div>
        <Boundary>{s.copy.boundary}</Boundary>
      </div>
    );
  }

  function CMDBuriedCode({ s }) {
    const d = s.asyncConfirm;
    return (
      <div className="sl-body cmd-buried-code">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(s.copy.prerequisite)}</p>
        <div className="cmd-buried-code__grid">
          <CodeCard code={{ title: 'TRY HARVEST · ca09945', code: d.code, result: s.copy.codeCaption }} />
          <div className="cmd-buried-code__proof">
            <p className="cmd-decision"><b>비차단 규칙</b><span>{s.copy.rule}</span></p>
            <window.CMProofStrip items={d.proof} />
            <p className="cmd-proof-condition">{s.copy.proofCondition}</p>
            <dl className="cmd-comparison">
              {d.comparison.map((row) => <div key={row.label}><dt>{row.label}</dt><dd><b>{row.worker.toFixed(1)}{row.unit}</b><span>워커 예약</span><i>vs</i><b>{row.main.toFixed(1)}{row.unit}</b><span>메인 즉시 실행</span></dd></div>)}
            </dl>
          </div>
        </div>
        <Boundary>{s.copy.boundary}</Boundary>
      </div>
    );
  }

  window.DECK_LAYOUTS = Object.assign(window.DECK_LAYOUTS || {}, {
    cmMeasure: CMDMeasure,
    cmOutcome: CMDOutcome,
    cmStructural: CMDStructural,
    cmCodeEvidence: CMDCodeEvidence,
    cmNative: CMDNative,
    cmPlacement: CMDPlacement,
    cmSplit: CMDSplit,
    cmBuriedDecision: CMDBuriedDecision,
    cmBuriedCode: CMDBuriedCode,
  });
})();
