
export function each (array, iterator) {
  for (var i = 0; i < array.length; i++) {
    iterator(array[i], i);
  }
}

export function isDefined (check) {
  return typeof check !== 'undefined' || check !== null;
}

export function shuffle (array) {
  if (!array || !array.length) {
    return array;
  }

  for (var i = array.length - 1; i > 0; i--) {
    var rnd = Math.random() * i | 0;
    var temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}

export function inherits (Class, SuperClass) {
  Class.prototype = Object.create(SuperClass.prototype, {
    constructor: {
      value: Class
    }
  });
}

export function define (target, properties) {
  for (var propertyName in properties) {
    Object.defineProperty(target, propertyName, {
      value: properties[propertyName]
    });
  }
}

export function extend (target, properties) {
  for (var propertyName in properties) {
    target[propertyName] = properties[propertyName];
  }
  return target;
}

export function extendable (Class) {
  Class.extend = function extend (options) {
    function ExtendedClass (data) {
      Class.call(this, options, data);
    }

    inherits(ExtendedClass, Class);

    return ExtendedClass;
  };
}
