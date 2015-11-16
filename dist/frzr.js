'use strict';

var frzr = (function () {
  'use strict';

  // This is just a very basic inheritable Observable class, like node.js's but with jQuery's API style

  function Observable(data) {
    this.listeners = {};
    for (var key in data) {
      this[key] = data[key];
    }
  }

  Observable.prototype.on = function (name, cb, ctx, once) {
    this.listeners[name] || (this.listeners[name] = []);
    this.listeners[name].push({
      once: once || false,
      cb: cb,
      ctx: ctx
    });
  };

  Observable.prototype.one = function (name, cb, ctx) {
    this.on(name, cb, ctx, true);
  };

  Observable.prototype.off = function (name, cb, ctx) {
    if (typeof name === 'undefined') {
      this.listeners = {};
      return;
    }
    if (typeof cb === 'undefined') {
      this.listeners[name] = [];
      return;
    }
    var listeners = this.listeners[name];
    if (!listeners) {
      return;
    }
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (ctx) {
        if (listeners[i].ctx === ctx) {
          listeners.splice(i--, 1);
          len--;
        }
        continue;
      }
      if (listeners[i].cb === cb) {
        listeners.splice(i--, 1);
        len--;
      }
    }
  };

  Observable.prototype.trigger = function (name) {
    var listeners = this.listeners[name];
    var len = arguments.length - 1;
    var args = new Array(len);

    // V8 optimization
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments

    for (var i = 0; i < len; i++) {
      args[i] = arguments[i + 1];
    }

    if (!listeners) {
      return;
    }

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener.cb.apply(listener.ctx || this, args);
      if (listener.once) {
        listeners.splice(i--, 1);
        len--;
      }
    }
  };

  function each(array, iterator) {
    var len = array.length;

    for (var i = 0; i < len; i++) {
      iterator(array[i], i, len);
    }
  }

  function filter(array, iterator) {
    var results = [];
    var len = array.length;

    for (var i = 0; i < len; i++) {
      var item = array[i];
      iterator(item, i, len) && results.push(item);
    }

    return results;
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

  function map(array, iterator) {
    var len = array.length;
    var results = new Array(len);

    for (var i = 0; i < len; i++) {
      results[i] = iterator(array[i], i, len);
    }

    return results;
  }

  function inherits(targetClass, superClass) {
    targetClass['super'] = superClass;
    targetClass.prototype = Object.create(superClass.prototype, {
      constructor: {
        configurable: true,
        value: targetClass,
        writable: true
      }
    });
  }

  var ease = { linear: linear, quadIn: quadIn, quadOut: quadOut, quadInOut: quadInOut, cubicIn: cubicIn, cubicOut: cubicOut, cubicInOut: cubicInOut, quartIn: quartIn, quartOut: quartOut, quartInOut: quartInOut, quintIn: quintIn, quintOut: quintOut, quintInOut: quintInOut, bounceIn: bounceIn, bounceOut: bounceOut, bounceInOut: bounceInOut };

  function linear(t) {
    return t;
  }

  function quadIn(t) {
    return Math.pow(t, 2);
  }

  function quadOut(t) {
    return 1 - quadIn(1 - t);
  }

  function quadInOut(t) {
    if (t < 0.5) {
      return quadIn(t * 2) / 2;
    }
    return 1 - quadIn((1 - t) * 2) / 2;
  }

  function cubicIn(t) {
    return Math.pow(t, 3);
  }

  function cubicOut(t) {
    return 1 - cubicIn(1 - t);
  }

  function cubicInOut(t) {
    if (t < 0.5) {
      return cubicIn(t * 2) / 2;
    }
    return 1 - cubicIn((1 - t) * 2) / 2;
  }

  function quartIn(t) {
    return Math.pow(t, 4);
  }

  function quartOut(t) {
    return 1 - quartIn(1 - t);
  }

  function quartInOut(t) {
    if (t < 0.5) {
      return quartIn(t * 2) / 2;
    }
    return 1 - quartIn((1 - t) * 2) / 2;
  }

  function quintIn(t) {
    return Math.pow(t, 5);
  }

  function quintOut(t) {
    return 1 - quintOut(1 - t);
  }

  function quintInOut(t) {
    if (t < 0.5) {
      return quintIn(t * 2) / 2;
    }
    return 1 - quintIn((1 - t) * 2) / 2;
  }

  function bounceOut(t) {
    var s = 7.5625;
    var p = 2.75;

    if (t < 1 / p) {
      return s * t * t;
    }
    if (t < 2 / p) {
      t -= 1.5 / p;
      return s * t * t + 0.75;
    }
    if (t < 2.5 / p) {
      t -= 2.25 / p;
      return s * t * t + 0.9375;
    }
    t -= 2.625 / p;
    return s * t * t + 0.984375;
  }

  function bounceIn(t) {
    return 1 - bounceOut(1 - t);
  }

  function bounceInOut(t) {
    if (t < 0.5) {
      return bounceIn(t * 2) / 2;
    }
    return 1 - bounceIn((1 - t) * 2) / 2;
  }

  var requestAnimationFrame = window.requestAnimationFrame || function (cb) {
    setTimeout(cb, 1000 / 60);
  };

  var animations = [];
  var ticking = undefined;

  function Animation(_ref) {
    var _ref$delay = _ref.delay;
    var delay = _ref$delay === undefined ? 0 : _ref$delay;
    var _ref$duration = _ref.duration;
    var duration = _ref$duration === undefined ? 0 : _ref$duration;
    var easing = _ref.easing;
    var start = _ref.start;
    var progress = _ref.progress;
    var end = _ref.end;

    Animation['super'].call(this);

    var now = Date.now();

    // calculate animation start/end times
    this.startTime = now + delay;
    this.endTime = this.startTime + duration;
    this.easing = ease[easing] || ease['quadOut'];

    this.started = false;

    start && this.on('start', start);
    progress && this.on('progress', progress);
    end && this.on('end', end);

    // add animation
    animations.push(this);

    if (!ticking) {
      // start ticking
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  inherits(Animation, Observable);

  Animation.prototype.destroy = function () {
    for (var i = 0; i < animations.length; i++) {
      if (animations[i] === this) {
        animations.splice(i, 1);
        return;
      }
    }
  };

  function tick() {
    var now = Date.now();

    if (!animations.length) {
      // stop ticking
      ticking = false;
      return;
    }

    for (var i = 0; i < animations.length; i++) {
      var animation = animations[i];

      if (now < animation.startTime) {
        // animation not yet started..
        continue;
      }
      if (!animation.started) {
        // animation starts
        animation.started = true;
        animation.trigger('start');
      }
      // animation progress
      var t = (now - animation.startTime) / (animation.endTime - animation.startTime);
      if (t > 1) {
        t = 1;
      }
      animation.trigger('progress', animation.easing(t), t);
      if (now > animation.endTime) {
        // animation ended
        animation.trigger('end');
        animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(tick, true);
  }

  function element(type, attrs) {
    // Just a simple helper for creating DOM elements
    var $el = document.createElement(type);

    if (typeof attrs !== 'undefined') {
      for (var attr in attrs) {
        $el.setAttribute(attr, attrs[attr]);
      }
    }

    return $el;
  }

  function SVGelement(type, attrs) {
    // Just a simple helper for creating SVG DOM elements
    var $el = document.createElementNS('http://www.w3.org/2000/svg', type);

    if (typeof attrs !== 'undefined') {
      for (var attr in attrs) {
        $el.setAttribute(attrs, attrs[attr]);
      }
    }

    return $el;
  }

  var ticking$1 = [];
  // very simple polyfill for requestAnimationFrame

  var renderer = new Observable();

  function batchAnimationFrame(cb) {
    // batchAnimationFrame collects multiple requestAnimationFrame calls to a single call
    if (!ticking$1.length) {
      // render cycle starts
      renderer.trigger('render');
      requestAnimationFrame(tick$1);
    }
    ticking$1.push(cb);
  }

  function tick$1() {
    var cbs = ticking$1.splice(0, ticking$1.length);
    for (var i = 0, len = cbs.length; i < len; i++) {
      cbs[i]();
    }
    if (ticking$1.length === 0) {
      // render cycle ends
      renderer.trigger('rendered');
      return;
    }
    tick$1();
  }

  var style = document.createElement('p').style;
  var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
  var memoized = {};

  function prefix(param) {
    if (typeof memoized[param] !== 'undefined') {
      return memoized[param];
    }

    if (typeof style[param] !== 'undefined') {
      memoized[param] = param;
      return param;
    }

    var camelCase = param[0].toUpperCase() + param.slice(1);

    for (var i = 0, len = prefixes.length; i < len; i++) {
      var test = prefixes[i] + camelCase;
      if (typeof style[test] !== 'undefined') {
        memoized[param] = test;
        return test;
      }
    }
  }

  var has3d = undefined;

  function translate(a, b, c) {
    typeof has3d !== 'undefined' || (has3d = check3d());

    c = c || 0;

    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }

  function check3d() {
    // I admit, this line is stealed from the great Velocity.js!
    // http://julian.com/research/velocity/
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      return false;
    }

    var transform = prefix('transform');
    var $p = document.createElement('p');

    document.body.appendChild($p);
    $p.style[transform] = 'translate3d(1px,1px,1px)';

    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== 'none';

    document.body.removeChild($p);

    return has3d;
  }

  function View(options) {
    var isView = this instanceof View;

    if (!isView) {
      return new View(options);
    }

    View['super'].call(this); // init Observable

    this.$el = options && options.svg ? SVGelement(options.el || 'svg') : element(options.el || 'div');

    this.data = {};

    this._attrs = {};
    this._class = {};
    this._style = {};
    this._text = '';

    options && this.opt(options, null, true);
    this.trigger('init', this);
    options.data && this.set(options.data);
    this.trigger('inited', this);
  }

  inherits(View, Observable);

  View.extend = function (superOptions) {
    return function ExtendedView(options) {
      if (!options) {
        return new View(superOptions);
      }
      var currentOptions = {};

      for (var key in superOptions) {
        currentOptions[key] = superOptions[key];
      }
      for (var key in options) {
        currentOptions[key] = options[key];
      }
      return new View(currentOptions);
    };
  };

  View.prototype.mount = function (target) {
    var _this = this;

    if (this.parent) {
      // If already have parent, remove parent listeners first
      this.parent.off('mount', onParentMount, this);
      this.parent.off('mounted', onParentMounted, this);
    }

    if (this.$root) {
      this.trigger('unmount');
      this.trigger('unmounted');
    }

    if (target instanceof View) {
      this.parent = target;
      this.$root = target.$el;
    } else {
      this.$root = target;
    }

    batchAnimationFrame(function () {
      if (_this.parent) {
        _this.parent.on('mount', onParentMount, _this);
        _this.parent.on('mounted', onParentMounted, _this);
      }
      _this.trigger('mount');
      _this.$root.appendChild(_this.$el);
      _this.trigger('mounted');
    });
  };

  function onParentMount() {
    this.trigger('parentmount');
  }

  function onParentMounted() {
    this.trigger('parentmounted');
  }

  View.prototype.unmount = function () {
    var _this2 = this;

    var $el = this.$el;

    if (!this.$root) {
      return;
    }

    if (this.parent) {
      this.parent.off('mount', onParentMount, this);
      this.parent.off('mounted', onParentMounted, this);
    }

    batchAnimationFrame(function () {
      _this2.trigger('unmount');
      _this2.$root.removeChild($el);
      _this2.$root = null;
      _this2.parent = null;
      _this2.trigger('unmounted');
    });
  };

  View.prototype.destroy = function () {
    this.trigger('destroy');
    this.off();
    this.unmount();
    this.trigger('destroyed');
  };

  View.prototype.mountBefore = function (target, before) {
    var $el = this.$el;

    this.$root = target;

    batchAnimationFrame(function () {
      target.insertBefore($el, before);
    });
  };

  View.prototype.set = function (key, value) {
    var _this3 = this;

    var data = {};

    if (typeof key === 'string') {
      data[key] = value;
    } else if (key != null) {
      data = key;
    }

    batchAnimationFrame(function () {
      _this3.trigger('render');
    });
    this.trigger('update', data);

    for (var _key in data) {
      this.data[_key] = data[_key];
    }

    this.trigger('updated');
    batchAnimationFrame(function () {
      _this3.trigger('rendered');
    });
  };

  View.prototype.opt = function (key, value, skipData) {
    var options = {};

    if (typeof key === 'undefined') {
      return;
    }

    if (typeof key === 'string') {
      options[key] = value;
    } else if (key != null) {
      options = key;
    }

    for (var _key2 in options) {
      if (_key2 === 'attr') {
        this.attr(options.attr);
      } else if (_key2 === 'href') {
        this.attr({
          href: options.href
        });
      } else if (_key2 === 'id') {
        this.attr({
          id: options.id
        });
      } else if (_key2 === 'data') {
        if (!skipData) {
          this.set(options.data);
        }
      } else if (_key2 === 'style') {
        if (typeof options.style === 'string') {
          this.attr({
            style: options.style
          });
          continue;
        }
        this.style(options.style);
      } else if (_key2 === 'class') {
        if (typeof options['class'] === 'string') {
          this.attr({
            'class': options['class']
          });
          continue;
        }
        this['class'](options['class']);
      } else if (_key2 === 'text') {
        this.text(options.text);
      } else if (_key2 === 'listen') {
        this.listen(options.listen);
      } else if (_key2 === 'init') {
        this.on('init', options.init);
      } else if (_key2 === 'update') {
        this.on('update', options.update);
      } else if (_key2 === 'mount') {
        this.on('mount', options.mount);
      } else if (_key2 === 'mounted') {
        this.on('mounted', options.mounted);
      } else if (_key2 === 'unmount') {
        this.on('unmount', options.unmount);
      } else if (_key2 === 'unmounted') {
        this.on('unmounted', options.unmounted);
      } else if (_key2 === 'destroy') {
        this.on('destroy', options.destroy);
      } else if (_key2 === 'parent') {
        this.mount(options.parent);
      } else if (_key2 === '$root') {
        this.mount(options.$root);
      } else {
        this[_key2] = options[_key2];
      }
    }
  };

  View.prototype.text = function (text) {
    var _this4 = this;

    var $el = this.$el;

    if (text !== this._text) {
      this._text = text;

      batchAnimationFrame(function () {
        if (text === _this4._text) {
          $el.textContent = text;
        }
      });
    }
  };

  View.prototype.listen = function (key, value) {
    var _this5 = this;

    var $el = this.$el;

    var listeners = {};
    if (typeof key === 'string') {
      listeners[key] = value;
    } else if (key != null) {
      listeners = key;
    }

    var _loop = function (_key3) {
      value = listeners[_key3];
      _this5.on(_key3, value);
      $el.addEventListener(_key3, function (e) {
        _this5.trigger(_key3, e);
      });
    };

    for (var _key3 in listeners) {
      _loop(_key3);
    }
  };

  View.prototype['class'] = function (key, value) {
    var _this6 = this;

    var $el = this.$el;
    var classes = {};

    if (typeof key === 'string') {
      classes[key] = value;
    } else if (key != null) {
      classes = key;
    }

    var _loop2 = function (_key4) {
      value = classes[_key4];
      if (_this6._class[_key4] !== value) {
        _this6._class[_key4] = value;
        batchAnimationFrame(function () {
          if (_this6._class[_key4] === value) {
            if (value) {
              $el.classList.add(_key4);
            } else {
              $el.classList.remove(_key4);
            }
          }
        });
      }
    };

    for (var _key4 in classes) {
      _loop2(_key4);
    }
  };

  View.prototype.style = function (key, value) {
    var _this7 = this;

    var $el = this.$el;
    var style = {};

    if (typeof key === 'string') {
      style[key] = value;
    } else if (key != null) {
      style = key;
    }

    var _loop3 = function (_key5) {
      value = style[_key5];
      if (_this7._style[_key5] !== value) {
        _this7._style[_key5] = value;
        batchAnimationFrame(function () {
          if (_this7._style[_key5] === style[_key5]) {
            $el.style[_key5] = value;
          }
        });
      }
    };

    for (var _key5 in style) {
      _loop3(_key5);
    }
  };

  View.prototype.attr = function (key, value) {
    var _this8 = this;

    var $el = this.$el;
    var currentAttrs = this._attrs;
    var attrs = {};

    if (typeof key === 'string') {
      attrs[key] = value;
    } else if (key != null) {
      attrs = key;
    }

    var _loop4 = function (attr) {
      value = attrs[attr];
      if (value !== currentAttrs[attr]) {
        _this8._attrs[attr] = value;

        if (value === _this8._attrs[attr]) {
          batchAnimationFrame(function () {
            if (value === _this8._attrs[attr]) {
              if (value === false || value == null) {
                $el.removeAttribute(attr);
                return;
              }
              $el.setAttribute(attr, value);

              if (attr === 'autofocus') {
                if (value) {
                  $el.focus();
                  _this8.on('mounted', onAutofocus);
                  _this8.on('parentmounted', onAutofocus, _this8);
                } else {
                  _this8.off('mounted', onAutofocus);
                  _this8.off('parentmounted', onAutofocus, _this8);
                }
              }
            }
          });
        }
      }
    };

    for (var attr in attrs) {
      _loop4(attr);
    }
  };

  function onAutofocus() {
    this.$el.focus();
  }

  function Views(ChildView, options) {
    var isViews = this instanceof Views;

    if (!isViews) {
      return new Views(ChildView, options);
    }

    this.view = new View(options);
    this.views = [];
    this.lookup = {};
    this.ChildView = ChildView || View;
  }

  inherits(Views, Observable);

  Views.prototype.mount = function (target) {
    this.view.mount(target);
  };

  Views.prototype.mountBefore = function (target, before) {
    this.view.mountBefore(target, before);
  };

  Views.prototype.unmount = function () {
    this.view.unmount();
  };

  Views.prototype.reset = function (data, key) {
    var ChildView = this.ChildView;

    var views = new Array(data.length);
    var lookup = {};
    var currentLookup = this.lookup;

    for (var i = 0, len = data.length, id = undefined, view = undefined; i < len; i++) {
      var item = data[i];

      id = key ? item[key] : i;
      view = currentLookup[id];

      if (!view) {
        view = new ChildView({ parent: this.view });
      }

      lookup[id] = view;
      view.set(item);
      views[i] = view;
    }
    for (var id in currentLookup) {
      if (!lookup[id]) {
        currentLookup[id].destroy();
      }
    }
    this.views = views;
    this.lookup = lookup;
    this.reorder();
  };

  Views.prototype.reorder = function () {
    var _this9 = this;

    var $root = this.view.$el;

    batchAnimationFrame(function () {
      var traverse = $root.firstChild;

      for (var i = 0, len = _this9.views.length; i < len; i++) {
        var view = _this9.views[i];

        if (traverse === view.$el) {
          traverse = traverse.nextSibling;
          return;
        }
        if (traverse) {
          view.$root = $root;
          $root.insertBefore(view.$el, traverse);
        } else {
          view.$root = $root;
          $root.appendChild(view.$el);
        }
      }
      while (traverse) {
        var next = traverse.nextSibling;
        $root.removeChild(traverse);
        traverse = next;
      }
    });
  };

  var bundle = {
    Animation: Animation,
    batchAnimationFrame: batchAnimationFrame,
    each: each,
    element: element,
    filter: filter,
    inherits: inherits,
    map: map,
    shuffle: shuffle,
    prefix: prefix,
    renderer: renderer,
    translate: translate,
    Observable: Observable,
    SVGelement: SVGelement,
    View: View,
    Views: Views
  };

  return bundle;
})();
