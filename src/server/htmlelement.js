
var ClassList = require('./classlist');

function HTMLElement (options) {
  this.childNodes = [];

  for (var key in options) {
    this[key] = options[key];
  }
}

var doNotRender = {
  tagName: true,
  view: true
}

HTMLElement.prototype.render = function () {
  var attributes = [];
  var hasChildren = false;
  var content = '';

  for (var key in this) {
    if (!this.hasOwnProperty(key)) {
      continue;
    }
    if (key === 'childNodes') {
      if (this.childNodes.length) {
        hasChildren = true;
      }
    } else if (key === 'innerHTML') {
      content = this.innerHTML;
    } else if (key === 'textContent') {
      content = this.textContent;
    } else if (key !== 'view' && key !== 'tagName' && key !== 'parentNode') {
      attributes.push(key + '="' + this[key] + '"');
    }
  }

  if (hasChildren) {
    if (attributes.length) {
      return '<' + this.tagName + ' ' + attributes.join('') + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
    } else {
      return '<' + this.tagName + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
    }
  } else if (content) {
    return '<' + this.tagName + '>' + content + '</' + this.tagName + '>';
  } else {
    return '<' + this.tagName + '>';
  }
}

HTMLElement.prototype.appendChild = function (child) {
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
}

HTMLElement.prototype.insertBefore = function (child, before) {
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === before) {
      this.childNodes.splice(i++, 0, child);
    } else if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  child.parentNode = null;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

Object.defineProperties(HTMLElement.prototype, {
  classList: {
    get: function () {
      return new ClassList(this);
    }
  },
  firstChild: {
    get: function () {
      return this.childNodes[0];
    }
  },
  nextSibling: {
    get: function () {
      var siblings = this.parent.childNodes;

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this) {
          return siblings[i + 1];
        }
      }
    }
  }
});

module.exports = HTMLElement;

function childRenderer (child) {
  return child.render();
}
