// src/views/notebook-mermaid-init.js
// Shared mermaid configuration for Notebook-style project pages.
// Loaded after mermaid CDN and before React renders.
// Tokens map to Notebook paper/sage/terra/wheat/dusty/plum palette.
//
// fontSize bumped 13→16 (flow) / 12→14 (gantt) per user feedback: the previous
// 13px sat below typical web body text and felt cramped after the SVG shrank
// to fit the container. Diagrams are now larger so horizontal scroll appears
// more often inside the host — paired with the fullscreen modal on
// MermaidToggle to give a way out.
(function () {
  if (!window.mermaid) return;
  window.mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      background: '#fbf9f5',
      primaryColor: '#f4f1ea',
      primaryTextColor: '#1f1d1a',
      primaryBorderColor: '#d9d3c4',
      lineColor: '#4a463f',
      secondaryColor: '#e6efdf',
      tertiaryColor: '#f5dcd2',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      fontSize: '16px',
      mainBkg: '#f4f1ea',
      edgeLabelBackground: '#fbf9f5',
      /* Gantt-specific */
      sectionBkgColor: '#f4f1ea',
      sectionBkgColor2: '#ebe6da',
      altSectionBkgColor: '#fbf9f5',
      taskBkgColor: '#e6efdf',
      taskTextColor: '#1f1d1a',
      taskTextDarkColor: '#1f1d1a',
      taskTextLightColor: '#1f1d1a',
      taskTextOutsideColor: '#4a463f',
      taskBorderColor: '#7ea571',
      activeTaskBkgColor: '#f5dcd2',
      activeTaskBorderColor: '#c8674f',
      doneTaskBkgColor: '#ebe6da',
      doneTaskBorderColor: '#807a6e',
      critBkgColor: '#f5dcd2',
      critBorderColor: '#c8674f',
      gridColor: '#d9d3c4',
      todayLineColor: '#a84e38',
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 16,
      nodeSpacing: 36,
      rankSpacing: 56,
    },
    gantt: {
      barHeight: 26,
      barGap: 6,
      topPadding: 56,
      leftPadding: 150,
      gridLineStartPadding: 40,
      fontSize: 14,
      sectionFontSize: 14,
      numberSectionStyles: 4,
    },
  });
})();
