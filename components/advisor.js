import { html } from 'lit-html';
import { component, useEffect, useRef } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'
import getCopyReader from '../helpers/copy';

function Advisor({ host, stylesheet }) {
  const copy = getCopyReader(this);
  const syringeServicePrefix = host ? host+'/syringe' : syringeServiceRoot;
  const awesompleteRef = useRef(null);
  const allLessonRequest = useFetch(`${syringeServicePrefix}/exp/lesson`);
  const lessonOptions = allLessonRequest.succeeded
    ? allLessonRequest.data.lessons.map((l) => ({
      label: l.LessonName,
      value: l.LessonId
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
    const lessonId = ev.text.value;
    location.href = `${host || ''}/advisor/courseplan.html?lessonId=${lessonId}`;
  }

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.css" rel="stylesheet "/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.base.css" rel="stylesheet" />   
    <div class="advisor canister secondary">
      <h1>
        <span>${copy('advisor.title')}</span>
        <span class="subtitle">${copy('advisor.title')}</span>
      </h1>
    
      <div class="input-wrapper">
        <input type="text" placeholder="${copy('advisor.placeholder')}"
            @awesomplete-select=${select}
            class="awesomeplete" />
      </div>
        
      <button class="btn secondary">${copy('advisor.button.label')}</button>
    
      <aside class="small">${copy('advisor.prompt')}</aside>
    </div>
  `;
}

Advisor.observedAttributes = ['host'];

customElements.define('antidote-advisor', component(Advisor));

export default Advisor;
