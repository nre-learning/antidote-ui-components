import { html } from 'lit-html';
import { component } from 'haunted';
import { acoreServiceRoot } from "../helpers/page-state.js";
import useFetch from "../helpers/use-fetch.js";
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function PTRBanner() {
  const l8n = getL8nReader(this);
  const showPTR = location.hostname.startsWith('ptr');

  // This isn't as useful as it used to be, so disabling for now. Would be nice if this could get refactored
  // to show details for preview sites.
  showPTR = false;
  if (showPTR) {
    const antidoteInfoRequest = useFetch(`${acoreServiceRoot}/exp/antidoteInfo`);
    const commits = antidoteInfoRequest.succeeded
      ? {
        curriculum: antidoteInfoRequest.data.curriculumVersion,
        antidoteweb: window.COMMIT_HASH,
        acore: antidoteInfoRequest.data.buildSha,
      }
      : null;

    return commits ? html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <div id="ptrBanner">
      ${l8n('ptr.banner.realm.label')}
      ${l8n('ptr.banner.curriculum.label')}
       
      Curriculum:
      <a href="https://github.com/nre-learning/nrelabs-curriculum/commit/${commits.antidote}">
        ${commits.curriculum.substring(0, 7)}
      </a>  
      | Antidote-Web:
      <a href="https://github.com/nre-learning/antidote-web/commit/${commits.antidoteweb}">
        ${commits.antidoteweb.substring(0, 7)}
      </a> 
      | acore:
      <a href="https://github.com/nre-learning/acore/commit/${commits.acore}">
        ${commits.acore.substring(0, 7)}
      </a>  
    </div>
  ` : html``;
  } else {
    return html``;
  }
}

customElements.define('antidote-ptr-banner', component(PTRBanner));

export default PTRBanner;
