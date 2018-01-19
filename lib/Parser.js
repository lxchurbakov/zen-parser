const Sequence = require('./Sequence');

const Parser = function (rules) {
  let sequence = new Sequence(rules);

  const parser = {
    push: function (v) {
      sequence.push(v);
      sequence.update();
    },
    end: function () {
      sequence.end();
      sequence.update();
    },
    get: function () {
      return sequence.$elements;
    },
  };

  return parser;
};

module.exports = { Parser, Sequence };
