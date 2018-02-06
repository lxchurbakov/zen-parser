/**
 * Applies a predicate to all collection's elements
 */
const forEach = (collection, predicate) => {
  if (collection.forEach) {
    return collection.forEach(predicate);
  }

  return Object.keys(collection).forEach(key => {
    predicate(collection[key], key, collection);
  });
};

module.exports = forEach;
