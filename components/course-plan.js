import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllLessonContext, LessonPrereqContext, CoursePlanNameContext, CoursePlanStrengthsContext } from "../contexts.js";
import { lessonId } from "../helpers/page-state.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function CoursePlan() {
  const l8n = getL8nReader(this);
  const allLessonsRequest = useContext(AllLessonContext);
  const [coursePlanName] = useContext(CoursePlanNameContext);
  const [strengths] = useContext(CoursePlanStrengthsContext);
  const lesson = allLessonsRequest.succeeded
    ? allLessonsRequest.data.lessons.find((l) => l.LessonId === lessonId)
    : null;
  const planLessons = lesson
    ? (lesson.Prereqs || []).map((prereqId) =>
      allLessonsRequest.data.lessons.find((l) => l.LessonId === prereqId)
    ).concat(lesson)
    : [];
  const slug = (lesson || {}).Slug;
  const coursePlanTitle = coursePlanName
    ? l8n('course.plan.title', { coursePlanName, slug })
    : l8n('course.plan.title.no.name', { slug })

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />    
    <h1>${coursePlanTitle}</h1>
    
    ${planLessons.map((lesson, i) => html`
      <div class="path-item">
        <div class="number">
          <img src="/images/${i+1}.svg" alt="${i+1}"/>
          <div class="line"></div>
        </div>
        <div class="canister secondary">
          <h3>
            <a href="/labs?lessonId=${lesson.LessonId}&lessonStage=1">
              ${lesson.LessonName}
            </a>
          </h3>
          <p>${lesson.Description}</p>
          ${strengths ? html`
            <span class="expertise skill-${strengths[lesson.Slug]}">
              ${strengths[lesson.Slug] <= 3 || strengths[lesson.Slug] === undefined ? html`
                <img src="/images/beginner-icon.svg" alt="beginner logo" class="icon" />
                ${l8n('course.plan.skill.strength.beginner.message')}
              ` : ''}
              ${strengths[lesson.Slug] === 4 ? html`
                <img src="/images/intermediate-icon.svg" alt="intermediate logo" class="icon" />
                ${l8n('course.plan.skill.strength.intermediate.message')}
              ` : ''}
              ${strengths[lesson.Slug] === 5 ? html`
                <img src="/images/expert-icon.svg" alt="expert logo" class="icon" />
                ${l8n('course.plan.skill.strength.expert.message')}                
              ` : ''}
            </span>
          `: ''}
        </div>
      </div>       
    `)}
  `;
}

customElements.define('antidote-course-plan', component(CoursePlan));

export default CoursePlan;
