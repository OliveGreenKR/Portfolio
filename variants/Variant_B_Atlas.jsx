// Variant B — Atlas (Spec Sheet)
// 12 컬럼 강한 격자 · 한 화면에 모든 프로젝트 · 스펙 시트 톤
// placeholder 데이터, 시각 언어 비교용.

const atlasStyles = {
  page: {
    width: '100%',
    minHeight: '100%',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
  },
  // ─── Top bar
  topbar: {
    height: 52,
    borderBottom: '1px solid var(--rule)',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '0 40px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  topbarCenter: {
    color: 'var(--ink)',
    fontWeight: 600,
    letterSpacing: '0.18em',
  },
  topbarRight: { textAlign: 'right' },
  // ─── Identity strip
  idStrip: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    borderBottom: '1px solid var(--rule)',
  },
  idLeft: {
    padding: '36px 40px',
    borderRight: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  brand: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginBottom: 4,
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.018em',
    lineHeight: 1.12,
    color: 'var(--ink)',
  },
  brandLine: {
    fontSize: 13.5,
    lineHeight: 1.55,
    color: 'var(--ink-2)',
    marginTop: 4,
  },
  portrait: {
    width: '100%',
    aspectRatio: '4 / 5',
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    marginTop: 'auto',
    overflow: 'hidden',
  },
  portraitImg: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 16%',
    filter: 'saturate(0.85) contrast(1.02)',
  },
  idRight: {
    padding: '36px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  pitchEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  pitch: {
    fontFamily: 'var(--font-display)',
    fontSize: 36,
    fontWeight: 600,
    lineHeight: 1.22,
    letterSpacing: '-0.014em',
    color: 'var(--ink)',
    maxWidth: 800,
  },
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    borderTop: '1px solid var(--rule)',
    marginTop: 'auto',
  },
  stat: {
    padding: '14px 18px',
    borderLeft: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statN: {
    fontFamily: 'var(--font-mono)',
    fontSize: 22,
    color: 'var(--ink)',
    letterSpacing: '-0.01em',
    fontWeight: 500,
  },
  statL: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  // ─── Grid section
  gridSection: {
    padding: '40px 40px 56px',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '1px solid var(--rule)',
  },
  sectionLabelLeft: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
  },
  sectionLabelTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--ink)',
    letterSpacing: '-0.008em',
    marginRight: 'auto',
    marginLeft: 16,
  },
  sectionLabelRight: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    color: 'var(--ink-3)',
  },
  // ─── Main 3 tiles
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    marginBottom: 32,
  },
  mainTile: {
    padding: 24,
    background: 'var(--paper)',
    borderRight: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 320,
  },
  mainTileLast: {
    borderRight: 'none',
  },
  tileEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tileTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: '-0.014em',
    marginBottom: 6,
  },
  tileOneLine: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'var(--ink-2)',
    marginBottom: 16,
  },
  tileThumb: {
    height: 120,
    background: 'var(--paper-2)',
    border: '1px solid var(--rule)',
    backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 10px, rgba(31,29,26,0.04) 10px 11px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--ink-3)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  // Spec ledger
  ledger: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-2)',
    marginTop: 'auto',
  },
  ledgerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px dashed var(--rule)',
  },
  ledgerRowKey: { color: 'var(--ink-3)', letterSpacing: '0.08em' },
  ledgerRowVal: { color: 'var(--ink)', fontWeight: 500 },
  // ─── Labs 6 tiles
  labsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 0,
    border: '1px solid var(--rule)',
  },
  labTile: {
    padding: 18,
    background: 'var(--paper)',
    borderRight: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
  },
  labTileLast: {
    borderRight: 'none',
  },
  labEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.16em',
    color: 'var(--ink-3)',
    marginBottom: 12,
  },
  labTitle: {
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1.3,
    marginBottom: 8,
  },
  labLine: {
    fontSize: 12,
    lineHeight: 1.5,
    color: 'var(--ink-2)',
    marginTop: 'auto',
  },
  labTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'var(--ink-3)',
    marginTop: 8,
    borderTop: '1px solid var(--rule)',
    paddingTop: 8,
  },
  // ─── Footer
  footer: {
    borderTop: '1px solid var(--rule)',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
};

const AT_MAIN = [
  { code: 'P.01', title: 'Cartapli', oneLine: '한 줄 정의 자리 (placeholder).',
    ledger: [['period', '── w / ── p'], ['platform', 'Steam'], ['role', '── + ──'], ['scale', '── files']] },
  { code: 'P.02', title: 'Wobble Wobble', oneLine: '한 줄 정의 자리 (placeholder).',
    ledger: [['period', '── w / ── p'], ['platform', 'Steam'], ['role', 'PM + Dev'], ['scale', '── tests']] },
  { code: 'P.03', title: 'DX11 Engine', oneLine: '한 줄 정의 자리 (placeholder).',
    ledger: [['period', '── w / 1 p'], ['platform', 'Standalone'], ['role', 'Engine'], ['scale', '── files']] },
];

const AT_LABS = [
  { code: 'L.01', title: 'UE5 Action', tag: 'UE5 · C++' },
  { code: 'L.02', title: 'Ring Dash', tag: 'Variant Flow' },
  { code: 'L.03', title: 'Multi-Leg', tag: 'FABRIK IK' },
  { code: 'L.04', title: 'BBQ Master', tag: 'Voxel Sim' },
  { code: 'L.05', title: 'Staring Fire', tag: 'GPU Fluid' },
  { code: 'L.06', title: '1000 Kittens', tag: 'Editor' },
];

function VariantB_Atlas() {
  return (
    <div style={atlasStyles.page}>
      <div style={atlasStyles.topbar}>
        <div>JCH ─ PORTFOLIO ─ INDEX</div>
        <div style={atlasStyles.topbarCenter}>2026.05</div>
        <div style={atlasStyles.topbarRight}>Projects · Labs · About · Resume</div>
      </div>

      <div style={atlasStyles.idStrip}>
        <div style={atlasStyles.idLeft}>
          <div style={atlasStyles.brand}>Game / Engine Developer</div>
          <div style={atlasStyles.brandTitle}>JCH</div>
          <div style={atlasStyles.brandLine}>두세 줄 분량 placeholder 자기 소개 카피. 실제 카피는 사용자 / 디자이너 협의로 별도 작성.</div>
          <div style={atlasStyles.portrait}>
            <img src="assets/profile-glasses.png" alt="" style={atlasStyles.portraitImg} />
          </div>
        </div>
        <div style={atlasStyles.idRight}>
          <div style={atlasStyles.pitchEyebrow}>Statement</div>
          <div style={atlasStyles.pitch}>
            시스템 아키텍처 결정 · 장기 프로젝트 운영 · PoC 사고 사이클.<br/>
            세 결을 <mark className="hl">한 페이지에서</mark> 펼친다.
          </div>
          <div style={atlasStyles.statRow}>
            {[
              ['09', 'projects'],
              ['02', 'releases'],
              ['16w', 'engine'],
              ['14', 'langs'],
              ['84', 'tests'],
              ['200+', 'contacts'],
            ].map(([n, l], i) => (
              <div key={i} style={{...atlasStyles.stat, ...(i === 0 ? { borderLeft: 'none' } : {})}}>
                <span style={atlasStyles.statN}>{n}</span>
                <span style={atlasStyles.statL}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN 3 tiles */}
      <div style={atlasStyles.gridSection}>
        <div style={atlasStyles.sectionLabel}>
          <div style={atlasStyles.sectionLabelLeft}>§ 01</div>
          <div style={atlasStyles.sectionLabelTitle}>메인 프로젝트</div>
          <div style={atlasStyles.sectionLabelRight}>FEATURED / 03 ─ system depth</div>
        </div>
        <div style={atlasStyles.mainGrid}>
          {AT_MAIN.map((p, i) => (
            <div key={p.code} style={{...atlasStyles.mainTile, ...(i === AT_MAIN.length - 1 ? atlasStyles.mainTileLast : {})}}>
              <div style={atlasStyles.tileEyebrow}>
                <span>{p.code}</span>
                <span>→</span>
              </div>
              <div style={atlasStyles.tileThumb}>[ thumbnail ]</div>
              <div style={atlasStyles.tileTitle}>{p.title}</div>
              <div style={atlasStyles.tileOneLine}>{p.oneLine}</div>
              <div style={atlasStyles.ledger}>
                {p.ledger.map(([k, v]) => (
                  <div key={k} style={atlasStyles.ledgerRow}>
                    <span style={atlasStyles.ledgerRowKey}>{k}</span>
                    <span style={atlasStyles.ledgerRowVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* LABS 6 tiles */}
        <div style={atlasStyles.sectionLabel}>
          <div style={atlasStyles.sectionLabelLeft}>§ 02</div>
          <div style={atlasStyles.sectionLabelTitle}>Labs</div>
          <div style={atlasStyles.sectionLabelRight}>PROOF OF CONCEPT / 06 ─ thinking cycle</div>
        </div>
        <div style={atlasStyles.labsGrid}>
          {AT_LABS.map((l, i) => (
            <div key={l.code} style={{...atlasStyles.labTile, ...(i === AT_LABS.length - 1 ? atlasStyles.labTileLast : {})}}>
              <div style={atlasStyles.labEyebrow}>{l.code}</div>
              <div style={atlasStyles.labTitle}>{l.title}</div>
              <div style={atlasStyles.labLine}>PoC 한 줄 정의 자리.</div>
              <div style={atlasStyles.labTag}>{l.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={atlasStyles.footer}>
        <span>jch · 2026 · last update ──.──</span>
        <span>about · resume · contact</span>
      </div>
    </div>
  );
}

window.VariantB_Atlas = VariantB_Atlas;
