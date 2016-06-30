
import { text, mount, List } from './index';

export function svg (tagName) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    } else if (mount(element, arg)) {
      continue;
    } else if (typeof arg === 'object') {
      for (var attr in arg) {
        var value = arg[attr];

        if (typeof value === 'function') {
          element[attr] = value;
        } else {
          element.setAttribute(attr, value);
        }
      }
    }
  }

  return element;
}
