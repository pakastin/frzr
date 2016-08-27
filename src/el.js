
import { mount } from './index';

var customElements;
var customAttributes;

var slice = Array.prototype.slice;

export function el (tagName, a, b, c) {
  var len = arguments.length;

  if (customElements && tagName in customElements) {
    var customElement = customElements[tagName];

    return len === 1 ? customElement(tagName)
         : len === 2 ? customElement(tagName, a)
         : len === 3 ? customElement(tagName, a, b)
         : len === 4 ? customElement(tagName, a, b, c)
         :             customElement.apply(this, slice.call(arguments));
  }

  if (typeof tagName === 'function') {
    return len === 1 ? new tagName()
         : len === 2 ? new tagName(a)
         : len === 3 ? new tagName(a, b)
         : len === 4 ? new tagName(a, b, c)
         :             new (tagName.bind.apply(tagName, slice.call(arguments)));
  }

  var element = document.createElement(tagName);
  var isEmpty = true;

  for (var i = 1; i < len; i++) {
    var arg = arguments[i];
    if (arg == null) continue;

    if (isEmpty && (typeof arg === 'string' || typeof arg === 'number')) {
      element.textContent = arg;
      isEmpty = false;
      continue;
    }

    if (mount(element, arg)) {
      isEmpty = false;
      continue;
    }

    for (var attr in arg) {
      if (attr in element && attr !== 'style') {
        element[attr] = arg[attr];
      } else if (customAttributes && attr in customAttributes) {
        customAttributes[attr](element, arg[attr]);
      } else {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}

el.extend = function (tagName) {
  return el.bind(this, tagName);
}

export function registerElement (tagName, handler) {
  (customElements || (customElements = {}))[tagName] = handler;
}

export function registerAttribute (attr, handler) {
  (customAttributes || (customAttributes = {}))[attr] = handler;
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
