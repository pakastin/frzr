
var O = Object

var create = O.create
var defineProperties = O.defineProperties

var view = require('./view')
var observable = require('./observable')

module.exports = model

function model (params) {
  var data = {}
  var oldData = {}
  var self = create(data)
  observable(self)

  params.template && (self.view = view({template: params.template}))

  params.render && self.on('render', params.render)
  params.update && self.on('update', params.update)
  params.updated && self.on('updated', params.updated)
  params.mount && self.on('mount', params.mount)
  params.unmount && self.on('unmount', params.unmount)
  params.destroy && self.on('destroy', params.destroy)

  defineProperties(self, {
    set: {
      value: set
    },
    unset: {
      value: unset
    },
    raw: {
      value: raw
    },
    reset: {
      value: reset
    },
    mount: {
      value: mount
    },
    unmount: {
      value: unmount
    },
    destroy: {
      value: destroy
    }
  })

  return self

  function set (key, value) {
    if (!oldData.hasOwnProperty(key)) {
      oldData[key] = data[key]
    }
    if (typeof value !== 'undefined') {
      data[key] = value
      self[key] = value
    } else {
      delete data[key]
      delete self[key]
    }
    update()
  }
  function unset (key) {
    if (!oldData.hasOwnProperty(key)) {
      oldData[key] = data[key]
    }
    delete data[key]
    delete self[key]
    update()
  }
  function raw () {
    return data
  }
  function reset (newData) {
    var key
    for (key in data) {
      if (typeof newData[key] === 'undefined') {
        delete data[key]
        delete self[key]
      }
    }
    for (key in newData) {
      data[key] = newData[key]
      self[key] = newData[key]
    }
    update()
  }
  function mount (target) {
    self.view.mount(target)
    self.trigger.call(self.view, 'mount')
  }
  function unmount () {
    self.view.unmount()
    self.trigger.call(self.view, 'unmount')
  }
  function update () {
    self.trigger.call(self, 'update', data, oldData)
    self.trigger.call(self, 'updated', data, oldData)
    params.template && self.trigger.call(self.view, 'render', data, oldData)
    params.template && self.trigger.call(self.view, 'rendered', data, oldData)
    oldData = {}
    for (var key in data) {
      oldData[key] = data[key]
    }
  }
  function destroy () {
    self.view.destroy()
    self.reset({})
    self.off()
    self.trigger.call(self.view, 'destroy')
  }
}

model.extend = function (defaultParams) {
  return function (params) {
    var extendedParams = {}
    var key

    for (key in defaultParams) {
      extendedParams[key] = defaultParams[key]
    }
    for (key in params) {
      extendedParams[key] = params[key]
    }
    return model(extendedParams)
  }
}
