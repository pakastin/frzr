
import { extend } from './index';

export function Observable () {
  this.listeners = {};
}

extend(Observable, null, {
  on (name, cb) {
    if (!this.listeners[name]) this.listeners[name] = [];

    this.listeners[name].push({ cb, one: false });
  },
  one (name, cb) {
    if (!this.listeners[name]) this.listeners[name] = [];

    this.listeners[name].push({ cb, one: true });
  },
  trigger (name, ...args) {
    const listeners = this.listeners[name];

    if (!listeners) {
      return;
    }

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].cb.apply(this, args);

      if (listeners[i].one) {
        listeners.splice(i--, 1);
      }
    }
  },
  off (name, cb) {
    if (typeof name === 'undefined') {
      this.listeners = {};
    } else if (typeof cb === 'undefined') {
      this.listeners[name] = [];
    } else {
      const listeners = this.listeners[name];

      if (!listeners) {
        return;
      }

      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].cb === cb) {
          listeners.splice(i--, 1);
        }
      }
    }
  }
});
