
'use strict'

var frzr = require('./index')
var render = require('./render')
var templates = {}

module.exports = Tag

function Tag (name, tmpl, constructor) {
  if (templates[name]) {
    return templates[name].childNodes[0].cloneNode()
  }
  var el
  var tmpl = String(tmpl || '').trim()
  if (startsWith(tmpl, ['<td>'])) {
    el = document.createElement('tr')
  } else if (startsWith(tmpl, ['<tr>', '<td>'])) {
    el = document.createElement('tbody')
  } else if (startsWith(tmpl, ['<thead>','<tbody>'])) {
    el = document.createElement('table')
  } else {
    el = document.createElement('div')
  }
  templates[name] = el
  el.innerHTML = tmpl
  frzr.tags[name] = {
    constructor: constructor,
    tmpl: templates[name].childNodes[0]
  }
}

function startsWith (haystack, needles) {
  var len = needles.length
  var found

  for (var i = 0; i < len; i++) {
    if (haystack.slice(0, needles[i].length) === needles[i]) {
      found = true
      break
    }
  }

  return found
}
