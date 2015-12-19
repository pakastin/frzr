
'use strict';

const frzr = require('../dist/frzr.js');
const test = require('tape');
const body = new frzr.View({
  el: document.body
});

test('create and destroy view', (t) => {
  t.plan(2);

  const p = new frzr.View({
    el: frzr.el('p', {
      text: 'Hi!'
    })
  });

  body.setChildren(p);

  t.equal(body.el.innerHTML, '<p>Hi!</p>', 'View mounted');

  p.destroy();
  t.equal(body.el.innerHTML, '', 'View destroyed');
});

test('create, update and destroy viewlist', (t) => {
  t.plan(3);

  const body = new frzr.View({
    el: document.body
  });

  const ul = new frzr.View({
    el: frzr.el('ul')
  });

  const Li = frzr.View.extend({
    init () {
      this.el = frzr.el('li');
    },
    update (data) {
      this.setText(data);
    }
  });

  const li = new frzr.ViewList({
    View: Li
  });

  li.setData([1, 2, 3]);

  ul.addChild(li);
  body.addChild(ul);

  t.equal(document.body.innerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>', 'ViewList mounted');

  li.setData([3, 1, 2]);

  t.equal(document.body.innerHTML, '<ul><li>3</li><li>1</li><li>2</li></ul>', 'ViewList updated');

  li.destroy();

  t.equal(document.body.innerHTML, '<ul></ul>', 'ViewList destroyed');

  ul.destroy();
});

test('animation', (t) => {
  t.plan(1);

  let animationFrames = 0;

  const p = new frzr.View({
    el: frzr.el('p', {
      text: 'Hello'
    }),
    init () {
      this.animation = new frzr.Animation({
        duration: 1000,
        easing: 'quartInOut',
        progress: (t) => {
          animationFrames++;
          this.setStyle('transform', frzr.translate(100 * (1 - t), '%', 0));
        },
        end () {
          t.pass(`Animation worked (${animationFrames} fps)`);
        }
      });
    }
  });

  body.addChild(p);
});
