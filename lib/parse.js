
'use strict'

module.exports = parse

function parse (element) {
  return String(element.innerHTML).trim()
}
