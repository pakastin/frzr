# frzr
Super simple view models inspired by Riot.js 2.0

## install

    npm install frzr
    
  or [download from here](http://pakastin.github.io/frzr/dist/frzr.js)

## create tag

    frzr.tag('item', '<h1></h1>', function () {
      this.$el.textContent = this.title
    })
    
## mount

    var mounted = frzr.mount(document.body, 'item', {
      title: 'Hello world'
    })
    
## mount many

    var mounted2 = frzr.mountAll(document.body, 'item', [
      {title: 'Hello world'},
      {title: 'Hello you'}
    ])
    
## update

    mounted.update({
      title: 'Hello you'
    })
    
    // note that this method replaces items, because are not strictly equal:
    mounted2.update([
      {title: 'Hello you'},
      {title2: 'Hello world'}
    ]) 
    
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
