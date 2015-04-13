
'use strict'

var frzr = {
  tags: {}
}

module.exports = frzr

frzr.clean = require('./clean')
frzr.defProperty = Object.defineProperty
frzr.defProperties = Object.defineProperties
frzr.objectKeys = Object.keys
frzr.defined = require('./defined')
frzr.each = require('./each')
frzr.eachIn = require('./eachIn')
frzr.eachReverse = require('./eachReverse')
frzr.observable = require('component-emitter')
frzr.inherits = require('inherits')
frzr.tag = require('./tag')
frzr.times = require('./times')
frzr.model = require('./model')
frzr.mount = require('./mount')
frzr.mountAll = require('./mountAll')
frzr.parse = require('./parse')

frzr.observable.prototype.one = frzr.observable.prototype.once
frzr.observable.prototype.trigger = frzr.observable.prototype.emit
