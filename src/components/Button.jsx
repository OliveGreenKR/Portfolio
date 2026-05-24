// JCH Portfolio — Button.jsx
// Visual style: .t-btn / .t-btn--secondary / .t-btn--ghost / .t-btn--terra / .t-btn--sage

function Button({ variant = "primary", onClick, children, type = "button" }) {
  const cls = variant === "primary" ? "t-btn" : `t-btn t-btn--${variant}`;
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

window.Button = Button;
