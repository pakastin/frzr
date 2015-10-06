# FRZR

[![Join the chat at https://gitter.im/pakastin/frzr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pakastin/frzr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Cool new javascript view library.

Made with ♥ + ES6.

[![FRZR logo](https://frzr.js.org/img/logo.svg)](https://frzr.js.org)

Also check out my little open source vanilla js [HTML5 Deck of Cards](https://deck-of-cards.js.org)

## download

[Development](http://frzrjs.github.io/frzr/dist/frzr.js) (~10 kb uncompressed)

[Production](http://frzrjs.github.io/frzr/dist/frzr.min.js) (~5 kb uncompressed & minified)

## example
[Performance demonstration](http://frzr.js.org/example/index.html)

I challenge you to do a similar bench with your favourite framework x ;)

## documentation
Still missing details – will add them soon..

### Installing from NPM
(You can also just [download](https://github.com/pakastin/frzr#download))
```
npm install frzr
```

### Requiring View, Views...
[Here's what you can use](https://github.com/pakastin/frzr/blob/master/lib/index.js)

#### ES6
Supports [rollup](https://github.com/rollup/rollup/wiki/jsnext:main)
```js
import {View, Views} from 'frzr'
```

#### ES5

```js
var View = frzr.View
var Views = frzr.Views
```

### View

#### constructor(type, options)
```js
var view = new View('p', {
  class: 'view',
  update: function (data) {
    this.textContent('Item ' + data.id)
  }
})
view.set({
  id: 1
})
```

#### View.extend(type, options)
```js
var CustomView = View.extend('p', {
  class: 'custom-view',
  update: function (data) {
    this.textContent('Item ' + data.id)
    this.setStyle({
      color: 'red'
    })
  }
})
var view = new CustomView()
view.set({id: 1})
```

#### mount(target)
```js
view.mount(document.body)
```

#### mountBefore(target, before)
```js
view.mountBefore(document.body, document.body.firstChild)
```

#### unmount()
```js
view.unmount()
```

#### destroy()
```js
view.destroy()
```

#### set(data)
```js
view.set({
  id: 1,
  title: 'Item 1'
})
```

#### setOptions(options)
```js
view.setOptions({
  class: {
    item: false
  },
  attrs: {
    placeholder: 'value'
  },
  style: {
    color: 'red'
  }
})
```

#### textContent(text)
```js
view.textContent('Lorem ipsum')
```

#### setClass(classes)
```js
view.setClass({
  red: true
})
```

#### setStyle(styles)
```js
view.setStyle({
  color: 'red'
})
```

#### setAttributes(attrs)
```js
view.setAttributes({
  autofocus: false,
  placeholder: 'Your name'
})
```

### Views

#### constructor(ChildView, type, options)
```js
var ListView = View.extend('li', {
  update: function (data) {
    this.textContent = data.title
  }
})
var views = new Views(ListView, 'ul', {
  class: 'views'
})
views.reset([{title: 1}, {title: 2}, {title: 3}])
```

#### mount(target)
```js
views.mount(document.body)
```

#### mountBefore(target, before)
```js
views.mountBefore(document.body, document.firstChild)
```

#### unmount()
```js
views.unmount()
```

#### reset(data, key)
```js
views.reset([{title: 2}, {title: 3}, {title: 4}], 'title')
```

### Observable

Basic stuff:

```js
var observable = new Observable()
```

and:

```js
inherits(YourClass, Observable)
```
