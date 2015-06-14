
var A = Array
var array = A.prototype
var slice = array.slice

var $find = require('./$find').$find
var $findAll = require('./$find').$findAll
var tmpl = require('./tmpl')

module.exports = view

function view (params) {
  var self = {}
  var template = tmpl(params.template).tmpl
  var find = tmpl(params.template).find

  self.$el = template.cloneNode(true)
  self.$find = function (query) {
    if (query[0] === '$') {
      return getChildPath(self.$el, find[query.slice(1)])
    }
    return $find(self.$el, query)
  }
  self.$findAll = function (query) {
    return $findAll(self.$el, query)
  }

  self.mount = mount
  self.unmount = unmount
  self.destroy = destroy

  return self

  function mount (target) {
    self.root = target
    self.root.appendChild(self.$el)
  }

  function unmount () {
    self.root.removeChild(self.$el)
  }

  function destroy () {
    self.root.removeChild(self.$el)
  }
}

function getChildPath (target, childpath) {
  childpath.split('.').forEach(function (path) {
    target = target.childNodes[path]
  })
  return target
}
