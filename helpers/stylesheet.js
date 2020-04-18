export default function getComponentStyleSheetURL(component) {
  return component.getAttribute('stylesheet')
    || window.antidoteStyleSheet
    || "https://cdn.jsdelivr.net/gh/nre-learning/nre-styles@0.6.0/dist/styles.css"
}
