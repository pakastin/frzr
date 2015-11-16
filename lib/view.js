
import {element, SVGelement} from './dom'
import {batchAnimationFrame} from './renderer'
import {Observable} from './observable'
import {inherits} from './utils'

export function View (options) {
  const isView = this instanceof View

  if (!isView) {
    return new View(options)
  }

  View.super.call(this) // init Observable

  this.$el = (options && options.svg) ? SVGelement(options.el || 'svg') : element(options.el || 'div')

  this.data = {}

  this._attrs = {}
  this._class = {}
  this._style = {}
  this._text = ''

  options && this.opt(options, null, true)
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
    const currentOptions = {}

    for (let key in superOptions) {
      currentOptions[key] = superOptions[key]
    }
    for (let key in options) {
      currentOptions[key] = options[key]
    }
    return new View(currentOptions)
  }
}

View.prototype.mount = function (target) {
  if (this.parent) {
    // If already have parent, remove parent listeners first
    this.parent.off('mount', onParentMount, this)
    this.parent.off('mounted', onParentMounted, this)
  }

  if (this.$root) {
    this.trigger('unmount')
    this.trigger('unmounted')
  }

  if (target instanceof View) {
    this.parent = target
    this.$root = target.$el
  } else {
    this.$root = target
  }

  batchAnimationFrame(() => {
    if (this.parent) {
      this.parent.on('mount', onParentMount, this)
      this.parent.on('mounted', onParentMounted, this)
    }
    this.trigger('mount')
    this.$root.appendChild(this.$el)
    this.trigger('mounted')
  })
}

function onParentMount () {
  this.trigger('parentmount')
}

function onParentMounted () {
  this.trigger('parentmounted')
}

View.prototype.unmount = function () {
  const $el = this.$el

  if (!this.$root) {
    return
  }

  if (this.parent) {
    this.parent.off('mount', onParentMount, this)
    this.parent.off('mounted', onParentMounted, this)
  }

  batchAnimationFrame(() => {
    this.trigger('unmount')
    this.$root.removeChild($el)
    this.$root = null
    this.parent = null
    this.trigger('unmounted')
  })
}

View.prototype.destroy = function () {
  this.trigger('destroy')
  this.off()
  this.unmount()
  this.trigger('destroyed')
}

View.prototype.mountBefore = function (target, before) {
  const $el = this.$el

  this.$root = target

  batchAnimationFrame(() => {
    target.insertBefore($el, before)
  })
}

View.prototype.set = function (key, value) {
  let data = {}

  if (typeof key === 'string') {
    data[key] = value
  } else if (key != null) {
    data = key
  }

  batchAnimationFrame(() => {
    this.trigger('render')
  })
  this.trigger('update', data)

  for (let key in data) {
    this.data[key] = data[key]
  }

  this.trigger('updated')
  batchAnimationFrame(() => {
    this.trigger('rendered')
  })
}

View.prototype.opt = function (key, value, skipData) {
  let options = {}

  if (typeof key === 'undefined') {
    return
  }

  if (typeof key === 'string') {
    options[key] = value
  } else if (key != null) {
    options = key
  }

  for (let key in options) {
    if (key === 'attr') {
      this.attr(options.attr)
    } else if (key === 'href') {
      this.attr({
        href: options.href
      })
    } else if (key === 'id') {
      this.attr({
        id: options.id
      })
    } else if (key === 'data') {
      if (!skipData) {
        this.set(options.data)
      }
    } else if (key === 'style') {
      if (typeof options.style === 'string') {
        this.attr({
          style: options.style
        })
        continue
      }
      this.style(options.style)
    } else if (key === 'class') {
      if (typeof options.class === 'string') {
        this.attr({
          class: options.class
        })
        continue
      }
      this.class(options.class)
    } else if (key === 'text') {
      this.text(options.text)
    } else if (key === 'listen') {
      this.listen(options.listen)
    } else if (key === 'init') {
      this.on('init', options.init)
    } else if (key === 'update') {
      this.on('update', options.update)
    } else if (key === 'mount') {
      this.on('mount', options.mount)
    } else if (key === 'mounted') {
      this.on('mounted', options.mounted)
    } else if (key === 'unmount') {
      this.on('unmount', options.unmount)
    } else if (key === 'unmounted') {
      this.on('unmounted', options.unmounted)
    } else if (key === 'destroy') {
      this.on('destroy', options.destroy)
    } else if (key === 'parent') {
      this.mount(options.parent)
    } else if (key === '$root') {
      this.mount(options.$root)
    } else {
      this[key] = options[key]
    }
  }
}

View.prototype.text = function (text) {
  const $el = this.$el

  if (text !== this._text) {
    this._text = text

    batchAnimationFrame(() => {
      if (text === this._text) {
        $el.textContent = text
      }
    })
  }
}

View.prototype.listen = function (key, value) {
  const $el = this.$el

  let listeners = {}
  if (typeof key === 'string') {
    listeners[key] = value
  } else if (key != null) {
    listeners = key
  }

  for (let key in listeners) {
    value = listeners[key]
    this.on(key, value)
    $el.addEventListener(key, (e) => {
      this.trigger(key, e)
    })
  }
}

View.prototype.class = function (key, value) {
  const $el = this.$el
  let classes = {}

  if (typeof key === 'string') {
    classes[key] = value
  } else if (key != null) {
    classes = key
  }

  for (let key in classes) {
    value = classes[key]
    if (this._class[key] !== value) {
      this._class[key] = value
      batchAnimationFrame(() => {
        if (this._class[key] === value) {
          if (value) {
            $el.classList.add(key)
          } else {
            $el.classList.remove(key)
          }
        }
      })
    }
  }
}

View.prototype.style = function (key, value) {
  const $el = this.$el
  let style = {}

  if (typeof key === 'string') {
    style[key] = value
  } else if (key != null) {
    style = key
  }

  for (let key in style) {
    value = style[key]
    if (this._style[key] !== value) {
      this._style[key] = value
      batchAnimationFrame(() => {
        if (this._style[key] === style[key]) {
          $el.style[key] = value
        }
      })
    }
  }
}

View.prototype.attr = function (key, value) {
  const $el = this.$el
  const currentAttrs = this._attrs
  let attrs = {}

  if (typeof key === 'string') {
    attrs[key] = value
  } else if (key != null) {
    attrs = key
  }

  for (let attr in attrs) {
    value = attrs[attr]
    if (value !== currentAttrs[attr]) {
      this._attrs[attr] = value

      if (value === this._attrs[attr]) {
        batchAnimationFrame(() => {
          if (value === this._attrs[attr]) {
            if (value === false || value == null) {
              $el.removeAttribute(attr)
              return
            }
            $el.setAttribute(attr, value)

            if (attr === 'autofocus') {
              if (value) {
                $el.focus()
                this.on('mounted', onAutofocus)
                this.on('parentmounted', onAutofocus, this)
              } else {
                this.off('mounted', onAutofocus)
                this.off('parentmounted', onAutofocus, this)
              }
            }
          }
        })
      }
    }
  }
}

function onAutofocus () {
  this.$el.focus()
}
