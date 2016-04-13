
import { setChildren, List } from './index';

export function mount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  if (childEl instanceof Node) {
    parentEl.appendChild(childEl);

  } else if (isPrimitive(childEl)) {
    mount(parentEl, document.createTextNode(childEl));

  } else if (childEl instanceof Array) {
    for (var i = 0; i < childEl.length; i++) {
      mount(parentEl, childEl[i]);
    }

  } else if (child instanceof List) {
    child.parent = parent;
    setChildren(parentEl, child.views);

  } else {
    return false;
  }
  return true;
}

export function mountBefore (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var beforeEl = before.el || before;

  parentEl.insertBefore(childEl, beforeEl);
  child.parent = parent;
}

export function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  parentEl.removeChild(childEl);
  child.parent = null;
}

function isPrimitive (check) {
  return typeof check === 'string' || check === 'number' || check === 'boolean';
}
