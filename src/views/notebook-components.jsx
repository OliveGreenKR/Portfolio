// pages/cartapli/components.jsx
// Reusable building blocks for the Notebook page (Cartapli).
// Pattern: function components that read from window.CARTAPLI_DATA and emit
// the page's structural primitives (Eyebrow, Section, SystemBlock, Mermaid, Table, AsciiBlock).

const { useEffect, useRef, useState, useId } = React;

/* ─── Mermaid (lazy, toggle-revealed, fullscreen-able) ──── */
let __mmCount = 0;
function MermaidFullscreen({ svgHtml, title, onClose }) {
  const bodyRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.innerHTML = svgHtml || '';
  }, [svgHtml]);

  // Portal to body to escape any clipping/stacking from the article.
  return ReactDOM.createPortal(
    <div className="nb-diagram-fs-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="nb-diagram-fs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nb-diagram-fs-head">
          <span className="nb-diagram-fs-lbl">{title}</span>
          <span className="nb-diagram-fs-hint">esc · 백드롭 클릭으로 닫기 · 휠/트랙패드로 스크롤</span>
          <button type="button" className="nb-diagram-fs-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="nb-diagram-fs-body" ref={bodyRef}></div>
      </div>
    </div>,
    document.body
  );
}

function MermaidToggle({ source, label = '아키텍처 다이어그램', hint = 'click to expand' }) {
  const hostRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [svgHtml, setSvgHtml] = useState('');
  const [fs, setFs] = useState(false);
  const id = useRef(`mm-${++__mmCount}`).current;

  useEffect(() => {
    if (!open || rendered) return;
    let cancelled = false;
    (async () => {
      const m = window.mermaid;
      if (!m) return;
      try {
        const { svg } = await m.render(id + '-svg', source);
        if (cancelled) return;
        if (hostRef.current) {
          hostRef.current.innerHTML = svg;
          setSvgHtml(svg);
          setRendered(true);
        }
      } catch (e) {
        if (hostRef.current) hostRef.current.innerHTML = `<pre style="white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;color:var(--terra-500)">mermaid render error\n${(e && e.message) || e}</pre>`;
      }
    })();
    return () => { cancelled = true; };
  }, [open, rendered, source, id]);

  return (
    <details className="nb-diagram" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <span className="plus">+</span>
        <span className="name">{label}</span>
        <span className="hint">{hint}</span>
      </summary>
      <div className="mermaid-host-wrap">
        <div className="mermaid-host" ref={hostRef}></div>
        {rendered && (
          <button
            type="button"
            className="mermaid-fs-btn"
            onClick={(e) => { e.preventDefault(); setFs(true); }}
            aria-label="확대 보기"
            title="확대 보기 (esc 로 닫기)"
          >
            <span className="glyph" aria-hidden="true">⤢</span>
            <span className="t">확대</span>
          </button>
        )}
      </div>
      {open && !rendered && <div className="mermaid-loading">rendering…</div>}
      {fs && <MermaidFullscreen svgHtml={svgHtml} title={label} onClose={() => setFs(false)} />}
    </details>
  );
}
window.MermaidToggle = MermaidToggle;

/* ─── Structural label + body row (PROBLEM / DECISION / RESULT) ─ */
function PRDRow({ label, kind = 'problem', children }) {
  return (
    <div className={`nb-prd ${kind}`}>
      <div className="nb-prd-label">{label}</div>
      <div className="nb-prd-body">{children}</div>
    </div>
  );
}
window.PRDRow = PRDRow;

/* ─── Markdown-ish inline emphasis
   Recognises **bold** and `code` and *italic-em* fragments.
   Used to keep the data plain-text in data.js. */
function renderInline(text) {
  if (typeof text !== 'string') return text;
  const out = [];
  let last = 0;
  // Combined regex covering **bold**, `code`, *italic-emphasis*
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      out.push(<strong key={m.index}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('`')) {
      out.push(<code key={m.index}>{tok.slice(1, -1)}</code>);
    } else {
      out.push(<em key={m.index}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
window.renderInline = renderInline;

/* ─── Singleton/data table ──────────────────────────────── */
function DataTable({ title, headers, rows, className = '' }) {
  const ri = window.renderInline || ((x) => x);
  return (
    <div className={`nb-tablewrap ${className}`}>
      {title && <div className="nb-tablewrap-title">{ri(title)}</div>}
      <table className="nb-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{ri(h)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => <td key={j}>{ri(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
window.DataTable = DataTable;

/* ─── FSM trail (visual horizontal step strip) ──────────── */
function FSMTrail({ steps }) {
  return (
    <div className="nb-fsm">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <span className="nb-fsm-step">{s}</span>
          {i < steps.length - 1 && <span className="nb-fsm-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
window.FSMTrail = FSMTrail;

/* ─── ASCII / code block ────────────────────────────────── */
function AsciiBlock({ title, intro, code, result }) {
  // Very light syntax tinting — comments only.
  const lines = code.split('\n').map((line, i) => {
    const trim = line.trimStart();
    if (trim.startsWith('//')) {
      return <span key={i} className="c">{line + '\n'}</span>;
    }
    return line + '\n';
  });
  return (
    <div className="nb-ascii">
      <div className="nb-ascii-head">
        <span>CODE</span>
        <span className="lbl">{title}</span>
      </div>
      {intro && <div className="nb-ascii-intro">{intro}</div>}
      <pre>{lines}</pre>
      {result && <div className="nb-ascii-result">→ {result}</div>}
    </div>
  );
}
window.AsciiBlock = AsciiBlock;

/* ─── Screenshot carousel ───────────────────────────────── */
function ScreenshotCarousel({ shots }) {
  const [i, setI] = useState(0);
  const wrapRef = useRef(null);

  const prev = () => setI(p => (p - 1 + shots.length) % shots.length);
  const next = () => setI(p => (p + 1) % shots.length);

  // Keyboard arrows — only when carousel is in viewport, so other controls
  // (like the rail) don't get hijacked.
  useEffect(() => {
    const onKey = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shots.length]);

  const cur = shots[i];
  const total = shots.length;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="nb-carousel" ref={wrapRef}>
      <figure className="nb-carousel-main">
        <img key={cur.src} src={cur.src} alt={cur.caption} />
      </figure>

      <div className="nb-carousel-bar">
        <button type="button" className="nb-carousel-nav" onClick={prev} aria-label="이전">←</button>
        <span className="nb-carousel-idx">{pad(i + 1)} <span className="dim">/</span> {pad(total)}</span>
        <span className="nb-carousel-cap"><span className="tag">{cur.tag}</span> {cur.caption}</span>
        <button type="button" className="nb-carousel-nav" onClick={next} aria-label="다음">→</button>
      </div>

      <div className="nb-carousel-thumbs" role="tablist">
        {shots.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={idx === i}
            className={`nb-carousel-thumb ${idx === i ? 'active' : ''}`}
            onClick={() => setI(idx)}
            title={s.caption}
          >
            <img src={s.src} alt="" />
            <span className="thumb-idx">{pad(idx + 1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
window.ScreenshotCarousel = ScreenshotCarousel;

/* ─── System block — wraps one §3.x ─────────────────────── */
function SystemBlock({ system }) {
  const slug = `sys-${system.no.replace('.', '-')}`;
  return (
    <article id={slug} className="nb-system">
      <div className="nb-system-head">
        <span className="nb-system-no">§ {system.no}</span>
        <h3 className="nb-system-title">{system.title}</h3>
        <span className="nb-system-kind">{system.kind}</span>
      </div>
      {system.lede && <p className="nb-system-lede">{renderInline(system.lede)}</p>}

      <PRDRow label="문제" kind="problem">{renderInline(system.problem)}</PRDRow>
      <PRDRow label="결정" kind="decision">{renderInline(system.decision)}</PRDRow>
      <PRDRow label="결과" kind="result">
        <ul>
          {system.results.map((r, i) => <li key={i}>{renderInline(r)}</li>)}
        </ul>
      </PRDRow>

      {system.stack && (
        <div className="nb-stack">
          {system.stack.map(s => <span key={s}>{renderInline(s)}</span>)}
        </div>
      )}

      {system.fsmTrail && <FSMTrail steps={system.fsmTrail} />}

      {system.mermaid && (
        <MermaidToggle
          source={system.mermaid}
          label={`다이어그램 — § ${system.no} ${system.title}`}
          hint="펼치기"
        />
      )}

      {system.table && (
        <DataTable
          title={system.tableTitle}
          headers={system.table.headers}
          rows={system.table.rows}
        />
      )}

      {system.ascii && (
        <AsciiBlock
          title={system.ascii.title}
          intro={system.ascii.intro}
          code={system.ascii.code}
          result={system.ascii.result}
        />
      )}
    </article>
  );
}
window.SystemBlock = SystemBlock;
