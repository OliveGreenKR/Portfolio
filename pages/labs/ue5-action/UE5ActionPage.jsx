// pages/labs/ue5-action/UE5ActionPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
// Labs 압축 패턴: crumb 만 `labs / {slug}` 로 바꾸고 indexHref 를 랜딩으로.
function UE5ActionPage() {
  return (
    <window.NotebookPage
      data={window.UE5_ACTION_DATA}
      crumb="labs / ue5-action"
      indexHref="../../pages/landing.html"
    />
  );
}
window.UE5ActionPage = UE5ActionPage;
