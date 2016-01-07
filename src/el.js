
import { eachCSS } from './utils';
import { prefix } from './prefix';

export function el (tagName, attributes) {
  var element = document.createElement(tagName || 'div');

  if (attributes) {
    for (var key in attributes) {
      if (key === 'text') {
        element.textContent = attributes[key];
      } else if (key === 'style') {
        if (frzr.server) {
          for (var styleName in attributes.style) {
            element.style[styleName] = attributes.style[styleName];
          }
        } else {
          element.style = attributes.style;
        }
      } else if (key === 'html') {
        element.innerHTML = attributes[key];
      } else {
        element[key] = attributes[key];
      }
    }
  }
  return element;
}
