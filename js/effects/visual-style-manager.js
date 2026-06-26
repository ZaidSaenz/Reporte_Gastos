const VISUAL_STYLE_STORAGE_KEY = "expense-tracker-visual-style";

const AVAILABLE_VISUAL_STYLES = Object.freeze([
  "pixel-art",
  "matte",
  "cyberpunk"
]);

const DEFAULT_VISUAL_STYLE = "matte";

function isValidVisualStyle(styleName) {
  return AVAILABLE_VISUAL_STYLES.includes(styleName);
}

export function applyVisualStyle(styleName, savePreference = true) {
  const selectedStyle = isValidVisualStyle(styleName)
    ? styleName
    : DEFAULT_VISUAL_STYLE;

  document.documentElement.dataset.visualStyle = selectedStyle;

  if (savePreference) {
    localStorage.setItem(
      VISUAL_STYLE_STORAGE_KEY,
      selectedStyle
    );
  }

  document.dispatchEvent(
    new CustomEvent("visualstylechange", {
      detail: {
        style: selectedStyle
      }
    })
  );

  return selectedStyle;
}

export function getCurrentVisualStyle() {
  const currentStyle =
    document.documentElement.dataset.visualStyle;

  return isValidVisualStyle(currentStyle)
    ? currentStyle
    : DEFAULT_VISUAL_STYLE;
}

export function loadSavedVisualStyle() {
  const savedStyle = localStorage.getItem(
    VISUAL_STYLE_STORAGE_KEY
  );

  return applyVisualStyle(
    savedStyle || DEFAULT_VISUAL_STYLE,
    false
  );
}

export function getAvailableVisualStyles() {
  return [...AVAILABLE_VISUAL_STYLES];
}

loadSavedVisualStyle();
