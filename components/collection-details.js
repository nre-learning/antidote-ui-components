import '../contexts.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { syringeServiceRoot, collectionId } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'
import getCopyReader from '../helpers/copy';

function CollectionDetails() {
  const copy = getCopyReader(this);
  const request = useFetch(`${syringeServiceRoot}/exp/collection/${collectionId}`);

  return html` 
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <style>
      h1 {
        text-align: center;
      }
    </style>
    ${request.succeeded ? html`
      <h1>${request.data.Title}</h1>
      
      <img src="${request.data.Image}" />
      
      <p>${request.data.LongDescription}</p>
      
      <table>
        <tr><td>${copy('collections.details.type.label')}</td><td>${request.data.Type}</td></tr>
        <tr>
          <td>${copy('collections.details.website.label')}</td>
          <td>
            <a href="${request.data.Website}">${request.data.Website}</a>
          </td>
        </tr>
        <tr>
          <td>${copy('collections.details.email.label')}</td>
          <td>
            <a href="mailto:${request.data.ContactEmail}">${request.data.ContactEmail}</a>
          </td>
        </tr>
      </table>
      
      <div class="canister medium-gray">
        ${request.data.Lessons ? html`
          <h3>${copy('collections.details.lessons.label')}</h3>
          ${request.data.Lessons.map((lesson, i) => html`
            <div>
              <a href="/labs/?lessonId=${lesson.lessonId}&lessonStage=1">
                ${lesson.lessonName}
              </a>
              <p>
                ${lesson.lessonDescription}
              </p>
            </div>
            ${request.data.Lessons.length !== i + 1 ? html`<hr/>` : ''}
          `)}        
        ` : html `
          <h3>${copy('collection.details.lessons.empty.label')}</h3>
        `}             
      </div>
    ` : ''}
  `
}

customElements.define('antidote-collection-details', component(CollectionDetails));

export default CollectionDetails;
