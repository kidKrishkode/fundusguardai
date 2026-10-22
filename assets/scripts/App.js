(function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const theme = savedTheme ? savedTheme : systemPrefersDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
})();
