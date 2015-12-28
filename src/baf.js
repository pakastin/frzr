
import { raf } from './raf';

const requestedAnimationFrames = [];
let ticking;

/**
 * Batched requestAnimationFrame
 * @param  {Function} callback Callback
 * @return {Function} requestAnimationFrame or setTimeout -fallback
 */
export function baf (callback) {
  requestedAnimationFrames.push(callback);
  if (ticking) return;

  ticking = raf(() => {
    ticking = false;
    const animationFrames = requestedAnimationFrames.splice(0, requestedAnimationFrames.length);

    for (let i = 0; i < animationFrames.length; i++) {
      animationFrames[i]();
    }
  });
}

baf.cancel = function cancel (cb) {
  for (let i = 0; i < requestedAnimationFrames.length; i++) {
    if (requestedAnimationFrames[i] === cb) {
      requestedAnimationFrames.splice(i--, 1);
    }
  }
};
