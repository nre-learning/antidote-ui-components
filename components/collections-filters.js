import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllCollectionContext, CollectionFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getCopyReader from '../helpers/copy';

function getTypeSetFromCollections(collections) {
  const types = new Set();
  collections.forEach((l) => {
    types.add(l.Type);
  });
  return Array.from(types);
}

function CollectionsFilters() {
  const copy = getCopyReader(this);
  const allCollectionRequest = useContext(AllCollectionContext);
  const [filterState, setFilterState] = useContext(CollectionFilteringContext);
  const types = allCollectionRequest.succeeded
    ? getTypeSetFromCollections(allCollectionRequest.data.collections)
    : [];

  function setFilter(filterName) {
    return debounce(function() {
      filterState[filterName] = this.value || null;
      setFilterState(filterState);
    }, 200);
  }

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <label>
      <span>${copy('collection.filters.name.label')}</span>
      <input type="text" placeholder=${copy('collection.filters.name.placeholder')}
          @keyup=${setFilter('searchString')} 
          @change=${setFilter('searchString')} />
    </label>
  
    <label>
      <span>${copy('collection.filters.type.label')}</span>
      <div>
        <antidote-select
            placeholder="${copy('collection.filters.type.placeholder')}"
            .options=${types} 
            .change=${setFilter('Type')} />
      </div>
    </label>
  `;
}

customElements.define('antidote-collections-filters', component(CollectionsFilters));

export default CollectionsFilters;
