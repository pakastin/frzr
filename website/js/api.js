
var handlers = {};

export var api = {
  on (type, handler) {
    handlers[type] || (handlers[type] = []);

    handlers[type].push({
      handler: handler
    });
  },
  one (type, handler) {
    handlers[type] || (handlers[type] = []);

    handlers[type].push({
      handler: handler,
      once: true
    });
  },
  trigger (type, data) {
    var currentHandlers = handlers[type];

    if (currentHandlers) {
      for (var i = 0; i < currentHandlers.length; i++) {
        var handler = currentHandlers[i];

        handler.handler.call(this, data);

        if (handler.once) {
          currentHandlers.splice(i--, 1);
        }
      }
    }
  }
}
