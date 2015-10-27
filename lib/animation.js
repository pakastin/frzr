
import {Observable} from './observable'
import {inherits} from './utils'
import ease from './ease'
import requestAnimationFrame from './raf'

var ticking
var animations = []

export function Animation ({delay = 0, duration = 0, easing, start, progress, end}) {
  Animation.super.call(this)

  var now = Date.now()

  // calculate animation start/end times
  this.startTime = now + delay
  this.endTime = this.startTime + duration
  this.easing = ease[easing] || ease['quadOut']

  this.started = false

  start && this.on('start', start)
  progress && this.on('progress', progress)
  end && this.on('end', end)

  // add animation
  animations.push(this)

  if (!ticking) {
    // start ticking
    ticking = true
    requestAnimationFrame(tick)
  }
}

inherits(Animation, Observable)

Animation.prototype.destroy = function () {
  for (var i = 0; i < animations.length; i++) {
    if (animations[i] === this) {
      animations.splice(i, 1)
      return
    }
  }
}

function tick () {
  var now = Date.now()

  if (!animations.length) {
    // stop ticking
    ticking = false
    return
  }

  for (var i = 0, animation; i < animations.length; i++) {
    animation = animations[i]
    if (now < animation.startTime) {
      // animation not yet started..
      continue
    }
    if (!animation.started) {
      // animation starts
      animation.started = true
      animation.trigger('start')
    }
    // animation progress
    var t = (now - animation.startTime) / (animation.endTime - animation.startTime)
    if (t > 1) {
      t = 1
    }
    animation.trigger('progress', animation.easing(t), t)
    if (now > animation.endTime) {
      // animation ended
      animation.trigger('end')
      animations.splice(i--, 1)
      continue
    }
  }
  requestAnimationFrame(tick, true)
}
