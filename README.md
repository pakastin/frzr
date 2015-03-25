# frzr
Super simple view models inspired by Riot.js 2.0

## install

    npm install frzr
    
  or [download from here](http://pakastin.github.io/frzr/dist/frzr.js)

## create tag

    frzr.tag('item', '<h1></h1>', function () {
      this.$el.textContent = this.title
    })
    
or with template:

    <script id="item-tmpl" type="text/frzr">
        <h1></h1>
    </script>

use it like this:

    var itemTmpl = frzr.parse('#item-tmpl') // or frzr.parse(document.getElementById('#item-tmpl')
    
    frzr.tag('item', itemTmpl, function () {
        ...
    })
    
## mount

    var item = {
        title: 'Hello world'
    }
    var mounted = frzr.mount(document.body, 'item', item)
    
## mount many

    var items = [
      {title: 'Hello world'},
      {title: 'Hello you'}
    ]
    var mounted2 = frzr.mountAll(document.body, 'item', items)
    
## update

    mounted.update({
      title: 'Hello you'
    })

    // or:
    item.title = 'Hello you'
    mounted.update()

    // or:
    mounted.one('update', function () {
        this.title = 'Hello you'
    })
    mounted.trigger('update')

## update multiple

    // easiest way:
    items.push({title: 'Hello world'})
    mounted2.update()
    
    // ..or like this: (note though that this method replaces items, because are not strictly equal)
    mounted2.update([
      {title: 'Hello you'},
      {title2: 'Hello world'}
    ]) 

    // better to do this way:
    mounted2.one('update', function (items) {
        items.push({
            title2: 'Hello world'
        })
    })
    mounter2.trigger('update')

## listen events

    mounted2.one('update', function (items) {
      items.reverse()
    })
    mounted2.one('updated', function () {
      console.log('reversed')
    })
    mounted2.update()
    
## unmount

    mounted.unmount()
    mounted2.unmount()
