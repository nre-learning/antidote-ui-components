export default function getComponentStyleSheetURL(component) {
  return component.getAttribute('stylesheet')
    || window.antidoteStylesheet
    || "http://127.0.0.1:8081/dist/styles.css";
}
