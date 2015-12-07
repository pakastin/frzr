
export function each (array, iterator) {
  for (let i = 0; i < array.length; i++) {
    iterator(array[i], i);
  }
}

export function shuffle (array) {
  if (!array || !array.length) {
    return array;
  }

  for (let i = array.length - 1; i > 0; i--) {
    const rnd = Math.random() * i | 0;
    const temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}
