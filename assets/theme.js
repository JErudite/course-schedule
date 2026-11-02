// Picks the colour theme before the page paints: deep-space by default, day if the viewer chose it.
(() => {
  let theme = "dark";
  try { if (localStorage.getItem("cs-theme") === "light") theme = "light"; } catch { /* storage blocked: keep the default */ }
  document.documentElement.dataset.theme = theme;
  window.setCourseTheme = (next) => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("cs-theme", next); } catch { /* not remembered, still applied */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#05070f" : "#f6f7fb";
  };
})();
