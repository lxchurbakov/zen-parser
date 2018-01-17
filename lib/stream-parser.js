const { match } = require('./match');

/**
 * Do one step wrapping.
 *
 * Check for matches and, if matches were found, wrap with the corresponding wrapper. Once
 */
const wrap = function (tape, rules) {
  const { index, matches } = match(tape, rules.map(rule => rule.match));

  if (index > -1 && matches.match === 'full') {
    tape = rules[index].wrap(tape, matches);

    return { applied: true, tape };
  } else {
    return { applied: false, tape };
  }
};

/**
 * Do multi step wrapping.
 */
const wrapall = function (tape, rules) {
  let applied;

  do {
    const $ = wrap(tape, rules);

    tape    = $.tape;
    applied = $.applied;

  } while (applied);

  return tape;
};

/**
 * Parser constructor
 */
module.exports = function (rules) {
  let tape = [];

  return {
    /**
     * Push one token
     */
    push: function (token) {
      tape.push(token);

      tape = wrapall(tape, rules);
    },
    /**
     * Push the finish token
     */
    end: function () {
      tape.push({ $end: true });

      tape = wrapall(tape, rules);
    },

    /**
     * Pop all the tape
     */
    popAll: function () {
      return tape;
    },
  };
};
