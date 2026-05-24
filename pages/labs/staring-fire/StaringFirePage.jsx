// pages/labs/staring-fire/StaringFirePage.jsx
function StaringFirePage() {
  return (
    <window.NotebookPage
      data={window.STARING_FIRE_DATA}
      crumb="labs / staring-fire"
      indexHref="../../pages/landing.html"
    />
  );
}
window.StaringFirePage = StaringFirePage;
