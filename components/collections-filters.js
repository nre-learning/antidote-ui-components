import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllCollectionContext, CollectionFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";

function getTypeSetFromCollections(collections) {
  const types = new Set();
  collections.forEach((l) => {
    types.add(l.Type);
  });
  return Array.from(types);
}

function CollectionsFilters() {
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
      <span>Filter by</span>
      <input type="text" placeholder="Name"
          @keyup=${setFilter('searchString')} 
          @change=${setFilter('searchString')} />
    </label>
  
    <label>
      <span>Type</span>
      <div>
        <antidote-select
            placeholder="Type"
            .options=${types} 
            .change=${setFilter('Type')} />
      </div>
    </label>
  `;
}

customElements.define('antidote-collections-filters', component(CollectionsFilters));

export default CollectionsFilters;
