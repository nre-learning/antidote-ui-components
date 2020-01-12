import { html } from 'lit-html';
import { component, useEffect } from 'haunted';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function togglePageOverflow(hide) {
  if (hide) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function Modal({show}) {
  const showBool = show === 'true';
  const modal = showBool
    ? html`
      <div class="modal-wrapper">
        <div class="modal-container">
          <slot></slot>
        </div>
      </div>
    `
    : '';

  useEffect(() => {
    togglePageOverflow(showBool);
    return () => togglePageOverflow(false);
  }, [showBool]);

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    ${modal}
  `;
}

Modal.observedAttributes = ['show'];

customElements.define('antidote-modal', component(Modal));

export default Modal;
