import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { CoursePlanNameContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getL8nReader from '../helpers/l8n';

function CoursePlanNameField() {
  const l8n = getL8nReader(this);
  const [name, setName] = useContext(CoursePlanNameContext);

  const change = debounce(function change() {
    setName(this.value.length > 0 ? this.value : null);
  }, 200);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <style>
      :host {
        display: block;       
      }
    </style>  
    <input type="text" placeholder=${l8n('course.plan.name.field.placeholder')}
        @keyup=${change} @change=${change} value=${name || ''} />
  `;
}

customElements.define('antidote-course-plan-name-field', component(CoursePlanNameField));
