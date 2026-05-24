// pages/about/AboutPage.jsx
// About — 메인 페이지의 .nb-* chrome (header / body / rail) 재사용. 본문은 자체 인라인 스타일.
// 데이터: window.ABOUT_DATA.  렌더링 의존: window.renderInline (notebook-components.jsx).

const aboutStyles = {
  hero: { paddingTop: 80, paddingBottom: 56, borderBottom: '1px solid var(--rule)' },
  eyebrow: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500, marginBottom: 28,
  },
  display: {
    fontFamily: 'var(--font-display)', fontSize: 60, lineHeight: 1.12, fontWeight: 700,
    letterSpacing: '-0.022em', color: 'var(--ink)', margin: '0 0 40px', textWrap: 'pretty',
  },
  body: {
    fontSize: 18, lineHeight: 1.7, color: 'var(--ink)', maxWidth: 720,
    margin: '0 0 36px', textWrap: 'pretty',
  },

  // ─── Facts dl
  factsWrap: { paddingTop: 56, paddingBottom: 40 },
  sectionHead: {
    display: 'flex', alignItems: 'baseline', gap: 16,
    marginBottom: 28, paddingBottom: 14, borderBottom: '1px solid var(--rule)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
    letterSpacing: '-0.012em', margin: 0,
  },
  sectionMeta: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500, marginLeft: 'auto',
  },
  dl: {
    display: 'grid', gridTemplateColumns: '140px minmax(0, 1fr)',
    rowGap: 12, columnGap: 24, margin: 0, fontSize: 15, lineHeight: 1.55,
  },
  dt: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500, paddingTop: 3,
  },
  dd: { margin: 0, color: 'var(--ink-2)' },

  // ─── Strands (3 cards)
  strandsWrap: { paddingTop: 56, paddingBottom: 40 },
  strandsGrid: { display: 'flex', flexDirection: 'column', gap: 18 },
  strand: {
    display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)',
    gap: 28, padding: '24px 0',
    borderTop: '1px solid var(--rule)',
  },
  strandKindCol: { paddingTop: 4 },
  strandKind: {
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600,
  },
  strandTitle: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
    letterSpacing: '-0.012em', margin: '0 0 10px', lineHeight: 1.25,
  },
  strandLede: { fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 18px', textWrap: 'pretty' },
  exampleList: { display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' },
  exampleRow: {
    display: 'grid', gridTemplateColumns: '120px minmax(0,1fr) 16px',
    gap: 16, padding: '10px 12px', alignItems: 'baseline',
    background: 'var(--paper-2)', border: '1px solid var(--rule)',
    fontSize: 13.5, textDecoration: 'none', color: 'inherit',
    transition: 'background 140ms',
  },
  exampleTag: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em',
    color: 'var(--ink)', fontWeight: 600,
  },
  exampleArrow: { fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', textAlign: 'right' },

  // ─── Skills section
  skillsWrap: { paddingTop: 56, paddingBottom: 40 },
  skillsNote: { fontSize: 14, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', margin: '0 0 24px' },
  skillGroup: {
    display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)',
    gap: 28, padding: '20px 0', borderTop: '1px solid var(--rule)',
  },
  skillGroupName: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
    textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 600, paddingTop: 4,
  },
  skillItems: {
    display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)',
    rowGap: 10, columnGap: 20, margin: 0, fontSize: 14, lineHeight: 1.55,
  },
  skillLead: {
    fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-2)',
    letterSpacing: '0.02em', whiteSpace: 'nowrap', paddingTop: 2,
  },
  skillText: { color: 'var(--ink-2)', textWrap: 'pretty' },

  // ─── Background
  bgWrap: { paddingTop: 56, paddingBottom: 40 },
  bgRows: { display: 'flex', flexDirection: 'column' },
  bgRow: {
    display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr)',
    gap: 24, padding: '16px 0', borderTop: '1px solid var(--rule)',
    fontSize: 15, lineHeight: 1.55,
  },
  bgY: { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' },
  bgT: { color: 'var(--ink-2)', textWrap: 'pretty' },

  // ─── Meta (Gamelab 4기)
  metaWrap: { paddingTop: 56, paddingBottom: 40 },
  metaNote: { fontSize: 14, color: 'var(--ink-3)', margin: '0 0 20px', fontFamily: 'var(--font-mono)' },
  metaRows: { display: 'flex', flexDirection: 'column', gap: 0 },
  metaRow: {
    display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)',
    gap: 24, padding: '16px 0', borderTop: '1px solid var(--rule)',
    fontSize: 15, lineHeight: 1.55,
  },
  metaY: { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' },
  metaT: { color: 'var(--ink-2)', textWrap: 'pretty' },

  // ─── Links — interactive
  linksWrap: { paddingTop: 56, paddingBottom: 24 },
  linksNote: { fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', margin: '0 0 16px' },
  linksList: { display: 'flex', flexDirection: 'column', gap: 0, fontFamily: 'var(--font-mono)', fontSize: 13 },
  linkRow: {
    display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr) 16px',
    gap: 16, padding: '14px 0', borderTop: '1px dashed var(--rule)',
    color: 'inherit', textDecoration: 'none', alignItems: 'baseline',
    transition: 'background 140ms',
  },
  linkLabel: { color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11 },
  linkValue: { color: 'var(--ink)', fontFamily: 'var(--font-mono)' },
  linkArrow: { color: 'var(--ink-3)', textAlign: 'right' },

  // ─── Footer
  footer: {
    padding: '64px 0 96px', marginTop: 32, borderTop: '1px solid var(--rule)',
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.04em',
  },
};

function AboutHeader() {
  return (
    <header className="nb-header">
      <a className="nb-brand" href="landing.html">
        <span className="nb-brand-mark"></span>
        JCH / PORTFOLIO
      </a>
      <div className="nb-crumbs">
        <a href="landing.html">index</a>
        <span className="sep">/</span>
        <span className="cur">about</span>
      </div>
      <nav className="nb-nav">
        <a href="#strands">Strands</a>
        <a href="#skills">Skills</a>
        <a href="#background">Background</a>
        <a href="#links">Contact</a>
      </nav>
    </header>
  );
}

function AboutRail() {
  const [active, setActive] = React.useState('hero');
  React.useEffect(() => {
    const ids = ['hero', 'facts', 'strands', 'skills', 'background', 'links'];
    const sects = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sects.length) return;
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis.length) setActive(vis[0].target.id);
    }, { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    sects.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);
  const link = (id, label) => (
    <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
  );
  return (
    <aside className="nb-rail" aria-label="On-page navigation">
      <span className="nb-rail-section">page</span>
      {link('hero', 'Overview')}
      {link('facts', 'Context')}
      <span className="nb-rail-section">strands</span>
      {link('strands', '시스템 / 운영 / PoC')}
      <span className="nb-rail-section">profile</span>
      {link('skills', 'Skills')}
      {link('background', 'Background')}
      {link('links', 'External')}
    </aside>
  );
}

function AboutHero({ data }) {
  const ri = window.renderInline || ((x) => x);
  const [a, b] = data.display;
  const mark = data.displayMark;
  let pre = b, mt = '', post = '';
  if (mark && b.includes(mark)) {
    const i = b.indexOf(mark);
    pre = b.slice(0, i); mt = mark; post = b.slice(i + mark.length);
  }
  return (
    <section id="hero" style={aboutStyles.hero} data-screen-label="About · Overview">
      <div style={aboutStyles.eyebrow}>{data.eyebrow}</div>
      <h1 style={aboutStyles.display}>
        {a}<br/>
        {pre}{mt && <mark className="hl">{mt}</mark>}{post}
      </h1>
      {data.body.map((p, i) => (
        <p key={i} style={aboutStyles.body}>{ri(p)}</p>
      ))}
    </section>
  );
}

function AboutFacts({ rows }) {
  const ri = window.renderInline || ((x) => x);
  return (
    <section id="facts" style={aboutStyles.factsWrap} data-screen-label="About · Facts">
      <div style={aboutStyles.sectionHead}>
        <h2 style={aboutStyles.sectionTitle}>Context</h2>
        <div style={aboutStyles.sectionMeta}>§ 01 ─ Facts</div>
      </div>
      <dl style={aboutStyles.dl}>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <dt style={aboutStyles.dt}>{r[0]}</dt>
            <dd style={aboutStyles.dd}>{ri(r[1])}</dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

function AboutStrands({ items }) {
  return (
    <section id="strands" style={aboutStyles.strandsWrap} data-screen-label="About · Strands">
      <div style={aboutStyles.sectionHead}>
        <h2 style={aboutStyles.sectionTitle}>세 결</h2>
        <div style={aboutStyles.sectionMeta}>§ 02 ─ Systems / Operations / PoC</div>
      </div>
      <div style={aboutStyles.strandsGrid}>
        {items.map((s, i) => (
          <div key={i} style={aboutStyles.strand}>
            <div style={aboutStyles.strandKindCol}>
              <div style={aboutStyles.strandKind}>{s.kind}</div>
            </div>
            <div>
              <h3 style={aboutStyles.strandTitle}>{s.title}</h3>
              <p style={aboutStyles.strandLede}>{s.lede}</p>
              <ul style={aboutStyles.exampleList}>
                {s.examples.map((e, j) => (
                  <li key={j}>
                    <a href={e.href} style={aboutStyles.exampleRow}>
                      <span style={aboutStyles.exampleTag}>{e.tag}</span>
                      <span>{e.line}</span>
                      <span style={aboutStyles.exampleArrow}>→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSkills({ data }) {
  return (
    <section id="skills" style={aboutStyles.skillsWrap} data-screen-label="About · Skills">
      <div style={aboutStyles.sectionHead}>
        <h2 style={aboutStyles.sectionTitle}>Skills</h2>
        <div style={aboutStyles.sectionMeta}>§ 03 ─ 보유 기술</div>
      </div>
      <p style={aboutStyles.skillsNote}>{data.note}</p>
      <div>
        {data.groups.map((g, i) => (
          <div key={i} style={aboutStyles.skillGroup}>
            <div style={aboutStyles.skillGroupName}>{g.name}</div>
            <dl style={aboutStyles.skillItems}>
              {g.items.map((it, j) => (
                <React.Fragment key={j}>
                  <dt style={aboutStyles.skillLead}>{it.lead}</dt>
                  <dd style={{...aboutStyles.skillText, margin: 0}}>{it.text}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBackground({ data }) {
  const ri = window.renderInline || ((x) => x);
  return (
    <section id="background" style={aboutStyles.bgWrap} data-screen-label="About · Background">
      <div style={aboutStyles.sectionHead}>
        <h2 style={aboutStyles.sectionTitle}>Background</h2>
        <div style={aboutStyles.sectionMeta}>§ 04 ─ 학력 / 활동 / 자격</div>
      </div>
      <p style={aboutStyles.skillsNote}>{data.note}</p>
      <div style={aboutStyles.bgRows}>
        {data.rows.map((r, i) => (
          <div key={i} style={aboutStyles.bgRow}>
            <div style={aboutStyles.bgY}>{r.y}</div>
            <div style={aboutStyles.bgT}>{ri(r.t)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutLinks({ data }) {
  return (
    <section id="links" style={aboutStyles.linksWrap} data-screen-label="About · Links">
      <div style={aboutStyles.sectionHead}>
        <h2 style={aboutStyles.sectionTitle}>External</h2>
        <div style={aboutStyles.sectionMeta}>§ 05 ─ Contact / Links</div>
      </div>
      <p style={aboutStyles.linksNote}>{data.note}</p>
      <div style={aboutStyles.linksList}>
        {data.items.map((l, i) => {
          const external = l.href && /^https?:/.test(l.href);
          const Tag = l.href ? 'a' : 'div';
          const props = l.href
            ? { href: l.href, ...(external ? { target: '_blank', rel: 'noopener' } : {}) }
            : {};
          return (
            <Tag key={i} {...props} style={aboutStyles.linkRow}>
              <span style={aboutStyles.linkLabel}>{l.label}</span>
              <span style={aboutStyles.linkValue}>{l.v}</span>
              <span style={aboutStyles.linkArrow}>{external ? '↗' : (l.href ? '→' : '')}</span>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function AboutPage() {
  const d = window.ABOUT_DATA;
  return (
    <div className="nb-page">
      <AboutHeader />
      <div className="nb-body">
        <AboutRail />
        <main>
          <AboutHero data={d} />
          <AboutFacts rows={d.facts} />
          <AboutStrands items={d.strands} />
          <AboutSkills data={d.skills} />
          <AboutBackground data={d.background} />
          <AboutLinks data={d.links} />
          <div style={aboutStyles.footer}>{d.footer}</div>
        </main>
        <div></div>
      </div>
    </div>
  );
}

window.AboutPage = AboutPage;
