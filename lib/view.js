
var A = Array
var array = A.prototype
var slice = array.slice

var tmpl = require('./tmpl')

module.exports = view

function view (params) {
  var self = {}
  var template = tmpl(params.template)

  self.$el = template.cloneNode(true)
  self.$find = function (query) {
    return self.$el.querySelector(query)
  }
  self.$findAll = function (query) {
    return slice.call(self.$el.querySelectorAll(query))
  }

  self.mount = mount
  self.unmount = unmount
  self.destroy = destroy

  return self

  function mount (target) {
    self.root = target
    self.root.appendChild(self.$el)
    var $autofocus = self.$find('input[autofocus]')
    $autofocus && $autofocus.focus()
  }

  function unmount () {
    self.root.removeChild(self.$el)
  }

  function destroy () {
    self.root.removeChild(self.$el)
  }
}
