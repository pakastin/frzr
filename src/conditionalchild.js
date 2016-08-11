
import { el } from './index';

export function conditionalChild (parent, name, View, data) {
  if (data) {
    var child = parent[name] || (parent[name] = el(View));
    child.update && child.update(data);
    return child;
  } else {
    parent[name] = null;
  }
}
