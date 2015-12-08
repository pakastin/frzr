
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
   * @param  {String}   name Listener name
   * @param  {Function} callback   Listener callback
   * @return {Observable}
   */
  on (name, callback) {
    if (!this.listeners[name]) this.listeners[name] = [];

    this.listeners[name].push({ callback, one: false });

    return this;
  }
  /**
   * Add listener by name, which triggers only one
   * @param  {String}   name Listener name
   * @param  {Function} callback   Listener callback
   * @return {Observable}
   */
  one (name, callback) {
    if (!this.listeners[name]) this.listeners[name] = [];

    this.listeners[name].push({ callback, one: true });

    return this;
  }
  /**
   * Triggers listeners by name
   * @param  {String} name    [description]
   * @param  {*} [...args] [description]
   * @return {Observable}
   */
  trigger (name, ...args) {
    const listeners = this.listeners[name];

    if (!listeners) {
      return this;
    }

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].callback.apply(this, args);

      if (listeners[i].one) {
        listeners.splice(i--, 1);
      }
    }

    return this;
  }
  /**
   * Remove all listeners, or by name, or by name & callback
   * @param  {String}   [name]     Listener name
   * @param  {Function} [callback] Listener callback
   * @return {Observable}
   */
  off (name, callback) {
    if (typeof name === 'undefined') {
      this.listeners = {};
    } else if (typeof callback === 'undefined') {
      this.listeners[name] = [];
    } else {
      const listeners = this.listeners[name];

      if (!listeners) {
        return this;
      }

      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].callback === callback) {
          listeners.splice(i--, 1);
        }
      }
    }

    return this;
  }
}
