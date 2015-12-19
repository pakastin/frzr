
/**
 * Simple EventEmitter / Observable
 */
export class Observable {
  /**
   * Inits listeners
   * @return {Observable}
   */
  constructor () {
    /**
     * Listeners cache
     * @type {Object}
     */
    this.listeners = {};
  }
  /**
   * Add listener by name
   * @param  {String}     eventName   Event name
   * @param  {Function}   handler     Event handler
   * @return {Observable}
   */
  on (eventName, handler) {
    if (typeof this.listeners[eventName] === 'undefined') {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({ handler, one: false });

    return this;
  }
  /**
   * Add listener by name, which triggers only one
   * @param  {String}     eventName   Event name
   * @param  {Function}   handler     Event handler
   * @return {Observable}
   */
  one (eventName, handler) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];

    this.listeners[eventName].push({ handler, one: true });

    return this;
  }
  /**
   * Triggers listeners by name
   * @param  {String}     eventName   Event name
   * @param  {...*}          [args]   Call arguments
   * @return {Observable}
   */
  trigger (eventName, ...args) {
    const listeners = this.listeners[eventName];

    if (!listeners) {
      return this;
    }

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].handler.apply(this, args);

      if (listeners[i].one) {
        listeners.splice(i--, 1);
      }
    }

    return this;
  }
  /**
   * Remove all listeners, or by name, or by name & handler
   * @param  {String}     [name]      Event name
   * @param  {Function}   [handler]   Event handler
   * @return {Observable}
   */
  off (name, handler) {
    if (typeof name === 'undefined') {
      this.listeners = {};
    } else if (typeof handler === 'undefined') {
      this.listeners[name] = [];
    } else {
      const listeners = this.listeners[name];

      if (!listeners) {
        return this;
      }

      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].handler === handler) {
          listeners.splice(i--, 1);
        }
      }
    }

    return this;
  }
}
