import { html } from 'lit-html';
import { component, useContext, useState } from 'haunted';
import { LiveLessonDetailsContext, LessonContext } from "../contexts.js";
import { lessonStage } from '../helpers/page-state.js';
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

// this button bar also manages the state of the popup it uses to show the output from the button features.
// this could be more isolated, but until the complexity of this component increases, its fine.

function LabGuidanceButtons() {
  const l8n = getL8nReader(this);
  const lessonRequest = useContext(LessonContext);
  const detailsRequest = useContext(LiveLessonDetailsContext);
  const [modalContentType, setModalContentType] = useState(null);
  const enabledModalButtonTypes = [
    !!(detailsRequest.succeeded && detailsRequest.data.LessonDiagram) && 'diagram',
    !!(detailsRequest.succeeded && detailsRequest.data.LessonVideo) && 'video',
    !!(lessonRequest.succeeded && lessonRequest.data.Stages[lessonStage].VerifyObjective) && 'objective'
  ].filter((i) => i); // remove undefined/null
  const modalButtons = enabledModalButtonTypes.map((buttonType) => html`
    <button class="btn secondary" @click=${() => setModalContentType(buttonType)}>
      ${l8n(`lab.guidance.buttons.${buttonType}.label`)}
    </button>
  `);
  const exitLessonButton = html`
    <a id="exit" class="btn secondary" href="/catalog/">
      ${l8n(`lab.guidance.buttons.exit.label`)}
    </a>
  `;
  const leftButtons = modalButtons;
  const rightButtons = [ exitLessonButton ];

  // TODO(mierdin): Also implement StageVideo
  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    
    <div id="leftButtons">${leftButtons}</div>
    <div id="rightButtons">${rightButtons}</div>      
      
    <antidote-modal show=${modalContentType !== null}>
      ${modalContentType === 'diagram' ? html`
        <h1>${l8n('lab.guidance.modal.diagram.title')}</h1>
        <img src=${detailsRequest.data.Diagram} alt="${l8n('lab.guidance.modal.diagram.title')}"/>
      ` : ''}
      
      ${modalContentType === 'video' ? html`
        <h1>${l8n('lab.guidance.modal.video.title')}</h1>
        <div class="video-wrapper">
          <iframe src=${detailsRequest.data.Video} frameborder="0" class="video-embed"></iframe>
        </div>
      ` : ''}
      
      ${modalContentType === 'objective' ? html`
        <h1>${l8n('lab.guidance.modal.objective.title')}</h1>
        <p>${lessonRequest.data.Stages[lessonStage].VerifyObjective}</p>
      ` : ''}
      
      <button id="exit" class="btn primary" @click=${() => setModalContentType(null)}>
        ${l8n('lab.guidance.modal.close.button.label')}
      </button>
    </antidote-modal>
  `
}

customElements.define('antidote-lab-guidance-buttons', component(LabGuidanceButtons));

export default LabGuidanceButtons;
