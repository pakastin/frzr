
import { mount } from './index';

var customElements;
var customAttributes;

export function el (tagName) {
  if (customElements) {
    var customElement = customElements[tagName];

    var args = new Array(arguments);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    if (customElement) {
      return customElement.apply(this, args);
    }
  }

  if (typeof tagName === 'function') {
    var args = new Array(arguments.length);
    args[0] = this;
    for (var i = 1; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    return new (Function.prototype.bind.apply(tagName, args));
  } else {
    var element = document.createElement(tagName);
  }

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    } else if (mount(element, arg)) {
      continue;
    } else if (typeof arg === 'object') {
      for (var attr in arg) {
        if (customAttributes) {
          var customAttribute = customAttributes[attr];
          if (customAttribute) {
            customAttribute(element, arg[attr]);
            continue;
          }
        }
        var value = arg[attr];
        if (attr === 'style' || (element[attr] == null && typeof value != 'function')) {
          element.setAttribute(attr, value);
        } else {
          element[attr] = value;
        }
      }
    }
  }

  return element;
}

el.extend = function (tagName) {
  return function (a, b, c, d, e, f) {
    var len = arguments.length;

    switch (len) {
      case 0: return el(tagName);
      case 1: return el(tagName, a);
      case 2: return el(tagName, a, b);
      case 3: return el(tagName, a, b, c);
      case 4: return el(tagName, a, b, c, d);
      case 5: return el(tagName, a, b, c, d, e);
      case 6: return el(tagName, a, b, c, d, e, f);
    }

    var args = new Array(len + 1);
    var arg, i = 0;

    args[0] = tagName;

    while (i < len) {
        // args[1] = arguments[0] and so on
        arg = arguments[i++];
        args[i] = arg;
    }

    return el.apply(this, args);
  }
}

export function registerElement (tagName, handler) {
  customElements || (customElements = {});
  customElements[tagName] = handler;
}

export function registerAttribute (attr, handler) {
  customAttributes || (customAttributes = {});
  customAttributes[attr] = handler;
}

export function unregisterElement (tagName) {
  if (customElements && customElements[tagName]) {
    delete customElements[tagName];
  }
}

export function unregisterAttribute (attr) {
  if (customAttributes && customAttributes[attr]) {
    delete customAttributes[attr];
  }
}
