// pages/deck/cm-slides.jsx
// Cartapli Mobile 제출용 덱의 레이아웃.
//
// 왜 공용 SlideDeck 의 네 레이아웃(cover/columns/step/diagram)을 안 쓰는가:
// 그 넷은 "제목 + 요점 + 그림 한 칸" 틀이라, 한 장이 담을 수 있는 사실이 서넛으로 묶인다.
// 그래서 한 주제가 두세 장으로 늘어지고, 그림은 상자 나열로 떨어지고, 코드는 별도 장으로
// 밀려났다. 제출 덱에서 필요한 건 반대다 — **한 장에 한 주제를 끝까지**.
//
// 그림은 새로 그리지 않는다. 사이트 페이지가 이미 이 프로젝트 전용으로 그려 둔
// CMPageOptimizationCurve · CMPageSimulationDiagram · CMPageMethodViz 를 그대로 마운트한다.
// (읽기 재사용이다. pages/cartapli-mobile/* 는 한 글자도 수정하지 않는다.)
// 코드는 페이지와 같은 AsciiBlock 으로 before/after 를 나란히 둔다 — Prism 하이라이팅 포함.
//
// window.DECK_LAYOUTS 에 등록하면 SlideDeck 이 layout 이름으로 집어 간다.

(function defineCMSlides() {
  const RI = (s) => window.renderInline(s);

  // 절 머리. 페이지의 nb-section-head 와 같은 축(번호 · 제목 · 종류)을 쓴다.
  function Head({ no, title, kind }) {
    return (
      <div className="cmd-head">
        {no && <span className="cmd-head__no">§ {no}</span>}
        <h2 className="cmd-head__title">{RI(title)}</h2>
        {kind && <span className="cmd-head__kind">{kind}</span>}
      </div>
    );
  }

  // ─── 1. 표지 ─────────────────────────────────────────────────────────────
  // 페이지 hero 와 같은 구성: 카피 + 실측 화면 → 측정축 3개 카드 → 역할·환경.
  // 지표 카드가 value/label/detail/note 네 층을 갖기 때문에 %가 조건 없이 서지 않는다.
  function CMDCover({ s }) {
    const m = s.meta;
    return (
      <div className="sl-body cmd-cover">
        <div className="cmd-cover__top">
          <div className="cmd-cover__copy">
            {/* eyebrow 는 상단 크롬(sl-top)이 이미 같은 문자열을 낸다. 여기 또 두지 않는다. */}
            <h1 className="cmd-cover__title">{m.title}</h1>
            <p className="cmd-cover__sub">{RI(m.subtitle)}</p>
            <p className="cmd-cover__core">{RI(m.core)}</p>
            <div className="cmd-links">
              {s.links.map((l) => (
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

        <p className="cmd-axisnote"><b>서로 다른 측정축 3개</b> · 각 퍼센트는 같은 카드 안의 전후 값만 비교</p>
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
        {s.conditions && (
          <p className="cmd-measure">
            <b>측정</b>{s.conditions.map(([, value]) => value).map((v, i) => (
              <React.Fragment key={i}>{i ? ' · ' : ' '}{RI(v)}</React.Fragment>
            ))}
          </p>
        )}
        <p className="cmd-boundary">{RI(m.boundary)}</p>
        <div className="cmd-pills">
          {m.facts.map((f) => <span key={f}>{f}</span>)}
        </div>
      </div>
    );
  }

  // ─── 2. 계측 결과 ────────────────────────────────────────────────────────
  // 선 그래프가 주인공. 아래에 계측 정정 · 조건표 · 축별 중간값을 한 화면에 붙인다.
  // 중간값(337 → 77 → 2, +298 → +71 → +1)을 여기서 보여야 뒤의 단계 장들이
  // 서로의 기여를 가져가지 않는다.
  function CMDResult({ s }) {
    const r = s.result;
    return (
      <div className="sl-body cmd-result">
        <Head no={s.no} title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(r.gist)}</p>
        <div className="cmd-result__curve">
          <window.CMPageOptimizationCurve bars={r.bars} />
        </div>
        <div className="cmd-result__grid">
          <article className="cmd-correction">
            <span>MEASUREMENT CORRECTION</span>
            <strong>{RI(r.correction.title)}</strong>
            <p>{RI(r.correction.body)}</p>
          </article>
          <dl className="cmd-conditions">
            {r.conditions.map(([k, v]) => (
              <React.Fragment key={k}><dt>{k}</dt><dd>{RI(v)}</dd></React.Fragment>
            ))}
          </dl>
        </div>
        <div className="cmd-axes">
          {r.axes.map(([label, value, note]) => (
            <article key={label}><span>{label}</span><b>{RI(value)}</b><small>{note}</small></article>
          ))}
        </div>
      </div>
    );
  }

  // ─── 3. 실행 구조 ────────────────────────────────────────────────────────
  // 흐름도의 화살표가 실제 호출 순서다. 아래 세 줄이 그 순서를 그렇게 정한 판단.
  //
  // 페이지의 CMPageSimulationDiagram 은 `flowchart TB` 라 세로로 길다(실측 종횡비 0.21).
  // 세로가 1200px 인 슬라이드에 넣으면 높이에 맞춰 21%까지 줄어들고 글자가 5.6px 이 된다.
  // 그래서 이 장만 레인 **안쪽을 가로**로 도는 같은 그래프를 덱에서 만든다.
  // 노드 문구·순서·주기는 전부 data.js 의 lanes/clock 원문이다 — 사실은 그대로다.
  // mermaid 도 안 된다 — subgraph 안의 `direction LR` 은 그 subgraph 가 간선의 끝점이면
  // 무시된다(실측: 여전히 세로, 배율 0.40). 그래서 이 장은 직접 그린다.
  //
  // 상자 나열이 아니다. **가로축이 한 프레임 안의 시간**이다.
  //   · 왼쪽에서 오른쪽이 호출 순서
  //   · 고정 스텝 레인은 대괄호로 묶어 "이 구간만 0~3회 반복"을 폭으로 보인다
  //   · 아래 띠는 Schedule 지점에서 Complete 지점까지 — 작업 스레드가 쓰는 실제 구간
  // 도형·위치·길이를 지우면 이 셋이 전부 사라진다.
  function CMDeckFlowDiagram({ lanes, clock }) {
    const W = 1330, L = 148, R = 1148;
    const rows = [
      { y: 52, tag: 'VARIABLE FRAME', note: lanes[0].note, items: lanes[0].items, tone: 'v' },
      { y: 176, tag: 'FIXED STEP', note: lanes[1].note, items: lanes[1].items, tone: 'f' },
      { y: 340, tag: 'PRESENTATION', note: lanes[2].note, items: lanes[2].items, tone: 'p' },
    ];
    const H = 76, GAP = 13;

    const cards = (row) => {
      const n = row.items.length;
      const w = (R - L - GAP * (n - 1)) / n;
      return row.items.map(([no, title], i) => {
        const x = L + i * (w + GAP);
        return (
          <g key={no}>
            <rect x={x} y={row.y} width={w} height={H} rx="3" className={'cmd-fl-card is-' + row.tone} />
            <text x={x + 12} y={row.y + 21} className="cmd-fl-no">{no}</text>
            <text x={x + 12} y={row.y + 45} className="cmd-fl-title">{title}</text>
            {i < n - 1 && (
              <path d={`M${x + w + 1} ${row.y + H / 2} h${GAP - 3}`} className="cmd-fl-step" markerEnd="url(#cmd-fl-a)" />
            )}
          </g>
        );
      });
    };

    // 고정 스텝 반복 구간을 폭으로 표시하는 대괄호 (FIXED 레인 바로 아래)
    const brace = `M${L} 262 v10 h${R - L} v-10`;
    // 예약~완료는 레인을 가로지르는 구간이다. 가로축(레인 안 순서)으로는 못 그린다 —
    // 오른쪽에 세로 대괄호로 레인 범위를 묶는다.
    const spanTop = rows[0].y, spanBot = rows[2].y + H;
    const SX = 1176;

    return (
      <figure className="cmd-flowchart">
        <svg viewBox={`0 0 ${W} 436`} role="img"
             aria-label="한 프레임 안에서 가변 프레임, 고정 스텝, 화면 반영이 도는 순서와 작업 스레드 실행 구간">
          <defs>
            <marker id="cmd-fl-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="cmd-fl-head" />
            </marker>
          </defs>
          <text x={L} y="24" className="cmd-fl-axis">한 프레임 · 왼쪽에서 오른쪽이 호출 순서</text>
          {rows.map((row) => (
            <g key={row.tag}>
              <text x="0" y={row.y + 22} className={'cmd-fl-lane is-' + row.tone}>{row.tag}</text>
              <text x="0" y={row.y + 44} className="cmd-fl-lanenote">{row.note}</text>
              {cards(row)}
            </g>
          ))}
          <path d={brace} className="cmd-fl-brace" />
          <text x={(L + R) / 2} y="296" textAnchor="middle" className="cmd-fl-repeat">{clock[2]}</text>
          <path d={`M${SX} ${spanTop} h12 v${spanBot - spanTop} h-12`} className="cmd-fl-window" />
          <circle cx={SX + 12} cy={spanTop} r="5" className="cmd-fl-dot" />
          <circle cx={SX + 12} cy={spanBot} r="5" className="cmd-fl-dot" />
          <text x={SX + 24} y={spanTop + 16} className="cmd-fl-wlabel">Schedule</text>
          <text x={SX + 24} y={spanBot - 6} className="cmd-fl-wlabel">Complete</text>
          <text x={SX + 24} y={(spanTop + spanBot) / 2 - 8} className="cmd-fl-wnote">작업 스레드</text>
          <text x={SX + 24} y={(spanTop + spanBot) / 2 + 14} className="cmd-fl-wnote">실행 구간</text>
          <text x={R} y="24" textAnchor="end" className="cmd-fl-clock">{clock[1]}</text>
        </svg>
      </figure>
    );
  }

  function CMDFlow({ s }) {
    const a = s.architecture;
    return (
      <div className="sl-body cmd-flow">
        <Head no={s.no} title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(a.gist)}</p>
        <div className="cmd-flow__art">
          <CMDeckFlowDiagram lanes={a.lanes} clock={a.clock} />
        </div>
        {/* 판단 3줄은 뺐다 — 이 장은 순서를 보여 주는 자리고, 그 판단은 좌표계 장이 받는다. */}
      </div>
    );
  }

  // ─── 3-A. 접기 로직 플로우 ────────────────────────────────────────────────
  // 이 덱에서 "종이접기가 실제로 어떻게 도는가"를 한 장으로 답하는 자리다.
  //   위: 메인 스레드와 워커 스레드 두 수평선. 예약 지점과 완료 지점 사이가 워커 구간이다.
  //   아래: 데이터/시뮬레이션이 만든 것을 뷰가 받아 두 메시로 낸다 — 방향이 한쪽이다.
  // 좌표(위치·길이)가 시간과 소유를 나른다. 상자만 지우면 정보가 사라진다.
  function CMDFoldFlow({ s }) {
    const a = s.architecture;
    const view = a.systems.find((x) => x.tag === 'SCREEN OUTPUT');
    const paper = a.systems.find((x) => x.tag === 'PAPER');
    const T = { x0: 168, x1: 1272, main: 92, work: 214 };
    const at = { input: 236, sched: 446, done: 946, sync: 1160 };
    const dot = (x, y, cls) => <circle cx={x} cy={y} r="9" className={'cmd-tl-dot ' + (cls || '')} />;

    return (
      <div className="sl-body cmd-foldflow">
        <Head no={s.no} title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(a.foldRule)}</p>

        <div className="cmd-foldflow__art">
          <svg viewBox="0 0 1320 300" role="img"
               aria-label="메인 스레드의 예약·완료 지점과 그 사이를 도는 워커 스레드의 분할 구간">
            <defs>
              <marker id="cmd-tl-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="cmd-tl-head" />
              </marker>
            </defs>

            <text x="0" y={T.main - 26} className="cmd-tl-lane">MAIN THREAD</text>
            <text x="0" y={T.work + 6} className="cmd-tl-lane is-worker">WORKER</text>

            <path d={`M${T.x0} ${T.main} H${T.x1}`} className="cmd-tl-line" markerEnd="url(#cmd-tl-a)" />
            <path d={`M${at.sched} ${T.work} H${at.done}`} className="cmd-tl-line is-worker" />

            {/* 예약 지점에서 내려가고 완료 지점에서 올라온다 — 그 사이가 워커가 쓴 시간 */}
            <path d={`M${at.sched} ${T.main + 12} V${T.work - 12}`} className="cmd-tl-hop" markerEnd="url(#cmd-tl-a)" />
            <path d={`M${at.done} ${T.work - 12} V${T.main + 12}`} className="cmd-tl-hop" markerEnd="url(#cmd-tl-a)" />

            <rect x={at.sched} y={T.work - 20} width={at.done - at.sched} height="40" rx="20" className="cmd-tl-band" />
            <text x={(at.sched + at.done) / 2} y={T.work + 6} textAnchor="middle" className="cmd-tl-bandtext">
              폴리곤 분할 · 접는 선 축 반사 + 정점 순서 뒤집기
            </text>

            {dot(at.input, T.main)}{dot(at.sched, T.main, 'is-key')}
            {dot(at.done, T.main, 'is-key')}{dot(at.sync, T.main)}

            <text x={at.input} y={T.main - 24} textAnchor="middle" className="cmd-tl-step">접는 선 보간</text>
            <text x={at.sched} y={T.main - 24} textAnchor="middle" className="cmd-tl-step">Schedule</text>
            <text x={at.done} y={T.main - 24} textAnchor="middle" className="cmd-tl-step">Complete</text>
            <text x={at.sync} y={T.main - 24} textAnchor="middle" className="cmd-tl-step">Sync</text>

            <text x={at.sched + 16} y={T.main + 32} className="cmd-tl-sub">선 3값만 전달</text>
            <text x={at.done + 16} y={T.main + 32} className="cmd-tl-sub">조각 쌓임 순서 구성</text>
            <text x={at.sync} y={T.main + 32} textAnchor="middle" className="cmd-tl-sub">앞·뒤 두 메시</text>

            <text x={T.x0} y="288" className="cmd-tl-axis">한 프레임 안 · 왼쪽에서 오른쪽이 시간</text>
          </svg>
        </div>

        {/* 데이터가 뷰로 흐른다. 반대 방향 화살표는 없다 */}
        <div className="cmd-split">
          <article>
            <span>데이터 · 시뮬레이션</span>
            <b>{RI(paper.title)}</b>
            <small>{RI(paper.body)}</small>
          </article>
          <i aria-hidden="true">→</i>
          <article className="is-view">
            <span>뷰</span>
            <b>{RI(view.title)}</b>
            <small>{RI(view.body)}</small>
          </article>
        </div>
      </div>
    );
  }

  // ─── 3-B. 좌표계와 월드 ───────────────────────────────────────────────────
  // 한 물체의 위치가 두 표현으로 존재한다 — 종이 위 위치, 이동 상태.
  // WorldLink 가 매 고정 스텝마다 Pull → 이동 → Push 로 둘을 오간다.
  function CMDWorlds({ s }) {
    const a = s.architecture;
    const get = (tag) => a.systems.find((x) => x.tag === tag);
    const fixed = a.lanes[1].items;
    const step = (no) => fixed.find((i) => i[0] === no);

    return (
      <div className="sl-body cmd-worlds">
        <Head no={s.no} title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(a.decisions[1][1])}</p>

        <div className="cmd-worlds__grid">
          <section className="cmd-world is-paper">
            <header>종이 월드 좌표</header>
            {[get('PAPER'), get('SURFACE')].map((x) => (
              <article key={x.title}><b>{RI(x.title)}</b><small>{RI(x.body)}</small></article>
            ))}
            <footer>{RI(step('04')[2])} · <code>PaperTransit</code></footer>
          </section>

          <div className="cmd-bridge">
            <span className="cmd-bridge__tag">{RI(get('WORLD BRIDGE').title)}</span>
            <div className="cmd-bridge__arrow is-pull">
              <b>Pull</b><small>{RI(step('06')[2])}</small>
            </div>
            <div className="cmd-bridge__contract"><code>IWorld</code><small>위치 읽기 · 쓰기 계약</small></div>
            <div className="cmd-bridge__arrow is-push">
              <b>Push</b><small>{RI(step('09')[2])}</small>
            </div>
          </div>

          <section className="cmd-world is-motion">
            <header>이동 · 기하 좌표</header>
            {[get('SIM WORLDS')].map((x) => (
              <article key={x.title}><b>{RI(x.title)}</b><small>{RI(x.body)}</small></article>
            ))}
            <article><b>{RI(step('07')[1])} · {RI(step('08')[1])}</b><small>{RI(step('07')[2])} · {RI(step('08')[2])}</small></article>
            <footer>{RI(step('10')[2])} · <code>Judge</code></footer>
          </section>
        </div>

        {/* 이 다리가 실행 순서의 어디에 있는지를 붙인다. 고정 스텝 레인만 떼어 와
            06 Pull ~ 09 Push 구간을 강조하면 "언제 오가는가"가 위치로 보인다. */}
        <div className="cmd-worlds__strip">
          <svg viewBox="0 0 1320 124" role="img" aria-label="고정 스텝 일곱 단계 중 WorldLink Pull에서 Push까지가 두 좌표를 오가는 구간">
            <defs>
              <marker id="cmd-ws-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="cmd-ws-head" />
              </marker>
            </defs>
            {(() => {
              const n = fixed.length, GAP = 12, W = (1320 - GAP * (n - 1)) / n;
              const xs = fixed.map((_, i) => i * (W + GAP));
              const from = fixed.findIndex((i) => i[1].includes('Pull'));
              const to = fixed.findIndex((i) => i[1].includes('Push'));
              const bx = xs[from], bw = xs[to] + W - xs[from];
              return (
                <React.Fragment>
                  <path d={`M${bx} 34 v-12 h${bw} v12`} className="cmd-ws-brace" />
                  <text x={bx + bw / 2} y="14" textAnchor="middle" className="cmd-ws-bracelabel">
                    WorldLink 구간 · Pull → 이동 → Push
                  </text>
                  {fixed.map(([no, title], i) => (
                    <g key={no}>
                      <rect x={xs[i]} y="44" width={W} height="56" rx="3"
                            className={'cmd-ws-card' + (i >= from && i <= to ? ' is-on' : '')} />
                      <text x={xs[i] + 10} y="64" className="cmd-ws-no">{no}</text>
                      <text x={xs[i] + 10} y="88" className="cmd-ws-title">{title}</text>
                      {i < n - 1 && <path d={`M${xs[i] + W + 1} 72 h${GAP - 3}`} className="cmd-ws-step" markerEnd="url(#cmd-ws-a)" />}
                    </g>
                  ))}
                  <text x="0" y="118" className="cmd-ws-note">{RI(a.lanes[1].note)} · 이 구간만 매 고정 스텝 반복</text>
                </React.Fragment>
              );
            })()}
          </svg>
        </div>

        <p className="cmd-scope">{RI(a.decisions[0][1])}</p>
      </div>
    );
  }

  // ─── 4. 개선 방식 (단계당 한 장) ──────────────────────────────────────────
  // 그림 + before/after 코드 + 측정 + 트레이드오프를 한 장에서 끝낸다.
  // 그림 장과 코드 장을 갈라 두면 코드 장이 앞 장 문장의 복사본이 되고 장수만 는다.
  function CMDMethod({ s }) {
    const m = s.method;
    return (
      <div className="sl-body cmd-method">
        <Head no={m.no} title={m.title} kind={m.stage + ' · ' + m.kind} />
        <div className="cmd-method__lead">
          <p className="cmd-gist">{RI(m.gist)}</p>
          <div className="cmd-method__metric">
            <strong>{m.metric.value}</strong>
            <b>{m.metric.detail}</b>
            <span>{m.metric.label}</span>
          </div>
        </div>
        {/* 그림과 코드를 위아래로 쌓으면 둘 다 못 들어간다(그림 1000x390 = 2.56:1).
            좌우로 두면 그림은 제 비율대로 크게, 코드는 세로로 두 벌 다 들어간다. */}
        <div className="cmd-method__body">
          <div className="cmd-method__art">
            <window.CMPageMethodViz method={m} />
          </div>
          <div className="cmd-codepair">
            <window.AsciiBlock {...m.code.before} lang="csharp" />
            <window.AsciiBlock {...m.code.after} lang="csharp" />
          </div>
        </div>
        <div className="cmd-method__foot">
          <p className="cmd-tradeoff">{RI(m.note)}</p>
          <p className="cmd-scope">측정 범위 — {RI(m.scope)}</p>
        </div>
      </div>
    );
  }

  // ─── 5. 검증 범위 ────────────────────────────────────────────────────────
  function CMDValidation({ s }) {
    const v = s.validation;
    return (
      <div className="sl-body cmd-validation">
        <Head no={s.no} title={s.title} kind={s.kind} />
        <p className="cmd-gist">{RI(v.intro)}</p>
        <div className="cmd-valgrid">
          {v.columns.map((c) => (
            <article key={c.title}>
              <strong>{c.title}</strong>
              <ul>{c.items.map((i) => <li key={i}>{RI(i)}</li>)}</ul>
            </article>
          ))}
        </div>
        {s.note && <p className="cmd-scope">{RI(s.note)}</p>}
      </div>
    );
  }

  window.DECK_LAYOUTS = Object.assign(window.DECK_LAYOUTS || {}, {
    cmCover: CMDCover,
    cmResult: CMDResult,
    cmFlow: CMDFlow,
    cmFoldFlow: CMDFoldFlow,
    cmWorlds: CMDWorlds,
    cmMethod: CMDMethod,
    cmValidation: CMDValidation,
  });
})();
