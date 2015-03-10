
'use strict'

var frzr = {
  tags: {}
}

module.exports = frzr

frzr.each = require('./each')
frzr.eachReverse = require('./eachReverse')
frzr.observable = require('component-emitter')
frzr.inherits = require('inherits')
frzr.tag = require('./tag')
frzr.mount = require('./mount')
frzr.mountAll = require('./mountAll')
frzr.render = require('./render')

frzr.observable.prototype.one = frzr.observable.prototype.once
frzr.observable.prototype.trigger = frzr.observable.prototype.emit
