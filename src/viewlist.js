
var EVENTS = 'init inited mount mounted unmount unmounted sort sorted update updated destroy'.split(' ').reduce(function (obj, key) {
  obj[key] = true;
  return obj;
}, {});

import { Observable } from './observable';
import { View } from './view';
import { define, extendable, inherits } from './utils';

export function ViewList (options) {
  Observable.call(this);

  this.lookup = {};
  this.views = [];

  if (options instanceof View) {
    this.View = options;
  } else {
    for (var key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
  }
}

inherits(ViewList, Observable);

define(ViewList.prototype, {
  update: function (data) {
    var viewList = this;
    var views = new Array(data.length);
    var lookup = {};
    var currentViews = this.views;
    var currentLookup = this.lookup;
    var key = this.key;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = key && item[key];
      var ViewClass = this.View || View;
      var view = (key ? currentLookup[id] : currentViews[i]) || new ViewClass();

      for (var j = 0; j < EVENTS.length; j++) {
        var name = EVENTS[j];
        view.on(name, function (data) {
          viewList.trigger(name, view, data);
        });
      }

      if (key) lookup[id] = view;

      views[i] = view;
      view.update(item);
    }
    if (key) {
      for (var id in currentLookup) {
        if (!lookup[id]) {
          currentLookup[id].destroy();
        }
      }
    } else {
      for (var i = views.length; i < currentViews.length; i++) {
        currentViews[i].destroy();
      }
    }
    this.views = views;
    this.lookup = lookup;
    if (this.parent) this.parent.setChildren(views);
  },
  destroy: function () {
    this.update([]);
    this.off();
  }
});

extendable(ViewList);

export function viewList (options) {
  return new ViewList(options);
}

viewList.extend = function extend (options) {
  return function extendedViewList (data) {
    return new ViewList(options, data);
  };
};
