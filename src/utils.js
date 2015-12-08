
export function each (array, iterator) {
  for (let i = 0; i < array.length; i++) {
    iterator(array[i], i);
  }
}

export function shuffle (array) {
  if (!array || !array.length) {
    return array;
  }

  for (let i = array.length - 1; i > 0; i--) {
    const rnd = Math.random() * i | 0;
    const temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}

export function extend (Class, SuperClass, prototype) {
  Class.prototype = Object.create(SuperClass && SuperClass.prototype);
  Class.prototype.constructor = Class;
  Class.super = SuperClass;

  for (const key in prototype || {}) {
    Class.prototype[key] = prototype[key];
  }
}

export function extendable (Class) {
  Class.extend = function _extend (options) {
    function ExtendedClass (...args) {
      ExtendedClass.super.call(this, options, ...args);
    }
    extend(ExtendedClass, Class);
    return ExtendedClass;
  };
}
