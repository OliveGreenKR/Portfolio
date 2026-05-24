// JCH Portfolio — WebPortfolio.jsx
// The full responsive web surface. Composes canonical components
// (Tag, Callout, CodeReveal, ProjectCard) over the shared PROJECTS data.
// Print layout is a sibling: src/views/PrintPortfolio.jsx.

const { useState, useMemo } = React;

(function defineWebPortfolio() {
  const { Tag, Callout, CodeReveal, ProjectCard, PROJECTS } = window;

  /* ─── kit-local layout primitives ─── */
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

  /* ─── screens ─── */
  function Header({ active, go }) {
    return (
      <header className="site-header">
        <div className="site-header__inner">
          <div className="brand" onClick={() => go("home")}>jch<span className="dot" /></div>
          <nav className="nav">
            <a className={active === "home" ? "on" : ""} onClick={() => go("home")}>Projects</a>
            <a className={active === "about" ? "on" : ""} onClick={() => go("about")}>About</a>
            <a onClick={() => go("home")}>Identity</a>
            <a onClick={() => go("home")}>Contact</a>
          </nav>
        </div>
      </header>
    );
  }

  function Hero() {
    return (
      <section className="hero">
        <div className="container">
          <div className="hero__eyebrow">Developer · Gameplay / Engine · Seoul</div>
          <h1 className="hero__title">변경에 강한 <em>구조</em>를<br />만드는 개발자.</h1>
          <p className="hero__quote">사용성의 진짜 의미는 외부 API뿐 아니라 변경에 강한 구조에서 나온다. 이 포트폴리오는 그 가설을 검증한 프로젝트들의 기록입니다.</p>
          <div className="hero__meta">
            <span>{PROJECTS.length} PROJECTS</span><span className="sep" />
            <span>2 SHIPPED ON STEAM</span><span className="sep" />
            <span>2022—2024</span>
          </div>
        </div>
      </section>
    );
  }

  function ProjectList({ open }) {
    return (
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <div className="section__eyebrow">selected work</div>
              <h2 className="section__title">Projects</h2>
            </div>
            <div className="section__count">{String(PROJECTS.length).padStart(2, "0")} ENTRIES</div>
          </div>
          <div className="pl">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} total={PROJECTS.length} onOpen={open} variant="row" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  function ProjectDetail({ project, back }) {
    const s = project.sections;
    return (
      <section className="section fade-in">
        <div className="container--narrow">
          <button className="pd-back" onClick={back}>← All projects</button>
          <div className="pd-head">
            <div className="pd-eyebrow">Project · {project.num} ／ {String(PROJECTS.length).padStart(2, "0")}</div>
            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-summary">{project.summary}</p>
            <div className="pd-meta-row">
              <span className="pd-meta">{project.year} · {project.duration} · {project.stack}</span>
              {project.tags.map((t, i) => <Tag key={i} {...t} />)}
            </div>
          </div>
          <div style={{ padding: "32px 0" }}><StatRow items={project.stats} /></div>
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

  function About() {
    return (
      <section className="section fade-in">
        <div className="container">
          <div className="section__head">
            <div>
              <div className="section__eyebrow">about</div>
              <h2 className="section__title">Identity</h2>
            </div>
          </div>
          <div className="about-grid">
            <div className="about-pull">
              도구를 만드는 개발자.<br />
              <em>스스로 굴러가는</em> 도구를 만드는 데<br />
              가장 큰 즐거움을 느낀다.
            </div>
            <div className="about-body">
              <p>좋은 엔진의 사용성은 외부 API 표면에서만 결정되지 않는다. 변경에 강한 내부 구조 — 책임 분리, 결정성, 테스트 가능성 — 이 셋 위에서 비로소 사용성이 의미를 가진다.</p>
              <p>지난 3년간 다섯 개의 프로젝트는 모두 이 가설을 다른 각도에서 검증한 기록이다. DX11 엔진은 결정성과 성능, Cartapli는 책임 분리, Wobble은 출시 직전의 안정성, Badulbadul 랩은 시작 비용을 줄이는 인프라.</p>
              <p>다음 단계는 <strong style={{ color: "var(--ink)" }}>대규모 라이브 서비스 환경</strong>에서 같은 원칙을 적용하는 것이다.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function Footer() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-mark">jch<span style={{ color: "var(--terra-300)" }}>.</span></div>
              <p className="footer-quote">사용성의 진짜 의미는 외부 API뿐 아니라 변경에 강한 구조에서 나온다.</p>
            </div>
            <div>
              <h4>Contact</h4>
              <ul><li><a>email</a></li><li><a>github</a></li><li><a>resume.pdf</a></li></ul>
            </div>
            <div>
              <h4>Targeting</h4>
              <ul><li>Engine / gameplay</li><li>Live ops at scale</li><li>Tools & tooling</li></ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  /* ─── view root ─── */
  function WebPortfolio() {
    const [route, setRoute] = useState({ page: "home", projectId: null });
    const project = useMemo(() => PROJECTS.find((p) => p.id === route.projectId), [route.projectId]);
    const go = (page) => { setRoute({ page, projectId: null }); window.scrollTo({ top: 0, behavior: "smooth" }); };
    const open = (id) => { setRoute({ page: "project", projectId: id }); window.scrollTo({ top: 0, behavior: "smooth" }); };

    return (
      <>
        <Header active={route.page} go={go} />
        {route.page === "home" && (<><Hero /><ProjectList open={open} /><About /><Footer /></>)}
        {route.page === "about" && (<><About /><Footer /></>)}
        {route.page === "project" && project && (<><ProjectDetail project={project} back={() => go("home")} /><Footer /></>)}
      </>
    );
  }

  window.WebPortfolio = WebPortfolio;
})();
