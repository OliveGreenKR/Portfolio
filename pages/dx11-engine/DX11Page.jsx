// pages/dx11-engine/DX11Page.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function DX11Page() {
  return <window.NotebookPage data={window.DX11_DATA} crumb="projects / dx11-engine" />;
}
window.DX11Page = DX11Page;
