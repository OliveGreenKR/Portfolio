// pages/cartapli-mobile/viz.jsx

function CMSystemMap({ systems }) {
  return (
    <figure className="cm-figure cm-system-map" aria-label="BattleSimulation을 중심으로 Paper, Surface, WorldLink, simulation worlds, presentation을 연결한 시스템 구조도">
      {systems.map((system, index) => (
        <React.Fragment key={system.title}>
          <article className={'cm-system-card ' + (system.tone || '')}>
            <span>{system.tag}</span>
            <strong>{system.title}</strong>
            <p>{window.renderInline(system.body)}</p>
          </article>
          {index < systems.length - 1 && <span className="cm-map-arrow" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
    </figure>
  );
}
window.CMSystemMap = CMSystemMap;

function CMSimulationFlow({ lanes, clock }) {
  return (
    <figure className="cm-figure cm-sim-flow" aria-label="가변 프레임 세 단계, 고정 스텝 일곱 단계, Presentation 두 단계로 이어지는 전체 시뮬레이션 흐름">
      {lanes.map((lane, laneIndex) => (
        <React.Fragment key={lane.tag}>
          <section className={'cm-flow-lane lane-' + laneIndex}>
            <header>
              <strong>{lane.tag}</strong>
              <span>{lane.note}</span>
            </header>
            <div className="cm-flow-items">
              {lane.items.map(([no, title, body], index) => (
                <React.Fragment key={no}>
                  <article className="cm-flow-step">
                    <span>{no}</span>
                    <strong>{title}</strong>
                    <p>{window.renderInline(body)}</p>
                  </article>
                  {index < lane.items.length - 1 && <span className="cm-flow-arrow" aria-hidden="true">→</span>}
                </React.Fragment>
              ))}
            </div>
          </section>
          {laneIndex === 0 && (
            <aside className="cm-clock-bridge">
              <span>{clock[0]}</span>
              <strong>{clock[1]}</strong>
              <b aria-hidden="true">↓</b>
              <small>{clock[2]}</small>
            </aside>
          )}
        </React.Fragment>
      ))}
    </figure>
  );
}
window.CMSimulationFlow = CMSimulationFlow;

function CMTransaction({ items }) {
  return (
    <figure className="cm-confirm-flow" aria-label="접기 확정 시 알림, 종이 확정, 표면 재해석 순서">
      <span className="cm-transaction-label">CONFIRM TRANSACTION</span>
      <div>
        {items.map(([no, title, body], index) => (
          <React.Fragment key={no}>
            <article>
              <span>{no}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
            {index < items.length - 1 && <span className="cm-flow-arrow" aria-hidden="true">→</span>}
          </React.Fragment>
        ))}
      </div>
    </figure>
  );
}
window.CMTransaction = CMTransaction;

function CMStageChart({ bars }) {
  const max = Math.max(...bars.map((bar) => bar.ms));
  return (
    <figure className="cm-figure cm-stage-chart" aria-label="S0부터 S2-b까지 프레임당 CPU 마커 Average 합이 0.643ms에서 0.040ms로 감소한 그래프">
      <div className="cm-chart-legend">
        <span><i className="base"></i>기준</span>
        <span><i className="structure"></i>구조 개선</span>
        <span><i className="native"></i>NativeArray·Job·Burst 결합</span>
      </div>
      <div className="cm-chart-rows">
        {bars.map((bar) => (
          <div className="cm-chart-row" key={bar.stage}>
            <span className="cm-chart-stage">{bar.stage}</span>
            <div className="cm-chart-track">
              <i className={'cm-chart-bar ' + bar.group} style={{ width: Math.max(6, (bar.ms / max) * 100) + '%' }}></i>
            </div>
            <b>{bar.ms.toFixed(3)} ms</b>
            <strong>{bar.delta}</strong>
            <span>{bar.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
window.CMStageChart = CMStageChart;

function CMBeforeAfter({ before, after, stage }) {
  const panel = (data, kind) => (
    <article className={'cm-ba-panel ' + kind}>
      <span>{kind === 'before' ? 'BEFORE' : 'AFTER'}</span>
      <strong>{data.title}</strong>
      <div className="cm-ba-flow">
        {data.items.map((item, index) => (
          <React.Fragment key={item}>
            <i>{item}</i>
            {index < data.items.length - 1 && <b aria-hidden="true">→</b>}
          </React.Fragment>
        ))}
      </div>
      <p>{data.footer}</p>
    </article>
  );

  return (
    <figure className="cm-figure cm-before-after" aria-label={stage + '의 기존 방식과 개선 방식 비교'}>
      {panel(before, 'before')}
      <span className="cm-ba-divider" aria-hidden="true">→</span>
      {panel(after, 'after')}
    </figure>
  );
}
window.CMBeforeAfter = CMBeforeAfter;

/* Page-only visual language.
   The submission deck keeps the legacy components above. These components are
   intentionally named CMPage* and are mounted only by CartapliMobilePage.jsx. */

let cmPageMermaidSequence = 0;

function cmMermaidText(value) {
  return String(value).replace(/`/g, '').replace(/"/g, "'").replace(/\s+/g, ' ').trim();
}

function useCMNarrow() {
  const query = '(max-width: 760px)';
  const [narrow, setNarrow] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setNarrow(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return narrow;
}

function CMPageMermaid({ source, label, caption, minWidth = 980, className = '' }) {
  const hostRef = React.useRef(null);
  const idRef = React.useRef('cm-page-mermaid-' + (++cmPageMermaidSequence));

  React.useEffect(() => {
    const mermaid = window.mermaid;
    if (!mermaid || !hostRef.current) return undefined;
    let cancelled = false;
    mermaid.render(idRef.current, source)
      .then(({ svg }) => {
        if (!cancelled && hostRef.current) hostRef.current.innerHTML = svg;
      })
      .catch((error) => {
        if (!cancelled && hostRef.current) {
          hostRef.current.textContent = 'diagram render error · ' + error.message;
        }
      });
    return () => { cancelled = true; };
  }, [source]);

  return (
    <figure className={'cm-page-diagram ' + className} aria-label={label} style={{ '--cm-diagram-min': minWidth + 'px' }}>
      <div className="cm-page-diagram-scroll">
        <div className="cm-page-mermaid-host" ref={hostRef}></div>
      </div>
      <figcaption>{window.renderInline(caption)}</figcaption>
    </figure>
  );
}

function CMPageArchitectureDiagram() {
  const narrow = useCMNarrow();
  if (narrow) return <CMPageMobileArchitecture />;
  const source = `classDiagram
direction LR
class FrameLoop {
  +SimTick()
  +RenderTick()
}
class BattleSimulation {
  <<order owner>>
  +SimTick()
}
class PaperController
class SurfaceWorld
class WorldLink
class GeoWorld
class MotionWorld
class IWorld {
  <<interface>>
  +Position
}
class PaperRenderer {
  +Sync(front, back)
}
class PaperOutlineRenderer {
  +Sync(outline)
}
FrameLoop --> BattleSimulation : calls
BattleSimulation --> PaperController : orders calls
BattleSimulation --> SurfaceWorld : orders calls
BattleSimulation --> WorldLink : orders calls
BattleSimulation --> GeoWorld : orders calls
BattleSimulation --> MotionWorld : orders calls
WorldLink --> IWorld : read / write
PaperController --> PaperRenderer : RenderTick
PaperController --> PaperOutlineRenderer : RenderTick`;

  return (
    <CMPageMermaid
      source={source}
      label="BattleSimulation 중심 클래스 책임 관계도"
      caption="실행 순서는 `BattleSimulation` 한 곳이 소유한다. 월드 간 위치 교환은 `IWorld`, 화면 출력은 `RenderTick` 경계 뒤의 두 renderer로 분리된다."
      minWidth={920}
    />
  );
}
window.CMPageArchitectureDiagram = CMPageArchitectureDiagram;

function CMPageMobileArchitecture() {
  const Node = ({ x, y, w = 150, title, meta }) => (
    <g>
      <rect x={x} y={y} width={w} height="58" rx="3" className="cm-mobile-arch-node" />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" className="cm-mobile-arch-title">{title}</text>
      {meta && <text x={x + w / 2} y={y + 43} textAnchor="middle" className="cm-mobile-arch-meta">{meta}</text>}
    </g>
  );
  return (
    <figure className="cm-page-diagram cm-mobile-architecture" aria-label="BattleSimulation 중심 모바일 컴포넌트 관계도">
      <svg viewBox="0 0 360 700" role="img">
        <defs>
          <marker id="cm-mobile-arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="cm-viz-arrow-head" />
          </marker>
        </defs>
        <Node x={105} y={18} title="FrameLoop" meta="SimTick · RenderTick" />
        <path d="M180 76 V108" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <Node x={80} y={110} w={200} title="BattleSimulation" meta="실행 순서 소유" />
        <text x="190" y="194" className="cm-mobile-arch-edge">orders calls</text>
        <path d="M180 168 V440" className="cm-mobile-arch-line" />
        <path d="M180 218 H90 V242" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <path d="M180 218 H270 V242" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <path d="M180 330 H90 V350" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <path d="M180 440 H90 V458" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <path d="M180 440 H270 V458" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <Node x={15} y={244} title="PaperController" meta="paper state" />
        <Node x={195} y={244} title="SurfaceWorld" meta="surface resolve" />
        <Node x={15} y={352} title="WorldLink" meta="position bridge" />
        <Node x={195} y={352} title="IWorld" meta="read · write contract" />
        <path d="M165 381 H193" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <Node x={15} y={460} title="GeoWorld" meta="collision query" />
        <Node x={195} y={460} title="MotionWorld" meta="fixed-step motion" />
        <text x="24" y="548" className="cm-mobile-arch-edge">RenderTick</text>
        <path d="M90 302 H8 V562" className="cm-mobile-arch-line" />
        <path d="M8 562 H92 V580" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <path d="M8 562 H270 V580" className="cm-mobile-arch-line" markerEnd="url(#cm-mobile-arch-arrow)" />
        <Node x={10} y={582} w={164} title="PaperRenderer" meta="front · back mesh" />
        <Node x={186} y={582} w={164} title="OutlineRenderer" meta="outline mesh" />
      </svg>
      <figcaption>중앙 제어기는 생명주기가 아니라 호출 순서만 소유한다. 월드는 <code>IWorld</code> 계약으로 연결되고, 화면 출력은 <code>RenderTick</code> 뒤로 분리된다.</figcaption>
    </figure>
  );
}

function CMPageSimulationDiagram({ lanes, clock }) {
  const narrow = useCMNarrow();
  const makeLane = (lane, prefix) => {
    const nodes = lane.items.map(([no, title, body], index) => {
      const id = prefix + (index + 1);
      const safeTitle = cmMermaidText(no + ' · ' + title).replace(/\./g, narrow ? '<br/>' : '.');
      const safeBody = cmMermaidText(body).replace(/ · /g, narrow ? '<br/>' : ' · ');
      return `${id}["${safeTitle}${narrow ? '' : '<br/><small>' + safeBody + '</small>'}"]`;
    });
    const edges = lane.items.slice(1).map((_, index) => `${prefix}${index + 1} --> ${prefix}${index + 2}`);
    return [...nodes, ...edges].join('\n');
  };
  const source = `flowchart TB
subgraph V["VARIABLE FRAME · ${cmMermaidText(lanes[0].note)}"]
direction TB
${makeLane(lanes[0], 'V')}
end
subgraph F["FIXED STEP · ${cmMermaidText(clock[2])}"]
direction TB
${makeLane(lanes[1], 'F')}
end
subgraph P["PRESENTATION · ${cmMermaidText(lanes[2].note)}"]
direction TB
${makeLane(lanes[2], 'P')}
end
V3 --> G{fixed step<br/>available?}
G -->|yes · max 3| F1
F7 -->|consume next| G
G -->|no · 0 allowed| P1
style V fill:#f5e8df,stroke:#c56f5b
style F fill:#edf3e8,stroke:#7da36e
style P fill:#f3efe5,stroke:#9b927c`;

  return (
    <CMPageMermaid
      source={source}
      label="가변 프레임, 고정 스텝, 화면 반영의 실행 흐름도"
      caption="화살표가 실제 호출 순서다. Variable Frame 뒤 누적 시간을 최대 3회 소비하며, fixed-step이 0회인 프레임은 바로 Presentation으로 넘어간다. `Complete`에서 최신 결과를 소비한다."
      minWidth={0}
      className="is-flow"
    />
  );
}
window.CMPageSimulationDiagram = CMPageSimulationDiagram;

function CMPageOptimizationCurve({ bars }) {
  const narrow = useCMNarrow();
  if (narrow) {
    const max = Math.max(...bars.map((bar) => bar.ms));
    return (
      <figure className="cm-page-curve cm-page-curve-mobile" aria-label="S0부터 S2-b까지 다섯 단계의 CPU 마커 합 비교 막대그래프">
        <svg viewBox="0 0 360 560" role="img">
          <text x="18" y="28" className="cm-viz-kicker">FRAME COST · AVERAGE MS</text>
          {bars.map((bar, index) => {
            const rowY = 82 + index * 96;
            const barWidth = Math.max(8, (bar.ms / max) * 188);
            return (
              <g key={bar.stage}>
                <text x="18" y={rowY - 14} className="cm-curve-stage">{bar.stage}</text>
                <text x="18" y={rowY + 10} className="cm-curve-label">{bar.label}</text>
                <rect x="142" y={rowY - 18} width="188" height="18" rx="2" className="cm-mobile-bar-track" />
                <rect x="142" y={rowY - 18} width={barWidth} height="18" rx="2" className={'cm-mobile-bar ' + bar.group} />
                <text x="330" y={rowY - 28} textAnchor="end" className="cm-curve-value">{bar.ms.toFixed(3)} ms</text>
                <text x="330" y={rowY + 20} textAnchor="end" className="cm-curve-delta">{bar.delta}</text>
              </g>
            );
          })}
        </svg>
        <figcaption>다섯 단계를 한 화면에서 비교한다. 막대 길이는 같은 입력에서 측정한 프레임당 CPU 마커 합이다.</figcaption>
      </figure>
    );
  }

  const width = 1000;
  const plot = { left: 74, right: 948, top: 54, bottom: 292 };
  const maxY = 0.7;
  const x = (index) => plot.left + ((plot.right - plot.left) / (bars.length - 1)) * index;
  const y = (value) => plot.bottom - (value / maxY) * (plot.bottom - plot.top);
  const points = bars.map((bar, index) => [x(index), y(bar.ms)]);
  const line = points.map(([px, py], index) => (index ? 'L' : 'M') + px + ' ' + py).join(' ');
  const area = line + ` L ${plot.right} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`;
  const ticks = [0.6, 0.4, 0.2, 0];

  return (
    <figure className="cm-page-curve cm-visual-scroll" aria-label="S0부터 S2-b까지 CPU 마커 합이 단계적으로 감소하는 선 그래프">
      <svg viewBox={'0 0 ' + width + ' 390'} role="img">
        <defs>
          <linearGradient id="cm-curve-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sage-300)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--sage-100)" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <text x="18" y="24" className="cm-viz-kicker">FRAME COST · AVERAGE MS</text>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={plot.left} x2={plot.right} y1={y(tick)} y2={y(tick)} className="cm-viz-grid" />
            <text x={plot.left - 14} y={y(tick) + 5} textAnchor="end" className="cm-viz-axis">{tick.toFixed(1)}</text>
          </g>
        ))}
        <path d={area} className="cm-curve-area" />
        <path d={line} className="cm-curve-line" />
        {bars.map((bar, index) => {
          const px = x(index), py = y(bar.ms);
          return (
            <g key={bar.stage}>
              <line x1={px} x2={px} y1={py} y2={plot.bottom} className="cm-curve-stem" />
              <circle cx={px} cy={py} r="8" className={'cm-curve-dot ' + bar.group} />
              <text x={px} y={py - 18} textAnchor="middle" className="cm-curve-value">{bar.ms.toFixed(3)} ms</text>
              <text x={px} y={plot.bottom + 31} textAnchor="middle" className="cm-curve-stage">{bar.stage}</text>
              <text x={px} y={plot.bottom + 53} textAnchor="middle" className="cm-curve-label">{bar.label}</text>
              <text x={px} y={plot.bottom + 76} textAnchor="middle" className="cm-curve-delta">{bar.delta}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>같은 입력을 유지한 채 한 단계씩 바꿨다. 선의 기울기는 각 단계 직전 대비 감소폭, 마지막 점은 전체 경로의 최종 비용이다.</figcaption>
    </figure>
  );
}
window.CMPageOptimizationCurve = CMPageOptimizationCurve;

function CMVizArrow({ id }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" className="cm-viz-arrow-head" />
      </marker>
      <pattern id={id + '-hatch'} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" className="cm-viz-hatch" />
      </pattern>
    </defs>
  );
}

function CMReuseVisual({ method, viewBox = '0 0 1000 390', side }) {
  const arrow = 'cm-reuse-arrow';
  return (
    <svg viewBox={viewBox} role="img" aria-label="모든 레이어를 다시 만드는 방식과 변하지 않은 레이어 참조를 재사용하는 방식 비교">
      <CMVizArrow id={arrow} />
      {side !== 'after' && <g>
        <text x="34" y="34" className="cm-viz-kicker">BEFORE · RECREATE ALL</text>
        {[0, 1, 2, 3, 4].map((i) => <rect key={'bi' + i} x={62 + i * 10} y={86 + i * 35} width="150" height="72" rx="3" className="cm-viz-paper old" />)}
        <line x1="258" x2="398" y1="177" y2="177" className="cm-viz-arrow" markerEnd={'url(#' + arrow + ')'} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={'bo' + i} x={366 + i * 11} y={76 + i * 38} width="150" height="72" rx="3" className="cm-viz-paper created" />)}
        <text x="137" y="306" textAnchor="middle" className="cm-viz-label">입력 전체</text>
        <text x="446" y="306" textAnchor="middle" className="cm-viz-label">새 Layer · 새 Mesh</text>
      </g>}
      {side !== 'before' && <g>
        <text x="540" y="34" className="cm-viz-kicker good">AFTER · PRESERVE IDENTITY</text>
        {[0, 1, 2, 3, 4].map((i) => <rect key={'ai' + i} x={570 + i * 10} y={86 + i * 35} width="150" height="72" rx="3" className={'cm-viz-paper ' + (i < 3 ? 'reused' : 'crossed')} />)}
        <line x1="732" x2="886" y1="154" y2="154" className="cm-viz-arrow good" markerEnd={'url(#' + arrow + ')'} />
        <path d="M748 210 C790 174 832 174 874 210" className="cm-viz-ref-loop" />
        <text x="810" y="136" textAnchor="middle" className="cm-viz-label good">same reference</text>
        <text x="810" y="232" textAnchor="middle" className="cm-viz-note">교차한 레이어만 분할</text>
        <rect x="874" y="83" width="78" height="57" rx="3" className="cm-viz-paper reused" />
        <path d="M876 188 L916 151 L953 188 L953 247 L876 247 Z" className="cm-viz-piece new" />
        <line x1="915" x2="915" y1="152" y2="247" className="cm-viz-fold-line" />
        <text x="682" y="306" textAnchor="middle" className="cm-viz-label">위치 먼저 분류</text>
        <text x="914" y="306" textAnchor="middle" className="cm-viz-label">재사용 / 새 조각</text>
      </g>}
      {!side && <text x="500" y="365" textAnchor="middle" className="cm-viz-caption">{method.after.footer}</text>}
    </svg>
  );
}

function CMPruneVisual({ method, viewBox = '0 0 1000 390', side }) {
  const arrow = 'cm-prune-arrow';
  return (
    <svg viewBox={viewBox} role="img" aria-label="파묻힌 조각을 유지하는 방식과 확정 순간 제거하는 방식 비교">
      <CMVizArrow id={arrow} />
      {side !== 'after' && <g>
        <text x="36" y="34" className="cm-viz-kicker">BEFORE · KEEP HIDDEN PIECES</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M ${92 + i * 18} ${250 - i * 28} l 180 -18 l 78 64 l -190 22 z`} className={'cm-viz-layer ' + (i === 1 || i === 2 ? 'buried' : 'visible')} />
        ))}
        <line x1="128" y1="227" x2="270" y2="305" className="cm-viz-cross" />
        <line x1="270" y1="227" x2="128" y2="305" className="cm-viz-cross" />
        <text x="208" y="345" textAnchor="middle" className="cm-viz-label">보이지 않아도 다음 입력에 포함</text>
      </g>}
      {!side && <g>
        <line x1="418" x2="570" y1="190" y2="190" className="cm-viz-arrow" markerEnd={'url(#' + arrow + ')'} />
        <text x="495" y="169" textAnchor="middle" className="cm-viz-note">앞·뒤 가려짐 판정</text>
      </g>}
      {side !== 'before' && <g>
        <text x="610" y="34" className="cm-viz-kicker good">AFTER · PRUNE ON CONFIRM</text>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${650 + i * 22} ${238 - i * 38} l 185 -16 l 72 62 l -190 22 z`} className="cm-viz-layer kept" />
        ))}
        <path d="M604 278 h40 v54 h-40 z M598 270 h52" className="cm-viz-trash" />
        <text x="777" y="345" textAnchor="middle" className="cm-viz-label good">{method.after.items[2]}</text>
      </g>}
      {!side && <text x="500" y="375" textAnchor="middle" className="cm-viz-caption">되돌리기 이력은 제거 전 상태를 보존하고, 확정 데이터에는 남길 조각만 옮긴다.</text>}
    </svg>
  );
}

function CMMergeVisual({ method, viewBox = '0 0 1000 390', side }) {
  const arrow = 'cm-merge-arrow';
  return (
    <svg viewBox={viewBox} role="img" aria-label="레이어마다 렌더 오브젝트를 두는 방식과 앞뒤 두 메시로 병합하는 방식 비교">
      <CMVizArrow id={arrow} />
      {side !== 'after' && <g>
        <text x="34" y="34" className="cm-viz-kicker">BEFORE · OBJECT PER LAYER</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(${50 + (i % 3) * 132} ${76 + Math.floor(i / 3) * 105})`}>
            <path d="M0 20 L70 0 L108 35 L78 72 L12 63 Z" className="cm-viz-mesh old" />
            <rect x="77" y="55" width="44" height="24" rx="2" className="cm-viz-object" />
            <text x="99" y="71" textAnchor="middle" className="cm-viz-mini">GO</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={100 + (i % 3) * 132} y1={172 + Math.floor(i / 3) * 105} x2="474" y2={150 + i * 24} className="cm-viz-submit" />)}
        <rect x="464" y="125" width="76" height="174" rx="4" className="cm-viz-queue" />
        <text x="502" y="213" textAnchor="middle" className="cm-viz-label vertical">DRAW</text>
        <text x="258" y="342" textAnchor="middle" className="cm-viz-label">레이어 수만큼 Object · 제출</text>
      </g>}
      {!side && <line x1="548" x2="632" y1="210" y2="210" className="cm-viz-arrow" markerEnd={'url(#' + arrow + ')'} />}
      {side !== 'before' && <g>
        <text x="594" y="34" className="cm-viz-kicker good">AFTER · TWO FACE BUFFERS</text>
        <path d="M660 112 L785 76 L865 142 L812 220 L683 205 Z" className="cm-viz-mesh front" />
        <path d="M694 164 L820 128 L900 194 L846 272 L717 257 Z" className="cm-viz-mesh back" />
        <text x="750" y="95" className="cm-viz-face">FRONT</text>
        <text x="816" y="250" className="cm-viz-face">BACK</text>
        <line x1="888" x2="954" y1="210" y2="210" className="cm-viz-arrow good" markerEnd={'url(#' + arrow + ')'} />
        <text x="786" y="342" textAnchor="middle" className="cm-viz-label good">z에 쌓임 순서 · renderer 2개 고정</text>
      </g>}
      {!side && <text x="500" y="375" textAnchor="middle" className="cm-viz-caption">{method.metric.detail} · {method.metric.label}</text>}
    </svg>
  );
}

function CMNativeVisual({ method, viewBox = '0 0 1000 410', side }) {
  const arrow = 'cm-native-arrow';
  return (
    <svg viewBox={viewBox} role="img" aria-label="매 프레임 관리형 객체 그래프 생성과 재사용 NativeArray Job 파이프라인 비교">
      <CMVizArrow id={arrow} />
      {side !== 'after' && <g>
        <text x="34" y="34" className="cm-viz-kicker">BEFORE · MANAGED PREVIEW EACH FRAME</text>
        {[0, 1, 2].map((frame) => (
          <g key={frame} transform={`translate(${48 + frame * 138} 86)`}>
            <text x="51" y="0" textAnchor="middle" className="cm-viz-note">frame {frame + 1}</text>
            <rect x="0" y="18" width="102" height="40" rx="3" className="cm-viz-managed" />
            <rect x="8" y="66" width="86" height="34" rx="3" className="cm-viz-managed" />
            <rect x="18" y="108" width="66" height="30" rx="3" className="cm-viz-managed" />
            <text x="51" y="43" textAnchor="middle" className="cm-viz-mini">PaperData</text>
            <text x="51" y="88" textAnchor="middle" className="cm-viz-mini">PaperLayer</text>
            <text x="51" y="128" textAnchor="middle" className="cm-viz-mini">List</text>
          </g>
        ))}
        <path d="M62 274 h342" className="cm-viz-gc-line" />
        <text x="233" y="304" textAnchor="middle" className="cm-viz-label">분할 · Compose · 객체 생성이 한 경로</text>
      </g>}
      {side !== 'before' && <g>
        <text x="516" y="34" className="cm-viz-kicker good">AFTER · SCHEDULE → WORK → COMPLETE</text>
        <line x1="536" x2="938" y1="112" y2="112" className="cm-viz-timeline" markerEnd={'url(#' + arrow + ')'} />
        <circle cx="570" cy="112" r="8" className="cm-curve-dot structure" />
        <circle cx="814" cy="112" r="8" className="cm-curve-dot native" />
        <circle cx="918" cy="112" r="8" className="cm-curve-dot base" />
        <text x="570" y="86" textAnchor="middle" className="cm-viz-label">SimTick</text>
        <text x="814" y="86" textAnchor="middle" className="cm-viz-label">RenderTick</text>
        <text x="918" y="86" textAnchor="middle" className="cm-viz-label">Confirm</text>
        <rect x="582" y="132" width="220" height="45" rx="22" className="cm-viz-worker" />
        <text x="692" y="160" textAnchor="middle" className="cm-viz-label good">worker execution window</text>
        <text x="570" y="202" textAnchor="middle" className="cm-viz-note">선 3값 · Schedule</text>
        <text x="814" y="202" textAnchor="middle" className="cm-viz-note">Complete · Sync</text>
        <text x="918" y="202" textAnchor="middle" className="cm-viz-note">Marshal</text>
        <rect x="548" y="242" width="374" height="64" rx="4" className="cm-viz-native-buffer" />
        <rect x="566" y="258" width="92" height="32" rx="3" className="cm-viz-buffer-cell" />
        <rect x="670" y="258" width="110" height="32" rx="3" className="cm-viz-buffer-cell" />
        <rect x="792" y="258" width="112" height="32" rx="3" className="cm-viz-buffer-cell" />
        <text x="735" y="338" textAnchor="middle" className="cm-viz-label good">접기당 한 번 올린 NativeArray를 매 프레임 재사용</text>
      </g>}
      {!side && <text x="500" y="386" textAnchor="middle" className="cm-viz-caption">{method.metric.detail} · {method.metric.label} · {method.metric.value}</text>}
    </svg>
  );
}

function CMPageMethodViz({ method }) {
  const narrow = useCMNarrow();
  const Visual = {
    reuse: CMReuseVisual,
    prune: CMPruneVisual,
    merge: CMMergeVisual,
    native: CMNativeVisual,
  }[method.id];

  if (!Visual) return null;
  const mobileViews = {
    reuse: ['0 0 530 390', '500 0 500 390'],
    prune: ['0 0 560 390', '540 0 460 390'],
    merge: ['0 0 620 390', '580 0 420 390'],
    native: ['0 0 500 410', '500 0 500 410'],
  }[method.id];
  return (
    <figure className={'cm-page-method-viz method-' + method.id + (narrow ? ' is-mobile' : ' cm-visual-scroll')}>
      {narrow ? (
        <div className="cm-page-method-mobile">
          <div><Visual method={method} viewBox={mobileViews[0]} side="before" /></div>
          <div><Visual method={method} viewBox={mobileViews[1]} side="after" /></div>
        </div>
      ) : <Visual method={method} />}
      <figcaption>
        <span>{method.before.footer}</span>
        <b aria-hidden="true">→</b>
        <span>{method.after.footer}</span>
      </figcaption>
    </figure>
  );
}
window.CMPageMethodViz = CMPageMethodViz;
