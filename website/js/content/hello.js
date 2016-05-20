
import { el } from '../../../src/index';
import { api } from '../api';

export default function () {
  return [
    el('h2', 'Hello FRZR'),

    el('p', "Web development has gone mad. To get even started with today's frameworks, at worst you need to install huge loads of dependencies, learn all kinds of weird abstractions and just a hello world app weighs hundreds of kilobytes."),

    el('p', "FRZR is here to cool us down. The whole view library only weighs 2 KB and it's ", el('a', { href: 'https://youtu.be/0nh2EK1xveg', target: '_blank' }, 'possible to teach in 30 minutes how it works under the hood'), ". There's as few abstractions as possible. You don't need to install anything to get started. You only need to know HTML and Javascript, that's it."),

    el('p',
      el('a', { href: '#/features' }, "Wow, FRZR is really small. What features do I get?")
    )
  ];
}

function goto (section) {
  return function () {
    api.trigger('section', section);
  }
}
