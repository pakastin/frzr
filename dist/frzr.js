(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.frzr = {}));
}(this, function (exports) { 'use strict';

  function el(tagName, attrs) {
    var _el = document.createElement(tagName);

    for (var key in attrs) {
      if (key === 'text') {
        _el.textContent = attrs[key];
      } else if (key === 'html') {
        _el.innerHTML = attrs[key];
      } else {
        _el.setAttribute(key, attrs[key]);
      }
    }

    return _el;
  }

  function each(array, iterator) {
    for (var i = 0; i < array.length; i++) {
      iterator(array[i], i);
    }
  }

  function shuffle(array) {
    if (!array || !array.length) {
      return array;
    }

    for (var i = array.length - 1; i > 0; i--) {
      var rnd = Math.random() * i | 0;
      var temp = array[i];

      array[i] = array[rnd];
      array[rnd] = temp;
    }

    return array;
  }

  function extend(Class, SuperClass, prototype) {
    Class.prototype = Object.create(SuperClass && SuperClass.prototype);
    Class.prototype.constructor = Class;
    Class.super = SuperClass;

    for (var key in prototype || {}) {
      Class.prototype[key] = prototype[key];
    }
  }

  function extendable(Class) {
    Class.extend = function _extend(options) {
      function ExtendedClass() {
        var _ExtendedClass$super;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_ExtendedClass$super = ExtendedClass.super).call.apply(_ExtendedClass$super, [this, options].concat(args));
      }
      extend(ExtendedClass, Class);
      return ExtendedClass;
    };
  }

  function Observable() {
    this.listeners = {};
  }

  extend(Observable, null, {
    on: function on(name, cb) {
      if (!this.listeners[name]) this.listeners[name] = [];

      this.listeners[name].push({ cb: cb, one: false });
    },
    one: function one(name, cb) {
      if (!this.listeners[name]) this.listeners[name] = [];

      this.listeners[name].push({ cb: cb, one: true });
    },
    trigger: function trigger(name) {
      var listeners = this.listeners[name];

      if (!listeners) {
        return;
      }

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < listeners.length; i++) {
        listeners[i].cb.apply(this, args);

        if (listeners[i].one) {
          listeners.splice(i--, 1);
        }
      }
    },
    off: function off(name, cb) {
      if (typeof name === 'undefined') {
        this.listeners = {};
      } else if (typeof cb === 'undefined') {
        this.listeners[name] = [];
      } else {
        var listeners = this.listeners[name];

        if (!listeners) {
          return;
        }

        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i].cb === cb) {
            listeners.splice(i--, 1);
          }
        }
      }
    }
  });

  var EVENTS = 'init inited mount mounted unmount unmounted update updated destroy'.split(' ').reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  function View(options, data) {
    if (!(this instanceof View)) {
      throw new Error('Something went wrong');
    }
    View.super.call(this);

    for (var key in options) {
      if (EVENTS[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
    this.trigger('init', data);
    this.el.view = this;
    this.trigger('inited', data);
  }

  extend(View, Observable, {
    setAttr: function setAttr(key, value) {
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
    },
    setClass: function setClass(key, value) {
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
    },
    setStyle: function setStyle(key, value) {
      if (!this.styles) this.styles = {};

      if (this.styles[key] === value) {
        return;
      }
      this.el.style[key] = value;
      this.styles[key] = value;
    },
    setText: function setText(value) {
      if (this.text === value) {
        return;
      }
      this.el.textContent = value;
      this.text = value;
    },
    setHTML: function setHTML(value) {
      if (this.html === value) {
        return;
      }
      this.el.innerHTML = value;
      this.html = value;
    },
    addListener: function addListener(name, cb, useCapture) {
      var _this = this;

      var listener = {
        name: name,
        cb: cb,
        proxy: function proxy() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          cb.apply(_this, args);
        }
      };
      if (!this.eventListeners) this.eventListeners = [];

      this.eventListeners.push(listener);
      this.el.addEventListener(name, listener.proxy, useCapture);
    },
    removeListener: function removeListener(name, cb) {
      var listeners = this.eventListeners;
      if (!listeners) {
        return;
      }
      if (typeof name === 'undefined') {
        for (var i = 0; i < listeners.length; i++) {
          this.el.removeEventListener(listeners[i].proxy);
        }
        this.listeners = [];
      } else if (typeof cb === 'undefined') {
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i].name === name) {
            listeners.splice(i--, 1);
          }
        }
      } else {
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          if (listener.name === name && cb === listener.cb) {
            listeners.splice(i--, 1);
          }
        }
      }
    },
    addChild: function addChild(child) {
      if (child.views) {
        child.parent = this;
        return this.setChildren.apply(this, child.views);
      }
      if (child.parent) {
        child.trigger('unmount');
        child.trigger('unmounted');
      }
      child.trigger('mount');

      this.el.appendChild(child.el);
      child.parent = this;

      child.trigger('mounted');
    },
    addBefore: function addBefore(child, before) {
      if (child.parent) {
        child.trigger('unmount');
        child.trigger('unmounted');
      }
      child.trigger('mount');

      this.el.insertBefore(child.el, before.el || before);
      child.parent = this;

      child.trigger('mounted');
    },
    setChildren: function setChildren() {
      for (var _len2 = arguments.length, views = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        views[_key2] = arguments[_key2];
      }

      if (views[0].views) {
        views[0].parent = this;
        return this.setChildren.apply(this, views[0].views);
      }
      var traverse = this.el.firstChild;

      for (var i = 0; i < views.length; i++) {
        var view = views[i];

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
        var next = traverse.nextSibling;

        if (traverse.view) {
          traverse.view.parent.removeChild(traverse.view);
        } else {
          this.el.removeChild(traverse);
        }

        traverse = next;
      }
    },
    removeChild: function removeChild(child) {
      if (!child.parent) {
        return;
      }
      child.trigger('unmount');

      this.el.removeChild(child.el);
      child.parent = null;

      child.trigger('unmounted');
    },
    update: function update(data) {
      this.trigger('update', data);
    },
    destroy: function destroy() {
      this.trigger('destroy');
      this.parent.removeChild(this);
      this.off();
      this.removeListener();
    }
  });

  extendable(View);

  var EVENTS$1 = ['init', 'inited', 'mount', 'mounted', 'unmount', 'unmounted', 'sort', 'sorted', 'update', 'updated', 'destroy'].reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  function ViewList(options) {
    ViewList.super.call(this);

    this.views = [];
    this.lookup = {};

    for (var key in options) {
      if (EVENTS$1[key]) {
        this.on(key, options[key]);
      } else {
        this[key] = options[key];
      }
    }
  }

  extend(ViewList, Observable, {
    setViews: function setViews(data) {
      var _parent,
          _this = this;

      var views = new Array(data.length);
      var lookup = {};
      var currentViews = this.views;
      var currentLookup = this.lookup;
      var key = this.key;

      var _loop = function _loop(i) {
        var item = data[i];
        var id = key && item[key];
        var ViewClass = _this.View || View;
        var view = (key ? currentLookup[id] : currentViews[i]) || new ViewClass();

        var _loop2 = function _loop2(j) {
          var name = EVENTS$1[j];
          view.on(name, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this.trigger(name, [view].concat(args));
          });
        };

        for (var j = 0; j < EVENTS$1.length; j++) {
          _loop2(j);
        }

        if (key) lookup[key] = view;

        views[i] = view;
        view.update(item);
      };

      for (var i = 0; i < data.length; i++) {
        _loop(i);
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
      if (this.parent) (_parent = this.parent).setChildren.apply(_parent, views);
    }
  });

  extendable(ViewList);

  exports.el = el;
  exports.Observable = Observable;
  exports.View = View;
  exports.ViewList = ViewList;
  exports.each = each;
  exports.extend = extend;
  exports.extendable = extendable;
  exports.shuffle = shuffle;

}));