
var O = Object

module.exports = eachIn

function eachIn (object, iterator) {
  var keys = O.keys(object)
  var len = keys.length
  var key

  for (var i = 0; i < len; i++) {
    key = keys[i]
    iterator(object[key], key)
  }
}
