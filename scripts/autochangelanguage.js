(function () {
  var saved = localStorage.getItem("lang");

  // Определяем язык браузера
  var nav = (
    navigator.language ||
    navigator.userLanguage ||
    "en"
  ).toLowerCase();

  // Выбираем язык: сохранённый или авто
  var auto =
    saved ||
    (nav.startsWith("ru")
      ? "ru"
      : nav.startsWith("uk") || nav.startsWith("ua")
      ? "ua"
      : "en");

  // Перенаправляем
  if (location.pathname === "/" || location.pathname === "/index.html") {
    location.replace("/" + auto + "/");
  }
})();
