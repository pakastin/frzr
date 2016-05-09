
import { el } from '../../src/index';
import { api } from './api';

var inOutQuart = 'cubic-bezier(0.645, 0.045, 0.355, 1.000)';

var sections = {
  hello: 'Hello',
  features: 'Features'
};

export class OverlayTopbar {
  constructor () {
    this.el = el('div', { class: 'overlay' },
      this.bg = el('div', { class: 'bg' }),
      el('div', { class: 'container' },
        this.h1 = el('h1',
          el('b', 'FRZR'),
          ' - tiny view library'
        ),
        el('div', { class: 'topbar' },
          this.topbarBg = el('div', { class: 'topbar-bg' }),
          el('div', { class: 'topbar-container' },
            this.menu = el('div', { class: 'topbar-menu' },
              el('div', { onclick: goto('hello'), class: 'topbar-menuitem' },
                el('p', 'Hello')
              ),
              el('div', { onclick: goto('features'), class: 'topbar-menuitem' },
                el('p', 'Features')
              ),
              el('div', { onclick: goto('api'), class: 'topbar-menuitem' },
                el('p', 'API docs')
              ),
              el('div', { onclick: goto('download'), class: 'topbar-menuitem' },
                el('p', 'Download')
              ),
              el('div', { onclick: goto('source'), class: 'topbar-menuitem' },
                el('p', 'Source')
              )
            )
          )
        )
      )
    );
    this.el.onclick = () => {
      api.trigger('topbar close');
    }
  }
  mounted () {
    var topbarBCR = this.topbarBCR;
    var menuBCR = this.menu.getBoundingClientRect();
    var scale = [topbarBCR.width / menuBCR.width, topbarBCR.height / menuBCR.height].join(',');
    var translate = [0, -menuBCR.height].join('px,');

    this.topbarBg.style.height = menuBCR.height + 'px';

    this.menu.style.transition = '';
    this.menu.style.transform = 'translate(' + translate + 'px)';

    this.bg.style.transition = '';
    this.bg.style.opacity = 0;

    this.topbarBg.style.transition = '';
    this.topbarBg.style.transform = 'scale(' + scale + ')';
    this.topbarBg.style.transformOrigin = '0 0';

    requestAnimationFrame(() => {
      this.bg.style.transition = `opacity .3s ${inOutQuart}`;
      this.bg.style.opacity = 1;

      this.topbarBg.style.transition = `.3s transform ${inOutQuart}`;
      this.menu.style.transition = `.3s transform ${inOutQuart}`;

      this.topbarBg.style.transform = '';
      this.menu.style.transform = '';
    });
  }
  close () {
    var topbarBCR = this.topbarBCR;
    var menuBCR = this.menu.getBoundingClientRect();
    var scale = [topbarBCR.width / menuBCR.width, topbarBCR.height / menuBCR.height].join(',');
    var translate = [0, -menuBCR.height].join('px,');

    this.bg.style.opacity = 0;
    this.topbarBg.style.transform = 'scale(' + scale + ')'
    this.menu.style.transform = 'translate(' + translate + 'px)';

    setTimeout(() => {
      api.trigger('topbar closed');
    }, 300);
  }
}

function close () {
  api.trigger('topbar close');
}

function goto (section) {
  return function () {
    location.hash = '#/' + section;
  }
}
