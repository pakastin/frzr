
'use strict'

var frzr = require('./index')

module.exports = mountAll

function mountAll (target, name, items) {
  return Tags(items, target, name)
}

function Tags (items, target, name) {
  var self = this
  var isTags = self instanceof Tags

  if (!isTags) {
    return new Tags(items, target, name)
  }

  if (typeof target === 'string') {
    self.$root = document.querySelector(target)
  } else {
    self.$root = target
  }
  self.$tags = []
  self.$rendered = []
  self.$items = items
  self.$tagName = name

  self.update()
}

frzr.inherits(Tags, frzr.observable)

var proto = Tags.prototype

proto.update = function (data) {
  var self = this
  var fragment, placeholder

  if (data) {
    self.$items = data
  }
  self.trigger('update', self.$items)
  frzr.render(function () {
    self.$parent = self.$root.parentNode
    self.trigger('render')
    frzr.eachReverse(self.$rendered, function (item, oldPos) {
      var pos = self.$items.indexOf(item)

      if (!~pos) {
        if (self.$parent && !self.$updating) {
          self.$updating = true
          self.$placeholder = document.createComment('')
          self.$parent.replaceChild(self.$placeholder, self.$root)
        }
        var tag = self.$tags.splice(oldPos, 1)[0]
        self.$rendered.splice(oldPos, 1)
        tag.unmount()
      }
    })
    frzr.each(self.$items, function (item, pos) {
      var oldPos = self.$rendered.indexOf(item)

      if (!~oldPos) {
        // new item
        if (self.$parent && !self.$updating) {
          self.$updating = true
          self.$placeholder = document.createComment('')
          self.$parent.replaceChild(self.$placeholder, self.$root)
        }
        if (!fragment) {
          fragment = document.createDocumentFragment()
          self.$updating = true
        }
        var tag = frzr.mount(undefined, self.$tagName, item)
        fragment.appendChild(tag.$el)
        tag.$root = self.$root
        self.$rendered.splice(pos, 0, item)
        self.$tags.splice(pos, 0, tag)
      } else if (pos !== oldPos) {
        // moved
        var tag = self.$tags[pos]
        var oldTag = self.$tags.splice(oldPos, 1)[0]
        if (self.$parent && !self.$updating) {
          self.$updating = true
          self.$placeholder = document.createComment('')
          self.$parent.replaceChild(self.$placeholder, self.$root)
        }
        if (!fragment) {
          fragment = document.createDocumentFragment()
          placeholder = document.createComment('')
          self.$root.insertBefore(placeholder, tag.$el)
          self.$updating = true
        }
        fragment.appendChild(oldTag.$el)

        self.$rendered.splice(pos, 0, self.$rendered.splice(oldPos, 1)[0])
        self.$tags.splice(pos, 0, oldTag)
      } else if (fragment) {
        if (placeholder) {
          self.$root.replaceChild(fragment, placeholder)
          placeholder = undefined
        } else {
          self.$root.insertBefore(fragment, self.$tags[pos].$el)
        }
        fragment = undefined
      }
    })
    if (fragment) {
      self.$root.appendChild(fragment)
      fragment = undefined
    }
    if (self.$parent && self.$updating) {
      self.$updating = false
      if (self.$placeholder) {
        self.$parent.replaceChild(self.$root, self.$placeholder)
      } else {
        self.$parent.appendChild(self.$root)
      }
    }
  })
  frzr.render(function () {
    self.trigger('rendered')
  })
  self.trigger('updated', self.$items)
}

proto.mount = function (target, name, data) {
  var self = this
  var mounted = frzr.mount(target, name, data)
  mounted.$parent = self
  return mounted
}

proto.mountAll = function (target, name, data) {
  var self = this
  var mounted = frzr.mountAll(target, name, data)
  mounted.$parent = self
  return mounted
}

proto.unmount = function () {
  self.update([])
  self.trigger('unmount')
  self.off()
}
