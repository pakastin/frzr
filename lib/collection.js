
var O = Object

var defineProperties = O.defineProperties

var each = require('./each')
var eachIn = require('./eachIn')
var observable = require('./observable')

module.exports = collection

function collection (params) {
  params = params || {}

  params.model = params.model || require('./model')
  var self = observable({})
  var models = []

  self.models = models

  if (params.key) {
    var lookup = {}
    var index = {}
    self.lookup = lookup
  }
  var lookupKeys = (params.index && params.index.split(' ')) || []

  defineProperties(self, {
    get: {
      value: get
    },
    raw: {
      value: raw
    },
    find: {
      value: find
    },
    findOne: {
      value: findOne
    },
    filter: {
      value: filter
    },
    sort: {
      value: sort
    },
    set: {
      value: set
    },
    unset: {
      value: unset
    },
    reset: {
      value: reset
    },
    mount: {
      value: mount
    },
    unmount: {
      value: unmount
    }
  })

  if (params.template) {
    var frag = document.createDocumentFragment()
  }

  return self

  function get (id) {
    if (!arguments.length) {
      return models
    }
    return params.key ? lookup[id] : models[id]
  }

  function raw (id) {
    if (!arguments.length) {
      return models.map(function (item) {return item.raw()})
    }
    return params.key ? lookup[id].raw() : models[id].raw()
  }

  function find (key, value) {
    var lookup = self[key + 'Lookup'] || {}
    return lookup[value]
  }

  function findOne (key, value) {
    var results = find(key, value) || []
    return results[0]
  }

  function filter (iterator) {
    var filtered = raw().filter(iterator)
    reset(filtered)
  }

  function sort (iterator) {
    var sorted = raw().sort(iterator)
    reset(sorted)
  }

  function set (id, item) {
    var model = params.key ? lookup[id] : models[id]
    if (typeof model === 'undefined') {
      model = initModel(id, item)
      model.$ = self
    }
    model.reset(item)
    if (params.key) {
      lookup[id] = model
      index[id] = models.push(model) - 1
    }
  }

  function unset (id) {
    var model = params.key ? lookup[id] : models[id]
    if (typeof model !== 'undefined') {
      model.destroy()
      each(models, function (_model, i, len) {
        if (_model === model) {
          models.splice(i, 1)
          len--
          i--
          if (params.key) {
            delete index[id]
            delete lookup[id]
          }
          return
        }
      })
    }
  }

  function reset (items) {
    var newModels = new Array(items.length)
    if (params.key) {
      var newIndex = {}
      var newLookup = {}
    }

    each(items, function (item, i) {
      var model
      var id

      id = params.key ? item[params.key] : i
      model = params.key ? lookup[id] : models[id]
      if (typeof model === 'undefined') {
        // create model
        model = initModel(id, item)
        model.$ = self
      }
      model.reset(item)
      newModels[i] = model
      if (params.key) {
        newLookup[id] = model
        newIndex[id] = i
        delete lookup[id]
        delete index[id]
      }
    })
    var remove = []
    if (params.key) {
      eachIn(lookup, function (item) {
        remove.push(item)
      })
      index = newIndex
      lookup = newLookup
      self.lookup = lookup
    } else {
      each(models.slice(items.length), function (item) {
        remove.push(item)
      })
    }
    each(remove, function (model) {
      model.view.destroy()
      model.reset({})
      model.off()
      model.trigger.call(model.view, 'destroy')
    })
    models = newModels
    self.models = models
    self.root && mount(self.root)
  }
  function mount (target) {
    self.root = target
    each(models, function (model) {
      model.mount(self.root)
    })
  }
  function unmount (target) {
    self.root = target
    each(models, function (model) {
      model.unmount()
    })
  }
  function initModel (id, data) {
    var model = params.model()
    self.root && model.mount(self.root)
    model.on('update', function (data, oldData) {
      updateLookups(model, data, oldData)
    })
    model.on('destroy', function (data, oldData) {
      updateLookups(model, {}, data)
    })
    return model
  }
  function updateLookups (model, data, oldData) {
    each(lookupKeys, function (key) {
      var value = data[key]
      var oldValue = oldData[key]
      if (value === oldValue) {
        return
      }
      var lookup = self[key + 'Lookup'] || (self[key + 'Lookup'] = {})
      if (typeof oldValue !== 'undefined') {
        var oldIndex = lookup[oldValue].indexOf(model)
        lookup[oldValue].splice(oldIndex, 1)
      }
      if (typeof value !== 'undefined') {
        lookup[value] || (lookup[value] = [])
        lookup[value].push(model)
      }
    })
  }
}
