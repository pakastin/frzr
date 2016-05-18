
import { setChildren, List } from './index';

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var childWasMounted = childEl.parentNode != null;

  if (childWasMounted) {
    child.remounting && child.remounting();
  } else {
    child.mounting && child.mounting();
  }

  if (childEl instanceof Node) {
    if (before) {
      var beforeEl = before.el || before;
      parentEl.insertBefore(childEl, beforeEl);
    } else {
      parentEl.appendChild(childEl);
    }

    if (childWasMounted) {
      child.remounted && child.remounted();
    } else {
      child.mounted && child.mounted();
    }
    if (childEl !== child) {
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
  var childWasMounted = childEl.parentNode != null;

  replace.unmounting && replace.unmounting();

  if (childWasMounted) {
    child.remounting && child.remounting();
  } else {
    child.mounting && child.mounting();
  }

  parentEl.replaceChild(childEl, replaceEl);

  replace.unmounted && replace.unmounted();

  if (replaceEl !== replace) {
    replace.parent = null;
  }

  if (childWasMounted) {
    child.remounted && child.remounted();
  } else {
    child.mounted && child.mounted();
  }
  if (childEl !== child) {
    childEl.view = child;
    child.parent = parent;
  }
}

export function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  child.unmounting && child.unmounting();

  parentEl.removeChild(childEl);

  child.unmounted && child.unmounted();

  if (childEl !== child) {
    child.parent = null;
  }
}
