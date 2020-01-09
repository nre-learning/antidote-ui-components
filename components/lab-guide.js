import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { useContext, useEffect, component } from 'haunted';
import { LiveLessonDetailsContext } from '../contexts.js';
import { serviceHost, lessonId, lessonStage, sessionId } from "../helpers/page-state.js";
import showdown from 'showdown';
import debounce from '../helpers/debounce.js';

// this function currently needs to be global since it's explicitly referenced in guide markdown content
// this could eventually be scoped and bound to the appropriate buttons post-render
// rather than binding in the markup in the lesson guide markdown
document.runSnippetInTab = function runSnippetInTab(id, snippetIndex) {
  const tabSwitcherEl = document.querySelector('antidote-lab-tab-switcher');
  const guideEl = document.querySelector('antidote-lab-guide');
  const text = typeof snippetIndex === 'number'
    ? guideEl.shadowRoot.querySelectorAll('pre')[parseInt(snippetIndex)].innerText
    : snippetIndex.parentNode.previousElementSibling.innerText;

  tabSwitcherEl.setSelectedPresentation(id);

  const tabEl = document.querySelector('antidote-lab-tabs')
    .shadowRoot.querySelector(`div[selected]`);
  const terminalEl = tabEl.querySelector('antidote-terminal');

  terminalEl.run(text);
};

// attach scroll listener to send scroll position events, allowing position synchronization with
// any other guides on the page for this lesson (e.g one that will be shown in when in mobile layout)
function useSyncronizedScrolling(guide) {
  useEffect(() => {
    const handleGuideScroll = debounce(() => {
      const scrollFraction = this._lastPosition || (this.scrollTop / (this.scrollHeight - this.offsetHeight));
      this.dispatchEvent(new CustomEvent('antidote-guide-scroll-position-change', {
        bubbles: true, // allows bubbling up through the DOM
        composed: true, // allows crossing the Shadow DOM boundary
        detail: { lessonId, lessonStage, position: scrollFraction } // all data you wish to pass must be in `detail`
      }));
      this._lastPosition = undefined; // clear when position is set by user rather than an event
    }, 100);

    const handleGuidePositionChange = (ev) => {
      const currentPosition = this.scrollTop / (this.scrollHeight - this.offsetHeight);
      if (ev.target !== this // don't react to our own events
        && ev.detail.lessonId === lessonId // only react to events for a particular lesson
        && ev.detail.lessonStage === lessonStage // don't react if we're already at that position
        && ev.detail.position !== currentPosition) { // only react if we're actually at a different position
        this._lastPosition = ev.detail.position; // used to control rounding jitter feedback loops introduced when sending an event in response to a scroll that was itself in response to an event
        //todo: change this to scrollTop modification once haunted issue is resolved: https://github.com/matthewp/haunted/issues/166
        const scrollTop = ev.detail.position * (this.scrollHeight - this.offsetHeight);
        this.scrollTo({top: scrollTop});
      }
    };

    // listen for me scrolling and update other guide
    this.addEventListener('scroll', handleGuideScroll);
    // listen for other guides sending updates and update myself
    document.addEventListener('antidote-guide-scroll-position-change', handleGuidePositionChange);

    return () => {
      this.removeEventListener('scroll', handleGuideScroll);
      document.removeEventListener('antidote-guide-scroll-position-change', handleGuidePositionChange);
    }
  }, []);
}

function LabGuide() {
  const lessonDetailsRequest = useContext(LiveLessonDetailsContext);
  let guideContent = "";

  if (lessonDetailsRequest.succeeded) {
    if (lessonDetailsRequest.data.JupyterLabGuide) {
      const path = `/notebooks/stage${lessonStage}/notebook.ipynb`;
      const url = `${serviceHost}/${lessonId}-${sessionId}-ns-jupyterlabguide${path}`;

      guideContent = html`<iframe src="${url}"></iframe>`;
    }
    else if (lessonDetailsRequest.data.LabGuide) {
      const converter = new showdown.Converter();

      guideContent = unsafeHTML(
        '<div>'+converter.makeHtml(lessonDetailsRequest.data.LabGuide)+'</div>'
      );
    }
  }

  useSyncronizedScrolling.apply(this);

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    ${guideContent}
    <antidote-lab-stage-selector></antidote-lab-stage-selector>
  `;
}

customElements.define('antidote-lab-guide', component(LabGuide));

export default LabGuide;
