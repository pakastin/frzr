
const EVENTS = ['init', 'inited', 'mount', 'mounted', 'unmount', 'unmounted', 'sort', 'sorted', 'update', 'updated', 'destroy'].reduce((obj, key) => {
  obj[key] = true;
  return obj;
}, {});

import { extend, extendable, Observable, View } from './index';

export function ViewList (options) {
  ViewList.super.call(this);

  this.views = [];
  this.lookup = {};

  for (const key in options) {
    if (EVENTS[key]) {
      this.on(key, options[key]);
    } else {
      this[key] = options[key];
    }
  }
}

extend(ViewList, Observable, {
  setViews (data) {
    const views = new Array(data.length);
    const lookup = {};
    const currentViews = this.views;
    const currentLookup = this.lookup;
    const key = this.key;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = key && item[key];
      const ViewClass = this.View || View;
      const view = (key ? currentLookup[id] : currentViews[i]) || new ViewClass();

      for (let j = 0; j < EVENTS.length; j++) {
        const name = EVENTS[j];
        view.on(name, (...args) => {
          this.trigger(name, [view, ...args]);
        });
      }

      if (key) lookup[key] = view;

      views[i] = view;
      view.update(item);
    }
    if (key) {
      for (const id in currentLookup) {
        if (!lookup[id]) {
          currentLookup[id].destroy();
        }
      }
    } else {
      for (let i = views.length; i < currentViews.length; i++) {
        currentViews[i].destroy();
      }
    }
    this.views = views;
    this.lookup = lookup;
    if (this.parent) this.parent.setChildren(...views);
  }
});

extendable(ViewList);
