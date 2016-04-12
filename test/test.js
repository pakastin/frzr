
var frzr = require('./frzr');
var test = require('tape');

test('element creation', function (t) {
  t.plan(1);

  var hello = frzr.el('p', { className: 'hello', textContent: 'Hello world!' });

  t.equals(hello.outerHTML, '<p class="hello">Hello world!</p>');
});

test('element with text element and custom attribute', function (t) {
  t.plan(1);

  var hello = frzr.el('p', { custom: 'a' }, 'Hello world!');

  t.equals(hello.outerHTML, '<p custom="a">Hello world!</p>');
});

test('element mounting', function (t) {
  t.plan(1);

  var hello = frzr.el('p', { textContent: 'Hello world!' });
  frzr.setChildren(document.body, [hello]);

  t.equals(document.body.innerHTML, '<p>Hello world!</p>');
});

test('element mounting with children', function (t) {
  t.plan(1);

  var hello = frzr.el('p', { textContent: 'Hello world!' });
  var hello2 = frzr.el('p', { textContent: "What's up?" });
  var div = frzr.el('div', null, hello, hello2);

  frzr.setChildren(document.body, [div]);

  t.equals(document.body.innerHTML, "<div><p>Hello world!</p><p>What's up?</p></div>");
});

test('svg creation', function (t) {
  t.plan(1);

  var circle = frzr.svg('circle', { cx: 0, cy: 0, r: 10 });
  var line = frzr.svg('line', { x1: 0, y1: 0, x2: 10, y2: 0 });
  var text = frzr.svg('text', 'Testing');
  var svg = frzr.svg('svg', { width: 100, height: 100 }, circle, line, text);

  frzr.setChildren(document.body, [svg]);

  t.equals(document.body.innerHTML, '<svg width="100" height="100"><circle cx="0" cy="0" r="10"></circle><line x1="0" y1="0" x2="10" y2="0"></line><text>Testing</text></svg>');
});

test('list creation', function (t) {
  t.plan(1);

  var Item = function (initData, data) {
    this.el = frzr.el('p');
    this.el.textContent = data;
  }

  var list = frzr.list(Item);

  frzr.mount(document.body, list);

  list.update([1, 2, 3]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('list creation with key', function (t) {
  t.plan(1);

  var Item = function (initData, data) {
    this.el = frzr.el('p');
    this.el.textContent = data._id;
  }

  var list = frzr.list(Item, '_id');

  frzr.mount(document.body, list);

  list.update([
    { _id: 1 },
    { _id: 2 },
    { _id: 3 }
  ]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('list update', function (t) {
  t.plan(1);

  var Item = function (initData) {
    this.el = frzr.el('p');
  }
  Item.prototype.update = function (data) {
    this.el.textContent = data;
  }

  var list = frzr.list(Item);

  frzr.mount(document.body, list);

  list.update([ 5, 4, 6 ]);

  list.update([ 3, 1 ]);

  list.update([ 1, 2, 3 ]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('list update with key', function (t) {
  t.plan(1);

  var Item = function (initData) {
    this.el = frzr.el('p');
  }

  Item.prototype.update = function (data) {
    this.el.textContent = data._id;
  }

  var list = frzr.list(Item, '_id');

  frzr.mount(document.body, list);

  list.update([
    { _id: 2 },
    { _id: 4 },
    { _id: 3 }
  ]);

  list.update([
    { _id: 4 },
    { _id: 2 }
  ]);

  list.update([
    { _id: 1 },
    { _id: 2 },
    { _id: 3 }
  ]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('coverage special cases', function (t) {
  t.plan(1);

  var Item = function () {
    this.el = frzr.el('p', [ 'Hello ', frzr.text('world'), '!' ] );
  }

  var item = new Item();

  frzr.mountBefore(document.body, item, document.body.firstChild);
  frzr.mount(document.body, item);
  frzr.unmount(document.body, item);
  frzr.mount(document.body, item);
  frzr.unmount(document.body, item.el);
  frzr.setChildren(document.body, []);

  t.equals(document.body.innerHTML, '');
});
