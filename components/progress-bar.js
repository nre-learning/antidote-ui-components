import { html } from 'lit-html';
import { component } from 'haunted';

function ProgressBar({percent}) {
  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <div class="progress-bar stripes animated reverse slower">
      <span class="progress-bar-inner" style="width: ${percent}%;"></span>
    </div>    
  `;
}

ProgressBar.observedAttributes = ["percent"];

customElements.define('antidote-progress-bar', component(ProgressBar));

export default ProgressBar;
