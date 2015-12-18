
import { Observable } from './observable';
import ease from './ease';
import { raf } from './raf';

const animations = [];
let ticking;

export class Animation extends Observable {
  constructor ({ delay = 0, duration = 0, easing, start, progress, end }) {
    super();

    const now = Date.now();

    // calculate animation start/end times
    this.startTime = now + delay;
    this.endTime = this.startTime + duration;
    this.easing = ease[easing] || ease.quadOut;

    this.started = false;

    if (start) this.on('start', start);
    if (progress) this.on('progress', progress);
    if (end) this.on('end', end);

    // add animation
    animations.push(this);

    if (!ticking) {
      // start ticking
      ticking = true;
      raf(tick);
    }
  }
  destroy () {
    for (let i = 0; i < animations.length; i++) {
      if (animations[i] === this) {
        animations.splice(i, 1);
        return;
      }
    }
  }
}

function tick () {
  const now = Date.now();

  if (!animations.length) {
    // stop ticking
    ticking = false;
    return;
  }

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];

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
    let t = (now - animation.startTime) / (animation.endTime - animation.startTime);
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
  raf(tick, true);
}
