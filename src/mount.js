
import { text, setChildren, notifyDown } from './index';

function append (parent, child, before) {
  if (before) {
    parent.insertBefore(child, before.el || before);
  } else {
    parent.appendChild(child);
  }
}

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var type = child && child.constructor;

  if (type === String || type === Number) {
    append(parentEl, text(child), before);
    return true;

  } else if (type === Array) {
    for (var i = 0; i < child.length; i++) {
      mount(parent, child[i], before);
    }
    return true;
  }

  var childEl = child.el || child;
  var childWasMounted = childEl.parentNode != null;

  if (childWasMounted) {
    child.remounting && child.remounting();
  } else {
    child.mounting && child.mounting();
  }

  if (childEl.nodeType) {
    append(parentEl, childEl, before);

    if (childEl !== child) {
      if (childWasMounted) {
        child.remounted && child.remounted();
      } else {
        child.mounted && child.mounted();
      }

      childEl.view = child;
      child.parent = parent;
    }

  } else if (child.views) {
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

export function destroy (child) {
  var childEl = child.el || child;
  var parent = childEl.parentNode;
  var parentView = parent.view || parent;

  child.destroying && child.destroying(child);
  notifyDown(child, 'destroying');
  parent && unmount(parentView, child);
  child.destroyed && child.destroyed(child);
  notifyDown(child, 'destroyed');
}
