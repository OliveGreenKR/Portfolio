// pages/motelet/MoteletPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function MoteletPage() {
  return <window.NotebookPage data={window.MOTELET_DATA} crumb="projects / motelet" />;
}
window.MoteletPage = MoteletPage;
