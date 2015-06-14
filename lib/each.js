
module.exports = each

function each (array, iterator) {
  var len = array.length

  for (var i = 0; i < len; i++) {
    iterator(array[i], i, len)
  }
}
