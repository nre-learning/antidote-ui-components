import { html } from 'lit-html';
import { component } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import useFetch from "../helpers/use-fetch.js";
import getL8nReader from '../helpers/l8n';

function PTRBanner() {
  const l8n = getL8nReader(this);
  const showPTR = location.hostname.startsWith('ptr');

  if (showPTR) {
    const syringeInfoRequest = useFetch(`${syringeServiceRoot}/exp/syringeinfo`);
    const commits = syringeInfoRequest.succeeded
      ? {
        antidote: syringeInfoRequest.data.antidoteSha,
        antidoteweb: window.COMMIT_HASH,
        syringe: syringeInfoRequest.data.buildSha,
      }
      : null;

    return commits ? html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <div id="ptrBanner">
      ${l8n('ptr.banner.realm.label')}
      ${l8n('ptr.banner.curriculum.label')}
       
      Curriculum:
      <a href="https://github.com/nre-learning/nrelabs-curriculum/commit/${commits.antidote}">
        ${commits.antidote.substring(0, 7)}
      </a>  
      | Antidote-Web:
      <a href="https://github.com/nre-learning/antidote-web/commit/${commits.antidoteweb}">
        ${commits.antidoteweb.substring(0, 7)}
      </a> 
      | Syringe:
      <a href="https://github.com/nre-learning/syringe/commit/${commits.syringe}">
        ${commits.syringe.substring(0, 7)}
      </a>  
    </div>
  ` : html``;
  } else {
    return html``;
  }
}

customElements.define('antidote-ptr-banner', component(PTRBanner));

export default PTRBanner;
