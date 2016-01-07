
var hasRequestAnimationFrame = typeof global.requestAnimationFrame !== 'undefined';

export function raf (callback) {
  if (hasRequestAnimationFrame) {
    return global.requestAnimationFrame(callback);
  } else {
    return setTimeout(callback, 1000 / 60);
  }
}

raf.cancel = function cancel (id) {
  if (hasRequestAnimationFrame) {
    global.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
