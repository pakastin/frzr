
'use strict'

module.exports = parse

function parse (element) {
  if (typeof element === 'string') {
    return document.querySelector(element).innerHTML
  } else {
    return element.innerHTML
  }
}
