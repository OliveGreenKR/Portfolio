// pages/landing/LandingPage.jsx
// 랜딩 — A · Notebook 변형. 데이터는 window.LANDING_DATA.
// Notebook chrome (.nb-*) 의 일부는 메인 페이지와 공유, 일부는 랜딩 전용 인라인 스타일.

const landingStyles = {
  page: {
    minHeight: '100vh',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontFeatureSettings: '"ss06"',
  },

  // ─── Header (sticky, shared visual w/ project pages)
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    height: 64,
    background: 'color-mix(in oklab, var(--paper) 88%, transparent)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--rule)',
    display: 'flex', alignItems: 'center', gap: 28,
    padding: '0 56px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em', color: 'var(--ink)', fontWeight: 600 },
  brandMark: { width: 22, height: 22, borderRadius: '50%', background: 'var(--sage-300)', display: 'inline-block' },
  nav: { marginLeft: 'auto', display: 'flex', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-2)', fontWeight: 500 },
  navItem: { color: 'inherit', textDecoration: 'none' },
  navActive: { color: 'var(--ink)', borderBottom: '1px solid var(--ink)', paddingBottom: 4 },

  // ─── Body grid: rail | main | gutter (max-width 1320)
  body: {
    display: 'grid',
    gridTemplateColumns: '120px minmax(0, 980px) 80px',
    padding: '0 56px',
    gap: 32,
    maxWidth: 1320,
    margin: '0 auto',
  },

  // ─── Rail (sticky structural labels)
  rail: {
    position: 'sticky', top: 96,
    alignSelf: 'start',
    height: 'max-content',
    paddingTop: 56,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
  },
  railLink: {
    display: 'block',
    padding: '8px 0 8px 12px',
    borderLeft: '2px solid transparent',
    color: 'var(--ink-3)',
    textDecoration: 'none',
    transition: 'color 120ms, border-color 120ms',
  },
  railActive: {
    color: 'var(--ink)',
    borderLeftColor: 'var(--terra-300)',
  },

  // ─── Hero
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 220px',
    gap: 56,
    paddingTop: 80,
    paddingBottom: 64,
    borderBottom: '1px solid var(--rule)',
  },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
    marginBottom: 24,
  },
  display: {
    fontFamily: 'var(--font-display)',
    fontSize: 60,
    lineHeight: 1.12,
    fontWeight: 700,
    letterSpacing: '-0.022em',
    color: 'var(--ink)',
    margin: '0 0 28px',
  },
  lede: {
    fontSize: 17,
    lineHeight: 1.65,
    color: 'var(--ink-2)',
    maxWidth: 620,
    margin: '0 0 36px',
    textWrap: 'pretty',
  },
  miniStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, max-content)',
    gap: 40,
    rowGap: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
  },
  miniStat: { display: 'flex', flexDirection: 'column', gap: 4 },
  miniStatNum: { color: 'var(--ink)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)' },
  miniStatSub: { fontSize: 11, opacity: 0.78 },
  portrait: {
    width: 220, height: 264,
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    position: 'relative',
    overflow: 'hidden',
  },
  portraitImg: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 18%',
    filter: 'saturate(0.85) contrast(1.02)',
  },
  portraitTag: {
    position: 'absolute', left: 10, bottom: 10,
    fontFamily: 'var(--font-mono)', fontSize: 10,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--paper)',
    background: 'rgba(31,29,26,0.72)',
    padding: '3px 8px',
    borderRadius: 2,
  },

  // ─── Section heading
  section: {
    paddingTop: 80,
    paddingBottom: 24,
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: '1px solid var(--rule)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.014em',
    margin: 0,
  },
  sectionMeta: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
    marginLeft: 'auto',
  },
};

window.landingStyles = landingStyles;
