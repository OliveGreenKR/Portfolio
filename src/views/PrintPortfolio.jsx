// JCH Portfolio — PrintPortfolio.jsx
// Print-oriented layout. Same PROJECTS data + same canonical components,
// but laid out as a single linear document (no client routing, no sticky
// header, every project deep-dive rendered inline with page-breaks
// between projects). Visual ink/paper rules live in src/styles/print.css.

(function definePrintPortfolio() {
  const { Tag, Callout, CodeReveal, PROJECTS } = window;

  function StatRow({ items }) {
    return (
      <div className="stats">
        {items.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat__v">{s.v}<span className="unit">{s.unit}</span></div>
            <div className="stat__k">{s.k}</div>
          </div>
        ))}
      </div>
    );
  }

  function RailRow({ label, children }) {
    return (
      <div className="rail-row">
        <div className="rail-label">{label}</div>
        <div className="rail-body">{children}</div>
      </div>
    );
  }

  function CoverPage() {
    return (
      <section className="hero" style={{ pageBreakAfter: "always" }}>
        <div className="container">
          <div className="hero__eyebrow">JCH · Portfolio · Print edition</div>
          <h1 className="hero__title">변경에 강한 <em>구조</em>를 만드는 개발자.</h1>
          <p className="hero__quote">사용성의 진짜 의미는 외부 API뿐 아니라 변경에 강한 구조에서 나온다.</p>
          <div className="hero__meta">
            <span>{PROJECTS.length} PROJECTS</span><span className="sep" />
            <span>2022—2024</span>
          </div>
        </div>
      </section>
    );
  }

  function TableOfContents() {
    return (
      <section className="section" style={{ pageBreakAfter: "always" }}>
        <div className="container">
          <div className="section__eyebrow">contents</div>
          <h2 className="section__title">Projects</h2>
          <div className="rail" style={{ paddingTop: 24 }}>
            {PROJECTS.map((p) => (
              <div className="rail-row" key={p.id}>
                <div className="rail-label">{p.num}</div>
                <div className="rail-body">
                  <strong>{p.title}</strong>
                  <div className="pl-meta">{p.year} · {p.duration} · {p.stack}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function ProjectPage({ project }) {
    const s = project.sections;
    return (
      <section className="section" style={{ pageBreakBefore: "always" }}>
        <div className="container--narrow">
          <div className="pd-head">
            <div className="pd-eyebrow">Project · {project.num} ／ {String(PROJECTS.length).padStart(2, "0")}</div>
            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-summary">{project.summary}</p>
            <div className="pd-meta-row">
              <span className="pd-meta">{project.year} · {project.duration} · {project.stack}</span>
              {project.tags.map((t, i) => <Tag key={i} {...t} />)}
            </div>
          </div>
          <div style={{ padding: "24px 0" }}><StatRow items={project.stats} /></div>
          <div className="rail">
            <RailRow label="Context"><p>{s.context}</p></RailRow>
            <RailRow label="Problem"><p>{s.problem}</p></RailRow>
            <RailRow label="Action">
              {Array.isArray(s.action)
                ? <ul>{s.action.map((a, i) => <li key={i}>{a}</li>)}</ul>
                : <p>{s.action}</p>}
            </RailRow>
            <RailRow label="Result">
              {Array.isArray(s.result)
                ? <ul>{s.result.map((a, i) => <li key={i}>{a}</li>)}</ul>
                : <p>{s.result}</p>}
              {s.flags.map((f, i) => (
                <Callout key={i} kind={f.kind}>
                  <span dangerouslySetInnerHTML={{ __html: f.body }} />
                </Callout>
              ))}
            </RailRow>
            <RailRow label="Evidence">
              <p>{s.evidence}</p>
              {s.code && <CodeReveal file={s.code.file} html={s.code.body} />}
            </RailRow>
          </div>
        </div>
      </section>
    );
  }

  function PrintPortfolio() {
    return (
      <>
        <CoverPage />
        <TableOfContents />
        {PROJECTS.map((p) => <ProjectPage key={p.id} project={p} />)}
      </>
    );
  }

  window.PrintPortfolio = PrintPortfolio;
})();
