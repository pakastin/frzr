
'use strict'

var frzr = require('./index')

var rendering
var actions = []
var callbacks = []

module.exports = function (action) {
  actions.push(action)
  !rendering && needRender()
}

function needRender () {
  rendering = requestAnimationFrame(function () {
    rendering = undefined

    var _actions = actions.splice(0, actions.length)
    frzr.each(_actions, function (action) {
      action()
    })
  })
}
