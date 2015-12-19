
const EVENTS = 'init inited mount mounted unmount unmounted sort sorted update updated destroy'.split(' ').reduce((obj, key) => {
  obj[key] = true;
  return obj;
}, {});

import { Observable } from './observable';
import { View } from './view';
import { extendable } from './utils';

export class ViewList extends Observable {
  /**
   * @typedef {Object} ViewListOptions
   * @property {View} [View=View] View Class to create new Views with
   * @property {Function} [init] 'init' callback shortcut
   * @property {Function} [inited] 'inited' callback shortcut
   * @property {Function} [mount] 'mount' callback shortcut
   * @property {Function} [mounted] 'mounted' callback shortcut
   * @property {Function} [sort] 'sort' callback shortcut
   * @property {Function} [sorted] 'sorted' callback shortcut
   * @property {Function} [update] 'update' callback shortcut
   * @property {Function} [updated] 'updated' callback shortcut
   * @property {Function} [destroy] 'destroy' callback shortcut
   * @property {*} [*] Anything else you want to pass on to View
   */

  /**
   * Creates list of Views to be mounted to a View
   * @param  {ViewListOptions} options ViewList options
   * @return {ViewList}
   */
  constructor (options) {
    super();

    /**
     * Views by key, if key provided
     * @type {Object}
     */
    this.lookup = {};
    /**
     * list of Views
     * @type {Array}
     */
    this.views = [];

    for (const key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
  }
  /**
   * Sync list of Views with data provided
   * @param {Array} data Data for syncing list of Views
   */
  setData (data) {
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

      if (key) lookup[id] = view;

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
  destroy () {
    this.setData([]);
    this.off();
  }
}

extendable(ViewList);
