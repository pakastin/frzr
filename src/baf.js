
import { raf } from './raf';

var requestedAnimationFrames = [];
var ticking;

export function baf (callback) {
  requestedAnimationFrames.push(callback);
  if (ticking) return;

  ticking = raf(function () {
    ticking = false;
    var animationFrames = requestedAnimationFrames.splice(0, requestedAnimationFrames.length);

    for (var i = 0; i < animationFrames.length; i++) {
      animationFrames[i]();
    }
  });
}

baf.cancel = function cancel (cb) {
  for (var i = 0; i < requestedAnimationFrames.length; i++) {
    if (requestedAnimationFrames[i] === cb) {
      requestedAnimationFrames.splice(i--, 1);
    }
  }
};
