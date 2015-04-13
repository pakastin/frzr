'use strict'

var frzr = require('./index')
var objectKeys = frzr.objectKeys

module.exports = eachIn

function eachIn (object, iterator) {
  var keys = objectKeys(object)
  var len = keys.length
  var key
  var i

  for (i = 0; i < len; i++) {
    key = keys[i]
    iterator(object[key], key)
  }
}
