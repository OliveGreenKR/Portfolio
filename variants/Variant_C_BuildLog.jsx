// Variant C — Build Log (Module / Index)
// 모듈 번호 · 좌측 인덱스 레일 · 결정 로그 톤
// placeholder 데이터, 시각 언어 비교용.

const buildlogStyles = {
  page: {
    width: '100%',
    minHeight: '100%',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
  },
  // ─── Header
  header: {
    height: 56,
    borderBottom: '1px solid var(--rule)',
    display: 'grid',
    gridTemplateColumns: '120px 1fr auto',
    alignItems: 'center',
    padding: '0 32px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    color: 'var(--ink-3)',
  },
  headBrand: {
    fontWeight: 600,
    color: 'var(--ink)',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
  },
  headMid: {
    color: 'var(--ink-3)',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },
  headNav: {
    display: 'flex',
    gap: 20,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-2)',
  },
  // ─── Body grid
  body: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
  },
  rail: {
    borderRight: '1px solid var(--rule)',
    minHeight: '100%',
    padding: '32px 24px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-3)',
    letterSpacing: '0.08em',
  },
  railItem: {
    padding: '8px 0',
    borderTop: '1px solid var(--rule)',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--ink-3)',
  },
  railItemActive: {
    color: 'var(--ink)',
    fontWeight: 600,
    borderLeft: '2px solid var(--terra-300)',
    marginLeft: -24,
    paddingLeft: 22,
  },
  main: {
    padding: '40px 48px 56px',
  },
  // ─── Hero: build log
  heroBlock: {
    paddingBottom: 48,
    borderBottom: '1px solid var(--rule)',
    marginBottom: 48,
  },
  heroEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginBottom: 24,
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  heroEyebrowMark: {
    color: 'var(--terra-300)',
  },
  heroPitch: {
    fontFamily: 'var(--font-display)',
    fontSize: 44,
    lineHeight: 1.18,
    fontWeight: 700,
    letterSpacing: '-0.018em',
    color: 'var(--ink)',
    marginBottom: 32,
    maxWidth: 900,
  },
  logBlock: {
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    padding: '20px 24px',
    fontFamily: 'var(--font-mono)',
    fontSize: 12.5,
    color: 'var(--ink-2)',
    lineHeight: 1.9,
  },
  logHeader: {
    color: 'var(--ink-3)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontSize: 10,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px dashed var(--rule)',
    display: 'grid',
    gridTemplateColumns: '90px 1fr 200px 80px',
    gap: 16,
  },
  logRow: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 200px 80px',
    gap: 16,
    padding: '4px 0',
  },
  logRowAccent: {
    color: 'var(--ink)',
  },
  logTok: { color: 'var(--ink-3)' },
  logTokAccent: { color: 'var(--sage-700)', fontWeight: 600 },
  // ─── Section
  sectionHead: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr auto',
    alignItems: 'baseline',
    paddingBottom: 12,
    borderBottom: '1px solid var(--ink)',
    marginBottom: 24,
  },
  sectionN: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.16em',
    color: 'var(--ink-3)',
    fontWeight: 500,
  },
  sectionT: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '-0.012em',
    color: 'var(--ink)',
  },
  sectionM: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-3)',
    letterSpacing: '0.14em',
  },
  // ─── Main panels
  panel: {
    display: 'grid',
    gridTemplateColumns: '60px 320px 1fr',
    gap: 24,
    padding: '24px 0',
    borderBottom: '1px solid var(--rule)',
    alignItems: 'start',
  },
  panelIdx: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink)',
    letterSpacing: '0.08em',
    paddingTop: 6,
  },
  panelThumb: {
    width: 320,
    height: 200,
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
  panelBody: { display: 'flex', flexDirection: 'column', gap: 14 },
  panelTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
    flexWrap: 'wrap',
  },
  panelTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: '-0.014em',
    lineHeight: 1.15,
  },
  panelMeta: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-3)',
    letterSpacing: '0.1em',
    marginLeft: 'auto',
  },
  panelOneLine: {
    fontSize: 14.5,
    lineHeight: 1.6,
    color: 'var(--ink-2)',
    maxWidth: 680,
    marginBottom: 4,
  },
  decisions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    paddingTop: 4,
  },
  dCard: {
    padding: '12px 14px',
    border: '1px dashed var(--rule)',
    background: 'var(--paper)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  dHead: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  dBody: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: 'var(--ink)',
    fontWeight: 500,
  },
  // ─── Labs strip
  labsStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 0,
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
  },
  labRow: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr 160px 60px',
    alignItems: 'center',
    padding: '14px 20px',
    gap: 16,
    background: 'var(--paper)',
    borderBottom: '1px solid var(--rule)',
    borderRight: '1px solid var(--rule)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
  },
  labRowIdx: { color: 'var(--ink-3)', letterSpacing: '0.1em' },
  labRowTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--ink)',
    letterSpacing: '-0.005em',
  },
  labRowTag: {
    color: 'var(--ink-2)',
    letterSpacing: '0.1em',
  },
  labRowArrow: {
    textAlign: 'right',
    fontSize: 14,
    color: 'var(--ink-3)',
  },
  // ─── Footer
  footer: {
    borderTop: '1px solid var(--rule)',
    padding: '20px 48px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    color: 'var(--ink-3)',
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'uppercase',
  },
};

const BL_LOG = [
  { date: '2026.05', proj: 'ring-dash', kind: 'lab · 6d / 34 commits', out: '── decision' },
  { date: '2026.05', proj: 'multi-leg-creature', kind: 'lab · 1d / 15 commits', out: '── decision' },
  { date: '2026.05', proj: 'bbq-master', kind: 'lab · 3d / 30 commits', out: '── decision' },
  { date: '2026.04', proj: 'staring-fire', kind: 'lab · 3d / 29 commits', out: '── decision' },
  { date: '2026.04', proj: 'wobble-wobble', kind: 'main · 5 wks · 5 ppl', out: 'Steam release', accent: true },
  { date: '2026.02', proj: 'cartapli', kind: 'main · 13 wks · 4 ppl', out: 'Steam release', accent: true },
  { date: '2025.06', proj: 'dx11-engine', kind: 'main · 16 wks · solo', out: '── outcome', accent: true },
];

const BL_MAIN = [
  { idx: 'M.01', title: 'Cartapli', meta: '── w / ── p · Steam',
    oneLine: '한 줄 정의 자리 (placeholder).',
    decisions: [
      ['Architecture', '3-layer · ── 싱글톤'],
      ['Result', '신규 시스템 추가 / 기존 코드 변경 ──'],
      ['Tests', '── 종 / ── 케이스'],
    ]
  },
  { idx: 'M.02', title: 'Wobble Wobble', meta: '── w / ── p · Steam',
    oneLine: '한 줄 정의 자리 (placeholder).',
    decisions: [
      ['Compression', '── 주 압축 / 다축 워크스트림'],
      ['Sound', '── 테스트 케이스'],
      ['Automation', 'Claude Code · MCP · ── 언어'],
    ]
  },
  { idx: 'M.03', title: 'DX11 Engine', meta: '── w / 1 p · standalone',
    oneLine: '한 줄 정의 자리 (placeholder).',
    decisions: [
      ['Collision', 'O(n²) → O(n log n)'],
      ['CCD', '── m/s → ── m/s'],
      ['Determinism', '60 ↔ 30 fps 동일 결과'],
    ]
  },
];

const BL_LABS = [
  { idx: 'L.01', title: 'UE5 Action', tag: 'UE5 · C++' },
  { idx: 'L.02', title: 'Ring Dash', tag: 'Variant Flow' },
  { idx: 'L.03', title: 'Multi-Leg Creature', tag: 'FABRIK IK' },
  { idx: 'L.04', title: 'BBQ Master', tag: 'Voxel Sim' },
  { idx: 'L.05', title: 'Staring Fire', tag: 'GPU Fluid' },
  { idx: 'L.06', title: '1000 Kittens', tag: 'Editor Tool' },
];

function VariantC_BuildLog() {
  return (
    <div style={buildlogStyles.page}>
      <div style={buildlogStyles.header}>
        <div style={buildlogStyles.headBrand}>// JCH</div>
        <div style={buildlogStyles.headMid}>$ portfolio --view=index</div>
        <div style={buildlogStyles.headNav}>
          <span>projects</span>
          <span>labs</span>
          <span>about</span>
          <span>resume</span>
        </div>
      </div>

      <div style={buildlogStyles.body}>
        <div style={buildlogStyles.rail}>
          <div style={{...buildlogStyles.railItem, ...buildlogStyles.railItemActive}}>
            <span>00</span><span>log</span>
          </div>
          <div style={buildlogStyles.railItem}><span>01</span><span>main</span></div>
          <div style={buildlogStyles.railItem}><span>02</span><span>labs</span></div>
          <div style={buildlogStyles.railItem}><span>03</span><span>about</span></div>
          <div style={buildlogStyles.railItem}><span>04</span><span>cv</span></div>
          <div style={{ marginTop: 64, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-3)' }}>
            scroll<br/>synced
          </div>
        </div>

        <div style={buildlogStyles.main}>
          {/* HERO */}
          <div style={buildlogStyles.heroBlock}>
            <div style={buildlogStyles.heroEyebrow}>
              <span style={buildlogStyles.heroEyebrowMark}>●</span>
              <span>recent build log</span>
              <span>·</span>
              <span>updated 2026.05</span>
            </div>
            <h1 style={buildlogStyles.heroPitch}>
              <mark className="hl hl--terra">이 결정을 했다</mark>.<br/>
              그래서 이 결과가 나왔다.
            </h1>

            <div style={buildlogStyles.logBlock}>
              <div style={buildlogStyles.logHeader}>
                <span>DATE</span>
                <span>PROJECT</span>
                <span>SCOPE</span>
                <span>OUT</span>
              </div>
              {BL_LOG.map((row, i) => (
                <div key={i} style={{...buildlogStyles.logRow, ...(row.accent ? buildlogStyles.logRowAccent : {})}}>
                  <span style={buildlogStyles.logTok}>{row.date}</span>
                  <span style={row.accent ? { color: 'var(--ink)', fontWeight: 600 } : {}}>{row.proj}</span>
                  <span style={buildlogStyles.logTok}>{row.kind}</span>
                  <span style={row.accent ? buildlogStyles.logTokAccent : buildlogStyles.logTok}>{row.out}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN */}
          <div style={buildlogStyles.sectionHead}>
            <span style={buildlogStyles.sectionN}>§ 01</span>
            <span style={buildlogStyles.sectionT}>메인 프로젝트</span>
            <span style={buildlogStyles.sectionM}>FEATURED · 03</span>
          </div>
          <div style={{ marginBottom: 48 }}>
            {BL_MAIN.map(p => (
              <div key={p.idx} style={buildlogStyles.panel}>
                <div style={buildlogStyles.panelIdx}>{p.idx}</div>
                <div style={buildlogStyles.panelThumb}>[ thumbnail ]</div>
                <div style={buildlogStyles.panelBody}>
                  <div style={buildlogStyles.panelTitleRow}>
                    <span style={buildlogStyles.panelTitle}>{p.title}</span>
                    <span style={buildlogStyles.panelMeta}>{p.meta}</span>
                  </div>
                  <div style={buildlogStyles.panelOneLine}>{p.oneLine}</div>
                  <div style={buildlogStyles.decisions}>
                    {p.decisions.map(([k, v]) => (
                      <div key={k} style={buildlogStyles.dCard}>
                        <span style={buildlogStyles.dHead}>{k}</span>
                        <span style={buildlogStyles.dBody}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LABS */}
          <div style={buildlogStyles.sectionHead}>
            <span style={buildlogStyles.sectionN}>§ 02</span>
            <span style={buildlogStyles.sectionT}>Labs</span>
            <span style={buildlogStyles.sectionM}>PROOF OF CONCEPT · 06</span>
          </div>
          <div style={buildlogStyles.labsStrip}>
            {BL_LABS.map(l => (
              <div key={l.idx} style={buildlogStyles.labRow}>
                <span style={buildlogStyles.labRowIdx}>{l.idx}</span>
                <span style={buildlogStyles.labRowTitle}>{l.title}</span>
                <span style={buildlogStyles.labRowTag}>{l.tag}</span>
                <span style={buildlogStyles.labRowArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={buildlogStyles.footer}>
        <span>// jch · build 2026.05</span>
        <span>about · resume · contact</span>
      </div>
    </div>
  );
}

window.VariantC_BuildLog = VariantC_BuildLog;
