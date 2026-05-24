// pages/labs/bbq-master/BBQMasterPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function BBQMasterPage() {
  return (
    <window.NotebookPage
      data={window.BBQ_MASTER_DATA}
      crumb="labs / bbq-master"
      indexHref="../../pages/landing.html"
    />
  );
}
window.BBQMasterPage = BBQMasterPage;
