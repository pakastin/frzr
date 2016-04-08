
import { text, mount, List } from './index';

export function svg (tagName) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    }

    var isPrimitive = typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean';

    if (isPrimitive || ((arg.el || arg) instanceof Node) || (arg instanceof List)) {
      if (isPrimitive) {
        mount(element, text(arg));
      } else {
        mount(element, arg);
      }
    } else {
      for (var attr in arg) {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}
