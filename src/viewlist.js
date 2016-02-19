
var EVENT = 'init inited update updated destroy'.split(' ').reduce(function (obj, key) {
  obj[key] = key;
  return obj;
}, {});
var ASYNCEVENT = 'preremove'.split(' ').reduce(function (obj, key) {
  obj[key] = key;
  return obj;
}, {});

import { Observable } from '@pakastin/observable';
import { View } from './view';
import { define, extendable, inherits } from './utils';

export function ViewList (options, data) {
  if (!(this instanceof ViewList)) {
    return new ViewList(options, data);
  }

  Observable.call(this);

  this.lookup = {};
  this.views = [];

  if (typeof options === 'function') {
    this.View = options;
  } else {
    for (var key in options) {
      if (EVENT[key]) {
        this.on(key, options[key]);
      } else if (ASYNCEVENT[key]) {
        this.onAsync(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
  }
  this.trigger(EVENT.init, data);
  this.trigger(EVENT.inited, data);

  data && this.update(data);
}

inherits(ViewList, Observable);

define(ViewList.prototype, {
  update: function (data) {
    var self = this;

    self.trigger(EVENT.update, data);

    var viewList = self;
    var views = new Array(data.length);
    var lookup = {};
    var currentViews = self.views;
    var currentLookup = self.lookup;
    var key = self.key;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = key && item[key];
      var ViewClass = self.View || self.view || View;
      var view = (key ? currentLookup[id] : currentViews[i]) || new ViewClass();

      if (key) lookup[id] = view;

      views[i] = view;
      view.update(item);
    }
    var removing = [];
    if (key) {
      for (var id in currentLookup) {
        if (!lookup[id]) {
          removing.push(currentLookup[id]);
        }
      }
    } else {
      for (var i = views.length; i < currentViews.length; i++) {
        removing.push(views[i]);
      }
    }
    if (self.parent) {
      self.parent.setChildren(views.concat(removing));
    }
    this.triggerAsync(ASYNCEVENT.preremove, function () {
      for (var i = 0; i < removing.length; i++) {
        removing[i].destroy();
      }
    }, removing);
    self.views = views;
    self.lookup = lookup;

    self.trigger(EVENT.updated);
  },
  destroy: function () {
    this.trigger(EVENT.destroy);
    this.update([]);
    this.off();
  }
});

extendable(ViewList);

export var viewlist = ViewList;
export var viewList = ViewList;
