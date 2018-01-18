import { t } from './t.js';

export const parseArg = (element, arg) => {
  const { Node } = window;

  if (arg instanceof Node) {
    element.appendChild(arg);
  } else if (arg instanceof Array) {
    for (let i = 0; i < arg.length; i++) {
      parseArg(element, arg[i]);
    }
  } else if (typeof arg === 'string') {
    element.appendChild(t(arg));
  } else if (typeof arg === 'function') {
    parseArg(element, arg(element));
  }
};
