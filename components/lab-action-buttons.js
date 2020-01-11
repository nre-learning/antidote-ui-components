import { html } from 'lit-html';
import { component, useContext, useState, useRef } from 'haunted';
import { LessonContext } from '../contexts.js';
import { syringeServiceRoot, lessonStage, lessonId, sessionId } from '../helpers/page-state.js';
import usePollingRequest from '../helpers/use-polling-request.js';
import getCopyReader from '../helpers/copy';

/* Note: verification interface should probably eventually be broken into an isolated component
         rather than being part of the implementation of this particular button bar */

function LabActionButtons() {
  const copy = getCopyReader(this);
  const lessonRequest = useContext(LessonContext);
  const hasObjective = lessonRequest.succeeded && lessonRequest.data.Stages[lessonStage].VerifyObjective;
  const verificationAttemptCount = useRef(0); // arbitrary varying value to include in request state to trigger a new request when incremented
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const verificationRequest = verifyModalOpen ? usePollingRequest({
    initialRequestURL: `${syringeServiceRoot}/exp/livelesson/${lessonId}-${sessionId}/verify`,
    initialRequestOptions: {
      method: 'POST',
      body: JSON.stringify({ data: { id: `${lessonId}-${sessionId}` } }),
      attemptCount: verificationAttemptCount.current
    },
    progressRequestURL: ({id}) => `${syringeServiceRoot}/exp/verification/${id}`,
    isProgressComplete: ({working}) => !working,
  }) : {};
  const verificationMessage = (() => {
    if (verificationRequest.pending) {
      return copy('verification.modal.pending.message');
    } else if (verificationRequest.succeeded) {
      if (verificationRequest.data.success) {
        return copy('verification.modal.success.message');
      } else {
        return copy('verification.modal.failure.message');
      }
    } else {
      return copy('verification.modal.error.message');
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
    ? html`<button class="btn primary" @click=${verify}>${copy('lab.action.buttons.verify.label')}</button>`
    : '';
  const noButtons = !(verifyButton);

  return noButtons ? '' : html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
  
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
      <h1>${copy('verification.modal.title')}</h1>
      <p>${verificationMessage}</p>
      ${verificationRequest.pending ? html`
        <img src="/images/flask.gif" alt="flask" />
      `: ''}
      <div>
        <button class="btn primary" @click=${closeVerify}>${copy('verification.modal.close.button.label')}</button>
      </div>     
    </antidote-modal>
  `
}

customElements.define('antidote-lab-action-buttons', component(LabActionButtons));

export default LabActionButtons;
