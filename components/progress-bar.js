import { html } from 'lit-html';
import { component } from 'haunted';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function ProgressBar({percent}) {
  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <div class="progress-bar stripes animated reverse slower">
      <span class="progress-bar-inner" style="width: ${percent}%;"></span>
    </div>    
  `;
}

ProgressBar.observedAttributes = ["percent"];

customElements.define('antidote-progress-bar', component(ProgressBar));

export default ProgressBar;
