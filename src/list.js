
import { mount, unmount, setChildren } from './index';

export function list (View, key, initData) {
  return new List(View, key, initData);
}

export function List (View, key, initData) {
  this.View = View;
  this.key = key;
  this.initData = initData;

  this.lookup = key != null ? {} : [];
  this.views = [];
}

List.prototype.update = function (data, cb) {
  var View = this.View;
  var key = this.key;
  var lookup = this.lookup;
  var views = this.views;

  var newLookup = key ? {} : [];

  var added = [];
  var updated = [];
  var removed = [];

  views.length = data.length;

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var id = key != null ? item[key] : i;
    var view = lookup[id];

    if (!view) {
      view = new View(this.initData, item);

      added[added.length] = view;
    } else {
      updated[updated.length] = view;
    }

    view.update && view.update(item);
    views[i] = view;

    newLookup[id] = view;
  }

  for (var id in lookup) {
    if (!newLookup[id]) {
      var view = lookup[id];

      view.el.removing = true;

      removed[removed.length] = view;
    }
  }

  if (this.parent) {
    setChildren(this.parent, views);
  }

  for (var i = 0; i < views.length; i++) {
    var item = data[i];
    var view = views[i];

    view.updated && view.updated(item);
  }

  this.lookup = newLookup;

  cb && cb(added, updated, removed);

  for (var i = 0; i < removed.length; i++) {
    var view = removed[i];
    
    if (view.remove) {
      this.parent && scheduleRemove(this.parent, view);
    } else {
      this.parent && unmount(this.parent, view);
    }
  }

  return this;
}

function scheduleRemove (parent, child) {
  child.remove(function () {
    unmount(parent, child);
  });
}
