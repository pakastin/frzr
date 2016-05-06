
import { setChildren, List } from './index';

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var childIsView = child.el !== child;

  if (childIsView) {
    if (child.parent) {
      child.remounting && child.remounting();
    } else {
      child.mounting && child.mounting();
    }
  }

  if (childEl instanceof Node) {
    if (before) {
      var beforeEl = before;
      parentEl.insertBefore(childEl, beforeEl);
    } else {
      parentEl.appendChild(childEl);
    }

    if (childIsView) {
      if (child.parent) {
        child.remounted && child.remounted();
      } else {
        child.mounted && child.mounted();
      }
      childEl.view = child;
      child.parent = parent;
    }

  } else if (typeof childEl === 'string' || typeof childEl === 'number') {
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

export function replace (parent, child, replace) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var replaceEl = replace.el || replace;
  var childIsView = child.el !== child;
  var replaceIsView = replace.el !== replace;

  if (replaceIsView) {
    replace.unmounting && replace.unmounting();
  }

  if (childIsView) {
    if (child.parent) {
      child.remounting && child.remounting();
    } else {
      child.mounting && child.mounting();
    }
  }

  parentEl.replaceChild(childEl, replaceEl);

  if (replaceIsView) {
    replace.unmounted && replace.unmounted();
    replace.parent = null;
  }

  if (childIsView) {
    if (child.parent) {
      child.remounted && child.remounted();
    } else {
      child.mounted && child.mounted();
    }
    childEl.view = child;
    child.parent = parent;
  }
}

export function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var childIsView = child.el !== child;

  if (childIsView) {
    child.unmounting && child.unmounting();
  }

  parentEl.removeChild(childEl);

  if (childIsView) {
    child.unmounted && child.unmounted();
    child.parent = null;
  }
}
