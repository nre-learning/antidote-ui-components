import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { LessonFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getCopyReader from '../helpers/copy';

function CatalogSearch() {
  const copy = getCopyReader(this);
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
      <span>${copy('catalog.search.label')}</span>     
      <input type="text" placeholder="${copy('catalog.search.placeholder')}"
        @keyup=${change} @change=${change} />
    </label>
  `;
}

customElements.define('antidote-catalog-search', component(CatalogSearch));
