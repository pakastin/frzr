
'use strict'

module.exports = times

function times (len, iterator) {
  for (var i = 0; i < len; i++) {
    iterator(i)
  }
}
