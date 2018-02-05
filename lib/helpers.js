const find = (a, predicate) => {
  let result = -1;

  a.forEach((e, i) => {
    if (predicate(e)) {
      result = i;
    }
  })

  return result;
};

const compareArrays = (a1, a2) => {
  if (a1.length !== a2.length) {
    return false;
  } else {
    let result = true;

    a1.forEach((e, i) => {
      if (e !== a2[i])
        result = false;
    });

    return result;
  }
};

const array = (a) => {
  return Array.isArray(a) ? a : [a];
};

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

    return newO;
  } else {
    return o;
  }
};

const set = (o, f, v) => {
  o[f] = v;
  return o;
};

module.exports = { find, compareArrays, array, forEach, clone, set };
