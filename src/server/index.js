
import { HTMLElement } from './htmlelement';

global.document = {
  createElement (tagName) {
    return new HTMLElement({
      tagName: tagName
    });
  }
};

global.window = {}

global.navigator = {
  userAgent: ''
}

import { View } from '../index';

export var server = true;
export { ease, el, prefix, view, View, viewList, ViewList, Animation, Observable, define, each, extend, extendable, inherits, shuffle, translate, baf, raf } from '../index';

View.prototype.render = function () {
  return this.el.render();
}
