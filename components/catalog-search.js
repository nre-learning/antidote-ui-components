import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { LessonFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getL8nReader from '../helpers/l8n';

function CatalogSearch() {
  const l8n = getL8nReader(this);
  const [filterState, setFilterState] = useContext(LessonFilteringContext);

  const change = debounce(function change() {
    filterState.searchString = this.value.length > 0 ? this.value.toLowerCase() : null;
    setFilterState(filterState);
  }, 200);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <style>
      :host {
        display: block;
      }
    </style>  
    <label>
      <span>${l8n('catalog.search.label')}</span>     
      <input type="text" placeholder="${l8n('catalog.search.placeholder')}"
        @keyup=${change} @change=${change} />
    </label>
  `;
}

customElements.define('antidote-catalog-search', component(CatalogSearch));
