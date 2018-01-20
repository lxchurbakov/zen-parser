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
Parser.prototype.$wrap = function (index, ruleIndex, state) {
  const rule      = this.rules[ruleIndex];
  const tape      = this.tape;

  rule.wrap(tape, index, state);

  return true;
};

/**
 * Wrap with rule
 */
Parser.prototype.wrap = function (index) {
  if (!this.tape.found(index)) {
    // There should be the error like unexpected token
    return false;
  }

  const ruleIndex = this.tape.wrappable(index);

  return ruleIndex > -1 ? this.$wrap(index, ruleIndex, this.tape.getState(index, ruleIndex)) : false;
};

/**
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

    return unsynced > -1 ? this.syncAndWrap(unsynced) : false;
  });
};

module.exports = Parser;
