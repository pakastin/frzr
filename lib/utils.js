
export function each (array, iterator) {
  const len = array.length

  for (let i = 0; i < len; i++) {
    iterator(array[i], i, len)
  }
}

export function filter (array, iterator) {
  const results = []
  const len = array.length

  for (let i = 0; i < len; i++) {
    let item = array[i]
    iterator(item, i, len) && results.push(item)
  }

  return results
}

export function shuffle (array) {
  if (!array || !array.length) {
    return array
  }

  for (let i = array.length - 1; i > 0; i--) {
    let rnd = Math.random() * i | 0
    let temp = array[i]
    array[i] = array[rnd]
    array[rnd] = temp
  }

  return array
}

export function map (array, iterator) {
  const len = array.length
  const results = new Array(len)

  for (let i = 0; i < len; i++) {
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
