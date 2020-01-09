import { html } from 'lit-html';
import { component, useContext, useEffect } from 'haunted';
import { LabTabsContext } from '../contexts.js';
import { serviceHost, sessionId, lessonId } from '../helpers/page-state.js';

// NOTE: On Tab State Management:
// Currently this component (& the switcher) only keep  _initialization_ state in the LabTabsContext.
// Meaning changes to the visible tab are done in-DOM only. This prevents unneeded re-renders of
// this component when a DOM modification would suffice. If, for some unforeseen reason it becomes
// necessary to keep the most up-to-date state in the LabTabsContext, this component would likely
// need to be enhanced somewhat to prevent <antidote-terminal> from re-rendering on simple state
// changes and thus dropping the connections.

function LabTabs({ tab }) {
  const tabsParent = this.shadowRoot;
  const tabs = useContext(LabTabsContext);

  useEffect(() => {
    const switcherEl = this.closest('antidote-lab-context').querySelector('antidote-lab-tab-switcher');

    function changeTab(ev) {
      const tabs = Array.from(tabsParent.querySelectorAll(':host > div'));
      const newActiveTab = tabsParent.querySelector(`:host > div[id=${ev.detail.id}]`);
      tabs.forEach((t) => t.removeAttribute('selected'));
      newActiveTab.setAttribute('selected', '');

      if (newActiveTab.getAttribute('tab') === 'terminal') {
        newActiveTab.querySelector('antidote-terminal').focusTerminal();
      }
    }
    // this event is thrown by the lab-tab-switcher
    switcherEl.addEventListener('antidote-tab-change', changeTab);

    return () => {
      switcherEl.removeEventListener('antidote-tab-change', changeTab);
    }
  }, [tabs]);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <style>
      :host {
        position: relative;
        overflow: hidden;
        flex-grow: 1;     
      }
      :host > div[tab] {
        position: absolute;         
        visibility: hidden;
        width: 100%;
        height: 100%;
      }
      :host > div[tab][selected] {
        visibility: visible;
      }
      :host > div[tab="terminal"] {
        padding: 10px 0 5px 10px;
        background: #262c2c;  /* todo: switch to var */
      }
      :host > div[tab="web"] > iframe {
        width: 100%;
        height: 100%;
        border: 0; 
      }
    </style>  
    ${tabs.map((tab) => html`
      ${tab.pres ? html`
        ${tab.pres.type === 'http' ? html`
          <div id=${tab.id}
               tab="web" 
               ?selected=${tab.selected}>
            <iframe src="${document.location.protocol}//${serviceHost}/${lessonId}-${sessionId}-ns-${tab.pres.endpoint}/">
            </iframe>
          </div>                    
        ` : html`
          <div id=${tab.id}
               tab="terminal"
               ?selected=${tab.selected}>
              <antidote-terminal
                host=${tab.pres.host}
                port=${tab.pres.port} />
          </div>        
        `}
      ` : html`
        <div id=${tab.id}
             tab="slot"
             ?selected=${tab.selected}>
          <slot name=${tab.id}></slot>       
        </div>
      `}              
    `)}
  `;
}

customElements.define('antidote-lab-tabs', component(LabTabs));

export default LabTabs;
