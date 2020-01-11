import { html } from 'lit-html';
import { component, useContext, useState } from 'haunted';
import { LiveLessonDetailsContext, LessonContext } from "../contexts.js";
import { lessonStage } from '../helpers/page-state.js';
import getL8nReader from '../helpers/l8n';

// this button bar also manages the state of the popup it uses to show the output from the button features.
// this could be more isolated, but until the complexity of this component increases, its fine.

function LabGuidanceButtons() {
  const l8n = getL8nReader(this);
  const lessonRequest = useContext(LessonContext);
  const detailsRequest = useContext(LiveLessonDetailsContext);
  const [modalContentType, setModalContentType] = useState(null);

  const enabledButtonTypes = [
    !!(detailsRequest.succeeded && detailsRequest.data.LessonDiagram) && 'diagram',
    !!(detailsRequest.succeeded && detailsRequest.data.LessonVideo) && 'video',
    !!(lessonRequest.succeeded && lessonRequest.data.Stages[lessonStage].VerifyObjective) && 'objective'
  ].filter((i) => i); // remove undefined/null

  const buttons = enabledButtonTypes.map((buttonType) => html`
    <button class="btn secondary" @click=${() => setModalContentType(buttonType)}>
      ${l8n(`lab.guidance.buttons.${buttonType}.label`)}
    </button>
  `);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    
    ${buttons}   
      
    <antidote-modal show=${modalContentType !== null}>
      ${modalContentType === 'diagram' ? html`
        <h1>${l8n('lab.guidance.modal.diagram.title')}</h1>
        <img src=${detailsRequest.data.LessonDiagram} alt="${l8n('lab.guidance.modal.diagram.title')}"/>
      ` : ''}
      
      ${modalContentType === 'video' ? html`
        <h1>${l8n('lab.guidance.modal.video.title')}</h1>
        <div class="video-wrapper">
          <iframe src=${detailsRequest.data.LessonVideo} frameborder="0" class="video-embed"></iframe>
        </div>
      ` : ''}
      
      ${modalContentType === 'objective' ? html`
        <h1>${l8n('lab.guidance.modal.objective.title')}</h1>
        <p>${lessonRequest.data.Stages[lessonStage].VerifyObjective}</p>
      ` : ''}
      
      <button class="btn primary" @click=${() => setModalContentType(null)}>
        ${l8n('lab.guidance.modal.close.button.label')}
      </button>
    </antidote-modal>
  `
}

customElements.define('antidote-lab-guidance-buttons', component(LabGuidanceButtons));

export default LabGuidanceButtons;
