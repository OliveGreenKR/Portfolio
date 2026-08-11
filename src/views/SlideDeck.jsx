// JCH Portfolio — SlideDeck.jsx
// 제출용 슬라이드 덱의 레이아웃 래퍼.
//
// 데이터는 만들지 않는다. pages/{name}/data.js 가 유일한 원본이고,
// 이 뷰는 deck/{직무}.js 매니페스트가 고른 것을 배치만 한다.
// 사실을 여기서 새로 쓰면 사이트와 덱이 갈라진다 — 그러면 안 된다.
//
// 레이아웃은 넷뿐이다. 늘리기 전에 기존 넷의 조합으로 안 되는 이유를 댈 것.
//   cover   — 표지 (제목 · pills · 훅 · 히어로 이미지)
//   columns — 2~3칸 카드 (만든 것 · 직접 짠 것/가져다 쓴 것)
//   step    — 문제 → 한 것 → 요점, 오른쪽에 그림 또는 코드
//   list    — [제목, 본문] 쌍 격자 (통로 목록 · 한계)

(function defineSlideDeck() {
  const RI = (s) => window.renderInline(s);

  // viz 키 → viz.jsx 가 window 에 올린 컴포넌트. 페이지가 쓰는 그림을 그대로 재사용한다.
  const VIZ = {
    boundary: 'DXBoundaryViz',
    tick: 'DXTickViz',
    compact: 'DXCompactViz',
    fat: 'DXFatAABBViz',
    swept: 'DXSweptViz',
  };

  function Chrome({ section, no, deck, page, total }) {
    return (
      <React.Fragment>
        <div className="sl-top">
          {no && <span className="sl-top__no">{no}</span>}
          <span>{section}</span>
          <span className="sl-top__spacer" />
          <span>{deck}</span>
        </div>
        <div className="sl-foot">
          <span>{deck}</span>
          <span className="sl-foot__page">{page} / {total}</span>
        </div>
      </React.Fragment>
    );
  }

  function CodeBlock({ code }) {
    return (
      <React.Fragment>
        {code.intro && <p className="sl-code__intro">{RI(code.intro)}</p>}
        <div className="sl-code">
          <div className="sl-code__t">{code.title}</div>
          <pre>{code.code}</pre>
        </div>
      </React.Fragment>
    );
  }

  function Viz({ name }) {
    const Comp = window[VIZ[name]];
    return Comp ? <Comp /> : null;
  }

  // ─── cover ────────────────────────────────────────
  function Cover({ s }) {
    return (
      <div className="sl-body sl-cover">
        <div className="sl-cover__main">
          <h1 className="sl-h sl-h--cover">{s.title}</h1>
          <p className="sl-sub">{RI(s.hook)}</p>
          <div className="sl-pills">
            {s.pills.map((p, i) => (
              <span key={i} className={'sl-pill' + (p.kind === 'accent' ? ' sl-pill--accent' : '')}>{p.text}</span>
            ))}
          </div>
        </div>
        {s.hero && (
          <div className="sl-cover__art">
            <img src={s.hero.img} alt="" />
            <p className="sl-cover__cap">{RI(s.hero.caption)}</p>
          </div>
        )}
      </div>
    );
  }

  // ─── columns ──────────────────────────────────────
  function Columns({ s }) {
    return (
      <div className="sl-body">
        <h2 className="sl-h">{s.title}</h2>
        {s.gist && <p className="sl-gist">{RI(s.gist)}</p>}
        <div className="sl-cols" style={{ '--cols': s.cols.length }}>
          {s.cols.map((c, i) => (
            <div className="sl-col" key={i}>
              {c.kind && <div className="sl-col__kind">{c.kind}</div>}
              <h3 className="sl-col__title">{c.title}</h3>
              {c.sub && <p className="sl-col__sub">{RI(c.sub)}</p>}
              {c.items && (
                <ul className="sl-col__list">
                  {c.items.map((t, j) => <li key={j}>{RI(t)}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── step ─────────────────────────────────────────
  function Step({ s }) {
    const st = s.step;
    const hasRight = st.viz || st.code;
    return (
      <div className="sl-body">
        <h2 className="sl-h">{st.title}</h2>
        <div className={'sl-step' + (hasRight ? (st.viz ? ' sl-step--viz' : '') : ' sl-step--wide')}>
          <div className="sl-step__left">
            <div className="sl-pd">
              <div className="sl-pd__row sl-pd__row--problem">
                <span className="sl-pd__k">Problem</span>
                <p className="sl-pd__v">{RI(st.problem)}</p>
              </div>
              <div className="sl-pd__row sl-pd__row--did">
                <span className="sl-pd__k">Did</span>
                <p className="sl-pd__v">{RI(st.did)}</p>
              </div>
            </div>
            <ul className="sl-points">
              {(s.points || st.points).map(([k, v], i) => (
                <li key={i}><b>{RI(k)}</b><span>{RI(v)}</span></li>
              ))}
            </ul>
          </div>
          {hasRight && (
            <div className="sl-step__right">
              {st.viz && <Viz name={st.viz} />}
              {!st.viz && st.code && <CodeBlock code={st.code} />}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── list ─────────────────────────────────────────
  function List({ s }) {
    return (
      <div className="sl-body">
        <h2 className="sl-h">{s.title}</h2>
        {s.gist && <p className="sl-gist">{RI(s.gist)}</p>}
        <ul className="sl-pairs" style={{ '--pair-cols': s.pairCols || 2 }}>
          {s.pairs.map(([k, v], i) => (
            <li key={i}><b>{RI(k)}</b><span>{RI(v)}</span></li>
          ))}
        </ul>
      </div>
    );
  }

  const LAYOUTS = { cover: Cover, columns: Columns, step: Step, list: List };

  function SlideDeck({ deck }) {
    const total = deck.slides.length;
    return (
      <div className="deck">
        {deck.slides.map((s, i) => {
          const Body = LAYOUTS[s.layout];
          return (
            <section className="slide" key={i} data-screen-label={deck.name + ' · ' + (i + 1)}>
              <Chrome section={s.section || deck.name} no={s.no} deck={deck.name} page={i + 1} total={total} />
              <Body s={s} />
            </section>
          );
        })}
      </div>
    );
  }

  window.SlideDeck = SlideDeck;
})();
