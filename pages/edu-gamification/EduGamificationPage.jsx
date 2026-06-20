// pages/edu-gamification/EduGamificationPage.jsx
// Thin entry — composition lives in src/views/NotebookPage.jsx.
function EduGamificationPage() {
  return <window.NotebookPage data={window.EDU_GAMIFICATION_DATA} crumb="projects / edu-gamification" />;
}
window.EduGamificationPage = EduGamificationPage;
