// JCH Portfolio — Tag.jsx
// Single source of truth for the project-tag primitive.
// Visual style lives in src/styles/components.css (.t-tag class).

const TAG_KINDS = ["arch", "algo", "perf", "debug", "tool"];

function Tag({ kind = "arch", label, children }) {
  const k = TAG_KINDS.includes(kind) ? kind : "arch";
  return (
    <span className={`t-tag t-tag--${k}`}>
      <span className="t-tag__dot" />
      {label || children}
    </span>
  );
}

window.Tag = Tag;
window.TAG_KINDS = TAG_KINDS;
