
import { el, setChildren } from '../../src/index';
import content from './content/index';

export class Content {
  constructor () {
    this.el = el('div', { class: 'content' });
  }
  update (section, subsection) {
    if (!content[section]) {
      setChildren(this.el, [
        el('h2', 'Sorry'),
        el('p', 'Nothing here (yet?) :('),
        el('p',
          el('a', { href: 'https://github.com/pakastin/frzr/tree/new-website/website/js', target: '_blank' }, 'Maybe you can find out why is that?')
        )
      ]);
      return;
    }
    var currentContent = this[section] || (this[section] = content[section]());

    setChildren(this.el, currentContent);
  }
}
