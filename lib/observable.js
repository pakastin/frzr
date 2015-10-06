
export function Observable () {
  this.listeners = {}
}

Observable.prototype.on = function (name, cb, ctx, once) {
  this.listeners[name] || (this.listeners[name] = [])
  this.listeners[name].push({
    once: once || false,
    cb: cb,
    ctx: ctx || this
  })
}

Observable.prototype.one = function (name, cb, ctx) {
  this.on(name, cb, ctx, true)
}

Observable.prototype.trigger = function (name) {
  var self = this
  var listeners = self.listeners[name]
  var len = arguments.length - 1
  var args = new Array(len)

  for (var i = 0; i < len; i++) {
    args[i] = arguments[i + 1]
  }

  if (!listeners) {
    return
  }

  var listener

  for (i = 0; i < listeners.length; i++) {
    listener = listeners[i]
    listener.cb.apply(listener.ctx || self, args)
    if (listener.once) {
      listeners.splice(i--, 1)
      len--
    }
  }
}
