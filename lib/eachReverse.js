
'use strict'

module.exports = eachReverse

function eachReverse (array, iterator) {
  var len = array.length
  for (var i = len; i; i--) {
    iterator(array[(i-1)], (i-1))
  }
  return
}
