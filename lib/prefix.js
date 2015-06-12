
var prefixes = 'webkit moz Moz o O ms'.split(' ')

var style = document.createElement('p').style
var memoized = {}

module.exports = prefix

function prefix (parameter) {
  var i, len, prefixed

  if (memoized[parameter]) {
    return memoized[parameter]
  }
  if (parameter === 'transitionend') {
    if (typeof window.ontransitionend !== 'undefined') {
      memoized[parameter] = 'transitionend'
      return memoized[parameter]
    }
    len = prefixes.length
    for (i = 0; i < len; i++) {
      prefixed = prefixes[i]
      if (typeof window['on' + prefixed + 'transitionend'] !== 'undefined') {
        memoized[parameter] = prefixed + 'Transitionend'
        return memoized[parameter]
      }
    }
    return
  }
  parameter = parameter.split('-').map(function (part) {
    return part.slice(0, 1).toUpperCase() + part.slice(1)
  }).join('')
  var defaultParameter = parameter[0].toLowerCase() + parameter.slice(1)
  if (typeof style[defaultParameter] !== 'undefined') {
    memoized[parameter] = defaultParameter
    return memoized[parameter]
  }
  len = prefixes.length
  for (i = 0; i < len; i++) {
    prefixed = prefixes[i]
    if (typeof style[prefixed + parameter] !== 'undefined') {
      memoized[parameter] = prefixed + parameter
      return memoized[parameter]
    }
  }
}
