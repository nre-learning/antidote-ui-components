import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { LessonContext } from '../contexts.js';
import { lessonId, lessonStage } from "../helpers/page-state.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

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
    <ul class="pagination-list">
      ${stages.map((stage, i) => {
        const clss = (i+1) === lessonStage ? 'active' : '';
        return html`
          <li class="${clss}" data-line="${l8n('lab.stage.selector.next.button.label', { i: i+1 })}"
            @click="${navTo(i+1)}">
          </li>
        `;
      })}    
    </ul>   
  ` : html``;
}

customElements.define('antidote-lab-stage-selector', component(LabStageSelector));

export default LabStageSelector;
