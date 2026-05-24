// JCH Portfolio — Callout.jsx
// kind: "warn" (terracotta dashed) | "ok" (sage solid) | "note" (default)

function Callout({ kind = "note", children }) {
  const glyph = kind === "warn" ? "⚠" : kind === "ok" ? "✓" : "·";
  const cls = kind === "note" ? "t-callout" : `t-callout t-callout--${kind}`;
  return (
    <div className={cls}>
      <span className="t-callout__glyph">{glyph}</span>
      <div>{children}</div>
    </div>
  );
}

window.Callout = Callout;
