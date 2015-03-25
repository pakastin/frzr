
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
    self.$root = self.$find(target)
  } else {
    self.$root = target
  }
  self.$tags = []
  self.$rendered = []
  self.$items = items
  self.$tagName = name
  self.$uid = 1
  self.$posLookup = []
  self.update()
}

frzr.inherits(Tags, frzr.observable)

var proto = Tags.prototype

proto.update = function (data) {
  var self = this
  var fragment, placeholder
  var tags = []
  var offset = 0
  if (data) {
    self.$items = data
  }
  self.trigger('update', self.$items)
  self.trigger('updated', self.$items)
  self.$parent = self.$root.parentNode
  self.trigger('render')
  var posLookup = []

  frzr.each(self.$items, function (item, pos) {
    if (!item.$uid) {
      frzr.defProperty(item, '$uid', self.$uid)
      self.$uid++
    }
    posLookup[item.$uid] = pos
  })

  frzr.each(self.$rendered, function (item, oldPos) {
    var tag = self.$tags[oldPos]
    var pos = posLookup[item.$uid]

    tag.offset = offset

    if (pos === undefined) {
      tag.unmount()
      offset--
    }
  })
  offset = 0

  frzr.each(self.$items, function (item, pos) {
    var oldPos = self.$posLookup[item.$uid]
    var tag

    if (oldPos === undefined) {
      // new item
      tag = frzr.mount(undefined, self.$tagName, item)
      tag.$item = item
      tag.$parent = self
      tag.$root = self.$root
      if (!fragment) {
        fragment = document.createDocumentFragment()
      }
      fragment.appendChild(tag.$el)
      tag.offset = tag.offset + offset
      offset++
    } else {
      // existing item
      tag = self.$tags[oldPos]
      tag.offset = tag.offset + offset

      if (pos !== oldPos + tag.offset) {
        // moved
        if (!fragment) {
          fragment = document.createDocumentFragment()
        }
        fragment.appendChild(tag.$el)
      } else if (fragment) {
        // next to move
        console.time('insertBefore')
        self.$root.insertBefore(fragment, tag.$el)
        console.timeEnd('insertBefore')
        fragment = undefined
      }
    }
    tag && tags.push(tag)
  })
  if (fragment) {
    self.$root.appendChild(fragment)
  }

  self.$tags = tags
  self.$rendered = self.$items.slice()
  self.$posLookup = posLookup
  self.trigger('rendered')
}

proto.mount = function (target, name, data) {
  var self = this
  var target = target
  if (typeof target === 'string') {
    target = self.$find(target)
  }
  var mounted = frzr.mount(target, name, data)
  mounted.$parent = self
  return mounted
}

proto.mountAll = function (target, name, data) {
  var self = this
  var target = target
  if (typeof target === 'string') {
    target = self.$find(target)
  }
  var mounted = frzr.mountAll(target, name, data)
  mounted.$parent = self
  return mounted
}

proto.unmount = function () {
  self.update([])
  self.trigger('unmount')
  self.off()
}
