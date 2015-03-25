
'use strict'

var frzr = require('./index')

module.exports = mount

function mount (target, name, data) {
  var tag = new Tag(frzr.tags[name], target, data)

  return tag
}

function Tag (tag, target, data) {
  var self = this
  var isTag = self instanceof Tag

  if (!isTag) {
    return new Tag(tag, target, data)
  }

  var el = tag.tmpl.cloneNode(true)

  self.$root = target
  self.$el = el

  for (var key in data) {
    self[key] = data[key]
  }
  tag.constructor.call(self)
  if (target) {
    target.appendChild(el)
    self.trigger('mount')
    self.$mounted = true
  }
}

frzr.inherits(Tag, frzr.observable)

var proto = Tag.prototype

proto.$find = function (query) {
  return this.$el.querySelector(query)
}

proto.$findAll = function (query) {
  return this.$el.querySelectorAll(query)
}

proto.update = function (data) {
  var self = this
  self.trigger('update', self)
  var data = data || {}
  for (var key in data) {
    self[key] = data[key]
  }
  self.trigger('updated', self)
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
  var self = this
  self.trigger('unmount')
  self.off()
  self.$root.removeChild(self.$el)
}
