
import {Emitter, each, forIn, filter, inherit} from './index'

export default function View (type) {
  var self = this
  var isView = self instanceof View

  if (!isView) {
    return new View(type)
  }

  View.super.call(this)

  self.data = {}
  self.$el = document.createElement(type || 'div')
}

inherit(View, Emitter)

var viewProto = View.prototype

viewProto.mount = mount
viewProto.unmount = unmount
viewProto.text = text
viewProto.html = html
viewProto.addClass = addClass
viewProto.removeClass = removeClass
viewProto.reset = reset
viewProto.destroy = destroy

View.extend = extend

function mount (root) {
  var self = this
  self.root = root

  if (root instanceof View) {
    root = root.$el
  }

  root.appendChild(self.$el)

  return self
}

function unmount () {
  var self = this
  var root = self.root
  if (!root) {
    return
  }
  if (root instanceof View) {
    root = root.$el
  }
  root.removeChild(self.$el)

  return self
}

function text (text) {
  var self = this

  self.$el.textContent = text

  return self
}

function html (html) {
  var self = this

  self.$el.innerHTML = html

  return self
}

function addClass (className) {
  var self = this

  self.$el.classList.add(className)

  return self
}

function removeClass (className) {
  var self = this

  self.$el.classList.remove(className)

  return self
}

function reset (data) {
  var self = this
  self.trigger('update', self, data, self.data)
  self.data = data

  return self
}

function destroy () {
  var self = this
  self.trigger('destroy', self)
  self.off()
  self.unmount()

  return self
}

function extend (extendedType) {
  var emitter = new Emitter()
  var classes = []
  var classLookup = {}
  var params = {}

  function ExtendedView (type) {
    var view = new View(type || extendedType)

    view.listeners = emitter.listeners

    each(classes, function (className) {
      view.addClass(className)
    })

    if (params.root) {
      view.mount(params.root)
    }

    view.trigger('init', view)

    return view
  }
  ExtendedView.mount = function mount (root) {
    params.root = root

    return ExtendedView
  }
  ExtendedView.unmount = function mount (_root) {
    delete params.root

    return ExtendedView
  }
  ExtendedView.addClass = function addClass (className) {
    if (classLookup[className]) {
      return ExtendedView
    }
    classes.push(className)
    classLookup[className] = true

    return ExtendedView
  }
  ExtendedView.removeClass = function addClass (className) {
    if (classLookup[className]) {
      classes = filter(classes, function (_className) {
        return _className !== className
      })
      delete classLookup[className]
    }

    return ExtendedView
  }
  ExtendedView.on = function on (name, cb, ctx) {
    emitter.on(name, cb, ctx)
    return ExtendedView
  }
  ExtendedView.off = function off (name, cb, ctx) {
    emitter.off(name, cb, ctx)
    return ExtendedView
  }

  return ExtendedView
}
