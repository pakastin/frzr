'use strict';

function text (str) {
  return document.createTextNode(str);
}

function el (tagName) {
  var element = document.createElement(tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    } else if (mount(element, arg)) {
      continue;
    } else if (typeof arg === 'object') {
      for (var attr in arg) {
        if (element[attr] == null || attr === 'style') {
          element.setAttribute(attr, arg[attr]);
        } else {
          element[attr] = arg[attr];
        }
      }
    }
  }

  return element;
}

function svg (tagName) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    } else if (mount(element, arg)) {
      continue;
    } else if (typeof arg === 'object') {
      for (var attr in arg) {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}

function list (View, key, initData, skipRender) {
  return new List(View, key, initData, skipRender);
}

function List (View, key, initData, skipRender) {
  this.View = View;
  this.views = [];
  this.initData = initData;
  this.skipRender = skipRender;

  if (key) {
    this.key = key;
    this.lookup = {};
  }
}

List.prototype.update = function (data, cb) {
  var View = this.View;
  var views = this.views;
  var parent = this.parent;
  var key = this.key;
  var initData = this.initData;
  var skipRender = this.skipRender;

  if (cb) {
    var added = [];
    var updated = [];
    var removed = [];
  }

  if (key) {
    var lookup = this.lookup;
    var newLookup = {};

    views.length = data.length;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = item[key];
      var view = lookup[id];

      if (!view) {
        view = new View(initData, item, i);
        cb && added.push(view);
      } else {
        cb && updated.push(view);
      }

      views[i] = newLookup[id] = view;

      view.update && view.update(item, i);
    }

    if (cb) {
      for (var id in lookup) {
        if (!newLookup[id]) {
          removed.push(lookup[id]);
          !skipRender && parent && unmount(parent, lookup[id]);
        }
      }
    }

    this.lookup = newLookup;
  } else {
    if (cb) {
      for (var i = data.length; i < views.length; i++) {
        var view = views[i];

        !skipRender && parent && unmount(parent, view);
        removed.push(view);
      }
    }

    views.length = data.length;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = views[i];

      if (!view) {
        view = new View(initData, item, i);
        cb && added.push(view);
      } else {
        cb && updated.push(view);
      }

      view.update && view.update(item, i);
      views[i] = view;
    }
  }

  !skipRender && parent && setChildren(parent, views);
  cb && cb(added, updated, removed);
}

function mount (parent, child, before) {
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

var mountBefore = mount;

function replace (parent, child, replace) {
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

function unmount (parent, child) {
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

function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childEl = child.el || child;

    if (traverse === childEl) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parent, child, traverse);
  }

  while (traverse) {
    var next = traverse.nextSibling;

    unmount(parent, traverse.view || traverse);

    traverse = next;
  }
}

exports.text = text;
exports.el = el;
exports.svg = svg;
exports.list = list;
exports.List = List;
exports.mount = mount;
exports.mountBefore = mountBefore;
exports.replace = replace;
exports.unmount = unmount;
exports.setChildren = setChildren;