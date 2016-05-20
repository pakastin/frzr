
export var notReady = 'api download source'.split(' ').reduce(function (lookup, section) {
  lookup[section] = true;
  return lookup;
}, {});
