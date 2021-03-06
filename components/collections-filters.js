import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllCollectionContext, CollectionFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function getTypeSetFromCollections(collections) {
  const types = new Set();
  collections.forEach((l) => {
    types.add(l.Type);
  });
  return Array.from(types);
}

function CollectionsFilters() {
  const l8n = getL8nReader(this);
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
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <label>
      <span>${l8n('collection.filters.name.label')}</span>
      <input type="text" placeholder=${l8n('collection.filters.name.placeholder')}
          @keyup=${setFilter('searchString')} 
          @change=${setFilter('searchString')} />
    </label>
  
    <label>
      <span>${l8n('collection.filters.type.label')}</span>
      <div>
        <antidote-select
            placeholder="${l8n('collection.filters.type.placeholder')}"
            .options=${types} 
            .change=${setFilter('Type')} />
      </div>
    </label>
  `;
}

customElements.define('antidote-collections-filters', component(CollectionsFilters));

export default CollectionsFilters;
