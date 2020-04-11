import { html } from 'lit-html';
import { component, useContext, useEffect } from 'haunted';
import { LabTabsContext, LiveLessonDetailsContext } from '../contexts.js';
// import { serviceHost } from '../helpers/page-state.js';
import getComponentStyleSheetURL from '../helpers/stylesheet';

// NOTE: On Tab State Management:
// Currently this component (& the switcher) only keep  _initialization_ state in the LabTabsContext.
// Meaning changes to the visible tab are done in-DOM only. This prevents unneeded re-renders of
// this component when a DOM modification would suffice. If, for some unforeseen reason it becomes
// necessary to keep the most up-to-date state in the LabTabsContext, this component would likely
// need to be enhanced somewhat to prevent <antidote-terminal> from re-rendering on simple state
// changes and thus dropping the connections.

function getTabMarkup(tab) {

  const lessonDetailsRequest = useContext(LiveLessonDetailsContext);
  if (tab.id === 'mobile-guide') {
    return html`
      <div id=${tab.id}
           tab="guide"
           ?selected=${tab.selected}>          
        <antidote-lab-guide></antidote-lab-guide>             
      </div>
    `;
  } else if (tab.pres) {
    switch (tab.pres.type) {
      case('ssh'):
        return html`
          <div id=${tab.id}
               tab="terminal"
               ?selected=${tab.selected}>
              <antidote-terminal
                host=${tab.pres.host}
                port=${tab.pres.port}
                user=${tab.pres.user}
                pass=${tab.pres.pass} />
          </div>
        `;
      case('http'):
        return html`
          <div id=${tab.id}
               tab="web" 
               ?selected=${tab.selected}>
            <iframe src="${window.location.protocol}//${lessonDetailsRequest.data.AntidoteID}-${lessonDetailsRequest.data.ID}-${tab.id}.heps.${window.location.host}/">
            </iframe>
          </div>
        `;
    }
  }

  return ``;
}

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
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    ${tabs.map((tab) => getTabMarkup(tab))}
  `;
}

customElements.define('antidote-lab-tabs', component(LabTabs));

export default LabTabs;
