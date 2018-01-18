const TAG_NAME = 0;
const CLASS_NAME = 1;
const ID = 2;

const HASH = '#'.charAt(0);
const DOT = '.'.charAt(0);

export const parseQuery = (query) => {
  let tagName = '';
  let id = '';
  let classNames = [];

  const found = (what, query, start, end) => {
    const result = query.slice(start, end);

    if (what === ID) {
      id = result;
    } else if (what === CLASS_NAME) {
      classNames.push(result);
    } else {
      tagName = result;
    }
  };

  const search = (what, query, start) => {
    for (let i = start; i < query.length; i++) {
      const char = query.charAt(i);

      if (char === HASH) {
        found(what, query, start, i);
        return search(ID, query, i + 1);
      } else if (char === DOT) {
        found(what, query, start, i);
        return search(CLASS_NAME, query, i + 1);
      }
    }
    found(what, query, start, query.length);
  };

  search(TAG_NAME, query, 0);

  return { tagName, id, classNames };
};
