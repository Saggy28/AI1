/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


// Stan aplikacji
var appState = {
  currentStyle: "styl1.css",
  // Domyślny styl
  styles: {
    "styl1.css": "style_all/styl1.css",
    "styl2.css": "style_all/styl2.css",
    "styl3.css": "style_all/styl3.css",
    "styl4.css": "style_all/styl4.css"
  }
};
// Funkcja generująca dynamiczne linki do zmiany stylu
function generateStyleLinks() {
  var container = document.getElementById("style-buttons");
  if (!container) {
    console.error("Nie znaleziono kontenera dla przycisków stylu.");
    return;
  }
  // Czyszczenie istniejących dzieci
  container.innerHTML = "";
  // Tworzenie nowych linków dla każdego stylu
  Object.keys(appState.styles).forEach(function (styleName) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "Styl: ".concat(styleName);
    link.style.marginRight = "10px";
    link.onclick = function (event) {
      event.preventDefault(); // Zapobieganie przeładowaniu strony
      changeStyle(styleName);
    };
    container.appendChild(link);
  });
}
// Funkcja zmieniająca bieżący styl
function changeStyle(newStyle) {
  console.log("Pr\xF3ba zmiany stylu na: ".concat(newStyle));
  var linkElement = document.getElementById("theme-link");
  // Walidacja nowego stylu
  if (!appState.styles[newStyle]) {
    console.error("Nie znaleziono stylu: ".concat(newStyle));
    return;
  }
  if (linkElement) {
    // Zmiana atrybutu href w istniejącym linku
    linkElement.href = appState.styles[newStyle];
    console.log("Zmieniono styl na: ".concat(newStyle));
  } else {
    console.error("Nie znaleziono elementu <link> z ID 'theme-link'.");
  }
  // Aktualizacja bieżącego stylu w stanie aplikacji
  appState.currentStyle = newStyle;
}
// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  generateStyleLinks();
});
/******/ })()
;