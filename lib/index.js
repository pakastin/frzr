
var frzr = {
}

module.exports = frzr

frzr.collection = require('./collection')
frzr.each = require('./each')
frzr.eachIn = require('./eachIn')
frzr.map = require('./map')
frzr.model = require('./model')
frzr.prefix = require('./prefix')
frzr.observable = require('./observable')
frzr.transition = require('./transition')

window.frzr = frzr
