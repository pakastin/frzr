
import {each, filter, slice} from './index'

export default function Emitter () {
  var self = this
  var isEmitter = self instanceof Emitter

  if (!isEmitter) {
    return new Emitter()
  }

  self.listeners = {}

  return self
}

var emitterProto = Emitter.prototype

emitterProto.on = on
emitterProto.off = off
emitterProto.trigger = trigger

function on (name, cb, ctx) {
  var self = this
  var listeners = self.listeners[name] || (self.listeners[name] = [])

  listeners.push({
    cb: cb,
    ctx: ctx
  })

  return self
}

function trigger (name) {
  var self = this
  var args = slice(arguments, 1)
  var listeners = self.listeners[name]

  if (!listeners) {
    return self
  }
  each(listeners, function (listener) {
    listener.cb.apply(listener.ctx || self, args)
  })

  return self
}

function off (name, cb) {
  var self = this
  var listeners
  if (cb) {
    listeners = self.listeners[name]

    if (!listeners) {
      return self
    }
    self.listeners = filter(listeners, function (listener) {
      return listener.cb === cb
    })
    return self
  }
  if (name) {
    delete listeners[name]
    return self
  }
  self.listeners = {}
  return self
}
