// JCH Portfolio — App.jsx (thin shell)
// All data lives in src/data/projects.js. All screens live in src/views/*.
// This file's only job is to pick a view and mount it.
//
// To produce the print edition, swap <WebPortfolio /> for <PrintPortfolio />
// or open this page and print — print.css will activate.

const View = window.WebPortfolio;
ReactDOM.createRoot(document.getElementById("root")).render(<View />);
