
const EVENTS = ['init', 'inited', 'update', 'updated', 'destroy'].reduce((obj, key) => {
  obj[key] = true;
  return obj;
}, {});

import { Observable } from './observable';

export class Model extends Observable {
  constructor (options) {
    super();

    for (const key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
    this.trigger('init');
    this.trigger('inited');
  }
  update (...args) {
    this.trigger('update', ...args);
  }
}

Model.extend = function extend (options) {
  return class ExtendedModel extends Model {
    constructor (data) {
      super(options, data);
    }
  };
};
