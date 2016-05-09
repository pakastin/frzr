
import { Topbar } from './topbar';
import { Content } from './content';
import { el, mount, registerElement } from '../../src/index';
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

api.trigger('section', 'hello');

mount(document.body, container);

window.addEventListener('hashchange', onHash);

onHash();

function onHash () {
  var hash = location.hash.slice(2).split('/');
  var section = hash[0];
  api.trigger('section', section || 'hello');
}
