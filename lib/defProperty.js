
'use strict'

module.exports = function (item, key, value) {
  Object.defineProperty(item, key, {
    value: value
  })
}
