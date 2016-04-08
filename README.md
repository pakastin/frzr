# \*FRZR\*
Turboboosted 2 KB view library with 100 % test coverage.

[![Build Status](https://travis-ci.org/pakastin/frzr.svg?branch=master)](https://travis-ci.org/pakastin/frzr)

## Install:
```
npm install frzr
```

## Download:
- Development: https://pakastin.github.io/frzr/frzr.js (4.5 KB)
- Production: https://pakastin.github.io/frzr/frzr.min.js (2 KB)

## el(tagName, (attributes), children...)
Creates a HTML element:
```js
var p = el('p', { textContent: 'Hello world!' });
```
You can also define children:
```js
var div = el('div', null, p);
```
You can also skip attributes:
```js
var p = el('p', 'Hello world!' );
```
```js
var div = el('div', p);
```

## svg(tagName, attributes, children...)
Works like `el`, but creates a SVG element:
```js
var circle = svg('circle', { cx: 50, cy: 50, r: 50 });
var canvas = svg('svg', { width: 100, height: 100 }, circle);
```

## Creating components
Components are just POJF (plain old JavaScript functions):
```js
function Item () {
  this.el = el('p');
}
Item.prototype.update = function (text) {
  this.el.textContent = text;
}
var item = new Item();
item.update('Hello world!');
f.mount(document.body, item); // <body><p>Hello world!</p></body>
```
## new List(Component, key, initData);
Automatically inserts, removes and even reorders components. Previous example makes a lot more sense now:
```js
var list = new List(Item);
f.mount(document.body, list);
list.update([1, 2, 3]); // <body><p>1</p><p>2</p><p>3</p></body>
list.update([2, 3, 4, 5]); // <body><p>2</p><p>3</p><p>4</p><p>5</p></body>
```
You can delay removing the elements by defining a `remove`-method to a component:
```js
Item.prototype.remove = function (doRemove) {
  setTimeout(doRemove, 1000); // remove after 1 second
}
```
## mount(target, child)
You can mount HTML elements/components to HTML elements/components.
```js
mount(document.body, p);
mount(document.body, div);
mount(div, p);
```
If a component gets mounted, Component.mount/Component.reorder gets called, if present:
```js
Item.prototype.mount = function () {
  console.log('mounted');
}
Item.prototype.reorder = function () {
  // was already in the DOM when asked to mount
  console.log('reordered');
}
```
## mountBefore(target, child, before)
```js
mountBefore(document.body, svg, div);
```
## unmount(target, child)
Unmounts element/component from element/component. Component.unmount gets called, if present: 
```js
Item.prototype.unmount = function () {
  console.log('unmounted');
}
```

## setChildren(target, [child])
This cleverly replaces target's children. Children already in the DOM automatically gets moved / kept in place.
```js
setChildren(document.body, [p, svg]);
```
