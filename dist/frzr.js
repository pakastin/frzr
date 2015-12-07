(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.frzr = {}));
}(this, function (exports) { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers;
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

  var Observable = (function () {
    function Observable() {
      babelHelpers.classCallCheck(this, Observable);

      this.listeners = {};
    }

    babelHelpers.createClass(Observable, [{
      key: 'on',
      value: function on(name, cb) {
        if (!this.listeners[name]) this.listeners[name] = [];

        this.listeners[name].push({ cb: cb, one: false });
      }
    }, {
      key: 'one',
      value: function one(name, cb) {
        if (!this.listeners[name]) this.listeners[name] = [];

        this.listeners[name].push({ cb: cb, one: true });
      }
    }, {
      key: 'trigger',
      value: function trigger(name) {
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
      }
    }, {
      key: 'off',
      value: function off(name, cb) {
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
    }]);
    return Observable;
  })();

  var EVENTS$1 = ['init', 'inited', 'update', 'updated', 'destroy'].reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  var Model = (function (_Observable) {
    babelHelpers.inherits(Model, _Observable);

    function Model(options) {
      babelHelpers.classCallCheck(this, Model);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

      for (var key in options) {
        if (EVENTS$1[key]) {
          _this.on(key, options[key]);
        } else {
          _this[key] = options[key];
        }
      }
      _this.trigger('init');
      _this.trigger('inited');
      return _this;
    }

    babelHelpers.createClass(Model, [{
      key: 'update',
      value: function update() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.trigger.apply(this, ['update'].concat(args));
      }
    }]);
    return Model;
  })(Observable);

  Model.extend = function extend(options) {
    return (function (_Model) {
      babelHelpers.inherits(ExtendedModel, _Model);

      function ExtendedModel(data) {
        babelHelpers.classCallCheck(this, ExtendedModel);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedModel).call(this, options, data));
      }

      return ExtendedModel;
    })(Model);
  };

  var EVENTS = ['init', 'inited', 'update', 'updated', 'destroy'].reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  var Collection = (function (_Observable) {
    babelHelpers.inherits(Collection, _Observable);

    function Collection(options) {
      babelHelpers.classCallCheck(this, Collection);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

      _this.models = [];
      _this.lookup = {};

      for (var key in options) {
        if (EVENTS[key]) {
          _this.on(key, options[key]);
        } else {
          _this[key] = options[key];
        }
      }
      return _this;
    }

    babelHelpers.createClass(Collection, [{
      key: 'setModels',
      value: function setModels(data) {
        var _this2 = this;

        var models = new Array(data.length);
        var lookup = {};
        var currentModels = this.models;
        var currentLookup = this.lookup;
        var key = this.key;

        var _loop = function _loop(i) {
          var item = data[i];
          var id = key && item[key];
          var ModelClass = _this2.Model || Model;
          var model = (key ? currentLookup[id] : currentModels[i]) || new ModelClass();

          var _loop2 = function _loop2(j) {
            var name = EVENTS[j];
            model.on(name, function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              _this2.trigger(name, [model].concat(args));
            });
          };

          for (var j = 0; j < EVENTS.length; j++) {
            _loop2(j);
          }

          if (key) lookup[key] = model;

          models[i] = model;
          model.update(item);
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
          for (var i = models.length; i < currentModels.length; i++) {
            currentModels[i].destroy();
          }
        }
        this.models = models;
        this.lookup = lookup;
        this.parent.setChildren(models);
      }
    }]);
    return Collection;
  })(Observable);

  Collection.extend = function extend(options) {
    return (function (_Collection) {
      babelHelpers.inherits(ExtendedCollection, _Collection);

      function ExtendedCollection(data) {
        babelHelpers.classCallCheck(this, ExtendedCollection);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedCollection).call(this, data));
      }

      return ExtendedCollection;
    })(Collection);
  };

  var EVENTS$2 = ['init', 'inited', 'mount', 'mounted', 'unmount', 'unmounted', 'update', 'updated', 'destroy'].reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  var View = (function (_Observable) {
    babelHelpers.inherits(View, _Observable);

    function View(options, data) {
      babelHelpers.classCallCheck(this, View);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(View).call(this));

      for (var key in options) {
        if (EVENTS$2[key]) {
          _this.on(key, options[key]);
        } else {
          _this[key] = options[key];
        }
      }
      _this.el.view = _this;
      _this.trigger('init', data);
      _this.trigger('inited', data);
      return _this;
    }

    babelHelpers.createClass(View, [{
      key: 'setAttr',
      value: function setAttr(key, value) {
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
    }, {
      key: 'setClass',
      value: function setClass(key, value) {
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
    }, {
      key: 'setStyle',
      value: function setStyle(key, value) {
        if (!this.styles) this.styles = {};

        if (this.styles[key] === value) {
          return;
        }
        this.el.style[key] = value;
        this.styles[key] = value;
      }
    }, {
      key: 'setText',
      value: function setText(value) {
        if (this.text === value) {
          return;
        }
        this.el.textContent = value;
        this.text = value;
      }
    }, {
      key: 'setHTML',
      value: function setHTML(value) {
        if (this.html === value) {
          return;
        }
        this.el.innerHTML = value;
        this.html = value;
      }
    }, {
      key: 'addListener',
      value: function addListener(name, cb, useCapture) {
        var _this2 = this;

        var listener = {
          name: name,
          cb: cb,
          proxy: function proxy() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            cb.apply(_this2, args);
          }
        };
        if (!this.eventListeners) this.eventListeners = [];

        this.eventListeners.push(listener);
        this.el.addEventListener(name, listener.proxy, useCapture);
      }
    }, {
      key: 'removeListener',
      value: function removeListener(name, cb) {
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
      }
    }, {
      key: 'addChild',
      value: function addChild(child) {
        if (child.parent) {
          child.trigger('unmount');
          child.trigger('unmounted');
        }
        child.trigger('mount');

        this.el.appendChild(child.el);
        child.parent = this;

        child.trigger('mounted');
      }
    }, {
      key: 'addBefore',
      value: function addBefore(child, before) {
        if (child.parent) {
          child.trigger('unmount');
          child.trigger('unmounted');
        }
        child.trigger('mount');

        this.el.insertBefore(child.el, before.el || before);
        child.parent = this;

        child.trigger('mounted');
      }
    }, {
      key: 'setChildren',
      value: function setChildren() {
        var traverse = this.el.firstChild;

        for (var _len2 = arguments.length, views = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          views[_key2] = arguments[_key2];
        }

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
      }
    }, {
      key: 'removeChild',
      value: function removeChild(child) {
        if (!child.parent) {
          return;
        }
        child.trigger('unmount');

        this.el.removeChild(child.el);
        child.parent = null;

        child.trigger('unmounted');
      }
    }, {
      key: 'update',
      value: function update(data) {
        this.trigger('update', data);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.trigger('destroy');
        this.parent.removeChild(this);
        this.off();
        this.removeListener();
      }
    }]);
    return View;
  })(Observable);

  View.extend = function extend(options) {
    return (function (_View) {
      babelHelpers.inherits(ExtendedView, _View);

      function ExtendedView(data) {
        babelHelpers.classCallCheck(this, ExtendedView);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedView).call(this, options, data));
      }

      return ExtendedView;
    })(View);
  };

  var EVENTS$3 = ['init', 'inited', 'mount', 'mounted', 'unmount', 'unmounted', 'sort', 'sorted', 'update', 'updated', 'destroy'].reduce(function (obj, key) {
    obj[key] = true;
    return obj;
  }, {});

  var ViewList = (function (_Observable) {
    babelHelpers.inherits(ViewList, _Observable);

    function ViewList() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      babelHelpers.classCallCheck(this, ViewList);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ViewList).call(this));

      _this.views = [];
      _this.lookup = {};

      for (var key in options) {
        if (EVENTS$3[key]) {
          _this.on(key, options[key]);
        } else {
          _this[key] = options[key];
        }
      }
      return _this;
    }

    babelHelpers.createClass(ViewList, [{
      key: 'setViews',
      value: function setViews(data) {
        var _this2 = this;

        var views = new Array(data.length);
        var lookup = {};
        var currentViews = this.views;
        var currentLookup = this.lookup;
        var key = this.key;

        var _loop = function _loop(i) {
          var item = data[i];
          var id = key && item[key];
          var ViewClass = _this2.View || View;
          var view = (key ? currentLookup[id] : currentViews[i]) || new ViewClass();

          var _loop2 = function _loop2(j) {
            var name = EVENTS$3[j];
            view.on(name, function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              _this2.trigger(name, [view].concat(args));
            });
          };

          for (var j = 0; j < EVENTS$3.length; j++) {
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
        this.parent.setChildren(views);
      }
    }]);
    return ViewList;
  })(Observable);

  ViewList.extend = function extend(options) {
    return (function (_ViewList) {
      babelHelpers.inherits(ExtendedViewList, _ViewList);

      function ExtendedViewList(data) {
        babelHelpers.classCallCheck(this, ExtendedViewList);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedViewList).call(this, options, data));
      }

      return ExtendedViewList;
    })(ViewList);
  };

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

  exports.el = el;
  exports.Collection = Collection;
  exports.Model = Model;
  exports.Observable = Observable;
  exports.View = View;
  exports.ViewList = ViewList;
  exports.each = each;
  exports.shuffle = shuffle;

}));