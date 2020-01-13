import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { component, useContext, useState } from 'haunted';
import { AllLessonContext, LessonPrereqContext, CoursePlanStrengthsContext } from "../contexts.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function getDefaultStrengthsState(prereqSkills) {
  return prereqSkills.reduce((acc, skill) => {
    acc[skill] = 1;
    return acc;
  }, {})
}

function CoursePlanStrengthModal() {
  const l8n = getL8nReader(this);
  const [open, setOpen] = useState(true);
  const allLessonsRequest = useContext(AllLessonContext);
  const prereqRequest = useContext(LessonPrereqContext);
  const [_, setExportedStrengthsState] = useContext(CoursePlanStrengthsContext);
  const prereqLessons = allLessonsRequest.succeeded && prereqRequest.succeeded && prereqRequest.data.prereqs
    ? prereqRequest.data.prereqs.map((prereqId) => allLessonsRequest.data.lessons.find((l) => l.LessonId === prereqId))
    : [];
  const prereqSkills = prereqLessons.map((l) => l.Slug);
  const [localStrengthsState, setLocalStrengthsState] = prereqSkills.length > 0
    ? useState(getDefaultStrengthsState(prereqSkills))
    : [{}, null];

  function setStrength(skill, score) {
    return () => {
      localStrengthsState[skill] = score;
      setLocalStrengthsState(localStrengthsState);
    }
  }

  function submit() {
    setExportedStrengthsState(localStrengthsState);
    setOpen(false);
  }

  function skip() {
    setExportedStrengthsState(getDefaultStrengthsState(prereqSkills));
    setOpen(false);
  }

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />    

    <antidote-modal show=${open && prereqSkills.length > 0}>   
      <h1>${l8n('course.plan.strength.modal.placeholder')}</h1>
      <p>${l8n('course.plan.strength.modal.message')}</p>
      
      ${prereqSkills.map((skill) => html`
        <h3>${l8n('course.plan.strength.modal.prompt', { skill })}</h3>
        <ul class="pagination-list">  
          ${Array(5).map((_, i) => {
            const rank = i + 1;
            return html `
              <li class=${classMap({active: localStrengthsState[skill] === rank})} 
                  data-line=${l8n(`course.plan.strength.modal.option.rank.${rank}.tooltip`)}
                  @click=${setStrength(skill, rank)}></li>
            `;
          })}
        </ul>
      `)}
      
      <div class="buttons">
        <button class="btn support" @click=${skip}>${l8n('course.plan.strength.modal.skip.button.label')}</button>
        <button class="btn primary" @click=${submit}>${l8n('course.plan.strength.modal.submit.button.label')}</button>
      </div>
    </antidote-modal>
  `;
}

customElements.define('antidote-course-plan-strength-modal', component(CoursePlanStrengthModal));

export default CoursePlanStrengthModal;
