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

  function CMDMeasure({ s }) {
    const m = s.measurement;
    return (
      <div className="sl-body cmd-measure">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>발견한 문제</b><span>{RI(m.intro)}</span></p>
        <div className="cmd-measure__overview"><window.CMBenchmarkOverview data={m.benchmark} /></div>
        <div className="cmd-measure__flow"><window.CMValidationFlow steps={m.validationFlow} /></div>
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
        <div className="cmd-outcome__chart">
          <window.CMStageChart stages={m.stages} headline={m.headline} stageNote={m.stageNote} />
        </div>
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
        <p className="cmd-problem"><b>프로파일링에서 드러난 문제</b><span>{d.context.problem}</span></p>
        <MetricStrip items={d.headline} compact />
        <div className="cmd-structural-slide__art">
          <window.CMStructuralModel steps={d.steps} condition={d.condition} />
        </div>
        <p className="cmd-decision"><b>판단</b><span>{d.intro}</span></p>
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
        <p className="cmd-problem"><b>남아 있던 비용</b><span>{d.context.problem}</span></p>
        <div className="cmd-native-slide__flow"><window.CMNativeFlow items={d.flow} /></div>
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
    return (
      <div className="sl-body cmd-placement-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(d.intro)}</p>
        <div className="cmd-placement-slide__art"><window.CMPlacementOverview data={d} /></div>
      </div>
    );
  }

  function CMDSplit({ s }) {
    const d = s.nativeFrame;
    return (
      <div className="sl-body cmd-split-slide">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>고민</b><span>{d.context.problem}</span></p>
        <div className="cmd-split-slide__result">
          <window.CMPairedBars title="Split Average" before={d.split.before} after={d.split.after} delta={d.split.delta} />
          <window.CMSplitSequence sequences={d.sequences} />
        </div>
        <div className="cmd-split-slide__code">
          <CodeCard code={{ title: 'RUN OR SCHEDULE · ca09945', code: d.code, result: d.codeCaption }} />
          <p className="cmd-decision"><b>채택 근거</b><span>{RI(d.conclusion)}</span></p>
        </div>
        <Boundary>{d.split.condition}</Boundary>
      </div>
    );
  }

  function CMDBuriedDecision({ s }) {
    const d = s.asyncConfirm;
    const metrics = [
      { value: `${d.headline.worker} vs ${d.headline.main}${d.headline.unit}`, label: d.headline.label, note: d.headline.secondary },
    ];
    return (
      <div className="sl-body cmd-buried-decision">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-problem"><b>커지는 스파이크</b><span>{d.context.problem}</span></p>
        <MetricStrip items={metrics} compact />
        <div className="cmd-buried-decision__grid">
          <window.CMAsyncFlow data={d.flow} />
          <window.CMBuriedProfile points={d.profile} summary={d.profileSummary} />
        </div>
        <Boundary>{d.measurementBoundary}</Boundary>
      </div>
    );
  }

  function CMDBuriedCode({ s }) {
    const d = s.asyncConfirm;
    return (
      <div className="sl-body cmd-buried-code">
        <Head title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(d.prerequisite)}</p>
        <div className="cmd-buried-code__grid">
          <CodeCard code={{ title: 'TRY HARVEST · ca09945', code: d.code, result: d.codeCaption }} />
          <div className="cmd-buried-code__proof">
            <p className="cmd-decision"><b>비차단 규칙</b><span>예약되지 않았거나 아직 끝나지 않았다면 기다리지 않고 반환하고, 완료된 결과만 수확·압축한다.</span></p>
            <window.CMProofStrip items={d.proof} />
            <dl className="cmd-comparison">
              {d.comparison.map((row) => <div key={row.label}><dt>{row.label}</dt><dd><b>{row.worker.toFixed(1)}{row.unit}</b><span>Worker</span><i>vs</i><b>{row.main.toFixed(1)}{row.unit}</b><span>Main Run</span></dd></div>)}
            </dl>
          </div>
        </div>
        <Boundary>{d.boundary}</Boundary>
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
