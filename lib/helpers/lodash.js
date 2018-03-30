const Maybe = require('./Maybe');

/**
 * Find a value in collection
 */
const find = (collection, predicate) => reduce(collection,
  (result, value, index) => predicate(value, index, collection) ? result.replace(value) : result, new Maybe(false)
);

/**
 * Functional version of a while cycle
 */

const until = (condition, predicate, def) => {
  let result = def;
  while (condition(result)) result = predicate(result);
  return result;
};

const keys   = (object) => Object.keys(object);
const values = (object) => Object.values ? Object.values(object) : keys(object).map(key => object[key]);

const isNull      = (value) => value === null;
const isUndefined = (value) => typeof(value) === 'undefined';

const isArray  = (value) => Array.isArray(value);
const isObject = (value) => typeof(value) === 'object' && !isNull(value);

/**
 * Collection type tolerant forEach, reduce, map functions
 */

const forEach = (collection, predicate) =>
  isArray(collection)
    ? collection.forEach(predicate)
    : keys(collection).forEach(key => predicate(collection[key], key, collection));

const reduce = (collection, predicate, def) =>
  isArray(collection)
    ? collection.reduce(predicate, def)
    : keys(collection).reduce((acc, key) => predicate(acc, collection[key], key, collection), def);

const map = (collection, predicate) =>
  isArray(collection)
    ? collection.map(predicate)
    : keys(collection).map(key => predicate(collection[key], key, collection));

/* Partly mapping for objects */

const mapKeys = (collection, predicate) => {
  let result = {};

  forEach(collection, (value, key) => result[predicate(key, collection)] = value);

  return result;
};

const mapValues = (collection, predicate) => {
  let result = {};

  forEach(collection, (value, key) => result[key] = predicate(value, collection));

  return result;
};

/* Update object fields */

const update = (object, name, predicate) => {
  object[name] = predicate(object[name]);
  return object;
};

const set = (object, name, value) => {
  object[name] = value;
  return object;
};

/* Logical functions */

const some = (collection, predicate) =>
  reduce(map(collection, predicate), (result, value) => result || value, false);

const all = (collection, predicate) =>
  reduce(map(collection, predicate), (result, value) => result && value, true);

/* Clone/Equal functions */

const clone = (value) => {
  if (isArray(value))
    return map(value, v => clone(v));

  if (isObject(value)) {
    const newObject = mapValues(value, v => clone(v));

    return set(newObject, '__proto__', value.__proto__);
  }

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

Array.prototype.last = function () {
  const length = this.length;
  const lastIndex = length - 1;

  return this[lastIndex];
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
    const key = JSON.stringify(predicate(v, i, arr));

    buffer[key] = buffer[key] || v;
  });

  return Object.values(buffer);
};

module.exports = { clone, equal, update, groupBy, find, until, uniqBy, some, all };
