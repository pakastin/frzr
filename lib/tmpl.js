
var each = require('./each')
var memoize = {}

module.exports = tmpl

function tmpl (html) {
  if (memoize[html]) {
    return memoize[html]
  }
  html = html.trim()
  var startWith = html.slice(0, 3)
  var el
  if (startWith === '<tr' || startWith === '<td') {
    el = document.createElement('tbody')
  } else {
    el = document.createElement('div')
  }
  el.innerHTML = html
  var find = {}
  iterate(el.firstChild, '', find)
  memoize[html] = {
    find: find,
    tmpl: el.firstChild
  }
  return memoize[html]
}

function iterate (target, keypath, find) {
  var children = target.childNodes

  if (children.length === 0) {
    return
  }
  each(children, function (child, i) {
    if (child.nodeType > 1) {
      return
    }
    var frzr = child.getAttribute('frzr')
    if (frzr != null) {
      find[frzr] = keypath + i
      child.removeAttribute('frzr')
    }
    iterate(child, keypath + i + '.', find)
  })
}
