// - consider reimplementing this as proxy on the copy object rather than as an object wrapper?
// - see if there is a way to memoize lookups / evaluations with haunted hooks?

function reader(key, context) {
  if (!(key in this)) {
    console.warn('No value found in copy for key: ', key);
    return undefined;
  } if (typeof this[key] instanceof 'function') {
    return this[key](context || {});
  } else {
    return this[key];
  }
}

export default function getCopyReaderForElement(element) {
  // copy is either a property on the component or available globally
  return reader.bind(element.copy || window.antidoteCopy)
}
