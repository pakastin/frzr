
var style = (global.document && document.createElement('p').style) || {};
var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
var memoized = {};

export function prefix (propertyName) {
  if (typeof memoized[propertyName] !== 'undefined') {
    return memoized[propertyName];
  }

  if (typeof style[propertyName] !== 'undefined') {
    memoized[propertyName] = propertyName;
    return propertyName;
  }

  var camelCase = propertyName[0].toUpperCase() + propertyName.slice(1);

  for (var i = 0, len = prefixes.length; i < len; i++) {
    var test = prefixes[i] + camelCase;

    if (typeof style[test] !== 'undefined') {
      memoized[propertyName] = test;

      return test;
    }
  }
}
