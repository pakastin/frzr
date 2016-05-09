
import { el, setChildren } from '../../src/index';
import content from './content/index';

export class Content {
  constructor () {
    this.el = el('div', { class: 'content' });
  }
  update (section, subsection) {
    if (!content[section]) {
      setChildren(this.el, [
        el('404 - not found')
      ]);
      return;
    }
    var currentContent = this[section] || (this[section] = content[section]());

    setChildren(this.el, currentContent);
  }
}
