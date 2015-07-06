
var each = require('@frzr/each')
var inherit = require('@frzr/inherit')
var prefix = require('@frzr/prefix')
var transition = require('@frzr/transition')

var Collection = require('@frzr/collection')
var Model = require('@frzr/model')
var Observable = require('@frzr/observable')
var View = require('@frzr/view')
var ViewCollection = require('@frzr/viewcollection')

var frzr = {
  each: each,
  inherit: inherit,
  prefix: prefix,
  transition: transition,
  Collection: Collection,
  Model: Model,
  Observable: Observable,
  View: View,
  ViewCollection: ViewCollection
}

module.exports = frzr

global.frzr = frzr
