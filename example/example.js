/* global frzr */

var $buttons = document.getElementsByTagName('button')
var $rendertime = document.getElementById('rendertime')

$buttons[0].addEventListener('click', function () {
  shiftItems(1000, true)
})

$buttons[1].addEventListener('click', function () {
  shiftItems(1000)
})

$buttons[2].addEventListener('click', function () {
  pushItems(1000, true)
})

$buttons[3].addEventListener('click', function () {
  pushItems(1000)
})

$buttons[4].addEventListener('click', function () {
  shuffleItems(true)
})

$buttons[5].addEventListener('click', function () {
  shuffleItems()
})

$buttons[6].addEventListener('click', function () {
  sortItems(true)
})

$buttons[7].addEventListener('click', function () {
  sortItems()
})

$buttons[8].addEventListener('click', function () {
  reverseItems(1000, true)
})

$buttons[9].addEventListener('click', function () {
  reverseItems(1000)
})

var items = []
var renderer = frzr.renderer
var View = frzr.View
var Views = frzr.Views

var starttime

renderer.on('render', timeStart)
renderer.on('rendered', timeEnd)

var ChildView = View.extend('p', {
  class: 'view',
  update: function (options) {
    this.textContent('Item ' + options.id)
  }
})

var views = new Views(ChildView, 'div', {
  class: 'views'
})
views.mount(document.body)

function timeStart () {
  starttime = Date.now()
}

function timeEnd () {
  $rendertime.textContent = 'Rendering took: ' + (Date.now() - starttime) + ' ms'
}

function sortItems (reordering) {
  items.sort(function (a, b) {
    return a.id - b.id
  })
  views.reset(items, reordering && 'id')
}

function shuffleItems (reordering) {
  frzr.fisheryates(items)
  views.reset(items, reordering && 'id')
}

function reverseItems (reordering) {
  items.reverse()
  views.reset(items, reordering && 'id')
}

function createItems (n) {
  var len = items.length
  var newItems = new Array(n)
  var j = 0

  for (var i = len; i < len + n; i++) {
    newItems[j++] = {
      id: i,
      title: 'Item ' + i
    }
  }
  return newItems
}

function shiftItems (n, reordering) {
  Array.prototype.unshift.apply(items, createItems(n))
  views.reset(items, reordering && 'id')
}

function pushItems (n, reordering) {
  Array.prototype.splice.apply(items, [(items.length / 2 | 0), 0].concat(createItems(n)))
  views.reset(items, reordering && 'id')
}
