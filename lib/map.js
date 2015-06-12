
module.exports = map

function map (array, iterator) {
  var len = array.length
  var results = new Array(len)

  for (var i = 0; i < len; i++) {
    results[i] = iterator(array[i], i)
  }
  return results
}
