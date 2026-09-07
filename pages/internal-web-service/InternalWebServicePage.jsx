// pages/internal-web-service/InternalWebServicePage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function InternalWebServicePage() {
  return <window.NotebookPage data={window.INTERNAL_WEB_SERVICE_DATA} crumb="projects / internal-web-service" coverSlug="internal-web-service" />;
}
window.InternalWebServicePage = InternalWebServicePage;
