// pages/labs/ring-dash/RingDashPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function RingDashPage() {
  return (
    <window.NotebookPage
      data={window.RING_DASH_DATA}
      crumb="labs / ring-dash"
      indexHref="../../pages/landing.html"
    />
  );
}
window.RingDashPage = RingDashPage;
