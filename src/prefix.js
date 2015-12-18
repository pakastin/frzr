
const style = document.createElement('p').style;
const prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
const memoized = {};

/**
 * Prefixes style property
 * @param  {String} propertyName Style property name to prefix
 * @return {String} Returns prefixed property name
 */
export function prefix (propertyName) {
  if (typeof memoized[propertyName] !== 'undefined') {
    return memoized[propertyName];
  }

  if (typeof style[propertyName] !== 'undefined') {
    memoized[propertyName] = propertyName;
    return propertyName;
  }

  const camelCase = propertyName[0].toUpperCase() + propertyName.slice(1);

  for (let i = 0, len = prefixes.length; i < len; i++) {
    const test = prefixes[i] + camelCase;

    if (typeof style[test] !== 'undefined') {
      memoized[propertyName] = test;

      return test;
    }
  }
}
