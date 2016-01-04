
import { el } from './el';
import { extend, extendable, inherits } from './utils';
import { Observable } from './observable';

var EVENT = 'init inited mount mounted unmount unmounted sort sorted update updated destroy'.split(' ').reduce(function (obj, name) {
  obj[name] = name;
  return obj;
}, {});

export function View (options, data) {
  Observable.call(this);

  this.el = null;
  this.eventListeners = [];
  this.listeners = {};

  for (var key in options) {
    if (EVENT[key]) {
      this.on(key, options[key]);
    } else if (key === 'el') {
      if (typeof options.el === 'string') {
        this.el = document.createElement(options.el);
      } else if (options.el instanceof Array) {
        this.el = el(options.el[0], options.el[1]);
      } else {
        this.el = options.el;
      }
    } else {
      this[key] = options[key];
    }
  }

  this.trigger(EVENT.init, data);
  if (!this.el) this.el = document.createElement('div');
  this.el.view = this;
  this.trigger(EVENT.inited, data);
}
inherits(View, Observable);
extend(View.prototype, {
  setAttr: function (attributeName, value) {
    if (this.el[attributeName] !== value) {
      this.el[attributeName] = value;
    }

    return this;
  },
  setClass: function (className, value) {
    if (this.el.classList.contains(className) !== value) {
      if (value) {
        this.el.classList.add(className);
      } else {
        this.el.classList.remove(className);
      }
    }

    return this;
  },
  setStyle: function (propertyName, value) {
    if (this.el.style[propertyName] !== value) {
      this.el.style[propertyName] = value;
    }

    return this;
  },
  setText: function (text) {
    if (this.el.textContent !== text) {
      this.el.textContent = text;
    }

    return this;
  },
  setHTML: function (html) {
    if (this.el.innerHTML !== html) {
      this.el.innerHTML = html;
    }

    return this;
  },
  addListener: function (listenerName, handler, useCapture) {
    var listener = {
      name: listenerName,
      handler: handler,
      proxy: function (e) {
        handler.call(this, e);
      }
    };
    if (!this.eventListeners) this.eventListeners = [];

    this.eventListeners.push(listener);
    this.el.addEventListener(listenerName, listener.proxy, useCapture);

    return this;
  },
  removeListener: function (listenerName, handler) {
    var listeners = this.eventListeners;
    if (!listeners) {
      return this;
    }
    if (typeof listenerName === 'undefined') {
      for (var i = 0; i < listeners.length; i++) {
        this.el.removeEventListener(listeners[i].proxy);
      }
      this.listeners = [];
    } else if (typeof handler === 'undefined') {
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].name === listenerName) {
          listeners.splice(i--, 1);
        }
      }
    } else {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        if (listener.name === listenerName && handler === listener.handler) {
          listeners.splice(i--, 1);
        }
      }
    }

    return this;
  },
  addChild: function (child) {
    if (child.views) {
      child.parent = this;
      return this.setChildren(child.views);
    }
    var sorting = false;
    if (child.parent) {
      sorting = true;
      child.trigger(EVENT.sort);
    } else {
      child.trigger(EVENT.mount);
    }

    this.el.appendChild(child.el);
    child.parent = this;

    if (sorting) {
      child.trigger(EVENT.sorted);
    } else {
      child.trigger(EVENT.mounted);
    }

    return this;
  },
  addBefore: function (child, before) {
    var sorting = false;

    if (child.parent) {
      sorting = true;
      child.trigger(EVENT.sort);
    } else {
      child.trigger(EVENT.mount);
    }

    this.el.insertBefore(child.el, before.el || before);
    child.parent = this;

    if (sorting) {
      child.trigger(EVENT.sorted);
    } else {
      child.trigger(EVENT.mounted);
    }

    return this;
  },
  setChildren: function (views) {
    var traverse = this.el.firstChild;

    for (var i = 0; i < views.length; i++) {
      var view = views[i];

      if (traverse === view.el) {
        traverse = traverse.nextSibling;
        continue;
      }
      if (traverse) {
        this.addBefore(view, traverse);
      } else {
        this.addChild(view);
      }
    }
    while (traverse) {
      var next = traverse.nextSibling;

      if (traverse.view) {
        traverse.view.parent.removeChild(traverse.view);
      } else {
        this.el.removeChild(traverse);
      }

      traverse = next;
    }

    return this;
  },
  removeChild: function (child) {
    if (!child.parent) {
      return this;
    }
    child.trigger(EVENT.unmount);

    this.el.removeChild(child.el);
    child.parent = null;

    child.trigger(EVENT.unmounted);

    return this;
  },
  update: function (data) {
    this.trigger(EVENT.update, data);
  },
  destroy: function () {
    this.trigger(EVENT.destroy);
    if (this.parent) this.parent.removeChild(this);

    var traverse = this.el.firstChild;

    while (traverse) {
      if (traverse.view) {
        traverse.view.destroy();
      } else {
        this.el.removeChild(traverse);
      }
      traverse = this.el.firstChild;
    }
    this.off();
    this.removeListener();
  }
});

extendable(View);

export function view (options, data) {
  return new View(options, data);
}

view.extend = function extend (options) {
  return function extendedView (data) {
    return new View(options, data);
  };
};
