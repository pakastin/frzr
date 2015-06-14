
var prefixes = 'webkit moz Moz o O ms'.split(' ')

var style = document.createElement('p').style
var memoized = {}

var each = require('./each')

module.exports = prefix

function prefix (parameter) {
  if (memoized[parameter]) {
    return memoized[parameter]
  }
  if (parameter === 'transitionend') {
    if (typeof window.ontransitionend !== 'undefined') {
      memoized[parameter] = 'transitionend'
      return memoized[parameter]
    }
    each(prefixes, function (prefix, i) {
      if (typeof window['on' + prefix + 'transitionend'] !== 'undefined') {
        memoized[parameter] = prefix + 'Transitionend'
        return memoized[parameter]
      }
    })
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
  each(prefixes, function (prefix, i) {
    if (typeof style[prefix + parameter] !== 'undefined') {
      memoized[parameter] = prefix + parameter
      return memoized[parameter]
    }
  })
}
