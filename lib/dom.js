
export function element (type, attrs) {
  // Just a simple helper for creating DOM elements
  var $el = document.createElement(type)

  if (typeof attrs !== 'undefined') {
    for (var attr in attrs) {
      $el.setAttribute(attr, attrs[attr])
    }
  }

  return $el
}

export function SVGelement (type, attrs) {
  // Just a simple helper for creating SVG DOM elements
  var $el = document.createElementNS('http://www.w3.org/2000/svg', type)

  if (typeof attrs !== 'undefined') {
    for (var attr in attrs) {
      $el.setAttribute(attrs, attrs[attr])
    }
  }
  
  return $el
}
