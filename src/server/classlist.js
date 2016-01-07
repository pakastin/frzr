export function ClassList (el) {
  var classNames = (this.className && this.className.split(' ')) || [];

  for (var i = 0; i < classNames.length; i++) {
    this.push(classNames[i]);
  }
  this._updateClassName = function () {
    el.className = this.join(' ');
  }
}

ClassList.prototype = [];

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className);
    this._updateClassName();
  }
}

ClassList.prototype.contains = function (className) {
  var found = false;

  for (var i = 0; i < this.length; i++) {
    if (this[i] === className) {
      found = true;
      break;
    }
  }
}

ClassList.prototype.remove = function (className) {
  for (var i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this.splice(i, 1);
      this._updateClassName();
    }
  }
}
