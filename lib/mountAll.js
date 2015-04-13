
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
  requestAnimationFrame(function () {
    frzr.tags[name].constructor2 && frzr.tags[name].constructor2.call(self)
    self.update()
  })
}

frzr.inherits(Tags, frzr.observable)

var proto = Tags.prototype

proto.update = function (data) {
  var self = this
  var fragment, placeholder
  var offset = 0
  if (data) {
    self.$items = data
  }
  self.trigger('update', self.$items)

  var posLookup = []
  frzr.each(self.$items, function (item, pos) {
    if (!item.$uid) {
      frzr.defProperty(item, '$uid', {
        value: self.$uid
      })
      self.$uid++
    }
    posLookup[item.$uid] = pos
  })

  var count = {create: 0, move: 0, remove: 0}
  var batch = []
  var moving

  frzr.each(self.$rendered, function (item, oldPos) {
    var pos = posLookup[item.$uid]
    var tag = self.$tags[item.$uid]

    if (pos === undefined) {
      count.remove++
      batch.push(function () {
        tag.unmount()
      })
      delete self.$tags[item.$uid]
      offset--
      return
    }
    tag.offset = offset
  })

  offset = 0

  frzr.each(self.$items, function (item, pos) {
    var oldPos = self.$posLookup[item.$uid]
    var tag

    if (oldPos === undefined) {
      // new item
      count.create++
      tag = frzr.mount(undefined, self.$tagName, item)
      tag.$item = item
      tag.$parent = self
      tag.$root = self.$root
      tag.offset += offset
      self.$tags[item.$uid] = tag
      if (!moving) {
        moving = true
        batch.push(function () {
          fragment = document.createDocumentFragment()
        })
      }
      batch.push(function () {
        fragment.appendChild(tag.$el)
      })
      offset++
    } else {
      // existing item
      tag = self.$tags[item.$uid]
      tag.offset += offset

      if (pos !== oldPos + tag.offset) {
        count.move++
        // moved
        if (!moving) {
          moving = true
          batch.push(function () {
            fragment = document.createDocumentFragment()
          })
        }
        batch.push(function () {
          fragment.appendChild(tag.$el)
        })
      } else if (moving) {
        // next to move
        moving = false
        batch.push(function () {
          self.$root.insertBefore(fragment, tag.$el)
        })
      }
    }
  })
  self.trigger('updated', self.$items)
  self.trigger('render')
  var parentNode = self.parentNode
  if (parentNode && count.create + count.move > self.$items.length / 5) {
    placeholder = document.createComment('')
    parentNode.replaceChild(placeholder, self.$root)
  }
  frzr.each(batch, function (action) {
    action()
  })
  // append if left..
  if (moving) {
    self.$root.appendChild(fragment)
  }
  if (placeholder) {
    parentNode.replaceChild(self.$root, placeholder)
  }
  self.trigger('rendered')

  self.$rendered = self.$items.slice()
  self.$posLookup = posLookup
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
