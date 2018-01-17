const getPriority = ({ priority = 0 }) => priority;

Array.prototype.forEachReversed = function (predicate) {
  const array = this;

  for (let i = array.length - 1; i >= 0; --i) {
    predicate(array[i], i, array);
  }
};

const getApplicableRules = (tape, rules) => {
  let result = [];

  rules.forEach(rule => {
    tape[rule.reverse ? 'forEachReversed' : 'forEach']((_, index) => {
      if (rule.match(tape.slice(index)))
        result.push({ index, rule });
    });
  });

  return result;
};

const getMostImportantRule = (applicableRules) =>
  applicableRules
    .sort((a, b) => getPriority(a.rule) - getPriority(b.rule))[0];

const wrapWithRule = (tape, applicableRule) => applicableRule.rule.wrap(tape, applicableRule.index);

/**
 * Apply rules to tape
 */
const parse = (tape, rules) => {
  let mostImportantRule;

  while (mostImportantRule = getMostImportantRule(getApplicableRules(tape, rules)))
    tape = wrapWithRule(tape, mostImportantRule);

  return tape;
};

module.exports = { parse };
