export const [serviceHost, syringeServiceRoot, sshServiceHost] = (() => {

  // Since sshUrl is now configurable, the default case works for both production and
  // selfmedicate. However, more tweaks may be needed.
  const sshUrl = window.WEBSSH2_LOCATION || 'http://'+window.location.host+':30010'
  switch (window.ENVIRONMENT) {
    case "mock":
      return [`${window.location.protocol}//127.0.0.1:8086`, `${window.location.protocol}//127.0.0.1:8086`, sshUrl];
    case "self-medicate":
      return [`${window.location.protocol}//antidote-local:30001`, `${window.location.protocol}//antidote-local:30001/syringe`, sshUrl];
    case "production":
    default:
      return [window.location.origin, window.location.origin+'/syringe', sshUrl];
  }
})();

// get params from page url query parameters
export const [lessonSlug, lessonStage, collectionSlug] = (() => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("lessonSlug");
  const stage = url.searchParams.get("lessonStage");
  const collection = url.searchParams.get("collectionSlug");

  return [
    id && id.length > 0 ? id : null,
    stage && stage.length > 0 ? parseInt(stage) : null,
    collection && collection.length > 0 ? collection : null,
  ]
})();
