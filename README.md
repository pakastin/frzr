# \*FRZR\*
Turboboosted 2 KB view library with 100 % test coverage.

[![npm](https://img.shields.io/npm/v/frzr.svg?maxAge=2592000)](https://www.npmjs.com/package/frzr)
[![Build Status](https://img.shields.io/travis/pakastin/frzr.svg?maxAge=2592000)](https://travis-ci.org/pakastin/frzr)
[![npm](https://img.shields.io/npm/l/frzr.svg?maxAge=2592000)](https://github.com/pakastin/frzr/blob/master/LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/pakastin.svg?style=social&maxAge=2592000)](https://twitter.com/pakastin)

## Install:
```
npm install frzr
```

## Download:
- Development: https://pakastin.github.io/frzr/frzr.js (8 KB before, 2.5 KB after GZIP)
- Production: https://pakastin.github.io/frzr/frzr.min.js (3 KB before, 2 KB after GZIP)
- cdnjs: https://cdnjs.com/libraries/frzr

## Latest updates
- [v0.18.0: custom elements & custom attributes](https://github.com/pakastin/frzr/releases/tag/v0.18.0)
- [v0.17.0: lifecycle "events"](https://github.com/pakastin/frzr/releases/tag/v0.17.0)

## Using at server-side
[FRZR-dom](http://github.com/pakastin/frzr-dom)

## Getting started
http://codepen.io/collection/XKwVMG (more will be added soon..)

## Calendar project example
https://github.com/pakastin/frzr-calendar

## Performance
- http://mathieuancelin.github.io/js-repaint-perfs/
- http://pakastin.fi/perf

## HelsinkiJS talk
http://youtu.be/0nh2EK1xveg

## SurviveJS interview:
http://survivejs.com/blog/frzr-interview/

## el(tagName, (attributes), (...children))
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
It's also possible the register custom elements and attributes, covered [here](https://github.com/pakastin/frzr/releases/tag/v0.18.0).
## svg(tagName, (attributes), (...children))
Works like `el`, but creates a SVG element:
```js
var circle = svg('circle', { cx: 50, cy: 50, r: 50 });
var canvas = svg('svg', { width: 100, height: 100 }, circle);
```

## Creating components
Components (or Views) are just POJF (plain old JavaScript functions):
```js
function Item () {
  this.el = el('p');
}
Item.prototype.update = function (text) {
  this.el.textContent = text;
}
var item = new Item();
item.update('Hello world!');
mount(document.body, item); // <body><p>Hello world!</p></body>
```
You can also use ES6 classes:
```js
class Item {
  constructor () {
    this.el = el('p');
  }
  update (text) {
    this.el.textContent = text;
  }
}
const item = new Item();
item.update('Hello world!');
mount(document.body, item); // <body><p>Hello world!</p></body>
```
There are also some lifecycle "events" covered [here](https://github.com/pakastin/frzr/releases/tag/v0.17.0).
## new List(View, (key), (initData), (skipRender));
Automatically inserts, removes and even reorders components. Previous example makes a lot more sense now:
```js
var list = new List(Item);
mount(document.body, list);
list.update([1, 2, 3]); // <body><p>1</p><p>2</p><p>3</p></body>
list.update([2, 3, 4, 5]); // <body><p>2</p><p>3</p><p>4</p><p>5</p></body>
```
By defining a second `key` parameter you can reorder DOM elements. The third `initData` parameter just gets sent to the Component constructor as a first argument, with `item` and `index`. The fourth `skipRender` parameter skips the DOM update, if you want to implement a custom method.
## mount(target, child)
You can mount HTML elements/components to HTML elements/components.
```js
mount(document.body, p);
mount(document.body, div);
mount(div, p);
```
## mountBefore(target, child, before)
```js
mountBefore(document.body, svg, div);
```
## unmount(target, child)
Unmounts element/component from element/component.
```js
unmount(document.body, svg);
```

## setChildren(target, [child])
This cleverly replaces target's children. Children already in the DOM automatically gets moved / kept in place.
```js
setChildren(document.body, [p, svg]);
```
