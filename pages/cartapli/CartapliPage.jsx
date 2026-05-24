// pages/cartapli/CartapliPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function CartapliPage() {
  return <window.NotebookPage data={window.CARTAPLI_DATA} crumb="projects / cartapli" />;
}
window.CartapliPage = CartapliPage;
