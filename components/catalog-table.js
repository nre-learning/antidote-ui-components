import { html } from 'lit-html';
import { component, useContext} from 'haunted';
import { AllLessonContext, LessonFilteringContext } from "../contexts.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function doFiltering(lessons, filteringState) {
  const filterEntries = Object.entries(filteringState);

  return lessons.filter((lesson) => {
    return filterEntries.reduce((acc, [filterProp, filterValue]) => {
      if (filterValue !== null) {
        if (filterProp === 'Tags') {
          return acc && filterValue.every((tag) => (lesson.Tags || []).includes(tag));
        } else if (filterProp === 'searchString') {
          return acc && lesson.LessonName.toLowerCase().indexOf(filterValue) > -1;
        } else {
          return acc && lesson[filterProp] === filterValue;
        }
      } else {
        return acc;
      }
    }, true);
  });
}

function CatalogTable() {
  const l8n = getL8nReader(this);
  const allLessonRequest = useContext(AllLessonContext);
  const [filteringState] = useContext(LessonFilteringContext);
  const lessons = allLessonRequest.succeeded
    ? doFiltering(allLessonRequest.data.lessons, filteringState)
    : [];

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <table class="catalog">
      <thead>
      <tr>
        <th>${l8n('catalog.table.column.lesson.label')}</th>
        <th>${l8n('catalog.table.column.description.label')}</th>
        <th name="tags">${l8n('catalog.table.column.tags.label')}</th>
      </tr>
      </thead>
      <tbody>
      ${lessons.map((lesson) => html`
        <tr>
          <td class="title">
            <a href="/labs/?lessonSlug=${lesson.Slug}&lessonStage=1">
              ${lesson.Name}
            </a>
          </td>
          <td>${lesson.Description}</td>
          <td class="tags">
          ${(lesson.Tags || []).map((tag) => html`
            <span class="tag">${tag}</span>
          `)}
          </td>
        </tr>
      `)}
      </tbody>
    </table>
    `;
}

customElements.define('antidote-catalog-table', component(CatalogTable));

export default CatalogTable;
