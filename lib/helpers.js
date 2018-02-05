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

module.exports = { find, compareArrays, array };
