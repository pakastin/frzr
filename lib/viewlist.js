
import {Emitter, View, each, inherit, reduce} from './index'

export default function ViewList (view, idAttribute) {
  var self = this
  var isViewList = self instanceof ViewList

  if (!isViewList) {
    return new ViewList(view, idAttribute)
  }
  self.idAttribute = idAttribute
  self.View = view || View
  self.views = []
  self.lookup = {}

  return self
}

inherit(ViewList, Emitter)

var ViewListProto = ViewList.prototype

ViewListProto.mount = mount
ViewListProto.reset = reset

ViewList.extend = extend

function mount (root) {
  var self = this

  root = root || self.root

  if (!root) {
    return
  }

  if (root instanceof View) {
    root = root.$el
  }

  // Update items
  var traverse = root.firstChild

  each(self.views, function (view, i) {
    if (traverse === view.$el) {
      traverse = traverse.nextSibling
      return
    }
    if (traverse) {
      root.insertBefore(view.$el, traverse)
    } else {
      root.appendChild(view.$el)
    }
  })
  var next
  while (traverse) {
    next = traverse.nextSibling
    root.removeChild(traverse)
    traverse = next
  }
  self.root = root
  return self
}

function reset (items) {
  var self = this
  var idAttribute = self.idAttribute

  var views

  if (idAttribute == null) {
    views = reduce(items, new Array(items.length), function (init, item, i) {
      var view = self.views[i]

      if (!view) {
        view = new self.View()
      }
      view.reset(item)
      init[i] = view

      return init
    })
    self.views = views
    self.mount()
    return
  }

  var lookup = {}

  views = reduce(items, [], function (init, item, i) {
    var id = item[idAttribute]
    var currentView = self.lookup[id]
    if (!currentView) {
      currentView = new self.View()
    }
    currentView.reset(item)
    init[i] = lookup[id] = currentView
    return init
  })

  each(self.views, function (view, i) {
    var id = view[idAttribute]

    if (!lookup[id]) {
      view.destroy()
      delete lookup[id]
    }
  })

  self.views = views
  self.lookup = lookup

  self.mount()

  return self
}

function extend (extendedIdAttribute, extendedView) {
  var emitter = new Emitter()
  var params = {}

  function ExtendedViewList (idAttribute, view) {
    var ViewList = new ViewList(idAttribute || extendedIdAttribute, view || extendedView)
    ViewList.listeners = emitter.listeners

    if (params.root) {
      ViewList.mount(params.root)
    }

    return ViewList
  }

  ExtendedViewList.mount = function (root) {
    params.root = root

    return ExtendedViewList
  }

  ExtendedViewList.unmount = function () {
    delete params.root

    return ExtendedViewList
  }

  ExtendedViewList.on = function (name, cb, ctx) {
    emitter.on(name, cb, ctx)

    return ExtendedViewList
  }

  return ExtendedViewList
}
