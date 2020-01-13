import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllLessonContext } from "../contexts.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

// shows a small selection of promoted lessons. currently shows 3 random "workflow" lessons.

function getLessonMarkup(lessons) {
  return lessons
    .filter((l) => l.Category === 'workflows')
    .slice(0, 3)
    .map((l) => html`
      <div class="canister medium-gray">
        <a href=${`/labs/?lessonId=${l.LessonId}&lessonStage=1`}>
          <h3>${l.Name}</h3>      
        </a>
        <p>
          ${l.Description}
        </p>
      </div>
    `);
}

function PromotedLessons() {
  const l8n = getL8nReader(this);
  const allLessonsRequest = useContext(AllLessonContext);
  const lessons = allLessonsRequest.succeeded ? getLessonMarkup(allLessonsRequest.data.lessons) : [];

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <h3>${l8n('promoted.lessons.title')}</h3>
    <div class="three-col">
        ${lessons}
    </div>    
  `;
}

customElements.define('antidote-promoted-lessons', component(PromotedLessons));

export default PromotedLessons;
