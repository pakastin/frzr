
const EVENTS = ['init', 'inited', 'update', 'updated', 'destroy'].reduce((obj, key) => {
  obj[key] = true;
  return obj;
}, {});

import { Model } from './model';
import { Observable } from './observable';

export class Collection extends Observable {
  constructor (options) {
    super();

    this.models = [];
    this.lookup = {};

    for (const key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
  }
  setModels (data) {
    const models = new Array(data.length);
    const lookup = {};
    const currentModels = this.models;
    const currentLookup = this.lookup;
    const key = this.key;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = key && item[key];
      const ModelClass = this.Model || Model;
      const model = (key ? currentLookup[id] : currentModels[i]) || new ModelClass();

      for (let j = 0; j < EVENTS.length; j++) {
        const name = EVENTS[j];
        model.on(name, (...args) => {
          this.trigger(name, [model, ...args]);
        });
      }

      if (key) lookup[key] = model;

      models[i] = model;
      model.update(item);
    }
    if (key) {
      for (const id in currentLookup) {
        if (!lookup[id]) {
          currentLookup[id].destroy();
        }
      }
    } else {
      for (let i = models.length; i < currentModels.length; i++) {
        currentModels[i].destroy();
      }
    }
    this.models = models;
    this.lookup = lookup;
    this.parent.setChildren(models);
  }
}

Collection.extend = function extend (options) {
  return class ExtendedCollection extends Collection {
    constructor (data) {
      super(options, data);
    }
  };
};
