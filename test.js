
'use strict'

// parse template from custom script tag
var mainTmpl = String(document.getElementById('main-tmpl').innerHTML).trim()

// define 'item'
frzr.tag('item', '<div class="item"><h2></h2><p><a class="up">Up</a><a class="down">Down</a><a class="remove">Remove</a></p></div>', function () {
  var self = this
  var h2 = self.$find('h2')
  var up = self.$find('a.up')
  var down = self.$find('a.down')
  var remove = self.$find('a.remove')

  h2.textContent = self.title

  remove.addEventListener('click', function () {
    var item = self.$item
    self.$parent.one('update', function (items) {
      var pos = items.indexOf(item)
      items.splice(pos, 1)
    })
    self.$parent.update()
  })

  up.addEventListener('click', function () {
    var item = self.$item
    self.$parent.one('update', function (items) {
      var pos = items.indexOf(item)
      items.splice(pos-1, 0, items.splice(pos, 1)[0])
    })
    self.$parent.update()
  })
})

// define 'main'
frzr.tag('main', mainTmpl, function () {
  var $itemscount = this.$find('select')
  var $randomize = this.$find('.randomize')
  var $reverse = this.$find('.reverse')
  var $sort = this.$find('.sort')
  var $renderTime = this.$find('.renderTime')

  $itemscount.addEventListener('change', itemscount)
  $randomize.addEventListener('click', randomize)
  $reverse.addEventListener('click', reverse)
  $sort.addEventListener('click', sort)

  // create items
  var items = new Array(10000)

  for (var i = 0; i < 10000; i++) {
    items[i] = {
      i: i,
      title: 'Item ' + i
    }
  }

  var $items = this.$find('.items')
  var Items = this.mountAll($items, 'item', items)

  function reverse () {
    items.reverse()
    main.update()
  }

  function sort () {
    items.sort(function (a, b) {
      return a.i - b.i
    })
    main.update()
  }

  function randomize () {
    items.sort(function () {
        return Math.random()*2-1
    })
    main.update()
  }

  function itemscount (e) {
    var count = e.target.value
    items.sort(function (a, b) {
      return a.i - b.i
    })
    if (items.length > count) {
      items.splice(count, (items.length-count))
    } else if (items.length < count) {
      for (var i = items.length; i < count; i++) {
        items.push({
          i: i,
          title: 'Item ' + i
        })
      }
    }
    main.update()
  }

  // propagate update event
  this.on('update', function () {
    Items.update()
  })

  // log performance
  Items.on('render', function () {
    var starttime = Date.now()
    Items.one('rendered', function () {
      $renderTime.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms'
    })
  })
})

// replace and mount to body

document.body.innerHTML = ''
var main = frzr.mount(document.body, 'main')
