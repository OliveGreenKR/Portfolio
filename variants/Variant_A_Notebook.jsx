// Variant A — Notebook
// 단일 세로 흐름 · 좌측 구조 라벨 레일 · 행카드 · 길게 읽음
// 같은 콘텐츠 슬롯에 placeholder 텍스트만 박은 상태.

const notebookStyles = {
  page: {
    width: '100%',
    minHeight: '100%',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontFeatureSettings: '"ss06"',
  },
  // ─── Header
  header: {
    height: 64,
    borderBottom: '1px solid var(--rule)',
    background: 'var(--paper)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 56px',
    gap: 28,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    letterSpacing: '0.04em',
    color: 'var(--ink)',
    fontWeight: 600,
  },
  brandMark: {
    width: 22, height: 22,
    borderRadius: '50%',
    background: 'var(--sage-300)',
    display: 'inline-block',
  },
  nav: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 24,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-2)',
    fontWeight: 500,
  },
  navItem: { cursor: 'pointer' },
  navActive: { color: 'var(--ink)', borderBottom: '1px solid var(--ink)', paddingBottom: 4 },
  // ─── Layout: railed page
  body: {
    display: 'grid',
    gridTemplateColumns: '88px 1fr 88px',
    padding: '0 56px',
  },
  rail: {
    paddingTop: 80,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    lineHeight: 1.4,
  },
  railItem: {
    paddingTop: 6,
    paddingBottom: 6,
    borderTop: '1px solid var(--rule)',
    marginBottom: 240,
  },
  // ─── Hero
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 220px',
    gap: 56,
    paddingTop: 80,
    paddingBottom: 80,
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
    marginBottom: 28,
  },
  lede: {
    fontSize: 17,
    lineHeight: 1.65,
    color: 'var(--ink-2)',
    maxWidth: 620,
    marginBottom: 32,
  },
  miniStats: {
    display: 'flex',
    gap: 36,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
  },
  miniStat: { display: 'flex', flexDirection: 'column', gap: 4 },
  miniStatNum: { color: 'var(--ink)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' },
  portrait: {
    width: 220,
    height: 264,
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    position: 'relative',
    overflow: 'hidden',
  },
  portraitImg: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 16%',
    filter: 'saturate(0.85) contrast(1.02)',
  },
  // ─── Section
  section: {
    paddingTop: 64,
    paddingBottom: 64,
    borderBottom: '1px solid var(--rule)',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: '-0.012em',
  },
  sectionMeta: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
  },
  // ─── Main row cards
  rowCard: {
    display: 'grid',
    gridTemplateColumns: '56px 220px 1fr 56px',
    gap: 28,
    padding: '28px 0',
    borderTop: '1px solid var(--rule)',
    cursor: 'pointer',
    alignItems: 'start',
  },
  rowIndex: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    color: 'var(--ink-3)',
    paddingTop: 8,
    fontWeight: 500,
  },
  rowThumb: {
    width: 220, height: 124,
    background: 'var(--paper-2)',
    border: '1px solid var(--rule)',
    backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 10px, rgba(31,29,26,0.04) 10px 11px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--ink-3)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  rowTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.014em',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  rowOneLine: {
    fontSize: 15.5,
    lineHeight: 1.6,
    color: 'var(--ink-2)',
    marginBottom: 16,
    maxWidth: 620,
  },
  metaRow: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
  },
  metaPill: {
    border: '1px solid var(--rule)',
    borderRadius: 999,
    padding: '3px 10px',
    background: 'var(--paper)',
    color: 'var(--ink-2)',
  },
  metaPillAccent: {
    border: '1px solid var(--sage-300)',
    background: 'var(--sage-50)',
    color: 'var(--sage-700)',
  },
  arrow: {
    paddingTop: 8,
    color: 'var(--ink-3)',
    fontSize: 22,
    textAlign: 'right',
  },
  // ─── Labs grid
  labsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  labCard: {
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    padding: 20,
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  labEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
  },
  labTitle: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
  },
  labLine: {
    fontSize: 13.5,
    lineHeight: 1.5,
    color: 'var(--ink-2)',
    marginTop: 'auto',
  },
  // ─── Footer
  footer: {
    padding: '56px 0 80px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
    letterSpacing: '0.04em',
  },
};

// Placeholder content — real names kept (already in master), values dashed.
const NB_MAIN = [
  { idx: '01', title: 'Cartapli', oneLine: '한 줄 정의 자리. 길이감을 확보하기 위해 두 줄 분량으로 채워둔 placeholder 텍스트.', meta: ['── 주차 / ── 인 / Steam', '본인 역할 자리'] },
  { idx: '02', title: 'Wobble Wobble', oneLine: '한 줄 정의 자리. 동일 길이의 placeholder 카피로 행 카드의 시각 리듬을 확인.', meta: ['── 주차 / ── 인 / Steam', '본인 역할 자리'] },
  { idx: '03', title: 'DX11 Engine', oneLine: '한 줄 정의 자리. 메인 3 카드의 텍스트 분량 표준을 잡기 위한 placeholder.', meta: ['── 주차 / 1 인', '본인 역할 자리'] },
];
const NB_LABS = [
  { idx: 'L.01', title: 'UE5 Action', tag: 'UE5 · C++' },
  { idx: 'L.02', title: 'Ring Dash', tag: 'Variant Workflow' },
  { idx: 'L.03', title: 'Multi-Leg Creature', tag: 'FABRIK IK' },
  { idx: 'L.04', title: 'BBQ Master', tag: 'Voxel Sim' },
  { idx: 'L.05', title: 'Staring Fire', tag: 'GPU Fluid' },
  { idx: 'L.06', title: '1000 Kittens', tag: 'Editor Tool' },
];

function VariantA_Notebook() {
  return (
    <div style={notebookStyles.page}>
      <div style={notebookStyles.header}>
        <div style={notebookStyles.brand}>
          <span style={notebookStyles.brandMark}></span>
          JCH / PORTFOLIO
        </div>
        <div style={notebookStyles.nav}>
          <span style={{...notebookStyles.navItem, ...notebookStyles.navActive}}>Index</span>
          <span style={notebookStyles.navItem}>Projects</span>
          <span style={notebookStyles.navItem}>Labs</span>
          <span style={notebookStyles.navItem}>About</span>
          <span style={notebookStyles.navItem}>Resume</span>
        </div>
      </div>

      <div style={notebookStyles.body}>
        {/* Structural label rail */}
        <div style={notebookStyles.rail}>
          <div style={notebookStyles.railItem}>Identity</div>
          <div style={notebookStyles.railItem}>Featured</div>
          <div style={notebookStyles.railItem}>Labs</div>
          <div style={notebookStyles.railItem}>Footer</div>
        </div>

        {/* Main content column */}
        <div>
          {/* HERO */}
          <div style={notebookStyles.hero}>
            <div>
              <div style={notebookStyles.eyebrow}>Identity ─ Engineering / Tools</div>
              <h1 style={notebookStyles.display}>
                시스템을 짓고, 도구를 만들고,<br />
                <mark className="hl">그 도구가 스스로 돌게</mark> 한다.
              </h1>
              <p style={notebookStyles.lede}>
                두 줄 분량의 placeholder 본문. 정체성 한 줄 + 본문 자리.
                실제 카피는 디자이너 / 사용자 협의로 별도 작성.
              </p>
              <div style={notebookStyles.miniStats}>
                <div style={notebookStyles.miniStat}>
                  <span style={notebookStyles.miniStatNum}>09</span>
                  <span>projects</span>
                </div>
                <div style={notebookStyles.miniStat}>
                  <span style={notebookStyles.miniStatNum}>02</span>
                  <span>Steam releases</span>
                </div>
                <div style={notebookStyles.miniStat}>
                  <span style={notebookStyles.miniStatNum}>16w</span>
                  <span>solo engine</span>
                </div>
              </div>
            </div>
            <div style={notebookStyles.portrait}>
              <img src="assets/profile-glasses.png" alt="" style={notebookStyles.portraitImg} />
            </div>
          </div>

          {/* MAIN — row cards */}
          <div style={notebookStyles.section}>
            <div style={notebookStyles.sectionHead}>
              <div style={notebookStyles.sectionTitle}>메인 프로젝트</div>
              <div style={notebookStyles.sectionMeta}>FEATURED · 03</div>
            </div>
            <div>
              {NB_MAIN.map((p, i) => (
                <div key={p.idx} style={{...notebookStyles.rowCard, borderBottom: i === NB_MAIN.length - 1 ? '1px solid var(--rule)' : 'none'}}>
                  <div style={notebookStyles.rowIndex}>{p.idx}</div>
                  <div style={notebookStyles.rowThumb}>[ thumbnail ]</div>
                  <div>
                    <div style={notebookStyles.rowTitle}>{p.title}</div>
                    <div style={notebookStyles.rowOneLine}>{p.oneLine}</div>
                    <div style={notebookStyles.metaRow}>
                      <span style={{...notebookStyles.metaPill, ...notebookStyles.metaPillAccent}}>{p.meta[0]}</span>
                      <span style={notebookStyles.metaPill}>{p.meta[1]}</span>
                    </div>
                  </div>
                  <div style={notebookStyles.arrow}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* LABS — small card grid */}
          <div style={notebookStyles.section}>
            <div style={notebookStyles.sectionHead}>
              <div style={notebookStyles.sectionTitle}>Labs</div>
              <div style={notebookStyles.sectionMeta}>PROOF OF CONCEPT · 06</div>
            </div>
            <div style={notebookStyles.labsGrid}>
              {NB_LABS.map(l => (
                <div key={l.idx} style={notebookStyles.labCard}>
                  <div style={notebookStyles.labEyebrow}>
                    <span>{l.idx}</span>
                    <span>{l.tag}</span>
                  </div>
                  <div style={notebookStyles.labTitle}>{l.title}</div>
                  <div style={notebookStyles.labLine}>
                    PoC 한 줄 정의 자리. placeholder 분량으로 카드의 텍스트 호흡을 확인.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div style={notebookStyles.footer}>
            <div>JCH · 2026 · last update ──.──</div>
            <div style={{ textAlign: 'right' }}>about / resume / contact</div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
}

window.VariantA_Notebook = VariantA_Notebook;
