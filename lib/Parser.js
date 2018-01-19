const { infinite } = require('./helpers');

const Tape = require('./Tape');

/**
 * Class Parser
 */
const Parser = function (rules) {
  this.tape = new Tape(rules);
  this.rules = rules;
};

/**
 * Push one (something) to the tape
 */
Parser.prototype.push = function (element) {
  this.tape.push(element);
};

Parser.prototype.end = function () {
  this.tape.end();
};

/**
 * Attempt to wrap at the index of the tape
 */
Parser.prototype.$wrap = function (index, candidate) {
  const ruleIndex = candidate.index;
  const rule      = this.rules[ruleIndex];
  const state     = candidate.state;
  const tape      = this.tape;

  rule.wrap(tape, index, state);

  return true;
};

/**
 * Wrap with rule
 */
Parser.prototype.wrap = function (index) {
  const candidate = this.tape.match(index);

  if (!candidate) {
    // There should be the error like unexpected token
    return false;
  }

  return candidate.state.match === 'full'
    ? this.$wrap(index, candidate)
    : false;
};

/**
 *
 * @TODO refactor
 */
Parser.prototype.syncAndWrap = function (index) {
  this.tape.sync(index);

  return this.wrap(index);
};

/**
 * Update the tape and wrap all possible rules
 */
Parser.prototype.update = function () {
  infinite(() => {
    const unsynced = this.tape.unsynced();

    return unsynced > -1
      ? this.syncAndWrap(unsynced)
      : false;
  });
};

module.exports = Parser;
