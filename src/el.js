
import { text, mount, List } from './index';

var customElements;
var customAttributes;

export function el (tagName) {
  if (customElements) {
    var customElement = customElements[tagName];

    if (customElement) {
      return customElement.apply(this, arguments);
    }
  }

  var element = document.createElement(tagName);

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
