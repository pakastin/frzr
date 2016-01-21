
'use strict';

var frzr = require('../dist/frzr.js');
var test = require('tape');
var body = new frzr.View({
  el: document.body
});

test('create and destroy view', function (t) {
  t.plan(2);

  var p = new frzr.View({
    el: ['p', { text: 'Hi!' }]
  });

  body.setChildren([p]);

  t.equal(body.el.innerHTML, '<p>Hi!</p>', 'View mounted');

  p.destroy();
  t.equal(body.el.innerHTML, '', 'View destroyed');
});

test('create, update and destroy viewlist', function (t) {
  t.plan(3);

  var body = new frzr.View({
    el: document.body
  });

  var ul = new frzr.View({
    el: 'ul'
  });

  var Li = frzr.View.extend({
    el: 'li',
    update (data) {
      this.setText(data);
    }
  });

  var list = new frzr.ViewList({
    View: Li
  });

  list.update([1, 2, 3]);

  ul.addChild(list);
  body.addChild(ul);

  t.equal(document.body.innerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>', 'ViewList mounted');

  list.update([3, 1, 2]);

  t.equal(document.body.innerHTML, '<ul><li>3</li><li>1</li><li>2</li></ul>', 'ViewList updated');

  list.destroy();

  t.equal(document.body.innerHTML, '<ul></ul>', 'ViewList destroyed');

  ul.destroy();
});

test('animation', function (t) {
  t.plan(1);

  var animationFrames = 0;

  var p = new frzr.View({
    el: ['p', { text: 'Hello' }],
    init: function () {
      var view = this;

      view.animation = new frzr.Animation({
        duration: 1000,
        easing: 'quartInOut',
        progress: function (t) {
          animationFrames++;
          view.setStyle('transform', frzr.translate(100 * (1 - t), '%', 0));
        },
        end () {
          t.pass(`Animation worked (${animationFrames} fps)`);
        }
      });
    }
  });

  body.addChild(p);
});

test('renderer', function (t) {
  t.plan(2);
  var updated = 0;
  var rendered = 0;
  var updater = frzr.renderer(function (next, data) {
    setTimeout(function () {
      t.equal(data, rendered++ ? 2 : 0);
      next();
    }, 50);
  });
  updater(updated++);
  updater(updated++);
  updater(updated++);
});
