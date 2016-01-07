
var hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';

export function raf (callback) {
  if (hasRequestAnimationFrame) {
    return requestAnimationFrame(callback);
  } else {
    return setTimeout(callback, 1000 / 60);
  }
}

raf.cancel = function cancel (id) {
  if (hasRequestAnimationFrame) {
    cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
