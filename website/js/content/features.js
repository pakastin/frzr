
import { el } from '../../../src/index';

export default function () {
  return [
    el('h2', 'Features'),
    el('h3', "It's just HTML + JS"),
    el('p', 'index.html:'),
    el('code-html', `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FRZR example</title>
  </head>
  <body>
    <script src="https://frzr.js.org/frzr.min.js"></script>
    <script src="main.js"></script>
  </body>
</html>
    `),
    el('p', 'main.js:'),
    el('code-js', `
var el = frzr.el;
var mount = frzr.mount;

var hello = el('Hello world!');
mount(document.body, hello);
`),
    el('h3', 'Easy components'),
    el('p', "It's really easy to create components with FRZR"),
    el('code-html', '...'),
    el('p', 'Work in progress...')
  ]
};
