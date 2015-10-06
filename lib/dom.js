
export function element (type, attrs) {
  var $el = document.createElement(type)

  if (typeof attrs !== 'undefined') {
    for (var attr in attrs) {
      $el.setAttribute(attr, attrs[attr])
    }
  }

  return $el
}

export function SVGelement (type, attrs) {
  var $el = document.createElementNS('http://www.w3.org/2000/svg', type)

  for (var attr in attrs) {
    $el.setAttribute(attrs, attrs[attr])
  }

  return $el
}
