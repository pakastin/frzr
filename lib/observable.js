
var A = Array
var O = Object

var array = A.prototype
var defineProperties = O.defineProperties
var slice = array.slice

module.exports = observable

function observable (target) {
  var listeners = {}

  defineProperties(target, {
    on: {
      value: on
    },
    one: {
      value: one
    },
    off: {
      value: off
    },
    trigger: {
      value: trigger
    }
  })

  return target

  function on (name, cb) {
    if (typeof name === 'undefined') {
      return
    }
    if (typeof cb === 'undefined') {
      return
    }
    listeners[name] || (listeners[name] = [])
    listeners[name].push({
      cb: cb
    })
  }

  function one (name, cb) {
    if (typeof name === 'undefined') {
      return
    }
    if (typeof cb === 'undefined') {
      return
    }
    listeners[name] || (listeners[name] = [])
    listeners[name].push({
      cb: cb,
      one: true
    })
  }

  function trigger (name) {
    if (typeof name === 'undefined' || !listeners[name]) {
      return
    }
    var currentListeners = listeners[name]
    var len = currentListeners.length
    var args = slice.call(arguments, 1)

    for (var i = 0; i < len; i++) {
      currentListeners[i].cb.apply(this, args)

      if (currentListeners[i].one) {
        currentListeners.splice(i, 1)
        len--
        i--
      }
    }
  }

  function off (name, cb) {
    if (typeof name === 'undefined') {
      listeners = {}
      return
    }
    if (typeof cb === 'undefined') {
      delete listeners[name]
      return
    }
    var currentListeners = listeners[name] || []
    var len = currentListeners.length
    var listener

    for (var i = 0; i < len; i++) {
      listener = currentListeners[i]

      if (listener.cb === cb) {
        currentListeners.splice(i, 1)
        len--
        i--
      }
    }
  }
}
