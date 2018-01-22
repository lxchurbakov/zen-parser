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

/**
 * Queue
 *
 * @TODO refactor
 */
const queue = (delay) => {
  let buffer  = [];
  let content = [];

  return {
    buffer: () => buffer,
    get: () => content,
    set: (_) => {
      content = _;
    },
    end: () => {
      while (buffer.length > 0) {
        content.push(buffer.splice(0, 1)[0]);
      }
    },
    push: (value) => {
      buffer.push(value);
      while (buffer.length > delay) {
        content.push(buffer.splice(0, 1)[0]);
      }
    },
  };
};

const array = (...values) => {
  return values;
};

module.exports = { find, generate, infinite, first, queue, array };
