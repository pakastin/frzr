
var hasRequestAnimationFrame = typeof window.requestAnimationFrame !== 'undefined';

export function raf (callback) {
  if (hasRequestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  } else {
    return setTimeout(callback, 1000 / 60);
  }
}

raf.cancel = function cancel (id) {
  if (hasRequestAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
