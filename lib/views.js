
import {each, inherits} from './utils'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {View} from './view'

export function Views (ChildView, type, options) {
  this.view = new View(type, options)
  this.views = []
  this.lookup = {}
  this.ChildView = ChildView || View
}

inherits(Views, Observable)

Views.prototype.mount = function (target) {
  this.view.mount(target)
}

Views.prototype.mountBefore = function (target, before) {
  this.view.mountBefore(target, before)
}

Views.prototype.unmount = function () {
  this.view.unmount()
}

Views.prototype.reset = function (data, key) {
  var self = this
  var ChildView = self.ChildView

  var views = new Array(data.length)
  var lookup = {}
  var currentLookup = self.lookup

  each(data, function (item, i) {
    var id_or_i = key ? item[key] : i
    var view = currentLookup[id_or_i]

    if (!view) {
      view = new ChildView(null, {parent: self.view})
    }
    lookup[id_or_i] = view
    view.set(item)
    views[i] = view
  })
  for (var id in currentLookup) {
    if (!lookup[id]) {
      currentLookup[id].destroy()
    }
  }
  self.views = views
  self.lookup = lookup
  self.reorder()
}

Views.prototype.reorder = function () {
  var self = this
  var $root = self.view.$el

  batchAnimationFrame(function () {
    var traverse = $root.firstChild

    each(self.views, function (view, i) {
      if (traverse === view.$el) {
        traverse = traverse.nextSibling
        return
      }
      if (traverse) {
        view.$root = $root
        $root.insertBefore(view.$el, traverse)
      } else {
        view.$root = $root
        $root.appendChild(view.$el)
      }
    })
    var next
    while (traverse) {
      next = traverse.nextSibling
      $root.removeChild(traverse)
      traverse = next
    }
  })
}
