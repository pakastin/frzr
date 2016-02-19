
import { Observable } from '@pakastin/observable';
import { ease } from './easing';
import { baf } from './baf';
import { define, inherits } from './utils';

var animations = [];
var ticking;

export function Animation (options) {
  if (!(this instanceof Animation)) {
    return new Animation(options);
  }
  Observable.call(this);

  var delay = options.delay || 0;
  var duration = options.duration || 0;
  var easing = options.easing || 'quadOut';
  var init = options.init;
  var start = options.start;
  var progress = options.progress;
  var end = options.end;

  var now = Date.now();

  this.startTime = now + delay;
  this.endTime = this.startTime + duration;
  this.easing = ease[easing];
  this.started = false;

  if (init) this.on('init', init);
  if (start) this.on('start', start);
  if (progress) this.on('progress', progress);
  if (end) this.on('end', end);

  // add animation
  animations.push(this);

  this.trigger('init');

  if (!ticking) {
    // start ticking
    ticking = true;
    baf(tick);
  }
}

inherits(Animation, Observable);

define(Animation.prototype, {
  destroy: function () {
    for (var i = 0; i < animations.length; i++) {
      if (animations[i] === this) {
        animations.splice(i, 1);
        return;
      }
    }
  }
});

export var animation = Animation;

function tick () {
  var now = Date.now();

  if (!animations.length) {
    // stop ticking
    ticking = false;
    return;
  }

  for (var i = 0; i < animations.length; i++) {
    var animation = animations[i];

    if (now < animation.startTime) {
      // animation not yet started..
      continue;
    }
    if (!animation.started) {
      // animation starts
      animation.started = true;
      animation.trigger('start');
    }
    // animation progress
    var t = (now - animation.startTime) / (animation.endTime - animation.startTime);
    if (t > 1) {
      t = 1;
    }
    animation.trigger('progress', animation.easing(t), t);
    if (now > animation.endTime) {
      // animation ended
      animation.trigger('end');
      animations.splice(i--, 1);
      continue;
    }
  }
  baf(tick);
}
