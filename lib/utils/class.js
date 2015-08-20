
export function inherit (target, superClass) {
  var prototype = (superClass && superClass.prototype) || null

  target.super = superClass

  target.prototype = Object.create(prototype, {
    constructor: {
      configurable: true,
      value: target,
      writable: true
    }
  })

  return target.prototype
}
