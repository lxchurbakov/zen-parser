const { find, infinite, first, queue } = require('./helpers');

const Element = require('./Element');

/**
 * Class Tape
 *
 * @TODO make the queue length changeable
 */
const Parser = function (rules) {
  this.$elements = [];
  this.$queue    = queue(1, (e) => this.$elements.push(e));
  this.$rules    = rules;
};

/**
 * Add Element class to Parser
 */
Parser.Element = Element;

/**
 * Push one (something) to the sequence
 */
Parser.prototype.push = function (content) {
  this.$queue.push( new Parser.Element(content) );
};

/**
 * Finish the source
 */
Parser.prototype.end = function () {
  this.$queue.push(null);
};

/**
 * Replace a part of tape (useful for rules)
 */
Parser.prototype.replace = function (from, count, newElements) {
  this.$elements = this.$elements.slice(0, from).concat(Array.isArray(newElements) ? newElements : [newElements]).concat(this.$elements.slice(from + count));
};

/**
 * Find first unsynced element
 */
Parser.prototype.unsynced = function () {
  return find(this.$elements, (element) => !element.$synced);
};

/**
 * Sync item at index
 */
Parser.prototype.sync = function (index) {
  const elem = this.$elements[index];
  const prev = index > 0 ? this.$elements[index - 1] : Parser.Element.empty(this.$rules.length);

  elem.sync(prev, this.$rules, this.$queue.get(0));
};

/**
 * Attempt to wrap some grammar at the index of the tape
 */
Parser.prototype.wrap = function (index) {
  const elem = this.$elements[index];

  const matches = elem.matches();

  if (matches.length > 0) {
    const candidate = first(matches);

    if (candidate && candidate.state.match === 'full') {
      const ruleIndex = candidate.index;
      const rule      = this.$rules[ruleIndex];
      const state     = elem.state[ruleIndex];

      rule.wrap(this, index, state);

      return true;
    }
  } else {
    // There should be an error I think

    return false;
  }
};

/**
 * Sync and wrap first unsynced element
 */
Parser.prototype.$updateOnce = function () {
  const unsynced = this.unsynced();

  if (unsynced > -1) {
    this.sync(unsynced);
    return this.wrap(unsynced);
  } else {
    return false;
  }
};

/**
 * Update the tape and wrap all possible rules
 */
Parser.prototype.update = function () {
  infinite(() => this.$updateOnce());
};

module.exports = Parser;
