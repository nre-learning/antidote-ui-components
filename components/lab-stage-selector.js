import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { LessonContext } from '../contexts.js';
import { lessonId, lessonStage } from "../helpers/page-state.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';
import {classMap} from 'lit-html/directives/class-map';

const navTo = (destination) => () => {
  if (typeof destination === 'number') {
    window.location.href = `/labs/?lessonId=${lessonId}&lessonStage=${destination}`;
  } else if (destination === 'previous') {
    window.location.href = `/labs/?lessonId=${lessonId}&lessonStage=${lessonStage - 1}`;
  } else if (destination === 'next') {
    window.location.href = `/labs/?lessonId=${lessonId}&lessonStage=${lessonStage + 1}`;
  }
};

function LabStageSelector() {
  const l8n = getL8nReader(this);
  const lessonRequest = useContext(LessonContext);
  const stages = lessonRequest.data ? lessonRequest.data.Stages.slice(1) : [];
  const disablePrevious = lessonStage === 1 ? 'disabled' : '';
  const disableNext = lessonStage === stages.length ? 'disabled' : '';
  const selectedStageIndex = stages.findIndex((e, i) => (i+1) === lessonStage);
  const progressWidth = stages && stages.length > 1 ? (selectedStageIndex / (stages.length - 1)) * 100 : 0;

  return stages.length > 1 ? html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <div class="buttons">
      <button class="btn support ${disablePrevious}"
        @click=${navTo('previous')}>
        ${l8n('lab.stage.selector.previous.button.label')}
      </button>
      <button class="btn primary ${disableNext}"
        @click=${navTo('next')}>
        ${l8n('lab.stage.selector.next.button.label')}
      </button>
    </div>
    <div id="paginator">
        <ul id="paginator-links">
          ${stages.map((stage, i) => {
            return html`
              <li ?active=${i === selectedStageIndex} @click="${navTo(i+1)}">
                <div role="tooltip">${l8n('lab.stage.selector.tooltip.label', { i: i+1 })}</div>
              </li>
            `;
          })}        
        </ul>
        <div id="progress-background"></div>
        <div id="progress-indicator" style="width: ${progressWidth}%"></div>        
    </div>  
  ` : html``;
}

customElements.define('antidote-lab-stage-selector', component(LabStageSelector));

export default LabStageSelector;
