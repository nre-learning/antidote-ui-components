import { html } from 'lit-html';
import { component } from 'haunted';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function toggleBurger() {
  this.classList.toggle('cross');
  this.parentNode.querySelector('.burger-nav').classList.toggle('active');
  document.body.classList.toggle('overflow-hidden');
}

customElements.define('antidote-burger-menu', component(function AdvisorContext() {
  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <ul class="burger-nav">
      <slot></slot>
    </ul>
    
    <div class="burger" @click=${toggleBurger}>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>    
  `
}));
