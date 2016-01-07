
import { eachCSS } from './utils';
import { prefix } from './prefix';

export function el (tagName, attributes) {
  var element = document.createElement(tagName || 'div');

  if (attributes) {
    for (var key in attributes) {
      if (key === 'text') {
        element.textContent = attributes[key];
      } else if (key === 'style') {
        var styles = attributes.style.split(';');
        for (var i = 0; i < styles.length; i++) {
          var styleParts = styles[i].split(':');
          if (styleParts.length > 1) {
            element.style[styleParts[0].trim()] = styleParts[1].trim();
          }
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
