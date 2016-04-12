
import { mount, mountBefore, unmount } from './index';

export function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childEl = child.el || child;

    if (traverse === childEl) {
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

    unmount(parentEl, traverse);

    traverse = next;
  }
}
