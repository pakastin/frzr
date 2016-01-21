
export function renderer (handler) {
  var nextRender = noOp;
  var rendering = false;

  return function needRender (data) {
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
    }, data);
  }
}
function noOp () {};
