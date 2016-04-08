
import { mount, mountBefore } from './index';

export function setChildren (parent, children) {
  var parentNode = parent.el || parent;
  var traverse = parentNode.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childNode = child.el || child;

    if (childNode === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    if (traverse) {
      mountBefore(parent, child, traverse);
    } else {
      mount(parent, child);
    }
  }

  while (traverse) {
    var next = traverse.nextSibling;

    if (!traverse.removing) {
      parentNode.removeChild(traverse);
    }

    traverse = next;
  }
}
