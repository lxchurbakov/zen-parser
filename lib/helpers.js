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

module.exports = { clone, equal };
