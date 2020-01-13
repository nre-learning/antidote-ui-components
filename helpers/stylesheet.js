export default function getComponentStyleSheetURL(component) {
  return component.getAttribute('stylesheet')
    || window.antidoteStyleSheet
 // || "http://127.0.0.1:8081/dist/styles.css" # sub in styles during development
    || "https://cdn.jsdelivr.net/gh/nlundquist/nre-styles@latest/dist/styles.css"
}
