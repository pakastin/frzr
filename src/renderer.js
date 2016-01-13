export function renderer (handler) {
  var nextRender = noOp;
  var rendering = false;

  return function needRender () {
    if (rendering) {
      nextRender = needRender;
      return;
    }
    rendering = true;
    handler(function () {
      rendering = false;
      var _nextRender = nextRender;
      nextRender = noOp;
      _nextRender();
    });
  }
}
function noOp () {};
