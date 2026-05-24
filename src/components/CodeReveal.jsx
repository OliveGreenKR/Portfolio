// JCH Portfolio — CodeReveal.jsx
// One-depth-deeper code disclosure. Uses native <details> for print friendliness.

function CodeReveal({ file, html, children }) {
  return (
    <details className="t-code">
      <summary>
        View code <span className="t-code__file">{file}</span>
      </summary>
      {html
        ? <pre dangerouslySetInnerHTML={{ __html: html }} />
        : <pre>{children}</pre>}
    </details>
  );
}

window.CodeReveal = CodeReveal;
