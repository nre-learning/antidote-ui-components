import { html } from 'lit-html';
import { component, useContext, useMemo } from 'haunted';
import { LessonContext, LiveLessonDetailsContext } from '../contexts.js';
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function getRandomModalMessage(l8n) {
  const messages = l8n(['lab.loading.modal.rolling.messages']);
  return messages[Math.floor(Math.random() * messages.length)];
}

function LabLoadingModal() {
  const l8n = getL8nReader(this);
  const lessonRequest = useContext(LessonContext);
  const detailRequest = useContext(LiveLessonDetailsContext);
  const content = useMemo(() => {
    if (lessonRequest.error) {
      console.error(lessonRequest.error);
      return html`
      <h3>${l8n('lab.loading.modal.lesson.loading.error.message', { error: lessonRequest.error })}</h3>
    `;
    }
    else if (detailRequest.error) {
      console.error(detailRequest.error);
      return html`
      <h3>${l8n('lab.loading.modal.lesson.detail.loading.error.message', { error: detailRequest.error })}</h3>
    `;
    }
    else if (!lessonRequest.completed) {
      return html`
      <h3>${l8n('lab.loading.modal.lesson.loading.pending.message')}</h3>
      <img src="/images/flask.gif" alt=${l8n('images.flask.alt')} />
      <p>${getRandomModalMessage(l8n)}</p>
    `;
    }
    else if (!detailRequest.completed) {
      return html`
      <h3>${l8n('lab.loading.modal.lesson.initialization.pending.message')}</h3>
      <img src="/images/flask.gif" alt=${l8n('images.flask.alt')} />
      <p>${getRandomModalMessage(l8n)}</p>
    `;
    }
    return '';
  }, [
    lessonRequest.completed,
    detailRequest.completed,
    lessonRequest.error,
    detailRequest.error,
  ]);

  const detailRequestStatus = detailRequest && detailRequest.data && detailRequest.data.Status;
  const healthy = (detailRequest && detailRequest.data && detailRequest.data.HealthyTests) || 0;
  const total =  (detailRequest && detailRequest.data && detailRequest.data.TotalTests) || 0;
  const detailRequestProgressFragment = useMemo(() => {
    switch (detailRequestStatus) {
      case "INITIALIZED":
        return html`
          <antidote-progress-bar percent="0"></antidote-progress-bar>
          <p>
            ${l8n('lab.loading.modal.lesson.endpoints.pending.message')}
          </p>
        `;
      case "BOOTING":
        return html`
          <antidote-progress-bar percent="33"></antidote-progress-bar>
          <p>
            ${l8n('lab.loading.modal.lesson.endpoints.pending.message')}
            ${total > 0 ? `(${healthy}/${total})` : ''}
          </p>
        `;
      case "CONFIGURATION":
        return html`
          <antidote-progress-bar percent="66"></antidote-progress-bar>
          <p>${l8n('lab.loading.modal.lesson.configuration.pending.message')}</p>
        `;
      case "READY":
        return html`
          <antidote-progress-bar percent="100"></antidote-progress-bar>
          <p>${l8n('lab.loading.modal.lesson.configuration.pending.message')}</p>
        `;
      default:
        return '';
      }
  }, [detailRequestStatus, healthy, total]);

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <antidote-modal show=${content !== ''}>
      ${content}
      ${detailRequestProgressFragment}
    </antidote-modal>
  `;
}

customElements.define('antidote-lab-loading-modal', component(LabLoadingModal));

export default LabLoadingModal;
