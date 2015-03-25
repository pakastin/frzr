
'use strict'

var frzr = {
  tags: {}
}

module.exports = frzr

frzr.clean = require('./clean')
frzr.defProperty = require('./defProperty')
frzr.each = require('./each')
frzr.eachReverse = require('./eachReverse')
frzr.observable = require('component-emitter')
frzr.inherits = require('inherits')
frzr.tag = require('./tag')
frzr.times = require('./times')
frzr.mount = require('./mount')
frzr.mountAll = require('./mountAll')
frzr.parse = require('./parse')
frzr.raf = require('raf')

frzr.observable.prototype.one = frzr.observable.prototype.once
frzr.observable.prototype.trigger = frzr.observable.prototype.emit
