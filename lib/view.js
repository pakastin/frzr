
import {element, SVGelement} from './dom'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {inherits} from './utils'

export function View (type, options, data) {
  var svg = options && options.svg || false

  View.super.call(this) // init Observable

  this.$el = svg ? SVGelement(type) : element(type)
  this.attrs = {}
  this.class = {}
  this.data = {}
  this.style = {}

  options && this.setOptions(options)
  this.trigger('init', this)
  data && this.set(data)
  this.trigger('inited', this)
}

inherits(View, Observable)

View.extend = function (superType, superOptions) {
  return function ExtendedView (type, options) {
    if (!options) {
      return new View(type || superType, superOptions)
    }
    var currentOptions = {}

    for (var key in superOptions) {
      currentOptions[key] = superOptions[key]
    }

    for (key in options) {
      currentOptions[key] = options[key]
    }
    return new View(type || superType, currentOptions)
  }
}

View.prototype.mount = function (target) {
  var self = this
  var $el = self.$el

  self.root = target

  batchAnimationFrame(function () {
    self.trigger('mount')
    target.appendChild($el)
    self.trigger('mounted')
  })
}

View.prototype.unmount = function () {
  var self = this
  var $el = self.$el

  if (!self.root) {
    return
  }

  batchAnimationFrame(function () {
    self.trigger('unmount')
    self.root.removeChild($el)
    self.root = null
    self.trigger('unmounted')
  })
}

View.prototype.destroy = function () {
  var self = this

  self.trigger('destroy')
  self.off()
  self.unmount()
  self.trigger('destroyed')
}

View.prototype.mountBefore = function (target, before) {
  var $el = this.$el

  this.root = target

  batchAnimationFrame(function () {
    target.insertBefore($el, before)
  })
}

View.prototype.set = function (data) {
  var self = this
  batchAnimationFrame(function () {
    self.trigger('render')
  })
  self.trigger('update', data)
  for (var key in data) {
    self.data[key] = data[key]
  }
  self.trigger('updated')
  batchAnimationFrame(function () {
    self.trigger('rendered')
  })
}

View.prototype.setOptions = function (options) {
  if (!options) {
    return
  }
  var key

  for (key in options) {
    if (key === 'attrs') {
      this.setAttributes(options.attrs)
    } else if (key === 'style') {
      if (typeof options.style === 'string') {
        this.setAttributes({
          style: options.style
        })
        continue
      }
      this.setStyle(options.style)
    } else if (key === 'class') {
      if (typeof options.class === 'string') {
        this.setAttributes({
          class: options.class
        })
        continue
      }
      this.setClass(options.class)
    } else if (key === 'textContent') {
      this.textContent(options.textContent)
    } else if (key === 'init') {
      this.on('init', options.init)
    } else if (key === 'update') {
      this.on('update', options.update)
    } else {
      this[key] = options[key]
    }
  }
}

View.prototype.textContent = function (text) {
  var self = this
  var $el = self.$el

  if (text !== self.text) {
    self.text = text

    batchAnimationFrame(function () {
      if (text === self.text) {
        $el.textContent = text
      }
    })
  }
}

View.prototype.setClass = function (classes) {
  var self = this
  var $el = self.$el
  var key, value

  for (key in classes) {
    value = classes[key]
    if (self.class[key] !== value) {
      self.class[key] = value
      setClass(key, value)
    }
  }

  function setClass (key, value) {
    batchAnimationFrame(function () {
      if (self.class[key] === value) {
        if (value) {
          $el.classList.add(key)
        } else {
          $el.classList.remove(key)
        }
      }
    })
  }
}

View.prototype.setStyle = function (style) {
  var self = this
  var $el = self.$el
  var key, value

  for (key in style) {
    value = style[key]
    if (self.style[key] !== value) {
      self.style[key] = value
      setStyle(key, value)
    }
  }

  function setStyle (key, value) {
    batchAnimationFrame(function () {
      if (self.style[key] === style[key]) {
        $el.style[key] = value
      }
    })
  }
}

View.prototype.setAttributes = function (attrs) {
  var self = this
  var $el = self.$el
  var currentAttrs = self.attrs
  var value, attr

  for (attr in attrs) {
    value = attrs[attr]
    if (value !== currentAttrs[attr]) {
      self.attrs[attr] = value

      if (value === self.attrs[attr]) {
        setAttribute(attr, value)
      }
    }
  }

  function setAttribute (attr, value) {
    batchAnimationFrame(function () {
      if (value !== self.attrs[attr]) {
        $el.setAttribute(attr, value)
      }
    })
  }
}
