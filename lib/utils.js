
export function each (array, iterator) {
  var len = array.length

  for (var i = 0; i < len; i++) {
    iterator(array[i], i, len)
  }
}

export function filter (array, iterator) {
  var results = []
  var len = array.length
  var item

  for (var i = 0; i < len; i++) {
    item = array[i]
    iterator(item, i, len) && results.push(item)
  }

  return results
}

export function shuffle (array) {
  if (!array || !array.length) {
    return array
  }

  var rnd, temp

  for (var i = array.length - 1; i > 0; i--) {
    rnd = Math.random() * i | 0
    temp = array[i]
    array[i] = array[rnd]
    array[rnd] = temp
  }

  return array
}

export function map (array, iterator) {
  var len = array.length
  var results = new Array(len)

  for (var i = 0; i < len; i++) {
    results[i] = iterator(array[i], i, len)
  }

  return results
}

export function inherits (targetClass, superClass) {
  targetClass.super = superClass
  targetClass.prototype = Object.create(superClass.prototype, {
    constructor: {
      configurable: true,
      value: targetClass,
      writable: true
    }
  })
}
