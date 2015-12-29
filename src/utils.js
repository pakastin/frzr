
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
 * Defined check helper
 * @param  {*}  check Something to check
 * @return {Boolean}       True / false
 */
export function isDefined (check) {
  return typeof check !== 'undefined' || check !== null;
}

/**
 * CSS style string iteration helper
 * @param  {String} styleString     CSS style string
 * @param  {Function} handler Handler function
 */
export function eachCSS (styleString, handler) {
  const styles = styleString.split(';');

  for (let i = 0; i < styles.length; i++) {
    if (!styles[i].length) {
      continue;
    }
    const style = styles[i].split(':');
    const propertyName = style[0].trim();
    const value = style[1].trim();

    if (propertyName.length) {
      handler(propertyName, value);
    }
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
  Class.extend = function extend (options) {
    return class ExtendedClass extends Class {
      constructor (data) {
        super(options, data);
      }
    };
  };
}
