// pages/labs/multi-leg-creature/MultiLegPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function MultiLegPage() {
  return (
    <window.NotebookPage
      data={window.MULTI_LEG_DATA}
      crumb="labs / multi-leg-creature"
      indexHref="../../pages/landing.html"
    />
  );
}
window.MultiLegPage = MultiLegPage;
