/**
 * Find first element in array that matches rule
 */
const find = (array, predicate) => {
  for (let i = 0; i < array.length; ++i) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  return -1;
};

/**
 * Generate new array
 */
const generate = (length, predicate) => {
  return (new Array(length)).fill(0).map((_, i) => predicate(i));
};

/**
 * Execute an action in an infinite loop
 */
const infinite = (predicate) => {
  let keep = true;

  do {
    keep = predicate();
  } while (keep);
};

/**
 * Get first element from array
 */
const first = (array) => array[0];

module.exports = { find, generate, infinite, first };
