
export function el (tagName, attrs) {
  const _el = document.createElement(tagName);

  for (const key in attrs) {
    if (key === 'text') {
      _el.textContent = attrs[key];
    } else if (key === 'html') {
      _el.innerHTML = attrs[key];
    } else {
      _el.setAttribute(key, attrs[key]);
    }
  }

  return _el;
}
