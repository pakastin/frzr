
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
export * from '../index';

View.prototype.render = function () {
  return this.el.render();
}
