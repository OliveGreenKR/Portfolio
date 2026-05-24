// Header.jsx — sticky top bar with brand mark and section nav
const { useState } = React;

window.Header = function Header({ active, onNav }) {
  return (
    <header style={headerStyles.root}>
      <div style={headerStyles.brand}>
        <span>jch</span>
        <span style={headerStyles.dot} />
      </div>
      <nav style={headerStyles.nav}>
        {[
          { id: 'projects', label: 'Projects' },
          { id: 'about',    label: 'About' },
          { id: 'identity', label: 'Identity' },
          { id: 'contact',  label: 'Contact' },
        ].map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); onNav(item.id); }}
            style={{
              ...headerStyles.link,
              color: active === item.id ? 'var(--ink)' : 'var(--ink-3)',
            }}
          >
            {item.label}
            {active === item.id && <span style={headerStyles.underline} />}
          </a>
        ))}
      </nav>
    </header>
  );
};

const headerStyles = {
  root: {
    position: 'sticky', top: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 40px',
    borderBottom: '1px solid var(--rule)',
    background: 'rgba(251, 249, 245, 0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  brand: {
    display: 'flex', alignItems: 'baseline', gap: 6,
    fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700,
    letterSpacing: '-0.01em', color: 'var(--ink)',
  },
  dot: {
    width: 6, height: 6, borderRadius: 999,
    background: 'var(--terra-300)', alignSelf: 'center',
  },
  nav: { display: 'flex', gap: 28 },
  link: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    textDecoration: 'none', position: 'relative', paddingBottom: 4,
    transition: 'color 120ms var(--ease-out)',
  },
  underline: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 2, background: 'var(--terra-300)',
  },
};
