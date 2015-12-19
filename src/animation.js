
import { Observable } from './observable';
import { ease } from './easing';
import { raf } from './raf';

const animations = [];
let ticking;

/**
 * Simple but efficient animation helper with batched requestAnimationFrame
 */
export class Animation extends Observable {
  /**
   * Create new Animation
   * @param  {Number}     [delay=0]     Start delay in milliseconds
   * @param  {Number}     [duration=0]  Duration in milliseconds
   * @param  {String}     [easing='quadOut']      Possible values: 'linear', 'quadIn', 'quadOut', 'quadInOut', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartIn', 'quartOut', 'quartInOut', 'quintIn', 'quintOut', 'quintInOut', 'bounceIn', 'bounceOut', 'bounceInOut'
   * @param  {Function}   [init]          'init' event handler
   * @param  {Function}   [start]         'start' event handler
   * @param  {Function}   [progress]      'progress' event handler
   * @param  {Function}   [end]           'end' event handler
   * @return {Animation}
   */
  constructor ({ delay = 0, duration = 0, easing = 'quadOut', init, start, progress, end }) {
    super();

    const now = Date.now();

    /**
     * Calculate when to start the animation
     * @type {Number}
     */
    this.startTime = now + delay;
    /**
     * Calculate when to end the animation
     * @type {Number}
     */
    this.endTime = this.startTime + duration;
    /**
     * Which easing to use
     * @type {String}
     */
    this.easing = ease[easing];
    /**
     * Is animation started?
     * @type {Boolean}
     */
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
      raf(tick);
    }
  }
  /**
   * Destroy the animation
   */
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
