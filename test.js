
'use strict'

var itemTmpl = frzr.parse('#item-tmpl')
var mainTmpl = frzr.parse('#main-tmpl')

// define 'item'
frzr.tag('item', itemTmpl, function () {
  var self = this
  var $title = self.$find('.title')
  var $up = self.$find('a.up')
  var $down = self.$find('a.down')
  var $remove = self.$find('a.remove')

  $title.textContent = self.title

  $remove.addEventListener('click', function () {
    var item = self.$item
    self.$parent.one('update', function (items) {
      var pos = items.indexOf(item)
      items.splice(pos, 1)
    })
    self.$parent.update()
  })

  $up.addEventListener('click', function () {
    var item = self.$item
    self.$parent.one('update', function (items) {
      var pos = items.indexOf(item)
      items.splice(pos-1, 0, items.splice(pos, 1)[0])
    })
    self.$parent.update()
  })
  $down.addEventListener('click', function () {
    var item = self.$item
    self.$parent.one('update', function (items) {
      var pos = items.indexOf(item)
      items.splice(pos+1, 0, items.splice(pos, 1)[0])
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
  var items = new Array(5000)

  for (var i = 0; i < 5000; i++) {
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
