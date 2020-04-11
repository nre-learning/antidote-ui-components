import '../contexts.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component } from 'haunted';
import { acoreServiceRoot } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'
import getComponentStyleSheetURL from '../helpers/stylesheet';

// context for the advisor page. the advisor component can work outside of this, however
// this prevents a 2nd request from occurring when used alongside promoted-lessons.

customElements.define('antidote-advisor-context', component(function AdvisorContext() {
  const allLessonRequest = useFetch(`${acoreServiceRoot}/exp/lesson`);

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <antidote-all-lesson-context-provider .value=${allLessonRequest}>        
      <slot></slot>
    </antidote-all-lesson-context-provider>
  `
}));

