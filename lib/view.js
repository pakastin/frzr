
import {element, SVGelement} from './dom'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {inherits} from './utils'

export function View (options) {
  var isView = this instanceof View
  if (!isView) {
    return new View(options)
  }
  var svg = options && options.svg || false

  View.super.call(this) // init Observable

  this.$el = svg ? SVGelement(options.el || 'svg') : element(options.el || 'div')
  this.attrs = {}
  this.class = {}
  this.data = {}
  this.style = {}

  options && this.setOptions(options, true)
  this.trigger('init', this)
  options.data && this.set(options.data)
  this.trigger('inited', this)
}

inherits(View, Observable)

View.extend = function (superOptions) {
  return function ExtendedView (options) {
    if (!options) {
      return new View(superOptions)
    }
    var currentOptions = {}

    for (var key in superOptions) {
      currentOptions[key] = superOptions[key]
    }
    for (key in options) {
      currentOptions[key] = options[key]
    }
    return new View(currentOptions)
  }
}

View.prototype.mount = function (target) {
  var self = this

  if (target instanceof View) {
    self.parent = target
    self.$root = target.$el
  } else {
    self.$root = target
  }

  batchAnimationFrame(function () {
    if (self.parent && !self.parent.$root) {
      self.parent.on('mount', self.onMount)
      return
    }
    self.trigger('mount')
    self.$root.appendChild(self.$el)
    self.trigger('mounted')
  })
}

View.prototype.onMount = function () {
  this.trigger('mount')
  this.$root.appendChild(this.$el)
  this.trigger('mounted')
}

View.prototype.unmount = function () {
  var self = this
  var $el = self.$el

  if (!self.$root) {
    return
  }

  batchAnimationFrame(function () {
    self.trigger('unmount')
    self.$root.removeChild($el)
    self.$root = null
    self.parent = null
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

  this.$root = target

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

View.prototype.setOptions = function (options, skipData) {
  if (!options) {
    return
  }
  var key

  for (key in options) {
    if (key === 'attrs') {
      this.setAttributes(options.attrs)
    } else if (key === 'attr') {
      this.setAttributes(options.attr)
    } else if (key === 'href') {
      this.setAttributes({
        href: options.href
      })
    } else if (key === 'id') {
      this.setAttributes({
        id: options.id
      })
    } else if (key === 'data') {
      if (!skipData) {
        this.set(options.data)
      }
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
    } else if (key === 'listen') {
      this.addListeners(options.listen)
    } else if (key === 'init') {
      this.on('init', options.init)
    } else if (key === 'update') {
      this.on('update', options.update)
    } else if (key === 'parent') {
      this.mount(options.parent)
    } else if (key === '$root') {
      this.mount(options.$root)
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

View.prototype.addListeners = function (listeners) {
  var self = this
  var $el = self.$el
  var key, value

  for (key in listeners) {
    value = listeners[key]
    addListener(key, value)
  }
  function addListener (key, value) {
    self.on(key, value)
    $el.addEventListener(key, function (e) {
      self.trigger(key, e)
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

View.prototype.setAttribute = function (attr, value) {
  var data = {}
  data[attr] = value
  this.setAttributes(data)
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
      if (value === self.attrs[attr]) {
        if (value === false || value == null) {
          $el.removeAttribute(attr)
          return
        }
        $el.setAttribute(attr, value)

        if (attr === 'autofocus') {
          $el.focus()
        }
      }
    })
  }
}
