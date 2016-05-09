
import { el } from '../../src/index';

import { api } from './api';

var sections = {
  hello: 'Hello',
  features: 'Features'
};

export class Topbar {
  constructor () {
    this.el = el('div', { class: 'topbar' },
      el('div', { class: 'topbar-menu' },
        el('div', { class: 'topbar-menuitem' },
          el('i', { class: 'fa fa-bars' }),
          this.current = el('p')
        )
      )
    );
  }
  update (section, subsection) {
    this.current.textContent = sections[section];
  }
}
