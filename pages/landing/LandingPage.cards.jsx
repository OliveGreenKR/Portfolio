// pages/landing/LandingPage.cards.jsx
// Footer + 인라인 마크업 파서. window.LandingFooter, renderLandingInline.
// (메인 행 카드 · Labs 카드는 가로 캐러셀로 바뀌면서 사라졌다 — LandingPage.covers.jsx)

const cardStyles = {
  // ─── Main row card
  mainList: { display: 'flex', flexDirection: 'column' },
  rowCard: {
    display: 'grid',
    gridTemplateColumns: '52px 260px minmax(0, 1fr) 28px',
    gap: 28,
    padding: '28px 0',
    borderTop: '1px solid var(--rule)',
    alignItems: 'start',
    color: 'inherit',
    textDecoration: 'none',
    transition: 'background 160ms',
  },
  rowCardLast: { borderBottom: '1px solid var(--rule)' },
  rowIndex: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    color: 'var(--ink-3)',
    paddingTop: 10,
    fontWeight: 500,
  },
  thumb: {
    width: 260, height: 146,
    background: 'var(--paper-2)',
    border: '1px solid var(--rule)',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  thumbCode: {
    position: 'absolute', left: 8, top: 8,
    fontFamily: 'var(--font-mono)', fontSize: 9.5,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'var(--paper)',
    background: 'rgba(31,29,26,0.74)',
    padding: '3px 6px',
    borderRadius: 2,
  },
  rowBody: { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 },
  rowTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: '-0.016em',
    lineHeight: 1.18,
    margin: 0,
  },
  rowOneLine: {
    fontSize: 15.5,
    lineHeight: 1.6,
    color: 'var(--ink-2)',
    maxWidth: 640,
    margin: 0,
    textWrap: 'pretty',
  },
  metaRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    color: 'var(--ink-3)',
    marginTop: 2,
  },
  metaPill: {
    border: '1px solid var(--rule)',
    borderRadius: 999,
    padding: '3px 10px',
    background: 'var(--paper)',
    color: 'var(--ink-2)',
    letterSpacing: '0.02em',
  },
  metaPillAccent: {
    border: '1px solid var(--sage-300)',
    background: 'var(--sage-50)',
    color: 'var(--sage-700)',
  },
  metricsList: {
    marginTop: 10,
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    columnGap: 18,
    rowGap: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 12.5,
    color: 'var(--ink-2)',
    borderTop: '1px dashed var(--rule)',
    paddingTop: 12,
  },
  metricN: { color: 'var(--ink)', fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' },
  metricLabel: { color: 'var(--ink-3)', fontSize: 12, lineHeight: 1.5, fontFamily: 'var(--font-sans)' },
  arrow: {
    paddingTop: 10,
    color: 'var(--ink-3)',
    fontSize: 22,
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
    transition: 'transform 160ms, color 160ms',
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
    padding: 22,
    minHeight: 184,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    color: 'inherit',
    textDecoration: 'none',
    transition: 'background 160ms, border-color 160ms',
  },
  labEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
  },
  labTag: { color: 'var(--ink-2)' },
  labTitle: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.012em',
    lineHeight: 1.25,
    fontFamily: 'var(--font-display)',
    margin: 0,
  },
  labDuration: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-3)',
    letterSpacing: '0.04em',
  },
  labLine: {
    fontSize: 13.5,
    lineHeight: 1.55,
    color: 'var(--ink-2)',
    marginTop: 'auto',
    textWrap: 'pretty',
  },
  labPlaceholderNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    opacity: 0.6,
  },

  // ─── Footer
  footer: {
    padding: '64px 0 96px',
    marginTop: 64,
    borderTop: '1px solid var(--rule)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-3)',
    letterSpacing: '0.04em',
  },
  footerRight: {
    textAlign: 'right',
    display: 'flex',
    gap: 20,
    justifyContent: 'flex-end',
  },
  footerLink: { color: 'inherit', textDecoration: 'none' },
};

// renderInline — *italic* / **bold** / `code` 미니 파서.
// notebook-components.jsx 에 같은 함수가 있지만 랜딩은 그쪽 컴포넌트 의존을 피하기 위해 자체 사본.
function renderLandingInline(s) {
  if (!s) return null;
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      parts.push(<strong key={i++}><mark className="hl">{tok.slice(2, -2)}</mark></strong>);
    } else if (tok.startsWith('*')) {
      parts.push(<em key={i++}><mark className="hl hl--terra">{tok.slice(1, -1)}</mark></em>);
    } else {
      parts.push(<code key={i++} className="code">{tok.slice(1, -1)}</code>);
    }
    last = m.index + tok.length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

function LandingFooter({ data }) {
  const hrefMap = { about: 'about.html', contact: 'about.html#links' };
  return (
    <div style={cardStyles.footer}>
      <div>{data.left}</div>
      <div style={cardStyles.footerRight}>
        {data.right.map((r, i) => (
          <a key={i} href={hrefMap[r] || '#'} style={cardStyles.footerLink}>{r}</a>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { LandingFooter, renderLandingInline });
