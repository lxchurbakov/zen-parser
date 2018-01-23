const reduce = (len, predicate) => (tape, index) => {
  const elements = tape.getElements();
  const args = elements.slice(index - len + 1, index + 1).map(e => e.content());

  tape.replace(index - len + 1, len, predicate(args));
};

const remove = (len) => (tape, index) => {
  tape.replace(index - len + 1, len, []);
};

const constant = (len, value) => (tape, index) => {
  tape.replace(index - len + 1, len, value);
};

module.exports = { reduce, remove, constant };
