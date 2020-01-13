import { html } from 'lit-html';
import { component, useEffect } from 'haunted';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function ProgressLinks() {
  const links = this.links || [];
  const selectedLinkIndex = links.findIndex((l, i) => l.selected);
  const progressWidth = links && links.length > 1 ? (selectedLinkIndex / (links.length - 1)) * 100 : 0;

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <div id="paginator">
      <ul id="paginator-links">
        ${links.map((link, i) => {
          return html`
            <li ?completed=${i <= selectedLinkIndex} @click="${link.click}">
              <div role="tooltip">${link.tooltip}</div>
            </li>
          `;
        })}        
      </ul>
      <div id="progress-background"></div>
      <div id="progress-indicator" style="width: ${progressWidth}%"></div>        
    </div>  
  `;
}

customElements.define('antidote-progress-links', component(ProgressLinks));

export default ProgressLinks;
