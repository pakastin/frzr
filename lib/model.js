'use strict'

var frzr = require('./index')

module.exports = Model

var defProperty = frzr.defProperty
var defProperties = frzr.defProperties
var defined = frzr.defined
var eachIn = frzr.eachIn

function Model (data) {
  var self = this
  var isModel = self instanceof Model

  if (!isModel) {
    return new Model(data)
  }
  defProperties(self, {
    '$data': {
      value: {}
    },
    '$oldData': {
      value: {}
    },
    '$pendingData': {
      value: {}
    }
  })
  self.oninit && self.oninit.apply(self, arguments)
  self.reset(data || {})
}

Model.extend = extend

var _Model = Model

function extend (params) {
  function Model (data) {
    var self = this
    var isModel = self instanceof _Model

    if (!isModel) {
      return new Model(data)
    }
    params.init && defProperty(self, 'oninit', {
      value: params.init
    })
    params.update && defProperty(self, 'onupdate', {
      value: params.update
    })
    _Model.apply(self, arguments)
  }
  Model.prototype = Object.create(_Model.prototype)
  Model.constructor = Model
  return Model
}

var proto = Model.prototype

proto.get = get
proto.set = set
proto.unset = unset
proto.reset = reset
proto.update = update
proto.toObject = toObject

function get (key) {
  var self = this

  return self.$pendingData[key]
}

function set (key, value) {
  var self = this

  if (key instanceof Object) {
    eachIn(key, function (value, key) {
      self.set(key, value)
    })
    return
  }

  if (self.$data[key] instanceof Model) {
    self.$data[key].set(value)
    return self
  }
  self.$pendingData[key] = value

  return self
}

function unset (key) {
  var self = this

  if (key instanceof Object) {
    eachIn(key, function (value, key) {
      self.unset(key)
    })
    return
  }

  self.$pendingData[key] = null

  return self
}

function reset (data) {
  var self = this
  var dataIsObject = data instanceof Object

  if (!dataIsObject) {
    self.$pendingData = {}
    return
  }

  eachIn(self.$data, function (value, key) {
    !defined(data[key]) && self.unset(key)
  })

  self.set(data)
  self.update()

  return self
}

function update () {
  var self = this

  self.onupdate && self.onupdate.call(self, self.$pendingData)

  eachIn(self.$oldData, function (value, key) {
    delete self.$oldData[key]
  })

  eachIn(self.$pendingData, function (value, key) {
    delete self.$pendingData[key]
    if (value === null) {
      delete self.$data[key]
      delete self[key]
      self.$oldData[key] = undefined
      return
    }
    if (defined(self.$data[key])) {
      if (self.$data[key] instanceof Model) {
        self.$data[key].update()
        return
      }
      if (self.$data[key] !== value) {
        self.$oldData[key] = self.$data[key]
        self.$data[key] = value
      }
      return
    }
    self.$oldData[key] = self.$data[key]
    defProperty(self, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        self.$pendingData[key] = value
      },
      get: function () {
        return self.$data[key]
      }
    })
    self.$data[key] = value
  })

  self.onupdated && self.onupdated.call(self, self.$data)

  return self
}

function toObject (virtuals) {
  var self = this
  if (virtuals) {
    var result = {}
    eachIn(self, function (value, key) {
      result[key] = value
    })
    return result
  }
  return self.$data
}
