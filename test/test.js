/* global frzr */

var View = frzr.View

var view = new View({
  el: 'p',
  class: 'test',
  style: {
    color: 'red'
  },
  text: 'Testing',
  $root: document.body
})

setTimeout(function () {
  view.style({
    color: 'blue'
  })
  view.class({
    test: false
  })
  view.text('Works!')
}, 1000)
