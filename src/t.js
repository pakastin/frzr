import { parseArg } from './parseArg.js';

export const t = (text, ...args) => {
  for (const arg of args) {
    parseArg(text, arg);
  }

  return document.createTextNode(text);
};
