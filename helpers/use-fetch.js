import { useState, useEffect } from 'haunted';
import { syringeServiceRoot, lessonId} from "../helpers/page-state.js";
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
        if (lessonId > 0) {
          throw new Error(`It looks like you're using an older URL with the legacy "lessonId" field.
            This is no longer supported. Please navigate back to the lesson catalog using the button
            below and search for your lesson.`);
        }
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

async function getSessionId(clearFirst) {

  if (clearFirst) {
    document.cookie = 'nreLabsSession=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)nreLabsSession\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (sessionId === '') {
    const sessionResponse = await fetch(`${syringeServiceRoot}/exp/livesession`, {
        method: 'POST',
        body: JSON.stringify({})
    });
    // TODO(mierdin): see nils' email about the risks here - like if there's an error, this may not work.
    const sessionData = await sessionResponse.json();
    // fetch() doesn't throw exceptions for HTTP error codes so we need to do this ourselves.
    if (sessionResponse.status >= 400) {
        throw new Error(typeof sessionData == "object" && sessionData.error ? sessionData.error : sessionData);
    }

    // set cookie and return
    document.cookie = "nreLabsSession=" + sessionData.ID;
    return sessionData.ID
  }

  // return cookie contents
  return sessionId
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
        if (lessonId > 0) {
          throw new Error(`It looks like you're using an older URL with the legacy "lessonId" field.
            This is no longer supported. Please navigate back to the lesson catalog using the button
            below and search for your lesson.`);
        }
        var sessionId = await getSessionId(false);
        // Inject sessionId to body and convert to string
        options.body["sessionId"] = sessionId;
        options.body = JSON.stringify(options.body)

        const response = await fetch(url, options);
        const data = options && options.text ? await response.text() : await response.json();
        // fetch() doesn't throw exceptions for HTTP error codes so we need to do this ourselves.
        if (response.status >= 400) {
          // If the error is that our session ID hasn't been found, request a new one and try once more
          if (data.message.includes("Invalid session ID")) {
            sessionId = await getSessionId(true);
            var optionsBody = JSON.parse(options.body);
            optionsBody["sessionId"] = sessionId;
            options.body = JSON.stringify(optionsBody)
            const retryResponse = await fetch(url, options);
            const retryData = options && options.text ? await retryResponse.text() : await retryResponse.json();
            if (retryResponse.status >= 400) {
                throw new Error(typeof retryData == "object" && retryData.error ? retryData.error : retryData);
            }
            setRequestState({
              data: retryData,
              pending: false,
              completed: true,
              succeeded: true,
              error: false
            })
          } else {
            throw new Error(typeof data == "object" && data.error ? data.error : data);
          }
        } else {
          setRequestState({
            data: data,
            pending: false,
            completed: true,
            succeeded: true,
            error: false
          })
        }
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