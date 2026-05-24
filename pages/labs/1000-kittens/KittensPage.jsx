// pages/labs/1000-kittens/KittensPage.jsx
function KittensPage() {
  return (
    <window.NotebookPage
      data={window.KITTENS_DATA}
      crumb="labs / 1000-kittens"
      indexHref="../../pages/landing.html"
    />
  );
}
window.KittensPage = KittensPage;
