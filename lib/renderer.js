
import {Observable} from './observable'

var ticking = []
var requestAnimationFrame = window.requestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }

export var renderer = new Observable()

export function batchAnimationFrame (cb) {
  if (!ticking.length) {
    renderer.trigger('render')
    requestAnimationFrame(tick)
  }
  ticking.push(cb)
}

function tick () {
  var cbs = ticking.splice(0, ticking.length)
  for (var i = 0, len = cbs.length; i < len; i++) {
    cbs[i]()
  }
  if (ticking.length === 0) {
    renderer.trigger('rendered')
    return
  }
  tick()
}
