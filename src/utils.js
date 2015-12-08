
/**
 * Faster way to iterate array
 * @param  {Array} array    source array
 * @param  {Function} iterator gets called: iterator(array[i], i)
 */
export function each (array, iterator) {
  for (let i = 0; i < array.length; i++) {
    iterator(array[i], i);
  }
}

/**
 * Fisher-Yates shuffle helper
 * @param  {Array} array Array to be shuffled
 * @return {Array}       Shuffled Array
 */
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
/**
 * Makes Class extendable by adding Class.extend
 * @param  {Class} Class source Class
 * @return {ExtendedClass}       resulted ExtendedClass
 */
export function extendable (Class) {
  Class.extend = function _extend (options) {
    return class ExtendedClass extends Class {
      constructor (...args) {
        super(options, ...args);
      }
    };
  };
}
