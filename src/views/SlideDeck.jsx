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
          {window.highlightCode
            ? <pre dangerouslySetInnerHTML={{ __html: window.highlightCode(code.code, code.lang) }} />
            : <pre>{code.code}</pre>}
        </div>
      </React.Fragment>
    );
  }

  // 프로젝트마다 viz 키가 겹칠 수 있어(둘 다 'job' 등) 매니페스트가 컴포넌트 이름을
  // 직접 주는 길을 열어 둔다. 키 맵은 DX11 하위호환용이다.
  // 그림 컴포넌트마다 인자 규약이 다르다 — DX11 것은 인자가 없고,
  // CM 워터폴은 steps/unit 을 받는다. 매니페스트가 vizProps 로 넘긴다.
  function Viz({ name, component, props }) {
    const Comp = window[component || VIZ[name]];
    return Comp ? <Comp {...(props || {})} /> : null;
  }

  // 링크는 <a> 여야 한다 — PDF 로 뽑아도 눌린다. 텍스트로 두면 URL 을 손으로 쳐야 한다.
  function LinkRow({ items, big }) {
    if (!items || !items.length) return null;
    return (
      <div className={'sl-links' + (big ? ' sl-links--big' : '')}>
        {items.map((l, i) => (
          <a className="sl-link" key={i} href={l.href} data-tone={l.tone} target="_blank" rel="noopener">
            <span className="sl-link__k">{l.label}</span>
            {l.v && <span className="sl-link__v">{l.v}</span>}
            <span className="sl-link__go" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    );
  }

  // ─── title — 문서 표제지. 프로젝트 표지가 아니라 **이 문서 전체의 첫 장**이다.
  //     소개를 여러 장으로 늘리지 않는다 — 항목마다 해당 사실 한 줄이면 된다. ───
  function Title({ s }) {
    const [h1, h2] = s.headline;
    const mark = s.headlineMark;
    let pre = h2, mk = '', post = '';
    if (mark && h2.includes(mark)) {
      const i = h2.indexOf(mark);
      pre = h2.slice(0, i); mk = mark; post = h2.slice(i + mark.length);
    }
    return (
      <div className="sl-body sl-title">
        <div className="sl-title__top">
          {s.photo && <img className="sl-title__photo" src={s.photo} alt="" />}
          <div className="sl-title__main">
            <h1 className="sl-h sl-h--title">
              {h1}<br />{pre}{mk && <mark className="hl hl--thick">{mk}</mark>}{post}
            </h1>
            {s.stance && <p className="sl-title__stance">{s.stance[0]}<br />{s.stance[1]}</p>}
            <dl className="sl-title__facts">
              {s.facts.map(([k, v], i) => (
                <React.Fragment key={i}><dt>{k}</dt><dd>{RI(v)}</dd></React.Fragment>
              ))}
            </dl>
            <LinkRow items={s.links} />
          </div>
        </div>
        {s.stats && (
          <div className="sl-title__stats">
            {s.stats.map((st, i) => (
              <div className="sl-tstat" key={i}>
                <span className="sl-tstat__n">{st.n}</span>
                <span className="sl-tstat__k">{st.label}</span>
                <span className="sl-tstat__s">{st.sub}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── outro — 마지막 링크 정리 ───
  function Outro({ s }) {
    return (
      <div className="sl-body sl-outro">
        <h2 className="sl-h">{s.title}</h2>
        {s.gist && <p className="sl-gist">{RI(s.gist)}</p>}
        <LinkRow items={s.links} big />
        {s.note && <p className="sl-note">{RI(s.note)}</p>}
      </div>
    );
  }

  // 페이지의 MermaidToggle 은 클릭해서 펼치는 물건이다. 슬라이드는 접힘이 없고,
  // PDF 스냅샷 시점에 이미 그려져 있어야 하므로 마운트 즉시 그린다.
  let mmSeq = 0;
  function Mermaid({ source }) {
    const host = React.useRef(null);
    React.useEffect(() => {
      const m = window.mermaid;
      if (!m || !host.current) return;
      let dead = false;
      m.render('sl-mm-' + ++mmSeq, source)
        .then(({ svg }) => { if (!dead && host.current) host.current.innerHTML = svg; })
        .catch(() => {});
      return () => { dead = true; };
    }, [source]);
    return <figure className="sl-mermaid" ref={host} />;
  }

  // ─── cover ────────────────────────────────────────
  function Cover({ s }) {
    return (
      <div className="sl-body sl-cover">
        <div className="sl-cover__main">
          {s.subtitle && <div className="sl-cover__name">{s.subtitle}</div>}
          <h1 className="sl-h sl-h--cover">{s.title}</h1>
          <p className="sl-sub">{RI(s.hook)}</p>
          <div className="sl-pills">
            {s.pills.map((p, i) => (
              <span key={i} data-tone={p.tone} className={'sl-pill' + (p.kind === 'accent' ? ' sl-pill--accent' : '')}>{p.text}</span>
            ))}
          </div>
          <LinkRow items={s.links} />
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
        <div
          className={'sl-cols' + (s.colCount && s.cols.length > s.colCount ? ' sl-cols--grid' : '')}
          style={{ '--cols': s.colCount || s.cols.length }}
        >
          {s.cols.map((c, i) => (
            <div className="sl-col" key={i} data-tone={c.tone}>
              {c.mark && <div className={'sl-col__mark sl-col__mark--' + (c.mark === '✓' ? 'yes' : 'no')}>{c.mark}</div>}
              {c.kind && <div className="sl-col__kind">{c.kind}</div>}
              <h3 className="sl-col__title">{c.title}</h3>
              {c.sub && <p className="sl-col__sub">{RI(c.sub)}</p>}
              {c.items && (
                <ul className="sl-col__list">
                  {c.items.map((t, j) => <li key={j}>{RI(t)}</li>)}
                </ul>
              )}
              {c.pairs && (
                <ul className="sl-col__pairs">
                  {c.pairs.map(([k, v], j) => <li key={j}><b>{RI(k)}</b><span>{RI(v)}</span></li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── step ─────────────────────────────────────────
  // 위에서 아래로 한 방향으로 읽힌다 — 절 요약 → 주장(제목) → 왜 → 뭘 했나 → 근거.
  // 근거(요점 + 그림)만 좌우로 갈라 놓는다. 그림은 요점과 같은 층이라
  // "말로 된 근거 / 그림으로 된 근거" 가 나란히 선다.
  function Step({ s }) {
    const st = s.step;
    const hasRight = st.viz || st.code || st.mermaid;
    return (
      <div className="sl-body">
        {s.gist && <p className="sl-secgist">{RI(s.gist)}</p>}
        <h2 className="sl-h">{s.title || st.title}</h2>
        <div className="sl-lead">
          <p className="sl-lead__why">{RI(st.problem)}</p>
          <p className="sl-lead__did">{RI(st.did)}</p>
        </div>
        <div className={'sl-step' + (hasRight ? (st.viz || st.mermaid ? ' sl-step--viz' : ' sl-step--code') : ' sl-step--wide')}>
          <ul className="sl-points">
            {(s.points || st.points).map((p, i) => {
              const [k, v] = Array.isArray(p) ? p : [null, p];
              return <li key={i}>{k && <b>{RI(k)}</b>}<span>{RI(v)}</span></li>;
            })}
          </ul>
          {hasRight && (
            <div className="sl-step__right">
              {st.viz && <Viz name={st.viz} component={s.vizComponent} props={s.vizProps} />}
              {!st.viz && st.mermaid && <Mermaid source={st.mermaid} />}
              {!st.viz && !st.mermaid && st.code && <CodeBlock code={st.code} />}
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
        {s.note && <p className="sl-note">{RI(s.note)}</p>}
      </div>
    );
  }

  // ─── stats ────────────────────────────────────────
  // 수치가 주장인 장. 큰 숫자 3칸이 먼저 오고 그 아래 차트가 근거를 댄다.
  // columns 로는 안 된다 — 카드 제목이 아니라 **수치 자체**가 시선을 먼저 받아야 한다.
  function Stats({ s }) {
    return (
      <div className="sl-body">
        <h2 className="sl-h">{s.title}</h2>
        {s.gist && <p className="sl-gist">{RI(s.gist)}</p>}
        <div className="sl-bigs" style={{ '--bigs': s.bigs.length }}>
          {s.bigs.map((b, i) => (
            <div className="sl-big" key={i}>
              <div className="sl-big__n">{b.n}</div>
              <div className="sl-big__k">{b.label}</div>
              <div className="sl-big__s">{RI(b.sub)}</div>
            </div>
          ))}
        </div>
        {s.vizComponent && (
          <div className="sl-stats__viz"><Viz component={s.vizComponent} props={s.vizProps} /></div>
        )}
        {s.note && <p className="sl-note">{RI(s.note)}</p>}
      </div>
    );
  }

  const LAYOUTS = { title: Title, cover: Cover, columns: Columns, step: Step, list: List, stats: Stats, outro: Outro };

  function SlideDeck({ deck }) {
    const total = deck.slides.length;
    return (
      <div className="deck">
        {deck.slides.map((s, i) => {
          const Body = LAYOUTS[s.layout];
          return (
            <section className="slide" key={i} data-screen-label={deck.name + ' · ' + (i + 1)}>
              <Chrome section={s.section || deck.name} no={s.no} deck={s.proj || deck.name} page={i + 1} total={total} />
              <Body s={s} />
            </section>
          );
        })}
      </div>
    );
  }

  window.SlideDeck = SlideDeck;
})();
