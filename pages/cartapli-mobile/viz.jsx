(function defineCartapliMobileVisuals() {
  const RI = (value) => window.renderInline ? window.renderInline(value) : value;

  function CMCondition({ children, compact = false }) {
    return <p className={'cm-condition' + (compact ? ' is-compact' : '')}>{RI(children)}</p>;
  }

  function CMArchitectureMap({ data }) {
    const get = (id) => data.components.find((item) => item.id === id);
    const Sequence = ({ label, repeat, items }) => (
      <section className="cm-arch-sequence">
        <header><span>{label}</span>{repeat && <b>{repeat}</b>}</header>
        <ol>
          {items.map((item, index) => <li key={item}><strong>{item}</strong>{index < items.length - 1 && <i aria-hidden="true">→</i>}</li>)}
        </ol>
      </section>
    );
    return (
      <figure className="cm-figure cm-game-arch" aria-labelledby="cm-game-arch-cap">
        <header>
          <span>RESPONSIBILITY + CALL ORDER</span>
          <strong>{data.premise}</strong>
        </header>
        <div className="cm-arch-contract">
          <article className="cm-arch-owner"><span>ORDER OWNER</span><strong>{get('battle').name}</strong><small>{get('battle').role}</small></article>
          <div className="cm-arch-owns" aria-hidden="true"><i></i><b>한 프레임의 호출 순서</b></div>
          <div className="cm-arch-components">
            {['paper', 'surface', 'movement', 'geometry'].map((id, index) => <React.Fragment key={id}><article><span>{get(id).name}</span><strong>{['접기 확정', '위치 재해석', '이동 · 적분', '기하 질의 · 판정'][index]}</strong></article>{index < 3 && <i aria-hidden="true">→</i>}</React.Fragment>)}
          </div>
        </div>
        <div className="cm-arch-orders">
          <Sequence label="가변 프레임" items={data.execution.variable} />
          <Sequence label="고정 스텝" repeat="0~3×" items={data.execution.fixed} />
        </div>
        <figcaption id="cm-game-arch-cap">BattleSimulation이 종이 변화부터 위치 확정까지 호출 순서를 소유한다. 고정 스텝 내부의 Pull·Push는 이동 전후 위치를 연결한다.</figcaption>
      </figure>
    );
  }

  function CMExecutionFlow({ steps }) {
    return (
      <figure className="cm-figure cm-frame-flow" aria-labelledby="cm-execution-cap">
        <header><strong>FRAME N</strong><span>프레임 시작</span><i aria-hidden="true"></i><span>표현이 읽기 전</span></header>
        <ol className="cm-frame-flow__lanes">
          {steps.map((step) => (
            <li className={`is-step-${step.no}`} key={step.no}>
              <header><span>{step.no}</span><b>{step.lane}</b><strong>{step.title}</strong></header>
              <ol>
                {step.items.map((item, index) => <li key={item}><span>{item}</span>{index < step.items.length - 1 && <i aria-hidden="true">→</i>}</li>)}
              </ol>
            </li>
          ))}
        </ol>
        <figcaption id="cm-execution-cap">하나의 Frame N 안에서 접기와 위치 재해석을 먼저 처리하고, 이동·적분·기하 판정을 고정 스텝으로 0~3회 반복한다.</figcaption>
      </figure>
    );
  }

  function CMPaperPipeline({ data }) {
    const preview = [
      { title: 'Snapshot → Split', detail: '확정 입력 분할' },
      { title: '쌓임 · Bounds → Upload', detail: '결과 구성·전송' },
      { title: '상태 렌더링', detail: '앞·뒤 두 메시' },
    ];
    const confirm = [
      { title: '접기 확정 요청', detail: '현재 모양 완료' },
      { title: 'Advance → Bake → Rebind', detail: '새 Snapshot 저장' },
      { title: 'Buried 예약', detail: '큰 판정만 전달' },
    ];
    return (
      <figure className="cm-figure cm-paper-pipeline" aria-labelledby="cm-paper-pipeline-cap">
        <header><span>PAPER PIPELINE · BIG PICTURE</span><strong>{data.title}</strong><p>{data.intro}</p></header>
        <div className="cm-thread-timeline">
          <div className="cm-thread-timeline__ticks"><span>CURRENT TICK</span><i></i><span>LATER TICK</span></div>
          <section className="is-main is-preview"><header><span>MAIN · PREVIEW</span><strong>현재 상태 계산·표현</strong></header><ol>{preview.map((item, index) => <li key={item.title}><strong>{item.title}</strong><small>{item.detail}</small>{index < preview.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol></section>
          <div className="cm-thread-timeline__event"><b>USER INPUT</b><span>접기 확정 요청</span></div>
          <section className="is-main is-confirm"><header><span>MAIN · CONFIRM</span><strong>확정 상태 저장·재연결</strong></header><ol>{confirm.map((item, index) => <li key={item.title}><strong>{item.title}</strong><small>{item.detail}</small>{index < confirm.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol></section>
          <div className="cm-thread-timeline__handoff"><b>Buried만 워커로</b><span>큰 판정을 예약</span><i aria-hidden="true">↓</i><em>메인은 기다리지 않고 반환</em></div>
          <section className="is-worker"><header><span>WORKER</span><strong>다음 입력을 줄이는 판정</strong></header><ol>{data.worker.map((item, index) => <li key={item.title}><strong>{item.title}</strong><small>{item.detail}</small>{index < data.worker.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol></section>
          <div className="cm-thread-timeline__harvest"><span>완료 확인</span><i aria-hidden="true">↑</i><b>끝난 이후 틱에서만 수확 → 다음 Snapshot 입력</b></div>
        </div>
        <figcaption id="cm-paper-pipeline-cap">미리보기·표현 루프와 접기 확정 이벤트는 별개다. 확정 요청은 메인에서 새 상태를 저장·재연결한 뒤 파묻힘 판정만 워커에 보내고, 완료된 이후 틱에 결과를 수확한다.</figcaption>
      </figure>
    );
  }

  function CMPlacementOverview({ data }) {
    return (
      <figure className="cm-figure cm-placement-overview" aria-labelledby="cm-placement-overview-cap">
        <header><span>EXECUTION PLACEMENT · DECISION</span><strong>{data.title}</strong></header>
        <div className="cm-placement-matrix" role="img" aria-label="작고 같은 프레임에 결과가 필요한 Split은 메인, 크고 한 틱 미룰 수 있는 파묻힘 판정은 워커에 배치">
          <span className="cm-placement-matrix__axis is-size">작업 크기 ↑</span><span className="cm-placement-matrix__axis is-deadline">결과 마감 →</span>
          <article className="is-main"><span>작음 · 같은 프레임 필요</span><strong>Split → Main Burst Run</strong><b>{data.main.result} · {data.main.detail}</b><small>{data.main.condition}</small></article>
          <article className="is-worker"><span>큼 · 한 틱 지연 가능</span><strong>Buried → Worker 예약</strong><b>{data.worker.result} · {data.worker.detail}</b><small>{data.worker.condition}</small></article>
        </div>
        <div className="cm-placement-routes"><p><b>MAIN</b> Snapshot → Burst Run → Native upload → Render</p><p><b>WORKER</b> Confirm → Schedule & return ⇢ later tick harvest</p></div>
        <CMCondition compact>{data.condition}</CMCondition>
        <figcaption id="cm-placement-overview-cap">{data.caption}</figcaption>
      </figure>
    );
  }

  function CMMarkerMap({ data }) {
    return (
      <figure className="cm-figure cm-marker-map" aria-labelledby="cm-marker-map-cap">
        <header><span>MEASUREMENT MAP</span><strong>{data.title}</strong></header>
        <div className="cm-marker-map__path" aria-label="종이 프레임 경로에서 주요 측정 마커의 위치">
          {data.path.map((item, index) => (
            <React.Fragment key={item.key}>
              <article><strong>{item.title}</strong>{item.markers.map((marker) => {
                const match = data.items.find((row) => marker.includes(row.position) || row.marker.includes(marker.split(' · ')[0]));
                return <span key={marker}><b>{marker}</b>{match && <small>{match.detail}</small>}</span>;
              })}</article>
              {index < data.path.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>
        <figcaption id="cm-marker-map-cap">0.643→0.026ms는 위의 네 마커 전체가 아니라 Split + Compose + Renderer.Sync의 프레임당 Average를 추적한 값이다. Bounds는 별도 진단값으로 본다.</figcaption>
      </figure>
    );
  }

  function CMBenchmarkOverview({ data }) {
    return (
      <section className="cm-benchmark-overview" aria-label="벤치 장면과 측정 축">
        <dl className="cm-benchmark-overview__facts">
          {data.facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className="cm-benchmark-overview__axes" role="table" aria-label="측정 축과 방법">
          <div className="is-head" role="row"><span role="columnheader">측정 축</span><span role="columnheader">무엇을 봤는가</span><span role="columnheader">어떻게 비교했는가</span></div>
          {data.axes.map((axis) => <div role="row" key={axis.label}><b role="cell">{axis.label}</b><strong role="cell">{axis.target}</strong><span role="cell">{axis.method}</span></div>)}
        </div>
      </section>
    );
  }

  function CMDetailIndex({ items }) {
    return (
      <nav className="cm-detail-index" aria-label="단계 변화의 상세 설명 위치">
        <strong>아래에서 같은 순서로 상세 설명</strong>
        <ol>{items.map((item) => <li key={item.no}><span>§ {item.no}</span><b>{item.title}</b><small>{item.detail}</small></li>)}</ol>
      </nav>
    );
  }

  function CMMeasurementScope({ data }) {
    return (
      <aside className="cm-measure-scope" aria-label="측정 환경과 해석 한계">
        <header><span>INTERPRETATION LIMIT</span><strong>이 결과의 해석 경계</strong></header>
        <div className="cm-measure-scope__limits"><ul>{data.limits.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div>
      </aside>
    );
  }

  function CMSectionContext({ data }) {
    const nodes = [
      ['snapshot', 'Snapshot'], ['split', 'Split'], ['compose', '쌓임·Bounds'], ['upload', 'Native 업로드'],
      ['render', '렌더링'], ['confirm', '접기 확정'], ['worker', 'Worker'],
    ];
    const active = new Map(data.active.map((item) => [item.key, item]));
    return (
      <aside className="cm-section-context" aria-label={`${data.title}의 전체 파이프라인 위치`}>
        <header><span>WHERE · WHY</span><strong>{data.title}</strong><p>{data.problem}</p></header>
        <ol>
          {nodes.map(([key, label], index) => {
            const item = active.get(key);
            return (
              <li className={item ? `is-active${item.tone ? ` is-${item.tone}` : ''}` : ''} key={key}>
                <span>{label}</span>{item && <React.Fragment><b>{item.label}</b><small>{item.detail}</small></React.Fragment>}
                {index < nodes.length - 1 && <i aria-hidden="true">→</i>}
              </li>
            );
          })}
        </ol>
      </aside>
    );
  }

  function CMValidationFlow({ steps }) {
    return (
      <figure className="cm-figure cm-validation-flow" aria-labelledby="cm-validation-flow-cap">
        <header><span>MEASUREMENT HISTORY</span><strong>측정 결과를 믿을 수 있게 만든 순서</strong></header>
        <ol>
          {steps.map((step, index) => (
            <li key={step.no}>
              <span>{step.no}</span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
              {index < steps.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
        <figcaption id="cm-validation-flow-cap">측정 오염을 발견한 뒤 옛 결과를 버리고 동일 입력으로 재측정했으며, 후기에는 프레임과 이벤트 축을 분리했다.</figcaption>
      </figure>
    );
  }

  function CMStageChart({ stages, headline, stageNote }) {
    const chart = (items, options = {}) => {
      const width = 1000;
      const plot = { left: 64, right: 956, top: 44, bottom: 238 };
      const maxY = options.maxY || 0.7;
      const x = (index) => plot.left + ((plot.right - plot.left) / Math.max(1, items.length - 1)) * index;
      const y = (value) => plot.bottom - (value / maxY) * (plot.bottom - plot.top);
      const points = items.map((item, index) => [x(index), y(item.value)]);
      const line = points.map(([px, py]) => `${px},${py}`).join(' ');
      const ticks = options.ticks || [0.6, 0.4, 0.2, 0];
      return (
        <svg viewBox={`0 0 ${width} 310`} role="img" aria-label={options.label}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={plot.left} x2={plot.right} y1={y(tick)} y2={y(tick)} className="cm-stage-grid" />
              <text x={plot.left - 12} y={y(tick) + 4} textAnchor="end" className="cm-stage-axis">{tick.toFixed(2)}</text>
            </g>
          ))}
          <polyline points={line} className="cm-stage-line" />
          {items.map((item, index) => {
            const [px, py] = points[index];
            const endpoint = index === 0 || index === items.length - 1;
            return (
              <g key={item.stage}>
                <line x1={px} x2={px} y1={py} y2={plot.bottom} className="cm-stage-stem" />
                <circle cx={px} cy={py} r={endpoint ? 7 : 5} className={`cm-stage-dot${endpoint ? ' is-end' : ''}${item.kind ? ` is-${item.kind}` : ''}`} />
                <text x={px} y={Math.max(18, py - 14)} textAnchor="middle" className="cm-stage-value">{item.displayValue || item.value.toFixed(3)}</text>
                <text x={px} y={plot.bottom + 23} textAnchor="middle" className="cm-stage-label">
                  {item.axis.map((line, lineIndex) => (
                    <tspan key={line} x={px} dy={lineIndex === 0 ? 0 : 15}>{line}</tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      );
    };
    return (
      <figure className="cm-figure cm-stage-chart" aria-labelledby="cm-stage-cap">
        <header className="cm-stage-chart__head">
          <div><span>종이 프레임 경로 측정 비용</span><strong>{headline.value}</strong><b>{headline.detail}</b></div>
          <span>점의 높이 = 프레임당 Average · ms</span>
        </header>
        <div className="cm-stage-chart__scroll">
          {chart(stages, { label: '기준선부터 최종 상태까지 종이 프레임 경로 측정 비용의 대표 전환점 그래프' })}
        </div>
        <div className="cm-stage-mobile" aria-label="모바일 전체 변화 점 경로">
          {stages.map((item, index) => <article className={`is-${item.kind || (index === 0 ? 'baseline' : 'step')}`} key={item.stage}>
            <i aria-hidden="true"><b></b></i><span>{item.label}</span><strong>{item.displayValue || item.value.toFixed(3)}ms</strong>
          </article>)}
        </div>
        <p className="cm-figure-note">{stageNote}</p>
        <figcaption id="cm-stage-cap">Windows PC · Unity Editor PlayMode · Split + Compose + Renderer.Sync · Bounds와 Worker 본문 제외</figcaption>
      </figure>
    );
  }

  function CMChangeMap({ items }) {
    const icon = (key, label) => {
      if (key === 'reuse') return (
        <svg viewBox="0 0 150 74" role="img" aria-label={label}>
          <rect x="54" y="19" width="42" height="36" rx="3" className="cm-change-map__node" />
          <path d="M8 23 H36 Q43 23 43 31 V43 Q43 51 51 51 H136" className="cm-change-map__fork" />
          <path d="M9 16 l24 -7 13 8 -24 8 z" className="cm-change-map__good" />
          <path d="M108 44 l24 -7 13 8 -24 8 z" className="cm-change-map__good" />
        </svg>
      );
      if (key === 'cull') return (
        <svg viewBox="0 0 150 74" role="img" aria-label={label}>
          <path d="M10 54 l38 -11 21 10 -38 12 z M14 40 l38 -11 21 10 -38 12 z M18 26 l38 -11 21 10 -38 12 z" className="cm-change-map__old" />
          <path d="M25 31 L58 57 M58 31 L25 57" className="cm-change-map__cut" />
          <path d="M82 38 H105" className="cm-change-map__arrow" />
          <path d="M110 46 l28 -8 12 7 -28 9 z" className="cm-change-map__good" />
        </svg>
      );
      if (key === 'batch') return (
        <svg viewBox="0 0 150 74" role="img" aria-label={label}>
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={8 + (i % 3) * 19} y={22 + Math.floor(i / 3) * 19} width="13" height="12" className="cm-change-map__object" />)}
          <path d="M72 38 H96" className="cm-change-map__arrow" />
          <path d="M101 25 l30 -9 17 13 -13 27 -32 -7 z" className="cm-change-map__good" />
          <path d="M106 38 l28 -8 13 11 -10 20 -29 -5 z" className="cm-change-map__new" />
        </svg>
      );
      if (key === 'native') return (
        <svg viewBox="0 0 150 74" role="img" aria-label={label}>
          <rect x="6" y="25" width="34" height="24" className="cm-change-map__node" />
          <rect x="58" y="25" width="34" height="24" className="cm-change-map__node is-core" />
          <rect x="110" y="25" width="34" height="24" className="cm-change-map__node" />
          <path d="M40 37 H58 M92 37 H110" className="cm-change-map__arrow" />
        </svg>
      );
      return (
        <svg viewBox="0 0 150 74" role="img" aria-label={label}>
          <circle cx="20" cy="37" r="9" className="cm-change-map__node is-core" />
          <path d="M29 37 H55 M55 37 V20 H104 M55 37 V55 H104" className="cm-change-map__fork" />
          <rect x="104" y="10" width="38" height="20" className="cm-change-map__good" />
          <rect x="104" y="45" width="38" height="20" className="cm-change-map__worker" />
        </svg>
      );
    };
    return (
      <figure className="cm-figure cm-change-map" aria-labelledby="cm-change-map-cap">
        <header><span>FIVE DECISIONS · DETAIL ROADMAP</span><strong>전체 변화를 만든 다섯 가지 핵심 변경</strong></header>
        <ol>
          {items.map((item) => (
            <li key={item.key}>
              <span>{item.no}</span>
              {icon(item.key, item.title)}
              <h3>{item.title}</h3>
              <b>{item.result}</b>
            </li>
          ))}
        </ol>
        <figcaption id="cm-change-map-cap">§03은 1–3, §04는 4, §05는 5의 구조와 구현 코드를 같은 순서로 설명한다.</figcaption>
      </figure>
    );
  }

  function CMConfirmInset({ data }) {
    return (
      <aside className="cm-confirm-inset" aria-label={data.title}>
        <span>별도 이벤트 축</span>
        <h3>{data.title}</h3>
        <div><b>{data.before}</b><i aria-hidden="true">→</i><strong>{data.after}</strong></div>
        <CMCondition compact>{data.condition}</CMCondition>
        <p>{data.note}</p>
      </aside>
    );
  }

  function CMStructuralModel({ steps, condition }) {
    const captionId = `cm-structural-cap-${steps.map((step) => step.key.toLowerCase()).join('-')}`;
    const Layer = ({ x, y, tone = '' }) => <path d={`M${x} ${y} l92 -14 42 28 -92 16 z`} className={`cm-structure-layer ${tone}`} />;
    const visual = (step) => {
      if (step.key === 'REUSE') return (
        <svg viewBox="0 18 320 160" role="img" aria-label="변하지 않은 레이어 전체 재생성과 원본 참조 재사용 비교">
          {[0, 1, 2, 3].map((i) => <Layer key={`rb${i}`} x={20 + i * 8} y={112 - i * 23} tone="is-old" />)}
          <path d="M145 92 H178" className="cm-structure-arrow" />
          {[0, 1, 2].map((i) => <Layer key={`ra${i}`} x={174 + i * 5} y={112 - i * 23} tone="is-kept" />)}
          <path d="M224 46 l48 -8 22 15 -20 8 -18 25 -36 -13 z" className="cm-structure-layer is-new" />
          <text x="241" y="31" className="cm-structure-state is-good">통과</text>
          <text x="68" y="158" className="cm-structure-caption">전량 재생성</text>
          <text x="241" y="158" className="cm-structure-caption is-good">원본 유지 + 교차만 생성</text>
        </svg>
      );
      if (step.key === 'PRUNE') return (
        <svg viewBox="0 18 320 160" role="img" aria-label="파묻힌 레이어를 유지하는 구조와 제거한 구조 비교">
          {[0, 1, 2, 3, 4].map((i) => <Layer key={`pb${i}`} x={14 + i * 7} y={124 - i * 21} tone={i === 1 || i === 2 ? 'is-buried' : 'is-old'} />)}
          <path d="M45 87 L122 132 M122 87 L45 132" className="cm-structure-cross" />
          <text x="83" y="39" className="cm-structure-state is-cut">제거</text>
          <path d="M145 92 H178" className="cm-structure-arrow" />
          {[0, 1, 2].map((i) => <Layer key={`pa${i}`} x={174 + i * 5} y={116 - i * 27} tone="is-kept" />)}
          <text x="70" y="158" className="cm-structure-caption">337 layers</text>
          <text x="241" y="158" className="cm-structure-caption is-good">57 → 38 layers</text>
        </svg>
      );
      return (
        <svg viewBox="0 18 320 160" role="img" aria-label="레이어별 렌더 오브젝트와 앞뒤 두 메시 병합 비교">
          {[0, 1, 2, 3, 4, 5].map((i) => <g key={`mb${i}`} transform={`translate(${16 + (i % 3) * 40} ${44 + Math.floor(i / 3) * 48})`}><path d="M0 11 l22 -8 15 12 -10 18 -25 -5 z" className="cm-structure-object" /><rect x="24" y="23" width="13" height="10" className="cm-structure-go" /></g>)}
          <path d="M145 92 H178" className="cm-structure-arrow" />
          <path d="M192 69 l66 -24 42 31 -31 52 -68 -14 z" className="cm-structure-mesh is-front" />
          <path d="M207 92 l66 -24 32 29 -24 47 -65 -10 z" className="cm-structure-mesh is-back" />
          <text x="246" y="38" className="cm-structure-state is-good">2 MESHES</text>
          <text x="69" y="158" className="cm-structure-caption">337 objects · +298</text>
          <text x="244" y="158" className="cm-structure-caption is-good">2 meshes · +1</text>
        </svg>
      );
    };
    return (
      <figure className={`cm-figure cm-structural${steps.length === 1 ? ' is-single' : ''}`} aria-labelledby={captionId}>
        <ol>
          {steps.map((step, index) => (
            <li key={step.key}>
              <header><span>{step.no} · {step.key}</span><strong>{step.title}</strong></header>
              <div className="cm-structural__visual">{visual(step)}</div>
              <p><b>{step.before}</b><i aria-hidden="true">→</i><strong>{step.after}</strong></p>
              {index < steps.length - 1 && <div className="cm-structural__handoff" aria-hidden="true">줄어든 입력을 다음 단계로 ↓</div>}
            </li>
          ))}
        </ol>
        {condition && <CMCondition>{condition}</CMCondition>}
        <figcaption id={captionId}>{steps.length === 1 ? steps[0].effect : '같은 종이 스택을 재사용하고, 보이지 않는 레이어를 입력에서 빼고, 남은 조각을 앞·뒤 두 메시로 병합한 구조 변화.'}</figcaption>
      </figure>
    );
  }

  function CMNativeFlow({ items }) {
    return (
      <figure className="cm-figure cm-native-flow" aria-labelledby="cm-native-flow-cap">
        <ol>
          {items.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
              {index < items.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
        <figcaption id="cm-native-flow-cap">Persistent Native 입력이 동일 Burst 분할 본문과 Bounds 출력을 거쳐 Native 메시 버퍼로 직접 흐른다.</figcaption>
      </figure>
    );
  }

  function CMNativeUnification({ rows }) {
    return (
      <div className="cm-native-unification" role="table" aria-label="관리형 왕복과 재순회를 제거한 Native 단일 경로">
        <div className="is-head" role="row"><span role="columnheader">지점</span><span role="columnheader">이전</span><span role="columnheader">현재 Native 경로</span></div>
        {rows.map((row) => (
          <div role="row" key={row.subject}>
            <b role="cell">{row.subject}</b>
            <span role="cell">{row.before}</span>
            <i aria-hidden="true">→</i>
            <strong role="cell">{row.after}</strong>
          </div>
        ))}
      </div>
    );
  }

  function CMSplitSequence({ sequences }) {
    return (
      <figure className="cm-figure cm-sequence" aria-labelledby="cm-sequence-cap">
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
        <figcaption id="cm-sequence-cap">위 워커 경로는 비동기 최종안이 아니라, Split 결과를 같은 프레임 Render가 써야 해 Complete에서 동기화하던 이전 대조군이다.</figcaption>
      </figure>
    );
  }

  function CMPairedBars({ title, before, after, delta, condition }) {
    const max = Math.max(before, after);
    const rows = [
      ['Worker Schedule', before, 'before'],
      ['Main Run', after, 'after'],
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
        {condition && <CMCondition compact>{condition}</CMCondition>}
      </figure>
    );
  }

  function CMDiagnostics({ items }) {
    return (
      <div className="cm-diagnostics-wrap">
        <div className="cm-diagnostics">
          {items.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <div><b>{item.before}</b><i aria-hidden="true">→</i><strong>{item.after}</strong></div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  function CMPlacementResults({ split, buried }) {
    return (
      <div className="cm-placement-results" aria-label="실행 위치 선택 결과">
        <article className="is-main"><span>작은 Split · Main Burst Run</span><strong>{split.delta}</strong><b>{split.before.toFixed(4)} → {split.after.toFixed(4)}ms</b></article>
        <article className="is-worker"><span>큰 Buried · Worker 예약</span><strong>{buried.worker} vs {buried.main}<em>{buried.unit}</em></strong><b>접기 확정 프레임 중앙값 · 최대 44.0 vs 492.3µs</b></article>
        <p><span><b>Split</b>{split.resultCondition}</span><span><b>Buried</b>{buried.resultCondition}</span></p>
      </div>
    );
  }

  function CMPlacementTimeline({ data }) {
    return (
      <figure className="cm-figure cm-placement-timeline" aria-labelledby="cm-placement-timeline-cap">
        <header><span>ONE NATIVE PIPELINE · TWO DEADLINES</span><strong>결과가 필요한 시점에 따라 실행 위치를 나눴다</strong></header>
        <div className="cm-placement-timeline__lane is-main">
          <b>MAIN · 매 프레임</b>
          {['Snapshot', 'Burst Split Run', '쌓임 · Bounds', 'Native upload', 'Render'].map((item, index) => <React.Fragment key={item}><span>{item}</span>{index < 4 && <i aria-hidden="true">→</i>}</React.Fragment>)}
        </div>
        <div className="cm-placement-timeline__event"><b>접기 확정</b><span>새 Snapshot 저장</span><i aria-hidden="true">↓</i><em>Schedule · return</em></div>
        <div className="cm-placement-timeline__lane is-worker">
          <b>WORKER · 이후 틱</b><span>Buried 판정</span><i aria-hidden="true">⇢</i><span>완료 확인</span><i aria-hidden="true">→</i><span>수확 · 압축</span>
        </div>
        <figcaption id="cm-placement-timeline-cap">Split은 같은 프레임 Render 전에 필요해 메인에서 실행하고, Buried는 다음 입력 전까지만 필요해 예약 후 반환한다.</figcaption>
      </figure>
    );
  }

  function CMOwnership({ items }) {
    return (
      <figure className="cm-figure cm-ownership" aria-labelledby="cm-ownership-cap">
        <div className="cm-ownership__chain">
          {items.map((item, index) => (
            <React.Fragment key={item.title}>
              <article>
                <span>{item.relation}</span>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
              {index < items.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>
        <figcaption id="cm-ownership-cap">Ring이 Snapshot 수명을 소유하고 파이프라인은 현재 슬롯을 빌린다. 소유권과 실행 시간 흐름은 분리한다.</figcaption>
      </figure>
    );
  }

  function CMConfirmTimeline({ ticks }) {
    return (
      <figure className="cm-figure cm-timeline" aria-labelledby="cm-timeline-cap">
        <div className="cm-timeline__axis"><span>tick N</span><i></i><span>tick N+1 이후</span></div>
        <div className="cm-timeline__ticks">
          {ticks.map((tick, index) => (
            <article key={tick.tick}>
              <header><span>{String(index + 1).padStart(2, '0')}</span><strong>{tick.tick}</strong></header>
              <ol>{tick.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            </article>
          ))}
        </div>
        <div className="cm-timeline__worker"><span>worker solve</span><i aria-hidden="true">예약 ───────── 수확</i></div>
        <figcaption id="cm-timeline-cap">접기 확정 순간에는 판정을 예약만 한다. 이후 시뮬레이션 틱에서 완료 여부를 확인하고, 끝났을 때만 수확·압축·재연결한다.</figcaption>
      </figure>
    );
  }

  function CMAsyncFlow({ data }) {
    return (
      <figure className="cm-figure cm-async-flow" aria-labelledby="cm-async-flow-cap">
        <header><span>ASYNC BIG PICTURE</span><strong>{data.title}</strong></header>
        <ol className="cm-async-flow__steps">
          {data.steps.map((step, index) => (
            <li className={'is-step-' + (index + 1)} key={step.title}>
              <span>{step.tag}</span><strong>{step.title}</strong><p>{step.detail}</p>
              {index < data.steps.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
        <div className="cm-async-flow__worker" aria-hidden="true"><span>예약</span><i></i><b>워커 실행 · 메인은 기다리지 않음</b><i></i><span>완료 뒤 수확</span></div>
        <p className="cm-async-flow__ownership"><b>구조적 전제</b>{data.ownership}</p>
        <figcaption id="cm-async-flow-cap">접기 확정에서 워커를 예약한 뒤 즉시 돌아온다. 이후 시뮬레이션 틱은 완료된 경우에만 결과를 수확한다.</figcaption>
      </figure>
    );
  }

  function CMBuriedComparison({ rows, condition }) {
    const max = Math.max(...rows.flatMap((row) => [row.worker, row.main]));
    return (
      <figure className="cm-figure cm-buried-chart" aria-labelledby="cm-buried-cap">
        <header><span></span><b>Worker</b><b>Main Run</b></header>
        {rows.map((row) => (
          <div className="cm-buried-chart__row" key={row.label}>
            <strong>{row.label}</strong>
            <div className="is-worker"><i aria-hidden="true" style={{ '--bar': `${Math.max(5, row.worker / max * 100)}%` }}></i><b>{row.worker.toFixed(1)}{row.unit}</b></div>
            <div className="is-main"><i aria-hidden="true" style={{ '--bar': `${Math.max(5, row.main / max * 100)}%` }}></i><b>{row.main.toFixed(1)}{row.unit}</b></div>
          </div>
        ))}
        {condition && <CMCondition>{condition}</CMCondition>}
        <figcaption id="cm-buried-cap">동일 파묻힘 Burst 잡의 실행 위치 A/B. 비확정 프레임은 동률이고 차이는 확정 이벤트에 집중된다.</figcaption>
      </figure>
    );
  }

  function CMBuriedProfile({ points, summary, condition }) {
    const width = 900;
    const plot = { left: 72, right: 848, top: 38, bottom: 270 };
    const maxY = 500;
    const x = (index) => plot.left + ((plot.right - plot.left) / Math.max(1, points.length - 1)) * index;
    const y = (value) => plot.bottom - (value / maxY) * (plot.bottom - plot.top);
    const line = (key) => points.map((point, index) => `${x(index)},${y(point[key])}`).join(' ');
    const ticks = [500, 400, 300, 200, 100, 0];
    return (
      <figure className="cm-figure cm-buried-profile" aria-labelledby="cm-buried-profile-cap">
        <header>
          <div><span>CONFIRM EVENT · MAIN-THREAD DELAY</span><strong>접기 확정 순간 메인 지연 — Worker 예약 25.5~36.4µs · Main 즉시 실행 26.0~447.9µs</strong></div>
          <div className="cm-buried-profile__legend"><span className="is-worker">Worker 예약 · 채택</span><span className="is-main">Main 즉시 실행 · 대조군</span></div>
        </header>
        <div className="cm-buried-profile__scroll">
          <svg viewBox={`0 0 ${width} 330`} role="img" aria-label="접기 2회에서 16회까지 파묻힘 판정을 워커에 예약한 채택안과 메인에서 즉시 실행한 대조군의 확정 순간 메인 스레드 지연 비교">
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
        <div className="cm-buried-profile__mobile" aria-label="회차별 Worker 예약안과 Main 즉시 실행 대조군 중앙값 비교">
          <div className="cm-profile-mobile-axis"><span>0µs</span><span>250</span><span>500µs</span></div>
          {points.map((point) => <article key={point.round}>
            <b>{point.round}</b>
            <div className="is-worker"><span>채택</span><i style={{ '--point': `${point.worker / 500 * 100}%` }}></i><strong>{point.worker.toFixed(1)}µs</strong></div>
            <div className="is-main"><span>대조</span><i style={{ '--point': `${point.main / 500 * 100}%` }}></i><strong>{point.main.toFixed(1)}µs</strong></div>
          </article>)}
        </div>
        <div className="cm-buried-profile__values" aria-label="회차별 정확한 중앙값">
          {points.map((point) => <span key={point.round}><b>{point.round}</b><i>채택 {point.worker.toFixed(1)}</i><em>대조 {point.main.toFixed(1)}µs</em></span>)}
        </div>
        <p className="cm-buried-profile__summary">{summary}</p>
        {condition && <CMCondition>{condition}</CMCondition>}
        <figcaption id="cm-buried-profile-cap">회차별 3런 중앙값. 비확정 프레임은 20.5 vs 20.2µs로 동률이며, 이 그래프는 워커 본문을 합산한 전체 CPU가 아니라 확정 순간 메인 지연을 비교한다.</figcaption>
      </figure>
    );
  }

  function CMProofStrip({ items }) {
    return (
      <div className="cm-proof-strip">
        {items.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </article>
        ))}
      </div>
    );
  }

  function CMDisclosure({ columns, notes }) {
    return (
      <div className="cm-disclosure">
        <div className="cm-disclosure__columns">
          {columns.map((column) => (
            <article className={'is-' + column.key} key={column.key}>
              <h3>{column.title}</h3>
              <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <ul className="cm-disclosure__notes">{notes.map((note) => <li key={note}>{RI(note)}</li>)}</ul>
      </div>
    );
  }

  // Read-only compatibility for the existing deck. The page uses the richer visuals above.
  function CMPageOptimizationCurve({ bars }) {
    const values = bars.map(([, value]) => value);
    const max = Math.max(...values);
    const points = bars.map(([, value], index) => {
      const x = 52 + index * (896 / Math.max(1, bars.length - 1));
      const y = 242 - (value / max) * 190;
      return [x, y];
    });
    return (
      <figure className="cm-page-curve">
        <svg viewBox="0 0 1000 300" role="img" aria-label="S0에서 S2-i까지 공식 3마커 Average 합 변화">
          <path d="M52 242 H948" stroke="var(--rule-2)" fill="none" />
          <polyline points={points.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="var(--sage-500)" strokeWidth="4" />
          {points.map(([x, y], index) => (
            <g key={bars[index][0]}>
              <circle cx={x} cy={y} r={index === 0 || index === points.length - 1 ? 7 : 5} fill={index === 0 || index === points.length - 1 ? 'var(--terra-400)' : 'var(--sage-500)'} />
              <text x={x} y={Math.max(20, y - 14)} textAnchor="middle" fill="var(--ink)" fontSize="14" fontFamily="var(--font-mono)">{bars[index][1].toFixed(3)}</text>
              <text x={x} y="270" textAnchor="middle" fill="var(--ink-3)" fontSize="12" fontFamily="var(--font-mono)">{bars[index][0]}</text>
            </g>
          ))}
        </svg>
        <figcaption>공식 3마커 Average 합 · {window.CM_DATA?.measurement?.condition || 'Windows PC · Unity Editor PlayMode'}</figcaption>
      </figure>
    );
  }

  function CMPageMethodViz({ method }) {
    const before = method.visual?.before || 'before';
    const after = method.visual?.after || 'after';
    return (
      <figure className="cm-page-method-viz">
        <svg viewBox="0 0 1000 390" role="img" aria-label={`${method.title} 전후 구조 비교`}>
          <rect x="45" y="76" width="380" height="220" rx="8" fill="var(--paper-2)" stroke="var(--rule-2)" />
          <rect x="575" y="76" width="380" height="220" rx="8" fill="var(--sage-50)" stroke="var(--sage-400)" />
          <text x="75" y="118" fill="var(--ink-3)" fontSize="18" fontFamily="var(--font-mono)">BEFORE</text>
          <text x="605" y="118" fill="var(--sage-700)" fontSize="18" fontFamily="var(--font-mono)">AFTER</text>
          <text x="235" y="195" textAnchor="middle" fill="var(--ink)" fontSize="24" fontWeight="600">{before}</text>
          <text x="765" y="195" textAnchor="middle" fill="var(--ink)" fontSize="24" fontWeight="600">{after}</text>
          <path d="M450 186 H550" stroke="var(--terra-400)" strokeWidth="3" />
          <path d="M550 186 l-14 -9 v18 z" fill="var(--terra-400)" />
          <text x="500" y="160" textAnchor="middle" fill="var(--terra-500)" fontSize="16" fontFamily="var(--font-mono)">{method.stage}</text>
        </svg>
        <figcaption><span>{before}</span><i aria-hidden="true">→</i><span>{after}</span></figcaption>
      </figure>
    );
  }

  Object.assign(window, {
    CMCondition,
    CMArchitectureMap,
    CMExecutionFlow,
    CMPaperPipeline,
    CMPlacementOverview,
    CMBenchmarkOverview,
    CMMarkerMap,
    CMDetailIndex,
    CMMeasurementScope,
    CMSectionContext,
    CMValidationFlow,
    CMStageChart,
    CMChangeMap,
    CMConfirmInset,
    CMStructuralModel,
    CMNativeFlow,
    CMNativeUnification,
    CMSplitSequence,
    CMPairedBars,
    CMDiagnostics,
    CMPlacementResults,
    CMPlacementTimeline,
    CMOwnership,
    CMConfirmTimeline,
    CMAsyncFlow,
    CMBuriedComparison,
    CMBuriedProfile,
    CMProofStrip,
    CMDisclosure,
    CMPageOptimizationCurve,
    CMPageMethodViz,
  });
})();
