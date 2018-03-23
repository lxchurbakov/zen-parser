const forEach = require('./foreach');

/**
 * Clones object/array/string/number/boolean deeply
 */
const clone = (value) => {
  // If array
  if (Array.isArray(value))
    return value.map(_value => clone(_value));

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

module.exports = clone;
