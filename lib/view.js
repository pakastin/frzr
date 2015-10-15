
import {element, SVGelement} from './dom'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {inherits} from './utils'

export function View (options) {
  var self = this
  var isView = self instanceof View

  if (!isView) {
    return new View(options)
  }
  var svg = options && options.svg || false

  View.super.call(self) // init Observable

  self.$el = svg ? SVGelement(options.el || 'svg') : element(options.el || 'div')
  self.$root = null
  self.parent = null

  self._attrs = {}
  self._class = {}
  self._data = {}
  self._style = {}
  self._text = ''

  options && self.opt(options, null, true)
  self.trigger('init', self)
  options.data && self.set(options.data)
  self.trigger('inited', self)
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

  if (self.parent) {
    // If already have parent, remove parent listeners first
    self.parent.off('mount', onParentMount, self)
    self.parent.off('mounted', onParentMounted, self)
  }

  if (self.$root) {
    self.trigger('unmount')
    self.trigger('unmounted')
  }

  if (target instanceof View) {
    self.parent = target
    self.$root = target.$el
  } else {
    self.$root = target
  }

  batchAnimationFrame(function () {
    if (self.parent) {
      self.parent.on('mount', onParentMount, self)
      self.parent.on('mounted', onParentMounted, self)
    }
    self.trigger('mount')
    self.$root.appendChild(self.$el)
    self.trigger('mounted')
  })
}

function onParentMount () {
  this.trigger('parentmount')
}

function onParentMounted () {
  this.trigger('parentmounted')
}

View.prototype.unmount = function () {
  var self = this
  var $el = self.$el

  if (!self.$root) {
    return
  }

  if (self.parent) {
    self.parent.off('mount', onParentMount, self)
    self.parent.off('mounted', onParentMounted, self)
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
  var self = this
  var $el = self.$el

  self.$root = target

  batchAnimationFrame(function () {
    target.insertBefore($el, before)
  })
}

View.prototype.set = function (key, value) {
  var self = this
  var data = {}

  if (typeof key === 'string') {
    data[key] = value
  } else if (key != null) {
    data = key
  }

  batchAnimationFrame(function () {
    self.trigger('render')
  })
  self.trigger('update', data)

  for (var key in data) {
    self._data[key] = data[key]
  }

  self.trigger('updated')
  batchAnimationFrame(function () {
    self.trigger('rendered')
  })
}

View.prototype.opt = function (key, value, skipData) {
  var self = this
  var options = {}

  if (typeof key === 'undefined') {
    return
  }

  if (typeof key === 'string') {
    options[key] = value
  } else if (key != null) {
    options = key
  }

  for (key in options) {
    if (key === 'attrs') {
      console.error('DEPRECATED! Please use "attr" instead..')
      self.attr(options.attrs)
    } else if (key === 'attr') {
      self.attr(options.attr)
    } else if (key === 'href') {
      self.attr({
        href: options.href
      })
    } else if (key === 'id') {
      self.attr({
        id: options.id
      })
    } else if (key === 'data') {
      if (!skipData) {
        self.set(options.data)
      }
    } else if (key === 'style') {
      if (typeof options.style === 'string') {
        self.attr({
          style: options.style
        })
        continue
      }
      self.style(options.style)
    } else if (key === 'class') {
      if (typeof options.class === 'string') {
        self.attr({
          class: options.class
        })
        continue
      }
      self.class(options.class)
    } else if (key === 'textContent') {
      console.error('DEPRECATED! Please use "text" instead..')
      self.text(options.textContent)
    } else if (key === 'text') {
      self.text(options.text)
    } else if (key === 'listen') {
      self.listen(options.listen)
    } else if (key === 'init') {
      self.on('init', options.init)
    } else if (key === 'update') {
      self.on('update', options.update)
    } else if (key === 'parent') {
      self.mount(options.parent)
    } else if (key === '$root') {
      self.mount(options.$root)
    } else {
      self[key] = options[key]
    }
  }
}

View.prototype.addListeners = function (key, value) {
  console.error('DEPRECATED! Please use .listen instead..')
  this.listen(key, value)
}

View.prototype.textContent = function (key, value) {
  console.error('DEPRECATED! Please use .text instead..')
  this.text(key, value)
}

View.prototype.setOptions = function (key, value) {
  console.error('DEPRECATED! Please use .opt instead..')
  this.opt(key, value)
}

View.prototype.setAttributes = function (key, value) {
  console.error('DEPRECATED! Please use .attr instead..')
  this.attr(key, value)
}

View.prototype.setClass = function (key, value) {
  console.error('DEPRECATED! Please use .class instead..')
  this.class(key, value)
}

View.prototype.setStyle = function (key, value) {
  console.error('DEPRECATED! Please use .style instead..')
  this.style(key, value)
}

View.prototype.text = function (text) {
  var self = this
  var $el = self.$el

  if (text !== self._text) {
    self._text = text

    batchAnimationFrame(function () {
      if (text === self._text) {
        $el.textContent = text
      }
    })
  }
}

View.prototype.listen = function (key, value) {
  var self = this
  var $el = self.$el
  var listeners = {}
  if (typeof key === 'string') {
    listeners[key] = value
  } else if (key != null) {
    listeners = key
  }

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

View.prototype.class = function (key, value) {
  var self = this
  var $el = self.$el
  var classes = {}

  if (typeof key === 'string') {
    classes[key] = value
  } else if (key != null) {
    classes = key
  }

  for (key in classes) {
    value = classes[key]
    if (self._class[key] !== value) {
      self._class[key] = value
      setClass(key, value)
    }
  }

  function setClass (key, value) {
    batchAnimationFrame(function () {
      if (self._class[key] === value) {
        if (value) {
          $el.classList.add(key)
        } else {
          $el.classList.remove(key)
        }
      }
    })
  }
}

View.prototype.style = function (key, value) {
  var self = this
  var $el = self.$el
  var style = {}
  if (typeof key === 'string') {
    style[key] = value
  } else if (key != null) {
    style = key
  }

  for (key in style) {
    value = style[key]
    if (self._style[key] !== value) {
      self._style[key] = value
      setStyle(key, value)
    }
  }

  function setStyle (key, value) {
    batchAnimationFrame(function () {
      if (self._style[key] === style[key]) {
        $el.style[key] = value
      }
    })
  }
}

View.prototype.attr = function (key, value) {
  var self = this
  var $el = self.$el
  var currentAttrs = self._attrs
  var attrs = {}
  var attr

  if (typeof key === 'string') {
    attrs[key] = value
  } else if (key != null) {
    attrs = key
  }

  for (attr in attrs) {
    value = attrs[attr]
    if (value !== currentAttrs[attr]) {
      self._attrs[attr] = value

      if (value === self._attrs[attr]) {
        setAttr(attr, value)
      }
    }
  }

  function setAttr (attr, value) {
    batchAnimationFrame(function () {
      if (value === self._attrs[attr]) {
        if (value === false || value == null) {
          $el.removeAttribute(attr)
          return
        }
        $el.setAttribute(attr, value)

        if (attr === 'autofocus') {
          if (value) {
            $el.focus()
            self.on('mounted', onAutofocus)
            self.on('parentmounted', onAutofocus, self)
          } else {
            self.off('mounted', onAutofocus)
            self.off('parentmounted', onAutofocus, self)
          }
        }
      }
    })
  }
}

function onAutofocus () {
  this.$el.focus()
}
