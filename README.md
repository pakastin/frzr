# FRZR
[![Join the chat at https://gitter.im/pakastin/frzr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pakastin/frzr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Cool new javascript view library.

Made with ♥ + ES6.

[![FRZR logo](https://frzr.js.org/img/logo.svg)](https://frzr.js.org)

[FRZR reversed 100 000 items with DOM reorder on iPhone in less than 2 seconds!](https://twitter.com/pakastin/status/651581181910208512)

Also check out my little open source vanilla js [HTML5 Deck of Cards](https://deck-of-cards.js.org) and [HTML5 Node Garden](https://nodegarden.js.org)

## download
[Development](http://frzrjs.github.io/frzr/dist/frzr.js) (~10 kb uncompressed)

[Production](http://frzrjs.github.io/frzr/dist/frzr.min.js) (~5 kb uncompressed & minified)

## example
[Example project (todo app)](https://github.com/pakastin/frzr-todo)

[Performance bench](http://frzr.js.org/example/index.html)

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
Supports [rollup](https://github.com/rollup/rollup/wiki/jsnext:main) – only import what you need

```js
import {View, Views} from 'frzr'
```

#### ES5

```js
var View = frzr.View
var Views = frzr.Views
```

### View
#### constructor(options)

```js
var view = new View({
  el: 'p',
  class: 'view',
  data: {
    id: 1
  },
  update: function (data) {
    this.text('Item ' + data.id)
  }
})
```

If you need SVG element, please use `{svg: true}` option

#### View.extend(options)

```js
var CustomView = View.extend({
  el: 'p',
  class: 'custom-view',
  update: function (data) {
    this.text('Item ' + data.id)
    this.style({
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

#### set(data) or set(key, value)

```js
view.set({
  id: 1,
  title: 'Item 1'
})
```

or

```js
view.set('id', 1)
view.set('title', 'Item 1')
```

#### opt(options) or opt(key, value)

```js
view.opt({
  class: {
    item: false
  },
  attr: {
    placeholder: 'value'
  },
  style: {
    color: 'red'
  }
})
```

or

```js
view.opt('class', {item: false})
view.opt('attr', {placeholder: 'value'})
view.opt('style', {color: 'red'})
```

#### text(text)

```js
view.text('Lorem ipsum')
```

#### class(classes) or class(key, value)

```js
view.class({
  red: true
})
```

or

```js
view.class('red', true)
```

#### style(styles) or style(key, value)

```js
view.style({
  color: 'red'
})
```

or

```js
view.style('color': 'red')
```

#### attr(attrs) or attr(key, value)

```js
view.attr({
  autofocus: false,
  placeholder: 'Your name'
})
```

or

```js
view.attr('autofocus': false)
view.attr('placeholder', 'Your name')
```

### Views
#### constructor(ChildView, type, options)

```js
var ListView = View.extend({
  el: 'li',
  update: function (data) {
    this.textContent = data.title
  }
})
var views = new Views(ListView, {
  el: 'ul',
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
