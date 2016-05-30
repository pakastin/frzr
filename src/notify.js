
export function notifyDown (child, eventName, originalChild) {
  var childEl = child.el || child;
  var traverse = childEl.firstChild;

  while (traverse) {
    var next = traverse.nextSibling;
    var view = traverse.view || traverse;
    var event = view[eventName];

    event && event.call(view, originalChild || child);
    notifyDown(traverse, eventName, originalChild || child);

    traverse = next;
  }
}
