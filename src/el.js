
import { eachCSS } from './utils';
import { prefix } from './prefix';

/**
 * HTMLElement helper
 * @param  {String} [tagName='div'] HTMLElement tag name
 * @param  {Object} [attributes={}]   attributes/text/HTML
 * @return {HTMLElement}         Returns pure HTMLElement
 */
export function el (tagName = 'div', attributes = {}) {
  const _el = document.createElement(tagName);

  for (const key in attributes) {
    if (key === 'text') {
      _el.textContent = attributes[key];
    } else if (key === 'html') {
      _el.innerHTML = attributes[key];
    } else if (key === 'style') {
      eachCSS(attributes.style, (propertyName, value) => {
        const prefixedProperty = prefix(propertyName);

        _el.style[prefixedProperty] = value;
      });
    } else {
      _el[key] = attributes[key];
    }
  }
  return _el;
}
