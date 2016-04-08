
import { setChildren, List } from './index';

export function mount (parent, child) {
  var parentNode = parent.el || parent;
  var childNode = child.el || child;

  if (child instanceof List) {
    child.parent = parent;
    setChildren(parent, child.views);
    return;
  }
  if (child.el) {
    parentNode.appendChild(childNode);

    if (child.parent) {
      child.reorder && child.reorder();
    } else {
      child.mount && child.mount();
    }
    child.parent = parent;
  } else {
    parentNode.appendChild(childNode);
  }
}

export function mountBefore (parent, child, before) {
  var parentNode = parent.el || parent;
  var childNode = child.el || child;
  var beforeNode = before.el || before;

  parentNode.insertBefore(childNode, beforeNode);

  if (child.el) {
    if (child.parent) {
      child.reorder && child.reorder();
    } else {
      child.mount && child.mount();
    }

    child.parent = parent;
  }
}

export function unmount (parent, child) {
  var parentNode = parent.el || parent;
  var childNode = child.el || child;

  parentNode.removeChild(childNode);

  if (child.el) {
    child.parent = null;
    child.unmount && child.unmount();
  }
}
