
export function renderer (handler) {
  var nextData = null;
  var rendering = false;
  var needRender = false;

  return function requestRender (data) {
    if (rendering) {
      needRender = true;
      nextData = data;
      return;
    }
    rendering = true;
    needRender = false;
    nextData = null;
    
    handler(function () {
      rendering = false;
      if (needRender) {
        requestRender(nextData);
      }
    }, data);
  }
}
