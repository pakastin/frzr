
'use strict'

var frzr = require('./index')
var render = require('./render')

module.exports = Tag

function Tag (name, tmpl, constructor) {
  var el = document.createElement('div')
  el.innerHTML = tmpl
  frzr.tags[name] = {
    constructor: constructor,
    tmpl: el.removeChild(el.childNodes[0])
  }
}
