
import { define } from './utils';

export function Observable (options) {
  Object.defineProperty(this, 'listeners', {
    enumerable: false,
    value: {},
    writable: true
  });

  for (var key in options) {
    this[key] = options[key];
  }
}

define(Observable.prototype, {
  on: function (eventName, handler) {
    if (typeof this.listeners[eventName] === 'undefined') {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({ handler: handler, one: false });

    return this;
  },
  one: function (eventName, handler) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];

    this.listeners[eventName].push({ handler: handler, one: true });

    return this;
  },
  trigger: function (eventName) {
    var listeners = this.listeners[eventName];

    if (!listeners) {
      return this;
    }

    var args = new Array(arguments.length - 1);

    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }

    for (i = 0; i < listeners.length; i++) {
      listeners[i].handler.apply(this, args);

      if (listeners[i].one) {
        listeners.splice(i--, 1);
      }
    }

    return this;
  },
  off: function (name, handler) {
    if (typeof name === 'undefined') {
      this.listeners = {};
    } else if (typeof handler === 'undefined') {
      this.listeners[name] = [];
    } else {
      var listeners = this.listeners[name];

      if (!listeners) {
        return this;
      }

      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].handler === handler) {
          listeners.splice(i--, 1);
        }
      }
    }
    return this;
  }
});

export function observable (options) {
  return new Observable(options);
}
