const forEach = require('./foreach');

/**
 * Finds an item in the collection and returns it's index
 */
const find = (collection, predicate) => {
  let result = -1;

  forEach(collection, (element, index) => {
    if (predicate(element, index, collection))
      result = index;
  });

  return result;
};

module.exports = find;
