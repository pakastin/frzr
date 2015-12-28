
import { el } from './el';
import { extendable } from './utils';
import { Observable } from './observable';

const EVENT = 'init inited mount mounted unmount unmounted sort sorted update updated destroy'.split(' ').reduce((obj, name) => {
  obj[name] = name;
  return obj;
}, {});

/**
 * VanillaJS helper for single DOM element
 */
export class View extends Observable {
  /**
   * @external {HTMLElement} https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
   */

  /**
   * @typedef {Object} ViewOptions
   * @property {el|HTMLElement} [el=el('div')] DOM element
   * @property {Function} [init] 'init' event handler shortcut
   * @property {Function} [inited] 'inited' event handler shortcut
   * @property {Function} [mount] 'mount' event handler shortcut
   * @property {Function} [mounted] 'mounted' event handler shortcut
   * @property {Function} [sort] 'sort' event handler shortcut
   * @property {Function} [sorted] 'sorted' event handler shortcut
   * @property {Function} [update] 'update' event handler shortcut
   * @property {Function} [updated] 'updated' event handler shortcut
   * @property {Function} [destroy] 'destroy' event handler shortcut
   * @property {*} [*] Anything else you want to pass on to View
   */

  /**
   * Creates View
   * @param  {ViewOptions} [options] View options
   * @param  {*} [data]    Any data to pass on to init()
   * @return {View}
   */

  constructor (options = {}, data) {
    super();

    /**
     * HTMLElement
     * @type {el|HTMLElement}
     */
    this.el = null;
    /**
     * Proxy event listeners cache
     * @type {Array}
     */
    this.eventListeners = [];
    /**
     * Listeners cache
     * @type {Object}
     */
    this.listeners = {};

    for (const key in options) {
      if (EVENT[key]) {
        this.on(key, options[key]);
      } else if (key === 'el') {
        if (typeof options.el === 'string') {
          this.el = document.createElement(options.el);
        } else if (options.el instanceof Array) {
          this.el = el(options.el[0], options.el[1]);
        } else {
          this.el = options.el;
        }
      } else {
        this[key] = options[key];
      }
    }

    this.trigger(EVENT.init, data);
    if (!this.el) this.el = document.createElement('div');
    this.el.view = this;
    this.trigger(EVENT.inited, data);
  }
  /**
   * Sets/removes View element attribute (only if changed)
   * @param {String} attributeName   Attribute name
   * @param {*|null} value Attribute value or null to remove
   * @return {View}
   */
  setAttr (attributeName, value) {
    if (!this.el[attributeName] === value) {
      this.el[attributeName] = value;
    }

    return this;
  }
  /**
   * Sets/removes View element class (only if changed)
   * @param {String} className   Class name
   * @param {Boolean} value true / false
   * @return {View}
   */
  setClass (className, value) {
    if (this.el.classList.contains(className) !== value) {
      if (value) {
        this.el.classList.add(className);
      } else {
        this.el.classList.remove(className);
      }
    }

    return this;
  }
  /**
   * Sets/removes View element style (only if changed)
   * @param {String} propertyName   Style name
   * @param {*|null} value Style value or null to remove
   * @return {View}
   */
  setStyle (propertyName, value) {
    if (this.el.style[propertyName] !== value) {
      this.el.style[propertyName] = value;
    }

    return this;
  }
  /**
   * Sets View element textContent (only if changed)
   * @param {String} text Text to be applied to textContent
   * @return {View}
   */
  setText (text) {
    if (this.el.textContent !== text) {
      this.el.textContent = text;
    }

    return this;
  }
  /**
   * Sets View element innerHTML (only if changed)
   * @param {String} html HTML string
   * @return {View}
   */
  setHTML (html) {
    if (this.el.innerHTML !== html) {
      this.el.innerHTML = html;
    }

    return this;
  }
  /**
   * Adds proxy event listener to View
   * @param {[type]}   listenerName       Listener name
   * @param {Function} handler         Listener handler
   * @param {Boolean}   useCapture Use capture or not
   * @return {View}
   */
  addListener (listenerName, handler, useCapture) {
    const listener = {
      name: listenerName,
      handler,
      proxy: (...args) => {
        handler.apply(this, args);
      }
    };
    if (!this.eventListeners) this.eventListeners = [];

    this.eventListeners.push(listener);
    this.el.addEventListener(listenerName, listener.proxy, useCapture);

    return this;
  }
  /**
   * Removes all proxy event listeners from View, or by name, or by name and handler
   * @param  {String}   [listenerName] Listener name
   * @param  {Function} [handler]   Listener handler
   * @return {View}
   */
  removeListener (listenerName, handler) {
    const listeners = this.eventListeners;
    if (!listeners) {
      return this;
    }
    if (typeof listenerName === 'undefined') {
      for (let i = 0; i < listeners.length; i++) {
        this.el.removeEventListener(listeners[i].proxy);
      }
      this.listeners = [];
    } else if (typeof handler === 'undefined') {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].name === listenerName) {
          listeners.splice(i--, 1);
        }
      }
    } else {
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        if (listener.name === listenerName && handler === listener.handler) {
          listeners.splice(i--, 1);
        }
      }
    }

    return this;
  }
  /**
   * Adds child View/ViewList to View
   * @param {View|ViewList} child Child View/ViewList to be added
   * @return {View}
   */
  addChild (child) {
    if (child.views) {
      child.parent = this;
      return this.setChildren(...child.views);
    }
    let sorting = false;
    if (child.parent) {
      sorting = true;
      child.trigger(EVENT.sort);
    } else {
      child.trigger(EVENT.mount);
    }

    this.el.appendChild(child.el);
    child.parent = this;

    if (sorting) {
      child.trigger(EVENT.sorted);
    } else {
      child.trigger(EVENT.mounted);
    }

    return this;
  }
  /**
   * Adds child View before another View/HTMLElement
   * @param {View} child  Child View to be added
   * @param {View|HTMLElement} before Reference View/HTMLElement
   * @return {View}
   */
  addBefore (child, before) {
    let sorting = false;

    if (child.parent) {
      sorting = true;
      child.trigger(EVENT.sort);
    } else {
      child.trigger(EVENT.mount);
    }

    this.el.insertBefore(child.el, before.el || before);
    child.parent = this;

    if (sorting) {
      child.trigger(EVENT.sorted);
    } else {
      child.trigger(EVENT.mounted);
    }

    return this;
  }
  /**
   * Replace children with Views or ViewList
   * @param {...View|ViewList} views [description]
   * @return {View}
   */
  setChildren (...views) {
    if (views.length && views[0].views) {
      views[0].parent = this;
      if (!views[0].views.length) {
        return this;
      }
      this.setChildren(...views[0].views);
    }
    let traverse = this.el.firstChild;

    for (let i = 0; i < views.length; i++) {
      const view = views[i];

      if (traverse === view.el) {
        traverse = traverse.nextSibling;
        continue;
      }
      if (traverse) {
        this.addBefore(view, traverse);
      } else {
        this.addChild(view);
      }
    }
    while (traverse) {
      const next = traverse.nextSibling;

      if (traverse.view) {
        traverse.view.parent.removeChild(traverse.view);
      } else {
        this.el.removeChild(traverse);
      }

      traverse = next;
    }

    return this;
  }
  /**
   * Remove child View / ViewList
   * @param  {View|ViewList} child Child View/ViewList to be removed
   * @return {View}
   */
  removeChild (child) {
    if (!child.parent) {
      return this;
    }
    child.trigger(EVENT.unmount);

    this.el.removeChild(child.el);
    child.parent = null;

    child.trigger(EVENT.unmounted);

    return this;
  }
  /**
   * Trigger 'update' with data
   * @param  {*} data Any data
   * @return {View}
   */
  update (data) {
    this.trigger(EVENT.update, data);
  }
  /**
   * Destroy View (remove listeners, children, etc..)
   */
  destroy () {
    this.trigger(EVENT.destroy);
    if (this.parent) this.parent.removeChild(this);

    let traverse = this.el.firstChild;

    while (traverse) {
      if (traverse.view) {
        traverse.view.destroy();
      } else {
        this.el.removeChild(traverse);
      }
      traverse = this.el.firstChild;
    }
    this.off();
    this.removeListener();
  }
}

extendable(View);
