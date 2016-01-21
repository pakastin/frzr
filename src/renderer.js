
export function renderer (handler) {
  var nextRender = noOp;
  var rendering = false;

  return function needRender (data) {
    if (rendering) {
      nextRender = needRender;
      data = data;
      return;
    }
    rendering = true;
    handler(function () {
      rendering = false;
      var _nextRender = nextRender;
      nextRender = noOp;
      _nextRender(data);
    }, data);
  }
}
function noOp () {};
