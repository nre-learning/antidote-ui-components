import '../contexts.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'

customElements.define('antidote-catalog-context', component(() => {
  const allLessonRequest = useFetch(`${syringeServiceRoot}/exp/lesson`);
  const [filteringState, setFilteringState] = useState({
    searchString: null,
    Category: null,
    Duration: null,
    Difficulty: null,
    Tags: []
  });

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <antidote-all-lesson-context-provider .value=${allLessonRequest}>    
    <antidote-lesson-filtering-context-provider .value=${[filteringState, setFilteringState]}>    
      <slot></slot>
    </antidote-lesson-filtering-context-provider>
    </antidote-all-lesson-context-provider>
  `
}));
