
export function each (array, iterator) {
  for (var i = 0, len = array.length; i < len; i++) {
    iterator(array[i], i)
  }
}

export function filter (array, iterator) {
  var results = []

  each(array, function (item, i) {
    if (iterator(item, i)) {
      results.push(item)
    }
  })

  return results
}

export function slice (array, start, end) {
  var len = array.length

  if (start == null) {
    start = 0
  }

  if (end == null) {
    end = len
  }

  if (start < 0) {
    start = len + start
  }

  if (end < 0) {
    end = len + end
  }

  len = end - start

  var results = new Array(len)

  for (var i = 0; i < len; i++) {
    results[i] = array[start + i]
  }
  return results
}

export function map (array, iterator) {
  var len = array.length
  var results = new Array(len)

  for (var i = 0; i < len; i++) {
    results[i] = iterator(array[i], i)
  }

  return results
}

export function timesMap (len, iterator) {
  var results = new Array(len)

  for (var i = 0; i < len; i++) {
    results[i] = iterator(i)
  }

  return results
}

export function reduce (array, init, iterator) {
  each(array, function (item, i) {
    init = iterator(init, item, i)
  })
  return init
}
