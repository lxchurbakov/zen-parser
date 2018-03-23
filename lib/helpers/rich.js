const Maybe = require('./Maybe');

const find = (collection, predicate) => collection.reduce(
  (result, value, index) => predicate(value, index, collection) ? result.replace(value) : result, new Maybe(false)
);

const until = (condition, predicate, def) => {
  let result = def;
  while (condition(result)) result = predicate(result);
  return result;
};

/* Old helpers */

const forEach = (collection, predicate) => {
  if (collection.forEach) {
    return collection.forEach(predicate);
  }

  return Object.keys(collection).forEach(key => predicate(collection[key], key, collection));
};

const clone = (value) => {
  // If array
  if (Array.isArray(value))
    return value.map(_value => clone(_value));

  // if null
  if (value === null)
    return null;

  // if object
  if (typeof(value) === 'object') {
    const newValue = {};

    forEach(value, (_value, key) => {
      newValue[key] = clone(_value);
    });

    // Clone class accessory
    newValue.__proto__ = value.__proto__;

    return newValue;
  }

  // otherwise simple value
  return value;
};

const equal = (value0, value1) => {
  if (typeof(value0) !== typeof(value1))
    return false;


  if (Array.isArray(value0)) {
    if (value0.length !== value1.length)
      return false;

    return value0
      .map((_value, key) => equal(_value, value1[key]))
      .reduce((a, b) => a && b, true);
  }

  // if null
  if (value1 === null)
    return value2 === null;


  if (typeof(value1) === 'object') {
    let eq = true;

    forEach(value0, (_value, key) => {
      eq = eq && equal(_value, value1[key]);
    });

    forEach(value1, (_value, key) => {
      eq = eq && equal(_value, value0[key]);
    });

    // Check class accessory
    eq = eq && value0.__proto__ == value1.__proto__;

    return eq;
  }

  return value0 === value1;
};

Array.prototype.some = function (predicate) {
  return this.reduce((acc, v) => {
    return acc || predicate(v);
  }, false);
};

Array.prototype.all = function (predicate) {
  return this.reduce((acc, v) => {
    return acc && predicate(v);
  }, true);
};

Array.prototype.find = function (predicate) {
  let result = -1;

  this.forEach((v, i) => {
    if (predicate(v, i, this)) {
      result = i;
    }
  });

  return result;
};

Array.prototype.last = function () {
  const length = this.length;
  const lastIndex = length - 1;

  return this[lastIndex];
};


const update = (o, f, p) => {
  o[f] = p(o[f], f, o);
  return o;
};

const groupBy = (a, p) => {
  let result = {};

  a.forEach((v, i) => {
    const k = p(v, i, a);

    result[k] = (result[k] || []).concat([ v ]);
  });

  return result;
};

const uniqBy = (arr, predicate) => {
  let buffer = {};

  arr.forEach((v, i) => {
    const key = JSON.stringify(predicate(v, i ,arr));

    buffer[key] = buffer[key] || v;
  });

  return Object.values(buffer);
};

module.exports = { clone, equal, update, groupBy, find, until, uniqBy };
