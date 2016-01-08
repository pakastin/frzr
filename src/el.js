
import { eachCSS } from './utils';
import { prefix } from './prefix';

export function el (tagName, attributes) {
  attributes = attributes || {};
  if (tagName === 'text') {
    var element = document.createTextNode(attributes.text || attributes.textContent || '');
  } else if (attributes.svg) {
    var element =  document.createElementNS("http://www.w3.org/2000/svg", "svg")
  } else {
    var element = document.createElement(tagName || 'div');
  }

  for (var key in attributes) {
    if (key === 'text') {
      element.textContent = attributes.text;
    } else if (key === 'svg') {
      continue;
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
  return element;
}
