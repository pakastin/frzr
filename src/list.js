
import { mount, unmount, setChildren } from './index';

export function list (View, key, initData) {
  return new List(View, key, initData);
}

export function List (View, key, initData) {
  this.View = View;
  this.views = [];
  this.initData = initData;

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
        view = new View(initData, item);
        cb && added.push(view);
      } else {
        cb && updated.push(view);
      }

      views[i] = newLookup[id] = view;

      view.update && view.update(item);
    }

    for (var id in lookup) {
      if (!newLookup[id]) {
        cb && removed.push(lookup[id]);
        parent && unmount(parent, lookup[id]);
      }
    }

    this.lookup = newLookup;
  } else {
    for (var i = data.length; i < views.length; i++) {
      var view = views[i];

      unmount(parent, view);
      cb && removed.push(view);
    }

    views.length = data.length;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = views[i];

      if (!view) {
        view = new View(initData, item);
        cb && added.push(view);
      } else {
        cb && updated.push(view);
      }

      view.update && view.update(item);
      views[i] = view;
    }
  }

  parent && setChildren(parent, views);
  cb && cb(added, updated, removed);
}
