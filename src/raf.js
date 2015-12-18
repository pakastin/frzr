
const hasRequestAnimationFrame = typeof window.requestAnimationFrame !== 'undefined';

export function raf (cb) {
  if (hasRequestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  } else {
    return setTimeout(cb, 1000 / 60);
  }
}

raf.cancel = function cancel (id) {
  if (hasRequestAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
