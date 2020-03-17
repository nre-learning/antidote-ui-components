import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { LessonContext } from '../contexts.js';
import { lessonSlug, lessonStage } from "../helpers/page-state.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

const navTo = (destination) => () => {
  if (typeof destination === 'number') {
    window.location.href = `/labs/?lessonSlug=${lessonSlug}&lessonStage=${destination}`;
  } else if (destination === 'previous') {
    window.location.href = `/labs/?lessonSlug=${lessonSlug}&lessonStage=${lessonStage - 1}`;
  } else if (destination === 'next') {
    window.location.href = `/labs/?lessonSlug=${lessonSlug}&lessonStage=${lessonStage + 1}`;
  }
};

function LabStageSelector() {
  const l8n = getL8nReader(this);
  const lessonRequest = useContext(LessonContext);
  const stages = lessonRequest.data ? lessonRequest.data.Stages : [];
  const disablePrevious = lessonStage === 0 ? 'disabled' : '';
  const disableNext = lessonStage === stages.length ? 'disabled' : '';
  const links = stages.map((stage, i) => ({
    tooltip: l8n('lab.stage.selector.tooltip.label', { i: i }),
    click: navTo(i),
    selected: i === lessonStage
  }));

  return stages.length > 0 ? html`
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
    <antidote-progress-links .links=${links}></antidote-progress-links>
  ` : html``;
}

customElements.define('antidote-lab-stage-selector', component(LabStageSelector));

export default LabStageSelector;
