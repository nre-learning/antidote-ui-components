import {html} from 'lit-html';
import {useContext, useEffect, component} from 'haunted';
import {LabTabsContext} from '../contexts.js';
import debounce from '../helpers/debounce.js';

function setSelectedPresentation(id) {
  // takes a tab label element, sends a change event and updates the `selected` attribute
  this.dispatchEvent(new CustomEvent('antidote-tab-change', {
    bubbles: false, // prevents the event from bubbling up through the DOM
    composed: false, // prevents the event from crossing the Shadow DOM boundary
    detail: { id } // all data you wish to pass must be in `detail`
  }));
  const tabs = Array.from(this.shadowRoot.querySelectorAll(':host > ul > li'));
  const tabEl = this.shadowRoot.getElementById(id);
  tabs.forEach((t) => t.removeAttribute('selected'));
  tabEl.setAttribute('selected', '');
}

function deselectGuideTab() {
  const selectedTab = this.shadowRoot.querySelector('li[selected]');
  if (selectedTab.id === 'mobile-guide') {
    const otherTab = selectedTab.nextElementSibling || selectedTab.previousElementSibling;
    this.setSelectedPresentation(otherTab.id);
  }
}

const onResize = debounce(function onResize() {
  if (window.outerWidth > 1023) {
    deselectGuideTab.apply(this);
  }
}, 50);

function LabTabSwitcher() {
  const tabs = useContext(LabTabsContext);

  Object.assign(this, { setSelectedPresentation }); // todo: there has got to be a better way re: matthew?

  // deselect guide tab if we shrink to the point that we show the large guide
  useEffect(() => {
    const handler = onResize.bind(this);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    }
  }, []);

  // todo: confirm slotting a stylesheet like this works as expected :/
  // todo: move stylesheets to NRE-branded usages of this component
  return html`
    <slot name="stylesheets">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nlundquist/nre-styles@latest/dist/styles.css" />
    </slot>
    <style>     
      ul {
        display: flex;
        background: #d8d8d8;
        font-size: 21px;
        list-style: none;                 
      }      
      @media (max-width: 1023px) {
        ul {
            padding: 5px 5px 0 5px;
        }       
      }    
      li {
        cursor: pointer;
        padding: 5px 20px;       
      }
      li[selected] {
        color: white;
        background-color: #262c2c;
        border-radius: 6px 6px 0 0;
      }
      li[id='mobile-guide'] {
        display: none;
      }         
      /*todo: use breakpoint variable after extracting into style repo*/
      @media (max-width: 1023px) {
        li[id='mobile-guide'] {
          display: list-item;
        }
      }
      li > h3 {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }
      h3 {
        margin: 0;
      }
    </style>
    <ul>
      ${tabs.map((tab) => html`
        <li id=${tab.id}
            @click=${() => this.setSelectedPresentation(tab.id)}
            ?selected=${tab.selected}>
          ${!tab.pres ? html`
            <h3>${tab.label}</h3>
          ` : html`
            <h3>${tab.pres.type.toUpperCase()} - ${tab.label}</h3>
          `}          
        </li>
      `)}
    </ul>
  `
}

customElements.define('antidote-lab-tab-switcher', component(LabTabSwitcher));

export default LabTabSwitcher;
