
import {each, inherits} from './utils'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {View} from './view'

export function Views (ChildView, options) {
  const isViews = this instanceof Views

  if (!isViews) {
    return new Views(ChildView, options)
  }

  this.view = new View(options)
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
  const ChildView = this.ChildView

  const views = new Array(data.length)
  const lookup = {}
  const currentLookup = this.lookup

  for (let i = 0, len = data.length, id, view; i < len; i++) {
    let item = data[i]

    id = key ? item[key] : i
    view = currentLookup[id]

    if (!view) {
      view = new ChildView({parent: this.view})
    }

    lookup[id] = view
    view.set(item)
    views[i] = view
  }
  for (let id in currentLookup) {
    if (!lookup[id]) {
      currentLookup[id].destroy()
    }
  }
  this.views = views
  this.lookup = lookup
  this.reorder()
}

Views.prototype.reorder = function () {
  const $root = this.view.$el

  batchAnimationFrame(() => {
    let traverse = $root.firstChild

    for (let i = 0, len = this.views.length; i < len; i++) {
      let view = this.views[i]

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
    }
    while (traverse) {
      let next = traverse.nextSibling
      $root.removeChild(traverse)
      traverse = next
    }
  })
}
