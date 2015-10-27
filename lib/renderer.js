
import {Observable} from './observable'
import requestAnimationFrame from './raf'

var ticking = []
// very simple polyfill for requestAnimationFrame

export var renderer = new Observable()

export function batchAnimationFrame (cb) {
  // batchAnimationFrame collects multiple requestAnimationFrame calls to a single call
  if (!ticking.length) {
    // render cycle starts
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
    // render cycle ends
    renderer.trigger('rendered')
    return
  }
  tick()
}
