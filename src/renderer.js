
export function renderer (handler) {
  var nextRender = noOp;
  var nextData = null;
  var rendering = false;

  return function needRender (data) {
    if (rendering) {
      nextRender = needRender;
      nextData = data;
      data = data;
      return;
    }
    rendering = true;
    handler(function () {
      rendering = false;
      var _nextRender = nextRender;
      var _nextData = nextData;
      nextRender = noOp;
      nextData = null;
      _nextRender(_nextData);
    }, data);
  }
}
function noOp () {};
