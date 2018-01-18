import { parseQuery } from './parseQuery.js';
import { parseArg } from './parseArg.js';

export const h = (query, ...args) => (parent) => {
  const { tagName, id, classNames } = parseQuery(query);
  const element = document.createElement(tagName || 'div');

  if (id) {
    element.id = id;
  }

  for (const className of classNames) {
    element.classList.add(className);
  }

  for (const arg of args) {
    parseArg(element, arg);
  }

  parent.appendChild(element);

  return element;
};
