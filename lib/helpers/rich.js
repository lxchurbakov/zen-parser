const Maybe = require('./Maybe');

const find = (collection, predicate) => collection.reduce(
  (result, value, index) => predicate(value, index, collection) ? result.replace(value) : result, new Maybe(false)
);

const until = (condition, predicate, def) => {
  let result = def;

  while (condition(result))
    result = predicate(result);

  return result;
};

module.exports = { find, until };
