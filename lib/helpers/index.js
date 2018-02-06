const find = (a, predicate) => {
  let result = -1;

  a.forEach((e, i) => {
    if (predicate(e)) {
      result = i;
    }
  })

  return result;
};

const array = (a) =>  Array.isArray(a) ? a : [a];

const forEach = (collection, predicate) => {
  if (collection.forEach) {
    collection.forEach(predicate);
  } else {
    Object.keys(collection).forEach(key => {
      predicate(collection[key], key, collection);
    });
  }
};

const clone = (o) => {
  if (Array.isArray(o)) {
    return o.map(v => clone(v));
  } else if (typeof(o) === 'object') {
    const newO = {};

    forEach(o, (v, k) => {
      newO[k] = clone(v);
    });

    newO.__proto__ = o.__proto__;

    return newO;
  } else {
    return o;
  }
};

const equal = (o1, o2) => {
  if (typeof(o1) !== typeof(o2))
    return false;
  if (Array.isArray(o1)) {
    if (o1.length !== o2.length)
      return false;
    return o1.map((v, i) => equal(v, o2[i])).reduce((a, b) => a && b, true);
  } else if (typeof(o1) === 'object') {
    let eq = true;

    forEach(o1, (v, k) => {
      eq = eq && equal(v, o2[k]);
    });

    forEach(o2, (v, k) => {
      eq = eq && equal(v, o1[k]);
    });

    eq = eq && o1.__proto__ == o2.__proto__;

    return eq
  } else {
    return o1 === o2;
  }
};

const set = (o, f, v) => {
  o[f] = v;
  return o;
};

const last = (a) => a[a.length - 1];

module.exports = { find, array, forEach, clone, equal, set, last };
