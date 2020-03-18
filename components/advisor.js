import { html } from 'lit-html';
import { component, useEffect, useRef, useContext } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import { AllLessonContext } from "../contexts.js";
import useFetch from '../helpers/use-fetch.js'
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

// todo: update to use antidote-select component
function Advisor({ host, stylesheet }) {
  const l8n = getL8nReader(this);
  const syringeServicePrefix = host ? host+'/syringe' : syringeServiceRoot;
  const awesompleteRef = useRef(null);
  const allLessonRequest = useContext(AllLessonContext) || useFetch(`${syringeServicePrefix}/exp/lesson`);
  const lessonOptions = allLessonRequest.succeeded
    ? allLessonRequest.data.lessons.map((l) => ({
      label: l.Name,
      value: l.Slug
    }))
    : [];

  if (lessonOptions.length > 0) {
    useEffect(() => {
      const input = this.shadowRoot.querySelector('input');
      awesompleteRef.current = new Awesomplete(input, {
        list: lessonOptions,
        minChars: 0
      });
    }, []);
  }

  function select(ev) {
    const lessonSlug = ev.text.value;
    location.href = `${host || ''}/advisor/courseplan.html?lessonSlug=${lessonSlug}`;
  }

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />   
    <div class="advisor canister secondary">
      <h1>
        <span>${l8n('advisor.title')}</span>
        <span class="subtitle">${l8n('advisor.subtitle')}</span>
      </h1>
    
      <div class="input-wrapper">
        <input type="text" placeholder="${l8n('advisor.placeholder')}"
            @awesomplete-select=${select}
            class="awesomeplete" />
      </div>
        
      <button class="btn secondary">${l8n('advisor.button.label')}</button>
    
      <aside class="small">${l8n('advisor.prompt')}</aside>
    </div>
  `;
}

Advisor.observedAttributes = ['host'];

customElements.define('antidote-advisor', component(Advisor));

export default Advisor;
