import '../contexts.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'
import getComponentStyleSheetURL from '../helpers/stylesheet';

customElements.define('antidote-collections-context', component(() => {
  const allCollectionRequest = useFetch(`${syringeServiceRoot}/exp/collection`);
  const [filteringState, setFilteringState] = useState({
    searchString: null,
    Type: null,
  });

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <antidote-all-collection-context-provider .value=${allCollectionRequest}>
    <antidote-collection-filtering-context-provider .value=${[filteringState, setFilteringState]}>
      <slot></slot>
    </antidote-collection-filtering-context-provider>
    </antidote-all-collection-context-provider>
  `
}));
