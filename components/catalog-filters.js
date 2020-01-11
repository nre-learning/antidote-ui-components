import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllLessonContext, LessonFilteringContext } from "../contexts.js";
import debounce from "../helpers/debounce.js";
import getCopyReader from '../helpers/copy';

function getOptionSetsFromLessons(lessons) {
  const categories = new Set();
  const tags = new Set();
  lessons.forEach((l) => {
    categories.add(l.Category);
    (l.Tags || []).forEach((t) => tags.add(t));
  });
  return [Array.from(categories), Array.from(tags)];
}

function CatalogFilters() {
  const copy = getCopyReader(this);
  const allLessonRequest = useContext(AllLessonContext);
  const [filterState, setFilterState] = useContext(LessonFilteringContext);
  const [categories, tags] = allLessonRequest.succeeded
    ? getOptionSetsFromLessons(allLessonRequest.data.lessons)
    : [[], []];

  function setFilter(filterName) {
    return debounce(function() {
      const value = filterName === 'Tags'
        ? filterState.Tags = this.value.split(',').map((t) => t.trim()).filter((s) => s.length > 0)
        : this.value || null;

      filterState[filterName] = value;
      setFilterState(filterState);
    }, 200);
  }

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <label>
      <span>${copy('catalog.filters.category.label')}</span>
      <div>
        <antidote-select
          placeholder=${copy('catalog.filters.category.placeholder')}
          .options=${categories} 
          .change=${setFilter('Category')} />
      </div>      
    </label>
  
    <label>
      <span>${copy('catalog.filters.tags.label')}</span>
      <div>
        <antidote-select
            placeholder=${copy('catalog.filters.tags.placeholder')}
            multi="true"
            .options=${tags} 
            .change=${setFilter('Tags')} />
      </div>
    </label>
  `;
}

customElements.define('antidote-catalog-filters', component(CatalogFilters));

export default CatalogFilters;
