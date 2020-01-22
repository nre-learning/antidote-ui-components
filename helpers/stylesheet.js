export default function getComponentStyleSheetURL(component) {
  return component.getAttribute('stylesheet')
    || window.antidoteStyleSheet
    || "https://cdn.jsdelivr.net/gh/nre-learning/nre-styles@latest/dist/styles.css"
}
