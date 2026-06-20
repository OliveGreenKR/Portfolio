// pages/landing/LandingPage.jsx
// Top-level composition: Header / Rail / Hero / 메인 그리드 / Labs 그리드 / Footer.
// Depends on window.LANDING_DATA · window.landingStyles · window.MainRowCard · LabsCard · LandingFooter · renderLandingInline.

function LandingHeader() {
  const s = window.landingStyles;
  return (
    <div className="l-header" style={s.header}>
      <a href="landing.html" style={{...s.brand, textDecoration: 'none'}}>
        <span style={s.brandMark}></span>
        JCH / PORTFOLIO
      </a>
      <div style={s.nav}>
        <a href="#identity" style={{...s.navItem, ...s.navActive}}>Index</a>
        <a href="#featured" style={s.navItem}>Projects</a>
        <a href="#labs" style={s.navItem}>Labs</a>
        <a href="about.html" style={s.navItem}>About</a>
      </div>
    </div>
  );
}

function LandingRail({ active }) {
  const s = window.landingStyles;
  const items = [
    { id: 'identity', label: 'Identity' },
    { id: 'featured', label: 'Featured · 05' },
    { id: 'labs',     label: 'Labs · 06' },
    { id: 'footer',   label: 'Footer' },
  ];
  return (
    <nav className="l-rail" style={s.rail} aria-label="Sections">
      {items.map(it => (
        <a key={it.id} href={`#${it.id}`} style={{...s.railLink, ...(active === it.id ? s.railActive : {})}}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}

function LandingHero({ data }) {
  const s = window.landingStyles;
  const [a, b] = data.headline;
  // 두 번째 줄에서 marker 부분을 분할
  const mark = data.headlineMarkSecondLine;
  let beforeMark = b, markText = '', afterMark = '';
  if (mark && b.includes(mark)) {
    const i = b.indexOf(mark);
    beforeMark = b.slice(0, i);
    markText = mark;
    afterMark = b.slice(i + mark.length);
  }
  return (
    <section id="identity" className="l-hero" style={s.hero} data-screen-label="Landing · Identity">
      <div>
        <div style={s.eyebrow}>{data.eyebrow}</div>
        <h1 style={s.display}>
          {a}<br />
          {beforeMark}
          {markText && <mark className="hl hl--thick">{markText}</mark>}
          {afterMark}
        </h1>
        <p style={s.lede}>{window.renderLandingInline(data.lede)}</p>
        <div style={s.miniStats}>
          {data.stats.map((st, i) => (
            <div key={i} style={s.miniStat}>
              <span style={s.miniStatNum}>{st.n}</span>
              <span>{st.label}</span>
              <span style={s.miniStatSub}>{st.sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="l-portrait" style={s.portrait}>
        <img src="../assets/profile-glasses.png" alt="" style={s.portraitImg} />
        <span style={s.portraitTag}>JCH · 2026</span>
      </div>
    </section>
  );
}

function FeaturedSection({ items }) {
  const s = window.landingStyles;
  return (
    <section id="featured" style={s.section} data-screen-label="Landing · Featured">
      <div style={s.sectionHead}>
        <h2 style={s.sectionTitle}>메인 프로젝트</h2>
        <div style={s.sectionMeta}>FEATURED · 05 · 시스템 아키텍처</div>
      </div>
      <div className="l-featured-list">
        {items.map((p, i) => (
          <window.MainRowCard key={p.idx} p={p} isLast={i === items.length - 1} />
        ))}
      </div>
    </section>
  );
}

function LabsSection({ items }) {
  const s = window.landingStyles;
  // 항상 최신순 — date (ISO `YYYY-MM-DD`) desc. 빈 문자열은 가장 뒤로 밀림.
  const sorted = React.useMemo(
    () => [...items].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    [items]
  );
  return (
    <section id="labs" style={s.section} data-screen-label="Landing · Labs">
      <div style={s.sectionHead}>
        <h2 style={s.sectionTitle}>Labs</h2>
        <div style={s.sectionMeta}>POC · 06 · 1일–8주 단위 · 최신순</div>
      </div>
      <div className="l-labs-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {sorted.map(l => (
          <window.LabsCard key={l.idx} l={l} />
        ))}
      </div>
    </section>
  );
}

// ─── Scroll-spy: rail active item based on which section is in view
function useScrollSpy(ids) {
  const [active, setActive] = React.useState(ids[0]);
  React.useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      // pick the entry closest to top that is intersecting
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.3, 0.6] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(',')]);
  return active;
}

function LandingPage() {
  const data = window.LANDING_DATA;
  const s = window.landingStyles;
  const active = useScrollSpy(['identity', 'featured', 'labs', 'footer']);
  return (
    <div style={s.page}>
      <LandingHeader />
      <div className="l-body" style={s.body}>
        <LandingRail active={active} />
        <main>
          <LandingHero data={data.identity} />
          <FeaturedSection items={data.main} />
          <LabsSection items={data.labs} />
          <div id="footer">
            <window.LandingFooter data={data.footer} />
          </div>
        </main>
        <div></div>
      </div>
    </div>
  );
}

window.LandingPage = LandingPage;
