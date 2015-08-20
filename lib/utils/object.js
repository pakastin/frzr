
export function forIn (object, iterator) {
  var key

  for (key in object) {
    iterator(object[key], key)
  }
}
