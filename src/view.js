
const EVENTS = ['init', 'inited', 'mount', 'mounted', 'unmount', 'unmounted', 'update', 'updated', 'destroy'].reduce((obj, key) => {
  obj[key] = true;
  return obj;
}, {});

import { Observable } from './observable';

export class View extends Observable {
  constructor (options, data) {
    super();

    for (const key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
    this.el.view = this;
    this.trigger('init', data);
    this.trigger('inited', data);
  }
  setAttr (key, value) {
    if (!this.attrs) this.attrs = {};

    if (this.attrs[key] === value) {
      return;
    }
    if (value || value === '') {
      this.el.setAttribute(key, value);
      this.attrs[key] = value;
    } else {
      this.el.removeAttribute(key);
      this.attrs[key] = null;
    }
  }
  setClass (key, value) {
    if (!this.classes) this.classes = {};

    if (this.classes[key] === value) {
      return;
    }
    if (value) {
      this.el.classList.add(key);
    } else {
      this.el.classList.remove(key);
    }
    this.classes[key] = value;
  }
  setStyle (key, value) {
    if (!this.styles) this.styles = {};

    if (this.styles[key] === value) {
      return;
    }
    this.el.style[key] = value;
    this.styles[key] = value;
  }
  setText (value) {
    if (this.text === value) {
      return;
    }
    this.el.textContent = value;
    this.text = value;
  }
  setHTML (value) {
    if (this.html === value) {
      return;
    }
    this.el.innerHTML = value;
    this.html = value;
  }
  addListener (name, cb, useCapture) {
    const listener = {
      name: name,
      cb: cb,
      proxy: (...args) => {
        cb.apply(this, args);
      }
    };
    if (!this.eventListeners) this.eventListeners = [];

    this.eventListeners.push(listener);
    this.el.addEventListener(name, listener.proxy, useCapture);
  }
  removeListener (name, cb) {
    const listeners = this.eventListeners;
    if (!listeners) {
      return;
    }
    if (typeof name === 'undefined') {
      for (let i = 0; i < listeners.length; i++) {
        this.el.removeEventListener(listeners[i].proxy);
      }
      this.listeners = [];
    } else if (typeof cb === 'undefined') {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].name === name) {
          listeners.splice(i--, 1);
        }
      }
    } else {
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        if (listener.name === name && cb === listener.cb) {
          listeners.splice(i--, 1);
        }
      }
    }
  }
  addChild (child) {
    if (child.parent) {
      child.trigger('unmount');
      child.trigger('unmounted');
    }
    child.trigger('mount');

    this.el.appendChild(child.el);
    child.parent = this;

    child.trigger('mounted');
  }
  addBefore (child, before) {
    if (child.parent) {
      child.trigger('unmount');
      child.trigger('unmounted');
    }
    child.trigger('mount');

    this.el.insertBefore(child.el, before.el || before);
    child.parent = this;

    child.trigger('mounted');
  }
  setChildren (...views) {
    let traverse = this.el.firstChild;

    for (let i = 0; i < views.length; i++) {
      const view = views[i];

      if (traverse === view.el) {
        traverse = traverse.nextSibling;
        continue;
      }
      if (view.parent === this) {
        view.trigger('sort');
      }
      if (traverse) {
        this.addBefore(view, traverse);
      } else {
        this.addChild(view);
      }
    }
    while (traverse) {
      const next = traverse.nextSibling;

      if (traverse.view) {
        traverse.view.parent.removeChild(traverse.view);
      } else {
        this.el.removeChild(traverse);
      }

      traverse = next;
    }
  }
  removeChild (child) {
    if (!child.parent) {
      return;
    }
    child.trigger('unmount');

    this.el.removeChild(child.el);
    child.parent = null;

    child.trigger('unmounted');
  }
  update (data) {
    this.trigger('update', data);
  }
  destroy () {
    this.trigger('destroy');
    this.parent.removeChild(this);
    this.off();
    this.removeListener();
  }
}

View.extend = function extend (options) {
  return class ExtendedView extends View {
    constructor (data) {
      super(options, data);
    }
  };
};
