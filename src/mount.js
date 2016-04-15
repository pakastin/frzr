
import { setChildren, List } from './index';

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  if (childEl instanceof Node) {
    if (before) {
      var beforeEl = before;
      parentEl.insertBefore(childEl, beforeEl);
    } else {
      parentEl.appendChild(childEl);
    }
    
    if (child.el !== child) {
      child.parent = parent;
    }

  } else if (isPrimitive(childEl)) {
    mount(parentEl, document.createTextNode(childEl), before);

  } else if (childEl instanceof Array) {
    for (var i = 0; i < childEl.length; i++) {
      mount(parentEl, childEl[i], before);
    }

  } else if (child instanceof List) {
    child.parent = parent;
    setChildren(parentEl, child.views);

  } else {
    return false;
  }
  return true;
}

export var mountBefore = mount;

export function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  parentEl.removeChild(childEl);

  if (childEl !== child) {
    child.parent = null;
  }
}

function isPrimitive (check) {
  return typeof check === 'string' || check === 'number' || check === 'boolean';
}
