import { html } from 'lit-html';
import { component, useContext, useMemo } from 'haunted';
import { LessonContext, LiveLessonDetailsContext } from '../contexts.js';
import getCopyReaderForElement from '../helpers/copy';

function getRandomModalMessage(copy) {
  const messages = copy(['lab.loading.modal.loading.messages']);
  return messages[Math.floor(Math.random() * messages.length)];
}

function LabLoadingModal() {
  const copy = getCopyReaderForElement(this);
  const lessonRequest = useContext(LessonContext);
  const detailRequest = useContext(LiveLessonDetailsContext);
  const content = useMemo(() => {
    if (lessonRequest.error) {
      console.error(lessonRequest.error);
      return html`
      <h3>${copy('lab.loading.modal.lesson.loading.error.message', { lesson: lessonRequest.error })}</h3>
    `;
    }
    else if (detailRequest.error) {
      console.error(detailRequest.error);
      return html`
      <h3>${copy('lab.loading.modal.lesson.detail.loading.error.message', { lesson: detailRequest.error })}</h3>
    `;
    }
    else if (!lessonRequest.completed) {
      return html`
      <h3>${copy('lab.loading.modal.lesson.loading.pending.message')}</h3>
      <img src="/images/flask.gif" alt=${copy('image.flask.alt')} />
      <p>${getRandomModalMessage(copy)}</p>
    `;
    }
    else if (!detailRequest.completed) {
      return html`
      <h3>${copy('lab.loading.modal.lesson.initialization.pending.message')}</h3>
      <img src="/images/flask.gif" alt=${copy('images.flask.alt')} />
      <p>${getRandomModalMessage(copy)}</p>
    `;
    }
    return '';
  }, [
    lessonRequest.completed,
    detailRequest.completed,
    lessonRequest.error,
    detailRequest.error,
  ]);

  const detailRequestStatus = detailRequest && detailRequest.data && detailRequest.data.LiveLessonStatus;
  const healthy = (detailRequest && detailRequest.data && detailRequest.data.HealthyTests) || 0;
  const total =  (detailRequest && detailRequest.data && detailRequest.data.TotalTests) || 0;
  const detailRequestProgressFragment = useMemo(() => {
    switch (detailRequestStatus) {
      case "INITIAL_BOOT":
        return html`
          <antidote-progress-bar percent="33"></antidote-progress-bar>
          <p>
            ${copy('lab.modal.lesson.endpoints.pending.message')}
            ${total > 0 ? `(${healthy}/${total})` : ''}
          </p>
        `;

      case "CONFIGURATION":
        return html`
          <antidote-progress-bar percent="66"></antidote-progress-bar>
          <p></p>
        `;

      default:
        return '';
      }
  }, [detailRequestStatus, healthy, total]);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <antidote-modal show=${content !== ''}>
      ${content}
      ${detailRequestProgressFragment}
    </antidote-modal>
  `;
}

customElements.define('antidote-lab-loading-modal', component(LabLoadingModal));

export default LabLoadingModal;
