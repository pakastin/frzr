
var each = require('./each')
var eachIn = require('./eachIn')
var ease = require('./ease')

var prefix = require('./prefix')

module.exports = transition

function transition (el, time, settings) {
  eachIn(settings.from, function (value, key) {
    if (value === 'auto') {
      settings.from[key] = window.getComputedStyle(el).getPropertyValue(key)
    }
  })
  eachIn(settings.to, function (value, key) {
    if (value === 'auto') {
      settings.to[key] = window.getComputedStyle(el).getPropertyValue(key)
    }
  })

  settings.from && eachIn(settings.from, function (value, key) {
    el.style[prefix(key)] = value
  })

  settings.delay ? setTimeout(doAnimation, settings.delay * 1000) : doAnimation()

  function doAnimation () {
    window.requestAnimationFrame(function () {
      var _ease = settings.ease ? ' ' + ease[settings.ease] : ''
      settings.remove && el.addEventListener(prefix('transitionend'), onTransitionend)
      el.style[prefix('transition')] = 'all ' + time + 's' + _ease
      eachIn(settings.to, function (value, key) {
        el.style[prefix(key)] = value
      })
    })
  }

  function onTransitionend () {
    each(settings.remove.split(' '), function (key) {
      el.style[prefix(key)] = ''
    })
    settings.onComplete && settings.onComplete()
    el.removeEventListener(prefix('transitionend'), onTransitionend)
  }
}
