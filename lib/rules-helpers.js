/* @TODO make it smarter */
const matchGrammar = (pattern) => ({
  full: (tape) =>
    pattern
      .map((token, index) => tape[index] && typeof(tape[index]) === 'object' && tape[index].type === token)
      .reduce((acc, v) => acc && v, true),
  part: (tape) =>
    pattern
      .map((token, index) => (tape[index] && typeof(tape[index]) === 'object' && tape[index].type === token) || tape.length <= index)
      .reduce((acc, v) => acc && v, true),
});

const matchRegexp = (re) => ({
  full: (tape) => tape[0] && typeof(tape[0]) === 'string' && tape[0].match(re),
  part: () => false
});

const matchExact = (pattern) => ({
  full: (tape) => tape[0] && tape[0] === pattern,
  part: () => false,
});

const matchType = (pattern) => ({
  full: (tape) => tape[0] && typeof(tape[0]) === 'object' && tape[0].type === pattern,
  part: () => false,
});

const match = { grammar: matchGrammar, smart: matchSmart, regexp: matchRegexp, exact: matchExact, type: matchType };

const changeRemove = (n) => (tape, matches) => {
  const firstIndex = matches.indexes[0];

  return tape.slice(0, firstIndex).concat(tape.slice(firstIndex + n));
};

const changeReduce = (n, predicate) => (tape, matches) => {
  const firstIndex = matches.indexes[0];

  return tape.slice(0, firstIndex).concat(predicate(tape.slice(firstIndex, firstIndex + n))).concat(tape.slice(firstIndex + n));
};

const changeConstant = (v) => changeReduce(1, () => [v]);

const change = { remove: changeRemove, reduce: changeReduce, constant: changeConstant };

module.exports = { match, change };
