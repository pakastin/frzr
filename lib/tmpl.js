
var memoize = {}

module.exports = tmpl

function tmpl (html) {
  if (memoize[html]) {
    return memoize[html]
  }
  var el = document.createElement('div')
  el.innerHTML = html
  memoize[html] = el.firstChild
  return memoize[html]
}
