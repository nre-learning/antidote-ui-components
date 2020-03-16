import { useState, useEffect } from 'haunted';
import { syringeServiceRoot} from "../helpers/page-state.js";

const defaultState = {
  data: null,
  pending: false,
  completed: false,
  succeeded: false,
  error: false,
};

// hook that updates the component that calls this at various states of a
// request lifecycle
export default function useFetch(path, options) {
  const url = `${path}`;
  const [requestState, setRequestState] = useState(defaultState);

  useEffect(async () => {
    if (path) { // only start request after path variable is defined, this allows consuming hooks/components to determine when a request is started
      setRequestState({
        data: null,
        pending: true,
        completed: false,
        succeeded: false,
        error: false,
      });

      try {
        const response = await fetch(url, options);
        const data = options && options.text ? await response.text() : await response.json();
        // fetch() doesn't throw exceptions for HTTP error codes so we need to do this ourselves.
        if (response.status >= 400) {
            throw new Error(typeof data == "object" && data.error ? data.error : data);
        }
        setRequestState({
          data: data,
          pending: false,
          completed: true,
          succeeded: true,
          error: false
        })
      } catch (e) {
        setRequestState({
          data: null,
          pending: false,
          completed: true,
          succeeded: false,
          error: e.message,
        });
      }
    }
  }, [url, JSON.stringify(options)]);

  return requestState
}

// requestLiveLesson was written to be an opinionated version of useFetch, that includes a synchronous
// fetch to get a sessionID if necessary.
// Note that unlike useFetch, this accepts an un-stringified object for the payload body, so we can
// inject the sessionId. Since this is specific to the livelesson use case, I may just refactor this to
// accept only the parameters needed instead of all the options.
// TODO(mierdin): This feels like a code smell to me but I really thought for days about how to do this,
// and the only way I could figure out how to do this (synchronous API calls for session ID then Livelesson)
// is by making this function. Definitely would love someone else to review this and let me know a cleaner way to do
// things that doesn't disrupt the current paradigm
export function requestLiveLesson(path, options) {
  const url = `${path}`;
  const [requestState, setRequestState] = useState(defaultState);

  useEffect(async () => {
    if (path) { // only start request after path variable is defined, this allows consuming hooks/components to determine when a request is started
      setRequestState({
        data: null,
        pending: true,
        completed: false,
        succeeded: false,
        error: false,
      });

      try {
        // TODO(mierdin): How to handle problems here:
        // - if the cookie exists, but the livelesson call rejects it (i.e. because of a service restart)
        //   then we will need to re-start this function call somehow
        var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)nreLabsSession\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (sessionId === '') {
          const sessionResponse = await fetch(`${syringeServiceRoot}/exp/livesession`, {
              method: 'POST',
              body: JSON.stringify({})
          });
          const sessionData = options && options.text ? await sessionResponse.text() : await sessionResponse.json();
          // fetch() doesn't throw exceptions for HTTP error codes so we need to do this ourselves.
          if (sessionResponse.status >= 400) {
              throw new Error(typeof sessionData == "object" && sessionData.error ? sessionData.error : sessionData);
          }

          // set cookie and local var accordingly
          document.cookie = "nreLabsSession=" + sessionData.ID;
          sessionId = sessionData.ID
        }

        // Inject sessionId to body and convert to string
        options.body["sessionId"] = sessionId;
        options.body = JSON.stringify(options.body)

        const response = await fetch(url, options);
        const data = options && options.text ? await response.text() : await response.json();
        // fetch() doesn't throw exceptions for HTTP error codes so we need to do this ourselves.
        if (response.status >= 400) {
            throw new Error(typeof data == "object" && data.error ? data.error : data);
        }
        setRequestState({
          data: data,
          pending: false,
          completed: true,
          succeeded: true,
          error: false
        })
      } catch (e) {
        setRequestState({
          data: null,
          pending: false,
          completed: true,
          succeeded: false,
          error: e.message,
        });
      }
    }
  }, [url, JSON.stringify(options)]);

  return requestState
}