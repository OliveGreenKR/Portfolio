// pages/labs/sound-system/SoundSystemPage.jsx
function SoundSystemPage() {
  return (
    <window.NotebookPage
      data={window.SOUND_SYSTEM_DATA}
      crumb="labs / sound-system"
      indexHref="../../pages/landing.html"
    />
  );
}
window.SoundSystemPage = SoundSystemPage;
