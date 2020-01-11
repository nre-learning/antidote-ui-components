import { html } from 'lit-html';
import { component, useContext, useState } from 'haunted';
import { LiveLessonDetailsContext, LessonContext } from "../contexts.js";
import { lessonStage } from '../helpers/page-state.js';
import getCopyReader from '../helpers/copy';

// this button bar also manages the state of the popup it uses to show the output from the button features.
// this could be more isolated, but until the complexity of this component increases, its fine.

function LabGuidanceButtons() {
  const copy = getCopyReader(this);
  const lessonRequest = useContext(LessonContext);
  const detailsRequest = useContext(LiveLessonDetailsContext);
  const [modalContentType, setModalContentType] = useState(null);

  const enabledButtonTypes = [
    !!(detailsRequest.succeeded && detailsRequest.data.LessonDiagram) && 'diagram',
    !!(detailsRequest.succeeded && detailsRequest.data.LessonVideo) && 'video',
    !!(lessonRequest.succeeded && lessonRequest.data.Stages[lessonStage].VerifyObjective) && 'objective'
  ];

  const buttons = enabledButtonTypes.map((buttonType) => html`
    <button class="btn secondary" @click=${() => setModalContentType(buttonType)}>
      ${copy(`lab.guidance.buttons.${buttonType}.label`)}
    </button>
  `);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    
    ${buttons}   
      
    <antidote-modal show=${modalContentType !== null}>
      ${modalContentType === 'diagram' ? html`
        <h1>${copy('lab.guidance.modal.diagram.title')}</h1>
        <img src=${detailsRequest.data.LessonDiagram} alt="${copy('lab.guidance.modal.diagram.title')}"/>
      ` : ''}
      
      ${modalContentType === 'video' ? html`
        <h1>${copy('lab.guidance.modal.video.title')}</h1>
        <div class="video-wrapper">
          <iframe src=${detailsRequest.data.LessonVideo} frameborder="0" class="video-embed"></iframe>
        </div>
      ` : ''}
      
      ${modalContentType === 'objective' ? html`
        <h1>${copy('lab.guidance.modal.objective.title')}</h1>
        <p>${lessonRequest.data.Stages[lessonStage].VerifyObjective}</p>
      ` : ''}
      
      <button class="btn primary" @click=${() => setModalContentType(null)}>
        ${copy('lab.guidance.modal.close.button.label')}
      </button>
    </antidote-modal>
  `
}

customElements.define('antidote-lab-guidance-buttons', component(LabGuidanceButtons));

export default LabGuidanceButtons;
