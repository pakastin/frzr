
import { Topbar } from './topbar';
import { Content } from './content';
import { OverlayTopbar } from './overlay-topbar';
import { el, mount, unmount, registerElement, setChildren } from '../../src/index';
import { api } from './api';

function code (lang) {
  return function (tagName, content) {
    return el('pre', { class: 'code' },
      el('code', { innerHTML: Prism.highlight(content.trim(), Prism.languages[lang]) })
    );
  }
}

registerElement('code-html', code('markup'));
registerElement('code-js', code('javascript'));

var logo = el('h1',
  el('b', 'FRZR'),
  ' - tiny view library'
);
var topbar = new Topbar();
var content = new Content();
var overlayTopbar = new OverlayTopbar();

var container = el('div', { class: 'container' },
  logo,
  topbar,
  content
);

logo.onclick = () => {
  location.hash = '#/hello';
}

api.on('section', function (section) {
  topbar.update(section);
  content.update(section);
});

api.on('topbar open', function () {
  overlayTopbar.topbarBCR = topbar.el.getBoundingClientRect();
  mount(document.body, overlayTopbar);
  topbar.el.style.opacity = 0;
});

api.on('topbar close', function () {
  overlayTopbar.topbarBCR = topbar.el.getBoundingClientRect();
  overlayTopbar.close();
});

api.on('topbar closed', function () {
  unmount(document.body, overlayTopbar);
  topbar.el.style.opacity = 1;
});

api.trigger('section', 'hello');

mount(document.body, container);

window.addEventListener('hashchange', onHash);

onHash();

function onHash () {
  var hash = location.hash.slice(2).split('/');
  var section = hash[0];
  api.trigger('section', section || 'hello');
}
