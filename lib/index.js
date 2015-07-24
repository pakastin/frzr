
var each = require('@frzr/each')
var inherit = require('@frzr/inherit')
var prefix = require('@frzr/prefix')
var transition = require('@frzr/transition')

var Collection = require('@frzr/collection')
var Model = require('@frzr/model')
var List = require('@frzr/list')
var Observable = require('@frzr/observable')
var View = require('@frzr/view')
var ViewList = require('@frzr/viewlist')

var frzr = {
  each: each,
  inherit: inherit,
  prefix: prefix,
  transition: transition,
  Collection: Collection,
  Model: Model,
  List: List,
  Observable: Observable,
  View: View,
  ViewList: ViewList
}

frzr.ListView = frzr.ViewList

module.exports = frzr

global.frzr = frzr
