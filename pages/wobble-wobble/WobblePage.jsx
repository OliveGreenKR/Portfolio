// pages/wobble-wobble/WobblePage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function WobblePage() {
  return <window.NotebookPage data={window.WOBBLE_DATA} crumb="projects / wobble-wobble" />;
}
window.WobblePage = WobblePage;
