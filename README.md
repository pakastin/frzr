# FRZR
Cool new javascript view library.

[![FRZR logo](https://frzr.js.org/img/logo.svg)](https://frzr.js.org)

## download

[Development](http://frzrjs.github.io/frzr/dist/frzr.js) (~10 kb uncompressed)

[Production](http://frzrjs.github.io/frzr/dist/frzr.min.js) (~5 kb uncompressed & minified)

## example
[performance demonstration](http://frzr.js.org/example/index.html)

## documentation
Not completely there yet. Will add more details here soon..

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
