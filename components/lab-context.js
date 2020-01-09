import '../contexts.js';
import { html } from 'lit-html';
import { sessionId, lessonId, lessonStage, syringeServiceRoot} from "../helpers/page-state.js";
import { component } from 'haunted';
import useFetch from '../helpers/use-fetch.js';
import usePollingRequest from '../helpers/use-polling-request.js';

function derivePresentationsFromLessonDetails(detailsRequest) {
  const endpoints = detailsRequest.succeeded ? detailsRequest.data.LiveEndpoints : [];

  return Object.values(endpoints).reduce((acc, ep) => {
    if (ep.Presentations) {
      ep.Presentations.forEach((pres) => {
        const name = ep.Presentations.length > 1
            ? `${ep.Name} - ${pres.Name}`
            : `${ep.Name}`;

        acc.push({
          name,
          endpoint: ep.Name,
          type: pres.Type,
          host: ep.Host,
          port: pres.Port,
        });
      });
    }

    return acc;
  }, []);
}

customElements.define('antidote-lab-context', component(() => {
  const lessonRequest = useFetch(`${syringeServiceRoot}/exp/lesson/${lessonId}`);
  const liveLessonDetailRequest = usePollingRequest({
    initialRequestURL: `${syringeServiceRoot}/exp/livelesson`,
    initialRequestOptions: {
      method: 'POST',
      body: JSON.stringify({ lessonId, lessonStage, sessionId })
    },
    progressRequestURL: ({id}) => `${syringeServiceRoot}/exp/livelesson/${id}`,
    isProgressComplete: ({LiveLessonStatus}) => LiveLessonStatus === 'READY',
  });
  const isMobileSizedWindow = window.innerWidth <= 1023; // todo: convert to use var from style
  const presentations = derivePresentationsFromLessonDetails(liveLessonDetailRequest);
  const presentationTabs = presentations ? presentations.map((p, i) => ({
    id: p.name.toLowerCase(),
    label: p.name,
    pres: p,
    selected: isMobileSizedWindow ? false : i === 0
  })) : [];
  const tabs = [
    // this is hardcoded, ideally this would be assembled by the components reading their slots &
    // merging them together to make a config
    {
      id: 'mobile-guide',
      label: 'Guide',
      selected: isMobileSizedWindow // start with the guide tab selected if the page is narrow enough to need it
    },
    ...presentationTabs
  ];

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <antidote-lesson-context-provider .value=${lessonRequest}>
    <antidote-live-lesson-details-context-provider .value=${liveLessonDetailRequest}>
    <antidote-lab-tabs-context-provider .value=${tabs}>
        <slot></slot>
    </antidote-lab-tabs-context-provider>      
    </antidote-live-lesson-details-context-provider>      
    </antidote-lesson-context-provider>
  `
}));
