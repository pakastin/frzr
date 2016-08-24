
var test = require('tape');

module.exports = function (frzr) {
  test('element creation', function (t) {
    t.plan(1);

    var hello = frzr.el('p', { className: 'hello', textContent: 'Hello world!' });

    t.equals(hello.outerHTML, '<p class="hello">Hello world!</p>');
  });

  test('custom element creation with custom attribute', function (t) {
    t.plan(2);

    frzr.registerElement('frzr', function (tagName, text) {
      return frzr.el('div', { class: 'frzr', textContent: text, frzr: 'works' });
    });
    frzr.registerAttribute('frzr', function (el, value) {
      t.equals(value, 'works');
    });

    var hello = frzr.el('frzr', 'Hello world!');

    t.equals(hello.outerHTML, '<div class="frzr">Hello world!</div>');

    frzr.unregisterElement('frzr');
    frzr.unregisterAttribute('frzr');
  });

  test('element with text element and custom attribute', function (t) {
    t.plan(1);

    var hello = frzr.el('p', { custom: 'a' }, 'Hello world!');

    t.equals(hello.outerHTML, '<p custom="a">Hello world!</p>');
  });

  test('element with text element (number) and custom attribute', function (t) {
    t.plan(1);

    var hello = frzr.el('p', { custom: 'a' }, 1);

    t.equals(hello.outerHTML, '<p custom="a">1</p>');
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
    t.plan(2);

    var Circle = frzr.svg.extend('circle');

    var circle = Circle({ cx: 0, cy: 0, r: 10 });
    var line = frzr.svg('line', { onclick: onClick, x1: 0, y1: 0, x2: 10, y2: 0 });
    var text = frzr.svg('text', 'Testing');
    var svg = frzr.svg('svg', { width: 100, height: 100 }, circle, line, text);

    frzr.setChildren(document.body, [svg]);

    line.onclick();

    t.equals(document.body.innerHTML, '<svg width="100" height="100"><circle cx="0" cy="0" r="10"></circle><line x1="0" y1="0" x2="10" y2="0"></line><text>Testing</text></svg>');

    function onClick () {
      t.pass();
    }
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
    t.plan(7);

    var mounted = false;
    var unmounted = false;

    var Item = function (initData) {
      this.el = frzr.el('p');
    }
    Item.prototype.update = function (data) {
      this.el.textContent = data;
    }
    Item.prototype.mounted = function () {
      mounted = true;
    }
    Item.prototype.unmounted = function () {
      unmounted = true;
    }

    var list = frzr.list(Item);

    frzr.mount(document.body, list);

    list.update([ 5, 4, 6 ]);

    list.update([ 3, 1 ], function (added, updated, removed) {
      t.equals(added.length, 0);
      t.equals(updated.length, 2);
      t.equals(removed.length, 1);
    });

    list.update([ 1, 2, 3 ], function (added, updated, removed) {
      t.equals(added.length, 1);
    });

    t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
    t.equals(mounted, true);
    t.equals(unmounted, true);
  });

  test('list update with key', function (t) {
    t.plan(7);

    var Item = function (initData) {
      this.el = frzr.el('p');
    }

    Item.prototype.update = function (data, cb) {
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
    ], function (added, updated, removed) {
      t.equals(added.length, 0);
      t.equals(updated.length, 2);
      t.equals(removed.length, 1);
    });

    list.update([
      { _id: 1 },
      { _id: 2 },
      { _id: 3 }
    ], function (added, updated, removed) {
      t.equals(added.length, 2);
      t.equals(updated.length, 1);
      t.equals(removed.length, 1);
    });

    t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
  });

  test('destroy', function (t) {
    t.plan(4);

    var Test2 = function () {
      this.el = frzr.el('p');
    }
    var Test = function () {
      this.el = frzr.el('div',
        this.test = new Test2()
      );
    }
    var destroying, destroying2, destroyed, destroyed2;
    Test.prototype.destroying = function () {
      destroying = true;
    }
    Test2.prototype.destroying = function () {
      destroying2 = true;
    }
    Test.prototype.destroyed = function () {
      destroyed = true;
    }
    Test2.prototype.destroyed = function () {
      destroyed2 = true;
    }
    var test = new Test();
    frzr.mount(document.body, test);
    frzr.destroy(test);
    t.equals(destroying, true, 'destroying Test');
    t.equals(destroying2, true, 'destroying Test2');
    t.equals(destroyed, true, 'destroyed Test');
    t.equals(destroyed2, true, 'destroyed Test2');
  });

  test('create extended el with any number of arguments', function (t) {
    t.plan(8);

    var p = frzr.el.extend('p');

    t.equals(p().childNodes.length, 0);
    t.equals(p('a').childNodes.length, 1);
    t.equals(p('a', 'b').childNodes.length, 2);
    t.equals(p('a', 'b', 'c').childNodes.length, 3);
    t.equals(p('a', 'b', 'c', 'd').childNodes.length, 4);
    t.equals(p('a', 'b', 'c', 'd', 'e').childNodes.length, 5);
    t.equals(p('a', 'b', 'c', 'd', 'e', 'f').childNodes.length, 6);
    t.equals(p('a', 'b', 'c', 'd', 'e', 'f', 'g').childNodes.length, 7);
  });

  test('coverage special cases', function (t) {
    t.plan(7);

    var mounting = false;
    var mounted = false;

    var unmounting = false;
    var unmounted = false;

    var remounting = false;
    var remounted = false;

    var p = frzr.el.extend('p');

    var Item = function (text) {
      this.el = p([ 'Hello ', frzr.text('world'), '!' ] );
    }
    var TextItem = function (data) {
      this.el = frzr.text(data);
    }
    TextItem.prototype.mounting = function () {
      mounting = true;
    }
    TextItem.prototype.unmounting = function () {
      unmounting = true;
    }
    TextItem.prototype.mounted = function () {
      mounted = true;
    }
    TextItem.prototype.unmounted = function () {
      unmounted = true;
    }
    TextItem.prototype.remounting = function () {
      remounting = true;
    }
    TextItem.prototype.remounted = function () {
      remounted = true;
    }

    var item = frzr.el(Item, 'testing');
    var someText = new TextItem('something');
    var someOtherText = new TextItem('something else');

    frzr.mount(item, someText);
    frzr.replace(item, someOtherText, someText);
    frzr.mount(item, someText);
    frzr.replace(item, someText, someOtherText);
    frzr.mount(item, someText);
    frzr.mount(item, someText);
    frzr.unmount(item, someText);

    frzr.mountBefore(document.body, item, document.body.firstChild);
    frzr.mount(document.body, item);
    frzr.unmount(document.body, item);
    frzr.mount(document.body, item);
    frzr.unmount(document.body, item.el);
    frzr.setChildren(document.body, []);

    t.equals(document.body.innerHTML, '');
    t.equals(mounting, true, 'mounting');
    t.equals(mounted, true, 'mounted');
    t.equals(unmounting, true, 'unmounting');
    t.equals(unmounted, true, 'unmounted');
    t.equals(remounting, true, 'remounting');
    t.equals(remounted, true, 'remounted');
  });
}
