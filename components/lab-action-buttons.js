import { html } from 'lit-html';
import { component, useContext, useState, useRef } from 'haunted';
import { LessonContext, LiveLessonDetailsContext } from '../contexts.js';
import { acoreServiceRoot, lessonStage } from '../helpers/page-state.js';
import usePollingRequest from '../helpers/use-polling-request.js';
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

/* Note: verification interface should probably eventually be broken into an isolated component
         rather than being part of the implementation of this particular button bar */

// TODO(mierdin): This is still very much in the old verification state. I have made minimal modifications
// to get this out of the way for now, but once verification is properly re-introduced, we should revisit this.

function LabActionButtons() {
  const l8n = getL8nReader(this);

  const llReq = useContext(LiveLessonDetailsContext);

  const lessonRequest = useContext(LessonContext);
  const hasObjective = lessonRequest.succeeded && lessonRequest.data.Stages[lessonStage].VerifyObjective;
  const verificationAttemptCount = useRef(0); // arbitrary varying value to include in request state to trigger a new request when incremented
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const verificationRequest = verifyModalOpen ? usePollingRequest({
    initialRequestURL: `${acoreServiceRoot}/exp/livelesson/${llReq.data.id}/verify`,
    initialRequestOptions: {
      method: 'POST',
      body: JSON.stringify({ data: { id: `${llReq.data.id}` } }),
      attemptCount: verificationAttemptCount.current
    },
    progressRequestURL: ({id}) => `${acoreServiceRoot}/exp/verification/${id}`,
    isProgressComplete: ({working}) => !working,
  }) : {};
  const verificationMessage = (() => {
    if (verificationRequest.pending) {
      return l8n('verification.modal.pending.message');
    } else if (verificationRequest.succeeded) {
      if (verificationRequest.data.success) {
        return l8n('verification.modal.success.message');
      } else {
        return l8n('verification.modal.failure.message');
      }
    } else {
      return l8n('verification.modal.error.message');
    }
  })();

  function verify() {
    verificationAttemptCount.current++;
    setVerifyModalOpen(true);
  }

  function closeVerify() {
    setVerifyModalOpen(false);
  }

  const verifyButton = hasObjective
    ? html`<button class="btn primary" @click=${verify}>${l8n('lab.action.buttons.verify.label')}</button>`
    : '';
  const noButtons = !(verifyButton);

  return noButtons ? '' : html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
  
    <!-- todo: move verify button-->
    ${verifyButton}
    
    <antidote-modal show=${verifyModalOpen}>
      <style> 
        :host {
          text-align: center;
        }
        h1 {
          text-align: left;
        }
      </style>
      <h1>${l8n('verification.modal.title')}</h1>
      <p>${verificationMessage}</p>
      ${verificationRequest.pending ? html`
        <img src="/images/flask.gif" alt="flask" />
      `: ''}
      <div>
        <button class="btn primary" @click=${closeVerify}>${l8n('verification.modal.close.button.label')}</button>
      </div>     
    </antidote-modal>
  `
}

customElements.define('antidote-lab-action-buttons', component(LabActionButtons));

export default LabActionButtons;
