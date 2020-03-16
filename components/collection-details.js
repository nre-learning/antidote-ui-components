import '../contexts.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { syringeServiceRoot, collectionSlug } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function CollectionDetails() {
  const l8n = getL8nReader(this);
  const request = useFetch(`${syringeServiceRoot}/exp/collection/${collectionSlug}`);

  return html` 
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <style>
      h1 {
        text-align: center;
      }
    </style>
    ${request.succeeded ? html`
      <h1>${request.data.Title}</h1>
      
      <img class="collectionLogo" src="${request.data.Image}" />
      
      <p>${request.data.LongDescription}</p>
      
      <table>
        <tr><td>${l8n('collection.details.type.label')}</td><td>${request.data.Type}</td></tr>
        <tr>
          <td>${l8n('collection.details.website.label')}</td>
          <td>
            <a href="${request.data.Website}">${request.data.Website}</a>
          </td>
        </tr>
        <tr>
          <td>${l8n('collection.details.email.label')}</td>
          <td>
            <a href="mailto:${request.data.ContactEmail}">${request.data.ContactEmail}</a>
          </td>
        </tr>
      </table>
      
      <div class="canister medium-gray">
        ${request.data.Lessons ? html`
          <h3>${l8n('collection.details.lessons.label')}</h3>
          ${request.data.Lessons.map((lesson, i) => html`
            <div>
              <a href="/labs/?lessonSlug=${lesson.Slug}&lessonStage=1">
                ${lesson.lessonName}
              </a>
              <p>
                ${lesson.lessonDescription}
              </p>
            </div>
            ${request.data.Lessons.length !== i + 1 ? html`<hr/>` : ''}
          `)}        
        ` : html `
          <h3>${l8n('collection.details.lessons.empty.label')}</h3>
        `}             
      </div>
    ` : ''}
  `
}

customElements.define('antidote-collection-details', component(CollectionDetails));

export default CollectionDetails;
